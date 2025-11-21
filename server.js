require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const OpenAI = require("openai");

// ===== MongoDB 모델 =====
const LearningLog = require("./models/LearningLog");

const app = express();
const ADMIN_KEY = process.env.ADMIN_KEY ? process.env.ADMIN_KEY.trim() : "";

const PORT = process.env.PORT || 3000;
const USERS_FILE = "users.json";
const MONGO_URI = process.env.MONGODB_URI;

// OpenAI 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===== 미들웨어 =====
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// ✅ 세션 미들웨어
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dandan-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2, // 2시간
    },
  })
);

// 학생 로그인 페이지
app.get("/student-login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/student-login.html"));
});


// ✅ 1) 메인(/) = 학생 로그인 페이지
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "student-main.html"));
});

// ✅ 1-2) /login = 로그인 페이지 (쿼리 유지)
app.get("/login", (req, res) => {
  console.log("✅ [GET] /login  -> login.html 보내기 (쿼리 유지)");
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/signup", (req, res) => {
  console.log("✅ [GET] /signup -> 메인으로 이동");
  return res.redirect("/");   // ❗ 쿼리 없이 루트로만 보내기
});

// ✅ 학생 회원가입 처리
// ✅ 학생 회원가입 처리
app.post("/register", async (req, res) => {
  try {
    const { grade, name, phone, academyName } = req.body;

    console.log("📩 [POST] /register 요청:", grade, name, phone, academyName);

    // 1) 필수값 체크
    if (!grade || !name || !phone || !academyName) {
      return res.status(400).send("필수 정보가 부족합니다.");
    }

    const cleanPhone = String(phone).trim();

    // 2) 이미 같은 학생이 있는지(휴지 아님) 확인
    const existing = await User.findOne({
      grade,
      name,
      pw: cleanPhone,        // 🔸 pw 기준으로 동일학생 체크
      deleted: { $ne: true }
    });

    if (existing) {
      console.log("⚠ 이미 가입된 학생입니다:", existing.name);
      // 이미 있는 계정이면 그냥 로그인 페이지로
return res.redirect("/?loginError=pending");
    }

    // 3) 새 학생 생성
    const created = await User.create({
      grade,
      name,
      phone: cleanPhone,
      pw: cleanPhone,        // 🔥 로그인에서 쓰는 비밀번호 필드
      school: academyName,   // 🔹 academyName을 school 필드에 저장
      approved: false,       // 기본값: 승인 전
      deleted: false,
      createdAt: new Date(),
    });

    console.log("✅ [POST] 회원가입 DB 저장 완료:", created.name);

    // 4) 회원가입 후 이동
    //  - 지금 구조에서는 '승인 대기' 안내를 보여주는 게 자연스러우니까
    //    /login 으로 보내면서 pending 팝업 띄우도록 함
return res.redirect("/student-main.html?signup=pending");
    // 또는 메인에서만 쓰고 싶으면:
    // return res.redirect("/?mode=login");
  } catch (err) {
    console.error("❌ /register 처리 중 오류:", err);
    return res.status(500).send("회원가입 처리 중 오류가 발생했습니다.");
  }
});



// ✅ 2) 정적 파일 제공 (CSS, JS, menu.html, admin_*.html 등)
app.use(express.static(path.join(__dirname, "public")));

// users.json 없으면 만들기
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, "[]");
}

/* ============================
 *  MongoDB 스키마 정의
 * ============================ */

// ===== 학생/일반 User 스키마 =====
const userSchema = new mongoose.Schema({
  grade: String,
  name: String,
  phone: String,
  id: String,
  pw: String,
  lastLogin: Date,
  school: String,
  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending", // 기본은 '대기'
  },
  deleted: { type: Boolean, default: false },
  deletedAt: Date,
  // 🔹 지점 삭제(브랜치 휴지)로 인해 같이 휴지로 간 계정인지 표시
  branchDeleted: { type: Boolean, default: false },
  // 🔹 학생에게 부여된 시리즈 목록
  assignedSeries: {
    type: [String],
    default: []
  }
});
const User = mongoose.model("User", userSchema);

