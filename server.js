require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const ADMIN_KEY = process.env.ADMIN_KEY;

const PORT = process.env.PORT || 3000;
const USERS_FILE = "users.json";
const MONGO_URI = process.env.MONGODB_URI;

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
      academyName,
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
  branchDeleted: { type: Boolean, default: false }
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


// ===== 학습 이력 로그 스키마 =====
const learningLogSchema = new mongoose.Schema({
  grade: { type: String, required: true },
  name: { type: String, required: true },
  school: { type: String, default: "" },
  series: { type: String, default: "" }, // 예: '정조편_지리'
  unit: { type: String, required: true }, // 예: 'geo_01'
  radar: {
    literal: { type: Number, default: 0 }, // 핵심 이해력
    structural: { type: Number, default: 0 }, // 구조 파악력
    lexical: { type: Number, default: 0 }, // 어휘 맥락력
    inferential: { type: Number, default: 0 }, // 추론·통합력
    critical: { type: Number, default: 0 }, // 비판·적용력
  },
  timestamp: { type: Date, default: Date.now }, // 기록 시각
});
const LearningLog = mongoose.model("LearningLog", learningLogSchema);

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
    const { grade, name, school, series, unit, radar } = req.body;

    if (!grade || !name || !unit) {
      return res.status(400).json({ ok: false, message: "필수 정보 부족" });
    }

    await LearningLog.create({
      grade,
      name,
      school: school || "",
      series: series || "",
      unit,
      radar: radar || undefined,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("[/api/log] error:", err);
    res.status(500).json({ ok: false });
  }
});

// ===== 학습 이력 보기 (슈퍼관리자 전용) =====
app.get("/admin/logs", async (req, res) => {
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

    let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>학습 이력 - ${grade} ${name}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif; padding: 20px; }
        h1 { margin-bottom: 8px; }
        .small { font-size: 12px; color: #666; margin-bottom: 16px; }
        table { border-collapse: collapse; width: 100%; max-width: 960px; }
        th, td { border: 1px solid #ddd; padding: 8px 10px; font-size: 14px; }
        th { background: #f5f2eb; text-align: left; }
        tr:nth-child(even) { background: #faf7f0; }
        .btn-back { font-size: 13px; margin-right: 8px; }

        #radar-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          margin-top: 16px;
        }
        .radar-card {
          flex: 0 0 260px;
          border: 1px solid #e5d4c1;
          border-radius: 8px;
          padding: 10px;
          background: #fffaf3;
        }
        .radar-card-header {
          font-size: 14px;
          margin-bottom: 6px;
        }
        .radar-card-header span {
          color: #777;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <h1>학습 이력 — ${grade} ${name}</h1>
      <p class="small">
        <a class="btn-back" href="/admin/users?key=${encodeURIComponent(
          key
        )}">← 회원 목록으로 돌아가기</a>
        <a href="/admin/logs-export?key=${encodeURIComponent(
          key
        )}&grade=${encodeURIComponent(grade)}&name=${encodeURIComponent(name)}">
          학습 이력 CSV 다운로드
        </a>
      </p>

      <p class="small">총 ${logs.length}건의 기록이 있습니다.</p>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>날짜/시간</th>
            <th>시리즈</th>
            <th>단원 코드</th>
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

      html += `
        <tr>
          <td>${idx + 1}</td>
          <td>${ts}</td>
          <td>${log.series || ""}</td>
          <td>${log.unit || ""}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>

      <hr style="margin:40px 0; border:none; border-top:1px solid #e5d4c1;">

      <h3>🧠 단원별 문해력 레이더 차트</h3>
      <p class="small">
        가장 최근 기록이 위에 오도록 정렬되어 있어요.<br/>
        (※ 아직 radar 데이터가 없는 기록은 그래프가 표시되지 않습니다.)
      </p>

      <div id="radar-wrap"></div>

      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script>
        const logsForChart = ${JSON.stringify(logs)};

        const wrap = document.getElementById('radar-wrap');

        logsForChart.forEach(function(log, idx) {
          if (!log.radar) return;

          const card = document.createElement('div');
          card.className = 'radar-card';

          const header = document.createElement('div');
          header.className = 'radar-card-header';

          const title = document.createElement('strong');
          title.textContent = (log.unit || '단원 미지정') + ' 분석 리포트';

          const time = document.createElement('div');
          time.innerHTML = '<span>' + (log.timestamp ? new Date(log.timestamp).toLocaleString('ko-KR') : '-') + '</span>';

          header.appendChild(title);
          header.appendChild(time);
          card.appendChild(header);

          const canvas = document.createElement('canvas');
          canvas.id = 'radar-' + idx;
          canvas.width = 260;
          canvas.height = 260;
          card.appendChild(canvas);

          wrap.appendChild(card);

          const r = log.radar || {};

          new Chart(canvas.getContext('2d'), {
            type: 'radar',
            data: {
              labels: ['핵심 이해력', '구조 파악력', '어휘 맥락력', '추론·통합력', '비판·적용력'],
              datasets: [{
                label: (log.unit || '단원') + ' 분석리포트',
                data: [
                  r.literal || 0,
                  r.structural || 0,
                  r.lexical || 0,
                  r.inferential || 0,
                  r.critical || 0
                ],
                backgroundColor: 'rgba(139,47,47,0.18)',
                borderColor: '#8b2f2f',
                borderWidth: 2,
                pointBackgroundColor: '#8b2f2f'
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
                    backdropColor: 'transparent'
                  },
                  grid: { color: '#e5d4c1' },
                  angleLines: { color: '#e5d4c1' }
                }
              }
            }
          });
        });
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
