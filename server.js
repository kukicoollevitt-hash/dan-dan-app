require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const ADMIN_KEY = process.env.ADMIN_KEY;

const PORT = process.env.PORT || 3000;
const USERS_FILE = "users.json";

const MONGO_URI = process.env.MONGODB_URI;

// ===== 미들웨어 =====
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// ✅ 1) 메인(/) = 로그인 페이지
//   - static(public) 보다 "위"에 있어야 함!
app.get("/", (req, res) => {
  console.log("✅ [GET] /  -> login.html 보내기");
  res.sendFile(path.join(__dirname, "login.html")); // 루트에 있는 login.html
});

// ✅ 2) 정적 파일 제공 (CSS, JS, menu.html 등)
app.use(express.static(path.join(__dirname, "public")));

// users.json 없으면 만들기
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, "[]");
}

// ===== Mongo 모델 =====
const userSchema = new mongoose.Schema({
  grade: String,
  name: String,
  phone: String,
  id: String,
  pw: String,
  lastLogin: Date,
  school: String,
  deleted: { type: Boolean, default: false }, // ✅ 휴지 여부
  deletedAt: Date                              // ✅ 휴지로 보낸 시각
});

const User = mongoose.model("User", userSchema);

// ===== 학습 이력 로그 스키마 =====
const learningLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now }, // 날짜/시간 자동
  grade: String,   // 학년
  name: String,    // 이름
  school: String,  // 학교명
  series: String,  // 시리즈 (세종편/정조편 등)
  unit: String,    // 단원 코드 (geo_02)
  radar: {
    literal: { type: Number, default: null },      // 핵심 이해력
    structural: { type: Number, default: null },   // 구조 파악력
    lexical: { type: Number, default: null },      // 어휘 맥락력
    inferential: { type: Number, default: null },  // 추론·통합력
    critical: { type: Number, default: null },     // 비판·적용력
  },
});

const LearningLog = mongoose.model("LearningLog", learningLogSchema);


// ===== 라우트 =====

// ping
app.get("/ping", (req, res) => {
  console.log("✅ [GET] /ping");
  res.send("pong ✅");
});