// ✅ 브랜치 관리자(학원장) / 슈퍼관리자 스키마
const adminSchema = new mongoose.Schema({
  academyName: { type: String, required: true }, // 학원명/지점명

  // 직책: 자유 입력
  role: {
    type: String,
    default: "원장",
  },

  name:  { type: String, required: true }, // 성함
  birth: { type: String, required: true }, // 예) 900305
  phone: { type: String, required: true }, // 로그인 ID + PW

  // 🔥 슈퍼관리자 여부 (어드민 계정만 true)
  isSuper: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending", // 기본은 승인 상태
  },

  // 🔹 삭제(휴지) 여부
  deleted: { type: Boolean, default: false },
  deletedAt: Date,

  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model("Admin", adminSchema);

/* ====================================
 * ✅ 브랜치 관리자용 미들웨어
 * ==================================== */
function requireAdminLogin(req, res, next) {
  if (!req.session.admin) {
    console.log("⛔ 관리자 세션 없음 → /admin-login 리다이렉트");
    return res.redirect("/admin-login");
  }
  next();
}

/* ====================================
 * ✅ 슈퍼관리자 전용 미들웨어
 * ==================================== */
function requireSuperAdmin(req, res, next) {
  if (!req.session.admin || !req.session.admin.isSuper) {
    console.log("⛔ 슈퍼관리자 권한 없음 → /admin-login 리다이렉트");
    return res.redirect("/admin-login");
  }
  next();
}

/* ====================================
 * ✅ 브랜치/관리자 페이지 라우트
 *   (모두 public 폴더의 HTML과 연결)
 * ==================================== */

// 관리자 로그인 페이지 (GET)
app.get("/admin-login", (req, res) => {
  console.log("✅ [GET] /admin-login -> public/admin_login.html");
  res.sendFile(path.join(__dirname, "public", "admin_login.html"));
});

// ✅ /admin/login 으로 들어오면 기존 /admin-login 으로 보내기 (별칭)
app.get("/admin/login", (req, res) => {
  return res.redirect("/admin-login");
});

// ✅ 슈퍼관리자 대시보드 (GET)
app.get("/super/dashboard", requireSuperAdmin, (req, res) => {
  console.log(
    "✅ [GET] /super/dashboard -> public/super_admin_dashboard.html",
    "admin:",
    req.session.admin && req.session.admin.name
  );
  res.sendFile(path.join(__dirname, "public", "super_admin_dashboard.html"));
});

// ✅ 슈퍼관리자: 전체 학원 학생 목록 보기
app.get("/super/users", requireSuperAdmin, (req, res) => {
  console.log(
    "✅ [GET] /super/users -> /admin/users 로 리다이렉트 (슈퍼관리자 전용)"
  );

  // 🔐 ADMIN_KEY 는 서버에서만 알고 있으니,
  // 여기서 쿼리에 붙여서 기존 /admin/users 화면을 재사용한다.
  res.redirect(`/admin/users?key=${encodeURIComponent(ADMIN_KEY)}`);
});



// ✅ 내 학원 학생 목록 데이터 API (JSON)
app.get("/api/branch/users", requireAdminLogin, async (req, res) => {
  try {
    const admin = req.session.admin;
    if (!admin) {
      return res.status(401).json({ ok: false, message: "관리자 세션 없음" });
    }

    const academyName = admin.academyName;
    const { q, status } = req.query; // 검색어 + 상태 필터(옵션)

    // 기본 필터: 내 학원 + 휴지 아님
    const filter = {
      school: academyName,
      deleted: { $ne: true },
    };

    // 👉 필요하면 특정 상태만 보고 싶을 때 쿼리로 status=approved / pending 넘길 수 있음
    if (status === "approved" || status === "pending") {
      filter.status = status;
    }
    // 아무것도 안 넘기면 승인/대기 둘 다 조회됨

    // 👉 이름/학년/전화번호 검색(프론트에서 q 써서 보내던 거 실제로 반영)
    if (q && q.trim() !== "") {
      const kw = q.trim();
      const regex = new RegExp(kw, "i");
      filter.$or = [
        { name: regex },
        { grade: regex },
        { phone: regex },
        { id: regex },
      ];
    }

    const users = await User.find(filter)
      .sort({ status: 1, grade: 1, name: 1 }) // status 먼저 정렬하면 '대기 → 승인' 순으로 정렬됨
      .lean();

    return res.json({
      ok: true,
      academyName,
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("❌ /api/branch/users 에러:", err);
    res.status(500).json({ ok: false, message: "서버 오류" });
  }
});

// 브랜치 관리자용 학습 이력 데이터 API
app.get("/api/branch/logs", requireAdminLogin, async (req, res) => {
  try {
    const { grade, name } = req.query;

    if (!grade || !name) {
      return res.status(400).json({
        ok: false,
        message: "grade, name 파라미터가 필요합니다."
      });
    }

    const logs = await LearningLog.find({ grade, name })
      .sort({ timestamp: -1 })
      .lean();

    return res.json({
      ok: true,
      count: logs.length,
      logs
    });
  } catch (err) {
    console.error("❌ /api/branch/logs 에러:", err);
    res.status(500).json({ ok: false, message: "서버 오류" });
  }
});

// 관리자 회원가입 페이지 (GET)
app.get("/admin-signup", (req, res) => {
  console.log("✅ [GET] /admin-signup -> public/admin_signup.html");
  res.sendFile(path.join(__dirname, "public", "admin_signup.html"));
});

/// 관리자 회원가입 처리 (POST)
app.post("/admin-signup", async (req, res) => {
  try {
    const { academyName, role, name, birth, phone } = req.body;
    console.log("📥 [POST] /admin-signup:", req.body);

    // 필수값 체크
    if (!academyName || !role || !name || !birth || !phone) {
      return res.status(400).send("필수 정보가 부족합니다.");
    }

    // 간단 중복 체크: 같은 학원명 + 이름 + 전화번호
    const exists = await Admin.findOne({ academyName, name, phone });
    if (exists) {
      console.log("⛔ 이미 존재하는 관리자:", academyName, name, phone);
      return res.redirect("/admin-login");
    }

    // 🔥 어드민(슈퍼관리자) 계정인지 확인
    let isSuper = false;
    let status = ""; // 기본값: 관리자 계정은 일단 승인

    if (
      academyName === "어드민" &&
      name === "어드민" &&
      birth === "830911" &&
      phone === "01012341234"
    ) {
      // 이 조합으로 가입하면 '슈퍼관리자'
      isSuper = true;
      status = "approved"; // 슈퍼관리자는 무조건 승인
    }

    // 관리자 계정 생성
    await Admin.create({
      academyName,
      role,
      name,
      birth,
      phone,
      isSuper, // ✅ 여기서 true/false 저장
      status,
    });

    console.log(
      "✅ 관리자 회원가입 완료:",
      academyName,
      name,
      isSuper ? "(슈퍼관리자)" : ""
    );
    return res.redirect("/admin-login");
  } catch (err) {
    console.error("❌ /admin-signup 에러:", err);
    res.status(500).send("관리자 회원가입 중 오류가 발생했습니다.");
  }
});


// 관리자 회원가입 처리 (POST)
app.post("/admin-signup", async (req, res) => {
  try {
    const { academyName, role, name, birth, phone } = req.body;
    console.log("📥 [POST] /admin-signup:", req.body);

    if (!academyName || !role || !name || !birth || !phone) {
      return res.status(400).send("필수 정보가 부족합니다.");
    }

    // 간단 중복 체크: 같은 학원명 + 이름 + 전화번호
    const exists = await Admin.findOne({ academyName, name, phone });
    if (exists) {
      console.log("⛔ 이미 존재하는 관리자:", academyName, name, phone);
      return res.redirect("/admin-login");
    }

    // 🔥 슈퍼관리자 기준값 체크
    let isSuper = false;
    let status = "approved"; // 지금은 관리자 계정은 기본 승인

    if (
      academyName === "어드민" &&
      name === "어드민" &&
      birth === "830911" &&
      phone === "01012341234"
    ) {
      isSuper = true;
      status = "approved"; // 슈퍼관리자는 무조건 승인
    }

    await Admin.create({
      academyName,
      role,
      name,
      birth,
      phone,
      isSuper,
      status,
    });

    console.log(
      "✅ 관리자 회원가입 완료:",
      academyName,
      name,
      isSuper ? "(슈퍼관리자)" : ""
    );
    return res.redirect("/admin-login");
  } catch (err) {
    console.error("❌ /admin-signup 에러:", err);
    res.status(500).send("관리자 회원가입 중 오류가 발생했습니다.");
  }
});

// 관리자 로그인 처리 (POST)
app.post("/admin-login", async (req, res) => {
  try {
    const { academyName, name, birth, phone } = req.body;
    console.log("📥 [POST] /admin-login:", req.body);

    // DB에서 관리자 찾기
    const admin = await Admin.findOne({
      academyName,
      name,
      birth,
      phone,
    });

    if (!admin) {
      console.log("❌ 관리자 로그인 실패: 일치하는 계정 없음");
      return res.redirect("/admin-login");
    }

    // 🔥 이 로그인 시도가 '슈퍼관리자'인지 여부를 직접 계산
    const isSuperLogin =
      academyName === "어드민" &&
      name === "어드민" &&
      birth === "830911" &&
      phone === "01012341234";

    // 🔒 슈퍼관리자가 아닌데 승인 대기면 로그인 막기
    if (!isSuperLogin && admin.status === "pending") {
      console.log("⛔ 승인 대기 관리자 로그인 시도:", admin.name);
      return res.redirect("/admin-login");
    }

    // 마지막 로그인 시간 업데이트
    admin.lastLogin = new Date();
    await admin.save();

    // 세션에 관리자 정보 저장 (isSuper 여부 포함)
    req.session.admin = {
      id: admin._id.toString(),
      academyName: admin.academyName,
      name: admin.name,
      role: admin.role,
      isSuper: isSuperLogin,   // ✅ 여기!
    };

    console.log(
      "✅ 관리자 로그인 성공:",
      admin.academyName,
      admin.name,
      isSuperLogin ? "(슈퍼관리자)" : ""
    );

    // 🔀 분기: 슈퍼관리자 / 일반 브랜치 관리자
    if (isSuperLogin) {
      return res.redirect("/super/dashboard");
    } else {
      return res.redirect("/admin/dashboard");
    }
  } catch (err) {
    console.error("❌ /admin-login 에러:", err);
    res.status(500).send("관리자 로그인 중 오류가 발생했습니다.");
  }
});




// 관리자 대시보드 (GET)
app.get("/admin/dashboard", requireAdminLogin, (req, res) => {
  console.log(
    "✅ [GET] /admin/dashboard -> public/admin_dashboard.html",
    "admin:",
    req.session.admin && req.session.admin.academyName
  );
  res.sendFile(path.join(__dirname, "public", "admin_dashboard.html"));
});

/* ====================================
 * ✅ 슈퍼관리자: 관리자 계정 목록 / 상태 변경 / 삭제
 * ==================================== */

// 🔹 관리자 계정 목록 페이지
// 🔹 관리자 계정 목록 페이지
app.get("/super/admins", requireSuperAdmin, async (req, res) => {
  try {
    // 삭제 안 된 관리자만
    const admins = await Admin.find({ deleted: { $ne: true } })
      .sort({ academyName: 1, name: 1 })
      .lean();

    let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>관리자 계정 목록</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        :root {
          --bg: #f2ede5;
          --panel: #fffaf3;
          --accent: #8b2f2f;
          --line: #e5d4c1;
          --text: #3b2a1a;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 24px 16px 40px;
          background: var(--bg);
font-family: "Gmarket Sans", "Noto Sans KR", sans-serif;
          color: var(--text);
        }
        .wrap { max-width: 1120px; margin: 0 auto; }
        h1 {
          margin: 4px 0 6px;
          font-size: 26px;
          font-weight: 700;
        }
        .desc {
          margin: 0 0 18px;
          font-size: 14px;
          color: #7a6a5b;
        }
        .top-bar {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:8px;
          flex-wrap:wrap;
          margin-bottom:12px;
        }
        .btn-back {
          display:inline-flex;
          align-items:center;
          gap:4px;
          padding:6px 12px;
          font-size:13px;
          border-radius:999px;
          border:1px solid #c59f7b;
          background:#fdf7ef;
          color:#5a3b23;
          text-decoration:none;
        }
        .btn-back:hover { background:#f9f0e3; }

        .info-line {
          font-size: 13px;
          color: #7a6a5b;
          margin: 4px 0 10px;
        }

        .table-wrap {
          background: var(--panel);
          border-radius: 12px;
          padding: 14px 14px 18px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.04);
          overflow-x: auto;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          min-width: 820px;
          font-size: 14px;
        }
        th, td {
          border-bottom: 1px solid #e5d4c1;
          padding: 8px 10px;
          text-align: left;
          white-space: nowrap;
          font-weight: 700;
          color: #000;
          font-size: 15px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        th {
          background: #f7efe2;
          font-weight: 600;
        }
        tr:nth-child(even) td { background:#fdf7ef; }
        tr:hover td { background:#f3ebde; }

        .badge {
          display:inline-block;
          padding:2px 7px;
          border-radius:999px;
          font-size:11px;
        }
        .badge-approved { background:#e3f2fd; color:#1565c0; }
        .badge-pending  { background:#fff3e0; color:#ef6c00; }
        .badge-super    { background:#ede7f6; color:#5e35b1; }

        a.link {
          font-size: 12px;
          color: #1565c0;
          text-decoration: none;
        }
        a.link:hover { text-decoration: underline; }
        a.link-danger {
          font-size: 12px;
          color: #b00020;
          text-decoration: none;
        }
        a.link-danger:hover { text-decoration: underline; }

        @media (max-width: 720px) {
          h1 { font-size:22px; }
          .table-wrap { padding:10px; }
        }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="top-bar">
          <div>
            <h1>관리자(원장/선생님) 계정 목록</h1>
            <p class="desc">
              브랜치 관리자와 슈퍼관리자 계정을 한눈에 확인하고,<br/>
              승인 상태 변경 및 삭제(휴지 처리)를 할 수 있습니다.
            </p>
          </div>
          <a href="/super/dashboard" class="btn-back">← 대시보드로 돌아가기</a>
        </div>

        <p class="info-line">
          총 <strong>${admins.length}</strong>개의 관리자 계정이 있습니다.
        </p>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>학원/지점명</th>
                <th>이름</th>
                <th>직책</th>
                <th>전화번호(ID)</th>
                <th>권한</th>
                <th>상태</th>
                <th>가입일</th>
                <th>마지막 로그인</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
    `;

    admins.forEach((a, idx) => {
      const status = a.status || "approved";
      const statusLabel = status === "approved" ? "승인" : "대기";
      const statusClass =
        status === "approved" ? "badge-approved" : "badge-pending";

      const createdAt = a.createdAt
        ? new Date(a.createdAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
        : "-";
      const lastLogin = a.lastLogin
        ? new Date(a.lastLogin).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
        : "-";

      // 상태 버튼 (대기 → 승인 / 승인 → 대기)
let statusToggleLink = "";

if (status === "pending") {
  // 대기 상태 → 승인 버튼만 표시
  statusToggleLink = `
    <a class="link"
       href="/super/admin-status?id=${a._id}&status=approved"
       onclick="return confirm('이 관리자를 승인 상태로 변경할까요?');">
       승인하기
    </a>
  `;
} else {
  // 승인 상태 → 대기로 전환
  statusToggleLink = `
    <a class="link"
       href="/super/admin-status?id=${a._id}&status=pending"
       onclick="return confirm('이 관리자 상태를 대기로 변경할까요?');">
       대기 전환
    </a>
  `;
}

               // 🔹 관리자 정보 수정 화면
app.get("/super/admin-edit", requireSuperAdmin, async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).send("id 파라미터가 필요합니다.");

  try {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).send("관리자 계정을 찾을 수 없습니다.");

    const isSuper = admin.isSuper;

    const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>관리자 정보 수정</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        body {
font-family: "Gmarket Sans", "Noto Sans KR", sans-serif;
          padding: 20px;
          background:#f2ede5;
        }
        .card {
          max-width: 520px;
          margin: 0 auto;
          background:#fffaf3;
          border-radius: 12px;
          padding: 20px 22px 24px;
          box-shadow:0 10px 24px rgba(0,0,0,0.08);
          border:1px solid rgba(0,0,0,0.04);
        }
        h1 {
          margin: 0 0 12px;
          font-size: 22px;
        }
        .small { font-size:12px; color:#7a6a5b; margin-bottom:16px; }
        label {
          display:block;
          margin:8px 0 4px;
          font-size:13px;
        }
        input[type="text"] {
          width:100%;
          padding:7px 10px;
          font-size:14px;
          border-radius:8px;
          border:1px solid #d3c2af;
        }
        select {
          width:100%;
          padding:7px 10px;
          font-size:14px;
          border-radius:8px;
          border:1px solid #d3c2af;
          background:#fff;
        }
        .row { margin-bottom:8px; }
        .actions {
          margin-top:16px;
          display:flex;
          gap:8px;
        }
        button {
          padding:8px 16px;
          font-size:14px;
          border-radius:999px;
          border:1px solid #8b2f2f;
          background:#8b2f2f;
          color:#fff;
          cursor:pointer;
        }
        button:hover { opacity:.93; }
        a.back {
          padding:8px 14px;
          font-size:13px;
          border-radius:999px;
          border:1px solid #c59f7b;
          background:#fdf7ef;
          color:#5a3b23;
          text-decoration:none;
          display:inline-flex;
          align-items:center;
        }
        .badge-super {
          display:inline-block;
          margin-left:6px;
          padding:2px 7px;
          border-radius:999px;
          font-size:11px;
          background:#ede7f6;
          color:#5e35b1;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>관리자 정보 수정 ${isSuper ? '<span class="badge-super">슈퍼관리자</span>' : ''}</h1>
        <p class="small">
          관리자 기본 정보를 수정합니다.${isSuper ? "<br>※ 슈퍼관리자 계정은 안전을 위해 서버 코드에서만 수정하는 것을 권장합니다." : ""}
        </p>

        <form method="POST" action="/super/admin-edit">
          <input type="hidden" name="id" value="${admin._id.toString()}" />

          <div class="row">
            <label>학원/지점명</label>
            <input type="text" name="academyName" value="${admin.academyName || ""}" />
          </div>

          <div class="row">
            <label>직책</label>
            <input type="text" name="role" value="${admin.role || ""}" />
          </div>

          <div class="row">
            <label>이름</label>
            <input type="text" name="name" value="${admin.name || ""}" />
          </div>

          <div class="row">
            <label>생년월일 (예: 900305)</label>
            <input type="text" name="birth" value="${admin.birth || ""}" />
          </div>

          <div class="row">
            <label>전화번호 (로그인 ID / 비밀번호)</label>
            <input type="text" name="phone" value="${admin.phone || ""}" />
          </div>

          <div class="row">
            <label>상태</label>
            <select name="status">
              <option value="approved" ${admin.status === "approved" ? "selected" : ""}>승인</option>
              <option value="pending" ${admin.status === "pending" ? "selected" : ""}>대기</option>
            </select>
          </div>

          <div class="actions">
            <button type="submit">저장하기</button>
            <a class="back" href="/super/admins">← 목록으로</a>
          </div>
        </form>
      </div>
    </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("❌ /super/admin-edit(GET) 에러:", err);
    res.status(500).send("관리자 수정 화면 생성 중 오류");
  }
});

// 🔹 관리자 정보 수정 처리
app.post("/super/admin-edit", requireSuperAdmin, async (req, res) => {
  const { id, academyName, role, name, birth, phone, status } = req.body;

  if (!id) return res.status(400).send("id 값이 없습니다.");

  try {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).send("관리자 계정을 찾을 수 없습니다.");

    // 슈퍼관리자 계정은 삭제/수정 최소화 – 필요하면 여기 조건 바꿔도 됨
    if (admin.isSuper) {
      return res.status(400).send("슈퍼관리자 계정은 여기서 수정할 수 없습니다.");
    }

    admin.academyName = academyName || "";
    admin.role        = role || "";
    admin.name        = name || "";
    admin.birth       = birth || "";
    admin.phone       = phone || "";
    if (status === "approved" || status === "pending") {
      admin.status = status;
    }

    await admin.save();
    console.log("✅ 관리자 정보 수정 완료:", admin.academyName, admin.name);

    res.redirect("/super/admins");
  } catch (err) {
    console.error("❌ /super/admin-edit(POST) 에러:", err);
    res.status(500).send("관리자 정보 수정 중 오류");
  }
});


      // 슈퍼관리자는 삭제 막기
      const deleteCell = a.isSuper
        ? `<span style="font-size:12px; color:#999;">삭제 불가</span>`
        : `<a class="link-danger"
               href="/super/admin-delete?id=${a._id}"
               onclick="return confirm('이 관리자 계정을 삭제(휴지)할까요?\\n[${a.academyName} / ${a.name}]');">
              삭제
           </a>`;

      html += `
        <tr>
          <td>${idx + 1}</td>
          <td>${a.academyName || ""}</td>
          <td>${a.name || ""}</td>
          <td>${a.role || ""}</td>
          <td>${a.phone || ""}</td>
          <td>
            ${a.isSuper ? '<span class="badge badge-super">슈퍼관리자</span>' : '브랜치 관리자'}
          </td>
          <td>
            <span class="badge ${statusClass}">${statusLabel}</span>
            ${statusToggleLink}
          </td>
          <td>${createdAt}</td>
          <td>${lastLogin}</td>
          <td>
            <a class="link" href="/super/admin-edit?id=${a._id}">수정</a>
          </td>
          <td>${deleteCell}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("❌ /super/admins 에러:", err);
    res.status(500).send("관리자 목록 조회 중 오류가 발생했습니다.");
  }
});


// 🔹 관리자 상태 변경 (승인 / 대기)
app.get("/super/admin-status", requireSuperAdmin, async (req, res) => {
  const { id, status } = req.query;
  const allowed = ["approved", "pending"];

  if (!id) return res.status(400).send("id 파라미터가 필요합니다.");
  if (!allowed.includes(status)) {
    return res.status(400).send("유효하지 않은 status 값입니다.");
  }

  try {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).send("관리자를 찾을 수 없습니다.");

    admin.status = status;
    await admin.save();

    console.log("✅ 관리자 상태 변경:", admin.name, "=>", status);
    res.redirect("/super/admins");
  } catch (err) {
    console.error("❌ /super/admin-status 에러:", err);
    res.status(500).send("관리자 상태 변경 중 오류");
  }
});

// 🔹 관리자 삭제(휴지 처리)
app.get("/super/admin-delete", requireSuperAdmin, async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).send("id 파라미터가 필요합니다.");

  try {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).send("관리자를 찾을 수 없습니다.");

    if (admin.isSuper) {
      return res.status(400).send("슈퍼관리자 계정은 삭제할 수 없습니다.");
    }

    admin.deleted = true;
    admin.deletedAt = new Date();
    await admin.save();

    console.log("🗑 관리자 삭제(휴지):", admin.academyName, admin.name);
    res.redirect("/super/admins");
  } catch (err) {
    console.error("❌ /super/admin-delete 에러:", err);
    res.status(500).send("관리자 삭제 중 오류");
  }
});



/* ====================================
 * ✅ 슈퍼관리자: 학원/지점 목록 / 지점별 학생
 * ==================================== */

// 🔹 학원/지점 목록 페이지
app.get("/super/branches", requireSuperAdmin, async (req, res) => {
  try {
    // 1) 전체 학생 / 관리자 불러오기
    const users = await User.find({ deleted: { $ne: true } }).lean();
    const admins = await Admin.find({ deleted: { $ne: true } }).lean();

    // 2) 학원/지점별로 묶기
    const branchMap = {};

    // 관리자 기준(학원명)
    admins.forEach((a) => {
      const name = a.academyName || "학원명 미입력";
      if (!branchMap[name]) {
        branchMap[name] = {
          academyName: name,
          adminCount: 0,
          studentCount: 0,
          approvedCount: 0,
          pendingCount: 0,
        };
      }
      branchMap[name].adminCount += 1;
    });

    // 학생 기준(학교/학원명)
    users.forEach((u) => {
      const name = u.school || "학원명 미입력";
      if (!branchMap[name]) {
        branchMap[name] = {
          academyName: name,
          adminCount: 0,
          studentCount: 0,
          approvedCount: 0,
          pendingCount: 0,
        };
      }
      branchMap[name].studentCount += 1;
      if (u.status === "approved") {
        branchMap[name].approvedCount += 1;
      } else {
        branchMap[name].pendingCount += 1;
      }
    });

    const branches = Object.values(branchMap).sort((a, b) =>
      a.academyName.localeCompare(b.academyName, "ko")
    );

    // 🔑 슈퍼관리자용 링크에 쓸 key는 서버에서 직접 넣어줌
    const key = ADMIN_KEY;

    // 3) 화면 렌더
    let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>학원/지점 목록</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        :root {
          --bg: #f2ede5;
          --panel: #fffaf3;
          --accent: #8b2f2f;
          --line: #e5d4c1;
          --text: #3b2a1a;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 24px 16px 40px;
          background: var(--bg);
font-family: "Gmarket Sans", "Noto Sans KR", sans-serif;
          color: var(--text);
        }
        .wrap { max-width: 1120px; margin: 0 auto; }
        h1 { margin: 4px 0 6px; font-size: 26px; font-weight: 700; }
        .desc { margin: 0 0 18px; font-size: 14px; color: #7a6a5b; }
        .top-bar {
          display:flex; justify-content:space-between; align-items:center;
          flex-wrap:wrap; gap:8px;
        }
        .btn-back {
          display:inline-flex; align-items:center; gap:4px;
          padding:6px 12px; font-size:13px;
          border-radius:999px;
          border:1px solid #c59f7b;
          background:#fdf7ef; color:#5a3b23;
          text-decoration:none;
        }
        .btn-back:hover { background:#f9f0e3; }

        .table-wrap {
          margin-top:12px;
          background:var(--panel);
          border-radius:12px;
          padding:14px 14px 18px;
          box-shadow:0 6px 18px rgba(0,0,0,0.06);
          border:1px solid rgba(0,0,0,0.04);
          overflow-x:auto;
        }
        table {
          border-collapse:collapse;
          width:100%;
          min-width:720px;
          font-size:14px;
        }
        th, td {
          border-bottom:1px solid #e5d4c1;
          padding:8px 10px;
          text-align:left;
          white-space:nowrap;
        }
        th {
          background:#f7efe2;
          font-weight:600;
        }
        tr:nth-child(even) td { background:#fdf7ef; }
        tr:hover td { background:#f3ebde; }

        .small { font-size:12px; color:#8a7b6f; }

        .btn-primary {
          display:inline-flex;
          padding:6px 10px;
          font-size:12px;
          border-radius:999px;
          border:1px solid var(--accent);
          background:var(--accent);
          color:#fff;
          text-decoration:none;
        }
                  .btn-trash {
          display:inline-flex;
          align-items:center;
          gap:4px;
          padding:6px 12px;
          font-size:13px;
          border-radius:999px;
          border:1px solid #e4a3a3;
          background:#fff5f5;
          color:#b00020;
          text-decoration:none;
          margin-left:6px;
        }
        .btn-trash:hover { background:#ffecec; }

        .btn-branch-del {
          display:inline-flex;
          padding:6px 10px;
          font-size:12px;
          border-radius:999px;
          border:1px solid #e4a3a3;
          background:#fff5f5;
          color:#b00020;
          text-decoration:none;
          margin-left:6px;
        }
        .btn-branch-del:hover { background:#ffecec; }

        .btn-primary:hover { opacity:.93; }

        @media (max-width:720px){
          h1 { font-size:22px; }
          .table-wrap { padding:10px; }
        }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="top-bar">
          <div>
            <h1>학원 / 지점 목록</h1>
            <p class="desc">
              등록된 학원/지점별로 관리자 수와 학생 수를 한눈에 확인합니다.<br/>
              지점을 클릭하면 해당 학원에 소속된 학생 목록만 따로 볼 수 있습니다.
            </p>
          </div>
          <div>
            <a href="/super/branch-trash" class="btn-trash">🗑 지점 휴지통</a>
            <a href="/super/dashboard" class="btn-back">← 대시보드로 돌아가기</a>
          </div>
        </div>

        <p class="small">총 <strong>${branches.length}</strong>개의 학원/지점이 있습니다.</p>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>학원/지점명</th>
                <th>관리자 수</th>
                <th>학생 수</th>
                <th>승인 학생</th>
                <th>대기 학생</th>
                <th>학생 목록</th>
              </tr>
            </thead>
            <tbody>
    `;

     // 🔹 각 지점 한 줄씩 출력
    branches.forEach((b, idx) => {
      html += `
        <tr>
          <td>${idx + 1}</td>
          <td>${b.academyName}</td>
          <td>${b.adminCount}</td>
          <td>${b.studentCount}</td>
          <td>${b.approvedCount}</td>
          <td>${b.pendingCount}</td>
          <td>
            <a class="btn-primary"
               href="/super/branch-users?academyName=${encodeURIComponent(
                 b.academyName
               )}">
              학생 목록 보기
            </a>
            <a class="btn-branch-del"
               href="/super/branch-delete?academyName=${encodeURIComponent(
                 b.academyName
               )}"
               onclick="return confirm('이 지점의 관리자와 학생을 모두 휴지 상태로 보낼까요?\\n[${b.academyName}]');">
              지점 삭제
            </a>
          </td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("❌ /super/branches 에러:", err);
    res.status(500).send("지점 목록 조회 중 오류가 발생했습니다.");
  }
});

// 🔹 지점 삭제 (브랜치 전체를 휴지 상태로 보내기)
// 🔹 지점 삭제 (브랜치 전체를 휴지 상태로 보내기)
app.get("/super/branch-delete", requireSuperAdmin, async (req, res) => {
  const { academyName } = req.query;
  if (!academyName) {
    return res.status(400).send("academyName 파라미터가 필요합니다.");
  }

  const name = String(academyName).trim();
  const now = new Date();

  try {
    // 1) 해당 지점 관리자 모두 휴지 상태로 (지점삭제 플래그까지)
    const adminResult = await Admin.updateMany(
      { academyName: name, deleted: { $ne: true } },
      {
        $set: {
          deleted: true,
          deletedAt: now,
          branchDeleted: true   // ✅ 지점 삭제로 휴지 간 것 표시
        }
      }
    );

    // 2) 해당 지점 학생 모두 휴지 상태로 (지점삭제 플래그까지)
    const userResult = await User.updateMany(
      { school: name, deleted: { $ne: true } },
      {
        $set: {
          deleted: true,
          deletedAt: now,
          branchDeleted: true   // ✅ 지점 삭제로 휴지 간 것 표시
        }
      }
    );

    console.log(
      "🗑 지점 삭제:",
      name,
      "관리자", adminResult.modifiedCount,
      "명, 학생", userResult.modifiedCount, "명 휴지 상태로 이동"
    );

    res.redirect("/super/branches");
  } catch (err) {
    console.error("❌ /super/branch-delete 에러:", err);
    res.status(500).send("지점 삭제 중 오류가 발생했습니다.");
  }
});


// 🔹 지점 휴지통 목록
app.get("/super/branch-trash", requireSuperAdmin, async (req, res) => {
  try {
    // 🔥 지점 삭제로 인해 휴지 간 admin/user만 가져오기
    const admins = await Admin.find({
      deleted: true,
      branchDeleted: true     // ← ★ 핵심 필터!
    }).lean();

    const users = await User.find({
      deleted: true,
      branchDeleted: true     // ← ★ 핵심 필터!
    }).lean();

    const branchMap = {};

    function ensureEntry(name) {
      if (!branchMap[name]) {
        branchMap[name] = {
          academyName: name,
          adminCount: 0,
          studentCount: 0,
          lastDeleted: null,
        };
      }
      return branchMap[name];
    }

    admins.forEach((a) => {
      const name = a.academyName || "학원명 미입력";
      const entry = ensureEntry(name);
      entry.adminCount += 1;
      const d = a.deletedAt || a.createdAt;
      if (!entry.lastDeleted || (d && d > entry.lastDeleted)) {
        entry.lastDeleted = d;
      }
    });

    users.forEach((u) => {
      const name = u.school || "학원명 미입력";
      const entry = ensureEntry(name);
      entry.studentCount += 1;
      const d = u.deletedAt;
      if (!entry.lastDeleted || (d && d > entry.lastDeleted)) {
        entry.lastDeleted = d;
      }
    });

    const branches = Object.values(branchMap).sort((a, b) =>
      a.academyName.localeCompare(b.academyName, "ko")
    );

    let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>지점 휴지통</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        :root {
          --bg: #f2ede5;
          --panel: #fffaf3;
          --accent: #8b2f2f;
          --line: #e5d4c1;
          --text: #3b2a1a;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 24px 16px 40px;
          background: var(--bg);
font-family: "Gmarket Sans", "Noto Sans KR", sans-serif;
          color: var(--text);
        }
        .wrap { max-width: 1120px; margin: 0 auto; }
        h1 { margin: 4px 0 6px; font-size: 26px; font-weight: 700; }
        .desc { margin: 0 0 18px; font-size: 14px; color: #7a6a5b; }
        .top-bar {
          display:flex; justify-content:space-between; align-items:center;
          flex-wrap:wrap; gap:8px;
        }
        .btn-back {
          display:inline-flex; align-items:center; gap:4px;
          padding:6px 12px; font-size:13px;
          border-radius:999px;
          border:1px solid #c59f7b;
          background:#fdf7ef; color:#5a3b23;
          text-decoration:none;
        }
        .btn-back:hover { background:#f9f0e3; }
        .table-wrap {
          margin-top:12px;
          background:var(--panel);
          border-radius:12px;
          padding:14px 14px 18px;
          box-shadow:0 6px 18px rgba(0,0,0,0.06);
          border:1px solid rgba(0,0,0,0.04);
          overflow-x:auto;
        }
        table {
          border-collapse:collapse;
          width:100%;
          min-width:720px;
          font-size:14px;
        }
        th, td {
          border-bottom:1px solid #e5d4c1;
          padding:8px 10px;
          text-align:left;
          white-space:nowrap;
        }
        th { background:#f7efe2; font-weight:600; }
        tr:nth-child(even) td { background:#fdf7ef; }
        tr:hover td { background:#f3ebde; }
        .small { font-size:12px; color:#8a7b6f; }
        .btn-restore, .btn-delete {
          display:inline-flex;
          padding:5px 9px;
          font-size:12px;
          border-radius:999px;
          border:1px solid;
          text-decoration:none;
          margin-right:4px;
        }
        .btn-restore {
          border-color:#1565c0;
          color:#1565c0;
          background:#e3f2fd;
        }
        .btn-restore:hover { background:#d0e7fb; }
        .btn-delete {
          border-color:#b00020;
          color:#b00020;
          background:#fff5f5;
        }
        .btn-delete:hover { background:#ffecec; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="top-bar">
          <div>
            <h1>지점 휴지통</h1>
            <p class="desc">
              삭제된 학원/지점의 관리자와 학생 계정이 묶여서 표시됩니다.<br/>
              필요하면 전체 복구 또는 완전 삭제를 할 수 있습니다.
            </p>
          </div>
          <a href="/super/branches" class="btn-back">← 지점 목록으로 돌아가기</a>
        </div>

        <p class="small">총 <strong>${branches.length}</strong>개의 지점이 휴지 상태입니다.</p>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>학원/지점명</th>
                <th>휴지 관리자 수</th>
                <th>휴지 학생 수</th>
                <th>마지막 휴지 시각</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
    `;

    branches.forEach((b, idx) => {
      const ts = b.lastDeleted
        ? new Date(b.lastDeleted).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
        : "-";

      html += `
        <tr>
          <td>${idx + 1}</td>
          <td>${b.academyName}</td>
          <td>${b.adminCount}</td>
          <td>${b.studentCount}</td>
          <td>${ts}</td>
          <td>
            <a class="btn-restore"
               href="/super/branch-trash-restore?academyName=${encodeURIComponent(
                 b.academyName
               )}"
               onclick="return confirm('이 지점을 복구할까요?\\n[${b.academyName}]');">
              복구
            </a>
            <a class="btn-delete"
               href="/super/branch-trash-delete?academyName=${encodeURIComponent(
                 b.academyName
               )}"
               onclick="return confirm('이 지점의 휴지 데이터를 완전 삭제할까요?\\n관리자/학생 계정을 모두 DB에서 제거합니다.\\n[${b.academyName}]');">
              완전 삭제
            </a>
          </td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("❌ /super/branch-trash 에러:", err);
    res.status(500).send("지점 휴지통 조회 중 오류가 발생했습니다.");
  }
});

// 🔹 지점 복구 (관리자 + 학생 모두 deleted=false)
app.get("/super/branch-trash-restore", requireSuperAdmin, async (req, res) => {
  const { academyName } = req.query;
  if (!academyName) {
    return res.status(400).send("academyName 파라미터가 필요합니다.");
  }

  const name = String(academyName).trim();

  try {
    const adminResult = await Admin.updateMany(
      { academyName: name, deleted: true },
      { $set: { deleted: false, deletedAt: null } }
    );

    const userResult = await User.updateMany(
      { school: name, deleted: true },
      { $set: { deleted: false, deletedAt: null } }
    );

    console.log(
      "✅ 지점 복구:",
      name,
      "관리자", adminResult.modifiedCount,
      "명, 학생", userResult.modifiedCount, "명 복구"
    );

    res.redirect("/super/branch-trash");
  } catch (err) {
    console.error("❌ /super/branch-trash-restore 에러:", err);
    res.status(500).send("지점 복구 중 오류가 발생했습니다.");
  }
});

// 🔹 지점 완전 삭제 (deleted=true 상태인 관리자/학생을 DB에서 제거)
app.get("/super/branch-trash-delete", requireSuperAdmin, async (req, res) => {
  const { academyName } = req.query;
  if (!academyName) {
    return res.status(400).send("academyName 파라미터가 필요합니다.");
  }

  const name = String(academyName).trim();

  try {
    const adminResult = await Admin.deleteMany({
      academyName: name,
      deleted: true,
    });

    const userResult = await User.deleteMany({
      school: name,
      deleted: true,
    });

    console.log(
      "🗑 지점 완전 삭제:",
      name,
      "관리자", adminResult.deletedCount,
      "명, 학생", userResult.deletedCount, "명 삭제"
    );

    res.redirect("/super/branch-trash");
  } catch (err) {
    console.error("❌ /super/branch-trash-delete 에러:", err);
    res.status(500).send("지점 완전 삭제 중 오류가 발생했습니다.");
  }
});


// 🔹 특정 학원/지점 학생 목록 (슈퍼관리자 모드에서 보기)
app.get("/super/branch-users", requireSuperAdmin, async (req, res) => {
  const { academyName } = req.query;
  if (!academyName) {
    return res.status(400).send("academyName 파라미터가 필요합니다.");
  }

  try {
    const users = await User.find({
      deleted: { $ne: true },
      school: academyName,
    })
      .sort({ grade: 1, name: 1 })
      .lean();

    const key = ADMIN_KEY; // 🔑 여기서도 서버가 직접 넣어줌

    // ↓↓↓ 나머지 HTML 생성 부분은 네가 가지고 있는 코드 그대로 두고,
    //     위에서 key를 req.query가 아니라 ADMIN_KEY로만 쓰면 돼.
    // (학습 이력 보기 / 상태변경 / 휴지통 링크에 쓰는 key 값용)
    // ─────────────────────────────────
    // 지금 너 코드의 <html> ~ res.send(html) 까지 그대로 사용
    // 단, 맨 윗부분에서 const { key, academyName } 대신
    //  - const { academyName }만 남기고
    //  - const key = ADMIN_KEY; 추가했지.
    // ─────────────────────────────────
    // 그 부분만 반영해서 붙여 넣으면 돼.


    let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>${academyName} 학생 목록</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        :root {
          --bg: #f2ede5;
          --panel: #fffaf3;
          --accent: #8b2f2f;
          --line: #e5d4c1;
          --text: #3b2a1a;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 24px 16px 40px;
          background: var(--bg);
font-family: "Gmarket Sans", "Noto Sans KR", sans-serif;
          color: var(--text);
        }
        .wrap { max-width: 1120px; margin: 0 auto; }
        h1 { margin: 4px 0 6px; font-size: 24px; font-weight: 700; }
        .desc { margin: 0 0 18px; font-size: 14px; color: #7a6a5b; }
        .top-bar {
          display:flex; justify-content:space-between; align-items:center;
          flex-wrap:wrap; gap:8px;
        }
        .btn-back {
          display:inline-flex; align-items:center; gap:4px;
          padding:6px 12px; font-size:13px;
          border-radius:999px;
          border:1px solid #c59f7b;
          background:#fdf7ef; color:#5a3b23;
          text-decoration:none;
        }
        .btn-back:hover { background:#f9f0e3; }

        .toolbar {
          margin: 6px 0 10px;
          display:flex; flex-wrap:wrap; gap:8px; justify-content:flex-end; align-items:center;
        }
        .search-input {
          padding:7px 10px;
          font-size:14px;
          border-radius:999px;
          border:1px solid #d3c2af;
          min-width:220px;
        }
        .btn {
          padding:7px 12px;
          font-size:13px;
          border-radius:999px;
          border:1px solid transparent;
          cursor:pointer;
        }
        .btn-ghost {
          background:#fff;
          color:#5a4332;
          border-color:#d3c2af;
        }
        .btn-danger {
          background:#fff5f5;
          color:#b00020;
          border-color:#e4a3a3;
        }

        .info-line { font-size:13px; color:#7a6a5b; margin:4px 0 10px; }

        .table-wrap {
          background:var(--panel);
          border-radius:12px;
          padding:14px 14px 18px;
          box-shadow:0 6px 18px rgba(0,0,0,0.06);
          border:1px solid rgba(0,0,0,0.04);
          overflow-x:auto;
        }
        table {
          border-collapse:collapse;
          width:100%;
          min-width:840px;
          font-size:14px;
        }
        th, td {
          border-bottom:1px solid #e5d4c1;
          padding:8px 10px;
          text-align:left;
          white-space:nowrap;
        }
        th { background:#f7efe2; font-weight:600; }
        tr:nth-child(even) td { background:#fdf7ef; }
        tr:hover td { background:#f3ebde; }

        .badge {
          display:inline-block;
          padding:2px 7px;
          border-radius:999px;
          font-size:11px;
        }
        .badge-approved { background:#e3f2fd; color:#1565c0; }
        .badge-pending { background:#fff3e0; color:#ef6c00; }

        a.link {
          font-size:12px;
          color:#1565c0;
          text-decoration:none;
        }
        a.link:hover { text-decoration:underline; }
        a.link-danger {
          font-size:12px;
          color:#b00020;
          text-decoration:none;
        }
        a.link-danger:hover { text-decoration:underline; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="top-bar">
          <div>
            <h1>${academyName} 학생 목록</h1>
            <p class="desc">이 화면에는 ${academyName}에 소속된 학생만 표시됩니다.</p>
          </div>
          <a href="/super/branches?key=${encodeURIComponent(
            key
          )}" class="btn-back">← 학원/지점 목록으로</a>
        </div>

        <div class="toolbar">
          <!-- 나중에 검색/엑셀 필요하면 여기에 추가 -->
        </div>

        <p class="info-line">총 <strong>${users.length}</strong>명의 학생이 있습니다.</p>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>학년</th>
                <th>이름</th>
                <th>학원명</th>
                <th>전화번호(ID)</th>
                <th>상태</th>
                <th>학습 이력</th>
                <th>수정</th>
                <th>휴지통</th>
              </tr>
            </thead>
            <tbody>
    `;

    users.forEach((u, idx) => {
      const last = u.lastLogin
        ? new Date(u.lastLogin).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          })
        : "-";
      const idOrPhone = u.id || u.phone || "";

      const status = u.status || "approved";
      const statusLabel = status === "approved" ? "승인" : "대기";
      const statusClass =
        status === "approved" ? "badge-approved" : "badge-pending";

      const approveLink =
        status === "approved"
          ? `<a class="link" href="/admin/status?id=${encodeURIComponent(
              idOrPhone
            )}&status=pending&key=${encodeURIComponent(
              key
            )}" onclick="return confirm('이 회원을 다시 대기 상태로 전환할까요?');">대기 전환</a>`
          : `<a class="link" href="/admin/status?id=${encodeURIComponent(
              idOrPhone
            )}&status=approved&key=${encodeURIComponent(
              key
            )}" onclick="return confirm('이 회원을 승인하시겠습니까?');">승인하기</a>`;

      html += `
        <tr>
          <td>${idx + 1}</td>
          <td>${u.grade || ""}</td>
          <td>${u.name || ""}</td>
          <td>${u.school || ""}</td>
          <td>${idOrPhone}</td>
          <td>
            <span class="badge ${statusClass}">${statusLabel}</span>
            ${approveLink}
          </td>
          <td>
            <a class="link"
               href="/admin/logs?key=${encodeURIComponent(
                 key
               )}&grade=${encodeURIComponent(
        u.grade || ""
      )}&name=${encodeURIComponent(u.name || "")}">
              학습 이력 보기
            </a>
          </td>
          <td>
            <a class="link"
               href="/admin/user-edit?id=${encodeURIComponent(
                 idOrPhone
               )}&key=${encodeURIComponent(key)}">
              수정
            </a>
          </td>
          <td>
            <a class="link-danger"
               href="/trash-user?id=${encodeURIComponent(
                 idOrPhone
               )}&key=${encodeURIComponent(
        key
      )}"
               onclick="return confirm('이 회원을 휴지통으로 보낼까요? [${u.name} / ${idOrPhone}]');">
              휴지통
            </a>
          </td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("❌ /super/branch-users 에러:", err);
    res.status(500).send("지점 학생 목록 조회 중 오류가 발생했습니다.");
  }
});


// 내 학원 학생 목록 (브랜치 관리자 전용 화면 템플릿)
app.get("/admin/branch/users", requireAdminLogin, (req, res) => {
  console.log(
    "✅ [GET] /admin/branch/users -> public/branch_user_list.html",
    "academyName:",
    req.session.admin && req.session.admin.academyName
  );
  // 지금은 템플릿만 연결해두고, 실제 데이터 바인딩은 나중에 API/SSR로 확장 가능
  res.sendFile(path.join(__dirname, "public", "branch_user_list.html"));
});

// 학생 한 명 학습 이력 보기 (브랜치 관리자용 화면 템플릿)
app.get("/admin/branch/logs", requireAdminLogin, (req, res) => {
  console.log(
    "✅ [GET] /admin/branch/logs -> public/branch_logs.html",
    "academyName:",
    req.session.admin && req.session.admin.academyName
  );
  // URL 예시: /admin/branch/logs?grade=초6&name=홍길동
  res.sendFile(path.join(__dirname, "public", "branch_logs.html"));
});



// 관리자 로그아웃 (브랜치 관리자 세션만 종료)
app.get("/admin/logout", (req, res) => {
  console.log("📤 [GET] /admin/logout 호출");
  if (!req.session) {
    return res.redirect("/admin-login");
  }
  req.session.admin = null;
  res.redirect("/admin-login");
});

/* ====================================
 * ✅ 기존 학생/슈퍼관리자 라우트들
 * ==================================== */

// ✅ 로그아웃 (GET: 애니메이션 페이지로)
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("❗ 세션 종료 오류:", err);
    }

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: false,
    });

    res.redirect("/logout.html");
  });
});

// ping
app.get("/ping", (req, res) => {
  console.log("✅ [GET] /ping");
  res.send("pong ✅");
});

app.get("/signup", (req, res) => {
  console.log("➡️ /signup 요청 → student-main.html의 회원가입 팝업 모드");
  res.redirect("/?mode=register");
});

// ✅ 학생 회원가입 처리
app.post("/signup", async (req, res) => {
  console.log("📥 [POST] /signup 에서 받은 값:", req.body);

  const grade = req.body.grade || "";
  const name = req.body.name || "";
  const phone = req.body.phone || "";
  const school = req.body.school || "";

  const id = phone;
  const pw = phone;

  try {
    // MongoDB 저장 (status는 기본값 'pending')
    const created = await User.create({
      grade,
      name,
      phone,
      id,
      pw,
      school,
    });

    // JSON 백업
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    users.push({ grade, name, phone, id, pw, school });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    console.log("✅ [POST] 회원가입 DB 저장 완료:", created.name);
    res.redirect("/student-main.html");
  } catch (err) {
    console.error("❌ [POST] /signup 에러:", err);
    res.status(500).send("회원 가입 중 오류 발생: " + err.message);
  }
});

// ===== 회원 정보 수정 화면 (GET) =====
app.get("/admin/user-edit", async (req, res) => {
  const { id: rawId, key, view } = req.query;

  if (key !== ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }
  if (!rawId) {
    return res.status(400).send("id 파라미터가 필요합니다.");
  }

  const id = String(rawId).trim();

  try {
    const user = await User.findOne({
      $or: [{ id }, { phone: id }],
      deleted: { $ne: true },
    });

    if (!user) {
      return res.status(404).send("수정 대상 사용자를 찾을 수 없습니다.");
    }

    // 🔙 수정 후 돌아갈 주소
    const returnUrl =
      view === "branch"
        ? "/admin/branch/users"
        : `/admin/users?key=${encodeURIComponent(key)}`;

    const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>회원 정보 수정</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif; padding: 20px; }
        h1 { margin-bottom: 16px; }
        label { display:block; margin:8px 0 4px; font-size:14px; }
        input[type="text"] { width:260px; padding:6px 8px; font-size:14px; }
        .row { margin-bottom:8px; }
        button { margin-top:12px; padding:6px 14px; font-size:14px; }
        a { font-size:13px; margin-left:8px; }
      </style>
    </head>
    <body>
      <h1>회원 정보 수정</h1>
      <form method="POST" action="/admin/user-edit">
        <input type="hidden" name="key" value="${key}" />
        <input type="hidden" name="originalId" value="${id}" />
        <input type="hidden" name="return" value="${returnUrl}" />

        <div class="row">
          <label>학년</label>
          <input type="text" name="grade" value="${user.grade || ""}" />
        </div>

        <div class="row">
          <label>학교/학원명</label>
          <input type="text" name="school" value="${user.school || ""}" />
        </div>

        <div class="row">
          <label>이름</label>
          <input type="text" name="name" value="${user.name || ""}" />
        </div>

        <div class="row">
          <label>전화번호(ID)</label>
          <input type="text" name="phone" value="${user.phone || ""}" />
        </div>

        <button type="submit">저장하기</button>
        <a href="${returnUrl}">돌아가기</a>
      </form>
    </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("❌ /admin/user-edit(GET) 에러:", err);
    res.status(500).send("회원 정보 수정 화면 생성 중 오류");
  }
});


// ===== 회원 정보 수정 처리 (POST) =====
app.post("/admin/user-edit", async (req, res) => {
  const {
    originalId,
    key,
    grade,
    school,
    name,
    phone,
    return: returnUrl,   // 🔹 hidden input 으로 넘어온 return 주소
  } = req.body;

  if (key !== ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }

  if (!originalId) {
    return res.status(400).send("originalId 가 필요합니다.");
  }

  try {
    const targetId = String(originalId).trim();

    const user = await User.findOne({
      $or: [{ id: targetId }, { phone: targetId }],
      deleted: { $ne: true },
    });

    if (!user) {
      return res.status(404).send("수정 대상 사용자를 찾을 수 없습니다.");
    }

    // 필드 업데이트
    user.grade = grade || "";
    user.school = school || "";
    user.name = name || "";
    user.phone = phone || "";
    user.id = phone || "";
    user.pw = phone || "";

    await user.save();

    console.log("✅ 회원 정보 수정 완료:", user.name, user.id);

    // 🔙 return 값이 있으면 거기로, 없으면 기본 회원 목록으로
    if (returnUrl && returnUrl.startsWith("/")) {
      return res.redirect(returnUrl);
    }
    res.redirect(`/admin/users?key=${encodeURIComponent(key)}`);
  } catch (err) {
    console.error("❌ /admin/user-edit(POST) 에러:", err);
    res.status(500).send("회원 정보 수정 중 오류");
  }
});

// ===== 시리즈 부여 API (POST) =====
app.post("/admin/assign-series", async (req, res) => {
  const { key, userId, series } = req.body;

  if (key !== ADMIN_KEY) {
    return res.status(403).json({ success: false, message: "관리자 인증 실패" });
  }

  if (!userId) {
    return res.status(400).json({ success: false, message: "userId가 필요합니다" });
  }

  if (!Array.isArray(series)) {
    return res.status(400).json({ success: false, message: "series는 배열이어야 합니다" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다" });
    }

    user.assignedSeries = series;
    await user.save();

    console.log(`✅ 시리즈 부여 완료: ${user.name} (${user.id}) -> [${series.join(", ")}]`);

    return res.json({
      success: true,
      message: "시리즈 부여 완료",
      assignedSeries: series
    });
  } catch (err) {
    console.error("❌ /admin/assign-series 에러:", err);
    return res.status(500).json({ success: false, message: "시리즈 부여 중 오류 발생" });
  }
});


// ===== 회원 삭제 (hard delete) =====
app.get("/delete-user", async (req, res) => {
  const { id, pw, key } = req.query;

  if (key !== ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }

  if (!id) return res.status(400).send("id 파라미터가 필요합니다.");

  try {
    const user = await User.findOne({ id });
    if (!user) return res.status(404).send("존재하지 않는 사용자입니다.");

    if (pw && user.pw !== pw) {
      return res.status(403).send("비밀번호가 일치하지 않습니다.");
    }

    await User.deleteOne({ _id: user._id });

    res.send(`삭제 완료: ${user.name} (${user.id})`);
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류");
  }
});

// ===== 회원 휴지통 보내기 (soft delete) =====
// ===== 회원 휴지통 보내기 (soft delete) =====
app.get("/trash-user", async (req, res) => {
  const { id: rawId, key } = req.query;
  const returnUrl = req.query.return;   // ✅ 어디로 돌아갈지
  const view = req.query.view;         // ✅ branch 컨텍스트용

  if (key !== ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }

  if (!rawId) return res.status(400).send("id 파라미터가 필요합니다.");

  const id = String(rawId).trim();
  console.log("🗑 /trash-user 호출, id =", id);

  try {
    const user = await User.findOne({
      $or: [{ id }, { phone: id }],
      deleted: { $ne: true }, // active 회원만
    });

    if (!user) {
      return res
        .status(404)
        .send("이미 휴지 상태이거나 존재하지 않는 사용자입니다.");
    }

    user.deleted = true;
    user.deletedAt = new Date();
    await user.save();

    console.log("✅ 휴지통으로 이동 완료:", user.name, user.id || user.phone);

    // ✅ 1순위: return 파라미터 있으면 그쪽으로
    if (typeof returnUrl === "string" && returnUrl.startsWith("/")) {
      return res.redirect(returnUrl);
    }

    // ✅ 2순위: view=branch 면 브랜치 목록으로
    if (view === "branch") {
      return res.redirect("/admin/branch/users");
    }

    // ✅ 기본: 전체 회원 휴지통 페이지
    return res.redirect(`/admin/trash?key=${encodeURIComponent(key)}`);
  } catch (err) {
    console.error("❌ /trash-user 에러:", err);
    res.status(500).send("휴지통 이동 중 오류");
  }
});


// ⭐⭐⭐ 회원 상태(승인/대기) 변경 라우트 ⭐⭐⭐
// ⭐⭐⭐ 회원 상태(승인/대기) 변경 라우트 ⭐⭐⭐
app.get("/admin/status", async (req, res) => {
  const { key, id: rawId, status } = req.query;

  if (key !== ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }
  if (!rawId) return res.status(400).send("id 파라미터가 필요합니다.");

  const id = String(rawId).trim();
  const allowed = ["pending", "approved"];

  if (!allowed.includes(status)) {
    return res.status(400).send("유효하지 않은 status 값입니다.");
  }

  try {
    const user = await User.findOne({
      $or: [{ id }, { phone: id }],
      deleted: { $ne: true },
    });

    if (!user) {
      return res.status(404).send("상태를 변경할 사용자를 찾을 수 없습니다.");
    }

    user.status = status;
    await user.save();

    console.log("✅ 상태 변경:", user.name, "=>", status);

    // ✅ return 파라미터가 있으면 그쪽으로, 없으면 기존처럼 전체 회원 목록
    let returnUrl = req.query.return;
    if (typeof returnUrl === "string" && returnUrl.startsWith("/")) {
      return res.redirect(returnUrl);
    }

    res.redirect(`/admin/users?key=${encodeURIComponent(key)}`);
  } catch (err) {
    console.error("❌ /admin/status 에러:", err);
    res.status(500).send("상태 변경 중 오류");
  }
});


// ⭐⭐⭐ 회원 조회 페이지 (슈퍼관리자 전용, 새 디자인) ⭐⭐⭐
app.get("/admin/users", async (req, res) => {
  const { key, q, sort } = req.query;

  if (key !== ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }

  try {
    const filter = { deleted: { $ne: true } };

    let keyword = "";
    if (q && q.trim() !== "") {
      keyword = q.trim();
      const regex = new RegExp(keyword, "i");

      filter.$or = [
        { name: regex },
        { phone: regex },
        { id: regex },
        { school: regex },
        { grade: regex },
      ];
    }

    // 정렬 옵션 (기존 로직 유지)
    let sortOption = { lastLogin: -1, name: 1 };
    switch (sort) {
      case "lastLoginAsc":
        sortOption = { lastLogin: 1, name: 1 };
        break;
      case "gradeAsc":
        sortOption = { grade: 1, name: 1 };
        break;
      case "gradeDesc":
        sortOption = { grade: -1, name: 1 };
        break;
      case "nameAsc":
        sortOption = { name: 1 };
        break;
      case "nameDesc":
        sortOption = { name: -1 };
        break;
      default:
        sortOption = { lastLogin: -1, name: 1 };
    }

    const users = await User.find(filter).sort(sortOption).lean();

    // 🔽 여기부터 화면 템플릿 (브랜치용 디자인과 비슷하게)
    let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>단단국어 전체 회원 목록</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        :root {
          --bg: #f2ede5;
          --panel: #fffaf3;
          --accent: #8b2f2f;
          --line: #e5d4c1;
          --text: #3b2a1a;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 24px 16px 40px;
          background: var(--bg);
font-family: "Gmarket Sans", "Noto Sans KR", sans-serif;
          color: var(--text);
        }
        .wrap {
          max-width: 1120px;
          margin: 0 auto;
        }
        h1 {
          margin: 4px 0 6px;
          font-size: 26px;
          font-weight: 700;
        }
        .desc {
          margin: 0 0 18px;
          font-size: 14px;
          color: #7a6a5b;
        }
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          gap: 8px;
          flex-wrap: wrap;
        }
        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          font-size: 13px;
          border-radius: 999px;
          border: 1px solid #c59f7b;
          background: #fdf7ef;
          color: #5a3b23;
          text-decoration: none;
        }
        .btn-back:hover { background:#f9f0e3; }

        .toolbar {
          margin: 6px 0 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          justify-content: flex-end;
        }
        .toolbar form {
          display: inline-flex;
          gap: 4px;
          align-items: center;
        }
        .search-input {
          padding: 7px 10px;
          font-size: 14px;
          border-radius: 999px;
          border: 1px solid #d3c2af;
          min-width: 220px;
        }
        .search-select {
          padding: 7px 10px;
          font-size: 13px;
          border-radius: 999px;
          border: 1px solid #d3c2af;
          background: #fff;
        }
        .btn {
          padding: 7px 12px;
          font-size: 13px;
          border-radius: 999px;
          border: 1px solid transparent;
          cursor: pointer;
        }
        .btn-main {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }
        .btn-main:hover { opacity:.93; }
        .btn-ghost {
          background: #fff;
          color: #5a4332;
          border-color: #d3c2af;
        }
        .btn-danger {
          background: #fff5f5;
          color: #b00020;
          border-color: #e4a3a3;
        }

        .info-line {
          font-size: 13px;
          color: #7a6a5b;
          margin: 4px 0 10px;
        }

        .table-wrap {
          background: var(--panel);
          border-radius: 12px;
          padding: 14px 14px 18px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.04);
          overflow-x: auto;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          min-width: 840px;
          font-size: 14px;
        }
        th, td {
          border-bottom: 1px solid #e5d4c1;
          padding: 8px 10px;
          text-align: left;
          white-space: nowrap;
          font-weight: 700;
          color: #000;
          font-size: 15px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        th {
          background: #f7efe2;
          font-weight: 600;
        }
        tr:nth-child(even) td {
          background: #fdf7ef;
        }
        tr:hover td {
          background: #f3ebde;
        }

        .small { font-size: 12px; color: #8a7b6f; }

        .badge {
          display:inline-block;
          padding: 2px 7px;
          border-radius: 999px;
          font-size: 11px;
        }
        .badge-approved { background:#e3f2fd; color:#1565c0; }
        .badge-pending { background:#fff3e0; color:#ef6c00; }

        a.link {
          font-size: 12px;
          color: #1565c0;
          text-decoration: none;
        }
        a.link:hover { text-decoration: underline; }

        a.link-danger {
          font-size: 12px;
          color: #b00020;
          text-decoration: none;
        }
        a.link-danger:hover { text-decoration: underline; }

        @media (max-width: 720px) {
          h1 { font-size: 22px; }
          .table-wrap { padding: 10px; }
        }

        /* 시리즈 부여 모달 스타일 */
        .modal-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          align-items: center;
          justify-content: center;
        }
        .modal-overlay.active {
          display: flex;
        }
        .modal-box {
          background: var(--panel);
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }
        .modal-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--accent);
        }
        .modal-body {
          margin-bottom: 20px;
        }
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .checkbox-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 12px;
          padding: 10px;
          background: #f9f9f9;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          transition: all 0.2s ease;
        }
        .checkbox-item:hover {
          background: #f0f0f0;
          border-color: var(--accent);
        }
        .checkbox-item input[type="checkbox"] {
          margin-top: 3px;
          flex-shrink: 0;
        }
        .checkbox-item label {
          flex: 1;
          margin: 0;
          cursor: pointer;
        }
        .series-name {
          font-weight: 600;
          color: var(--accent);
          display: block;
          margin-bottom: 2px;
        }
        .series-desc {
          font-size: 12px;
          color: #666;
          display: block;
        }
        .modal-footer {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        .btn {
          padding: 8px 16px;
          font-size: 14px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }
        .btn-ghost {
          background: #e0e0e0;
          color: #333;
        }
        .btn-ghost:hover {
          background: #d0d0d0;
        }
        .btn-main {
          background: var(--accent);
          color: #fff;
        }
        .btn-main:hover {
          opacity: 0.9;
        }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="top-bar">
          <div>
            <h1>단단국어 전체 회원 목록</h1>
            <p class="desc">
              단단국어에 가입된 모든 학생 계정을 한 번에 확인합니다.<br/>
              학년, 학원명, 이름, 로그인 상태 등을 한눈에 볼 수 있습니다.
            </p>
          </div>
          <div>
            <a href="/super/dashboard" class="btn-back">← 대시보드로 돌아가기</a>
          </div>
        </div>

        <div class="toolbar">
          <form method="GET" action="/admin/users">
            <input type="hidden" name="key" value="${key || ""}" />
            <input
              type="text"
              name="q"
              class="search-input"
              placeholder="이름, 학교/학원명, 학년, 전화번호 검색"
              value="${q ? q : ""}"
            />
            <select name="sort" class="search-select">
              <option value="lastLoginDesc" ${!sort || sort === "lastLoginDesc" ? "selected" : ""}>최근 로그인순(내림차순)</option>
              <option value="lastLoginAsc" ${sort === "lastLoginAsc" ? "selected" : ""}>최근 로그인순(오름차순)</option>
              <option value="gradeAsc" ${sort === "gradeAsc" ? "selected" : ""}>학년 오름차순</option>
              <option value="gradeDesc" ${sort === "gradeDesc" ? "selected" : ""}>학년 내림차순</option>
              <option value="nameAsc" ${sort === "nameAsc" ? "selected" : ""}>이름 가나다순</option>
              <option value="nameDesc" ${sort === "nameDesc" ? "selected" : ""}>이름 역순</option>
            </select>
            <button type="submit" class="btn btn-main">검색</button>
          </form>

          <form method="GET" action="/admin/users-export">
            <input type="hidden" name="key" value="${key || ""}" />
            <input type="hidden" name="q" value="${q ? q : ""}" />
            <input type="hidden" name="sort" value="${sort || ""}" />
            <button type="submit" class="btn btn-ghost">엑셀 다운로드</button>
          </form>

          <a
            href="/admin/trash?key=${encodeURIComponent(key || "")}"
            class="btn btn-danger"
            style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center;"
          >
            휴지통 보기
          </a>
        </div>

        <p class="info-line">
          총 <strong>${users.length}</strong>명의 회원이 있습니다.
          ${q && q.trim() !== "" ? `<span class="small">(검색어: "${q.trim()}")</span>` : ""}
          <br/>
          <span class="small">※ 링크 클릭 시 휴지통 이동, 상태 변경, 학습 이력 확인 등이 가능합니다.</span>
        </p>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>학년</th>
                <th>이름</th>
                <th>학원명</th>
                <th>전화번호(ID)</th>
                <th>상태</th>
                <th>시리즈 부여</th>
                <th>마지막 로그인</th>
                <th>학습 이력</th>
                <th>수정</th>
                <th>휴지통</th>
              </tr>
            </thead>
            <tbody>
    `;

    users.forEach((u, idx) => {
      const last = u.lastLogin
        ? new Date(u.lastLogin).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          })
        : "-";
      const idOrPhone = u.id || u.phone || "";

      const status = u.status || "approved";
      const statusLabel = status === "approved" ? "승인" : "대기";
      const statusClass =
        status === "approved" ? "badge-approved" : "badge-pending";

      const approveLink =
        status === "approved"
          ? `<a class="link" href="/admin/status?id=${encodeURIComponent(
              idOrPhone
            )}&status=pending&key=${encodeURIComponent(
              key
            )}" onclick="return confirm('이 회원을 다시 대기 상태로 전환할까요?');">대기 전환</a>`
          : `<a class="link" href="/admin/status?id=${encodeURIComponent(
              idOrPhone
            )}&status=approved&key=${encodeURIComponent(
              key
            )}" onclick="return confirm('이 회원을 승인하시겠습니까?');">승인하기</a>`;

      // 안전하게 JSON 데이터 전달
      const escapedName = (u.name || "").replace(/'/g, "\\'").replace(/"/g, "&quot;");
      const assignedSeriesJson = JSON.stringify(u.assignedSeries || [])
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");

      html += `
        <tr>
          <td>${idx + 1}</td>
          <td>${u.grade || ""}</td>
          <td>${u.name || ""}</td>
          <td>${u.school || ""}</td>
          <td>${idOrPhone}</td>
          <td>
            <span class="badge ${statusClass}">${statusLabel}</span>
            ${approveLink}
          </td>
          <td>
            <a class="link"
               href="#"
               onclick="openSeriesModal('${u._id}', '${escapedName}', '${assignedSeriesJson}'); return false;">
              시리즈 부여
            </a>
          </td>
          <td>${last}</td>
          <td>
            <a class="link"
               href="/admin/logs?key=${encodeURIComponent(
                 key
               )}&grade=${encodeURIComponent(
        u.grade || ""
      )}&name=${encodeURIComponent(u.name || "")}">
              학습 이력 보기
            </a>
          </td>
          <td>
            <a class="link"
               href="/admin/user-edit?id=${encodeURIComponent(
                 idOrPhone
               )}&key=${encodeURIComponent(key)}">
              수정
            </a>
          </td>
          <td>
            <a class="link-danger"
               href="/trash-user?id=${encodeURIComponent(
                 idOrPhone
               )}&key=${encodeURIComponent(
        key
      )}"
               onclick="return confirm('이 회원을 휴지통으로 보낼까요? [${u.name} / ${idOrPhone}]');">
              휴지통
            </a>
          </td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </div>
      </div>

      <!-- 시리즈 부여 모달 -->
      <div id="seriesModal" class="modal-overlay">
        <div class="modal-box">
          <div class="modal-title">시리즈 부여</div>
          <div class="modal-body">
            <p style="margin-bottom: 12px; font-size: 14px; color: #555;">
              <strong id="modalUserName"></strong> 학생에게 접근 가능한 시리즈를 선택하세요:
            </p>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input type="checkbox" id="series-brainun" value="BRAIN은" />
                <label for="series-brainun">
                  <span class="series-name">BRAIN ON</span>
                  <span class="series-desc">개념이해 (4~5학년 추천)</span>
                </label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="series-brainam" value="BRAIN암" />
                <label for="series-brainam">
                  <span class="series-name">BRAIN UP</span>
                  <span class="series-desc">응용적용 (5~6학년 추천)</span>
                </label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="series-brainbit" value="BRAIN빛" />
                <label for="series-brainbit">
                  <span class="series-name">BRAIN FIT</span>
                  <span class="series-desc">사고연결 (6학년 ~중1 추천)</span>
                </label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="series-braindap" value="BRAIN답" />
                <label for="series-braindap">
                  <span class="series-name">BRAIN DEEP</span>
                  <span class="series-desc">심화추론 (중1 ~ 중3 추천)</span>
                </label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="series-brainjung" value="BRAIN중등" />
                <label for="series-brainjung">
                  <span class="series-name">BRAIN 중등</span>
                  <span class="series-desc">중등교과 (중등 선행 ~ 중등 전체)</span>
                </label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="series-braingo" value="BRAIN고등" />
                <label for="series-braingo">
                  <span class="series-name">BRAIN 고등</span>
                  <span class="series-desc">고등교과 (고등 선행 ~ 고등 전체)</span>
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" onclick="closeSeriesModal()">취소</button>
            <button class="btn btn-main" onclick="submitSeries()">저장</button>
          </div>
        </div>
      </div>

      <script>
        let currentUserId = null;

        function openSeriesModal(userId, userName, assignedSeriesStr) {
          currentUserId = userId;
          document.getElementById('modalUserName').textContent = userName;

          // 문자열을 배열로 파싱
          let assignedSeries = [];
          try {
            assignedSeries = JSON.parse(assignedSeriesStr);
          } catch (e) {
            console.error('Failed to parse assignedSeries:', e);
          }

          const checkboxes = document.querySelectorAll('#seriesModal input[type="checkbox"]');
          checkboxes.forEach(cb => {
            cb.checked = assignedSeries.includes(cb.value);
          });

          document.getElementById('seriesModal').classList.add('active');
        }

        function closeSeriesModal() {
          document.getElementById('seriesModal').classList.remove('active');
          currentUserId = null;
        }

        async function submitSeries() {
          if (!currentUserId) return;

          const checkboxes = document.querySelectorAll('#seriesModal input[type="checkbox"]');
          const selectedSeries = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

          try {
            const res = await fetch('/admin/assign-series', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                key: '${key}',
                userId: currentUserId,
                series: selectedSeries
              })
            });

            const data = await res.json();
            if (data.success) {
              alert('시리즈 부여 완료!');
              closeSeriesModal();
            } else {
              alert('오류: ' + (data.message || '알 수 없는 오류'));
            }
          } catch (err) {
            console.error(err);
            alert('저장 중 오류가 발생했습니다.');
          }
        }

        // 모달 외부 클릭시 닫기
        document.getElementById('seriesModal').addEventListener('click', function(e) {
          if (e.target === this) {
            closeSeriesModal();
          }
        });
      </script>
    </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("❌ /admin/users 에러:", err);
    res.status(500).send("회원 조회 중 오류가 발생했습니다.");
  }
});


// ===== 회원 목록 엑셀(CSV) 다운로드 =====
app.get("/admin/users-export", async (req, res) => {
  const { key, q, sort } = req.query;

  if (key !== ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }

  try {
    const filter = { deleted: { $ne: true } };

    if (q && q.trim() !== "") {
      const keyword = q.trim();
      const regex = new RegExp(keyword, "i");
      filter.$or = [
        { name: regex },
        { phone: regex },
        { id: regex },
        { school: regex },
        { grade: regex },
      ];
    }

    let sortOption = { lastLogin: -1, name: 1 };
    switch (sort) {
      case "lastLoginAsc":
        sortOption = { lastLogin: 1, name: 1 };
        break;
      case "gradeAsc":
        sortOption = { grade: 1, name: 1 };
        break;
      case "gradeDesc":
        sortOption = { grade: -1, name: 1 };
        break;
      case "nameAsc":
        sortOption = { name: 1 };
        break;
      case "nameDesc":
        sortOption = { name: -1 };
        break;
      default:
        sortOption = { lastLogin: -1, name: 1 };
    }

    const users = await User.find(filter).sort(sortOption).lean();

    const escape = (v = "") => `"${String(v).replace(/"/g, '""')}"`;

    const lines = [];
    // 헤더
    lines.push(
      [
        "번호",
        "학년",
        "학교/학원명",
        "이름",
        "전화번호(ID)",
        "상태",
        "마지막 로그인",
      ]
        .map(escape)
        .join(",")
    );

    users.forEach((u, idx) => {
      const last = u.lastLogin
        ? new Date(u.lastLogin).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          })
        : "";
      const idOrPhone = u.id || u.phone || "";
      const status = u.status || "approved";
      const statusLabel = status === "approved" ? "승인" : "대기";

      lines.push(
        [
          idx + 1,
          u.grade || "",
          u.school || "",
          u.name || "",
          idOrPhone,
          statusLabel,
          last,
        ]
          .map(escape)
          .join(",")
      );
    });

    const csvBody = lines.join("\r\n");
    const bom = "\uFEFF";

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="dandan_users_${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`
    );

    res.send(bom + csvBody);
  } catch (err) {
    console.error("❌ /admin/users-export 에러:", err);
    res.status(500).send("엑셀 다운로드 중 오류가 발생했습니다.");
  }
});

// ===== 학습 이력 로그 저장 API =====
app.post("/api/log", async (req, res) => {
  try {
    const { grade, name, school, series, unit, radar, completed } = req.body;

    console.log("[/api/log] 받은 데이터:", { grade, name, school, series, unit, completed });

    if (!grade || !name || !unit) {
      return res.status(400).json({ ok: false, message: "필수 정보 부족" });
    }

    const logData = {
      grade,
      name,
      school: school || "",
      series: series || "",
      unit,
      radar: radar || undefined,
      completed: completed === true,  // 명시적으로 true인지 확인
    };

    console.log("[/api/log] 저장할 데이터:", logData);

    const savedLog = await LearningLog.create(logData);
    console.log("[/api/log] 저장 완료:", savedLog._id, "completed:", savedLog.completed);

    return res.json({ ok: true });
  } catch (err) {
    console.error("[/api/log] error:", err);
    res.status(500).json({ ok: false });
  }
});

// ===== 사용자 정보 조회 API (시리즈 부여 정보 업데이트용) =====
app.get("/api/user-info", async (req, res) => {
  try {
    const { grade, name } = req.query;

    if (!grade || !name) {
      return res.status(400).json({ error: "grade and name are required" });
    }

    const user = await User.findOne({ grade, name, deleted: { $ne: true } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 필요한 정보만 반환
    res.json({
      _id: user._id,
      grade: user.grade,
      name: user.name,
      school: user.school,
      assignedSeries: user.assignedSeries || []
    });
  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== 학습 완료 상태 조회 API =====
app.get("/api/completion-status", async (req, res) => {
  try {
    const { grade, name, series } = req.query;

    console.log("[/api/completion-status] 조회 요청:", { grade, name, series });

    if (!grade || !name || !series) {
      return res.status(400).json({ ok: false, message: "필수 파라미터 부족 (grade, name, series)" });
    }

    // 해당 학생의 완료된 단원 목록 조회
    const completedLogs = await LearningLog.find({
      grade,
      name,
      series,
      completed: true
    }).select('unit').lean();

    console.log("[/api/completion-status] 조회 결과:", completedLogs.length, "개 완료 기록");

    // 완료된 단원 코드 배열
    const completedUnits = completedLogs.map(log => log.unit);

    console.log("[/api/completion-status] 완료 단원:", completedUnits);

    return res.json({ ok: true, completedUnits });
  } catch (err) {
    console.error("[/api/completion-status] error:", err);
    res.status(500).json({ ok: false, message: "서버 오류" });
  }
});

// ===== 학습 이력 보기 (슈퍼관리자 전용) =====
app.get("/admin/logs", async (req, res) => {
  const { key, grade, name } = req.query;

  console.log("[/admin/logs] 요청 파라미터:", { grade, name });

  if (key !== ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }

  if (!grade || !name) {
    return res.status(400).send("grade, name 파라미터가 필요합니다.");
  }

  try {
    const logs = await LearningLog.find({ grade, name, deleted: { $ne: true } })
      .sort({ timestamp: -1 })
      .lean();

    console.log("[/admin/logs] 조회 결과:", logs.length, "개 기록 찾음");

    let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>학습 이력 - ${grade} ${name}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          padding: 50px;
        }

        .header {
          text-align: center;
          margin-bottom: 50px;
          padding-bottom: 30px;
          border-bottom: 3px solid #e5d4c1;
        }

        h1 {
          font-size: 42px;
          font-weight: 800;
          color: #2c3e50;
          margin-bottom: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 16px;
          color: #7f8c8d;
          font-weight: 500;
        }

        .nav-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 20px;
        }

        .btn {
          display: inline-block;
          padding: 12px 28px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .btn-back {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-back:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-download {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }

        .btn-download:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
        }

        .btn-trash {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          color: white;
        }

        .btn-trash:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
        }

        .stats-badge {
          display: inline-block;
          background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
          color: #2d3436;
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 30px;
          box-shadow: 0 4px 15px rgba(253, 203, 110, 0.3);
        }

        .section-title {
          font-size: 28px;
          font-weight: 700;
          color: #2c3e50;
          margin: 50px 0 20px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-description {
          font-size: 14px;
          color: #7f8c8d;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .table-container {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 50px;
        }

        table {
          border-collapse: collapse;
          width: 100%;
        }

        th, td {
          padding: 16px 20px;
          font-size: 15px;
          text-align: left;
        }

        th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 13px;
        }

        td {
          border-bottom: 1px solid #ecf0f1;
          color: #2c3e50;
        }

        tr:hover td {
          background: #f8f9fa;
        }

        tr:last-child td {
          border-bottom: none;
        }

        hr {
          margin: 60px 0;
          border: none;
          border-top: 2px solid #e5d4c1;
        }

        #summary-radar-wrap,
        #radar-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          margin-top: 30px;
          justify-content: center;
        }

        .radar-card {
          flex: 0 0 320px;
          border: 2px solid #e5d4c1;
          border-radius: 20px;
          padding: 24px;
          background: linear-gradient(135deg, #ffffff 0%, #fffaf3 100%);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .radar-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        }

        .radar-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
          border-color: #d4b89c;
        }

        .radar-card-header {
          margin-bottom: 20px;
          text-align: center;
          position: relative;
        }

        .delete-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          color: white;
          border: 2px solid white;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(238, 90, 111, 0.4);
          transition: all 0.3s ease;
          z-index: 10;
        }

        .delete-btn:hover {
          transform: scale(1.1);
          background: linear-gradient(135deg, #ee5a6f 0%, #ff4757 100%);
          box-shadow: 0 6px 15px rgba(238, 90, 111, 0.6);
        }

        .table-delete-btn {
          padding: 6px 12px;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(238, 90, 111, 0.3);
        }

        .table-delete-btn:hover {
          background: linear-gradient(135deg, #ee5a6f 0%, #ff4757 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(238, 90, 111, 0.5);
        }

        .radar-card-title {
          display: block;
          font-size: 18px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .radar-card-time {
          color: #95a5a6;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .radar-card-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #f0f0f0;
          gap: 10px;
        }

        .stat-item {
          text-align: center;
          flex: 1;
        }

        .stat-label {
          font-size: 11px;
          color: #95a5a6;
          font-weight: 600;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .score-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          margin-top: 10px;
        }

        .badge-excellent {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
          color: #2d3436;
        }

        .badge-good {
          background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
          color: #2d3436;
        }

        .badge-normal {
          background: linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%);
          color: #2d3436;
        }

        /* 종합 레이더 카드 - 붉은 계열 */
        .radar-card.summary-card::before {
          background: linear-gradient(90deg, #f093fb 0%, #f5576c 50%, #e74c3c 100%) !important;
        }

        .radar-card.summary-card {
          border-color: #f5c6cb;
        }

        .radar-card.summary-card:hover {
          border-color: #f5576c;
        }

        .radar-card.summary-card .stat-value {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }

        /* 더보기 기능 스타일 */
        .hidden-row {
          display: none;
        }

        .hidden-card {
          display: none !important;
        }

        .toggle-btn {
          display: block;
          margin: 20px auto;
          padding: 12px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .toggle-btn:active {
          transform: translateY(0);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>학습 이력</h1>
          <p class="subtitle">${grade} ${name}</p>

          <div class="nav-buttons">
            <a class="btn btn-back" href="/admin/users?key=${encodeURIComponent(key)}">
              ← 회원 목록으로
            </a>
            <a class="btn btn-download" href="/admin/logs-export?key=${encodeURIComponent(
              key
            )}&grade=${encodeURIComponent(grade)}&name=${encodeURIComponent(name)}">
              📥 CSV 다운로드
            </a>
            <a class="btn btn-trash" href="/admin/logs/trash?key=${encodeURIComponent(key)}&grade=${encodeURIComponent(grade)}&name=${encodeURIComponent(name)}">
              🗑️ 휴지통
            </a>
          </div>
        </div>

        <div style="text-align: center;">
          <span class="stats-badge">📚 총 ${logs.length}건의 학습 기록</span>
        </div>

        <div class="section-title">
          📝 학습 기록 목록
        </div>
        <p class="section-description">
          모든 학습 활동이 시간 순서대로 기록되어 있습니다.
        </p>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>날짜/시간</th>
                <th>시리즈</th>
                <th>단원 코드</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
    `;

    logs.forEach((log, idx) => {
      const ts = log.timestamp
        ? new Date(log.timestamp).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          })
        : "-";

      const hiddenClass = idx >= 6 ? ' class="hidden-row"' : '';
      html += `
        <tr${hiddenClass}>
          <td>${idx + 1}</td>
          <td>${ts}</td>
          <td>${log.series || ""}</td>
          <td>${log.unit || ""}</td>
          <td>
            <button class="table-delete-btn" onclick="deleteLog('${log._id}', '${encodeURIComponent(key)}', '${encodeURIComponent(grade)}', '${encodeURIComponent(name)}')">
              🗑️ 삭제
            </button>
          </td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </div>
        ${logs.length > 6 ? '<button class="toggle-btn" id="toggleBtn" onclick="toggleRows()">더보기 ▼</button>' : ''}

        <hr>

        <div class="section-title">
          📊 과목별 종합 레이더
        </div>
        <p class="section-description">
          과목별로 모든 학습 데이터의 평균을 보여줍니다.<br/>
          (※ radar 데이터가 있는 기록들만 평균에 포함됩니다.)
        </p>

        <div id="summary-radar-wrap"></div>
        <button class="toggle-btn" id="toggleSummaryBtn" onclick="toggleSummaryRadar()" style="display:none;">더보기 ▼</button>

        <hr>

        <div class="section-title">
          🧠 단원별 문해력 레이더 차트
        </div>
        <p class="section-description">
          가장 최근 기록이 위에 오도록 정렬되어 있어요.<br/>
          (※ 아직 radar 데이터가 없는 기록은 그래프가 표시되지 않습니다.)
        </p>

        <div id="radar-wrap"></div>
        <button class="toggle-btn" id="toggleRadarBtn" onclick="toggleRadar()" style="display:none;">더보기 ▼</button>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script>
        // ===== 삭제 기능 (관리자 전용) =====
        function deleteLog(logId, key, grade, name) {
          if (!confirm('이 학습 기록을 삭제하시겠습니까?\\n\\n삭제된 항목은 휴지통에서 복구하실 수 있습니다.')) {
            return;
          }

          fetch(\`/admin/log/delete/\${logId}?key=\${encodeURIComponent(key)}\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              alert('삭제되었습니다. 페이지를 새로고침합니다.');
              window.location.reload();
            } else {
              alert('삭제 실패: ' + data.message);
            }
          })
          .catch(err => {
            alert('삭제 중 오류가 발생했습니다: ' + err.message);
          });
        }

        // ===== 학습 기록 더보기/접기 기능 =====
        function toggleRows() {
          const hiddenRows = document.querySelectorAll('.hidden-row');
          const toggleBtn = document.getElementById('toggleBtn');

          if (hiddenRows.length === 0) return;

          const isHidden = hiddenRows[0].style.display === 'none' || hiddenRows[0].style.display === '';

          hiddenRows.forEach(row => {
            row.style.display = isHidden ? 'table-row' : 'none';
          });

          toggleBtn.textContent = isHidden ? '접기 ▲' : '더보기 ▼';
        }

        // ===== 종합 레이더 더보기/접기 기능 =====
        function toggleSummaryRadar() {
          const allCards = document.querySelectorAll('#summary-radar-wrap .radar-card');
          const toggleBtn = document.getElementById('toggleSummaryBtn');
          const isExpanded = toggleBtn.textContent.includes('접기');

          allCards.forEach((card, index) => {
            if (index >= 6) {
              if (isExpanded) {
                card.classList.add('hidden-card');
              } else {
                card.classList.remove('hidden-card');
              }
            }
          });

          toggleBtn.textContent = isExpanded ? '더보기 ▼' : '접기 ▲';
        }

        // ===== 단원별 레이더 더보기/접기 기능 =====
        function toggleRadar() {
          const allCards = document.querySelectorAll('#radar-wrap .radar-card');
          const toggleBtn = document.getElementById('toggleRadarBtn');
          const isExpanded = toggleBtn.textContent.includes('접기');

          allCards.forEach((card, index) => {
            if (index >= 6) {
              if (isExpanded) {
                card.classList.add('hidden-card');
              } else {
                card.classList.remove('hidden-card');
              }
            }
          });

          toggleBtn.textContent = isExpanded ? '더보기 ▼' : '접기 ▲';
        }

        const logsForChart = ${JSON.stringify(logs)};

        // ===== 종합 레이더 차트 생성 =====
        const summaryWrap = document.getElementById('summary-radar-wrap');

        // 과목 코드 → 과목명 매핑
        const subjectNames = {
          'geo': '지리'
        };

        // 과목별로 그룹화 (unit 코드에서 과목 추출: geo, history 등)
        const subjectGroups = {};
        logsForChart.forEach(log => {
          if (!log.radar || !log.unit) return;

          // unit 코드에서 과목 추출 (geo_01 -> geo, history_01 -> history)
          const subjectCode = log.unit.split('_')[0];
          const subjectKey = (log.series || 'BRAIN업') + '_' + subjectCode;

          if (!subjectGroups[subjectKey]) {
            subjectGroups[subjectKey] = {
              series: log.series || 'BRAIN업',
              subjectCode: subjectCode,
              logs: []
            };
          }
          subjectGroups[subjectKey].logs.push(log);
        });

        // 각 과목별로 평균 계산 및 차트 생성
        let summaryIndex = 0;
        Object.keys(subjectGroups).forEach(key => {
          const group = subjectGroups[key];
          const seriesLogs = group.logs;
          const subjectName = subjectNames[group.subjectCode] || group.subjectCode;
          const displayTitle = group.series + ' ' + subjectName;

          // 평균 계산
          let totalLiteral = 0, totalStructural = 0, totalLexical = 0;
          let totalInferential = 0, totalCritical = 0;
          let count = 0;

          seriesLogs.forEach(log => {
            if (log.radar) {
              totalLiteral += log.radar.literal || 0;
              totalStructural += log.radar.structural || 0;
              totalLexical += log.radar.lexical || 0;
              totalInferential += log.radar.inferential || 0;
              totalCritical += log.radar.critical || 0;
              count++;
            }
          });

          if (count === 0) return;

          const avgLiteral = Math.round((totalLiteral / count) * 10) / 10;
          const avgStructural = Math.round((totalStructural / count) * 10) / 10;
          const avgLexical = Math.round((totalLexical / count) * 10) / 10;
          const avgInferential = Math.round((totalInferential / count) * 10) / 10;
          const avgCritical = Math.round((totalCritical / count) * 10) / 10;

          const scores = [avgLiteral, avgStructural, avgLexical, avgInferential, avgCritical];
          const avgScore = (scores.reduce((a, b) => a + b, 0) / 5).toFixed(1);
          const maxScore = Math.max(...scores).toFixed(1);
          const minScore = Math.min(...scores).toFixed(1);

          // 뱃지 등급 결정
          let badgeClass = 'badge-normal';
          let badgeText = '보통';
          if (avgScore >= 9) {
            badgeClass = 'badge-excellent';
            badgeText = '우수';
          } else if (avgScore >= 8) {
            badgeClass = 'badge-good';
            badgeText = '양호';
          } else if (avgScore >= 7) {
            badgeClass = 'badge-normal';
            badgeText = '보통';
          } else {
            badgeClass = 'badge-encourage';
            badgeText = '격려';
          }

          // 차트 카드 생성
          const card = document.createElement('div');
          card.className = 'radar-card summary-card' + (summaryIndex >= 6 ? ' hidden-card' : '');
          summaryIndex++;

          const header = document.createElement('div');
          header.className = 'radar-card-header';

          const title = document.createElement('div');
          title.className = 'radar-card-title';
          title.textContent = displayTitle;

          const subtitle = document.createElement('div');
          subtitle.className = 'radar-card-time';
          subtitle.innerHTML = '📚 총 ' + count + '회 학습';

          const badge = document.createElement('div');
          badge.className = 'score-badge ' + badgeClass;
          badge.textContent = badgeText + ' 등급';

          header.appendChild(title);
          header.appendChild(subtitle);
          header.appendChild(badge);
          card.appendChild(header);

          const canvas = document.createElement('canvas');
          canvas.width = 280;
          canvas.height = 280;
          card.appendChild(canvas);

          // 통계 정보
          const stats = document.createElement('div');
          stats.className = 'radar-card-stats';
          stats.innerHTML =
            '<div class="stat-item">' +
              '<div class="stat-label">평균</div>' +
              '<div class="stat-value">' + avgScore + '</div>' +
            '</div>' +
            '<div class="stat-item">' +
              '<div class="stat-label">최고</div>' +
              '<div class="stat-value">' + maxScore + '</div>' +
            '</div>' +
            '<div class="stat-item">' +
              '<div class="stat-label">최저</div>' +
              '<div class="stat-value">' + minScore + '</div>' +
            '</div>';
          card.appendChild(stats);

          summaryWrap.appendChild(card);

          // 차트 생성
          new Chart(canvas.getContext('2d'), {
            type: 'radar',
            data: {
              labels: ['핵심 이해력', '구조 파악력', '어휘 맥락력', '추론·통합력', '비판·적용력'],
              datasets: [{
                label: displayTitle,
                data: scores,
                backgroundColor: 'rgba(245, 87, 108, 0.2)',
                borderColor: '#f5576c',
                borderWidth: 3,
                pointBackgroundColor: '#f5576c',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
              }]
            },
            options: {
              responsive: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                r: {
                  suggestedMin: 0,
                  suggestedMax: 10,
                  ticks: {
                    stepSize: 2,
                    backdropColor: 'transparent',
                    font: { size: 11 }
                  },
                  pointLabels: {
                    font: { size: 12, weight: 'bold' }
                  },
                  grid: { color: '#e5d4c1' },
                  angleLines: { color: '#e5d4c1' }
                }
              }
            }
          });
        });

        // ===== 개별 레이더 차트 생성 =====
        const wrap = document.getElementById('radar-wrap');
        let radarIndex = 0;

        logsForChart.forEach(function(log, idx) {
          if (!log.radar) return;

          const r = log.radar || {};

          // 평균 점수 계산
          const scores = [
            r.literal || 0,
            r.structural || 0,
            r.lexical || 0,
            r.inferential || 0,
            r.critical || 0
          ];
          const avgScore = (scores.reduce((a, b) => a + b, 0) / 5).toFixed(1);
          const maxScore = Math.max(...scores).toFixed(1);
          const minScore = Math.min(...scores).toFixed(1);

          // 뱃지 등급 결정
          let badgeClass = 'badge-normal';
          let badgeText = '보통';
          if (avgScore >= 9) {
            badgeClass = 'badge-excellent';
            badgeText = '우수';
          } else if (avgScore >= 8) {
            badgeClass = 'badge-good';
            badgeText = '양호';
          } else if (avgScore >= 7) {
            badgeClass = 'badge-normal';
            badgeText = '보통';
          } else {
            badgeClass = 'badge-encourage';
            badgeText = '격려';
          }

          const card = document.createElement('div');
          card.className = 'radar-card' + (radarIndex >= 6 ? ' hidden-card' : '');

          const header = document.createElement('div');
          header.className = 'radar-card-header';

          const title = document.createElement('div');
          title.className = 'radar-card-title';
          title.textContent = (log.unit || '단원 미지정');

          const time = document.createElement('div');
          time.className = 'radar-card-time';
          time.innerHTML = '🕐 ' + (log.timestamp ? new Date(log.timestamp).toLocaleString('ko-KR') : '-');

          const badge = document.createElement('div');
          badge.className = 'score-badge ' + badgeClass;
          badge.textContent = badgeText + ' 등급';

          header.appendChild(title);
          header.appendChild(time);
          header.appendChild(badge);
          card.appendChild(header);

          const canvas = document.createElement('canvas');
          canvas.id = 'radar-' + idx;
          canvas.width = 280;
          canvas.height = 280;
          card.appendChild(canvas);

          // 통계 정보
          const stats = document.createElement('div');
          stats.className = 'radar-card-stats';
          stats.innerHTML =
            '<div class="stat-item">' +
              '<div class="stat-label">평균</div>' +
              '<div class="stat-value">' + avgScore + '</div>' +
            '</div>' +
            '<div class="stat-item">' +
              '<div class="stat-label">최고</div>' +
              '<div class="stat-value">' + maxScore + '</div>' +
            '</div>' +
            '<div class="stat-item">' +
              '<div class="stat-label">최저</div>' +
              '<div class="stat-value">' + minScore + '</div>' +
            '</div>';
          card.appendChild(stats);

          wrap.appendChild(card);

          new Chart(canvas.getContext('2d'), {
            type: 'radar',
            data: {
              labels: ['핵심 이해력', '구조 파악력', '어휘 맥락력', '추론·통합력', '비판·적용력'],
              datasets: [{
                label: (log.unit || '단원') + ' 분석리포트',
                data: scores,
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: '#667eea',
                borderWidth: 3,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
              }]
            },
            options: {
              responsive: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                r: {
                  suggestedMin: 0,
                  suggestedMax: 10,
                  ticks: {
                    stepSize: 2,
                    backdropColor: 'transparent',
                    font: { size: 11 }
                  },
                  pointLabels: {
                    font: { size: 12, weight: 'bold' }
                  },
                  grid: { color: '#e5d4c1' },
                  angleLines: { color: '#e5d4c1' }
                }
              }
            }
          });

          radarIndex++;
        });

        // 개별 레이더 차트 더보기 버튼 표시
        if (radarIndex > 6) {
          document.getElementById('toggleRadarBtn').style.display = 'block';
        }
      </script>

    </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("❌ /admin/logs 에러:", err);
    res.status(500).send("학습 이력 조회 중 오류가 발생했습니다.");
  }
});

// ===== 학습 이력 CSV 다운로드 =====
app.get("/admin/logs-export", async (req, res) => {
  const { key, grade, name } = req.query;

  if (key !== ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }
  if (!grade || !name) {
    return res.status(400).send("grade, name 파라미터가 필요합니다.");
  }

  try {
    const logs = await LearningLog.find({ grade, name })
      .sort({ timestamp: -1 })
      .lean();

    const escape = (v = "") => `"${String(v).replace(/"/g, '""')}"`;

    const lines = [];
    lines.push(
      [
        "번호",
        "날짜시간",
        "시리즈",
        "단원코드",
        "핵심이해력",
        "구조파악력",
        "어휘맥락력",
        "추론·통합력",
        "비판·적용력",
      ]
        .map(escape)
        .join(",")
    );

    logs.forEach((log, idx) => {
      const ts = log.timestamp
        ? new Date(log.timestamp).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          })
        : "";

      const r = log.radar || {};

      lines.push(
        [
          idx + 1,
          ts,
          log.series || "",
          log.unit || "",
          r.literal ?? "",
          r.structural ?? "",
          r.lexical ?? "",
          r.inferential ?? "",
          r.critical ?? "",
        ]
          .map(escape)
          .join(",")
      );
    });

    const csvBody = lines.join("\r\n");
    const bom = "\uFEFF";

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="dandan_logs_${encodeURIComponent(
        grade + "_" + name
      )}_${new Date().toISOString().slice(0, 10)}.csv"`
    );

    res.send(bom + csvBody);
  } catch (err) {
    console.error("❌ /admin/logs-export 에러:", err);
    res.status(500).send("학습 이력 CSV 생성 중 오류가 발생했습니다.");
  }
});

// ===== 학생용 학습 이력 보기 (인증 불필요) =====
app.get("/my-learning", async (req, res) => {
  const { grade, name } = req.query;

  console.log("📊 [/my-learning] 요청:", { grade, name });

  if (!grade || !name) {
    console.log("❌ [/my-learning] 파라미터 부족");
    return res.status(400).send("grade, name 파라미터가 필요합니다.");
  }

  try {
    const logs = await LearningLog.find({ grade, name })
      .sort({ timestamp: -1 })
      .lean();

    console.log("✅ [/my-learning] 조회 결과:", logs.length, "개 기록");

    let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>나의 학습 분석 - ${grade} ${name}</title>
      <!-- html2canvas & jsPDF 라이브러리 -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          padding: 50px;
        }

        .header {
          text-align: center;
          margin-bottom: 50px;
          padding-bottom: 30px;
          border-bottom: 3px solid #e5d4c1;
        }

        h1 {
          font-size: 42px;
          font-weight: 800;
          color: #2c3e50;
          margin-bottom: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 18px;
          color: #7f8c8d;
          font-weight: 500;
        }

        .stats-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 28px;
          border-radius: 30px;
          font-size: 16px;
          font-weight: 600;
          margin: 30px 0;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .section-title {
          font-size: 28px;
          font-weight: 700;
          color: #2c3e50;
          margin: 40px 0 15px 0;
          padding-left: 15px;
          border-left: 5px solid #667eea;
        }

        .section-description {
          font-size: 15px;
          color: #7f8c8d;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        hr {
          border: none;
          border-top: 2px solid #e5d4c1;
          margin: 60px 0;
        }

        .table-container {
          overflow-x: auto;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 40px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        thead {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        th {
          color: white;
          padding: 18px 16px;
          text-align: center;
          font-weight: 600;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        td {
          padding: 16px;
          text-align: center;
          border-bottom: 1px solid #ecf0f1;
          font-size: 14px;
          color: #2c3e50;
        }

        tbody tr {
          transition: all 0.2s ease;
        }

        tbody tr:hover {
          background: linear-gradient(135deg, #f8f9ff 0%, #fff5f8 100%);
          transform: scale(1.01);
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        .hidden-row {
          display: none;
        }

        .hidden-card {
          display: none !important;
        }

        .toggle-btn {
          display: block;
          margin: 20px auto;
          padding: 12px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .toggle-btn:active {
          transform: translateY(0);
        }

        #radar-wrap, #summary-radar-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          justify-content: center;
          margin: 30px 0;
        }

        .radar-card {
          flex: 0 0 320px;
          border: 2px solid #e5d4c1;
          border-radius: 20px;
          padding: 24px;
          background: linear-gradient(135deg, #ffffff 0%, #fffaf3 100%);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .radar-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
        }

        .radar-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        }

        .radar-card.summary-card::before {
          background: linear-gradient(90deg, #f093fb 0%, #f5576c 50%, #e74c3c 100%) !important;
        }

        .radar-card.summary-card {
          border-color: #f5c6cb;
        }

        .radar-card.summary-card .stat-value {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }

        .radar-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .radar-card-title {
          font-size: 16px;
          font-weight: 700;
          color: #2c3e50;
        }

        .badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .badge-excellent {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
        }

        .badge-good {
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
          color: #333;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
        }

        .badge-normal {
          background: linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 154, 86, 0.4);
        }

        .badge-encourage {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        }

        .radar-card-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5d4c1;
        }

        .stat-item {
          text-align: center;
        }

        .stat-label {
          font-size: 11px;
          color: #95a5a6;
          margin-bottom: 4px;
          font-weight: 600;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-value.excellent {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-value.good {
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-value.normal {
          background: linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-value.encourage {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-grade {
          font-size: 11px;
          font-weight: 600;
          margin-top: 4px;
        }

        .stat-item .stat-grade.excellent {
          color: #4facfe;
        }

        .stat-item .stat-grade.good {
          color: #ffd700;
        }

        .stat-item .stat-grade.normal {
          color: #ff9a56;
        }

        .stat-item .stat-grade.encourage {
          color: #ff6b6b;
        }

        canvas {
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>나의 학습 분석</h1>
          <div class="subtitle">${grade} ${name} 학생</div>
        </div>

        <div style="text-align: center;">
          <span class="stats-badge">📚 총 ${logs.length}건의 학습 기록</span>
        </div>

        <div class="section-title">
          📝 학습 기록 목록
        </div>
        <p class="section-description">
          모든 학습 활동이 시간 순서대로 기록되어 있습니다.
        </p>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>날짜/시간</th>
                <th>등급</th>
                <th>시리즈</th>
                <th>단원명</th>
              </tr>
            </thead>
            <tbody>
    `;

    logs.forEach((log, idx) => {
      const ts = log.timestamp
        ? new Date(log.timestamp).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          })
        : "-";

      // 평균 점수 계산
      const r = log.radar || {};
      const scores = [r.literal, r.structural, r.lexical, r.inferential, r.critical].filter(s => s != null);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

      // 등급 결정
      let badgeClass = 'badge-normal';
      let badgeText = '보통';
      if (avgScore >= 9) {
        badgeClass = 'badge-excellent';
        badgeText = '우수';
      } else if (avgScore >= 8) {
        badgeClass = 'badge-good';
        badgeText = '양호';
      } else if (avgScore >= 7) {
        badgeClass = 'badge-normal';
        badgeText = '보통';
      } else {
        badgeClass = 'badge-encourage';
        badgeText = '격려';
      }

      // 단원 코드 → 단원명 변환 (예: geo_01 → 지리 01)
      let unitName = log.unit || "";
      if (unitName && unitName.includes('_')) {
        const parts = unitName.split('_');
        const subjectMap = { 'geo': '지리' };
        const subject = subjectMap[parts[0]] || parts[0];
        const number = parts[1] ? parts[1].replace(/^0+/, '') : ''; // 01 → 1
        unitName = subject + ' ' + number;
      }

      const hiddenClass = idx >= 10 ? ' class="hidden-row"' : '';
      html += `
        <tr${hiddenClass}>
          <td>${idx + 1}</td>
          <td>${ts}</td>
          <td><span class="badge ${badgeClass}">${badgeText}</span></td>
          <td>${log.series || ""}</td>
          <td>${unitName}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </div>
        ${logs.length > 10 ? '<button class="toggle-btn" id="toggleBtn" onclick="toggleRows()">더보기 ▼</button>' : ''}

        <hr>

        <div class="section-title">
          📊 과목별 종합 레이더
        </div>
        <p class="section-description">
          과목별로 모든 학습 데이터의 평균을 보여줍니다.<br/>
          (※ radar 데이터가 있는 기록들만 평균에 포함됩니다.)
        </p>

        <div id="summary-radar-wrap"></div>
        <button class="toggle-btn" id="toggleSummaryBtn" onclick="toggleSummaryRadar()" style="display:none;">더보기 ▼</button>

        <hr>

        <div class="section-title">
          🧠 단원별 문해력 레이더 차트
        </div>
        <p class="section-description">
          가장 최근 기록이 위에 오도록 정렬되어 있어요.<br/>
          (※ 아직 radar 데이터가 없는 기록은 그래프가 표시되지 않습니다.)
        </p>

        <div id="radar-wrap"></div>
        <button class="toggle-btn" id="toggleRadarBtn" onclick="toggleRadar()" style="display:none;">더보기 ▼</button>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script>
        // ===== 삭제 기능 (관리자 전용) =====
        function deleteLog(logId, key, grade, name) {
          if (!confirm('이 학습 기록을 삭제하시겠습니까?\\n\\n삭제된 항목은 휴지통에서 복구하실 수 있습니다.')) {
            return;
          }

          fetch(\`/admin/log/delete/\${logId}?key=\${encodeURIComponent(key)}\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              alert('삭제되었습니다. 페이지를 새로고침합니다.');
              window.location.reload();
            } else {
              alert('삭제 실패: ' + data.message);
            }
          })
          .catch(err => {
            alert('삭제 중 오류가 발생했습니다: ' + err.message);
          });
        }

        // ===== 학습 기록 더보기/접기 기능 =====
        function toggleRows() {
          const hiddenRows = document.querySelectorAll('.hidden-row');
          const toggleBtn = document.getElementById('toggleBtn');

          if (hiddenRows.length === 0) return;

          const isHidden = hiddenRows[0].style.display === 'none' || hiddenRows[0].style.display === '';

          hiddenRows.forEach(row => {
            row.style.display = isHidden ? 'table-row' : 'none';
          });

          toggleBtn.textContent = isHidden ? '접기 ▲' : '더보기 ▼';
        }

        // ===== 종합 레이더 더보기/접기 기능 =====
        function toggleSummaryRadar() {
          const allCards = document.querySelectorAll('#summary-radar-wrap .radar-card');
          const toggleBtn = document.getElementById('toggleSummaryBtn');
          const isExpanded = toggleBtn.textContent.includes('접기');

          allCards.forEach((card, index) => {
            if (index >= 6) {
              if (isExpanded) {
                card.classList.add('hidden-card');
              } else {
                card.classList.remove('hidden-card');
              }
            }
          });

          toggleBtn.textContent = isExpanded ? '더보기 ▼' : '접기 ▲';
        }

        // ===== 단원별 레이더 더보기/접기 기능 =====
        function toggleRadar() {
          const allCards = document.querySelectorAll('#radar-wrap .radar-card');
          const toggleBtn = document.getElementById('toggleRadarBtn');
          const isExpanded = toggleBtn.textContent.includes('접기');

          allCards.forEach((card, index) => {
            if (index >= 6) {
              if (isExpanded) {
                card.classList.add('hidden-card');
              } else {
                card.classList.remove('hidden-card');
              }
            }
          });

          toggleBtn.textContent = isExpanded ? '더보기 ▼' : '접기 ▲';
        }

        const logsForChart = ${JSON.stringify(logs)};

        // ===== 종합 레이더 차트 생성 =====
        const summaryWrap = document.getElementById('summary-radar-wrap');

        // 과목 코드 → 과목명 매핑
        const subjectNames = {
          'geo': '지리'
        };

        // 과목별로 그룹화 (unit 코드에서 과목 추출: geo, history 등)
        const subjectGroups = {};
        logsForChart.forEach(log => {
          if (!log.radar || !log.unit) return;

          // unit 코드에서 과목 추출 (geo_01 -> geo, history_01 -> history)
          const subjectCode = log.unit.split('_')[0];
          const subjectKey = (log.series || 'BRAIN업') + '_' + subjectCode;

          if (!subjectGroups[subjectKey]) {
            subjectGroups[subjectKey] = {
              series: log.series || 'BRAIN업',
              subjectCode: subjectCode,
              logs: []
            };
          }
          subjectGroups[subjectKey].logs.push(log);
        });

        // 각 과목별로 평균 계산 및 차트 생성
        let summaryIndex = 0;
        Object.keys(subjectGroups).forEach(key => {
          const group = subjectGroups[key];
          const seriesLogs = group.logs;
          const subjectName = subjectNames[group.subjectCode] || group.subjectCode;
          const displayTitle = group.series + ' ' + subjectName;

          // 평균 계산
          let totalLiteral = 0, totalStructural = 0, totalLexical = 0;
          let totalInferential = 0, totalCritical = 0;
          let count = 0;

          seriesLogs.forEach(log => {
            if (log.radar) {
              totalLiteral += log.radar.literal || 0;
              totalStructural += log.radar.structural || 0;
              totalLexical += log.radar.lexical || 0;
              totalInferential += log.radar.inferential || 0;
              totalCritical += log.radar.critical || 0;
              count++;
            }
          });

          if (count === 0) return;

          const avgLiteral = Math.round((totalLiteral / count) * 10) / 10;
          const avgStructural = Math.round((totalStructural / count) * 10) / 10;
          const avgLexical = Math.round((totalLexical / count) * 10) / 10;
          const avgInferential = Math.round((totalInferential / count) * 10) / 10;
          const avgCritical = Math.round((totalCritical / count) * 10) / 10;

          const scores = [avgLiteral, avgStructural, avgLexical, avgInferential, avgCritical];
          const avgScore = (scores.reduce((a, b) => a + b, 0) / 5).toFixed(1);
          const maxScore = Math.max(...scores).toFixed(1);
          const minScore = Math.min(...scores).toFixed(1);

          // 뱃지 등급 결정
          let badgeClass = 'badge-normal';
          let badgeText = '보통';
          if (avgScore >= 9) {
            badgeClass = 'badge-excellent';
            badgeText = '우수';
          } else if (avgScore >= 8) {
            badgeClass = 'badge-good';
            badgeText = '양호';
          } else if (avgScore >= 7) {
            badgeClass = 'badge-normal';
            badgeText = '보통';
          } else {
            badgeClass = 'badge-encourage';
            badgeText = '격려';
          }

          // 차트 카드 생성
          const card = document.createElement('div');
          card.className = 'radar-card summary-card' + (summaryIndex >= 6 ? ' hidden-card' : '');
          summaryIndex++;

          const header = document.createElement('div');
          header.className = 'radar-card-header';

          const title = document.createElement('div');
          title.className = 'radar-card-title';
          title.textContent = displayTitle;

          const badge = document.createElement('span');
          badge.className = 'badge ' + badgeClass;
          badge.textContent = badgeText;

          header.appendChild(title);
          header.appendChild(badge);
          card.appendChild(header);

          const canvas = document.createElement('canvas');
          card.appendChild(canvas);

          // 등급 클래스 결정
          let gradeClass = 'encourage';
          if (avgScore >= 9) gradeClass = 'excellent';
          else if (avgScore >= 8) gradeClass = 'good';
          else if (avgScore >= 7) gradeClass = 'normal';

          // 통계 정보 추가
          const stats = document.createElement('div');
          stats.className = 'radar-card-stats';
          stats.innerHTML =
            '<div class="stat-item">' +
              '<div class="stat-label">평균</div>' +
              '<div class="stat-value ' + gradeClass + '">' + avgScore + '</div>' +
              '<div class="stat-grade ' + gradeClass + '">' + badgeText + '</div>' +
            '</div>' +
            '<div class="stat-item">' +
              '<div class="stat-label">최고</div>' +
              '<div class="stat-value">' + maxScore + '</div>' +
            '</div>' +
            '<div class="stat-item">' +
              '<div class="stat-label">최저</div>' +
              '<div class="stat-value">' + minScore + '</div>' +
            '</div>';
          card.appendChild(stats);

          summaryWrap.appendChild(card);

          // 차트 생성
          new Chart(canvas.getContext('2d'), {
            type: 'radar',
            data: {
              labels: ['핵심 이해력', '구조 파악력', '어휘 맥락력', '추론·통합력', '비판·적용력'],
              datasets: [{
                label: displayTitle,
                data: scores,
                backgroundColor: 'rgba(245, 87, 108, 0.2)',
                borderColor: '#f5576c',
                borderWidth: 3,
                pointBackgroundColor: '#f5576c',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#f5576c',
                pointRadius: 5,
                pointHoverRadius: 7
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                r: {
                  beginAtZero: true,
                  max: 10,
                  ticks: {
                    stepSize: 2,
                    font: { size: 11 }
                  },
                  pointLabels: {
                    font: { size: 12, weight: 'bold' }
                  },
                  grid: { color: '#f5c6cb' },
                  angleLines: { color: '#f5c6cb' }
                }
              }
            }
          });
        });

        // 종합 레이더 차트 더보기 버튼 표시
        if (summaryIndex > 6) {
          document.getElementById('toggleSummaryBtn').style.display = 'block';
        }

        // ===== 개별 레이더 차트 생성 =====
        const radarWrap = document.getElementById('radar-wrap');
        let radarIndex = 0;

        logsForChart.forEach(function(log, idx) {
          if (!log.radar) return;

          const r = log.radar || {};

          // 통계 계산
          const scores = [
            r.literal || 0,
            r.structural || 0,
            r.lexical || 0,
            r.inferential || 0,
            r.critical || 0
          ];
          const avgScore = (scores.reduce((a, b) => a + b, 0) / 5).toFixed(1);
          const maxScore = Math.max(...scores).toFixed(1);
          const minScore = Math.min(...scores).toFixed(1);

          // 뱃지 등급 결정
          let badgeClass = 'badge-normal';
          let badgeText = '보통';
          if (avgScore >= 9) {
            badgeClass = 'badge-excellent';
            badgeText = '우수';
          } else if (avgScore >= 8) {
            badgeClass = 'badge-good';
            badgeText = '양호';
          } else if (avgScore >= 7) {
            badgeClass = 'badge-normal';
            badgeText = '보통';
          } else {
            badgeClass = 'badge-encourage';
            badgeText = '격려';
          }

          // 카드 생성
          const card = document.createElement('div');
          card.className = 'radar-card' + (radarIndex >= 6 ? ' hidden-card' : '');
          radarIndex++;

          const header = document.createElement('div');
          header.className = 'radar-card-header';

          const titleSection = document.createElement('div');
          titleSection.style.cssText = 'flex: 1; text-align: center;';

          const seriesLabel = document.createElement('div');
          seriesLabel.style.cssText = 'font-size: 11px; color: #95a5a6; margin-bottom: 4px;';
          seriesLabel.textContent = '📚 ' + (log.series || 'BRAIN업');

          const title = document.createElement('div');
          title.className = 'radar-card-title';

          // 단원 코드 → 단원명 변환 (예: geo_01 → 지리 01)
          let unitName = log.unit || '단원';
          if (unitName && unitName.includes('_')) {
            const parts = unitName.split('_');
            const subjectMap = { 'geo': '지리' };
            const subject = subjectMap[parts[0]] || parts[0];
            const number = parts[1] ? parts[1].replace(/^0+/, '') : ''; // 01 → 1
            unitName = subject + ' ' + number;
          }
          title.textContent = unitName + ' 분석';

          const timeLabel = document.createElement('div');
          timeLabel.className = 'radar-card-time';
          const ts = log.timestamp ? new Date(log.timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) : '-';
          timeLabel.innerHTML = '🕐 ' + ts;

          titleSection.appendChild(seriesLabel);
          titleSection.appendChild(title);
          titleSection.appendChild(timeLabel);

          const badge = document.createElement('span');
          badge.className = 'badge ' + badgeClass;
          badge.textContent = badgeText;

          header.appendChild(titleSection);
          header.appendChild(badge);
          card.appendChild(header);

          const canvas = document.createElement('canvas');
          card.appendChild(canvas);

          // 등급 클래스 결정
          let gradeClass = 'encourage';
          if (avgScore >= 9) gradeClass = 'excellent';
          else if (avgScore >= 8) gradeClass = 'good';
          else if (avgScore >= 7) gradeClass = 'normal';

          // 통계 정보 추가
          const stats = document.createElement('div');
          stats.className = 'radar-card-stats';
          stats.innerHTML =
            '<div class="stat-item">' +
              '<div class="stat-label">평균</div>' +
              '<div class="stat-value ' + gradeClass + '">' + avgScore + '</div>' +
              '<div class="stat-grade ' + gradeClass + '">' + badgeText + '</div>' +
            '</div>' +
            '<div class="stat-item">' +
              '<div class="stat-label">최고</div>' +
              '<div class="stat-value">' + maxScore + '</div>' +
            '</div>' +
            '<div class="stat-item">' +
              '<div class="stat-label">최저</div>' +
              '<div class="stat-value">' + minScore + '</div>' +
            '</div>';
          card.appendChild(stats);

          // 카드 클릭 시 해당 단원 페이지로 이동
          card.style.cursor = 'pointer';
          card.addEventListener('click', function() {
            const unitCode = log.unit; // 예: geo_01
            if (unitCode) {
              // 단원 코드로 페이지 URL 생성
              const unitUrl = '/BRAINUP/social/' + unitCode + '.html';
              window.open(unitUrl, '_blank');
            }
          });

          radarWrap.appendChild(card);

          // 차트 생성
          new Chart(canvas.getContext('2d'), {
            type: 'radar',
            data: {
              labels: ['핵심 이해력', '구조 파악력', '어휘 맥락력', '추론·통합력', '비판·적용력'],
              datasets: [{
                label: unitName + ' 분석리포트',
                data: scores,
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: '#667eea',
                borderWidth: 3,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#667eea',
                pointRadius: 5,
                pointHoverRadius: 7
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                r: {
                  beginAtZero: true,
                  max: 10,
                  ticks: {
                    stepSize: 2,
                    font: { size: 11 }
                  },
                  pointLabels: {
                    font: { size: 12, weight: 'bold' }
                  },
                  grid: { color: '#e5d4c1' },
                  angleLines: { color: '#e5d4c1' }
                }
              }
            }
          });
        });

        // 개별 레이더 차트 더보기 버튼 표시
        if (radarIndex > 6) {
          document.getElementById('toggleRadarBtn').style.display = 'block';
        }

        // PDF 다운로드 기능 (html2canvas + jsPDF 방식)
        console.log('📄 PDF 다운로드 리스너 등록됨');

        window.addEventListener('message', async function(event) {
          console.log('📨 메시지 수신:', event.data);

          if (event.data && event.data.action === 'downloadPDF') {
            console.log('✅ PDF 다운로드 시작');

            try {
              window.scrollTo(0, 0);
              const target = document.querySelector('.container');

              if (!target) {
                console.error('❌ 컨테이너 요소를 찾을 수 없습니다');
                alert('PDF 생성 실패: 컨텐츠를 찾을 수 없습니다.');
                return;
              }

              console.log('📦 컨테이너 요소 찾음:', target);

              const filename = \`학습분석_${grade}_${name}_\${new Date().toISOString().split('T')[0]}.pdf\`;
              console.log('📁 파일명:', filename);

              // html2canvas로 캡처 (용량 최적화)
              console.log('🎨 캔버스 생성 중...');
              const canvas = await html2canvas(target, {
                scale: 1.5, // 2 → 1.5로 낮춤 (용량 감소)
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false
              });

              console.log('✅ 캔버스 생성 완료:', canvas.width, 'x', canvas.height);

              // PNG 대신 JPEG 사용 (품질 0.7, 용량 대폭 감소)
              const imgData = canvas.toDataURL('image/jpeg', 0.7);
              console.log('📸 이미지 데이터 생성 완료 (JPEG, 품질 0.7)');

              // jsPDF로 PDF 생성
              const { jsPDF } = window.jspdf;
              const pdf = new jsPDF('p', 'mm', 'a4');
              const pdfW = pdf.internal.pageSize.getWidth();
              const pdfH = pdf.internal.pageSize.getHeight();

              const imgW = pdfW;
              const imgH = canvas.height * imgW / canvas.width;

              let heightLeft = imgH;
              let position = 0;

              console.log('📄 PDF 생성 중... (페이지 높이:', imgH, 'mm)');

              // 첫 페이지 (JPEG 형식 사용)
              pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
              heightLeft -= pdfH;

              // 추가 페이지
              while (heightLeft > 0) {
                position = heightLeft - imgH;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
                heightLeft -= pdfH;
              }

              // PDF 저장
              pdf.save(filename);
              console.log('✅ PDF 다운로드 완료!');

            } catch (error) {
              console.error('❌ PDF 생성 오류:', error);
              alert('PDF 생성 중 오류가 발생했습니다: ' + error.message);
            }
          }
        });

        // 라이브러리 로드 확인
        window.addEventListener('load', function() {
          console.log('📚 페이지 로드 완료');
          console.log('📚 html2canvas:', typeof html2canvas);
          console.log('📚 jsPDF:', typeof window.jspdf);
        });
      </script>

    </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("❌ /my-learning 에러:", err);
    res.status(500).send("학습 이력 조회 중 오류가 발생했습니다.");
  }
});

// ===== 휴지통 회원 목록 (슈퍼관리자 전용) =====
// ===== 휴지통 회원 목록 (슈퍼관리자 + 브랜치 공용) =====
app.get("/admin/trash", async (req, res) => {
  const { key, view } = req.query;   // ✅ view 추가

  if (key !== ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }

  try {
    const users = await User.find({ deleted: true })
      .sort({ deletedAt: -1 })
      .lean();

    // ✅ 어디로 돌아갈지 결정 (브랜치에서 온 경우 /admin/branch/users)
    const backHref =
      view === "branch"
        ? "/admin/branch/users"
        : `/admin/users?key=${encodeURIComponent(key)}`;

    let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>휴지통 회원 목록</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif; padding: 20px; }
        h1 { margin-bottom: 8px; }
        .small { font-size: 12px; color: #666; margin-bottom: 16px; }
        table { border-collapse: collapse; width: 100%; max-width: 960px; }
        th, td { border: 1px solid #ddd; padding: 8px 10px; font-size: 14px; }
        th { background: #f5f2eb; text-align: left; }
        tr:nth-child(even) { background: #faf7f0; }
        a.btn-restore { color: #1565c0; text-decoration: none; font-size: 12px; }
        a.btn-restore:hover { text-decoration: underline; }
        a.btn-delete { color: #b00020; text-decoration: none; font-size: 12px; }
        a.btn-delete:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>휴지통 (${users.length}명)</h1>
      <p class="small">
        <a href="${backHref}">← 회원 목록으로 돌아가기</a>
      </p>
      <p class="small">
        ※ 휴지 상태 회원은 로그인할 수 없습니다. 필요할 때만 <b>복구</b> 또는 <b>완전 삭제</b>를 사용하세요.
      </p>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>학년</th>
            <th>학원명</th>
            <th>이름</th>
            <th>전화번호(ID)</th>
            <th>휴지로 보낸 시각</th>
            <th>복구</th>
            <th>완전 삭제</th>
          </tr>
        </thead>
        <tbody>
    `;

    users.forEach((u, idx) => {
      const idOrPhone = u.id || u.phone || "";
      const deletedAt = u.deletedAt
        ? new Date(u.deletedAt).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          })
        : "-";

      // ✅ 브랜치에서 온 경우 view=branch 를 계속 붙여준다
      const viewQuery = view ? `&view=${encodeURIComponent(view)}` : "";

      html += `
        <tr>
          <td>${idx + 1}</td>
          <td>${u.grade || ""}</td>
          <td>${u.school || ""}</td>
          <td>${u.name || ""}</td>
          <td>${idOrPhone}</td>
          <td>${deletedAt}</td>
          <td>
            <a class="btn-restore"
               href="/admin/trash-restore?id=${encodeURIComponent(
                 idOrPhone
               )}&key=${encodeURIComponent(key)}${viewQuery}">
              복구
            </a>
          </td>
          <td>
            <a class="btn-delete"
               href="/admin/trash-delete?id=${encodeURIComponent(
                 idOrPhone
               )}&key=${encodeURIComponent(
        key
      )}${viewQuery}"
               onclick="return confirm('정말 완전 삭제할까요? [${u.name} / ${idOrPhone}]\\n복구할 수 없습니다.');">
              완전 삭제
            </a>
          </td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("❌ /admin/trash 에러:", err);
    res.status(500).send("휴지통 조회 중 오류 발생");
  }
});


// ===== 휴지통 회원 복구 =====
// ===== 휴지통 회원 복구 =====
app.get("/admin/trash-restore", async (req, res) => {
  const { id: rawId, key, view } = req.query;

  if (key !== ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }
  if (!rawId) return res.status(400).send("id 파라미터가 필요합니다.");

  const id = String(rawId).trim();

  try {
    const user = await User.findOne({
      $or: [{ id }, { phone: id }],
      deleted: true,
    });

    if (!user) {
      return res.status(404).send("휴지통에서 찾을 수 없는 사용자입니다.");
    }

    user.deleted = false;
    user.deletedAt = null;
    await user.save();

    console.log("✅ 휴지 복구 완료:", user.name, user.id || user.phone);

    const viewQuery = view ? `&view=${encodeURIComponent(view)}` : "";
    res.redirect(`/admin/trash?key=${encodeURIComponent(key)}${viewQuery}`);
  } catch (err) {
    console.error("❌ /admin/trash-restore 에러:", err);
    res.status(500).send("휴지 복구 중 오류 발생");
  }
});


// ===== 휴지통 회원 완전 삭제 =====
// ===== 휴지통 회원 완전 삭제 =====
app.get("/admin/trash-delete", async (req, res) => {
  const { id: rawId, key, view } = req.query;

  if (key !== ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }
  if (!rawId) return res.status(400).send("id 파라미터가 필요합니다.");

  const id = String(rawId).trim();

  try {
    const user = await User.findOne({
      $or: [{ id }, { phone: id }],
      deleted: true,
    });

    if (!user) {
      return res.status(404).send("휴지통에서 찾을 수 없는 사용자입니다.");
    }

    await User.deleteOne({ _id: user._id });

    console.log("🗑 완전 삭제 완료:", user.name, user.id || user.phone);

    const viewQuery = view ? `&view=${encodeURIComponent(view)}` : "";
    res.redirect(`/admin/trash?key=${encodeURIComponent(key)}${viewQuery}`);
  } catch (err) {
    console.error("❌ /admin/trash-delete 에러:", err);
    res.status(500).send("완전 삭제 중 오류 발생");
  }
});


// ✅ 로그아웃 처리 (AJAX용 - 학생/관리자 공통 세션 삭제)
app.post("/logout", (req, res) => {
  console.log("📤 [POST] /logout 호출");

  if (!req.session) {
    return res.json({ ok: true });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("❌ 세션 삭제 오류:", err);
      return res.status(500).json({ ok: false, message: "세션 삭제 실패" });
    }

    res.clearCookie("connect.sid");
    return res.json({ ok: true });
  });
});

// ✅ 학생 로그인 처리 (lastLogin 기록 + 휴지/승인 상태 체크)
// ✅ 학생 로그인 처리
app.post("/login", async (req, res) => {
  try {
    const { grade, name, phone } = req.body;
    const cleanPhone = String(phone || "").trim();

    console.log("📥 [POST] /login:", grade, name, cleanPhone);

    // 필수값 없으면 바로 실패
    if (!grade || !name || !cleanPhone) {
      return res.redirect("/?loginError=1");
    }

    // ✅ 기존/신규 모두 커버:
    //  - pw = 전화번호
    //  - phone = 전화번호
    //  - id   = 전화번호 (옛 구조)
    const user = await User.findOne({
      grade,
      name,
      deleted: { $ne: true },
      $or: [
        { pw: cleanPhone },
        { phone: cleanPhone },
        { id: cleanPhone },
      ],
    });

    if (!user) {
      console.log("❌ 로그인 실패: 해당 학생 없음");
      return res.redirect("/?loginError=1");
    }

    // 🔹 지점 통째로 휴지(브랜치 삭제)된 경우
    if (user.branchDeleted) {
      console.log("🚫 브랜치 휴지 상태 계정:", user.name);
      return res.redirect("/?loginError=trashed");
    }

    // 🔹 개인 계정 휴지 상태
    if (user.deleted) {
      console.log("🚫 휴지 상태 계정:", user.name);
      return res.redirect("/?loginError=trashed");
    }

    // 🔹 승인 대기 상태(pending)면 전용 팝업
    if (user.status && user.status !== "approved") {
      console.log("⏳ 승인 대기 계정:", user.name);
      return res.redirect("/?loginError=pending");
    }

    // ✅ 여기까지 왔으면 정상 로그인
req.session.user = {
  _id: user._id,
  name: user.name,
  grade: user.grade,
  school: user.school || user.academyName || "",
  role: "student",
  assignedSeries: user.assignedSeries || [],
};

await User.updateOne(
  { _id: user._id },
  { $set: { lastLogin: new Date() } }
);

// ❗ 실제로 들어갈 메인/목차 페이지 경로
const NEXT_URL = "/menu.html"; 
// 만약 네가 바로 geo_01로 보내고 싶으면 "/geo_01.html" 처럼 수정

// 🔥 로딩 페이지로 먼저 이동 → 로딩이 끝나면 JS가 NEXT_URL로 보내줌
return res.redirect(
  "/loading.html?to=" + encodeURIComponent(NEXT_URL)
);


    console.log("✅ 로그인 성공:", user.name, user.grade, user.school);

    // 🔥 여기를 네 목차(메인) 페이지 경로로!
    return res.redirect("/menu.html");
    // 예) return res.redirect("/brain-main.html");
  } catch (err) {
    console.error("❌ /login 처리 중 오류:", err);
    return res.redirect("/?loginError=1");
  }
});

// ✅ 세션 정보 조회 API (클라이언트에서 사용)
app.get("/api/session", (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ ok: true, user: req.session.user });
  } else {
    return res.json({ ok: false, user: null });
  }
});

// ✅ 맞춤법 검사 API
app.post("/api/spell-check", async (req, res) => {
  console.log("✅ [POST] /api/spell-check 호출");

  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "텍스트를 입력해주세요." });
  }

  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    console.log("🤖 OpenAI API로 맞춤법 검사 시작...");

    // OpenAI API 호출
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "당신은 한국어 맞춤법 및 띄어쓰기 전문가입니다. 주어진 텍스트의 맞춤법과 띄어쓰기 오류를 찾아 수정해주세요."
        },
        {
          role: "user",
          content: `다음 텍스트의 맞춤법과 띄어쓰기 오류를 찾아주세요. 오류가 있다면 JSON 형식으로 응답하고, 없다면 "오류 없음"이라고만 답해주세요.

텍스트: "${text}"

JSON 형식:
{
  "has_errors": true,
  "errors": [
    {"wrong": "잘못된부분", "correct": "올바른부분", "type": "띄어쓰기" or "맞춤법"}
  ],
  "corrected_text": "전체 수정된 텍스트"
}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const aiResponse = response.choices[0].message.content;
    console.log("🤖 OpenAI 응답:", aiResponse.substring(0, 200));

    // "오류 없음" 응답 처리
    if (aiResponse.includes("오류 없음") || aiResponse.includes("오류가 없")) {
      console.log("✅ 맞춤법 검사 완료: 오류 없음");
      return res.json({
        errata_count: 0,
        origin_html: text,
        html: text,
        notag_html: text
      });
    }

    // JSON 응답 파싱
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);

      if (result.has_errors && result.errors && result.errors.length > 0) {
        let htmlText = text;
        let correctedHtml = result.corrected_text || text;

        // 오류 부분에 빨간 밑줄 추가
        result.errors.forEach(error => {
          const wrongText = error.wrong;
          htmlText = htmlText.replace(
            new RegExp(wrongText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            `<span class="highlight-wrong">${wrongText}</span>`
          );

          // 수정된 텍스트에 녹색 하이라이트 추가
          const correctText = error.correct;
          correctedHtml = correctedHtml.replace(
            new RegExp(correctText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            `<span class="highlight-correct">${correctText}</span>`
          );
        });

        console.log(`✅ 맞춤법 검사 완료: ${result.errors.length}개 오류 발견`);

        return res.json({
          errata_count: result.errors.length,
          origin_html: text,
          html: htmlText,
          notag_html: result.corrected_text || text,
          corrected_html: correctedHtml,
          errors: result.errors
        });
      }
    }

    // JSON 파싱 실패 또는 오류 없음
    console.log("✅ 맞춤법 검사 완료: 오류 없음");
    res.json({
      errata_count: 0,
      origin_html: text,
      html: text,
      notag_html: text
    });

  } catch (err) {
    console.error("❌ /api/spell-check 에러:", err.message);
    // 에러 시에도 원본 텍스트 반환
    res.json({
      errata_count: 0,
      origin_html: text,
      html: text,
      notag_html: text
    });
  }
});

// ✅ DB 테스트
app.get("/dbtest", async (req, res) => {
  console.log("✅ [GET] /dbtest 호출");
  try {
    const count = await User.countDocuments();
    res.send(`현재 MongoDB에 저장된 사용자 수: ${count}명`);
  } catch (err) {
    console.error("❌ /dbtest 에러:", err);
    res.status(500).send("DB 조회 실패: " + err.message);
  }
});

// ===== 학습 기록 삭제 (소프트 삭제) =====
app.post("/admin/log/delete/:id", async (req, res) => {
  const { key } = req.query;
  const { id } = req.params;

  if (key !== ADMIN_KEY) {
    return res.status(403).json({ success: false, message: "관리자 인증 실패" });
  }

  try {
    const result = await LearningLog.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: "기록을 찾을 수 없습니다" });
    }

    res.json({ success: true, message: "삭제되었습니다" });
  } catch (err) {
    console.error("삭제 오류:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== 휴지통 보기 (학습 기록) =====
app.get("/admin/logs/trash", async (req, res) => {
  const { key, grade, name } = req.query;

  if (key !== ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패");
  }

  if (!grade || !name) {
    return res.status(400).send("grade, name 파라미터가 필요합니다.");
  }

  try {
    const deletedLogs = await LearningLog.find({ grade, name, deleted: true })
      .sort({ timestamp: -1 })
      .lean();

    let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>휴지통 - ${grade} ${name}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          padding: 50px;
        }
        h1 {
          font-size: 36px;
          color: #2c3e50;
          margin-bottom: 30px;
          text-align: center;
        }
        .btn {
          display: inline-block;
          padding: 12px 28px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin: 10px;
        }
        .btn-back {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .btn-restore {
          background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
          color: white;
          border: none;
          cursor: pointer;
        }
        .btn-permanent-delete {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          color: white;
          border: none;
          cursor: pointer;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 30px;
        }
        th, td {
          padding: 16px;
          text-align: left;
          border-bottom: 1px solid #ecf0f1;
        }
        th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🗑️ 휴지통</h1>
        <div style="text-align: center; margin-bottom: 30px;">
          <a class="btn btn-back" href="/admin/logs?key=${encodeURIComponent(key)}&grade=${encodeURIComponent(grade)}&name=${encodeURIComponent(name)}">← 돌아가기</a>
        </div>
        <p style="text-align: center; color: #7f8c8d; margin-bottom: 20px;">총 ${deletedLogs.length}개의 삭제된 항목</p>
        <table>
          <thead>
            <tr>
              <th>날짜/시간</th>
              <th>시리즈</th>
              <th>단원</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
    `;

    deletedLogs.forEach(log => {
      const ts = log.timestamp
        ? new Date(log.timestamp).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
        : "-";

      html += `
        <tr>
          <td>${ts}</td>
          <td>${log.series || ""}</td>
          <td>${log.unit || ""}</td>
          <td>
            <button class="btn btn-restore" onclick="restoreLog('${log._id}', '${encodeURIComponent(key)}', '${encodeURIComponent(grade)}', '${encodeURIComponent(name)}')">복구</button>
            <button class="btn btn-permanent-delete" onclick="permanentDelete('${log._id}', '${encodeURIComponent(key)}', '${encodeURIComponent(grade)}', '${encodeURIComponent(name)}')">완전 삭제</button>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
      <script>
        function restoreLog(logId, key, grade, name) {
          if (!confirm('이 항목을 복구하시겠습니까?')) return;

          fetch('/admin/log/restore/' + logId + '?key=' + key, {
            method: 'POST'
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              alert('복구되었습니다.');
              window.location.reload();
            } else {
              alert('복구 실패: ' + data.message);
            }
          })
          .catch(err => alert('오류: ' + err.message));
        }

        function permanentDelete(logId, key, grade, name) {
          if (!confirm('정말로 완전히 삭제하시겠습니까?\\n\\n이 작업은 되돌릴 수 없습니다!')) return;

          fetch('/admin/log/permanent-delete/' + logId + '?key=' + key, {
            method: 'DELETE'
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              alert('완전히 삭제되었습니다.');
              window.location.reload();
            } else {
              alert('삭제 실패: ' + data.message);
            }
          })
          .catch(err => alert('오류: ' + err.message));
        }
      </script>
    </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("휴지통 조회 오류:", err);
    res.status(500).send("오류: " + err.message);
  }
});

// ===== 복구 =====
app.post("/admin/log/restore/:id", async (req, res) => {
  const { key } = req.query;
  const { id } = req.params;

  if (key !== ADMIN_KEY) {
    return res.status(403).json({ success: false, message: "관리자 인증 실패" });
  }

  try {
    const result = await LearningLog.findByIdAndUpdate(
      id,
      { deleted: false },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: "기록을 찾을 수 없습니다" });
    }

    res.json({ success: true, message: "복구되었습니다" });
  } catch (err) {
    console.error("복구 오류:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== 완전 삭제 =====
app.delete("/admin/log/permanent-delete/:id", async (req, res) => {
  const { key } = req.query;
  const { id } = req.params;

  if (key !== ADMIN_KEY) {
    return res.status(403).json({ success: false, message: "관리자 인증 실패" });
  }

  try {
    const result = await LearningLog.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ success: false, message: "기록을 찾을 수 없습니다" });
    }

    res.json({ success: true, message: "완전히 삭제되었습니다" });
  } catch (err) {
    console.error("완전 삭제 오류:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== AI 챗봇 API =====
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { message, scenario, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: "메시지가 필요합니다" });
    }

    // 시나리오별 시스템 프롬프트
    const systemPrompts = {
      grammar: `당신은 친절한 국어 선생님입니다. 학생들의 맞춤법, 문법, 띄어쓰기를 교정하고 올바른 표현을 가르쳐주세요.

⚠️ 중요: 답변 형식 규칙 (반드시 준수)
- 한 번에 모든 오류를 지적하지 말고, 가장 중요한 1~2개만 먼저 알려주세요
- 개조식으로 최대 2~3개 항목만 제시하세요
- 간단히 설명한 후 "이해했나요?" 또는 "연습해볼까요?" 같은 질문으로 끊으세요
- 대화형으로 단계적으로 교정하세요

예시:
✅ "잘 썼어요! 다만 2가지만 고쳐볼까요?

1. "안되요" → "안 돼요" (띄어쓰기 필요)
2. "됬어요" → "됐어요" (맞춤법)

먼저 이것부터 고쳐볼까요?"

교정 내용:
- 잘못된 표현을 발견하면 친절하게 지적하고 올바른 표현을 알려주세요
- "되"와 "돼", "안되"와 "안 돼" 같은 자주 틀리는 맞춤법을 교정해주세요
- 존댓말 사용을 칭찬해주세요
- 완전한 문장 작성을 격려해주세요`,

      writing: `당신은 글쓰기를 지도하는 선생님입니다. 학생들이 일기, 편지, 이야기를 쓸 수 있도록 도와주세요.

⚠️ 중요: 답변 형식 규칙 (반드시 준수)
- 한 번에 모든 피드백을 주지 말고, 1~2가지만 먼저 제안하세요
- 개조식으로 최대 2~3개 항목만 제시하세요
- 간단한 칭찬 후 개선점 1~2개만 알려주고 질문으로 끊으세요
- 대화형으로 단계적으로 지도하세요

예시:
✅ "재미있는 이야기네요! 2가지만 더 좋게 만들어볼까요?

1. 주인공의 감정을 더 구체적으로 표현해보기
2. 대화 장면 추가하기

이 중에서 어떤 걸 먼저 연습해볼까요?"

교정 내용:
- 학생의 글을 읽고 구체적인 피드백을 주세요
- 문장 구조와 표현을 개선하는 방법을 알려주세요
- 창의적인 글쓰기를 격려해주세요`,

      reading: `당신은 독해력을 키워주는 선생님입니다. 학생들이 글을 읽고 이해하도록 도와주세요.

⚠️ 중요: 답변 형식 규칙 (반드시 준수)
- 한 번에 여러 질문을 하지 말고, 1~2개만 먼저 물어보세요
- 개조식으로 최대 2~3개 항목만 제시하세요
- 간단히 설명한 후 학생의 이해도를 확인하는 질문으로 끊으세요
- 대화형으로 단계적으로 독해력을 키워주세요

예시:
✅ "이 글의 핵심을 찾는 2가지 방법이 있어요:

1. 반복되는 단어나 주제 찾기
2. 첫 문장과 마지막 문장 주목하기

이 방법으로 다시 읽어볼래요?"

교정 내용:
- 짧은 글을 제시하고 내용 이해 질문을 해주세요
- 요약하는 방법을 가르쳐주세요
- 글의 주제와 핵심을 찾는 법을 알려주세요`,

      vocabulary: `당신은 어휘력을 키워주는 선생님입니다. 학생들에게 새로운 단어와 표현을 가르쳐주세요.

⚠️ 중요: 답변 형식 규칙 (반드시 준수)
- 한 번에 여러 단어를 가르치지 말고, 1~2개만 먼저 알려주세요
- 개조식으로 최대 2~3개 항목만 제시하세요
- 단어 설명과 예문을 간단히 준 후 "이해했나요?" 같은 질문으로 끊으세요
- 대화형으로 단계적으로 어휘를 확장하세요

예시:
✅ "오늘은 '배려'라는 단어를 배워볼까요?

• **뜻**: 다른 사람을 생각하고 도와주는 마음
• **예문**: "친구를 배려하는 마음이 중요해요"

문장을 하나 만들어볼래요?"

교정 내용:
- 새로운 단어를 소개하고 예문과 함께 설명해주세요
- 속담과 관용구를 알려주세요
- 유의어와 반의어를 함께 가르쳐주세요`,

      conversation: `당신은 학생들과 자유롭게 대화하며 국어 실력을 키워주는 선생님입니다.

⚠️ 중요: 답변 형식 규칙 (반드시 준수)
- 답변은 최대 3개 문장 이내로 제한하세요
- 한 번에 모든 것을 설명하지 말고, 핵심만 간단히 말한 후 학생의 반응을 기다리세요
- 질문이 복잡하면 1~2개 포인트만 먼저 설명하고, "먼저 이것만 이해했나요?" 같은 질문으로 끊으세요
- 개조식(불릿, 번호)으로 작성할 때도 최대 2~3개 항목만 제시하세요
- 대화형으로 학생과 주고받으며 단계적으로 설명하세요

예시:
❌ 나쁜 답변: "국어를 잘하려면 1.읽기 2.쓰기 3.듣기 4.말하기를 모두 연습해야 해요. 먼저 책을 많이 읽고..."
✅ 좋은 답변: "좋은 질문이에요! 국어 실력을 키우는 방법 중 가장 중요한 것 2가지를 알려줄게요:

1. **매일 책 읽기**: 다양한 책을 읽으며 어휘력 향상
2. **글쓰기 연습**: 일기나 짧은 글쓰기로 표현력 키우기

이 중에서 어떤 것부터 시작해보고 싶나요?"

교정 내용:
- 학생의 이야기를 경청하고 공감해주세요
- 자연스러운 대화를 통해 표현력을 키워주세요
- 적절한 어휘와 표현을 사용하도록 격려해주세요`
    };

    const systemPrompt = systemPrompts[scenario] || systemPrompts.conversation;

    // 대화 히스토리 구성
    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: message }
    ];

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    // 피드백 분석 (간단한 버전)
    const feedbacks = [];

    // 맞춤법 검사
    if (message.includes('됬어') || message.includes('됬다')) {
      feedbacks.push({
        type: 'correction',
        title: '❌ 맞춤법 오류',
        message: '"됬어"는 잘못된 표현이에요. "됐어" 또는 "되었어"가 맞아요!'
      });
    }

    if (message.includes('않되') || message.includes('안되')) {
      feedbacks.push({
        type: 'correction',
        title: '❌ 띄어쓰기 오류',
        message: '"안되"는 "안 돼" 또는 "안 되어"로 띄어 써야 해요!'
      });
    }

    // 긍정적 피드백
    if (message.length > 15 && (message.includes('.') || message.includes('!') || message.includes('?'))) {
      feedbacks.push({
        type: 'praise',
        title: '🌟 훌륭해요!',
        message: '완전한 문장을 문장부호와 함께 잘 작성했어요!'
      });
    }

    if ((message.includes('요') || message.includes('습니다')) && message.length > 5) {
      feedbacks.push({
        type: 'praise',
        title: '👍 예의바른 표현',
        message: '존댓말을 정확하게 사용했어요!'
      });
    }

    res.json({
      success: true,
      response: aiResponse,
      feedbacks: feedbacks
    });

  } catch (error) {
    console.error("AI 챗봇 오류:", error);
    res.status(500).json({
      success: false,
      error: "AI 응답 생성 중 오류가 발생했습니다",
      details: error.message
    });
  }
});

// 영어 챗봇 API
app.post("/api/ai-english-chat", async (req, res) => {
  try {
    const { message, scenario, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: "메시지가 필요합니다" });
    }

    // 시나리오별 시스템 프롬프트
    const systemPrompts = {
      cafe: `You are a friendly barista at a coffee shop. Help students practice ordering coffee in English.
- Keep responses natural and conversational
- Gently correct grammar mistakes
- Encourage polite expressions like "I'd like" instead of "I want"
- Ask follow-up questions about size, temperature, etc.`,

      shopping: `You are a helpful store employee. Help students practice shopping in English.
- Be friendly and helpful
- Teach vocabulary related to shopping (colors, sizes, prices)
- Encourage polite requests
- Offer to show products or help with fitting`,

      airport: `You are an airport staff member. Help students practice airport-related English.
- Use professional but friendly language
- Teach airport vocabulary (gate, boarding, check-in, etc.)
- Keep responses clear and simple
- Help with common airport situations`,

      friend: `You are a friendly peer having a casual conversation. Help students practice everyday English.
- Use casual, natural language
- Talk about everyday topics (hobbies, school, plans, etc.)
- Encourage natural conversation flow
- Be supportive and encouraging`,

      free: `You are an English tutor having a conversation with students. Adapt to their interests and needs.
- Be flexible and responsive to their topics
- Provide gentle corrections when needed
- Encourage them to express themselves
- Make learning fun and engaging`
    };

    const systemPrompt = systemPrompts[scenario] || systemPrompts.free;

    // 대화 히스토리 구성
    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: message }
    ];

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    // 피드백 분석
    const feedbacks = [];

    // 정중한 표현 체크
    if (message.toLowerCase().includes("i'd like") || message.toLowerCase().includes("could you") || message.toLowerCase().includes("would you")) {
      feedbacks.push({
        type: 'praise',
        title: '👍 Perfect!',
        message: 'Great use of polite expressions!'
      });
    }

    // 문법 제안
    if (message.toLowerCase().includes("i want") && scenario !== 'friend') {
      feedbacks.push({
        type: 'correction',
        title: '💡 Tip',
        message: 'Try using "I\'d like" instead of "I want" for a more polite request.'
      });
    }

    if (!message.toLowerCase().includes("please") && (message.toLowerCase().includes("give me") || message.toLowerCase().includes("show me"))) {
      feedbacks.push({
        type: 'correction',
        title: '💡 Tip',
        message: 'Adding "please" makes your request more polite!'
      });
    }

    // 완전한 문장 칭찬
    if (message.split(' ').length > 5) {
      feedbacks.push({
        type: 'praise',
        title: '🌟 Excellent!',
        message: 'You used a complete sentence!'
      });
    }

    res.json({
      success: true,
      response: aiResponse,
      feedbacks: feedbacks
    });

  } catch (error) {
    console.error("AI English 챗봇 오류:", error);
    res.status(500).json({
      success: false,
      error: "AI 응답 생성 중 오류가 발생했습니다",
      details: error.message
    });
  }
});

// ===== 서버 시작 =====
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas 연결 성공");
    app.listen(PORT, () => {
      console.log(`✅ 서버 실행 중: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB 연결 실패:", err);
  });