// 회원가입 페이지
app.get("/signup", (req, res) => {
  console.log("✅ [GET] /signup 페이지 요청");
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

// ✅ GET /login 도 / 와 같은 화면으로
app.get("/login", (req, res) => {
  console.log("✅ [GET] /login -> / 로 리다이렉트");
  res.redirect("/");
});

// ✅ 회원가입 처리
app.post("/signup", async (req, res) => {
  console.log("📥 [POST] /signup 에서 받은 값:", req.body);

  const grade = req.body.grade || "";
  const name  = req.body.name || "";
  const phone = req.body.phone || "";
  const school = req.body.school || "";   // ✅ 새로 추가

  const id = phone;
  const pw = phone;

  try {
    // MongoDB 저장
    const created = await User.create({ grade, name, phone, id, pw, school }); // ✅ school 추가

    // JSON 백업
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    users.push({ grade, name, phone, id, pw, school }); // ✅ 백업에도 추가(선택)
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    console.log("✅ [POST] 회원가입 DB 저장 완료:", created.name);
    res.redirect("/login");
  } catch (err) {
    console.error("❌ [POST] 회원가입 에러:", err);
    res
      .status(500)
      .send("회원 가입 중 오류 발생: " + err.message);
  }
});

// ===== 회원 정보 수정 처리 (POST) =====
app.post("/admin/user-edit", async (req, res) => {
  const { originalId, key, grade, school, name, phone } = req.body;

  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }

  if (!originalId) {
    return res.status(400).send("originalId 가 필요합니다.");
  }

  try {
    const targetId = String(originalId).trim();

    const user = await User.findOne({
      $or: [{ id: targetId }, { phone: targetId }],
      deleted: { $ne: true }
    });

    if (!user) {
      return res.status(404).send("수정 대상 사용자를 찾을 수 없습니다.");
    }

    // 필드 업데이트
    user.grade = grade || "";
    user.school = school || "";
    user.name = name || "";
    user.phone = phone || "";
    user.id = phone || "";    // ID = 전화번호
    user.pw = phone || "";    // PW = 전화번호 (회원가입과 동일 룰)

    await user.save();

    console.log("✅ 회원 정보 수정 완료:", user.name, user.id);

    // 수정 후 다시 회원 목록으로
    res.redirect(`/admin/users?key=${encodeURIComponent(key)}`);
  } catch (err) {
    console.error("❌ /admin/user-edit(POST) 에러:", err);
    res.status(500).send("회원 정보 수정 중 오류");
  }
});


// ===== 회원 삭제 (브라우저 URL 호출용) =====
app.get("/delete-user", async (req, res) => {
  const { id, pw, key } = req.query;

  if (key !== process.env.ADMIN_KEY) {
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
app.get("/trash-user", async (req, res) => {
  const { id: rawId, key } = req.query;

  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }

  if (!rawId) return res.status(400).send("id 파라미터가 필요합니다.");

  const id = String(rawId).trim();
  console.log("🗑 /trash-user 호출, id =", id);

  try {
    // 1️⃣ 먼저 '휴지 아님' 회원만 찾기
    let user = await User.findOne({
      $or: [{ id }, { phone: id }],
      deleted: { $ne: true }       // ✅ 중요!
    });

    // 2️⃣ active 회원이 없으면, 혹시 이미 휴지인지 한 번 더 확인
    if (!user) {
      const trashed = await User.findOne({
        $or: [{ id }, { phone: id }],
        deleted: true
      });

      if (trashed) {
        return res.send(
          `이미 휴지 상태입니다: ${trashed.name} (${trashed.id || trashed.phone})`
        );
      }

      return res.status(404).send("존재하지 않는 사용자입니다.");
    }

    // 3️⃣ 여기까지 왔으면 active 회원 → 휴지로 보내기
    user.deleted = true;
    user.deletedAt = new Date();
    await user.save();

    console.log("✅ 휴지통으로 이동 완료:", user.name, user.id || user.phone);

    res.redirect(`/admin/trash?key=${encodeURIComponent(key)}`);
  } catch (err) {
    console.error("❌ /trash-user 에러:", err);
    res.status(500).send("휴지통 이동 중 오류");
  }
});


// ⭐⭐⭐ 여기서부터 새로 추가 ⭐⭐⭐
// ===== 회원 조회 페이지 (관리자 전용) =====
// ⭐⭐⭐ 회원 조회 페이지 (관리자 전용) ⭐⭐⭐
app.get("/admin/users", async (req, res) => {
  const { key, q, sort } = req.query;  // ✅ sort 포함

  // 관리자 키 체크
  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }

  try {
    // 🔍 기본 조건: 휴지 상태가 아닌 회원만
    const filter = { deleted: { $ne: true } };

    // 🔍 검색어 필터
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

    // 🔽 정렬 옵션
    let sortOption = { lastLogin: -1, name: 1 }; // 기본: 최근 로그인 내림차순

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

    let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>단단국어 회원 목록</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif; padding: 20px; }
        h1 { margin-bottom: 16px; }
        table { border-collapse: collapse; width: 100%; max-width: 960px; }
        th, td { border: 1px solid #ddd; padding: 8px 10px; font-size: 14px; }
        th { background: #f5f2eb; text-align: left; }
        tr:nth-child(even) { background: #faf7f0; }
        .small { font-size: 12px; color: #666; }
        a.btn-delete { color: #b00020; text-decoration: none; font-size: 12px; }
        a.btn-delete:hover { text-decoration: underline; }
        a.btn-edit { color: #1565c0; text-decoration: none; font-size: 12px; }
        a.btn-edit:hover { text-decoration: underline; }
        .search-box { margin-bottom: 12px; }
      </style>
    </head>
    <body>
      <h1>회원 목록 (${users.length}명)</h1>

      <div class="search-box">
        <form method="GET" action="/admin/users">
          <input type="hidden" name="key" value="${key || ""}" />

          <input
            type="text"
            name="q"
            placeholder="이름, 전화번호, 학교명, 학년 검색"
            value="${q ? q : ""}"
            style="padding:6px 10px; font-size:14px; width:260px;"
          />

          <select
            name="sort"
            style="padding:6px 8px; font-size:14px; margin-left:4px;"
          >
            <option value="lastLoginDesc" ${!sort || sort === "lastLoginDesc" ? "selected" : ""}>
              최근 로그인순(내림차순)
            </option>
            <option value="lastLoginAsc" ${sort === "lastLoginAsc" ? "selected" : ""}>
              최근 로그인순(오름차순)
            </option>
            <option value="gradeAsc" ${sort === "gradeAsc" ? "selected" : ""}>
              학년 오름차순
            </option>
            <option value="gradeDesc" ${sort === "gradeDesc" ? "selected" : ""}>
              학년 내림차순
            </option>
            <option value="nameAsc" ${sort === "nameAsc" ? "selected" : ""}>
              이름 가나다순
            </option>
            <option value="nameDesc" ${sort === "nameDesc" ? "selected" : ""}>
              이름 역순
            </option>
          </select>

          <button
            type="submit"
            style="padding:6px 12px; font-size:14px; margin-left:4px;"
          >
            검색
          </button>

          ${
            q && q.trim() !== ""
              ? `<span class="small" style="margin-left:8px;">검색어: "${q.trim()}"</span>`
              : ""
          }
        </form>

        <!-- ✅ 엑셀(CSV) 다운로드 버튼 -->
  <form method="GET" action="/admin/users-export" style="display:inline-block; margin-left:8px;">
    <input type="hidden" name="key" value="${key || ""}" />
    <input type="hidden" name="q" value="${q ? q : ""}" />
    <input type="hidden" name="sort" value="${sort || ""}" />
    <button type="submit" style="padding:6px 12px; font-size:14px;">
      엑셀 다운로드
    </button>
     </form>
      </div>

      <p class="small">※ 링크 클릭 시 회원이 휴지통으로 이동합니다. (로그인 불가)</p>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>학년</th>
            <th>학교/학원명</th>
            <th>이름</th>
            <th>전화번호(ID)</th>
            <th>마지막 로그인</th>
            <th>학습이력</th> 
            <th>수정</th>
            <th>휴지통</th>
          </tr>
        </thead>
        <tbody>
    `;

    users.forEach((u, idx) => {
      const last = u.lastLogin
        ? new Date(u.lastLogin).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
        : "-";
      const idOrPhone = u.id || u.phone || "";

      html += `
        <tr>
          <td>${idx + 1}</td>
          <td>${u.grade || ""}</td>
          <td>${u.school || ""}</td>
          <td>${u.name || ""}</td>
          <td>${idOrPhone}</td>
          <td>${last}</td>
               <!-- ✅ 학습이력 보기 버튼 -->
          <td>
            <a class="btn-log"
               href="/admin/logs?key=${encodeURIComponent(key)}&grade=${encodeURIComponent(
                 u.grade || ""
               )}&name=${encodeURIComponent(u.name || "")}">
              보기
            </a>
          </td>
          <td>
            <a class="btn-edit"
               href="/admin/user-edit?id=${encodeURIComponent(idOrPhone)}&key=${encodeURIComponent(
                 key
               )}">
              수정
            </a>
          </td>
          <td>
            <a class="btn-delete"
               href="/trash-user?id=${encodeURIComponent(idOrPhone)}&key=${encodeURIComponent(
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

  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }

  try {
    // 🔍 기본 필터: 휴지 상태가 아닌 회원만
    const filter = { deleted: { $ne: true } };

    // 🔍 검색어 필터 (지금 /admin/users랑 동일)
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

    // 🔽 정렬 옵션 (지금 /admin/users switch(sort) 그대로 복붙해도 됨)
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

    // 🔧 CSV 만들기
    const escape = (v = "") =>
      `"${String(v).replace(/"/g, '""')}"`; // " -> "" 로 이스케이프

    const lines = [];
    // 헤더
    lines.push(
      [
        "번호",
        "학년",
        "학교/학원명",
        "이름",
        "전화번호(ID)",
        "마지막 로그인",
      ].map(escape).join(",")
    );

    // 데이터
    users.forEach((u, idx) => {
      const last = u.lastLogin
        ? new Date(u.lastLogin).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
        : "";
      const idOrPhone = u.id || u.phone || "";

      lines.push(
        [
          idx + 1,
          u.grade || "",
          u.school || "",
          u.name || "",
          idOrPhone,
          last,
        ].map(escape).join(",")
      );
    });

    const csvBody = lines.join("\r\n");
    const bom = "\uFEFF"; // ✅ 한글 깨짐 방지용 BOM

    // 헤더 설정 후 전송
    res.setHeader(
      "Content-Type",
      "text/csv; charset=utf-8"
    );
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
    const { grade, name, school, series, unit, radar } = req.body; // ✅ radar 포함

    if (!grade || !name || !unit) {
      return res.status(400).json({ ok: false, message: "필수 정보 부족" });
    }

    await LearningLog.create({
      grade,
      name,
      school: school || "",
      series: series || "",
      unit,
      radar: radar || undefined,   // ✅ 있으면 저장
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("[/api/log] error:", err);
    res.status(500).json({ ok: false });
  }
});

// ===== 회원 정보 수정 페이지 (관리자 전용) =====
app.get("/admin/user-edit", async (req, res) => {
  const { key, id: rawId } = req.query;

  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }

  if (!rawId) return res.status(400).send("id 파라미터가 필요합니다.");

  const id = String(rawId).trim();

  try {
    const user = await User.findOne({
      $or: [{ id }, { phone: id }],
      deleted: { $ne: true }
    }).lean();

    if (!user) {
      return res.status(404).send("수정할 사용자를 찾을 수 없습니다.");
    }

    const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>회원 정보 수정</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif; padding: 20px; }
        h1 { margin-bottom: 16px; }
        form { max-width: 480px; }
        .row { margin-bottom: 12px; }
        label { display: block; font-size: 14px; margin-bottom: 4px; }
        input[type="text"] { width: 100%; padding: 6px 8px; font-size: 14px; box-sizing: border-box; }
        .actions { margin-top: 16px; }
        button { padding: 8px 16px; font-size: 14px; }
        .btn-back { font-size: 13px; margin-left: 8px; }
        .small { font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <h1>회원 정보 수정</h1>
      <p class="small"><a href="/admin/users?key=${encodeURIComponent(
        key
      )}">← 회원 목록으로 돌아가기</a></p>

      <form method="POST" action="/admin/user-edit">
        <input type="hidden" name="originalId" value="${user.id || user.phone || ""}" />
        <input type="hidden" name="key" value="${key}" />

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
          <label>전화번호 (ID, 비밀번호도 이 번호로 설정됩니다)</label>
          <input type="text" name="phone" value="${user.phone || user.id || ""}" />
        </div>

        <div class="actions">
          <button type="submit">저장하기</button>
          <a class="btn-back" href="/admin/users?key=${encodeURIComponent(
            key
          )}">취소</a>
        </div>

        <p class="small">
          ※ 전화번호를 바꾸면 ID와 비밀번호도 함께 바뀝니다. (pw = 전화번호)
        </p>
      </form>
    </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("❌ /admin/user-edit(GET) 에러:", err);
    res.status(500).send("회원 정보 조회 중 오류");
  }
});

// ===== 학습 이력 보기 (관리자 전용) =====
app.get("/admin/logs", async (req, res) => {
  const { key, grade, name } = req.query;

  // 관리자 키 체크
  if (key !== process.env.ADMIN_KEY) {
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

        /* 레이더 카드용 간단 스타일 */
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
        <a class="btn-back" href="/admin/users?key=${encodeURIComponent(key)}">← 회원 목록으로 돌아가기</a>
        <a href="/admin/logs-export?key=${encodeURIComponent(key)}&grade=${encodeURIComponent(grade)}&name=${encodeURIComponent(name)}">
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
        ? new Date(log.timestamp).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
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

    // 🔽 여기서부터: 표 닫고, 레이더 섹션 + 스크립트 추가
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

      <!-- Chart.js 로드 -->
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script>
        // 서버에서 온 logs를 JS로 넘기기
        const logsForChart = ${JSON.stringify(logs)};

        // 레이더 카드 컨테이너
        const wrap = document.getElementById('radar-wrap');

        logsForChart.forEach(function(log, idx) {
          // ✅ radar 데이터가 없는 로그는 스킵
          if (!log.radar) return;

          // 카드 박스 만들기
          const card = document.createElement('div');
          card.className = 'radar-card';

          // 헤더(단원 + 시간)
          const header = document.createElement('div');
          header.className = 'radar-card-header';

          const title = document.createElement('strong');
          title.textContent = (log.unit || '단원 미지정') + ' 분석 리포트';

          const time = document.createElement('div');
          time.innerHTML = '<span>' + (log.timestamp ? new Date(log.timestamp).toLocaleString('ko-KR') : '-') + '</span>';

          header.appendChild(title);
          header.appendChild(time);
          card.appendChild(header);

          // 캔버스 생성
          const canvas = document.createElement('canvas');
          canvas.id = 'radar-' + idx;
          canvas.width = 260;
          canvas.height = 260;
          card.appendChild(canvas);

          // wrap에 카드 추가
          wrap.appendChild(card);

          // 실제 레이더 그리기
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

  if (key !== process.env.ADMIN_KEY) {
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
    // 헤더
    lines.push(
      ["번호", "날짜시간", "시리즈", "단원코드"].map(escape).join(",")
    );

    logs.forEach((log, idx) => {
      const ts = log.timestamp
        ? new Date(log.timestamp).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
        : "";

      lines.push(
        [
          idx + 1,
          ts,
          log.series || "",
          log.unit || "",
        ].map(escape).join(",")
      );
    });

    const csvBody = lines.join("\r\n");
    const bom = "\uFEFF";

    res.setHeader(
      "Content-Type",
      "text/csv; charset=utf-8"
    );
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

// ===== 휴지통 회원 목록 (관리자 전용) =====
app.get("/admin/trash", async (req, res) => {
  const { key } = req.query;

  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }

  try {
    const users = await User.find({ deleted: true })
      .sort({ deletedAt: -1 })
      .lean();

    let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>휴지통 회원 목록</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif; padding: 20px; }
        h1 { margin-bottom: 16px; }
        table { border-collapse: collapse; width: 100%; max-width: 960px; }
        th, td { border: 1px solid #ddd; padding: 8px 10px; font-size: 14px; }
        th { background: #f5f2eb; text-align: left; }
        tr:nth-child(even) { background: #faf7f0; }
        .small { font-size: 12px; color: #666; }
        a { text-decoration:none; }
        a:hover { text-decoration:underline; }
      </style>
    </head>
    <body>
      <h1>휴지통 회원 목록 (${users.length}명)</h1>
      <p class="small">
        <a href="/admin/users?key=${encodeURIComponent(key)}">← 회원 목록으로 돌아가기</a>
      </p>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>학년</th>
            <th>학교/학원명</th>
            <th>이름</th>
            <th>전화번호(ID)</th>
            <th>휴지로 보낸 시각</th>
          </tr>
        </thead>
        <tbody>
    `;

    users.forEach((u, idx) => {
      const idOrPhone = u.id || u.phone || "";
      const deletedAt = u.deletedAt
        ? new Date(u.deletedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
        : "-";

      html += `
        <tr>
          <td>${idx + 1}</td>
          <td>${u.grade || ""}</td>
          <td>${u.school || ""}</td>
          <td>${u.name || ""}</td>
          <td>${idOrPhone}</td>
          <td>${deletedAt}</td>
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




// ✅ 로그인 처리 (lastLogin 기록 + 휴지 상태 차단)
app.post("/login", async (req, res) => {
  console.log("📥 [POST] /login 에서 받은 값:", req.body);
  const { name, grade, password } = req.body;

  try {
    // 🔍 1) 정상 회원 찾기 (휴지 상태가 아닌 사람만)
    const user = await User.findOne({
      name,
      grade,
      pw: password,
      deleted: { $ne: true }   // ✅ deleted === true 이면 로그인 불가
    });

    // ❗ user가 없으면 — 혹시 휴지통인지 다시 체크
    if (!user) {
      // 🔍 휴지 상태인지 확인
      const trashed = await User.findOne({
        name,
        grade,
        pw: password,
        deleted: true
      });

      if (trashed) {
        console.log("⛔ 휴지 상태 회원 로그인 시도:", trashed.name);
        return res.send(
          '현재 휴지 상태 회원입니다. 관리자에게 문의하세요. <a href="/login">돌아가기</a>'
        );
      }

      console.log("❌ 로그인 실패: 사용자 없음 / 비밀번호 불일치");
      return res.send(
        '로그인 정보가 올바르지 않습니다. <a href="/login">다시 로그인</a>'
      );
    }

    // 2) 마지막 로그인 시간 업데이트
    const now = new Date();
    user.lastLogin = now;
    await user.save();

    // 3) JSON 파일에도 lastLogin 반영(선택)
    try {
      const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
      const idx = users.findIndex(
        (u) => u.name === user.name && u.grade === user.grade && u.phone === user.phone
      );
      if (idx !== -1) {
        users[idx].lastLogin = now;
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      }
    } catch (jsonErr) {
      console.error("⚠ users.json 업데이트 오류(무시 가능):", jsonErr.message);
    }

    console.log("✅ 로그인 성공:", user.name, "lastLogin:", now.toISOString());

    // 4) 메뉴 페이지로 리다이렉트 (네 코드 그대로 유지)
    const encName = encodeURIComponent(user.name);
    const encGrade = encodeURIComponent(user.grade);
    res.redirect(`/menu.html?name=${encName}&grade=${encGrade}`);

  } catch (err) {
    console.error("❌ [POST] /login 에러:", err);
    res.status(500).send("서버 오류: 로그인 실패");
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
