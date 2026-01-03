require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default || require("connect-mongo");
const OpenAI = require("openai");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const multer = require("multer");
const compression = require("compression");

// ===== 단원 제목 매핑 로드 =====
let UNIT_TITLES = {};
try {
  const unitTitlesPath = path.join(__dirname, 'unit_titles.json');
  if (fs.existsSync(unitTitlesPath)) {
    UNIT_TITLES = JSON.parse(fs.readFileSync(unitTitlesPath, 'utf8'));
    console.log(`✅ 단원 제목 매핑 로드 완료: ${Object.keys(UNIT_TITLES).length}개`);
  }
} catch (err) {
  console.error('❌ unit_titles.json 로드 실패:', err.message);
}

// ===== Nodemailer 설정 =====
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// ===== MongoDB 모델 =====
const LearningLog = require("./models/LearningLog");
const UserProgress = require("./models/UserProgress");
const DiagnosticTest = require("./models/DiagnosticTest");
const CourseApplication = require("./models/CourseApplication");
const MockExamResult = require("./models/MockExamResult");
const MockExamUser = require("./models/MockExamUser");
const MockExamConsultation = require("./models/MockExamConsultation");
const MegaphoneMessage = require("./models/MegaphoneMessage");
const Notice = require("./models/Notice");

// ===== 콘텐츠 파일에서 단원 제목 가져오기 =====
const contentTitleCache = new Map(); // 콘텐츠 제목 캐시

function getContentTitle(unitKey, unitPath) {
  // 캐시 확인
  if (contentTitleCache.has(unitKey)) {
    return contentTitleCache.get(unitKey);
  }

  try {
    // unitPath에서 content 파일 경로 추출
    // ./BRAINUP/science/deep_bio_01.html -> ./public/BRAINUP/science/deep_bio_content.js
    const match = unitPath.match(/\.\/BRAINUP\/([^\/]+)\/([^_]+(?:_[^_]+)?)_(\d+)\.html/);
    if (!match) return null;

    const [, folder, prefix, unitNo] = match;
    // prefix: bio, fit_bio, deep_bio 등
    const contentFile = path.join(__dirname, 'public', 'BRAINUP', folder, `${prefix}_content.js`);

    if (!fs.existsSync(contentFile)) return null;

    const content = fs.readFileSync(contentFile, 'utf8');

    // unitKey의 title 찾기 (예: deep_bio_01: { ... title: '...' })
    const titleRegex = new RegExp(`${unitKey}:\\s*\\{[^}]*title:\\s*['"]([^'"]+)['"]`, 's');
    const titleMatch = content.match(titleRegex);

    if (titleMatch && titleMatch[1]) {
      contentTitleCache.set(unitKey, titleMatch[1]);
      return titleMatch[1];
    }

    return null;
  } catch (error) {
    console.error(`콘텐츠 제목 가져오기 오류 (${unitKey}):`, error.message);
    return null;
  }
}

// ===== 간단한 메모리 캐시 =====
const cache = new Map();
const CACHE_TTL = 30000; // 30초

function getCacheKey(prefix, params) {
  return `${prefix}:${JSON.stringify(params)}`;
}

function getCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now > cached.expiry) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

function setCache(key, data, ttl = CACHE_TTL) {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl
  });
}

function clearCacheByPrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

const app = express();
app.use(compression());
const ADMIN_KEY = process.env.ADMIN_KEY ? process.env.ADMIN_KEY.trim() : "";

const PORT = process.env.PORT || 3000;
const USERS_FILE = "users.json";
const MONGO_URI = process.env.MONGODB_URI;

// OpenAI 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===== 미들웨어 =====
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// ✅ 세션 미들웨어 (MongoDB 저장소 사용)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dandan-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      ttl: 60 * 60 * 2, // 2시간 (초 단위)
      autoRemove: 'native'
    }),
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

// ✅ 학생 메뉴 페이지 (관리자에서 학생 이름 클릭 시 이동)
app.get("/menu", (req, res) => {
  console.log("✅ [GET] /menu -> menu.html 제공 (grade:", req.query.grade, ", name:", req.query.name, ")");
  res.sendFile(path.join(__dirname, "public", "menu.html"));
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
app.use(express.static(path.join(__dirname, "public"), {
  etag: true,
  setHeaders: (res, filePath) => {
    // HTML 파일은 캐시 방지
    if (filePath.endsWith('.html')) {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
    }
    // 비디오/이미지 파일은 1일 캐시
    else if (filePath.match(/\.(mp4|webm|jpg|jpeg|png|gif|svg|webp)$/i)) {
      res.set('Cache-Control', 'public, max-age=86400'); // 24시간
    }
    // JS/CSS 파일은 1시간 캐시
    else if (filePath.match(/\.(js|css)$/i)) {
      res.set('Cache-Control', 'public, max-age=3600'); // 1시간
    }
  }
}));

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

// ✅ 슈퍼관리자: 진단테스트 및 수강신청 관리
app.get("/super/diagnostic-management", requireSuperAdmin, (req, res) => {
  console.log(
    "✅ [GET] /super/diagnostic-management -> public/super/diagnostic-management.html"
  );
  res.sendFile(path.join(__dirname, "public", "super", "diagnostic-management.html"));
});

// ✅ 슈퍼관리자: 모의고사 관리
app.get("/super/mock-exam-management", requireSuperAdmin, (req, res) => {
  console.log(
    "✅ [GET] /super/mock-exam-management -> public/super/mock-exam-management.html"
  );
  res.sendFile(path.join(__dirname, "public", "super", "mock-exam-management.html"));
});

// ✅ 슈퍼관리자: 보완 학습 시험지 관리
app.get("/super/supplement-exam-management", requireSuperAdmin, (req, res) => {
  console.log(
    "✅ [GET] /super/supplement-exam-management -> public/super/supplement-exam-management.html"
  );
  res.sendFile(path.join(__dirname, "public", "super", "supplement-exam-management.html"));
});

// ✅ 슈퍼관리자: 보완 학습 시험지 수정
app.get("/super/supplement-exam-edit", requireSuperAdmin, (req, res) => {
  console.log(
    "✅ [GET] /super/supplement-exam-edit -> public/super/supplement-exam-edit.html"
  );
  res.sendFile(path.join(__dirname, "public", "super", "supplement-exam-edit.html"));
});

// ✅ 슈퍼관리자: 고래뱃지 확성기 관리
app.get("/super/megaphone-management", requireSuperAdmin, (req, res) => {
  console.log(
    "✅ [GET] /super/megaphone-management -> public/super/megaphone-management.html"
  );
  res.sendFile(path.join(__dirname, "public", "super", "megaphone-management.html"));
});

// ✅ 슈퍼관리자: 형성평가 관문 AI 데이터 관리 페이지
app.get("/super/gate-pass-management", requireSuperAdmin, (req, res) => {
  console.log("✅ [GET] /super/gate-pass-management");
  res.sendFile(path.join(__dirname, "public", "super", "gate-pass-management.html"));
});

// ✅ 슈퍼관리자: 형성평가 관문 통과 기록 목록 API
app.get("/api/super/gate-passes", requireSuperAdmin, async (req, res) => {
  try {
    // GatePass 모델은 이미 정의되어 있음 (line 20073)
    const GatePassModel = mongoose.model("GatePass");

    // 모든 관문 통과 기록 조회
    const gatePasses = await GatePassModel.find({}).sort({ passedAt: -1 }).lean();

    // 학교명을 가져오기 위해 User 정보와 매칭
    const enrichedData = await Promise.all(gatePasses.map(async (gp, index) => {
      // User 컬렉션에서 해당 학생 찾기
      const user = await User.findOne({ grade: gp.grade, name: gp.name }).lean();
      return {
        _id: gp._id,
        no: index + 1,
        grade: gp.grade,
        name: gp.name,
        school: user?.school || user?.academyName || '-',
        gate: gp.gate,
        passedAt: gp.passedAt,
        units: gp.units || []
      };
    }));

    res.json({ ok: true, data: enrichedData });
  } catch (err) {
    console.error("❌ 관문 통과 기록 조회 오류:", err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ✅ 슈퍼관리자: 형성평가 관문 통과 기록 일괄 삭제 API
app.post("/api/super/gate-passes/delete", requireSuperAdmin, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.json({ ok: false, message: "삭제할 항목을 선택해주세요." });
    }

    const GatePassModel = mongoose.model("GatePass");
    const result = await GatePassModel.deleteMany({ _id: { $in: ids } });

    console.log(`✅ 관문 통과 기록 ${result.deletedCount}개 삭제됨`);
    res.json({ ok: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error("❌ 관문 통과 기록 삭제 오류:", err);
    res.status(500).json({ ok: false, message: err.message });
  }
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
    const { q, status, sort } = req.query; // 검색어 + 상태 필터(옵션) + 정렬

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

    // 정렬 옵션
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

    let users = await User.find(filter)
      .sort(sortOption)
      .lean();

    // 각 user에 대해 UserProgress 데이터 병합 (자동과제 스케줄 포함)
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const progress = await UserProgress.findOne({
        grade: user.grade,
        name: user.name
      }).lean();

      if (progress && progress.studyRoom) {
        users[i].studyRoom = progress.studyRoom;
      }
    }

    // 승인대기 학생을 항상 맨 위로 정렬
    users = users.sort((a, b) => {
      const statusA = a.status || 'approved';
      const statusB = b.status || 'approved';
      if (statusA === 'pending' && statusB !== 'pending') return -1;
      if (statusA !== 'pending' && statusB === 'pending') return 1;
      return 0;
    });

    return res.json({
      ok: true,
      academyName,
      count: users.length,
      students: users,
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

    const logs = await LearningLog.find({ grade, name, deleted: { $ne: true } })
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

// 브랜치 관리자용 AI 추천과제 목록 API (학원별 필터링)
app.get('/api/branch/ai-tasks', requireAdminLogin, async (req, res) => {
  try {
    const admin = req.session.admin;
    if (!admin) {
      return res.status(401).json({ ok: false, message: "관리자 세션 없음" });
    }

    const academyName = admin.academyName;

    // 해당 학원 학생들의 UserProgress만 조회
    const allProgress = await UserProgress.find({ school: academyName });

    const aiTasksList = [];

    for (const progress of allProgress) {
      const aiTasks = progress.studyRoom?.assignedTasks?.filter(t => t.isAI) || [];

      aiTasks.forEach(task => {
        aiTasksList.push({
          grade: progress.grade,
          name: progress.name,
          school: progress.school || academyName,
          taskTitle: task.title,
          series: task.series,
          field: task.field || task.domain,
          subject: task.subject,
          assignedAt: task.assignedAt,
          status: task.status,
          unitId: task.id || task.unitId
        });
      });
    }

    // 부여시간 기준 최신순 정렬
    aiTasksList.sort((a, b) => {
      const dateA = new Date(a.assignedAt || 0);
      const dateB = new Date(b.assignedAt || 0);
      return dateB - dateA;
    });

    res.json({
      ok: true,
      tasks: aiTasksList,
      total: aiTasksList.length,
      academyName
    });

  } catch (error) {
    console.error('AI 추천과제 목록 조회 오류 (브랜치):', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다',
      error: error.message
    });
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
    let status = "approved"; // 기본값: 관리자 계정은 일단 승인

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
          --bg: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          --panel: #ffffff;
          --accent: #495057;
          --accent-hover: #212529;
          --text: #212529;
          --text-light: #495057;
          --line: #dee2e6;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 40px 20px;
          background: var(--bg);
          font-family: "Gmarket Sans", "Noto Sans KR", sans-serif;
          color: var(--text);
          min-height: 100vh;
        }
        .wrap {
          max-width: 1200px;
          margin: 0 auto;
        }
        h1 {
          margin: 0 0 12px;
          font-size: 32px;
          font-weight: 700;
          color: #212529;
          text-shadow: none;
        }
        .desc {
          margin: 0 0 24px;
          font-size: 15px;
          color: #495057;
          line-height: 1.6;
        }
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }
        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 12px;
          border: 2px solid rgba(73, 80, 87, 0.2);
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          color: #212529;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .btn-back:hover {
          background: rgba(255,255,255,1);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .info-line {
          background: rgba(255,255,255,0.95);
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          color: var(--text);
          margin: 0 0 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .table-wrap {
          background: var(--panel);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border: 2px solid rgba(102, 126, 234, 0.1);
          overflow-x: auto;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          min-width: 1000px;
          font-size: 14px;
        }
        th, td {
          border-bottom: 1px solid var(--line);
          padding: 14px 12px;
          text-align: left;
          font-weight: 500;
          color: var(--text);
          font-size: 14px;
        }
        th {
          background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
          font-weight: 600;
          color: white;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        tbody tr {
          transition: all 0.2s ease;
        }
        tbody tr:hover {
          background: #f9fafb;
          transform: scale(1.001);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .badge-approved {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
        }
        .badge-pending {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
        }
        .badge-super {
          background: linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%);
          color: #6b21a8;
        }

        a.link {
          font-size: 13px;
          color: var(--accent);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        a.link:hover {
          color: var(--accent-hover);
          text-decoration: underline;
        }
        a.link-danger {
          font-size: 13px;
          color: #dc2626;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        a.link-danger:hover {
          color: #991b1b;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          body {
            padding: 20px 12px;
          }
          h1 {
            font-size: 24px;
          }
          .top-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .table-wrap {
            padding: 16px;
          }
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
                <th>생년월일</th>
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
          <td>${a.birth || "-"}</td>
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
          --bg: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          --panel: #ffffff;
          --accent: #495057;
          --accent-hover: #212529;
          --text: #212529;
          --text-light: #495057;
          --line: #dee2e6;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 40px 20px;
          background: var(--bg);
          font-family: "Gmarket Sans", "Noto Sans KR", sans-serif;
          color: var(--text);
          min-height: 100vh;
        }
        .wrap { max-width: 1400px; margin: 0 auto; }
        h1 {
          margin: 0 0 8px;
          font-size: 32px;
          font-weight: 700;
          color: #212529;
          text-shadow: none;
        }
        .desc {
          margin: 0 0 30px;
          font-size: 15px;
          color: #495057;
          line-height: 1.6;
        }
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 12px;
          border: 2px solid rgba(73, 80, 87, 0.2);
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          color: #212529;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .btn-back:hover {
          background: rgba(255,255,255,1);
          border-color: rgba(73, 80, 87, 0.4);
          transform: translateY(-2px);
        }

        .info-line {
          background: white;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
          color: var(--text);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .info-line strong {
          color: var(--accent);
          font-weight: 700;
        }

        .table-wrap {
          background: white;
          border-radius: 16px;
          padding: 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          overflow: hidden;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          min-width: 1000px;
          font-size: 14px;
        }
        th, td {
          padding: 16px 14px;
          text-align: left;
          border-bottom: 1px solid #f3f4f6;
        }
        th {
          background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
          font-weight: 600;
          color: white;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        tbody tr:hover {
          background: #f9fafb;
          transform: scale(1.001);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
          color: #fff;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-trash {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 12px;
          border: 2px solid rgba(239, 68, 68, 0.3);
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .btn-trash:hover {
          background: rgba(255,255,255,0.25);
          border-color: rgba(239, 68, 68, 0.5);
          transform: translateY(-2px);
        }

        .btn-branch-del {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: #fff;
          text-decoration: none;
          margin-left: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }
        .btn-branch-del:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        @media (max-width:1024px){
          .wrap { padding: 30px 16px; }
          h1 { font-size: 28px; }
          .table-wrap {
            overflow-x: scroll;
          }
        }
        @media (max-width:720px){
          h1 { font-size: 24px; }
          th, td {
            font-size: 12px;
            padding: 12px 10px;
          }
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

        <p class="info-line">
          총 <strong>${branches.length}</strong>개의 학원/지점이 있습니다.
        </p>

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
          --bg: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          --panel: #ffffff;
          --accent: #495057;
          --accent-hover: #212529;
          --text: #212529;
          --text-light: #495057;
          --line: #dee2e6;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 40px 20px;
          background: var(--bg);
          font-family: "Gmarket Sans", "Noto Sans KR", sans-serif;
          color: var(--text);
          min-height: 100vh;
        }
        .wrap {
          max-width: 1200px;
          margin: 0 auto;
        }
        h1 {
          margin: 0 0 12px;
          font-size: 32px;
          font-weight: 700;
          color: #212529;
          text-shadow: none;
        }
        .desc {
          margin: 0 0 24px;
          font-size: 15px;
          color: #495057;
          line-height: 1.6;
        }
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 30px;
        }
        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 12px;
          border: 2px solid rgba(73, 80, 87, 0.2);
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          color: #212529;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .btn-back:hover {
          background: rgba(255,255,255,1);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .toolbar {
          margin: 0 0 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: flex-end;
          align-items: center;
        }
        .search-input {
          padding: 10px 16px;
          font-size: 14px;
          border-radius: 12px;
          border: 2px solid rgba(102, 126, 234, 0.2);
          min-width: 240px;
          transition: all 0.3s ease;
        }
        .search-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .btn {
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-ghost {
          background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .btn-ghost:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }
        .btn-danger {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
        }
        .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(245, 87, 108, 0.4);
        }

        .info-line {
          background: rgba(255,255,255,0.95);
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          color: var(--text);
          margin: 0 0 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .table-wrap {
          background: var(--panel);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border: 2px solid rgba(102, 126, 234, 0.1);
          overflow-x: auto;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          min-width: 900px;
          font-size: 14px;
        }
        th, td {
          border-bottom: 1px solid var(--line);
          padding: 14px 12px;
          text-align: left;
        }
        th {
          background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
          font-weight: 600;
          color: white;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        tbody tr {
          transition: all 0.2s ease;
        }
        tbody tr:hover {
          background: #f9fafb;
          transform: scale(1.001);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .badge-approved {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
        }
        .badge-pending {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
        }

        a.link {
          font-size: 13px;
          color: var(--accent);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        a.link:hover {
          color: var(--accent-hover);
          text-decoration: underline;
        }
        a.link-danger {
          font-size: 13px;
          color: #dc2626;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        a.link-danger:hover {
          color: #991b1b;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          body {
            padding: 20px 12px;
          }
          h1 {
            font-size: 24px;
          }
          .top-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .table-wrap {
            padding: 16px;
          }
        }
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

// 브랜치 관리자 진단테스트 관리 페이지
app.get("/admin/diagnostic-management", requireAdminLogin, (req, res) => {
  console.log(
    "✅ [GET] /admin/diagnostic-management -> public/admin_diagnostic_management.html",
    "academyName:",
    req.session.admin && req.session.admin.academyName
  );
  res.sendFile(path.join(__dirname, "public", "admin_diagnostic_management.html"));
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

    // 🔹 기존 학년/이름 저장 (학습 기록 업데이트용)
    const oldGrade = user.grade || "";
    const oldName = user.name || "";
    const newGrade = grade || "";
    const newName = name || "";

    // 필드 업데이트
    user.grade = newGrade;
    user.school = school || "";
    user.name = newName;
    user.phone = phone || "";
    user.id = phone || "";
    user.pw = phone || "";

    await user.save();

    // 🔹 학년 또는 이름이 변경된 경우, 기존 학습 기록도 함께 업데이트
    if (oldGrade !== newGrade || oldName !== newName) {
      const logUpdateResult = await LearningLog.updateMany(
        { grade: oldGrade, name: oldName },
        { $set: { grade: newGrade, name: newName } }
      );
      console.log(`📝 학습 기록 업데이트: ${oldGrade}/${oldName} → ${newGrade}/${newName} (${logUpdateResult.modifiedCount}건)`);

      // UserProgress도 함께 업데이트
      const progressUpdateResult = await UserProgress.updateMany(
        { grade: oldGrade, name: oldName },
        { $set: { grade: newGrade, name: newName } }
      );
      console.log(`📊 진행도 업데이트: ${oldGrade}/${oldName} → ${newGrade}/${newName} (${progressUpdateResult.modifiedCount}건)`);
    }

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

    // 정렬 옵션 (기본값: 우선순위 정렬)
    let sortOption = { lastLogin: -1, name: 1 };
    const isPrioritySort = !sort || sort === "priority"; // 우선순위 정렬 플래그 (기본값)
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
      case "priority":
        // 우선순위 정렬: 메모리에서 처리할 것이므로 기본 정렬 사용
        sortOption = { lastLogin: -1, name: 1 };
        break;
      default:
        sortOption = { lastLogin: -1, name: 1 };
    }

    // 세 쿼리를 병렬로 실행 + 필요한 필드만 조회
    const [usersResult, allProgress, allLearningLogs] = await Promise.all([
      User.find(filter).sort(sortOption).lean(),
      UserProgress.find({}, { grade: 1, name: 1, 'studyRoom.autoTaskSchedules': 1, 'studyRoom.assignedTasks': 1 }).lean(),
      LearningLog.find({ completed: true, deleted: { $ne: true } }, { grade: 1, name: 1, unit: 1 }).lean()
    ]);
    let users = usersResult;

    // UserProgress를 Map으로 변환
    const progressMap = new Map();
    for (const p of allProgress) {
      progressMap.set(`${p.grade}|${p.name}`, p);
    }

    // LearningLog를 Map<학생키, Set<완료된 단원>>으로 변환
    const completedUnitsMap = new Map();
    for (const log of allLearningLogs) {
      const key = `${log.grade}|${log.name}`;
      if (!completedUnitsMap.has(key)) {
        completedUnitsMap.set(key, new Set());
      }
      completedUnitsMap.get(key).add(log.unit);
    }

    // 각 user에 대해 UserProgress 데이터 병합 (메모리에서 매핑)
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const progress = progressMap.get(`${user.grade}|${user.name}`);
      if (progress && progress.studyRoom) {
        users[i].studyRoom = progress.studyRoom;
      }
      // 완료된 단원 Set 추가
      users[i].completedUnits = completedUnitsMap.get(`${user.grade}|${user.name}`) || new Set();
    }

    // 우선순위 정렬: 미승인 → 미부여 → 최신 학습순
    if (isPrioritySort) {
      users = users.sort((a, b) => {
        const statusA = a.status || 'approved';
        const statusB = b.status || 'approved';

        // 1. 미승인(pending) 학생이 가장 위
        const isPendingA = statusA === 'pending';
        const isPendingB = statusB === 'pending';
        if (isPendingA && !isPendingB) return -1;
        if (!isPendingA && isPendingB) return 1;

        // 2. 시리즈 미부여 학생이 그 다음
        const hasSeriesA = a.studyRoom && a.studyRoom.assignedTasks && a.studyRoom.assignedTasks.length > 0;
        const hasSeriesB = b.studyRoom && b.studyRoom.assignedTasks && b.studyRoom.assignedTasks.length > 0;
        if (!hasSeriesA && hasSeriesB) return -1;
        if (hasSeriesA && !hasSeriesB) return 1;

        // 3. 최신 학습(lastLogin)순 정렬
        const lastLoginA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
        const lastLoginB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
        return lastLoginB - lastLoginA; // 내림차순 (최신이 위)
      });
    } else {
      // 기존 로직: 승인대기 학생을 항상 맨 위로 정렬
      users = users.sort((a, b) => {
        const statusA = a.status || 'approved';
        const statusB = b.status || 'approved';
        if (statusA === 'pending' && statusB !== 'pending') return -1;
        if (statusA !== 'pending' && statusB === 'pending') return 1;
        return 0;
      });
    }

    // 스케줄 렌더링 함수
    function renderSchedules(schedules, grade, name) {
      if (!schedules || schedules.length === 0) {
        return '';
      }

      const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

      // 과목 코드 → 한글 명칭 매핑
      const subjectNameMap = {
        'science/bio': '생물',
        'science/geo_earth': '지구과학',
        'science/physics': '물리',
        'science/chemistry': '화학',
        'social/culture': '사회문화',
        'social/geo': '지리',
        'social/law': '법',
        'social/history': '법',
        'social/politic': '정치경제',
        'korlit/classic': '고전소설',
        'korlit/modern': '현대소설',
        'korlit/essay': '고전소설',
        'korlit/nonfiction': '현대소설',
        'worldlit/classic': '세계문학(1)',
        'worldlit/modern': '세계문학(1)',
        'worldlit/essay': '세계문학(2)',
        'worldlit/nonfiction': '세계문학(2)',
        'person/korea': '한국인물',
        'person/world': '세계인물'
      };

      const html = schedules.map(schedule => {
        const subjectNames = schedule.subjects.map(s => {
          return subjectNameMap[s] || s;
        }).join(', ');

        const daysText = schedule.days.map(d => dayLabels[d]).join(', ');
        const statusClass = schedule.isActive ? 'active' : 'paused';
        const statusText = schedule.isActive ? '활성' : '일시정지';
        const buttonIcon = schedule.isActive ? '⏸' : '▶';
        const buttonTitle = schedule.isActive ? '일시정지' : '재개';

        return '<div class="schedule-item ' + statusClass + '">' +
          '<div class="schedule-info">' +
            '<div class="schedule-subject">' + subjectNames + '</div>' +
            '<div class="schedule-details">' + daysText + ' · ' + schedule.taskCount + '개/일</div>' +
            '<span class="schedule-status">' + statusText + '</span>' +
          '</div>' +
          '<div class="schedule-actions">' +
            '<button class="btn-icon" onclick="toggleSchedule(\'' + schedule.scheduleId + '\', \'' + grade + '\', \'' + name + '\')" title="' + buttonTitle + '">' +
              buttonIcon +
            '</button>' +
            '<button class="btn-icon btn-delete" onclick="deleteSchedule(\'' + schedule.scheduleId + '\', \'' + grade + '\', \'' + name + '\')" title="삭제">' +
              '🗑' +
            '</button>' +
          '</div>' +
        '</div>';
      }).join('');

      console.log(`   → HTML 생성됨 (길이: ${html.length}자)`);
      console.log(`   → HTML 미리보기:`, html.substring(0, 200));

      return html;
    }

    // 🔽 여기부터 화면 템플릿 (브랜치용 디자인과 비슷하게)
    let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>브레인 문해원 전체 회원 목록</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        :root {
          --bg: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          --panel: #ffffff;
          --accent: #495057;
          --accent-hover: #212529;
          --line: #dee2e6;
          --text: #212529;
          --text-light: #495057;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 0;
          background: var(--bg);
          font-family: "Gmarket Sans", "Noto Sans KR", sans-serif;
          color: var(--text);
          min-height: 100vh;
        }
        .wrap {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        h1 {
          margin: 0 0 8px;
          font-size: 32px;
          font-weight: 700;
          color: #212529;
          text-shadow: none;
        }
        .desc {
          margin: 0 0 30px;
          font-size: 15px;
          color: #495057;
          line-height: 1.6;
        }
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          gap: 20px;
          flex-wrap: wrap;
        }
        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 12px;
          border: 2px solid rgba(73, 80, 87, 0.2);
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          color: #212529;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .btn-back:hover {
          background: rgba(255,255,255,1);
          border-color: rgba(73, 80, 87, 0.4);
          transform: translateY(-2px);
        }

        .toolbar {
          background: white;
          padding: 20px;
          border-radius: 16px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          justify-content: flex-end;
        }
        .toolbar form {
          display: inline-flex;
          gap: 8px;
          align-items: center;
        }
        .search-input {
          padding: 12px 18px;
          font-size: 14px;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
          min-width: 280px;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        .search-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }
        .search-select {
          padding: 12px 16px;
          font-size: 14px;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
          background: white;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .search-select:focus {
          outline: none;
          border-color: var(--accent);
        }
        .btn {
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        .btn-main {
          background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .btn-main:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }
        .btn-ghost {
          background: white;
          color: #4b5563;
          border: 2px solid #e5e7eb;
        }
        .btn-ghost:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }
        .btn-danger {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
        .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
        }

        .info-line {
          background: white;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
          color: var(--text);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .info-line strong {
          color: var(--accent);
          font-weight: 700;
        }

        .table-wrap {
          background: white;
          border-radius: 16px;
          padding: 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          overflow: hidden;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          min-width: 1200px;
          font-size: 14px;
        }
        th, td {
          padding: 16px 14px;
          text-align: left;
          border-bottom: 1px solid #f3f4f6;
        }
        th {
          background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
          font-weight: 600;
          color: white;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        td {
          font-size: 14px;
          color: var(--text);
          font-weight: 500;
        }
        tbody tr {
          transition: all 0.2s ease;
        }
        tbody tr:hover {
          background: #f9fafb;
          transform: scale(1.005);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .small {
          font-size: 12px;
          color: var(--text-light);
        }

        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        .badge-approved {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }
        .badge-pending {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        a.link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          color: var(--accent);
          text-decoration: none;
          transition: all 0.2s ease;
          padding: 6px 10px;
          border-radius: 8px;
        }
        a.link:hover {
          background: rgba(102, 126, 234, 0.1);
          color: var(--accent-hover);
        }

        a.link-danger {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          color: #ef4444;
          text-decoration: none;
          transition: all 0.2s ease;
          padding: 6px 10px;
          border-radius: 8px;
        }
        a.link-danger:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        /* 테이블 액션 버튼 스타일 */
        .btn-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        /* 학생 이름 버튼 (파란색) */
        .btn-student {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }
        .btn-student:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        /* 시리즈 부여 버튼 - 미부여 (회색) */
        .btn-series-none {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          color: white;
        }
        .btn-series-none:hover {
          background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
        }

        /* 시리즈 부여 버튼 - 부여완료 (초록색) */
        .btn-series-done {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }
        .btn-series-done:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        /* 학습실 상태 뱃지 */
        .study-room-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        /* 학습실 상태 셀 가운데 정렬 */
        td:has(.study-room-badge) {
          text-align: center;
        }
        .study-room-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .study-room-empty {
          background: #f3f4f6;
          color: #6b7280;
        }
        .study-room-complete {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }
        .study-room-pending {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        /* 카카오톡 과제 알림 버튼 (노란색) */
        .btn-kakao-alert {
          background: linear-gradient(135deg, #FEE500 0%, #FFCD00 100%);
          color: #3C1E1E;
          border: none;
          cursor: pointer;
        }
        .btn-kakao-alert:hover {
          background: linear-gradient(135deg, #FFCD00 0%, #F5C000 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 205, 0, 0.4);
        }

        /* 학습 이력 버튼 (초록색) */
        .btn-history {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }
        .btn-history:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        /* 수정 버튼 (주황색) */
        .btn-edit {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }
        .btn-edit:hover {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        /* 상태 버튼 - 승인 (초록색) */
        .btn-status-approved {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }
        .btn-status-approved:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        /* 상태 버튼 - 미승인 (주황색) */
        .btn-status-pending {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }
        .btn-status-pending:hover {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        @media (max-width: 1024px) {
          .wrap { padding: 30px 16px; }
          h1 { font-size: 28px; }
          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          .toolbar form {
            flex-direction: column;
          }
          .search-input, .search-select, .btn {
            width: 100%;
          }
        }

        @media (max-width: 720px) {
          h1 { font-size: 24px; }
          .table-wrap {
            border-radius: 12px;
            overflow-x: scroll;
          }
          th, td {
            font-size: 12px;
            padding: 12px 10px;
          }
        }

        /* 체크박스 스타일 */
        .checkbox-col {
          width: 50px;
          text-align: center;
        }
        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--accent);
        }
        .bulk-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .selected-count {
          font-weight: 600;
          color: var(--accent);
          padding: 8px 12px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 8px;
        }

        /* 자동과제 스케줄 스타일 */
        .auto-schedule-cell {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 8px;
          max-width: 600px;
        }
        .no-schedule {
          color: #9ca3af;
          font-size: 14px;
        }
        .schedule-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          background: #f3f4f6;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
          font-size: 12px;
          min-width: 200px;
          max-width: 280px;
          flex: 0 0 auto;
        }
        .schedule-item.paused {
          border-left-color: #9ca3af;
          background: #f9fafb;
        }
        .schedule-info {
          flex: 1;
        }
        .schedule-subject {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }
        .schedule-details {
          font-size: 12px;
          color: #6b7280;
        }
        .schedule-status {
          display: inline-block;
          margin-top: 4px;
          padding: 2px 8px;
          background: #dbeafe;
          color: #1e40af;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }
        .schedule-item.paused .schedule-status {
          background: #e5e7eb;
          color: #6b7280;
        }
        .schedule-actions {
          display: flex;
          gap: 4px;
          margin-left: 8px;
        }
        .btn-icon {
          width: 28px;
          height: 28px;
          border: none;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .btn-icon:hover {
          background: #e5e7eb;
        }
        .btn-icon.btn-delete:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        /* 자동과제부여 링크 스타일 (슈퍼관리자용) */
        .admin-auto-task-link {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          margin-bottom: 8px;
        }
        .admin-auto-task-link:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          color: white;
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

        /* 더보기 버튼 호버 효과 */
        #loadMoreBtn:hover {
          background: #5568d3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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
      <!-- 카카오 SDK -->
      <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js"></script>
    </head>
    <body>
      <div class="wrap">
        <div class="top-bar">
          <div>
            <h1>브레인 문해원 전체 회원 목록</h1>
            <p class="desc">
              브레인 문해원에 가입된 모든 학생 계정을 한 번에 확인합니다.<br/>
              학년, 학교명, 이름, 로그인 상태 등을 한눈에 볼 수 있습니다.
            </p>
          </div>
          <div>
            <a href="/super/dashboard" class="btn-back">← 대시보드로 돌아가기</a>
          </div>
        </div>

        <div class="toolbar">
          <!-- AI 추천과제 목록 버튼 (숨김) -->
          <button
            class="btn btn-main"
            onclick="openAITasksModal()"
            style="display: none; font-size: 16px; padding: 12px 24px; font-weight: 600; margin-right: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);"
          >
            🤖 AI 추천과제 목록
          </button>

          <!-- 자동 과제 부여 버튼 (숨김) -->
          <button
            class="btn btn-main"
            onclick="openAutoTaskModal()"
            style="display: none; font-size: 16px; padding: 12px 24px; font-weight: 600; margin-right: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);"
          >
            📚 자동 과제 부여
          </button>

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
              <option value="priority" ${!sort || sort === "priority" ? "selected" : ""}>⭐ 우선순위 (미승인→미부여→최신)</option>
              <option value="lastLoginDesc" ${sort === "lastLoginDesc" ? "selected" : ""}>최근 로그인순(내림차순)</option>
              <option value="lastLoginAsc" ${sort === "lastLoginAsc" ? "selected" : ""}>최근 로그인순(오름차순)</option>
              <option value="gradeAsc" ${sort === "gradeAsc" ? "selected" : ""}>학년 오름차순</option>
              <option value="gradeDesc" ${sort === "gradeDesc" ? "selected" : ""}>학년 내림차순</option>
              <option value="nameAsc" ${sort === "nameAsc" ? "selected" : ""}>이름 가나다순</option>
              <option value="nameDesc" ${sort === "nameDesc" ? "selected" : ""}>이름 역순</option>
            </select>
            <button type="submit" class="btn btn-main">검색</button>
          </form>

          <div class="bulk-actions" id="bulkActions" style="display: none;">
            <span class="selected-count" id="selectedCount">0명 선택됨</span>
            <button class="btn btn-danger" onclick="bulkDeleteUsers()">선택한 학생 삭제</button>
          </div>

          <form method="GET" action="/admin/users-export">
            <input type="hidden" name="key" value="${key || ""}" />
            <input type="hidden" name="q" value="${q ? q : ""}" />
            <input type="hidden" name="sort" value="${sort || ""}" />
            <button type="submit" class="btn btn-ghost">엑셀 다운로드</button>
          </form>

          <button
            id="btn-delete-all"
            class="btn"
            style="background: #dc2626; color: #fff; border-color: #dc2626;"
            onclick="deleteAllData()"
          >
            전체 데이터 삭제
          </button>

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

        <!-- 핵심 기능 안내 -->
        <div style="
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 12px;
            color: white;
          ">
            <span style="
              font-size: 24px;
              background: rgba(255, 255, 255, 0.2);
              width: 42px;
              height: 42px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            ">⭐</span>
            <div>
              <div style="
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 8px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
              ">핵심 기능 : 👤 학생 이름 클릭</div>
              <div style="
                font-size: 14px;
                line-height: 1.6;
                opacity: 0.95;
              ">
                해당 학생 화면으로 바로 이동하여 <strong>학생 전체 상황을 한 눈에 파악</strong>하고,
                <strong>수동으로 과제를 부여</strong>할 수 있습니다.
              </div>
            </div>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th class="checkbox-col">
                  <input type="checkbox" id="selectAll" onclick="toggleSelectAll()" />
                </th>
                <th>#</th>
                <th>학년</th>
                <th>이름</th>
                <th>학교명</th>
                <th>전화번호(ID)</th>
                <th>상태</th>
                <th>시리즈 부여</th>
                <th style="cursor: pointer;" onclick="sortByPendingTasks()" title="클릭하면 미완료 과제순으로 정렬">
                  학습실 상태<br><span style="font-size: 10px; color: #888; font-weight: normal;">(어휘학습 제외)</span>
                  <span id="studyRoomSortIcon" style="margin-left: 4px;">⇅</span>
                </th>
                <th>과제 알림<br><span style="font-size: 10px; color: #888; font-weight: normal;">(개인별 발송)</span></th>
                <th>자동과제 스케줄</th>
                <th>학습 이력</th>
                <th>수정</th>
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

      // 상태 버튼 (승인/미승인 토글)
      const statusButtonText = status === "approved" ? "✓ 승인" : "⏳ 미승인";
      const statusButtonClass = status === "approved" ? "btn-action btn-status-approved" : "btn-action btn-status-pending";
      const nextStatus = status === "approved" ? "pending" : "approved";
      const confirmMessage = status === "approved"
        ? "이 회원을 미승인 상태로 전환할까요?"
        : "이 회원을 승인하시겠습니까?";

      // 안전하게 JSON 데이터 전달
      const escapedName = (u.name || "").replace(/'/g, "\\'").replace(/"/g, "&quot;");
      const assignedSeriesJson = JSON.stringify(u.assignedSeries || [])
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");

      // 시리즈 부여 버튼 텍스트 및 스타일
      const hasAssignedSeries = u.assignedSeries && u.assignedSeries.length > 0;
      const seriesButtonText = hasAssignedSeries ? '📚 부여완료' : '📚 미부여';
      const seriesButtonClass = hasAssignedSeries ? 'btn-action btn-series-done' : 'btn-action btn-series-none';

      // 학습실 과제 상태 계산 (LearningLog 기반)
      const assignedTasks = u.studyRoom?.assignedTasks || [];
      const totalTasks = assignedTasks.length;
      const completedUnits = u.completedUnits || new Set();

      // 완료 개수 계산: AI 과제는 status, 일반 과제는 LearningLog 확인
      const completedTasks = assignedTasks.filter(t => {
        if (t.isAI) {
          // AI 과제는 status가 'completed'인 경우
          return t.status === 'completed';
        } else {
          // 일반 과제는 LearningLog에서 확인
          // unitId에서 단원 코드 추출: ./BRAINUP/science/bio_01.html → bio_01
          const unitId = t.unitId || t.id || '';
          const match = unitId.match(/([a-z_]+_\d+)\.html$/i) || unitId.match(/([a-z_]+_\d+)$/i);
          const unitCode = match ? match[1] : unitId;
          return completedUnits.has(unitCode);
        }
      }).length;

      const studyRoomStatusText = totalTasks > 0 ? `${completedTasks}/${totalTasks}` : '-';
      const studyRoomStatusClass = totalTasks === 0 ? 'study-room-empty' : (completedTasks === totalTasks ? 'study-room-complete' : 'study-room-pending');
      const pendingTasks = totalTasks - completedTasks;  // 미완료 과제 수

      html += `
        <tr data-user-grade="${u.grade || ''}" data-user-name="${u.name || ''}" data-pending="${pendingTasks}">
          <td class="checkbox-col">
            <input type="checkbox" class="user-checkbox" value="${idOrPhone}" data-grade="${u.grade || ''}" data-name="${u.name || ''}" onchange="updateSelectedCount()" />
          </td>
          <td>${idx + 1}</td>
          <td>${u.grade || ""}</td>
          <td>
            <a class="btn-action btn-student"
               href="/menu?grade=${encodeURIComponent(u.grade || '')}&name=${encodeURIComponent(u.name || '')}"
               target="_blank"
               title="학생 화면으로 이동 (새 탭)">
              👤 ${u.name || ""}
            </a>
          </td>
          <td>${u.school || ""}</td>
          <td>${idOrPhone}</td>
          <td>
            <a class="${statusButtonClass}"
               href="/admin/status?id=${encodeURIComponent(idOrPhone)}&status=${nextStatus}&key=${encodeURIComponent(key)}"
               onclick="return confirm('${confirmMessage}');">
              ${statusButtonText}
            </a>
          </td>
          <td>
            <a class="${seriesButtonClass}"
               href="#"
               onclick="openSeriesModal('${u._id}', '${escapedName}', '${assignedSeriesJson}'); return false;">
              ${seriesButtonText}
            </a>
          </td>
          <td>
            <a href="/menu?grade=${encodeURIComponent(u.grade || '')}&name=${encodeURIComponent(u.name || '')}&openStudyRoom=true"
               target="_blank"
               class="study-room-badge ${studyRoomStatusClass}"
               title="학습실 열기 (새 탭)">${studyRoomStatusText}</a>
          </td>
          <td>
            <button class="btn-action btn-kakao-alert"
               onclick="sendKakaoTaskAlert('${encodeURIComponent(u.grade || '')}', '${encodeURIComponent(u.name || '')}')">
              💬 알림
            </button>
          </td>
          <td>
            <a class="admin-auto-task-link"
               href="/menu?grade=${encodeURIComponent(u.grade || '')}&name=${encodeURIComponent(u.name || '')}&openStudyRoom=true&openAutoTask=true"
               target="_blank"
               title="학습실에서 자동과제부여 설정">
              ⚙️ 자동과제부여
            </a>
            <div id="schedule-${idOrPhone}" class="auto-schedule-cell">
              ${renderSchedules(u.studyRoom?.autoTaskSchedules || [], u.grade || '', u.name || '')}
            </div>
          </td>
          <td>
            <a class="btn-action btn-history"
               href="/my-learning?grade=${encodeURIComponent(
        u.grade || ""
      )}&name=${encodeURIComponent(u.name || "")}&series=up"
               target="_blank"
               title="종합리포트 (나의 학습분석)">
              📊 종합리포트
            </a>
          </td>
          <td>
            <a class="btn-action btn-edit"
               href="/admin/user-edit?id=${encodeURIComponent(
                 idOrPhone
               )}&key=${encodeURIComponent(key)}">
              ✏️ 수정
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
                  <span class="series-desc">개념이해</span>
                </label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="series-brainam" value="BRAIN암" />
                <label for="series-brainam">
                  <span class="series-name">BRAIN UP</span>
                  <span class="series-desc">응용적용</span>
                </label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="series-brainbit" value="BRAIN빛" />
                <label for="series-brainbit">
                  <span class="series-name">BRAIN FIT</span>
                  <span class="series-desc">사고연결</span>
                </label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="series-braindap" value="BRAIN답" />
                <label for="series-braindap">
                  <span class="series-name">BRAIN DEEP</span>
                  <span class="series-desc">심화추론</span>
                </label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="series-brainjung" value="BRAIN중등" />
                <label for="series-brainjung">
                  <span class="series-name">BRAIN 실전</span>
                  <span class="series-desc">수능모고</span>
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
        // 카카오 SDK 초기화
        if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
          Kakao.init('6ad10cc6680c7a5829a4fd7a3cbb4a7e');
        }

        // 카카오톡 과제 알림 전송
        function sendKakaoTaskAlert(grade, name) {
          grade = decodeURIComponent(grade);
          name = decodeURIComponent(name);

          if (!grade || !name) {
            alert('학생 정보를 찾을 수 없습니다.');
            return;
          }

          if (typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
            alert('카카오톡 공유 기능을 사용할 수 없습니다.\\n페이지를 새로고침 후 다시 시도해주세요.');
            return;
          }

          try {
            const baseUrl = 'https://dan-dan-app.onrender.com';
            const studyRoomUrl = baseUrl + '/menu.html?openStudyRoom=true&grade=' + encodeURIComponent(grade) + '&name=' + encodeURIComponent(name);

            Kakao.Share.sendDefault({
              objectType: 'feed',
              content: {
                title: '📚 ' + name + ' 학생 과제 알림',
                description: grade + ' ' + name + ' 학생, 학습실의 과제를 꼭 확인해 주세요!',
                imageUrl: 'https://dan-dan-app.onrender.com/images/dandan_logo.png',
                link: {
                  mobileWebUrl: studyRoomUrl,
                  webUrl: studyRoomUrl
                }
              },
              buttons: [
                {
                  title: '나의 학습실 열기',
                  link: {
                    mobileWebUrl: studyRoomUrl,
                    webUrl: studyRoomUrl
                  }
                }
              ]
            });
          } catch (error) {
            console.error('카카오톡 공유 오류:', error);
            alert('카카오톡 공유 중 오류가 발생했습니다.');
          }
        }

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
              alert('시리즈부여 완료');
              closeSeriesModal();
              // AI 학습 인식 중 스와이프 표시 후 페이지 새로고침
              showLoadingSwipe();
            } else {
              alert('오류: ' + (data.message || '알 수 없는 오류'));
            }
          } catch (err) {
            console.error(err);
            alert('저장 중 오류가 발생했습니다.');
          }
        }

        // AI 학습 인식 중 스와이프 애니메이션
        function showLoadingSwipe() {
          const overlay = document.createElement('div');
          overlay.id = 'aiLoadingOverlay';
          overlay.innerHTML = \`
            <div style="
              position: fixed;
              top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(0,0,0,0.7);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 99999;
            ">
              <div style="
                background: white;
                padding: 40px 60px;
                border-radius: 16px;
                text-align: center;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
              ">
                <div style="
                  width: 50px;
                  height: 50px;
                  border: 4px solid #e5e7eb;
                  border-top-color: #3b82f6;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
                  margin: 0 auto 20px;
                "></div>
                <div style="font-size: 18px; font-weight: 600; color: #333;">AI 학습 인식 중..</div>
              </div>
            </div>
            <style>
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            </style>
          \`;
          document.body.appendChild(overlay);

          setTimeout(() => {
            location.reload();
          }, 1500);
        }

        // 모달 외부 클릭시 닫기
        document.getElementById('seriesModal').addEventListener('click', function(e) {
          if (e.target === this) {
            closeSeriesModal();
          }
        });

        // 학습실 상태 정렬 관련 변수 및 함수
        let pendingSortOrder = 'desc';  // 기본: 내림차순 (미완료 많은 순)

        function sortByPendingTasks() {
          const tbody = document.querySelector('table tbody');
          const rows = Array.from(tbody.querySelectorAll('tr'));

          // 정렬
          rows.sort((a, b) => {
            const pendingA = parseInt(a.dataset.pending) || 0;
            const pendingB = parseInt(b.dataset.pending) || 0;

            if (pendingSortOrder === 'desc') {
              return pendingB - pendingA;  // 미완료 많은 순
            } else {
              return pendingA - pendingB;  // 미완료 적은 순
            }
          });

          // DOM 재배치
          rows.forEach(row => tbody.appendChild(row));

          // 번호 재정렬
          rows.forEach((row, idx) => {
            const numCell = row.querySelector('td:nth-child(2)');
            if (numCell) numCell.textContent = idx + 1;
          });

          // 아이콘 업데이트
          const icon = document.getElementById('studyRoomSortIcon');
          if (icon) {
            icon.textContent = pendingSortOrder === 'desc' ? '↓' : '↑';
          }

          // 다음 클릭시 반대 정렬
          pendingSortOrder = pendingSortOrder === 'desc' ? 'asc' : 'desc';
        }

        // 체크박스 관련 함수들
        function toggleSelectAll() {
          const selectAll = document.getElementById('selectAll');
          const checkboxes = document.querySelectorAll('.user-checkbox');
          checkboxes.forEach(cb => {
            cb.checked = selectAll.checked;
          });
          updateSelectedCount();
        }

        function updateSelectedCount() {
          const checkboxes = document.querySelectorAll('.user-checkbox:checked');
          const count = checkboxes.length;
          const bulkActions = document.getElementById('bulkActions');
          const selectedCount = document.getElementById('selectedCount');

          if (count > 0) {
            bulkActions.style.display = 'flex';
            selectedCount.textContent = count + '명 선택됨';
          } else {
            bulkActions.style.display = 'none';
          }
        }

        async function bulkDeleteUsers() {
          const checkboxes = document.querySelectorAll('.user-checkbox:checked');
          if (checkboxes.length === 0) {
            alert('삭제할 학생을 선택해주세요.');
            return;
          }

          const userList = Array.from(checkboxes).map(cb => cb.dataset.name).join(', ');
          const confirmMsg = \`선택한 \${checkboxes.length}명의 학생을 휴지통으로 보내시겠습니까?\\n\\n학생 목록: \${userList}\`;

          if (!confirm(confirmMsg)) {
            return;
          }

          const userIds = Array.from(checkboxes).map(cb => cb.value);

          try {
            const promises = userIds.map(userId =>
              fetch(\`/trash-user?id=\${encodeURIComponent(userId)}&key=\${encodeURIComponent('${key}')}\`)
            );

            await Promise.all(promises);
            alert('선택한 학생들이 휴지통으로 이동되었습니다.');
            window.location.reload();
          } catch (error) {
            console.error('삭제 중 오류:', error);
            alert('삭제 중 오류가 발생했습니다.');
          }
        }

        // 스케줄 일시정지/재개
        async function toggleSchedule(scheduleId, grade, name) {
          try {
            const res = await fetch(\`/api/auto-task-schedule/\${scheduleId}/toggle\`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ grade, name })
            });

            const data = await res.json();

            if (data.success) {
              alert(data.message);
              location.reload();
            } else {
              alert(\`❌ 오류: \${data.message}\`);
            }
          } catch (err) {
            console.error('스케줄 토글 오류:', err);
            alert('❌ 오류가 발생했습니다.');
          }
        }

        // 스케줄 삭제
        async function deleteSchedule(scheduleId, grade, name) {
          if (!confirm('이 스케줄을 삭제하시겠습니까?')) {
            return;
          }

          try {
            const res = await fetch(\`/api/auto-task-schedule/\${scheduleId}?grade=\${encodeURIComponent(grade)}&name=\${encodeURIComponent(name)}\`, {
              method: 'DELETE'
            });

            const data = await res.json();

            if (data.success) {
              alert(data.message);
              location.reload();
            } else {
              alert(\`❌ 오류: \${data.message}\`);
            }
          } catch (err) {
            console.error('스케줄 삭제 오류:', err);
            alert('❌ 오류가 발생했습니다.');
          }
        }

        // 전체 데이터 삭제
        async function deleteAllData() {
          const confirmMsg = "⚠️ 경고: 모든 회원 정보와 학습 기록이 영구 삭제됩니다.\\n\\n정말로 전체 데이터를 삭제하시겠습니까?\\n\\n이 작업은 되돌릴 수 없습니다!";

          if (!confirm(confirmMsg)) {
            return;
          }

          // 2차 확인
          const doubleConfirm = prompt("정말로 삭제하시려면 '삭제하기'를 입력하세요:");
          if (doubleConfirm !== "삭제하기") {
            alert("삭제가 취소되었습니다.");
            return;
          }

          try {
            const btn = document.getElementById("btn-delete-all");
            btn.disabled = true;
            btn.textContent = "삭제 중...";

            const res = await fetch("/api/delete-all-data", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key: "${key}" })
            });

            const data = await res.json();

            if (data.success) {
              alert(\`✅ 전체 데이터 삭제 완료!\\n\\n삭제된 회원: \${data.deletedUsers}명\\n삭제된 학습 기록: \${data.deletedRecords}개\`);
              window.location.reload();
            } else {
              alert("❌ 삭제 실패: " + (data.message || "알 수 없는 오류"));
            }
          } catch (err) {
            console.error("삭제 에러:", err);
            alert("❌ 삭제 중 오류가 발생했습니다.");
          } finally {
            const btn = document.getElementById("btn-delete-all");
            btn.disabled = false;
            btn.textContent = "전체 데이터 삭제";
          }
        }
      </script>

      <!-- AI 추천과제 목록 모달 -->
      <div id="aiTasksModal" class="modal-overlay" style="display: none;">
        <div class="modal-content" style="max-width: 1200px; max-height: 85vh; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #e5e7eb;">
            <h2 style="margin: 0; font-size: 24px; font-weight: 700;">🤖 AI 추천과제 목록</h2>
            <button onclick="closeAITasksModal()" style="background: transparent; border: none; font-size: 28px; cursor: pointer; color: #666; line-height: 1;">&times;</button>
          </div>
          <div style="margin-bottom: 16px; color: #666; font-size: 14px;">
            총 <span id="aiTasksCount">0</span>개의 AI 추천과제가 부여되었습니다.
          </div>
          <div style="overflow-x: auto; overflow-y: auto; flex: 1;">
            <table style="width: 100%; border-collapse: collapse; background: white;">
              <thead>
                <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                  <th style="padding: 12px; text-align: left; font-weight: 600; white-space: nowrap;">#</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; white-space: nowrap;">학년</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; white-space: nowrap;">이름</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; white-space: nowrap;">학원명</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; min-width: 200px;">과제명</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; white-space: nowrap;">시리즈</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; white-space: nowrap;">분야</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; white-space: nowrap;">과목</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; white-space: nowrap;">부여시간</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; white-space: nowrap;">상태</th>
                </tr>
              </thead>
              <tbody id="aiTasksTbody">
                <tr>
                  <td colspan="10" style="padding: 40px; text-align: center; color: #999;">로딩 중...</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div id="loadMoreContainer" style="text-align: center; margin-top: 20px; padding: 16px 0; border-top: 1px solid #e5e7eb; display: none;">
            <button id="loadMoreBtn" onclick="loadMoreAITasks()" style="padding: 12px 32px; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);">
              더보기 ▼
            </button>
          </div>
        </div>
      </div>

      <!-- 자동 과제 부여 모달 -->
      <div id="autoTaskModal" class="auto-task-modal" style="display: none;">
        <div class="auto-task-modal-overlay" onclick="closeAutoTaskModal()"></div>
        <div class="auto-task-modal-content">
          <div class="auto-task-modal-header">
            <h2>자동 과제 부여 설정</h2>
            <button class="close-btn" onclick="closeAutoTaskModal()">&times;</button>
          </div>

          <div class="auto-task-modal-body">
            <!-- 선택된 학생 표시 -->
            <div class="selected-students-section">
              <h3>선택된 학생 (<span id="selectedStudentCount">0</span>명)</h3>
              <div id="selectedStudentsList" class="selected-students-list"></div>
            </div>

            <!-- ① 요일 선택 -->
            <div class="form-section">
              <h3>① 요일 선택</h3>
              <div class="day-selection">
                <label><input type="checkbox" id="day-all" value="all" onchange="handleDayAllChange(this)"> 매일</label>
                <label><input type="checkbox" class="day-checkbox" value="1" onchange="handleDayChange()"> 월</label>
                <label><input type="checkbox" class="day-checkbox" value="2" onchange="handleDayChange()"> 화</label>
                <label><input type="checkbox" class="day-checkbox" value="3" onchange="handleDayChange()"> 수</label>
                <label><input type="checkbox" class="day-checkbox" value="4" onchange="handleDayChange()"> 목</label>
                <label><input type="checkbox" class="day-checkbox" value="5" onchange="handleDayChange()"> 금</label>
                <label><input type="checkbox" class="day-checkbox" value="6" onchange="handleDayChange()"> 토</label>
                <label><input type="checkbox" class="day-checkbox" value="0" onchange="handleDayChange()"> 일</label>
              </div>
            </div>

            <!-- ② 과목 선택 -->
            <div class="form-section">
              <h3>② 과목 선택</h3>
              <div class="subject-tree">
                <!-- 시리즈 전체 -->
                <div class="subject-item level-0">
                  <label>
                    <input type="checkbox" id="series-all" onchange="handleSeriesAllChange(this)">
                    <span>시리즈 전체</span>
                  </label>
                </div>

                <!-- 과학분야 -->
                <div class="subject-item level-1">
                  <label>
                    <input type="checkbox" class="field-checkbox" data-field="science" onchange="handleFieldChange(this, 'science')">
                    <span>과학분야 전체</span>
                  </label>
                </div>
                <div class="subject-group level-2">
                  <label><input type="checkbox" class="subject-checkbox" data-field="science" data-subject="bio" value="science/bio" onchange="handleSubjectChange()"> 생물</label>
                  <label><input type="checkbox" class="subject-checkbox" data-field="science" data-subject="geo" value="science/geo_earth" onchange="handleSubjectChange()"> 지구과학</label>
                  <label><input type="checkbox" class="subject-checkbox" data-field="science" data-subject="phy" value="science/physics" onchange="handleSubjectChange()"> 물리</label>
                  <label><input type="checkbox" class="subject-checkbox" data-field="science" data-subject="chem" value="science/chemistry" onchange="handleSubjectChange()"> 화학</label>
                </div>

                <!-- 사회분야 -->
                <div class="subject-item level-1">
                  <label>
                    <input type="checkbox" class="field-checkbox" data-field="social" onchange="handleFieldChange(this, 'social')">
                    <span>사회분야 전체</span>
                  </label>
                </div>
                <div class="subject-group level-2">
                  <label><input type="checkbox" class="subject-checkbox" data-field="social" data-subject="culture" value="social/culture" onchange="handleSubjectChange()"> 사회문화</label>
                  <label><input type="checkbox" class="subject-checkbox" data-field="social" data-subject="geo" value="social/geo" onchange="handleSubjectChange()"> 지리</label>
                  <label><input type="checkbox" class="subject-checkbox" data-field="social" data-subject="law" value="social/law" onchange="handleSubjectChange()"> 법</label>
                  <label><input type="checkbox" class="subject-checkbox" data-field="social" data-subject="politic" value="social/politic" onchange="handleSubjectChange()"> 정치경제</label>
                </div>

                <!-- 한국문학 -->
                <div class="subject-item level-1">
                  <label>
                    <input type="checkbox" class="field-checkbox" data-field="korlit" onchange="handleFieldChange(this, 'korlit')">
                    <span>한국문학 전체</span>
                  </label>
                </div>
                <div class="subject-group level-2">
                  <label><input type="checkbox" class="subject-checkbox" data-field="korlit" data-subject="classic" value="korlit/classic" onchange="handleSubjectChange()"> 고전소설</label>
                  <label><input type="checkbox" class="subject-checkbox" data-field="korlit" data-subject="modern" value="korlit/modern" onchange="handleSubjectChange()"> 현대소설</label>
                </div>

                <!-- 세계문학 -->
                <div class="subject-item level-1">
                  <label>
                    <input type="checkbox" class="field-checkbox" data-field="worldlit" onchange="handleFieldChange(this, 'worldlit')">
                    <span>세계문학 전체</span>
                  </label>
                </div>
                <div class="subject-group level-2">
                  <label><input type="checkbox" class="subject-checkbox" data-field="worldlit" data-subject="1" value="worldlit/classic" onchange="handleSubjectChange()"> 세계문학(1)</label>
                  <label><input type="checkbox" class="subject-checkbox" data-field="worldlit" data-subject="2" value="worldlit/modern" onchange="handleSubjectChange()"> 세계문학(2)</label>
                </div>

                <!-- 인물 -->
                <div class="subject-item level-1">
                  <label>
                    <input type="checkbox" class="field-checkbox" data-field="person" onchange="handleFieldChange(this, 'person')">
                    <span>인물 전체</span>
                  </label>
                </div>
                <div class="subject-group level-2">
                  <label><input type="checkbox" class="subject-checkbox" data-field="person" data-subject="1" value="person/korea" onchange="handleSubjectChange()"> 한국인물</label>
                  <label><input type="checkbox" class="subject-checkbox" data-field="person" data-subject="2" value="person/world" onchange="handleSubjectChange()"> 세계인물</label>
                </div>
              </div>
            </div>

            <!-- ③ 과제 개수 -->
            <div class="form-section">
              <h3>③ 1일 과제 개수</h3>
              <input type="number" id="taskCount" min="1" max="5" value="1" class="task-count-input">
              <span class="hint">하루에 부여할 단원 개수 (1~5개)</span>
            </div>
          </div>

          <div class="auto-task-modal-footer">
            <button class="btn btn-cancel" onclick="closeAutoTaskModal()">취소</button>
            <button class="btn btn-main" onclick="submitAutoTaskSchedule()">자동 과제 시작</button>
          </div>
        </div>
      </div>

      <style>
        /* 자동 과제 모달 스타일 */
        .auto-task-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10000;
        }

        .auto-task-modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }

        .auto-task-modal-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 700px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .auto-task-modal-header {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .auto-task-modal-header h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #1e3a8a;
        }

        .auto-task-modal-header .close-btn {
          background: none;
          border: none;
          font-size: 32px;
          color: #6b7280;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          line-height: 1;
        }

        .auto-task-modal-header .close-btn:hover {
          color: #1f2937;
        }

        .auto-task-modal-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        .auto-task-modal-footer {
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        /* 선택된 학생 섹션 */
        .selected-students-section {
          margin-bottom: 24px;
          padding: 16px;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          border-radius: 8px;
          color: white;
        }

        .selected-students-section h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .selected-students-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .student-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 14px;
          backdrop-filter: blur(10px);
        }

        /* 폼 섹션 */
        .form-section {
          margin-bottom: 24px;
        }

        .form-section h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        /* 과목 트리 */
        .subject-tree {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          background: #f9fafb;
        }

        .subject-item {
          margin-bottom: 8px;
        }

        .subject-item.level-0 label {
          font-weight: 700;
          font-size: 16px;
          color: #1e3a8a;
        }

        .subject-item.level-1 {
          margin-left: 20px;
          margin-top: 12px;
        }

        .subject-item.level-1 label {
          font-weight: 600;
          font-size: 15px;
          color: #3b82f6;
        }

        .subject-group.level-2 {
          margin-left: 40px;
          margin-top: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .subject-group.level-2 label {
          font-size: 14px;
          color: #4b5563;
          cursor: pointer;
        }

        .subject-tree input[type="checkbox"] {
          margin-right: 8px;
          cursor: pointer;
        }

        /* 요일 선택 */
        .day-selection {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .day-selection label {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .day-selection label:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .day-selection input[type="checkbox"] {
          margin-right: 6px;
        }

        .day-selection input[type="checkbox"]:checked + * {
          font-weight: 600;
        }

        .day-selection label:has(input:checked) {
          border-color: #3b82f6;
          background: #dbeafe;
        }

        /* 과제 개수 입력 */
        .task-count-input {
          width: 100px;
          padding: 8px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          margin-right: 12px;
        }

        .task-count-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .hint {
          color: #6b7280;
          font-size: 14px;
        }

        /* 버튼 */
        .btn-cancel {
          background: #e5e7eb;
          color: #1f2937;
        }

        .btn-cancel:hover {
          background: #d1d5db;
        }
      </style>

      <script>
        // 모달 열기/닫기
        function openAutoTaskModal() {
          const checkedRows = document.querySelectorAll('tbody input[type="checkbox"]:checked');
          if (checkedRows.length === 0) {
            alert("학생을 선택해주세요.");
            return;
          }

          // 선택된 학생 정보 수집
          const selectedStudents = [];
          checkedRows.forEach(checkbox => {
            const row = checkbox.closest('tr');
            const nameCell = row.cells[3]; // 이름 컬럼
            const name = nameCell.textContent.trim();
            const idOrPhone = checkbox.value;
            selectedStudents.push({ idOrPhone, name });
          });

          // 선택된 학생 표시
          document.getElementById('selectedStudentCount').textContent = selectedStudents.length;
          const studentsList = document.getElementById('selectedStudentsList');
          studentsList.innerHTML = selectedStudents.map(s =>
            \`<span class="student-badge">\${s.name}</span>\`
          ).join('');

          // 모달 표시
          document.getElementById('autoTaskModal').style.display = 'block';
        }

        function closeAutoTaskModal() {
          document.getElementById('autoTaskModal').style.display = 'none';

          // 폼 초기화
          document.querySelectorAll('#autoTaskModal input[type="checkbox"]').forEach(cb => cb.checked = false);
          document.getElementById('taskCount').value = 1;
        }

        // ===== AI 추천과제 목록 모달 =====
        let allAITasks = [];
        let currentDisplayCount = 10;
        const PAGE_SIZE = 10;

        function openAITasksModal() {
          document.getElementById('aiTasksModal').style.display = 'flex';
          loadAITasks();
        }

        function closeAITasksModal() {
          document.getElementById('aiTasksModal').style.display = 'none';
        }

        async function loadAITasks() {
          const tbody = document.getElementById('aiTasksTbody');
          const countSpan = document.getElementById('aiTasksCount');
          const loadMoreContainer = document.getElementById('loadMoreContainer');

          try {
            const response = await fetch('/api/admin/ai-tasks?key=${key}');
            const result = await response.json();

            if (!result.ok) {
              tbody.innerHTML = '<tr><td colspan="10" style="padding: 40px; text-align: center; color: #dc2626;">오류: ' + result.message + '</td></tr>';
              loadMoreContainer.style.display = 'none';
              return;
            }

            allAITasks = result.tasks || [];
            countSpan.textContent = result.total || 0;

            if (allAITasks.length === 0) {
              tbody.innerHTML = '<tr><td colspan="10" style="padding: 40px; text-align: center; color: #999;">아직 부여된 AI 추천과제가 없습니다.</td></tr>';
              loadMoreContainer.style.display = 'none';
              return;
            }

            // 초기 표시 개수 리셋
            currentDisplayCount = PAGE_SIZE;

            // 테이블 렌더링
            renderAITasksTable();

            // 더보기 버튼 표시 여부
            if (allAITasks.length > PAGE_SIZE) {
              loadMoreContainer.style.display = 'block';
            } else {
              loadMoreContainer.style.display = 'none';
            }

          } catch (error) {
            console.error('AI 추천과제 목록 로드 오류:', error);
            tbody.innerHTML = '<tr><td colspan="10" style="padding: 40px; text-align: center; color: #dc2626;">로드 중 오류가 발생했습니다.</td></tr>';
            loadMoreContainer.style.display = 'none';
          }
        }

        function renderAITasksTable() {
          const tbody = document.getElementById('aiTasksTbody');
          const loadMoreContainer = document.getElementById('loadMoreContainer');

          const tasksToShow = allAITasks.slice(0, currentDisplayCount);

          tbody.innerHTML = tasksToShow.map((task, index) => {
            const assignedTime = task.assignedAt ? formatAssignedTime(task.assignedAt) : '-';
            const statusText = getStatusText(task.status);
            const statusColor = getStatusColor(task.status);

            return \`
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px; color: #666;">\${index + 1}</td>
                <td style="padding: 12px;">\${task.grade}</td>
                <td style="padding: 12px; font-weight: 600;">\${task.name}</td>
                <td style="padding: 12px;">\${task.academyName || '-'}</td>
                <td style="padding: 12px; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="\${task.taskTitle}">\${task.taskTitle}</td>
                <td style="padding: 12px;">\${task.series || '-'}</td>
                <td style="padding: 12px;">\${task.field || '-'}</td>
                <td style="padding: 12px;">\${task.subject || '-'}</td>
                <td style="padding: 12px; white-space: nowrap;">\${assignedTime}</td>
                <td style="padding: 12px;">
                  <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; background: \${statusColor}; color: #fff; white-space: nowrap;">
                    \${statusText}
                  </span>
                </td>
              </tr>
            \`;
          }).join('');

          // 더보기 버튼 표시 여부 업데이트
          if (currentDisplayCount >= allAITasks.length) {
            loadMoreContainer.style.display = 'none';
          } else {
            loadMoreContainer.style.display = 'block';
          }
        }

        function loadMoreAITasks() {
          currentDisplayCount += PAGE_SIZE;
          renderAITasksTable();
        }

        function formatAssignedTime(dateString) {
          if (!dateString) return '-';
          const date = new Date(dateString);
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return \`\${month}월 \${day}일 \${hours}:\${minutes}\`;
        }

        function getStatusText(status) {
          const statusMap = {
            'pending': '미완료',
            'in_progress': '진행중',
            'completed': '완료'
          };
          return statusMap[status] || '미완료';
        }

        function getStatusColor(status) {
          const colorMap = {
            'pending': '#94a3b8',
            'in_progress': '#3b82f6',
            'completed': '#10b981'
          };
          return colorMap[status] || '#94a3b8';
        }

        // 시리즈 전체 체크박스 처리
        function handleSeriesAllChange(checkbox) {
          const allCheckboxes = document.querySelectorAll('.field-checkbox, .subject-checkbox');
          allCheckboxes.forEach(cb => {
            cb.checked = checkbox.checked;
            cb.disabled = checkbox.checked;
          });
        }

        // 분야 체크박스 처리
        function handleFieldChange(checkbox, field) {
          const subjectCheckboxes = document.querySelectorAll(\`.subject-checkbox[data-field="\${field}"]\`);
          subjectCheckboxes.forEach(cb => {
            cb.checked = checkbox.checked;
          });
          updateSeriesAllCheckbox();
        }

        // 개별 과목 체크박스 처리
        function handleSubjectChange() {
          // 각 분야별로 체크 상태 확인
          const fields = ['science', 'social', 'korlit', 'worldlit', 'person'];
          fields.forEach(field => {
            const fieldCheckbox = document.querySelector(\`.field-checkbox[data-field="\${field}"]\`);
            const subjectCheckboxes = document.querySelectorAll(\`.subject-checkbox[data-field="\${field}"]\`);
            const allChecked = Array.from(subjectCheckboxes).every(cb => cb.checked);
            const someChecked = Array.from(subjectCheckboxes).some(cb => cb.checked);

            if (allChecked) {
              fieldCheckbox.checked = true;
              fieldCheckbox.indeterminate = false;
            } else if (someChecked) {
              fieldCheckbox.checked = false;
              fieldCheckbox.indeterminate = true;
            } else {
              fieldCheckbox.checked = false;
              fieldCheckbox.indeterminate = false;
            }
          });

          updateSeriesAllCheckbox();
        }

        // 시리즈 전체 체크박스 상태 업데이트
        function updateSeriesAllCheckbox() {
          const seriesAllCheckbox = document.getElementById('series-all');
          const allSubjectCheckboxes = document.querySelectorAll('.subject-checkbox');
          const allChecked = Array.from(allSubjectCheckboxes).every(cb => cb.checked);
          const someChecked = Array.from(allSubjectCheckboxes).some(cb => cb.checked);

          if (allChecked) {
            seriesAllCheckbox.checked = true;
            seriesAllCheckbox.indeterminate = false;
          } else if (someChecked) {
            seriesAllCheckbox.checked = false;
            seriesAllCheckbox.indeterminate = true;
          } else {
            seriesAllCheckbox.checked = false;
            seriesAllCheckbox.indeterminate = false;
          }
        }

        // 요일 전체 선택 처리
        function handleDayAllChange(checkbox) {
          const dayCheckboxes = document.querySelectorAll('.day-checkbox');
          if (checkbox.checked) {
            dayCheckboxes.forEach(cb => {
              cb.checked = false;
              cb.disabled = true;
            });
          } else {
            dayCheckboxes.forEach(cb => {
              cb.disabled = false;
            });
          }
        }

        // 개별 요일 선택 처리
        function handleDayChange() {
          const dayAllCheckbox = document.getElementById('day-all');
          const dayCheckboxes = document.querySelectorAll('.day-checkbox');
          const anyDayChecked = Array.from(dayCheckboxes).some(cb => cb.checked);

          if (anyDayChecked) {
            dayAllCheckbox.checked = false;
          }
        }

        // 자동 과제 스케줄 제출
        async function submitAutoTaskSchedule() {
          try {
            // 선택된 학생 수집 (grade + name)
            const checkedRows = document.querySelectorAll('tbody input[type="checkbox"]:checked');
            const studentIds = Array.from(checkedRows).map(cb => ({
              grade: cb.dataset.grade,
              name: cb.dataset.name
            }));

            // 선택된 과목 수집
            const selectedSubjects = [];
            document.querySelectorAll('.subject-checkbox:checked').forEach(cb => {
              selectedSubjects.push(cb.value);
            });

            if (selectedSubjects.length === 0) {
              alert("최소 1개 이상의 과목을 선택해주세요.");
              return;
            }

            // 선택된 요일 수집
            const selectedDays = [];
            const dayAll = document.getElementById('day-all').checked;
            if (dayAll) {
              selectedDays.push(...['0', '1', '2', '3', '4', '5', '6']);
            } else {
              document.querySelectorAll('.day-checkbox:checked').forEach(cb => {
                selectedDays.push(cb.value);
              });
            }

            if (selectedDays.length === 0) {
              alert("최소 1개 이상의 요일을 선택해주세요.");
              return;
            }

            // 과제 개수
            const taskCount = parseInt(document.getElementById('taskCount').value);
            if (taskCount < 1 || taskCount > 5) {
              alert("과제 개수는 1~5개 사이로 설정해주세요.");
              return;
            }

            // API 호출
            const response = await fetch('/api/auto-task-schedule', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                studentIds,
                subjects: selectedSubjects,
                days: selectedDays,
                taskCount
              })
            });

            const result = await response.json();

            if (result.success) {
              alert(\`✅ 자동 과제 스케줄이 등록되었습니다.\\n대상 학생: \${studentIds.length}명\`);
              closeAutoTaskModal();
              location.reload(); // 페이지 새로고침하여 스케줄 목록 업데이트
            } else {
              alert(\`❌ 스케줄 등록 실패: \${result.message}\`);
            }
          } catch (err) {
            console.error("스케줄 등록 에러:", err);
            alert("❌ 스케줄 등록 중 오류가 발생했습니다.");
          }
        }
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

// ===== world2_XX/people2_XX → world_4X/people_4X 마이그레이션 API =====
// 기존 world2_01~40, people2_01~40 레코드를 world_41~80, people_41~80으로 변환 (중복 제거)
app.post("/api/migrate-legacy-units", async (req, res) => {
  try {
    console.log("🔄 world2_XX/people2_XX 마이그레이션 시작...");

    let totalConverted = 0;
    let totalDeleted = 0;
    let totalSkipped = 0;
    const results = { world2: { found: 0, converted: 0, deleted: 0 }, people2: { found: 0, converted: 0, deleted: 0 } };

    // 1. world2_XX 처리
    const world2Logs = await LearningLog.find({ unit: /^world2_/ });
    results.world2.found = world2Logs.length;
    console.log(`📋 world2_XX 레코드 ${world2Logs.length}개 발견`);

    for (const log of world2Logs) {
      const match = log.unit.match(/^world2_(\d+)$/);
      if (!match) continue;

      const num = parseInt(match[1], 10);
      const newUnit = `world_${num + 40}`;

      const existingLog = await LearningLog.findOne({
        grade: log.grade, name: log.name, unit: newUnit
      });

      if (existingLog) {
        await LearningLog.deleteOne({ _id: log._id });
        results.world2.deleted++;
        totalDeleted++;
      } else {
        log.unit = newUnit;
        await log.save();
        results.world2.converted++;
        totalConverted++;
      }
    }

    // 2. people2_XX 처리
    const people2Logs = await LearningLog.find({ unit: /^people2_/ });
    results.people2.found = people2Logs.length;
    console.log(`📋 people2_XX 레코드 ${people2Logs.length}개 발견`);

    for (const log of people2Logs) {
      const match = log.unit.match(/^people2_(\d+)$/);
      if (!match) continue;

      const num = parseInt(match[1], 10);
      const newUnit = `people_${num + 40}`;

      const existingLog = await LearningLog.findOne({
        grade: log.grade, name: log.name, unit: newUnit
      });

      if (existingLog) {
        await LearningLog.deleteOne({ _id: log._id });
        results.people2.deleted++;
        totalDeleted++;
      } else {
        log.unit = newUnit;
        await log.save();
        results.people2.converted++;
        totalConverted++;
      }
    }

    console.log(`🎉 마이그레이션 완료: 변환 ${totalConverted}개, 삭제 ${totalDeleted}개`);
    res.json({ ok: true, message: "마이그레이션 완료", results });
  } catch (err) {
    console.error("❌ 마이그레이션 에러:", err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ===== world_41~80 및 world1_41~80 → world2_01~40 마이그레이션 API =====
// 기존 world_41~80 또는 world1_41~80 레코드를 world2_01~40으로 변환 또는 삭제
app.post("/api/migrate-world1-to-world2", async (req, res) => {
  try {
    console.log("🔄 world_41~80 / world1_41~80 → world2_01~40 마이그레이션 시작...");

    let converted = 0;
    let deleted = 0;

    // world_41~80 또는 world1_41~80 찾기 (world_XX 또는 world1_XX 형식 모두 처리)
    const worldLogs = await LearningLog.find({
      unit: { $regex: /^world1?_(4[1-9]|[5-7][0-9]|80)$/ }
    });

    console.log(`📋 world_41~80 / world1_41~80 레코드 ${worldLogs.length}개 발견`);

    for (const log of worldLogs) {
      // world_41 또는 world1_41 형식 모두 매칭
      const match = log.unit.match(/^world1?_(\d+)$/);
      if (!match) continue;

      const num = parseInt(match[1], 10);
      if (num < 41 || num > 80) continue;

      // world_41 → world2_01, world1_42 → world2_02, ...
      const newNum = num - 40;
      const newUnit = `world2_${String(newNum).padStart(2, '0')}`;

      // 이미 world2_XX로 같은 사용자 레코드가 있는지 확인
      const existingLog = await LearningLog.findOne({
        grade: log.grade, name: log.name, unit: newUnit
      });

      if (existingLog) {
        // 중복이면 삭제
        await LearningLog.deleteOne({ _id: log._id });
        deleted++;
        console.log(`  🗑️ 삭제 (중복): ${log.unit} → ${newUnit} (${log.name})`);
      } else {
        // 변환
        log.unit = newUnit;
        await log.save();
        converted++;
        console.log(`  ✅ 변환: ${log.unit} → ${newUnit} (${log.name})`);
      }
    }

    console.log(`🎉 마이그레이션 완료: 변환 ${converted}개, 삭제 ${deleted}개`);
    res.json({
      ok: true,
      message: `world_41~80 / world1_41~80 마이그레이션 완료`,
      found: worldLogs.length,
      converted,
      deleted
    });
  } catch (err) {
    console.error("❌ 마이그레이션 에러:", err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ===== world_41~80 / world1_41~80 완전 삭제 API =====
app.post("/api/delete-world-41-80", async (req, res) => {
  try {
    console.log("🗑️ world_41~80 / world1_41~80 삭제 시작...");
    const result = await LearningLog.deleteMany({
      unit: { $regex: /^world1?_(4[1-9]|[5-7][0-9]|80)$/ }
    });
    console.log(`✅ world_41~80 레코드 ${result.deletedCount}개 삭제 완료`);
    res.json({ ok: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error("❌ 삭제 에러:", err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ===== people 관련 데이터 전체 삭제 API =====
// people_XX, people2_XX, person_XX 등 인물 관련 모든 레코드 삭제
app.post("/api/delete-all-people-data", async (req, res) => {
  try {
    console.log("🗑️ people 관련 데이터 전체 삭제 시작...");

    // people로 시작하는 모든 unit 삭제 (people_, people2_, person_, person2_ 등)
    const result = await LearningLog.deleteMany({
      unit: { $regex: /^(people|person)/ }
    });

    console.log(`✅ people 관련 데이터 ${result.deletedCount}개 삭제 완료`);
    res.json({ ok: true, message: `${result.deletedCount}개 삭제 완료`, deletedCount: result.deletedCount });
  } catch (err) {
    console.error("❌ 삭제 에러:", err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ===== world2_XX → world_4X 마이그레이션 API (레거시) =====
// 기존 world2_01~40 레코드를 world_41~80으로 변환 (중복 제거)
app.post("/api/migrate-world2", async (req, res) => {
  try {
    console.log("🔄 world2_XX → world_4X 마이그레이션 시작...");

    // 1. world2_XX 형식의 모든 레코드 찾기
    const world2Logs = await LearningLog.find({ unit: /^world2_/ });
    console.log(`📋 world2_XX 레코드 ${world2Logs.length}개 발견`);

    let converted = 0;
    let deleted = 0;
    let skipped = 0;

    for (const log of world2Logs) {
      const match = log.unit.match(/^world2_(\d+)$/);
      if (!match) {
        skipped++;
        continue;
      }

      const num = parseInt(match[1], 10);
      const newUnit = `world_${num + 40}`;  // world2_01 → world_41

      // 같은 사용자, 같은 단원(변환된)의 기존 레코드 확인
      const existingLog = await LearningLog.findOne({
        grade: log.grade,
        name: log.name,
        unit: newUnit
      });

      if (existingLog) {
        // 이미 world_4X 레코드가 있으면 world2_XX 레코드 삭제
        await LearningLog.deleteOne({ _id: log._id });
        deleted++;
        console.log(`🗑️ 삭제: ${log.name} - ${log.unit} (이미 ${newUnit} 존재)`);
      } else {
        // world_4X 레코드가 없으면 변환
        log.unit = newUnit;
        await log.save();
        converted++;
        console.log(`✅ 변환: ${log.name} - world2_${String(num).padStart(2, '0')} → ${newUnit}`);
      }
    }

    console.log(`🎉 마이그레이션 완료: 변환 ${converted}개, 삭제 ${deleted}개, 스킵 ${skipped}개`);

    res.json({
      ok: true,
      message: `마이그레이션 완료`,
      stats: { found: world2Logs.length, converted, deleted, skipped }
    });
  } catch (err) {
    console.error("❌ 마이그레이션 에러:", err);
    res.status(500).json({ ok: false, message: err.message });
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
      timestamp: new Date(),  // 학습할 때마다 시간 갱신 (최종 학습 시간)
    };

    console.log("[/api/log] 저장할 데이터:", logData);

    // 중복 방지: 같은 학생+단원이 이미 있으면 업데이트, 없으면 생성
    const savedLog = await LearningLog.findOneAndUpdate(
      { grade, name, unit },  // 검색 조건
      logData,                // 업데이트할 데이터
      {
        new: true,            // 업데이트된 문서 반환
        upsert: true,         // 없으면 생성
        setDefaultsOnInsert: true
      }
    );
    console.log("[/api/log] 저장 완료:", savedLog._id, "completed:", savedLog.completed);

    // 🔥 unit-grades 캐시 삭제 (학습 완료 시 등급 데이터 갱신 필요)
    const cacheKey = getCacheKey('unit-grades', { grade, name });
    cache.delete(cacheKey);
    console.log("🗑️ [/api/log] unit-grades 캐시 삭제:", cacheKey);

    // 🔥 학습 기록 캐시도 삭제 (학습 완료 시 기록 갱신 필요)
    // phone 파라미터 유무에 따라 캐시 키가 다를 수 있으므로 해당 사용자의 모든 learning-logs 캐시 삭제
    const logsCachePrefix = `learning-logs:{"grade":"${grade}","name":"${name}"`;
    for (const key of cache.keys()) {
      if (key.startsWith(logsCachePrefix)) {
        cache.delete(key);
        console.log("🗑️ [/api/log] learning-logs 캐시 삭제:", key);
      }
    }

    // 🔥 completion-status 캐시 삭제 (학습 완료 시 완료 상태 갱신 필요)
    const completionCachePrefix = `completion-status:{"grade":"${grade}","name":"${name}"`;
    for (const key of cache.keys()) {
      if (key.startsWith(completionCachePrefix)) {
        cache.delete(key);
        console.log("🗑️ [/api/log] completion-status 캐시 삭제:", key);
      }
    }

    // 🔥 AI 추천 과제의 status를 'completed'로 업데이트 (복습완료 처리)
    if (completed === true && unit) {
      try {
        const userProgress = await UserProgress.findOne({ grade, name });
        if (userProgress && userProgress.studyRoom && userProgress.studyRoom.assignedTasks) {
          let taskUpdated = false;
          const aiReviewTime = new Date();

          // 구 형식 ID를 새 형식으로 정규화하는 헬퍼 함수
          // world_41~80 → world2_01~40, world_1~40 → world1_01~40
          // people_41~80 → people2_01~40, people_1~40 → people1_01~40
          const normalizeUnitId = (id) => {
            if (!id) return id;
            const legacyMatch = id.match(/^(world|people)_(\d+)$/i);
            if (legacyMatch) {
              const oldPrefix = legacyMatch[1].toLowerCase();
              const num = parseInt(legacyMatch[2], 10);
              // 41~80은 world2/people2의 01~40으로 변환
              if (num >= 41 && num <= 80) {
                const newNum = (num - 40).toString().padStart(2, '0');
                return `${oldPrefix}2_${newNum}`;
              }
              // 1~40은 world1/people1의 01~40으로 변환
              const paddedNum = num.toString().padStart(2, '0');
              return `${oldPrefix}1_${paddedNum}`;
            }
            return id;
          };

          const normalizedUnit = normalizeUnitId(unit);

          userProgress.studyRoom.assignedTasks.forEach(task => {
            // AI 과제이고, id 또는 unitId가 일치하면 완료 처리 (정규화 후 비교)
            const normalizedTaskId = normalizeUnitId(task.id);
            const normalizedTaskUnitId = normalizeUnitId(task.unitId);
            if (task.isAI && (normalizedTaskId === normalizedUnit || normalizedTaskUnitId === normalizedUnit)) {
              task.status = 'completed';
              task.completedAt = aiReviewTime;
              taskUpdated = true;
              console.log(`✅ [/api/log] AI 과제 완료 처리: ${unit} (원본 task.id: ${task.id})`);
            }
          });
          if (taskUpdated) {
            await userProgress.save();
            console.log(`💾 [/api/log] UserProgress 저장 완료`);

            // 🔥 LearningLog에도 aiReviewCompletedAt 저장 (과제 삭제해도 유지됨)
            await LearningLog.updateOne(
              { grade, name, unit },
              { $set: { aiReviewCompletedAt: aiReviewTime } }
            );
            console.log(`💾 [/api/log] LearningLog에 aiReviewCompletedAt 저장: ${unit}`);
          }
        }
      } catch (aiTaskErr) {
        console.warn("⚠️ [/api/log] AI 과제 상태 업데이트 실패:", aiTaskErr.message);
        // AI 과제 업데이트 실패해도 학습 로그는 정상 저장됨
      }
    }

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

    // 캐시 키 생성 및 확인
    const cacheKey = getCacheKey('completion-status', { grade, name, series });
    const cached = getCache(cacheKey);
    if (cached) {
      console.log("💾 [/api/completion-status] 캐시 사용");
      return res.json(cached);
    }

    // 해당 학생의 완료된 단원 목록 조회
    const completedLogs = await LearningLog.find({
      grade,
      name,
      series,
      completed: true
    }).select('unit').lean();

    // 완료된 단원 코드 배열
    const completedUnits = completedLogs.map(log => log.unit);

    const result = { ok: true, completedUnits };

    // 캐시에 저장
    setCache(cacheKey, result);

    return res.json(result);
  } catch (err) {
    console.error("[/api/completion-status] error:", err);
    res.status(500).json({ ok: false, message: "서버 오류" });
  }
});

// ===== 학습 이력 보기 (슈퍼관리자 전용) - HTML 파일 서빙 =====
app.get("/admin/logs", (req, res) => {
  const { key } = req.query;

  console.log("✅ [GET] /admin/logs -> public/admin_logs.html");

  if (key !== ADMIN_KEY) {
    return res.status(403).send("관리자 인증 실패 (key 불일치)");
  }

  res.sendFile(path.join(__dirname, "public/admin_logs.html"));
});

// ===== 학습 이력 API (슈퍼관리자 전용) =====
app.get("/api/admin/logs", async (req, res) => {
  const { key, grade, name } = req.query;

  console.log("[/api/admin/logs] 요청 파라미터:", { grade, name });

  if (key !== ADMIN_KEY) {
    return res.status(403).json({ ok: false, message: "관리자 인증 실패 (key 불일치)" });
  }

  if (!grade || !name) {
    return res.status(400).json({ ok: false, message: "grade, name 파라미터가 필요합니다." });
  }

  try {
    const logs = await LearningLog.find({ grade, name, deleted: { $ne: true } })
      .sort({ timestamp: -1 })
      .lean();

    console.log("[/api/admin/logs] 조회 결과:", logs.length, "개 기록 찾음");

    // UserProgress에서 AI 과제 복습 완료 시간 가져오기
    const userProgress = await UserProgress.findOne({ grade, name });
    const aiTaskMap = new Map();

    if (userProgress && userProgress.studyRoom && userProgress.studyRoom.assignedTasks) {
      userProgress.studyRoom.assignedTasks.forEach(task => {
        if (task.isAI && task.completedAt) {
          aiTaskMap.set(task.id, task.completedAt);
        }
      });
    }

    // 각 학습 기록에 AI 복습 완료 시간 추가
    logs.forEach(log => {
      log.aiReviewCompletedAt = aiTaskMap.get(log.unit) || null;
    });

    res.json({ ok: true, logs });
  } catch (err) {
    console.error("[/api/admin/logs] 오류:", err);
    res.status(500).json({ ok: false, message: "학습 이력 조회 중 오류가 발생했습니다." });
  }
});

// ===== 기존 인라인 HTML 렌더링 코드 (삭제됨, 위의 파일 서빙 방식으로 대체) =====
app.get("/admin/logs-old-inline", async (req, res) => {
  const { key, grade, name } = req.query;

  console.log("[/admin/logs-old-inline] 요청 파라미터:", { grade, name });

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

    console.log("[/admin/logs-old-inline] 조회 결과:", logs.length, "개 기록 찾음");

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
          background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
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
          background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
          color: white;
        }

        .btn-back:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-download {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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
          background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
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

        #summary-radar-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 30px;
          justify-content: center;
        }

        #radar-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
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

        /* 과목별 종합 레이더: 한 줄에 4개 */
        #summary-radar-wrap .radar-card {
          flex: 0 0 195px;
          padding: 10px;
        }

        #summary-radar-wrap .radar-card canvas {
          width: 140px !important;
          height: 140px !important;
        }

        #summary-radar-wrap .radar-card-title {
          font-size: 12px;
        }

        #summary-radar-wrap .radar-stats {
          font-size: 10px;
        }

        #summary-radar-wrap .radar-card-header {
          margin-bottom: 8px;
        }

        /* 단원별 문해력 레이더: 한 줄에 5개 */
        #radar-wrap .radar-card {
          flex: 0 0 155px;
          padding: 8px;
        }

        #radar-wrap .radar-card canvas {
          width: 110px !important;
          height: 110px !important;
        }

        #radar-wrap .radar-card-title {
          font-size: 11px;
        }

        #radar-wrap .radar-stats {
          font-size: 9px;
        }

        #radar-wrap .radar-card-header {
          margin-bottom: 6px;
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
          color: #495057;
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
          background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
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

        /* 중앙 액션 버튼 */
        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin: 40px 0 30px 0;
        }

        .btn-send {
          padding: 14px 32px;
          background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-send:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-download-action {
          padding: 14px 32px;
          background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3);
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-download-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
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
      <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>
      <script>
        // datalabels 플러그인 등록
        Chart.register(ChartDataLabels);

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

        // ===== 검색 기능 (단원명 + 등급 통합 검색) =====
        function searchLogs(query) {
          const rows = document.querySelectorAll('#logTableBody tr');
          const clearBtn = document.getElementById('logSearchClear');

          clearBtn.classList.toggle('show', query.length > 0);

          rows.forEach(row => {
            // 테이블 구조: 순번, 과목명, AI과제부여, 최종완료, 등급(5번째), 시리즈, 단원명(마지막)
            const gradeCell = row.querySelector('td:nth-child(5)');
            const unitCell = row.querySelector('td:last-child');

            if (unitCell && gradeCell) {
              const unitText = unitCell.textContent.toLowerCase();
              const rowGrade = gradeCell.textContent.trim();
              const queryLower = query.toLowerCase();

              // 단원명 또는 등급에 검색어가 포함되면 표시
              const unitMatch = unitText.includes(queryLower);
              const gradeMatch = rowGrade.includes(queryLower);

              row.style.display = (unitMatch || gradeMatch) ? 'table-row' : 'none';
            }
          });

          updateLogCount();
        }

        function clearLogSearch() {
          document.getElementById('logSearch').value = '';
          document.getElementById('logSearchClear').classList.remove('show');
          const rows = document.querySelectorAll('#logTableBody tr');
          rows.forEach(row => row.style.display = 'table-row');
          updateLogCount();
        }

        // 표시된 로그 개수 업데이트
        function updateLogCount() {
          const visibleRows = document.querySelectorAll('#logTableBody tr:not([style*="display: none"])');
          const badge = document.getElementById('logCountBadge');
          if (badge) {
            badge.textContent = '📚 총 ' + visibleRows.length + '건의 학습 기록';
          }
        }

        // 과목별 레이더 검색
        function searchSubjectRadar(query) {
          const cards = document.querySelectorAll('#summary-radar-wrap .radar-card');
          const clearBtn = document.getElementById('subjectSearchClear');
          const toggleBtn = document.getElementById('toggleSummaryBtn');
          const gradeFilterEl = document.getElementById('subjectGradeFilter');
          const gradeFilter = gradeFilterEl ? gradeFilterEl.value : 'all';

          clearBtn.classList.toggle('show', query.length > 0);

          cards.forEach((card, index) => {
            const title = card.querySelector('.radar-card-title');
            const gradeEl = card.querySelector('.stat-grade');
            const titleText = title ? title.textContent.toLowerCase() : '';
            const cardGrade = gradeEl ? gradeEl.textContent.trim() : '';

            const searchMatch = query === '' || titleText.includes(query.toLowerCase());
            const gradeMatch = gradeFilter === 'all' || cardGrade.includes(gradeFilter);

            if (searchMatch && gradeMatch) {
              card.style.display = 'block';
              if (query.length > 0 || gradeFilter !== 'all') {
                card.classList.remove('hidden-card');
              } else if (index >= 6) {
                card.classList.add('hidden-card');
              }
            } else {
              card.style.display = 'none';
            }
          });

          // 검색/필터 중이면 더보기 버튼 숨기기
          if (query.length > 0 || gradeFilter !== 'all') {
            if (toggleBtn) toggleBtn.style.display = 'none';
          } else if (toggleBtn && cards.length > 6) {
            toggleBtn.style.display = 'block';
            toggleBtn.textContent = '더보기 ▼';
          }
        }

        function filterSubjectRadarByGrade(grade) {
          const searchInput = document.getElementById('subjectSearch');
          const query = searchInput ? searchInput.value : '';
          searchSubjectRadar(query);
        }

        function clearSubjectSearch() {
          document.getElementById('subjectSearch').value = '';
          document.getElementById('subjectSearchClear').classList.remove('show');
          document.getElementById('subjectGradeFilter').value = 'all';
          const cards = document.querySelectorAll('#summary-radar-wrap .radar-card');
          const toggleBtn = document.getElementById('toggleSummaryBtn');

          cards.forEach((card, index) => {
            card.style.display = 'block';
            if (index >= 6) {
              card.classList.add('hidden-card');
            } else {
              card.classList.remove('hidden-card');
            }
          });

          if (toggleBtn && cards.length > 6) {
            toggleBtn.style.display = 'block';
            toggleBtn.textContent = '더보기 ▼';
          }
        }

        // 단원별 레이더 검색
        function searchUnitRadar(query) {
          const cards = document.querySelectorAll('#radar-wrap .radar-card');
          const clearBtn = document.getElementById('unitSearchClear');
          const toggleBtn = document.getElementById('toggleRadarBtn');
          const gradeFilterEl = document.getElementById('unitGradeFilter');
          const gradeFilter = gradeFilterEl ? gradeFilterEl.value : 'all';

          clearBtn.classList.toggle('show', query.length > 0);

          cards.forEach((card, index) => {
            const title = card.querySelector('.radar-card-title');
            const gradeEl = card.querySelector('.stat-grade');
            const titleText = title ? title.textContent.toLowerCase() : '';
            const cardGrade = gradeEl ? gradeEl.textContent.trim() : '';

            const searchMatch = query === '' || titleText.includes(query.toLowerCase());
            const gradeMatch = gradeFilter === 'all' || cardGrade.includes(gradeFilter);

            if (searchMatch && gradeMatch) {
              card.style.display = 'block';
              if (query.length > 0 || gradeFilter !== 'all') {
                card.classList.remove('hidden-card');
              } else if (index >= 6) {
                card.classList.add('hidden-card');
              }
            } else {
              card.style.display = 'none';
            }
          });

          // 검색/필터 중이면 더보기 버튼 숨기기
          if (query.length > 0 || gradeFilter !== 'all') {
            if (toggleBtn) toggleBtn.style.display = 'none';
          } else if (toggleBtn && cards.length > 6) {
            toggleBtn.style.display = 'block';
            toggleBtn.textContent = '더보기 ▼';
          }
        }

        function filterUnitRadarByGrade(grade) {
          const searchInput = document.getElementById('unitSearch');
          const query = searchInput ? searchInput.value : '';
          searchUnitRadar(query);
        }

        function clearUnitSearch() {
          document.getElementById('unitSearch').value = '';
          document.getElementById('unitSearchClear').classList.remove('show');
          document.getElementById('unitGradeFilter').value = 'all';
          const cards = document.querySelectorAll('#radar-wrap .radar-card');
          const toggleBtn = document.getElementById('toggleRadarBtn');

          cards.forEach((card, index) => {
            card.style.display = 'block';
            if (index >= 6) {
              card.classList.add('hidden-card');
            } else {
              card.classList.remove('hidden-card');
            }
          });

          if (toggleBtn && cards.length > 6) {
            toggleBtn.style.display = 'block';
            toggleBtn.textContent = '더보기 ▼';
          }
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

        // ===== 진행률 표시를 위한 헬퍼 함수 및 데이터 =====
        // 과목 코드 → 총 단원 수 매핑
        const subjectUnitCounts = {
          'bio': 20, 'earth': 20, 'physics': 20, 'chem': 20,
          'geo': 20, 'soc': 20, 'law': 20, 'pol': 20,
          'modern': 40, 'classic': 40,
          'world': 40, 'world1': 40, 'world2': 40,
          'people': 40, 'people1': 40, 'people2': 40, 'person1': 40, 'person2': 40
        };

        // 분야별 총 단원 수
        const fieldUnitCounts = {
          '과학분야': 80,
          '사회분야': 80,
          '한국문학': 80,
          '세계문학': 80,
          '인물분야': 80
        };

        // 시리즈 총 단원 수
        const seriesTotalUnits = 400;

        // 단원 코드 정규화 함수 (world1_XX, world2_XX, people1_XX, people2_XX가 표준 형식)
        function normalizeUnitCode(unit) {
          // fit_ 접두어 제거: fit_bio_01 -> bio_01
          if (unit.startsWith('fit_')) {
            unit = unit.substring(4);
          }
          // deep_ 접두어 제거: deep_bio_01 -> bio_01
          if (unit.startsWith('deep_')) {
            unit = unit.substring(5);
          }
          // on_ 접두어 제거: on_bio_01 -> bio_01
          if (unit.startsWith('on_')) {
            unit = unit.substring(3);
          }
          // world1_XX, world2_XX는 이미 표준 형식
          if (unit.startsWith('world1_') || unit.startsWith('world2_')) {
            return unit;
          }
          // people1_XX, people2_XX는 이미 표준 형식
          if (unit.startsWith('people1_') || unit.startsWith('people2_')) {
            return unit;
          }
          // 레거시: world_01~40 -> world1_XX, world_41~80 -> world2_XX
          if (unit.startsWith('world_')) {
            const numMatch = unit.match(/world_([0-9]+)$/);
            if (numMatch) {
              const num = parseInt(numMatch[1]);
              if (num >= 1 && num <= 40) {
                return 'world1_' + String(num).padStart(2, '0');
              } else if (num >= 41 && num <= 80) {
                return 'world2_' + String(num - 40).padStart(2, '0');
              }
            }
          }
          // 레거시: people_01~40 -> people1_XX, people_41~80 -> people2_XX
          if (unit.startsWith('people_')) {
            const numMatch = unit.match(/people_([0-9]+)$/);
            if (numMatch) {
              const num = parseInt(numMatch[1]);
              if (num >= 1 && num <= 40) {
                return 'people1_' + String(num).padStart(2, '0');
              } else if (num >= 41 && num <= 80) {
                return 'people2_' + String(num - 40).padStart(2, '0');
              }
            }
          }
          return unit;
        }

        // logsForChart에서 완료된 고유 단원 수집 (정규화된 코드 사용)
        const completedUnitsSet = new Set();
        logsForChart.forEach(log => {
          if (log.unit) {
            completedUnitsSet.add(normalizeUnitCode(log.unit));
          }
        });

        // 과목별 완료 개수 계산 (logsForChart 기반)
        function getCompletedCount(subjectCode) {
          let count = 0;
          completedUnitsSet.forEach(unit => {
            // world1, world2, people1, people2는 이제 표준 형식으로 직접 매칭
            if (unit.startsWith(subjectCode + '_')) {
              count++;
            }
          });
          return count;
        }

        // 분야별 완료 개수 계산
        function getFieldCompletedCount(fieldName) {
          const fieldSubjects = {
            '과학분야': ['bio', 'earth', 'physics', 'chem'],
            '사회분야': ['geo', 'soc', 'law', 'pol'],
            '한국문학': ['modern', 'classic'],
            '세계문학': ['world1', 'world2'],
            '인물분야': ['people1', 'people2']
          };
          const subjects = fieldSubjects[fieldName] || [];
          let total = 0;
          subjects.forEach(subjectCode => {
            total += getCompletedCount(subjectCode);
          });
          return total;
        }

        // 시리즈 전체 완료 개수 계산
        function getSeriesCompletedCount() {
          return completedUnitsSet.size;
        }

        // ===== 종합 레이더 차트 생성 =====
        const summaryWrap = document.getElementById('summary-radar-wrap');

        // 과목 코드 → 과목명 매핑
        const subjectNames = {
          'geo': '지리',
          'bio': '생물',
          'earth': '지구과학',
          'physics': '물리',
          'chem': '화학',
          'soc': '사회문화',
          'law': '법',
          'pol': '정치경제',
          'modern': '현대문학',
          'classic': '고전문학',
          'world': '세계문학1',
          'world1': '세계문학1',
          'world2': '세계문학2',
          'people': '한국인물',
          'people1': '한국인물',
          'people2': '세계인물',
          'person1': '한국인물',
          'person2': '세계인물'
        };

        // 과목 코드 → 분야 클래스 매핑
        const subjectToFieldClass = {
          'bio': 'science',
          'earth': 'science',
          'physics': 'science',
          'chem': 'science',
          'geo': 'society',
          'soc': 'society',
          'law': 'society',
          'pol': 'society',
          'modern': 'korean-lit',
          'classic': 'korean-lit',
          'world': 'world-lit',
          'world1': 'world-lit',
          'world2': 'world-lit',
          'people': 'person',
          'people1': 'person',
          'people2': 'person',
          'person1': 'person',
          'person2': 'person'
        };

        // ===== 과목별 종합 레이더 함수 =====
        function renderSubjectRadar(logs) {
          // 기존 카드 제거
          summaryWrap.innerHTML = '';

          // 필터링된 로그에서 완료된 과목별 단원 수 계산
          function getFilteredCompletedCount(subjectCode, filteredLogs) {
            const unitSet = new Set();
            filteredLogs.forEach(log => {
              if (log.unit) {
                let unitCode = log.unit;
                if (unitCode.startsWith('fit_')) unitCode = unitCode.substring(4);
                else if (unitCode.startsWith('deep_')) unitCode = unitCode.substring(5);
                else if (unitCode.startsWith('on_')) unitCode = unitCode.substring(3);
                if (unitCode.startsWith(subjectCode + '_')) {
                  unitSet.add(unitCode);
                }
              }
            });
            return unitSet.size;
          }

          // 과목별로 그룹화 (unit 코드에서 과목 추출: geo, history 등)
          const subjectGroups = {};
          logs.forEach(log => {
            if (!log.radar || !log.unit) return;

            // unit 코드에서 과목 추출 (geo_01 -> geo, history_01 -> history)
            // fit_ / deep_ / on_ 접두어 제거: fit_bio_01 -> bio_01, deep_bio_01 -> bio_01, on_bio_01 -> bio_01
            let unitForSubject = log.unit;
            if (unitForSubject.startsWith('fit_')) {
              unitForSubject = unitForSubject.substring(4);
            } else if (unitForSubject.startsWith('deep_')) {
              unitForSubject = unitForSubject.substring(5);
            } else if (unitForSubject.startsWith('on_')) {
              unitForSubject = unitForSubject.substring(3);
            }
            let subjectCode = unitForSubject.split('_')[0];

          // world_01~40 -> world1, world_41~80 -> world2 (people도 동일)
          // world2_XX, people2_XX는 직접 world2, people2로 매핑
          if (subjectCode === 'world' || subjectCode === 'people') {
            const numMatch = unitForSubject.match(/_([0-9]+)$/);
            const num = numMatch ? parseInt(numMatch[1]) : 0;
            if (subjectCode === 'world') {
              subjectCode = num <= 40 ? 'world1' : 'world2';
            } else {
              subjectCode = num <= 40 ? 'people1' : 'people2';
            }
          } else if (subjectCode === 'world1' || subjectCode === 'world2' || subjectCode === 'people1' || subjectCode === 'people2' || subjectCode === 'person1' || subjectCode === 'person2') {
            // world1, world2, people1, people2, person1, person2는 그대로 유지
            // person1 -> people1, person2 -> people2로 통합
            if (subjectCode === 'person1') subjectCode = 'people1';
            if (subjectCode === 'person2') subjectCode = 'people2';
          }

          // unit 코드에서 시리즈명 추출
          const seriesFromUnit = (function(unit) {
            if (!unit) return 'BRAIN업';
            if (unit.includes('on_')) return 'BRAIN온';
            if (unit.includes('fit_')) return 'BRAIN핏';
            if (unit.includes('deep_')) return 'BRAIN딥';
            return 'BRAIN업';
          })(log.unit);
          const subjectKey = seriesFromUnit + '_' + subjectCode;

          if (!subjectGroups[subjectKey]) {
            subjectGroups[subjectKey] = {
              series: seriesFromUnit,
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
          const subjectTotal = subjectUnitCounts[group.subjectCode] || 20;
          const subjectCompleted = getFilteredCompletedCount(group.subjectCode, logs);
          const displayTitle = group.series + ' ' + subjectName + ' (' + subjectCompleted + '/' + subjectTotal + ')';

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
          const fieldClass = subjectToFieldClass[group.subjectCode] || '';
          const card = document.createElement('div');
          card.className = 'radar-card summary-card subject-card ' + fieldClass + (summaryIndex >= 6 ? ' hidden-card' : '');
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

        // ===== PDF 다운로드 함수 =====
        async function downloadPDF() {
          const container = document.querySelector('.container');
          const { jsPDF } = window.jspdf;

          try {
            const canvas = await html2canvas(container, {
              scale: 2,
              useCORS: true,
              logging: false,
              backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.5);
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4'
            });

            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
              position = heightLeft - imgHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }

            const fileName = \`학습이력_${grade}_${name}_\${new Date().toISOString().slice(0, 10)}.pdf\`;
            pdf.save(fileName);
          } catch (error) {
            console.error('PDF 생성 오류:', error);
            alert('PDF 생성 중 오류가 발생했습니다.');
          }
        }
      </script>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

      <script>
        // 학습이력 전송 (mailto 방식)
        function openSendModal() {
          const subject = \`[단단교실] ${grade} ${name} 학생 학습이력\`;
          const body = \`안녕하세요,\\n\\n${grade} ${name} 학생의 학습이력 리포트를 전송합니다.\\n\\n📊 학습 분석 내용:\\n- 학습 기록 및 점수\\n- 단원별 문제별 레이더 차트\\n- 종합 분석 결과\\n\\n자세한 내용은 첨부된 PDF 파일을 확인해주세요.\\n\\n※ PDF 파일은 '다운로드' 버튼을 클릭하여 먼저 저장한 후 이메일에 첨부해주세요.\\n\\n감사합니다.\`;

          const mailtoLink = \`mailto:?subject=\${encodeURIComponent(subject)}&body=\${encodeURIComponent(body)}\`;

          console.log('📧 이메일 앱 열기:', mailtoLink);
          window.location.href = mailtoLink;
        }
      </script>

      <div class="action-buttons">
        <button class="btn-send" onclick="openSendModal()">
          📤 전송하기
        </button>
        <button class="btn-download-action" onclick="downloadPDF()">
          📥 다운로드
        </button>
      </div>

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

// ===== 학습 기록 조회 API (뱃지용) =====
app.get("/api/learning-logs", async (req, res) => {
  const { grade, name, phone } = req.query;

  console.log("📊 [/api/learning-logs] 요청:", { grade, name, phone });

  if (!grade || !name) {
    return res.status(400).json({ error: "grade, name 파라미터가 필요합니다." });
  }

  // 캐시 키 생성
  const cacheKey = getCacheKey('learning-logs', { grade, name, phone });
  const cached = getCache(cacheKey);
  if (cached) {
    console.log("💾 [/api/learning-logs] 캐시 사용");
    return res.json(cached);
  }

  try {
    // phone이 있으면 phone으로도 필터링 (새로운 학습 기록용)
    // phone이 없으면 grade, name만으로 필터링 (기존 학습 기록 호환)
    const query = phone
      ? { grade, name, phone }
      : { grade, name };

    const logs = await LearningLog.find(query)
      .sort({ timestamp: -1 })
      .lean();

    // UserProgress에서 AI 과제 복습 완료 시간 가져오기
    const userProgress = await UserProgress.findOne({ grade, name });
    const aiTaskMap = new Map();

    if (userProgress && userProgress.studyRoom && userProgress.studyRoom.assignedTasks) {
      userProgress.studyRoom.assignedTasks.forEach(task => {
        if (task.isAI && task.completedAt) {
          aiTaskMap.set(task.id, task.completedAt);
        }
      });
    }

    // 각 학습 기록에 AI 복습 완료 시간 추가
    const logsWithAIReview = logs.map(log => ({
      ...log,
      aiReviewCompletedAt: aiTaskMap.get(log.unit) || null
    }));

    // 캐시에 저장
    setCache(cacheKey, logsWithAIReview);

    res.json(logsWithAIReview);
  } catch (err) {
    console.error("❌ /api/learning-logs 에러:", err);
    res.status(500).json({ error: "학습 기록 조회 중 오류가 발생했습니다." });
  }
});

// ===== 단원별 최신 등급 조회 API =====
app.get("/api/unit-grades", async (req, res) => {
  const { grade, name } = req.query;

  console.log("⭐ [/api/unit-grades] 요청:", { grade, name });

  if (!grade || !name) {
    return res.status(400).json({ error: "grade, name 파라미터가 필요합니다." });
  }

  // 캐시 키 생성
  const cacheKey = getCacheKey('unit-grades', { grade, name });
  const cached = getCache(cacheKey);
  if (cached) {
    console.log("💾 [/api/unit-grades] 캐시 사용");
    return res.json(cached);
  }

  try {
    // 학생의 모든 학습 기록 조회
    const logs = await LearningLog.find({ grade, name, deleted: false })
      .sort({ timestamp: -1 })
      .lean();

    // 단원별로 가장 최신 학습 기록의 등급 추출
    const unitGradesMap = {};

    logs.forEach(log => {
      let unitId = log.unit;

      // people2_XX, people1_XX, world2_XX 형식 그대로 유지 (변환하지 않음)
      // 클라이언트에서 normalizeUnitId로 동일하게 변환하므로 그대로 사용

      // 이미 등록된 단원이 아니면 추가 (최신 순으로 정렬되어 있으므로 첫 번째가 최신)
      if (!unitGradesMap[unitId] && log.radar) {
        // 레이더 평균 계산
        const radarValues = Object.values(log.radar);
        const radarAvg = radarValues.reduce((sum, val) => sum + val, 0) / radarValues.length;

        // 등급 결정 (종합리포트와 동일한 기준 적용)
        let grade = '격려';
        if (radarAvg >= 9) {
          grade = '우수';
        } else if (radarAvg >= 8) {
          grade = '양호';
        } else if (radarAvg >= 7) {
          grade = '보통';
        }

        unitGradesMap[unitId] = {
          grade: grade,
          radarAvg: radarAvg.toFixed(2),
          timestamp: log.timestamp,
          radar: log.radar  // ✅ 레이더 점수 데이터 포함
        };
      }
    });

    // 캐시에 저장
    setCache(cacheKey, unitGradesMap);

    res.json(unitGradesMap);
  } catch (err) {
    console.error("❌ /api/unit-grades 에러:", err);
    res.status(500).json({ error: "단원 등급 조회 중 오류가 발생했습니다." });
  }
});

// ===== 학생용 학습 이력 보기 (인증 불필요) =====
app.get("/my-learning", async (req, res) => {
  // 캐시 방지 헤더 설정
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  const { grade, name, series } = req.query;

  console.log("📊 [/my-learning] 요청:", { grade, name, series });

  if (!grade || !name) {
    console.log("❌ [/my-learning] 파라미터 부족");
    return res.status(400).send("grade, name 파라미터가 필요합니다.");
  }

  try {
    const logs = await LearningLog.find({ grade, name, deleted: { $ne: true } })
      .sort({ timestamp: -1 })
      .lean();

    console.log("✅ [/my-learning] 조회 결과:", logs.length, "개 기록");

    // 🔥 LearningLog에 저장된 aiReviewCompletedAt 직접 사용 (과제 삭제해도 유지됨)
    // logs에는 이미 aiReviewCompletedAt 필드가 포함되어 있음

    // ✅ UserProgress에서 어휘학습 점수 가져오기
    const userProgress = await UserProgress.findOne({ grade, name }).lean();
    // Map 타입은 lean()하면 일반 객체로 변환됨
    let unitProgressMap = {};
    if (userProgress?.unitProgress) {
      // Map이 Object로 변환된 경우 또는 이미 Object인 경우 모두 처리
      if (userProgress.unitProgress instanceof Map) {
        unitProgressMap = Object.fromEntries(userProgress.unitProgress);
      } else {
        unitProgressMap = userProgress.unitProgress;
      }
    }
    console.log("✅ [/my-learning] UserProgress unitProgress 조회 완료, 키 개수:", Object.keys(unitProgressMap).length);

    let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>나의 AI 학습 분석 - ${grade} ${name}</title>
      <!-- html2canvas & jsPDF 라이브러리 -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      <style>
        /* 🔄 로딩 스피너 - 인라인 크리티컬 CSS */
        #loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(242, 237, 229, 0.95);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          transition: opacity 0.5s ease;
        }

        #loading-overlay.fade-out {
          opacity: 0;
          pointer-events: none;
        }

        .spinner-container {
          text-align: center;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(139, 47, 47, 0.2);
          border-top: 4px solid #8b2f2f;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        .loading-text {
          color: #8b2f2f;
          font-size: 16px;
          font-weight: 600;
          font-family: "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

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
          color: #1e3a8a;
          margin-bottom: 15px;
        }

        .subtitle {
          font-size: 18px;
          color: #7f8c8d;
          font-weight: 500;
        }

        .stats-badge {
          display: inline-block;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          padding: 12px 28px;
          border-radius: 30px;
          font-size: 16px;
          font-weight: 600;
          margin: 30px 0;
          box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
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

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 15px;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 25px;
          padding: 8px 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .search-box:focus-within {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .search-box input {
          border: none;
          outline: none;
          font-size: 14px;
          width: 150px;
          background: transparent;
        }

        .search-box input::placeholder {
          color: #aaa;
        }

        .search-box .search-icon {
          color: #667eea;
          margin-right: 8px;
        }

        .search-box .clear-btn {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 16px;
          padding: 0 4px;
          display: none;
        }

        .search-box .clear-btn.show {
          display: inline;
        }

        .search-box .clear-btn:hover {
          color: #e74c3c;
        }

        .grade-filter {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 25px;
          padding: 8px 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .grade-filter:focus-within {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .grade-filter select {
          border: none;
          outline: none;
          font-size: 14px;
          background: transparent;
          cursor: pointer;
          color: #333;
          padding-right: 8px;
        }

        .grade-filter .filter-icon {
          color: #667eea;
          margin-right: 8px;
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
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
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

        th[onclick] {
          cursor: pointer;
          user-select: none;
          transition: background 0.2s ease;
        }

        th[onclick]:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
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
          cursor: pointer;
        }

        tbody tr:hover {
          background: linear-gradient(135deg, #e8f4fd 0%, #d4edfc 100%);
          transform: scale(1.01);
        }

        tbody tr:active {
          background: linear-gradient(135deg, #cce5ff 0%, #b3d9ff 100%);
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        /* 단원명 클릭 가능 표시 */
        .unit-link {
          color: #1e3a8a;
          font-weight: 600;
        }

        .unit-link::after {
          content: ' 📖';
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
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
        }

        .toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(30, 58, 138, 0.4);
        }

        .toggle-btn:active {
          transform: translateY(0);
        }

        /* Progress Section Styles */
        .progress-section {
          margin: 40px 0;
        }

        .total-progress-card {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          border-radius: 24px;
          padding: 50px 40px;
          margin-bottom: 40px;
          box-shadow: 0 15px 40px rgba(30, 58, 138, 0.4);
          text-align: center;
          position: relative;
          overflow: hidden;
          border: 3px solid rgba(255, 255, 255, 0.3);
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .total-progress-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: rotate(45deg);
          animation: shimmer 3s infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 15px 40px rgba(30, 58, 138, 0.4);
          }
          50% {
            box-shadow: 0 15px 50px rgba(30, 58, 138, 0.6), 0 0 30px rgba(30, 58, 138, 0.3);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        .total-progress-title {
          font-size: 40px;
          font-weight: 800;
          margin-bottom: 30px;
          color: white;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          letter-spacing: -0.5px;
          position: relative;
          z-index: 1;
        }

        .total-progress-bar-container {
          width: 100%;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          overflow: hidden;
          position: relative;
          margin-bottom: 25px;
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          z-index: 1;
        }

        .total-progress-bar {
          height: 100%;
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e3a8a;
          font-weight: 900;
          font-size: 22px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.5);
        }

        .total-progress-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
          );
          animation: progress-shimmer 2s infinite;
        }

        @keyframes progress-shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        .total-progress-text {
          font-size: 24px;
          color: white;
          font-weight: 700;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .field-progress-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .field-progress-card {
          background: white;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .field-progress-card.science {
          border: 2px solid #4facfe;
        }

        .field-progress-card.society {
          border: 2px solid #43e97b;
        }

        .field-progress-card.korean-lit {
          border: 2px solid #fa709a;
        }

        .field-progress-card.world-lit {
          border: 2px solid #30cfd0;
        }

        .field-progress-card.person {
          border: 2px solid #a8edea;
        }

        .field-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .field-title-text {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .field-percent {
          font-size: 24px;
          font-weight: 700;
        }

        .field-percent.science {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .field-percent.society {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .field-percent.korean-lit {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .field-percent.world-lit {
          background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .field-percent.person {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .field-progress-bar-container {
          width: 100%;
          height: 12px;
          background: #f0f0f0;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .field-progress-bar {
          height: 100%;
          transition: width 0.5s ease;
        }

        .field-progress-bar.science {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .field-progress-bar.society {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        .field-progress-bar.korean-lit {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        .field-progress-bar.world-lit {
          background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
        }

        .field-progress-bar.person {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        }

        .field-progress-text {
          font-size: 14px;
          color: #666;
          margin-bottom: 15px;
        }

        .subject-list {
          border-left: 2px solid #e0e0e0;
          padding-left: 15px;
          margin-left: 5px;
        }

        .subject-item {
          margin-bottom: 12px;
        }

        .subject-title {
          font-size: 13px;
          color: #555;
          margin-bottom: 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .subject-progress-bar-container {
          width: 100%;
          height: 6px;
          background: #f0f0f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .subject-progress-bar {
          height: 100%;
          transition: width 0.5s ease;
          opacity: 0.7;
        }

        .subject-progress-bar.science {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .subject-progress-bar.society {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        .subject-progress-bar.korean-lit {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        .subject-progress-bar.world-lit {
          background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
        }

        .subject-progress-bar.person {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        }

        #radar-wrap, #summary-radar-wrap, #series-radar-wrap, #field-radar-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
          margin: 20px 0;
        }

        .radar-card {
          flex: 0 0 320px;
          border: 2px solid #e5d4c1;
          border-radius: 20px;
          padding: 16px;
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

        /* 시리즈 카드 - 파란색 */
        .radar-card.series-card {
          border-color: rgba(54, 162, 235, 0.5);
        }

        .radar-card.series-card::before {
          background: linear-gradient(90deg, #36a2eb 0%, #1e88e5 50%, #1565c0 100%) !important;
        }

        .radar-card.series-card .radar-card-title {
          color: #1565c0;
        }

        .radar-card.series-card .stat-value {
          color: #36a2eb !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: unset !important;
        }

        /* 분야별 카드 - 보라색 */
        .radar-card.field-card {
          border-color: rgba(153, 102, 255, 0.5);
        }

        .radar-card.field-card::before {
          background: linear-gradient(90deg, #9966ff 0%, #7e57c2 50%, #5e35b1 100%) !important;
        }

        .radar-card.field-card .radar-card-title {
          color: #5e35b1;
        }

        .radar-card.field-card .stat-value {
          color: #9966ff !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: unset !important;
        }

        /* 분야별 카드 - 각 분야 색상 적용 */
        .radar-card.field-card.science {
          border: 2px solid #4facfe;
        }
        .radar-card.field-card.science::before {
          background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%) !important;
        }
        .radar-card.field-card.science .radar-card-title {
          color: #4facfe;
        }
        .radar-card.field-card.science .stat-value {
          color: #4facfe !important;
        }

        .radar-card.field-card.society {
          border: 2px solid #43e97b;
        }
        .radar-card.field-card.society::before {
          background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%) !important;
        }
        .radar-card.field-card.society .radar-card-title {
          color: #38b060;
        }
        .radar-card.field-card.society .stat-value {
          color: #43e97b !important;
        }

        .radar-card.field-card.korean-lit {
          border: 2px solid #fa709a;
        }
        .radar-card.field-card.korean-lit::before {
          background: linear-gradient(90deg, #fa709a 0%, #fee140 100%) !important;
        }
        .radar-card.field-card.korean-lit .radar-card-title {
          color: #e05780;
        }
        .radar-card.field-card.korean-lit .stat-value {
          color: #fa709a !important;
        }

        .radar-card.field-card.world-lit {
          border: 2px solid #30cfd0;
        }
        .radar-card.field-card.world-lit::before {
          background: linear-gradient(90deg, #30cfd0 0%, #330867 100%) !important;
        }
        .radar-card.field-card.world-lit .radar-card-title {
          color: #2ab0b1;
        }
        .radar-card.field-card.world-lit .stat-value {
          color: #30cfd0 !important;
        }

        .radar-card.field-card.person {
          border: 2px solid #b388ff;
        }
        .radar-card.field-card.person::before {
          background: linear-gradient(90deg, #b388ff 0%, #7c4dff 100%) !important;
        }
        .radar-card.field-card.person .radar-card-title {
          color: #9575cd;
        }
        .radar-card.field-card.person .stat-value {
          color: #b388ff !important;
        }

        /* 과목별 카드 - 분야별 색상 적용 */
        .radar-card.subject-card.science {
          border: 2px solid #4facfe;
        }
        .radar-card.subject-card.science::before {
          background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%) !important;
        }
        .radar-card.subject-card.science .radar-card-title {
          color: #4facfe;
        }
        .radar-card.subject-card.science .stat-value {
          color: #4facfe !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: unset !important;
        }

        .radar-card.subject-card.society {
          border: 2px solid #43e97b;
        }
        .radar-card.subject-card.society::before {
          background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%) !important;
        }
        .radar-card.subject-card.society .radar-card-title {
          color: #38b060;
        }
        .radar-card.subject-card.society .stat-value {
          color: #43e97b !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: unset !important;
        }

        .radar-card.subject-card.korean-lit {
          border: 2px solid #fa709a;
        }
        .radar-card.subject-card.korean-lit::before {
          background: linear-gradient(90deg, #fa709a 0%, #fee140 100%) !important;
        }
        .radar-card.subject-card.korean-lit .radar-card-title {
          color: #e05780;
        }
        .radar-card.subject-card.korean-lit .stat-value {
          color: #fa709a !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: unset !important;
        }

        .radar-card.subject-card.world-lit {
          border: 2px solid #30cfd0;
        }
        .radar-card.subject-card.world-lit::before {
          background: linear-gradient(90deg, #30cfd0 0%, #330867 100%) !important;
        }
        .radar-card.subject-card.world-lit .radar-card-title {
          color: #2ab0b1;
        }
        .radar-card.subject-card.world-lit .stat-value {
          color: #30cfd0 !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: unset !important;
        }

        .radar-card.subject-card.person {
          border: 2px solid #b388ff;
        }
        .radar-card.subject-card.person::before {
          background: linear-gradient(90deg, #b388ff 0%, #7c4dff 100%) !important;
        }
        .radar-card.subject-card.person .radar-card-title {
          color: #9575cd;
        }
        .radar-card.subject-card.person .stat-value {
          color: #b388ff !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: unset !important;
        }

        .radar-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
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
          margin-top: 10px;
          padding-top: 10px;
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
          color: #495057;
        }

        .stat-value.excellent {
          color: #4facfe;
        }

        .stat-value.good {
          color: #ffd700;
        }

        .stat-value.normal {
          color: #ff9a56;
        }

        .stat-value.encourage {
          color: #ff6b6b;
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

        /* 시리즈 선택 드롭다운 */
        .series-selector {
          position: absolute;
          top: 30px;
          left: 30px;
          z-index: 100;
        }

        .series-dropdown {
          position: relative;
        }

        .series-button {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
          transition: all 0.3s ease;
        }

        .series-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(30, 58, 138, 0.4);
        }

        .series-button .arrow {
          transition: transform 0.3s ease;
        }

        .series-button.active .arrow {
          transform: rotate(180deg);
        }

        .series-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          min-width: 200px;
          overflow: hidden;
          display: none;
        }

        .series-menu.show {
          display: block;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .series-item {
          padding: 14px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 1px solid #f0f0f0;
          font-size: 14px;
          font-weight: 500;
          color: #2c3e50;
        }

        .series-item:last-child {
          border-bottom: none;
        }

        .series-item:hover {
          background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf3 100%);
        }

        .series-item.active {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          font-weight: 700;
        }

        /* 시리즈 요약 박스 */
        .series-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 30px 0 40px;
        }

        .summary-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .summary-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .summary-card.average {
          border-color: #4facfe;
        }

        .summary-card.progress {
          border-color: #43e97b;
        }

        .summary-label {
          font-size: 14px;
          color: #7f8c8d;
          font-weight: 600;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .summary-value {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .summary-card.average .summary-value {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .summary-card.progress .summary-value {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .summary-subtext {
          font-size: 13px;
          color: #95a5a6;
        }

        .total-progress-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #2c3e50;
        }

        /* Today 학습 기록 섹션 */
        .today-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 20px 30px 30px 30px;
          margin: 30px 0;
          box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
        }

        .today-section .section-title {
          color: white;
          font-size: 28px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 8px;
        }

        .today-section .section-description {
          color: rgba(255,255,255,0.8);
          text-align: center;
          margin-bottom: 20px;
        }

        #todayTableContainer {
          background: rgba(255,255,255,0.95);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .today-table {
          width: 100%;
          border-collapse: collapse;
        }

        .today-table th {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          padding: 14px 12px;
          font-size: 13px;
          font-weight: 600;
        }

        .today-table td {
          padding: 12px;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
        }

        .today-table td:nth-child(4) {
          text-align: left;
        }

        .today-table tbody tr:hover {
          background: #f0f9ff;
        }

        /* 아이패드 세로모드: Today 학습 기록 테이블 최적화 */
        @media (max-width: 850px) {
          /* 시리즈 컬럼 숨기기 (2번째 컬럼) */
          .today-table th:nth-child(2),
          .today-table td:nth-child(2) {
            display: none;
          }
          /* 분야 컬럼 */
          .today-table th:nth-child(3),
          .today-table td:nth-child(3) {
            min-width: 65px;
            padding: 10px 8px;
          }
          /* 등급 컬럼 - 작은 뱃지 스타일 */
          .today-table th:nth-child(5),
          .today-table td:nth-child(5) {
            min-width: 45px;
            padding: 8px 4px;
          }
          .today-table td:nth-child(5) .badge {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 8px;
          }
          /* 단원명 폰트 살짝 줄이기 */
          .today-table td:nth-child(4) {
            font-size: 12px;
          }
        }

        .today-no-data {
          text-align: center;
          padding: 40px;
          color: rgba(255,255,255,0.8);
          font-size: 16px;
        }

        /* AI 피드백 박스 스타일 */
        .ai-feedback-box {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%);
          border-radius: 12px;
          padding: 15px;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .ai-feedback-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.15);
        }
        .ai-feedback-icon {
          font-size: 20px;
        }
        .ai-feedback-title {
          color: #FFD54F;
          font-size: 14px;
          font-weight: 600;
        }
        .ai-feedback-content {
          color: white;
          font-size: 14px;
          line-height: 1.7;
          white-space: pre-wrap;
        }
        .ai-feedback-loading {
          color: rgba(255,255,255,0.7);
          font-style: italic;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ai-feedback-loading::before {
          content: "";
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #FFD54F;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .ai-feedback-error {
          color: #ff9999;
        }

        /* 통합 AI 피드백 섹션 스타일 */
        .ai-feedback-section {
          background: linear-gradient(135deg, rgba(107, 79, 160, 0.95) 0%, rgba(139, 111, 192, 0.95) 100%);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        }
        .ai-feedback-section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
          padding-bottom: 12px;
          border-bottom: 2px solid rgba(255,255,255,0.2);
        }
        .ai-feedback-section-title {
          color: #FFD54F;
          font-size: 18px;
          font-weight: 700;
        }
        .ai-feedback-loading-box {
          text-align: center;
          padding: 20px;
        }
        .ai-feedback-all-content {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .ai-feedback-item {
          background: rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 15px;
          border-left: 3px solid #FFD54F;
        }
        .ai-feedback-item-title {
          color: #FFD54F;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .ai-feedback-item-content {
          color: white;
          font-size: 14px;
          line-height: 1.8;
        }
        .ai-feedback-item {
          position: relative;
        }
        .ai-feedback-edit-btn {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.7);
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ai-feedback-edit-btn:hover {
          background: rgba(255,255,255,0.25);
          color: white;
        }
        .ai-feedback-textarea {
          width: 100%;
          min-height: 80px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          color: white;
          font-size: 14px;
          line-height: 1.8;
          padding: 10px;
          resize: vertical;
          font-family: inherit;
        }
        .ai-feedback-textarea:focus {
          outline: none;
          border-color: #FFD54F;
        }
        .ai-feedback-edit-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 8px;
        }
        .ai-feedback-save-btn {
          background: #FFD54F;
          color: #333;
          border: none;
          padding: 5px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          font-weight: 600;
        }
        .ai-feedback-cancel-btn {
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          padding: 5px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          white-space: pre-wrap;
        }
        .ai-feedback-bottom-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .ai-feedback-edit-all-btn {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.9);
          font-size: 13px;
          padding: 8px 20px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }
        .ai-feedback-edit-all-btn:hover {
          background: rgba(255,255,255,0.25);
          color: white;
        }
        .ai-feedback-save-actions {
          display: flex;
          gap: 10px;
        }
        .ai-feedback-cancel-all-btn {
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        .ai-feedback-cancel-all-btn:hover {
          background: rgba(255,255,255,0.3);
        }
        .ai-feedback-save-all-btn {
          background: #FFD54F;
          color: #333;
          border: none;
          padding: 8px 20px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        .ai-feedback-save-all-btn:hover {
          background: #FFCA28;
        }

        /* Today 미니 레이더 카드 */
        .today-radar-section {
          margin-top: 25px;
        }

        .today-radar-title {
          color: white;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .today-radar-slider {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
        }

        .today-radar-viewport {
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        #today-radar-wrap {
          display: flex;
          flex-wrap: nowrap;
          gap: 15px;
          justify-content: flex-start;
          transition: transform 0.3s ease;
        }

        .slider-arrow {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          color: #667eea;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .slider-arrow:hover {
          background: #667eea;
          color: white;
          transform: scale(1.1);
        }

        .slider-arrow:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none;
        }

        .slider-arrow:disabled:hover {
          background: rgba(255, 255, 255, 0.9);
          color: #667eea;
        }

        #today-radar-wrap .radar-card {
          flex: 0 0 180px;
          min-width: 180px;
          padding: 12px;
          border-radius: 16px;
          background: linear-gradient(135deg, #ffffff 0%, #fffaf3 100%);
          border: 2px solid #e5d4c1;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        #today-radar-wrap .radar-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        }

        #today-radar-wrap .radar-card canvas {
          width: 130px !important;
          height: 130px !important;
          display: block;
          margin: 0 auto;
        }

        #today-radar-wrap .radar-card-header {
          margin-bottom: 8px;
          text-align: center;
        }

        #today-radar-wrap .radar-card-title {
          font-size: 12px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 4px;
          line-height: 1.3;
        }

        #today-radar-wrap .radar-card-time {
          font-size: 10px;
          color: #95a5a6;
          margin-bottom: 4px;
        }

        #today-radar-wrap .score-badge,
        .today-radar-grid .score-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 10px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        #today-radar-wrap .score-badge.badge-excellent,
        .today-radar-grid .score-badge.badge-excellent {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        #today-radar-wrap .score-badge.badge-good,
        .today-radar-grid .score-badge.badge-good {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: white;
        }

        #today-radar-wrap .score-badge.badge-normal,
        .today-radar-grid .score-badge.badge-normal {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        }

        #today-radar-wrap .score-badge.badge-encourage,
        .today-radar-grid .score-badge.badge-encourage {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
          color: white;
        }

        #today-radar-wrap .radar-card-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #f0f0f0;
          font-size: 10px;
        }

        #today-radar-wrap .stat-item {
          text-align: center;
        }

        #today-radar-wrap .stat-label {
          color: #95a5a6;
          font-size: 9px;
        }

        #today-radar-wrap .stat-value {
          font-weight: 700;
          font-size: 12px;
          color: #667eea;
        }

        .today-empty-cards {
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          color: rgba(255,255,255,0.8);
          font-size: 14px;
        }

        /* 전체 보기 토글 버튼 */
        .today-radar-toggle-wrap {
          text-align: center;
          margin-top: 15px;
        }

        .today-radar-toggle-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.4);
          color: white;
          padding: 8px 24px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .today-radar-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.6);
          transform: translateY(-2px);
        }

        #todayRadarToggleIcon {
          display: inline-block;
          transition: transform 0.3s ease;
        }

        .today-radar-toggle-btn.expanded #todayRadarToggleIcon {
          transform: rotate(180deg);
        }

        /* 전체 보기 그리드 */
        .today-radar-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
          margin-top: 20px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
        }

        .today-radar-grid .radar-card {
          flex: 0 0 180px;
          min-width: 180px;
          padding: 12px;
          border-radius: 16px;
          background: linear-gradient(135deg, #ffffff 0%, #fffaf3 100%);
          border: 2px solid #e5d4c1;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .today-radar-grid .radar-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        }

        .today-radar-grid .radar-card canvas {
          width: 130px !important;
          height: 130px !important;
          display: block;
          margin: 0 auto;
        }

        .today-radar-grid .radar-card-header {
          margin-bottom: 8px;
          text-align: center;
        }

        .today-radar-grid .radar-card-title {
          font-size: 12px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .today-radar-grid .radar-card-time {
          font-size: 10px;
          color: #95a5a6;
          margin-bottom: 4px;
        }

        .today-radar-grid .radar-card-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #f0f0f0;
          font-size: 10px;
        }

        .today-radar-grid .stat-item {
          text-align: center;
        }

        .today-radar-grid .stat-label {
          color: #95a5a6;
          font-size: 9px;
        }

        .today-radar-grid .stat-value {
          font-weight: 700;
          font-size: 12px;
          color: #667eea;
        }

        /* 지수별 추이 꺾은선 그래프 스타일 */
        .index-trend-chart-container {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          margin-top: 15px;
          border: none;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .index-trend-chart-container canvas {
          width: 100% !important;
          height: 300px !important;
        }

        .index-trend-legend {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
          margin-bottom: 15px;
          padding: 10px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
        }

        .index-trend-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #333;
          background: rgba(255,255,255,0.9);
          padding: 4px 10px;
          border-radius: 12px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .index-trend-legend-item:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .index-trend-legend-item.active {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          font-weight: 700;
        }

        .index-trend-legend-item.dimmed {
          opacity: 0.4;
          transform: scale(0.95);
        }

        .index-trend-legend-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }

        .index-trend-legend-label {
          font-weight: 500;
        }

        .index-trend-no-data {
          text-align: center;
          color: rgba(255,255,255,0.7);
          padding: 40px 20px;
          font-size: 14px;
        }

        /* 과목별 막대 그래프 스타일 */
        .subject-bar-legend {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 10px;
          padding: 10px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
        }

        .subject-bar-legend-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: #333;
          background: rgba(255,255,255,0.9);
          padding: 3px 8px;
          border-radius: 10px;
        }

        .subject-bar-legend-color {
          width: 10px;
          height: 10px;
          border-radius: 2px;
        }

        .subject-bar-chart-container {
          background: rgba(255,255,255,0.95);
          border-radius: 12px;
          padding: 15px;
        }

        .nav-arrow-btn:hover {
          background: rgba(255,255,255,0.25) !important;
          transform: scale(1.1);
        }

        .nav-arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      </style>
    </head>
    <body>
      <!-- 🔄 로딩 오버레이 -->
      <div id="loading-overlay">
        <div class="spinner-container">
          <div class="spinner"></div>
          <div class="loading-text">AI 인식 중...</div>
        </div>
      </div>

      <div class="container">
        <!-- 시리즈 선택 드롭다운 -->
        <div class="series-selector">
          <div class="series-dropdown">
            <button class="series-button" id="seriesButton">
              <span id="currentSeries">전체 시리즈</span>
              <span class="arrow">▼</span>
            </button>
            <div class="series-menu" id="seriesMenu">
              <div class="series-item active" data-series="all">전체 시리즈</div>
              <div class="series-item" data-series="BRAIN온">BRAIN온</div>
              <div class="series-item" data-series="BRAIN업">BRAIN업</div>
              <div class="series-item" data-series="BRAIN핏">BRAIN핏</div>
              <div class="series-item" data-series="BRAIN딥">BRAIN딥</div>
              <div class="series-item" data-series="BRAIN중등">BRAIN실전</div>
            </div>
          </div>
        </div>

        <div class="header">
          <h1>나의 AI 학습 분석</h1>
          <div class="subtitle">${grade} ${name} 학생</div>
        </div>

        <div style="text-align: center;">
          <span class="stats-badge" id="logCountBadge" style="font-size: 20px; padding: 16px 36px;">📚 총 ${logs.length}건의 학습 기록</span>
          <div style="margin-top: 5px; display: flex; justify-content: center; gap: 20px;">
            <span class="stats-badge" style="background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%); color: white;" id="normalLearningCount">📖 일반학습 0건</span>
            <span class="stats-badge" style="background: linear-gradient(135deg, #a855f7 0%, #6b21a8 100%); color: white;" id="aiLearningCount">🤖 AI추천학습 0건</span>
          </div>
        </div>

        <!-- ✨ Today 나의 AI 학습 기록 섹션 -->
        <div class="today-section">
          <div class="section-title"><span id="calendarIcon" onclick="openCalendarPopup()" style="cursor:pointer;">📅</span> Today 나의 AI 학습 기록</div>
          <p class="section-description" id="todayDescription">오늘 완료한 학습 기록입니다.</p>

          <!-- 달력 팝업 -->
          <div id="calendarPopup" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:10000; justify-content:center; align-items:center;">
            <div style="background:#fff; border-radius:16px; padding:24px; max-width:380px; width:90%; box-shadow:0 8px 32px rgba(0,0,0,0.3);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <button onclick="changeCalendarMonth(-1)" style="background:#667eea; color:#fff; border:none; padding:8px 12px; border-radius:8px; cursor:pointer; font-size:16px;">❮</button>
                <span id="calendarMonthDisplay" style="font-size:18px; font-weight:700; color:#333;"></span>
                <button onclick="changeCalendarMonth(1)" style="background:#667eea; color:#fff; border:none; padding:8px 12px; border-radius:8px; cursor:pointer; font-size:16px;">❯</button>
              </div>
              <div id="calendarGrid" style="display:grid; grid-template-columns:repeat(7,1fr); gap:4px; text-align:center;"></div>
              <button onclick="closeCalendarPopup()" style="margin-top:16px; width:100%; background:#667eea; color:#fff; border:none; padding:12px; border-radius:8px; cursor:pointer; font-size:16px; font-weight:600;">닫기</button>
            </div>
          </div>

          <!-- 날짜 네비게이션 -->
          <div class="date-navigator" style="display:flex; justify-content:center; align-items:center; gap:16px; margin-bottom:16px;">
            <button id="datePrevBtn" onclick="changeDate(-1)" style="background:rgba(255,255,255,0.2); border:none; color:#fff; font-size:20px; padding:8px 16px; border-radius:8px; cursor:pointer; transition:all 0.2s;">❮</button>
            <span id="currentDateDisplay" style="color:#fff; font-size:18px; font-weight:600; min-width:140px; text-align:center;"></span>
            <button id="dateNextBtn" onclick="changeDate(1)" style="background:rgba(255,255,255,0.2); border:none; color:#fff; font-size:20px; padding:8px 16px; border-radius:8px; cursor:pointer; transition:all 0.2s;">❯</button>
          </div>

          <div id="todayTableContainer">
            <!-- JavaScript에서 동적 렌더링 -->
          </div>

          <!-- 오늘 완료한 단원별 미니 레이더 카드 -->
          <div class="today-radar-section">
            <div class="today-radar-title">📊 오늘 완료한 단원별 문해력 AI 레이더</div>
            <div class="today-radar-slider" id="todayRadarSlider">
              <button class="slider-arrow slider-prev" id="todayRadarPrev" onclick="slideTodayRadar(-1)">❮</button>
              <div class="today-radar-viewport">
                <div id="today-radar-wrap">
                  <!-- JavaScript에서 동적 렌더링 -->
                </div>
              </div>
              <button class="slider-arrow slider-next" id="todayRadarNext" onclick="slideTodayRadar(1)">❯</button>
            </div>
            <!-- 전체 보기 토글 -->
            <div class="today-radar-toggle-wrap" id="todayRadarToggleWrap">
              <button class="today-radar-toggle-btn" id="todayRadarToggle" onclick="toggleTodayRadarView()">
                <span id="todayRadarToggleText">전체 보기</span> <span id="todayRadarToggleIcon">▼</span>
              </button>
            </div>
            <!-- 전체 보기 그리드 -->
            <div class="today-radar-grid" id="todayRadarGrid" style="display: none;">
              <!-- JavaScript에서 동적 렌더링 -->
            </div>

          </div>

          <!-- 지수별 추이 꺾은선 그래프 섹션 (보라색 배경 내부) -->
          <div class="index-trend-section" id="indexTrendSection" style="margin-top: 20px; display: none;">
            <div class="today-radar-title">📈 날짜별 문해력 성장 지수 변화</div>
            <p class="section-description" style="color: rgba(255,255,255,0.8); margin-bottom: 10px; text-align: left;">
              일별 학습에서 측정된 5가지 문해력 지수의 평균 추이를 확인하세요.
            </p>
            <div class="index-trend-legend" id="indexTrendLegend">
              <!-- JavaScript에서 동적 렌더링 - 상단 범례 -->
            </div>
            <div class="index-trend-nav" style="display: flex; align-items: center; justify-content: center; gap: 15px; margin: 15px 0;">
              <button id="indexTrendPrev" class="nav-arrow-btn" style="background: rgba(255,255,255,0.15); border: none; border-radius: 50%; width: 36px; height: 36px; color: #fff; font-size: 18px; cursor: pointer; transition: all 0.2s;">◀</button>
              <span id="indexTrendDateRange" style="color: #fff; font-size: 14px; font-weight: 500;"></span>
              <button id="indexTrendNext" class="nav-arrow-btn" style="background: rgba(255,255,255,0.15); border: none; border-radius: 50%; width: 36px; height: 36px; color: #fff; font-size: 18px; cursor: pointer; transition: all 0.2s;">▶</button>
            </div>
            <div class="index-trend-chart-container">
              <canvas id="indexTrendChart"></canvas>
            </div>
          </div>

          <!-- 날짜별 과목 평균 평점 막대 그래프 섹션 -->
          <div class="subject-bar-section" id="subjectBarSection" style="margin-top: 30px; display: none;">
            <div class="today-radar-title">📊 날짜별 과목 평균 평점</div>
            <p class="section-description" style="color: rgba(255,255,255,0.8); margin-bottom: 10px; text-align: left;">
              날짜별로 완료한 각 과목의 평균 평점을 확인하세요.
            </p>
            <div class="subject-bar-legend" id="subjectBarLegend">
              <!-- JavaScript에서 동적 렌더링 - 과목별 색상 범례 -->
            </div>
            <div class="subject-bar-nav" style="display: flex; align-items: center; justify-content: center; gap: 15px; margin: 15px 0;">
              <button id="subjectBarPrev" class="nav-arrow-btn" style="background: rgba(255,255,255,0.15); border: none; border-radius: 50%; width: 36px; height: 36px; color: #fff; font-size: 18px; cursor: pointer; transition: all 0.2s;">◀</button>
              <span id="subjectBarDateRange" style="color: #fff; font-size: 14px; font-weight: 500;"></span>
              <button id="subjectBarNext" class="nav-arrow-btn" style="background: rgba(255,255,255,0.15); border: none; border-radius: 50%; width: 36px; height: 36px; color: #fff; font-size: 18px; cursor: pointer; transition: all 0.2s;">▶</button>
            </div>
            <div class="subject-bar-chart-container" style="height: 300px; position: relative;">
              <canvas id="subjectBarChart"></canvas>
            </div>
          </div>

          <!-- 날짜별 어휘 점수 가로 막대 그래프 섹션 -->
          <div class="vocab-score-section" id="vocabScoreSection" style="margin-top: 30px; display: none;">
            <div class="today-radar-title">📝 날짜별 어휘 점수</div>
            <p class="section-description" style="color: rgba(255,255,255,0.8); margin-bottom: 10px; text-align: left;">
              각 단원별 어휘 퀴즈 점수를 평균과 비교해 보세요.
            </p>
            <div class="vocab-score-nav" style="display: flex; align-items: center; justify-content: center; gap: 15px; margin: 15px 0;">
              <button id="vocabScorePrev" class="nav-arrow-btn" style="background: rgba(255,255,255,0.15); border: none; border-radius: 50%; width: 36px; height: 36px; color: #fff; font-size: 18px; cursor: pointer; transition: all 0.2s;">◀</button>
              <span id="vocabScoreDate" style="color: #fff; font-size: 14px; font-weight: 500;"></span>
              <button id="vocabScoreNext" class="nav-arrow-btn" style="background: rgba(255,255,255,0.15); border: none; border-radius: 50%; width: 36px; height: 36px; color: #fff; font-size: 18px; cursor: pointer; transition: all 0.2s;">▶</button>
            </div>
            <div class="vocab-score-chart-container" id="vocabScoreChartContainer" style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 15px;">
              <!-- JavaScript에서 동적 렌더링 -->
            </div>
          </div>

          <!-- 창의활동 내역 섹션 -->
          <div class="record-section creative-section" style="margin-top: 25px;">
            <div class="record-section-header" style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
              <span style="font-size: 20px;">✍️</span>
              <span class="section-title" style="color: #fff; font-size: 16px; font-weight: 600;">창의활동 내역</span>
            </div>
            <p class="section-desc" style="color: rgba(255,255,255,0.7); font-size: 13px; margin-bottom: 15px;">제출된 창의활동 글쓰기 내역을 확인하세요.</p>

            <!-- 날짜 네비게이션 -->
            <div class="creative-nav" style="display: flex; align-items: center; justify-content: center; gap: 20px; margin: 20px 0;">
              <button id="creativePrev" class="creative-nav-btn">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 10L4 6L8 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <span id="creativeDate" class="creative-date-display"></span>
              <button id="creativeNext" class="creative-nav-btn">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>

            <!-- 창의활동 테이블 -->
            <div id="creativeTableContainer" class="creative-table-container">
              <table class="creative-table">
                <thead>
                  <tr>
                    <th style="width: 60px;">번호</th>
                    <th style="width: 110px;">단원명</th>
                    <th>주제</th>
                    <th style="width: 80px;">글자수</th>
                  </tr>
                </thead>
                <tbody id="creativeTableBody">
                  <!-- JavaScript에서 동적 렌더링 -->
                </tbody>
              </table>
            </div>
          </div>

          <style>
            /* 창의활동 테이블 세련된 디자인 */
            .creative-section .creative-nav-btn {
              background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%);
              border: 1px solid rgba(255,255,255,0.2);
              border-radius: 50%;
              width: 38px;
              height: 38px;
              color: #fff;
              cursor: pointer;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              backdrop-filter: blur(10px);
            }
            .creative-section .creative-nav-btn:hover {
              background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%);
              transform: scale(1.1);
              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }
            .creative-section .creative-date-display {
              color: #fff;
              font-size: 15px;
              font-weight: 600;
              background: linear-gradient(135deg, rgba(102,126,234,0.3) 0%, rgba(118,75,162,0.3) 100%);
              padding: 10px 24px;
              border-radius: 25px;
              border: 1px solid rgba(255,255,255,0.15);
              backdrop-filter: blur(10px);
              letter-spacing: 0.5px;
            }
            .creative-table-container {
              background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%);
              border-radius: 16px;
              padding: 0;
              overflow: hidden;
              border: 1px solid rgba(0,0,0,0.08);
              box-shadow: 0 8px 32px rgba(0,0,0,0.1);
              margin: 0 20px;
            }
            .creative-table {
              width: 100%;
              border-collapse: collapse;
              color: #333;
              font-size: 14px;
              table-layout: fixed;
            }
            .creative-table thead tr {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .creative-table thead th {
              padding: 16px 12px;
              text-align: center;
              font-weight: 600;
              font-size: 13px;
              color: #fff;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: none;
            }
            .creative-table tbody tr.creative-row {
              transition: all 0.25s ease;
              cursor: pointer;
              border-bottom: 1px solid rgba(0,0,0,0.06);
            }
            .creative-table tbody tr.creative-row:hover {
              background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%);
            }
            .creative-table tbody tr.creative-row:last-child {
              border-bottom: none;
            }
            .creative-table tbody td {
              padding: 14px 12px;
              color: #333;
            }
            .creative-table .creative-num {
              text-align: center;
              font-weight: 500;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
            }
            .creative-table .creative-arrow {
              font-size: 10px;
              color: #667eea;
              transition: all 0.3s ease;
            }
            .creative-table .creative-unit {
              text-align: center;
              font-weight: 500;
              color: #444;
            }
            .creative-table .creative-topic {
              text-align: left;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              padding-left: 16px;
            }
            .creative-table .creative-chars {
              text-align: center;
              font-weight: 600;
              background: linear-gradient(135deg, rgba(102,126,234,0.2) 0%, rgba(118,75,162,0.2) 100%);
              border-radius: 20px;
              padding: 4px 0;
              margin: 0 8px;
              font-size: 13px;
            }
            /* 드롭다운 내용 행 */
            .creative-table .creative-content-row {
              background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%);
            }
            .creative-table .creative-content-row td {
              padding: 0;
            }
            .creative-content-box {
              padding: 20px 24px;
              margin: 12px 16px;
              background: #fff;
              border-radius: 12px;
              border-left: 4px solid linear-gradient(180deg, #667eea 0%, #764ba2 100%);
              border-left: 4px solid #667eea;
              box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            }
            .creative-content-label {
              font-size: 12px;
              color: #667eea;
              font-weight: 600;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .creative-content-text {
              font-size: 14px;
              line-height: 1.9;
              color: #333;
              white-space: pre-wrap;
              word-break: break-word;
              text-align: left;
            }
            /* 데이터 없음 메시지 */
            .creative-table .creative-empty {
              text-align: center;
              padding: 40px 20px;
              color: #888;
              font-size: 14px;
            }
          </style>

          <!-- 통합 AI 피드백 영역: 하단에 4개 섹션 모두 표시 -->
          <div id="aiFeedbackSection" class="ai-feedback-section" style="margin-top: 25px; display: none;">
            <div class="ai-feedback-section-header">
              <span class="ai-feedback-icon">🌟</span>
              <span class="ai-feedback-section-title">오늘의 학습 분석</span>
            </div>
            <div class="ai-feedback-loading-box" id="aiFeedbackLoading">
              <div class="ai-feedback-loading">AI 선생님이 학습 데이터를 분석하고 있어요...</div>
            </div>
            <div id="aiFeedbackContent" class="ai-feedback-all-content" style="display: none;">
              <!-- 섹션 1: 오늘 학습 요약 -->
              <div class="ai-feedback-item">
                <div class="ai-feedback-item-title">📚 오늘의 학습 기록</div>
                <div id="feedbackContent1" class="ai-feedback-item-content"></div>
              </div>
              <!-- 섹션 2: 레이더 차트 -->
              <div class="ai-feedback-item">
                <div class="ai-feedback-item-title">📊 문해력 AI 레이더 분석</div>
                <div id="feedbackContent2" class="ai-feedback-item-content"></div>
              </div>
              <!-- 섹션 3: 성장 지수 -->
              <div class="ai-feedback-item">
                <div class="ai-feedback-item-title">📈 성장 지수 변화</div>
                <div id="feedbackContent3" class="ai-feedback-item-content"></div>
              </div>
              <!-- 섹션 4: 과목별 점수 -->
              <div class="ai-feedback-item">
                <div class="ai-feedback-item-title">🎯 과목별 점수 분석</div>
                <div id="feedbackContent4" class="ai-feedback-item-content"></div>
              </div>
              <!-- 섹션 5: 어휘 점수 피드백 -->
              <div class="ai-feedback-item">
                <div class="ai-feedback-item-title">📝 어휘 점수 분석</div>
                <div id="feedbackContent5" class="ai-feedback-item-content"></div>
              </div>
              <!-- 하단 통합 수정/저장 버튼 -->
              <div class="ai-feedback-bottom-actions" id="feedbackBottomActions">
                <button class="ai-feedback-edit-all-btn" id="editAllBtn" onclick="editAllFeedback()">수정</button>
                <div class="ai-feedback-save-actions" id="saveActions" style="display: none;">
                  <button class="ai-feedback-cancel-all-btn" onclick="cancelAllFeedback()">취소</button>
                  <button class="ai-feedback-save-all-btn" onclick="saveAllFeedback()">저장</button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- 세부 AI 상세 학습 내역 보기 버튼 (보라색 배경 밖) -->
        <div style="text-align: center; margin-top: 30px; padding-bottom: 20px;">
          <button id="toggleDetailedLogBtn" onclick="toggleDetailedLog()" style="
            background: linear-gradient(135deg, #6B4FA0 0%, #8B6FC0 100%);
            color: #fff;
            border: none;
            border-radius: 25px;
            padding: 14px 32px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(107,79,160,0.3);
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          ">
            <span id="toggleDetailedLogIcon">▼</span>
            <span id="toggleDetailedLogText">세부 AI 상세 학습 내역 보기</span>
          </button>
        </div>

        <!-- 세부 학습 내역 섹션 (기본 숨김) -->
        <div id="detailedLogSection" style="display: none;">

        <div class="section-header">
          <div class="section-title" style="margin: 0;">
            📝 종합 학습 기록 목록
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="logSearch" placeholder="단원명 또는 등급 검색..." oninput="searchLogs(this.value)">
              <button class="clear-btn" id="logSearchClear" onclick="clearLogSearch()">✕</button>
            </div>
          </div>
        </div>
        <p class="section-description">
          모든 학습 활동이 시간 순서대로 기록되어 있습니다.
        </p>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>과목</th>
                <th style="cursor: pointer;" onclick="sortByAIAssignDate()" id="aiDateHeader">
                  날짜/시간<br/><small style="font-weight: normal; color: rgba(255,255,255,0.8);">(AI과제부여)</small>
                  <span id="aiSortIcon" style="margin-left: 4px;">⇅</span>
                </th>
                <th style="cursor: pointer;" onclick="sortByFinalDate()" id="finalDateHeader">
                  날짜/시간<br/><small style="font-weight: normal; color: rgba(255,255,255,0.8);">(최종)</small>
                  <span id="finalSortIcon" style="margin-left: 4px;">⇅</span>
                </th>
                <th style="cursor: pointer;" onclick="sortByGrade()" id="gradeHeader">
                  등급
                  <span id="gradeSortIcon" style="margin-left: 4px;">⇅</span>
                </th>
                <th>시리즈</th>
                <th>단원명</th>
              </tr>
            </thead>
            <tbody id="logTableBody">
            </tbody>
          </table>
        </div>
        <button class="toggle-btn" id="toggleBtn" onclick="toggleRows()" style="display:none;">더보기 ▼</button>

        <hr>

        <div class="section-title">
          📊 진도율
        </div>
        <p class="section-description">
          시리즈 전체 진도율과 분야별/과목별 진도율을 확인할 수 있습니다.
        </p>

        <div class="progress-section">
          <!-- Total Series Progress -->
          <div class="total-progress-card">
            <div class="total-progress-title" style="color: white !important; font-size: 32px !important;">🎯 전체 시리즈 진도율</div>
            <div class="total-progress-bar-container">
              <div class="total-progress-bar" id="totalProgressBar" style="width: 0%;">
                <span id="totalProgressPercent">0%</span>
              </div>
            </div>
            <div class="total-progress-text" id="totalProgressText">
              <span id="totalProgressTextCount">0 / 400</span>
              <span style="margin-left: 12px; font-weight: 900;" id="totalProgressTextPercent">(0%)</span>
            </div>
          </div>

          <!-- Field Progress Grid -->
          <div class="field-progress-grid">
            <!-- Science Field -->
            <div class="field-progress-card science">
              <div class="field-title">
                <div class="field-title-text">🔬 과학분야</div>
                <div class="field-percent science" id="scienceFieldPercent">0%</div>
              </div>
              <div class="field-progress-bar-container">
                <div class="field-progress-bar science" id="scienceFieldBar" style="width: 0%;"></div>
              </div>
              <div class="field-progress-text" id="scienceFieldText">0 / 80</div>
              <div class="subject-list">
                <div class="subject-item">
                  <div class="subject-title">
                    <span>생물</span>
                    <span id="bioPercent">0%</span>
                  </div>
                  <div class="subject-progress-bar-container">
                    <div class="subject-progress-bar science" id="bioBar" style="width: 0%;"></div>
                  </div>
                </div>
                <div class="subject-item">
                  <div class="subject-title">
                    <span>지구과학</span>
                    <span id="earthPercent">0%</span>
                  </div>
                  <div class="subject-progress-bar-container">
                    <div class="subject-progress-bar science" id="earthBar" style="width: 0%;"></div>
                  </div>
                </div>
                <div class="subject-item">
                  <div class="subject-title">
                    <span>물리</span>
                    <span id="physicsPercent">0%</span>
                  </div>
                  <div class="subject-progress-bar-container">
                    <div class="subject-progress-bar science" id="physicsBar" style="width: 0%;"></div>
                  </div>
                </div>
                <div class="subject-item">
                  <div class="subject-title">
                    <span>화학</span>
                    <span id="chemPercent">0%</span>
                  </div>
                  <div class="subject-progress-bar-container">
                    <div class="subject-progress-bar science" id="chemBar" style="width: 0%;"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Society Field -->
            <div class="field-progress-card society">
              <div class="field-title">
                <div class="field-title-text">🌍 사회분야</div>
                <div class="field-percent society" id="societyFieldPercent">0%</div>
              </div>
              <div class="field-progress-bar-container">
                <div class="field-progress-bar society" id="societyFieldBar" style="width: 0%;"></div>
              </div>
              <div class="field-progress-text" id="societyFieldText">0 / 80</div>
              <div class="subject-list">
                <div class="subject-item">
                  <div class="subject-title">
                    <span>사회문화</span>
                    <span id="socPercent">0%</span>
                  </div>
                  <div class="subject-progress-bar-container">
                    <div class="subject-progress-bar society" id="socBar" style="width: 0%;"></div>
                  </div>
                </div>
                <div class="subject-item">
                  <div class="subject-title">
                    <span>지리</span>
                    <span id="geoPercent">0%</span>
                  </div>
                  <div class="subject-progress-bar-container">
                    <div class="subject-progress-bar society" id="geoBar" style="width: 0%;"></div>
                  </div>
                </div>
                <div class="subject-item">
                  <div class="subject-title">
                    <span>법</span>
                    <span id="lawPercent">0%</span>
                  </div>
                  <div class="subject-progress-bar-container">
                    <div class="subject-progress-bar society" id="lawBar" style="width: 0%;"></div>
                  </div>
                </div>
                <div class="subject-item">
                  <div class="subject-title">
                    <span>정치경제</span>
                    <span id="polPercent">0%</span>
                  </div>
                  <div class="subject-progress-bar-container">
                    <div class="subject-progress-bar society" id="polBar" style="width: 0%;"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Korean Literature Field -->
            <div class="field-progress-card korean-lit">
              <div class="field-title">
                <div class="field-title-text">📚 한국문학</div>
                <div class="field-percent korean-lit" id="koreanLitFieldPercent">0%</div>
              </div>
              <div class="field-progress-bar-container">
                <div class="field-progress-bar korean-lit" id="koreanLitFieldBar" style="width: 0%;"></div>
              </div>
              <div class="field-progress-text" id="koreanLitFieldText">0 / 80</div>
              <div class="subject-list">
                <div class="subject-item">
                  <div class="subject-title">
                    <span>현대문학</span>
                    <span id="modernPercent">0%</span>
                  </div>
                  <div class="subject-progress-bar-container">
                    <div class="subject-progress-bar korean-lit" id="modernBar" style="width: 0%;"></div>
                  </div>
                </div>
                <div class="subject-item">
                  <div class="subject-title">
                    <span>고전문학</span>
                    <span id="classicPercent">0%</span>
                  </div>
                  <div class="subject-progress-bar-container">
                    <div class="subject-progress-bar korean-lit" id="classicBar" style="width: 0%;"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- World Literature Field -->
            <div class="field-progress-card world-lit">
              <div class="field-title">
                <div class="field-title-text">🌏 세계문학</div>
                <div class="field-percent world-lit" id="worldLitFieldPercent">0%</div>
              </div>
              <div class="field-progress-bar-container">
                <div class="field-progress-bar world-lit" id="worldLitFieldBar" style="width: 0%;"></div>
              </div>
              <div class="field-progress-text" id="worldLitFieldText">0 / 80</div>
              <div class="subject-list">
                <div class="subject-item">
                  <div class="subject-title">
                    <span>세계문학(1)</span>
                    <span id="world1Percent">0%</span>
                  </div>
                  <div class="subject-progress-bar-container">
                    <div class="subject-progress-bar world-lit" id="world1Bar" style="width: 0%;"></div>
                  </div>
                </div>
                <div class="subject-item">
                  <div class="subject-title">
                    <span>세계문학(2)</span>
                    <span id="world2Percent">0%</span>
                  </div>
                  <div class="subject-progress-bar-container">
                    <div class="subject-progress-bar world-lit" id="world2Bar" style="width: 0%;"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Person Field -->
            <div class="field-progress-card person">
              <div class="field-title">
                <div class="field-title-text">👤 인물분야</div>
                <div class="field-percent person" id="personFieldPercent">0%</div>
              </div>
              <div class="field-progress-bar-container">
                <div class="field-progress-bar person" id="personFieldBar" style="width: 0%;"></div>
              </div>
              <div class="field-progress-text" id="personFieldText">0 / 80</div>
              <div class="subject-list">
                <div class="subject-item">
                  <div class="subject-title">
                    <span>한국인물</span>
                    <span id="person1Percent">0%</span>
                  </div>
                  <div class="subject-progress-bar-container">
                    <div class="subject-progress-bar person" id="person1Bar" style="width: 0%;"></div>
                  </div>
                </div>
                <div class="subject-item">
                  <div class="subject-title">
                    <span>세계인물</span>
                    <span id="person2Percent">0%</span>
                  </div>
                  <div class="subject-progress-bar-container">
                    <div class="subject-progress-bar person" id="person2Bar" style="width: 0%;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr>

        <div class="section-title">
          🏆 시리즈 종합 레이더
        </div>
        <p class="section-description">
          전체 시리즈의 모든 학습 데이터를 통합한 최종 레이더입니다.<br/>
          (※ radar 데이터가 있는 기록들만 평균에 포함됩니다.)
        </p>

        <div id="series-radar-wrap"></div>

        <hr>

        <div class="section-title">
          📚 분야별 종합 레이더
        </div>
        <p class="section-description">
          분야별로 모든 학습 데이터의 평균을 보여줍니다.<br/>
          (※ radar 데이터가 있는 기록들만 평균에 포함됩니다.)
        </p>

        <div id="field-radar-wrap"></div>

        <hr>

        <div class="section-header">
          <div class="section-title" style="margin: 0;">
            📊 과목별 종합 레이더
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <div class="grade-filter">
              <span class="filter-icon">🏷️</span>
              <select id="subjectGradeFilter" onchange="filterSubjectRadarByGrade(this.value)">
                <option value="all">전체 등급</option>
                <option value="격려">격려</option>
                <option value="보통">보통</option>
                <option value="양호">양호</option>
                <option value="우수">우수</option>
              </select>
            </div>
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="subjectSearch" placeholder="과목명 검색..." oninput="searchSubjectRadar(this.value)">
              <button class="clear-btn" id="subjectSearchClear" onclick="clearSubjectSearch()">✕</button>
            </div>
          </div>
        </div>
        <p class="section-description">
          과목별로 모든 학습 데이터의 평균을 보여줍니다.<br/>
          (※ radar 데이터가 있는 기록들만 평균에 포함됩니다.)
        </p>

        <div id="summary-radar-wrap"></div>
        <button class="toggle-btn" id="toggleSummaryBtn" onclick="toggleSummaryRadar()" style="display:none;">더보기 ▼</button>

        <hr>

        <div class="section-header">
          <div class="section-title" style="margin: 0;">
            🧠 단원별 문해력 레이더 차트
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <div class="grade-filter">
              <span class="filter-icon">🏷️</span>
              <select id="unitGradeFilter" onchange="filterUnitRadarByGrade(this.value)">
                <option value="all">전체 등급</option>
                <option value="격려">격려</option>
                <option value="보통">보통</option>
                <option value="양호">양호</option>
                <option value="우수">우수</option>
              </select>
            </div>
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="unitSearch" placeholder="단원명 검색..." oninput="searchUnitRadar(this.value)">
              <button class="clear-btn" id="unitSearchClear" onclick="clearUnitSearch()">✕</button>
            </div>
          </div>
        </div>
        <p class="section-description">
          가장 최근 기록이 위에 오도록 정렬되어 있어요.<br/>
          (※ 아직 radar 데이터가 없는 기록은 그래프가 표시되지 않습니다.)
        </p>

        <div id="radar-wrap"></div>
        <button class="toggle-btn" id="toggleRadarBtn" onclick="toggleRadar()" style="display:none;">더보기 ▼</button>
      </div>
      </div><!-- detailedLogSection 닫기 -->

      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>
      <script>
        // datalabels 플러그인 등록
        Chart.register(ChartDataLabels);

        // ===== 통합 AI 피드백 로딩 함수 =====
        async function loadSingleFeedback(section, contentId, data) {
          const content = document.getElementById(contentId);
          if (!content) return;

          try {
            const grade = '${grade}';
            const name = '${name}';

            const response = await fetch('/api/ai-learning-feedback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ grade, name, section, data })
            });

            const result = await response.json();
            if (result.ok && result.feedback) {
              content.innerHTML = result.feedback;
            } else {
              content.innerHTML = '피드백을 불러올 수 없습니다.';
            }
          } catch (err) {
            console.error('AI 피드백 오류:', err);
            content.innerHTML = '피드백 생성 중 오류가 발생했습니다.';
          }
        }

        // ===== AI 피드백 전체 수정 기능 =====
        let originalFeedbackContent = {};

        function editAllFeedback() {
          const editAllBtn = document.getElementById('editAllBtn');
          const saveActions = document.getElementById('saveActions');

          // 5개 섹션 모두 textarea로 변환
          for (let num = 1; num <= 5; num++) {
            const contentDiv = document.getElementById('feedbackContent' + num);
            if (!contentDiv) continue;

            // 원본 내용 저장
            originalFeedbackContent[num] = contentDiv.innerHTML;

            // textarea로 변환
            const currentText = contentDiv.innerText;
            contentDiv.innerHTML = '<textarea class="ai-feedback-textarea" id="feedbackTextarea' + num + '">' + currentText + '</textarea>';
          }

          // 전체 수정 버튼 숨기고 저장/취소 버튼 표시
          editAllBtn.style.display = 'none';
          saveActions.style.display = 'flex';
        }

        function saveAllFeedback() {
          const editAllBtn = document.getElementById('editAllBtn');
          const saveActions = document.getElementById('saveActions');

          // 5개 섹션 모두 저장
          for (let num = 1; num <= 5; num++) {
            const textarea = document.getElementById('feedbackTextarea' + num);
            const contentDiv = document.getElementById('feedbackContent' + num);
            if (!textarea || !contentDiv) continue;

            // 수정된 내용 적용
            const newText = textarea.value;
            contentDiv.innerHTML = newText;
          }

          // 저장/취소 버튼 숨기고 전체 수정 버튼 표시
          saveActions.style.display = 'none';
          editAllBtn.style.display = 'inline-block';
        }

        function cancelAllFeedback() {
          const editAllBtn = document.getElementById('editAllBtn');
          const saveActions = document.getElementById('saveActions');

          // 5개 섹션 모두 원본 복원
          for (let num = 1; num <= 5; num++) {
            const contentDiv = document.getElementById('feedbackContent' + num);
            if (!contentDiv || !originalFeedbackContent[num]) continue;

            // 원본 내용 복원
            contentDiv.innerHTML = originalFeedbackContent[num];
          }

          // 저장/취소 버튼 숨기고 전체 수정 버튼 표시
          saveActions.style.display = 'none';
          editAllBtn.style.display = 'inline-block';
        }

        // 통합 AI 피드백 초기화 함수 (페이지 로드 시 호출)
        async function initAIFeedbacks() {
          // 데이터 렌더링 완료 대기 (3초)
          setTimeout(async () => {
            const feedbackSection = document.getElementById('aiFeedbackSection');
            const loadingBox = document.getElementById('aiFeedbackLoading');
            const contentBox = document.getElementById('aiFeedbackContent');

            if (!feedbackSection) return;

            // 피드백 섹션 표시
            feedbackSection.style.display = 'block';

            // ===== 1. 오늘 학습 기록 데이터 상세 수집 =====
            const tableContainer = document.getElementById('todayTableContainer');
            const hasTableData = tableContainer && tableContainer.innerHTML.trim() !== '' && !tableContainer.innerHTML.includes('오늘 완료한 학습 기록이 없습니다');

            const rows = document.querySelectorAll('#todayTableContainer tbody tr');
            const todayData = { completedCount: rows.length, units: [], grades: [], scores: [], fields: [] };

            if (hasTableData && rows.length > 0) {
              rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 7) {
                  const series = cells[1]?.textContent?.trim() || '';
                  const field = cells[2]?.textContent?.trim() || '';
                  const unitName = cells[3]?.textContent?.trim() || '';
                  const grade = cells[4]?.textContent?.trim() || '';
                  const avgScore = cells[5]?.textContent?.trim() || '';
                  const vocabScore = cells[6]?.textContent?.trim() || '';

                  todayData.units.push(unitName);
                  todayData.grades.push(grade);
                  todayData.scores.push(avgScore);
                  todayData.fields.push(field);
                }
              });
              // 요약 정보 추가
              todayData.unitList = todayData.units.slice(0, 5).join(', ') + (todayData.units.length > 5 ? ' 외 ' + (todayData.units.length - 5) + '개' : '');
              todayData.gradesSummary = todayData.grades.join(', ');
              todayData.fieldsSummary = [...new Set(todayData.fields)].join(', ');
              todayData.avgScore = todayData.scores.length > 0 ?
                (todayData.scores.reduce((a, b) => a + parseFloat(b || 0), 0) / todayData.scores.length).toFixed(1) : '-';
            }

            // ===== 2. 레이더 차트 상세 데이터 수집 =====
            const radarWrap = document.getElementById('today-radar-wrap');
            const radarCards = radarWrap ? radarWrap.querySelectorAll('.radar-card') : [];
            const radarData = { chartCount: radarCards.length, radarScores: [] };

            if (radarCards.length > 0) {
              // 각 레이더 카드에서 단원명과 점수 정보 수집
              radarCards.forEach(card => {
                const title = card.querySelector('.radar-card-title')?.textContent?.trim() || '';
                // 레이더 점수 데이터 속성에서 가져오기 (data-radar 속성 활용)
                const radarAttr = card.getAttribute('data-radar');
                if (radarAttr) {
                  try {
                    const scores = JSON.parse(radarAttr);
                    radarData.radarScores.push({ unit: title, ...scores });
                  } catch (e) {}
                }
              });

              // 평균 레이더 점수 계산
              if (radarData.radarScores.length > 0) {
                const avgRadar = { literal: 0, structural: 0, lexical: 0, inferential: 0, critical: 0 };
                radarData.radarScores.forEach(r => {
                  avgRadar.literal += (r.literal || 0);
                  avgRadar.structural += (r.structural || 0);
                  avgRadar.lexical += (r.lexical || 0);
                  avgRadar.inferential += (r.inferential || 0);
                  avgRadar.critical += (r.critical || 0);
                });
                const count = radarData.radarScores.length;
                radarData.avgLiteral = (avgRadar.literal / count).toFixed(0);
                radarData.avgStructural = (avgRadar.structural / count).toFixed(0);
                radarData.avgLexical = (avgRadar.lexical / count).toFixed(0);
                radarData.avgInferential = (avgRadar.inferential / count).toFixed(0);
                radarData.avgCritical = (avgRadar.critical / count).toFixed(0);

                // 가장 강한/약한 영역 찾기
                const avgScores = [
                  { name: '사실적 이해', score: parseFloat(radarData.avgLiteral) },
                  { name: '구조적 이해', score: parseFloat(radarData.avgStructural) },
                  { name: '어휘력', score: parseFloat(radarData.avgLexical) },
                  { name: '추론적 이해', score: parseFloat(radarData.avgInferential) },
                  { name: '비판적 이해', score: parseFloat(radarData.avgCritical) }
                ];
                avgScores.sort((a, b) => b.score - a.score);
                radarData.strongestArea = avgScores[0]?.name + '(' + avgScores[0]?.score + '점)';
                radarData.weakestArea = avgScores[4]?.name + '(' + avgScores[4]?.score + '점)';
              }
            }

            // ===== 3. 성장 지수 차트 데이터 수집 =====
            const growthData = { hasData: false };
            const growthCanvas = document.getElementById('growthChart');
            if (growthCanvas && window.Chart) {
              const chartInstance = Chart.getChart(growthCanvas);
              if (chartInstance && chartInstance.data) {
                const labels = chartInstance.data.labels || [];
                const datasets = chartInstance.data.datasets || [];
                if (datasets.length > 0 && datasets[0].data) {
                  const scores = datasets[0].data;
                  growthData.hasData = true;
                  growthData.dateCount = labels.length;
                  growthData.dates = labels.slice(-5).join(', ');
                  growthData.scores = scores.slice(-5).map(s => s?.toFixed(0) || '-').join(', ');
                  growthData.latestScore = scores[scores.length - 1]?.toFixed(0) || '-';
                  growthData.firstScore = scores[0]?.toFixed(0) || '-';
                  growthData.trend = scores.length >= 2 ?
                    (scores[scores.length - 1] > scores[0] ? '상승' :
                     scores[scores.length - 1] < scores[0] ? '하락' : '유지') : '분석중';
                }
              }
            }

            // ===== 4. 과목별 점수 차트 데이터 수집 =====
            const subjectData = { hasData: false };
            const subjectCanvas = document.getElementById('subjectChart');
            if (subjectCanvas && window.Chart) {
              const chartInstance = Chart.getChart(subjectCanvas);
              if (chartInstance && chartInstance.data) {
                const labels = chartInstance.data.labels || [];
                const datasets = chartInstance.data.datasets || [];
                subjectData.hasData = true;
                subjectData.subjects = [];

                datasets.forEach(ds => {
                  if (ds.label && ds.data) {
                    const avgScore = ds.data.reduce((a, b) => a + (b || 0), 0) / ds.data.length;
                    subjectData.subjects.push({ name: ds.label, avgScore: avgScore.toFixed(0) });
                  }
                });

                if (subjectData.subjects.length > 0) {
                  subjectData.subjects.sort((a, b) => parseFloat(b.avgScore) - parseFloat(a.avgScore));
                  subjectData.strongSubject = subjectData.subjects[0]?.name + '(' + subjectData.subjects[0]?.avgScore + '점)';
                  subjectData.weakSubject = subjectData.subjects[subjectData.subjects.length - 1]?.name +
                    '(' + subjectData.subjects[subjectData.subjects.length - 1]?.avgScore + '점)';
                  subjectData.subjectList = subjectData.subjects.map(s => s.name + ' ' + s.avgScore + '점').join(', ');
                }
              }
            }

            // ===== 5. 어휘 점수 데이터 수집 (날짜별 어휘 점수 그래프 데이터 활용) =====
            const vocabScoreData = { hasData: false, items: [], summary: {} };

            // 과목별 평균 점수 설정
            const vocabSubjectAvgScores = {
              'bio': 78, 'earth': 75, 'physics': 63, 'chem': 68,
              'soc': 82, 'geo': 79, 'law': 72, 'pol': 74,
              'classic': 78, 'modern': 84,
              'world': 85, 'world1': 85, 'world2': 84,
              'people': 80, 'people1': 80, 'people2': 80, 'person1': 80, 'person2': 80
            };

            // 단원 코드에서 과목 키 추출
            function getVocabSubjectKey(unitCode) {
              if (!unitCode || !unitCode.includes('_')) return null;
              const parts = unitCode.split('_');
              let subjectKey = parts[0];
              let numStr = parts[1];
              if ((parts[0] === 'fit' || parts[0] === 'deep' || parts[0] === 'on') && parts.length >= 3) {
                subjectKey = parts[1];
                numStr = parts[2];
              }
              if (subjectKey === 'world') {
                const num = parseInt(numStr, 10) || 0;
                if (num > 40) return 'world2';
              }
              return subjectKey;
            }

            // allLogs와 UNIT_PROGRESS_MAP에서 어휘 점수 데이터 수집
            let vocabAboveAvgCount = 0;
            let vocabBelowAvgCount = 0;
            let vocabTotalScore = 0;
            let vocabItemCount = 0;

            // 현재 시리즈의 모든 로그에서 어휘 점수 수집
            allLogs.forEach(log => {
              if (!log.unit || log.deleted) return;
              if (!matchesSeries(log.unit, currentSeries)) return;

              const unitCode = log.unit;
              // 단원 코드 정규화
              let normalizedUnitCode = unitCode;
              const parts = unitCode.split('_');
              if ((parts[0] === 'fit' || parts[0] === 'deep' || parts[0] === 'on') && parts.length >= 3) {
                normalizedUnitCode = parts[1] + '_' + parts[2];
              }

              // UNIT_PROGRESS_MAP에서 어휘 점수 계산
              let vocabScorePercent = 0;
              const unitProgress = UNIT_PROGRESS_MAP[unitCode] || UNIT_PROGRESS_MAP[normalizedUnitCode] || {};
              const vocabState = unitProgress.vocabState;

              if (vocabState && vocabState.vocabData && Array.isArray(vocabState.vocabData)) {
                const total = vocabState.vocabData.length;
                const correct = vocabState.vocabData.filter(v => v.isCorrect).length;
                if (total > 0) {
                  vocabScorePercent = Math.round((correct / total) * 100);
                }
              } else {
                const reportState = unitProgress.reportState || {};
                const vocabScoreRatio = reportState.vocabScoreRatio || 0;
                vocabScorePercent = Math.round(vocabScoreRatio * 100);
              }

              if (vocabScorePercent > 0) {
                const subjectKey = getVocabSubjectKey(unitCode);
                const avgScore = vocabSubjectAvgScores[subjectKey] || 75;
                const isAboveAvg = vocabScorePercent >= avgScore;
                const unitName = typeof getVocabSubjectName === 'function' ? getVocabSubjectName(unitCode) : unitCode;

                vocabScoreData.items.push({
                  unit: unitName,
                  score: vocabScorePercent,
                  avgScore: avgScore,
                  isAboveAvg: isAboveAvg
                });

                if (isAboveAvg) vocabAboveAvgCount++;
                else vocabBelowAvgCount++;

                vocabTotalScore += vocabScorePercent;
                vocabItemCount++;
              }
            });

            if (vocabItemCount > 0) {
              vocabScoreData.hasData = true;
              vocabScoreData.summary = {
                totalCount: vocabItemCount,
                avgScore: Math.round(vocabTotalScore / vocabItemCount),
                aboveAvgCount: vocabAboveAvgCount,
                belowAvgCount: vocabBelowAvgCount,
                aboveAvgPercent: Math.round((vocabAboveAvgCount / vocabItemCount) * 100),
                itemsList: vocabScoreData.items.map(v => v.unit + ' ' + v.score + '점(평균:' + v.avgScore + ')').join(', ')
              };
            }

            // 5개 피드백 동시 로드
            try {
              await Promise.all([
                loadSingleFeedback('today_summary', 'feedbackContent1', todayData),
                loadSingleFeedback('radar_chart', 'feedbackContent2', radarData),
                loadSingleFeedback('growth_trend', 'feedbackContent3', growthData),
                loadSingleFeedback('subject_scores', 'feedbackContent4', subjectData),
                loadSingleFeedback('vocab_scores', 'feedbackContent5', vocabScoreData)
              ]);

              // 로딩 완료 후 콘텐츠 표시
              loadingBox.style.display = 'none';
              contentBox.style.display = 'flex';
            } catch (err) {
              console.error('AI 피드백 로드 오류:', err);
              loadingBox.innerHTML = '<div class="ai-feedback-error">AI 피드백을 불러오는 중 오류가 발생했습니다.</div>';
            }
          }, 3000);
        }

        // 페이지 로드 시 AI 피드백 초기화
        window.addEventListener('load', initAIFeedbacks);

        // ===== 세부 학습 내역 토글 기능 =====
        function toggleDetailedLog() {
          const section = document.getElementById("detailedLogSection");
          const icon = document.getElementById("toggleDetailedLogIcon");
          const text = document.getElementById("toggleDetailedLogText");
          const btn = document.getElementById("toggleDetailedLogBtn");

          if (section.style.display === "none") {
            section.style.display = "block";
            icon.textContent = "▲";
            text.textContent = "세부 AI 상세 학습 내역 접기";
            btn.style.background = "linear-gradient(135deg, #6B4FA0 0%, #8B6FC0 100%)";
            btn.style.color = "#fff";
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            section.style.display = "none";
            icon.textContent = "▼";
            text.textContent = "세부 AI 상세 학습 내역 보기";
            btn.style.background = "linear-gradient(135deg, #6B4FA0 0%, #8B6FC0 100%)";
            btn.style.color = "#fff";
          }
        }

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

        // ===== 검색 기능 (단원명 + 등급 통합 검색) =====
        function searchLogs(query) {
          const rows = document.querySelectorAll('#logTableBody tr');
          const clearBtn = document.getElementById('logSearchClear');

          clearBtn.classList.toggle('show', query.length > 0);

          rows.forEach(row => {
            // 테이블 구조: 순번, 과목명, AI과제부여, 최종완료, 등급(5번째), 시리즈, 단원명(마지막)
            const gradeCell = row.querySelector('td:nth-child(5)');
            const unitCell = row.querySelector('td:last-child');

            if (unitCell && gradeCell) {
              const unitText = unitCell.textContent.toLowerCase();
              const rowGrade = gradeCell.textContent.trim();
              const queryLower = query.toLowerCase();

              // 단원명 또는 등급에 검색어가 포함되면 표시
              const unitMatch = unitText.includes(queryLower);
              const gradeMatch = rowGrade.includes(queryLower);

              row.style.display = (unitMatch || gradeMatch) ? 'table-row' : 'none';
            }
          });

          updateLogCount();
        }

        function clearLogSearch() {
          document.getElementById('logSearch').value = '';
          document.getElementById('logSearchClear').classList.remove('show');
          const rows = document.querySelectorAll('#logTableBody tr');
          rows.forEach(row => row.style.display = 'table-row');
          updateLogCount();
        }

        // 표시된 로그 개수 업데이트
        function updateLogCount() {
          const visibleRows = document.querySelectorAll('#logTableBody tr:not([style*="display: none"])');
          const badge = document.getElementById('logCountBadge');
          if (badge) {
            badge.textContent = '📚 총 ' + visibleRows.length + '건의 학습 기록';
          }
        }

        // 과목별 레이더 검색
        function searchSubjectRadar(query) {
          const cards = document.querySelectorAll('#summary-radar-wrap .radar-card');
          const clearBtn = document.getElementById('subjectSearchClear');
          const toggleBtn = document.getElementById('toggleSummaryBtn');
          const gradeFilterEl = document.getElementById('subjectGradeFilter');
          const gradeFilter = gradeFilterEl ? gradeFilterEl.value : 'all';

          clearBtn.classList.toggle('show', query.length > 0);

          cards.forEach((card, index) => {
            const title = card.querySelector('.radar-card-title');
            const gradeEl = card.querySelector('.stat-grade');
            const titleText = title ? title.textContent.toLowerCase() : '';
            const cardGrade = gradeEl ? gradeEl.textContent.trim() : '';

            const searchMatch = query === '' || titleText.includes(query.toLowerCase());
            const gradeMatch = gradeFilter === 'all' || cardGrade.includes(gradeFilter);

            if (searchMatch && gradeMatch) {
              card.style.display = 'block';
              if (query.length > 0 || gradeFilter !== 'all') {
                card.classList.remove('hidden-card');
              } else if (index >= 6) {
                card.classList.add('hidden-card');
              }
            } else {
              card.style.display = 'none';
            }
          });

          // 검색/필터 중이면 더보기 버튼 숨기기
          if (query.length > 0 || gradeFilter !== 'all') {
            if (toggleBtn) toggleBtn.style.display = 'none';
          } else if (toggleBtn && cards.length > 6) {
            toggleBtn.style.display = 'block';
            toggleBtn.textContent = '더보기 ▼';
          }
        }

        function filterSubjectRadarByGrade(grade) {
          const searchInput = document.getElementById('subjectSearch');
          const query = searchInput ? searchInput.value : '';
          searchSubjectRadar(query);
        }

        function clearSubjectSearch() {
          document.getElementById('subjectSearch').value = '';
          document.getElementById('subjectSearchClear').classList.remove('show');
          document.getElementById('subjectGradeFilter').value = 'all';
          const cards = document.querySelectorAll('#summary-radar-wrap .radar-card');
          const toggleBtn = document.getElementById('toggleSummaryBtn');

          cards.forEach((card, index) => {
            card.style.display = 'block';
            if (index >= 6) {
              card.classList.add('hidden-card');
            } else {
              card.classList.remove('hidden-card');
            }
          });

          if (toggleBtn && cards.length > 6) {
            toggleBtn.style.display = 'block';
            toggleBtn.textContent = '더보기 ▼';
          }
        }

        // 단원별 레이더 검색
        function searchUnitRadar(query) {
          const cards = document.querySelectorAll('#radar-wrap .radar-card');
          const clearBtn = document.getElementById('unitSearchClear');
          const toggleBtn = document.getElementById('toggleRadarBtn');
          const gradeFilterEl = document.getElementById('unitGradeFilter');
          const gradeFilter = gradeFilterEl ? gradeFilterEl.value : 'all';

          clearBtn.classList.toggle('show', query.length > 0);

          cards.forEach((card, index) => {
            const title = card.querySelector('.radar-card-title');
            const gradeEl = card.querySelector('.stat-grade');
            const titleText = title ? title.textContent.toLowerCase() : '';
            const cardGrade = gradeEl ? gradeEl.textContent.trim() : '';

            const searchMatch = query === '' || titleText.includes(query.toLowerCase());
            const gradeMatch = gradeFilter === 'all' || cardGrade.includes(gradeFilter);

            if (searchMatch && gradeMatch) {
              card.style.display = 'block';
              if (query.length > 0 || gradeFilter !== 'all') {
                card.classList.remove('hidden-card');
              } else if (index >= 6) {
                card.classList.add('hidden-card');
              }
            } else {
              card.style.display = 'none';
            }
          });

          // 검색/필터 중이면 더보기 버튼 숨기기
          if (query.length > 0 || gradeFilter !== 'all') {
            if (toggleBtn) toggleBtn.style.display = 'none';
          } else if (toggleBtn && cards.length > 6) {
            toggleBtn.style.display = 'block';
            toggleBtn.textContent = '더보기 ▼';
          }
        }

        function filterUnitRadarByGrade(grade) {
          const searchInput = document.getElementById('unitSearch');
          const query = searchInput ? searchInput.value : '';
          searchUnitRadar(query);
        }

        function clearUnitSearch() {
          document.getElementById('unitSearch').value = '';
          document.getElementById('unitSearchClear').classList.remove('show');
          document.getElementById('unitGradeFilter').value = 'all';
          const cards = document.querySelectorAll('#radar-wrap .radar-card');
          const toggleBtn = document.getElementById('toggleRadarBtn');

          cards.forEach((card, index) => {
            card.style.display = 'block';
            if (index >= 6) {
              card.classList.add('hidden-card');
            } else {
              card.classList.remove('hidden-card');
            }
          });

          if (toggleBtn && cards.length > 6) {
            toggleBtn.style.display = 'block';
            toggleBtn.textContent = '더보기 ▼';
          }
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
        const UNIT_TITLES = ${JSON.stringify(UNIT_TITLES)};
        const UNIT_PROGRESS_MAP = ${JSON.stringify(unitProgressMap)};  // ✅ 어휘학습 점수 포함
        const rawSeries = '${series || 'up'}';  // 현재 페이지의 시리즈 (단축코드)

        // 시리즈 단축코드를 전체 이름으로 변환
        function getFullSeriesName(series) {
          const seriesMap = {
            'up': 'BRAIN업',
            'on': 'BRAIN온',
            'fit': 'BRAIN핏',
            'deep': 'BRAIN딥',
            'BRAIN업': 'BRAIN업',
            'BRAIN온': 'BRAIN온',
            'BRAIN핏': 'BRAIN핏',
            'BRAIN딥': 'BRAIN딥'
          };
          return seriesMap[series] || 'BRAIN업';
        }
        let currentSeries = getFullSeriesName(rawSeries);

        // 시리즈별 unit 접두사 필터 함수 (filterLogsBySeries와 동일한 로직 사용)
        function matchesSeries(unit, series) {
          if (!unit) return false;
          if (series === 'BRAIN온') return unit.includes('on_');
          if (series === 'BRAIN핏') return unit.includes('fit_');
          if (series === 'BRAIN딥') return unit.includes('deep_');
          if (series === 'BRAIN업') return !unit.includes('on_') && !unit.includes('fit_') && !unit.includes('deep_');
          return true; // 기본값: 모든 시리즈
        }

        // ===== 지수별 추이 꺾은선 그래프 (날짜별 평균) =====
        let indexTrendChartInstance = null;
        let indexTrendCurrentPage = 0;
        let indexTrendAllDates = [];
        let indexTrendDateIndexMap = {};

        function renderIndexTrendChart() {
          const canvas = document.getElementById('indexTrendChart');
          const legendContainer = document.getElementById('indexTrendLegend');
          const chartContainer = canvas ? canvas.parentElement : null;
          const dateRangeSpan = document.getElementById('indexTrendDateRange');
          const prevBtn = document.getElementById('indexTrendPrev');
          const nextBtn = document.getElementById('indexTrendNext');

          if (!canvas || !legendContainer) return;

          // 날짜별 지수 데이터 집계 (완료된 기록만)
          const dateIndexMap = {};

          // 현재 시리즈에 맞는 로그만 필터링
          const seriesFilteredLogs = logsForChart.filter(log => matchesSeries(log.unit, currentSeries));

          seriesFilteredLogs.forEach(log => {
            // timestamp를 날짜로 사용
            if (!log.timestamp) return;
            const logDate = log.timestamp;

            // KST로 변환하여 날짜 문자열 생성 (+9시간)
            const kstDate = new Date(new Date(logDate).getTime() + 9 * 60 * 60 * 1000);
            const dateStr = kstDate.toISOString().split('T')[0];

            // radar에 유효한 점수가 있는 기록만 차트 데이터로 사용
            const r = log.radar || {};
            const hasValidScore = [r.literal, r.structural, r.lexical, r.inferential, r.critical].some(s => s != null && s > 0);
            if (!hasValidScore) return;

            if (!dateIndexMap[dateStr]) {
              dateIndexMap[dateStr] = {
                literal: [],      // 핵심 이해력
                critical: [],     // 비판 적용력
                structural: [],   // 구조 파악력
                inferential: [],  // 추론 통합력
                lexical: []       // 어휘 맥락력
              };
            }

            if (r.literal != null) dateIndexMap[dateStr].literal.push(r.literal);
            if (r.critical != null) dateIndexMap[dateStr].critical.push(r.critical);
            if (r.structural != null) dateIndexMap[dateStr].structural.push(r.structural);
            if (r.inferential != null) dateIndexMap[dateStr].inferential.push(r.inferential);
            if (r.lexical != null) dateIndexMap[dateStr].lexical.push(r.lexical);
          });

          console.log('[renderIndexTrendChart] currentSeries:', currentSeries, ', 필터링된 로그:', seriesFilteredLogs.length, ', 날짜 수:', Object.keys(dateIndexMap).length);

          // 날짜 정렬 및 전역 변수에 저장
          indexTrendAllDates = Object.keys(dateIndexMap).sort();
          indexTrendDateIndexMap = dateIndexMap;

          if (indexTrendAllDates.length === 0) {
            chartContainer.innerHTML = '<div class="index-trend-no-data">학습 기록이 없어 지수 추이를 표시할 수 없습니다.</div>';
            legendContainer.innerHTML = '';
            if (dateRangeSpan) dateRangeSpan.textContent = '';
            return;
          }

          // 7일 슬라이딩 윈도우 설정 (기본: 최근 7일)
          const DAYS_TO_SHOW = 7;
          indexTrendCurrentPage = Math.max(0, indexTrendAllDates.length - DAYS_TO_SHOW);

          // 날짜별 평균 계산 함수
          const calcAvg = arr => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

          // 색상 정의
          const colors = {
            literal: { line: '#667eea', bg: 'rgba(102, 126, 234, 0.2)' },      // 보라
            critical: { line: '#f093fb', bg: 'rgba(240, 147, 251, 0.2)' },     // 핑크
            structural: { line: '#4facfe', bg: 'rgba(79, 172, 254, 0.2)' },    // 파랑
            inferential: { line: '#43e97b', bg: 'rgba(67, 233, 123, 0.2)' },   // 초록
            lexical: { line: '#fa709a', bg: 'rgba(250, 112, 154, 0.2)' }       // 코랄
          };

          // 차트 업데이트 함수
          function updateIndexTrendChart() {
            const startIdx = indexTrendCurrentPage;
            const endIdx = Math.min(startIdx + DAYS_TO_SHOW, indexTrendAllDates.length);
            const displayDates = indexTrendAllDates.slice(startIdx, endIdx);

            // 날짜 라벨 포맷 (MM/DD)
            const dateLabels = displayDates.map(d => {
              const parts = d.split('-');
              return parts[1] + '/' + parts[2];
            });

            // 데이터 계산
            const literalData = displayDates.map(d => calcAvg(indexTrendDateIndexMap[d].literal));
            const criticalData = displayDates.map(d => calcAvg(indexTrendDateIndexMap[d].critical));
            const structuralData = displayDates.map(d => calcAvg(indexTrendDateIndexMap[d].structural));
            const inferentialData = displayDates.map(d => calcAvg(indexTrendDateIndexMap[d].inferential));
            const lexicalData = displayDates.map(d => calcAvg(indexTrendDateIndexMap[d].lexical));

            // 날짜 범위 표시
            if (dateRangeSpan && displayDates.length > 0) {
              const firstLabel = dateLabels[0];
              const lastLabel = dateLabels[dateLabels.length - 1];
              dateRangeSpan.textContent = firstLabel + ' ~ ' + lastLabel;
            }

            // 버튼 활성화 상태
            if (prevBtn) prevBtn.disabled = indexTrendCurrentPage === 0;
            if (nextBtn) nextBtn.disabled = endIdx >= indexTrendAllDates.length;
            if (prevBtn) prevBtn.style.opacity = indexTrendCurrentPage === 0 ? '0.4' : '1';
            if (nextBtn) nextBtn.style.opacity = endIdx >= indexTrendAllDates.length ? '0.4' : '1';

            // 기존 차트 제거
            if (indexTrendChartInstance) {
              indexTrendChartInstance.destroy();
            }

            // Chart.js 꺾은선 그래프 생성
            const ctx = canvas.getContext('2d');

            indexTrendChartInstance = new Chart(ctx, {
              type: 'line',
              data: {
                labels: dateLabels,
                datasets: [
                  {
                    label: '핵심 이해력',
                    data: literalData,
                    borderColor: colors.literal.line,
                    backgroundColor: colors.literal.bg,
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    spanGaps: true
                  },
                  {
                    label: '비판 적용력',
                    data: criticalData,
                    borderColor: colors.critical.line,
                    backgroundColor: colors.critical.bg,
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    spanGaps: true
                  },
                  {
                    label: '구조 파악력',
                    data: structuralData,
                    borderColor: colors.structural.line,
                    backgroundColor: colors.structural.bg,
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    spanGaps: true
                  },
                  {
                    label: '추론 통합력',
                    data: inferentialData,
                    borderColor: colors.inferential.line,
                    backgroundColor: colors.inferential.bg,
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    spanGaps: true
                  },
                  {
                    label: '어휘 맥락력',
                    data: lexicalData,
                    borderColor: colors.lexical.line,
                    backgroundColor: colors.lexical.bg,
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    spanGaps: true
                  },
                  {
                    label: '평균 기준선 (7점)',
                    data: dateLabels.map(() => 7),
                    borderColor: 'rgba(150, 150, 150, 0.6)',
                    borderWidth: 1.5,
                  borderDash: [6, 4],
                  fill: false,
                  tension: 0,
                  pointRadius: 0,
                  pointHoverRadius: 0,
                  order: 10
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: '#fff',
                  bodyColor: '#fff',
                  padding: 12,
                  callbacks: {
                    label: function(context) {
                      const value = context.parsed.y;
                      return context.dataset.label + ': ' + (value !== null ? value.toFixed(1) : '-');
                    }
                  }
                },
                datalabels: {
                  display: false,
                  anchor: 'top',
                  align: 'top',
                  offset: 4,
                  font: {
                    size: 11,
                    weight: 'bold'
                  },
                  formatter: function(value) {
                    return value !== null ? value.toFixed(1) : '';
                  }
                }
              },
              scales: {
                x: {
                  position: 'bottom',
                  grid: {
                    display: false
                  },
                  ticks: {
                    color: '#555',
                    font: { size: 11, weight: '600' },
                    maxRotation: 45,
                    minRotation: 0
                  },
                  border: {
                    display: true,
                    color: 'rgba(100, 100, 100, 0.3)'
                  }
                },
                y: {
                  min: 5,
                  max: 10.5,
                  grid: {
                    display: false
                  },
                  ticks: {
                    display: false
                  },
                  border: {
                    display: false
                  }
                }
              }
            }
          });

          // 범례 클릭 이벤트 - 해당 그래프 강조
          let highlightedIndex = null;
          const legendItemElements = legendContainer.querySelectorAll('.index-trend-legend-item');

          legendItemElements.forEach((el, idx) => {
            el.addEventListener('click', function() {
              const clickedIndex = parseInt(this.dataset.index);

              if (highlightedIndex === clickedIndex) {
                // 같은 항목 다시 클릭 시 원래대로 복원
                highlightedIndex = null;
                indexTrendChartInstance.data.datasets.forEach((dataset, i) => {
                  if (i >= legendItems.length) return; // 평균 기준선 스킵
                  dataset.borderWidth = 2;
                  dataset.borderColor = legendItems[i].color;
                  dataset.pointRadius = 4;
                  dataset.datalabels = { display: false };
                });
                legendItemElements.forEach(item => {
                  item.classList.remove('active', 'dimmed');
                });
              } else {
                // 선택한 그래프 강조, 나머지는 희미하게
                highlightedIndex = clickedIndex;
                indexTrendChartInstance.data.datasets.forEach((dataset, i) => {
                  if (i >= legendItems.length) return; // 평균 기준선 스킵
                  if (i === clickedIndex) {
                    dataset.borderWidth = 4;
                    dataset.borderColor = legendItems[i].color;
                    dataset.pointRadius = 6;
                    dataset.datalabels = {
                      display: true,
                      color: legendItems[i].color,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: 4,
                      padding: { top: 2, bottom: 2, left: 4, right: 4 }
                    };
                  } else {
                    dataset.borderWidth = 1;
                    dataset.borderColor = legendItems[i].color + '40'; // 투명도 추가
                    dataset.pointRadius = 2;
                    dataset.datalabels = { display: false };
                  }
                });
                legendItemElements.forEach((item, i) => {
                  if (i === clickedIndex) {
                    item.classList.add('active');
                    item.classList.remove('dimmed');
                  } else {
                    item.classList.add('dimmed');
                    item.classList.remove('active');
                  }
                });
              }
              indexTrendChartInstance.update();
            });
          });
          } // updateIndexTrendChart 함수 끝

          // 범례 먼저 생성 (한 번만)
          const legendItems = [
            { label: '핵심 이해력', color: colors.literal.line, index: 0 },
            { label: '비판 적용력', color: colors.critical.line, index: 1 },
            { label: '구조 파악력', color: colors.structural.line, index: 2 },
            { label: '추론 통합력', color: colors.inferential.line, index: 3 },
            { label: '어휘 맥락력', color: colors.lexical.line, index: 4 }
          ];

          legendContainer.innerHTML = legendItems.map((item, idx) =>
            '<div class="index-trend-legend-item" data-index="' + idx + '" style="cursor: pointer;">' +
              '<div class="index-trend-legend-color" style="background: ' + item.color + ';"></div>' +
              '<span class="index-trend-legend-label">' + item.label + '</span>' +
            '</div>'
          ).join('');

          // 초기 차트 렌더링
          updateIndexTrendChart();

          // 네비게이션 버튼 이벤트 (하루씩 이동)
          if (prevBtn) {
            prevBtn.onclick = function() {
              if (indexTrendCurrentPage > 0) {
                indexTrendCurrentPage--;
                updateIndexTrendChart();
              }
            };
          }
          if (nextBtn) {
            nextBtn.onclick = function() {
              if (indexTrendCurrentPage + DAYS_TO_SHOW < indexTrendAllDates.length) {
                indexTrendCurrentPage++;
                updateIndexTrendChart();
              }
            };
          }
        }

        // ===== 날짜별 과목 평균 평점 막대 그래프 렌더링 =====
        let subjectBarChartInstance = null;
        let subjectBarCurrentPage = 0;
        let subjectBarDatesWithData = [];

        function renderSubjectBarChart() {
          const canvas = document.getElementById('subjectBarChart');
          const legendContainer = document.getElementById('subjectBarLegend');
          const dateRangeSpan = document.getElementById('subjectBarDateRange');
          const prevBtn = document.getElementById('subjectBarPrev');
          const nextBtn = document.getElementById('subjectBarNext');

          if (!canvas || !legendContainer) return;

          // 14개 과목 정의 및 색상
          const subjectConfig = [
            { key: 'bio', name: '생물', color: '#4CAF50' },
            { key: 'earth', name: '지구과학', color: '#2196F3' },
            { key: 'physics', name: '물리', color: '#9C27B0' },
            { key: 'chem', name: '화학', color: '#FF5722' },
            { key: 'soc', name: '사회문화', color: '#E91E63' },
            { key: 'geo', name: '지리', color: '#00BCD4' },
            { key: 'law', name: '법', color: '#795548' },
            { key: 'pol', name: '정치경제', color: '#607D8B' },
            { key: 'classic', name: '고전소설', color: '#8BC34A' },
            { key: 'modern', name: '현대소설', color: '#FFC107' },
            { key: 'world1', name: '세계문학1', color: '#FF9800' },
            { key: 'world2', name: '세계문학2', color: '#F44336' },
            { key: 'person1', name: '한국인물', color: '#673AB7' },
            { key: 'person2', name: '세계인물', color: '#3F51B5' }
          ];

          // 과목 키 매핑 (다양한 형태의 과목 코드를 표준화)
          function normalizeSubjectKey(unitCode) {
            if (!unitCode) return null;
            const parts = unitCode.split('_');
            let subjectKey = parts[0];
            let numStr = parts[1] || '';

            // fit_, deep_, on_ 접두사 처리
            if ((parts[0] === 'fit' || parts[0] === 'deep' || parts[0] === 'on') && parts.length >= 3) {
              subjectKey = parts[1];
              numStr = parts[2] || '';
            }

            const number = numStr ? parseInt(numStr, 10) : 0;

            // 과목 코드 매핑
            if (subjectKey === 'world') {
              return number > 40 ? 'world2' : 'world1';
            }
            if (subjectKey === 'people' || subjectKey === 'person') {
              return number > 40 ? 'person2' : 'person1';
            }
            // people1, people2, world1, world2 형식 처리 (숫자가 붙어있는 경우)
            if (subjectKey === 'people1' || subjectKey === 'person1') {
              return 'person1';
            }
            if (subjectKey === 'people2' || subjectKey === 'person2') {
              return 'person2';
            }
            if (subjectKey === 'world1') {
              return 'world1';
            }
            if (subjectKey === 'world2') {
              return 'world2';
            }

            return subjectKey;
          }

          // 날짜별 과목별 평균 점수 계산 (completedAt이 있는 완료된 기록만)
          const dateSubjectScores = {};

          logsForChart.forEach(log => {
            // 현재 시리즈만 필터링 (동적)
            if (!matchesSeries(log.unit, currentSeries)) return;

            // radar에 유효한 점수가 있는 완료된 기록만 사용
            const r = log.radar || {};
            const hasValidScore = [r.literal, r.structural, r.lexical, r.inferential, r.critical].some(s => s != null && s > 0);
            if (!hasValidScore) return;

            // timestamp를 날짜로 사용
            if (!log.timestamp) return;
            const logDate = log.timestamp;

            // KST로 변환하여 날짜 문자열 생성 (+9시간)
            const kstDate = new Date(new Date(logDate).getTime() + 9 * 60 * 60 * 1000);
            const dateStr = kstDate.toISOString().split('T')[0];
            const subjectKey = normalizeSubjectKey(log.unit);

            if (!subjectKey) return;

            // 평균 점수 계산 (radar 객체에서 5개 지수 평균)
            let score = null;
            if (log.radar) {
              const r = log.radar;
              const scores = [
                r.literal || 0,
                r.structural || 0,
                r.lexical || 0,
                r.inferential || 0,
                r.critical || 0
              ].filter(s => s > 0);
              if (scores.length > 0) {
                score = scores.reduce((a, b) => a + b, 0) / scores.length;
              }
            }
            if (score === null) return;

            if (!dateSubjectScores[dateStr]) {
              dateSubjectScores[dateStr] = {};
            }
            if (!dateSubjectScores[dateStr][subjectKey]) {
              dateSubjectScores[dateStr][subjectKey] = { sum: 0, count: 0, units: [] };
            }

            dateSubjectScores[dateStr][subjectKey].sum += score;
            dateSubjectScores[dateStr][subjectKey].count += 1;
            // 단원별 점수 저장 (단원명, 점수)
            dateSubjectScores[dateStr][subjectKey].units.push({
              name: UNIT_TITLES[log.unit] || log.unit,
              score: score
            });
          });

          // 데이터가 있는 날짜만 추출 및 정렬
          subjectBarDatesWithData = Object.keys(dateSubjectScores).sort((a, b) => new Date(a) - new Date(b));

          if (subjectBarDatesWithData.length === 0) {
            canvas.parentElement.innerHTML = '<div style="text-align:center; color:#666; padding:40px;">학습 기록이 없습니다.</div>';
            legendContainer.innerHTML = '';
            if (dateRangeSpan) dateRangeSpan.textContent = '';
            return;
          }

          // 활성화된 과목 필터 (null이면 모두 표시, 값이 있으면 해당 과목만 표시)
          let activeSubjectFilter = null;

          // 범례 생성 (클릭 가능하게)
          function renderLegend() {
            legendContainer.innerHTML = subjectConfig.map(subj => {
              const isActive = activeSubjectFilter === null || activeSubjectFilter === subj.key;
              const opacity = isActive ? '1' : '0.3';
              return '<div class="subject-bar-legend-item" data-subject="' + subj.key + '" style="cursor: pointer; opacity: ' + opacity + '; transition: opacity 0.2s;">' +
                '<div class="subject-bar-legend-color" style="background: ' + subj.color + ';"></div>' +
                '<span>' + subj.name + '</span>' +
              '</div>';
            }).join('');

            // 범례 클릭 이벤트
            legendContainer.querySelectorAll('.subject-bar-legend-item').forEach(item => {
              item.onclick = function() {
                const clickedSubject = this.getAttribute('data-subject');
                if (activeSubjectFilter === clickedSubject) {
                  // 같은 과목 다시 클릭하면 필터 해제 (모두 표시)
                  activeSubjectFilter = null;
                } else {
                  // 새 과목 선택
                  activeSubjectFilter = clickedSubject;
                }
                renderLegend();
                updateChart();
              };
            });
          }
          renderLegend();

          // 차트 업데이트 함수 (슬라이딩 윈도우 방식: 하루씩 이동)
          function updateChart() {
            const daysToShow = 4; // 화면에 보여줄 날짜 수
            const totalDates = subjectBarDatesWithData.length;
            const maxStartIdx = Math.max(0, totalDates - daysToShow);

            // 슬라이딩 윈도우 범위 계산 (subjectBarCurrentPage는 시작 인덱스로 사용)
            const startIdx = Math.min(subjectBarCurrentPage, maxStartIdx);
            const endIdx = Math.min(startIdx + daysToShow, totalDates);
            const visibleDates = subjectBarDatesWithData.slice(startIdx, endIdx);

            // 날짜 범위 표시
            if (dateRangeSpan && visibleDates.length > 0) {
              const formatDate = (d) => {
                const date = new Date(d);
                return (date.getMonth() + 1) + '/' + date.getDate();
              };
              if (visibleDates.length === 1) {
                dateRangeSpan.textContent = formatDate(visibleDates[0]);
              } else {
                dateRangeSpan.textContent = formatDate(visibleDates[0]) + ' ~ ' + formatDate(visibleDates[visibleDates.length - 1]);
              }
            }

            // 네비게이션 버튼 상태 (하루씩 이동)
            if (prevBtn) prevBtn.disabled = subjectBarCurrentPage <= 0;
            if (nextBtn) nextBtn.disabled = subjectBarCurrentPage >= maxStartIdx;

            // X축 라벨 (날짜)
            const labels = visibleDates.map(d => {
              const date = new Date(d);
              return (date.getMonth() + 1) + '/' + date.getDate();
            });

            // 데이터셋 생성 (각 과목별, 필터 적용)
            const filteredSubjects = activeSubjectFilter
              ? subjectConfig.filter(s => s.key === activeSubjectFilter)
              : subjectConfig;

            const datasets = filteredSubjects.map(subj => {
              const data = visibleDates.map(dateStr => {
                const subjData = dateSubjectScores[dateStr][subj.key];
                if (subjData && subjData.count > 0) {
                  return parseFloat((subjData.sum / subjData.count).toFixed(1));
                }
                return null;
              });

              // 각 날짜별 단원 정보 저장
              const unitsData = visibleDates.map(dateStr => {
                const subjData = dateSubjectScores[dateStr][subj.key];
                if (subjData && subjData.units && subjData.units.length > 0) {
                  return subjData.units;
                }
                return [];
              });

              return {
                label: subj.name,
                subjectKey: subj.key,
                data: data,
                unitsData: unitsData,
                backgroundColor: subj.color,
                borderColor: subj.color,
                borderWidth: 1,
                borderRadius: 3,
                barPercentage: 0.9,
                categoryPercentage: 0.9,
                skipNull: true
              };
            }).filter(ds => ds.data.some(v => v !== null)); // 데이터가 있는 과목만

            // 기존 차트 제거
            if (subjectBarChartInstance) {
              subjectBarChartInstance.destroy();
            }

            // Chart.js 막대 그래프 생성
            const ctx = canvas.getContext('2d');
            subjectBarChartInstance = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: labels,
                datasets: datasets
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    bodyFont: { size: 12 },
                    callbacks: {
                      label: function(context) {
                        const value = context.parsed.y;
                        const dataIndex = context.dataIndex;
                        const units = context.dataset.unitsData ? context.dataset.unitsData[dataIndex] : [];

                        // 결과 배열 (첫 줄: 과목 평균)
                        const lines = [];
                        lines.push(context.dataset.label + ': ' + (value !== null ? value.toFixed(1) + '점 (평균)' : '-'));

                        // 단원별 점수 추가
                        if (units && units.length > 0) {
                          units.forEach(function(unit) {
                            lines.push('  - ' + unit.name + ': ' + unit.score.toFixed(1) + '점');
                          });
                        }

                        return lines;
                      }
                    }
                  },
                  datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'top',
                    offset: -2,
                    font: {
                      size: 9,
                      weight: 'bold'
                    },
                    color: function(context) {
                      return context.dataset.backgroundColor;
                    },
                    formatter: function(value) {
                      return value !== null ? value.toFixed(1) : '';
                    }
                  }
                },
                scales: {
                  x: {
                    position: 'bottom',
                    grid: {
                      display: false
                    },
                    ticks: {
                      color: '#333',
                      font: { size: 11, weight: '600' }
                    }
                  },
                  y: {
                    min: 0,
                    max: 10,
                    grid: {
                      color: 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                      color: '#666',
                      font: { size: 10 },
                      stepSize: 2
                    }
                  }
                }
              }
            });
          }

          // 네비게이션 이벤트
          if (prevBtn) {
            prevBtn.onclick = function() {
              if (subjectBarCurrentPage > 0) {
                subjectBarCurrentPage--;
                updateChart();
              }
            };
          }
          if (nextBtn) {
            nextBtn.onclick = function() {
              const daysToShow = 4;
              const maxStartIdx = Math.max(0, subjectBarDatesWithData.length - daysToShow);
              if (subjectBarCurrentPage < maxStartIdx) {
                subjectBarCurrentPage++;
                updateChart();
              }
            };
          }

          // 최신 날짜부터 보여주기 (슬라이딩 윈도우: 마지막 위치부터 시작)
          const daysToShow = 4;
          const maxStartIdx = Math.max(0, subjectBarDatesWithData.length - daysToShow);
          subjectBarCurrentPage = maxStartIdx;

          updateChart();
        }

        // ===== Today 나의 AI 학습 기록 렌더링 (나의 AI 학습 분석 팝업용) =====
        // 날짜 네비게이션을 위한 현재 선택된 날짜 (기본: 오늘)
        let selectedDate = new Date();

        // 날짜 변경 함수
        function changeDate(delta) {
          selectedDate.setDate(selectedDate.getDate() + delta);
          renderTodaySection();
        }
        window.changeDate = changeDate;

        // 어휘 학습 페이지로 이동 함수
        function goToVocabPage(url) {
          window.location.href = url;
        }
        window.goToVocabPage = goToVocabPage;

        // ===== 달력 팝업 기능 =====
        let calendarMonth = new Date(); // 달력에 표시할 월
        let completedDatesCount = new Map(); // 날짜별 학습 완료 개수 (YYYY-MM-DD -> count)

        // 달력 팝업 열기
        function openCalendarPopup() {
          calendarMonth = new Date(selectedDate); // 현재 선택된 날짜의 월로 시작
          document.getElementById('calendarPopup').style.display = 'flex';
          renderCalendar();
        }
        window.openCalendarPopup = openCalendarPopup;

        // 달력 팝업 닫기
        function closeCalendarPopup() {
          document.getElementById('calendarPopup').style.display = 'none';
        }
        window.closeCalendarPopup = closeCalendarPopup;

        // 달력 월 변경
        function changeCalendarMonth(delta) {
          calendarMonth.setMonth(calendarMonth.getMonth() + delta);
          renderCalendar();
        }
        window.changeCalendarMonth = changeCalendarMonth;

        // 달력 날짜 선택
        function selectCalendarDate(dateStr) {
          selectedDate = new Date(dateStr + 'T00:00:00');
          closeCalendarPopup();
          renderTodaySection();
        }
        window.selectCalendarDate = selectCalendarDate;

        // 달력 렌더링
        function renderCalendar() {
          const monthDisplay = document.getElementById('calendarMonthDisplay');
          const grid = document.getElementById('calendarGrid');
          if (!monthDisplay || !grid) return;

          const year = calendarMonth.getFullYear();
          const month = calendarMonth.getMonth();
          monthDisplay.textContent = year + '년 ' + (month + 1) + '월';

          // 요일 헤더
          const days = ['일', '월', '화', '수', '목', '금', '토'];
          let html = days.map((d, i) => '<div style="padding:8px; font-weight:600; color:' + (i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : '#666') + ';">' + d + '</div>').join('');

          // 월의 첫 날과 마지막 날
          const firstDay = new Date(year, month, 1);
          const lastDay = new Date(year, month + 1, 0);
          const startDayOfWeek = firstDay.getDay();

          // 이전 달 빈 칸
          for (let i = 0; i < startDayOfWeek; i++) {
            html += '<div></div>';
          }

          // 오늘 날짜 (KST)
          const todayStr = toKSTDateString(new Date());

          // 날짜 렌더링
          for (let d = 1; d <= lastDay.getDate(); d++) {
            const dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === toKSTDateString(selectedDate);
            const learningCount = completedDatesCount.get(dateStr) || 0;
            const dayOfWeek = new Date(year, month, d).getDay();

            let bgColor = 'transparent';
            let textColor = dayOfWeek === 0 ? '#ef4444' : dayOfWeek === 6 ? '#3b82f6' : '#333';
            let border = 'none';
            let fontWeight = '400';

            if (isSelected) {
              bgColor = '#667eea';
              textColor = '#fff';
              fontWeight = '700';
            } else if (isToday) {
              border = '2px solid #667eea';
              fontWeight = '600';
            }

            html += '<div onclick="selectCalendarDate(' + "'" + dateStr + "'" + ')" style="padding:4px 2px; cursor:pointer; background:' + bgColor + '; color:' + textColor + '; border:' + border + '; border-radius:8px; font-weight:' + fontWeight + '; position:relative; min-height:44px; display:flex; flex-direction:column; align-items:center; justify-content:flex-start;">';
            html += '<span style="font-size:14px;">' + d + '</span>';
            if (learningCount > 0) {
              html += '<span style="display:flex; align-items:center; gap:2px; margin-top:2px;">';
              html += '<span style="width:6px; height:6px; background:#10b981; border-radius:50%;"></span>';
              html += '<span style="font-size:10px; color:#10b981; font-weight:600;">' + learningCount + '</span>';
              html += '</span>';
            }
            html += '</div>';
          }

          grid.innerHTML = html;
        }

        // 학습 완료된 날짜 목록 업데이트 (날짜별 개수)
        function updateCompletedDates(logs) {
          completedDatesCount.clear();
          logs.forEach(log => {
            if (log.timestamp && log.completed) {
              const dateStr = toKSTDateString(new Date(log.timestamp));
              completedDatesCount.set(dateStr, (completedDatesCount.get(dateStr) || 0) + 1);
            }
          });
        }

        // 날짜 포맷팅 함수 (YYYY년 MM월 DD일 (요일))
        function formatDateKorean(date) {
          const days = ['일', '월', '화', '수', '목', '금', '토'];
          const y = date.getFullYear();
          const m = date.getMonth() + 1;
          const d = date.getDate();
          const dayName = days[date.getDay()];
          return y + '년 ' + m + '월 ' + d + '일 (' + dayName + ')';
        }

        // KST 기준 날짜 문자열 반환 (YYYY-MM-DD)
        function toKSTDateString(date) {
          const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
          return kst.toISOString().split('T')[0];
        }

        // 오늘 날짜인지 확인 (KST 기준)
        function isToday(date) {
          const today = new Date();
          return toKSTDateString(date) === toKSTDateString(today);
        }

        function renderTodaySection() {
          console.log('[Today] UNIT_PROGRESS_MAP keys:', Object.keys(UNIT_PROGRESS_MAP));
          const selectedDateStr = toKSTDateString(selectedDate);

          // 달력에 표시할 완료된 날짜 목록 업데이트 (현재 시리즈만)
          const logsForCalendar = logsForChart.filter(log => matchesSeries(log.unit, currentSeries));
          updateCompletedDates(logsForCalendar);

          // 날짜 표시 업데이트
          const dateDisplay = document.getElementById('currentDateDisplay');
          const description = document.getElementById('todayDescription');
          const nextBtn = document.getElementById('dateNextBtn');

          if (dateDisplay) {
            dateDisplay.textContent = formatDateKorean(selectedDate);
          }
          if (description) {
            if (isToday(selectedDate)) {
              description.textContent = '오늘 완료한 학습 기록입니다.';
            } else {
              description.textContent = '선택한 날짜의 학습 기록입니다.';
            }
          }
          // 오늘 이후 날짜로는 이동 불가
          if (nextBtn) {
            if (isToday(selectedDate)) {
              nextBtn.style.opacity = '0.3';
              nextBtn.style.cursor = 'not-allowed';
              nextBtn.disabled = true;
            } else {
              nextBtn.style.opacity = '1';
              nextBtn.style.cursor = 'pointer';
              nextBtn.disabled = false;
            }
          }

          // 선택된 날짜의 학습 기록 필터링 (현재 시리즈만, KST 기준)
          const todayLogs = logsForChart.filter(log => {
            // 현재 시리즈만 필터링 (동적)
            if (!matchesSeries(log.unit, currentSeries)) return false;
            const logDate = log.completedAt || log.timestamp;
            if (!logDate) return false;
            return toKSTDateString(new Date(logDate)) === selectedDateStr;
          });

          const tableContainer = document.getElementById('todayTableContainer');
          const radarWrap = document.getElementById('today-radar-wrap');

          if (!tableContainer || !radarWrap) return;

          if (todayLogs.length === 0) {
            const noDataMsg = isToday(selectedDate) ? '오늘 완료한 학습 기록이 없습니다.' : '해당 날짜의 학습 기록이 없습니다.';
            tableContainer.innerHTML = '<div class="no-data-message" style="text-align:center; color:#333; padding:20px; font-size:14px;">' + noDataMsg + '</div>';
            radarWrap.innerHTML = '<div class="no-data-message" style="width:100%; text-align:center; color:#fff; padding:30px; font-size:14px;">' + noDataMsg + '</div>';
            return;
          }

          // 과목 매핑 (종합 학습 기록과 동일)
          const subjectMap = { 'geo': '지리', 'bio': '생물', 'earth': '지구과학', 'physics': '물리', 'chem': '화학', 'soc': '사회문화', 'law': '법', 'pol': '정치경제', 'modern': '현대문학', 'classic': '고전문학', 'world': '세계문학1', 'world1': '세계문학1', 'world2': '세계문학2', 'people': '한국인물', 'people1': '한국인물', 'people2': '세계인물', 'person1': '한국인물', 'person2': '세계인물' };

          // 분야 매핑
          const fieldMap = {
            'bio': '과학분야', 'earth': '과학분야', 'physics': '과학분야', 'chem': '과학분야',
            'geo': '사회분야', 'soc': '사회분야', 'law': '사회분야', 'pol': '사회분야',
            'modern': '한국문학', 'classic': '한국문학',
            'world': '세계문학', 'world1': '세계문학', 'world2': '세계문학',
            'people': '인물분야', 'people1': '인물분야', 'people2': '인물분야', 'person1': '인물분야', 'person2': '인물분야'
          };

          // 폴더 매핑 (subjectKey -> 폴더명)
          const folderMap = {
            'bio': 'science', 'earth': 'science', 'physics': 'science', 'chem': 'science',
            'geo': 'social', 'soc': 'social', 'law': 'social', 'pol': 'social',
            'modern': 'korlit', 'classic': 'korlit',
            'world': 'worldlit', 'world1': 'worldlit', 'world2': 'worldlit',
            'people': 'person', 'people1': 'person', 'people2': 'person', 'person1': 'person', 'person2': 'person'
          };

          // 테이블 생성
          let tableHtml = '<table class="today-table"><thead><tr>';
          tableHtml += '<th>#</th><th>시리즈</th><th>분야</th><th>단원명</th><th>등급</th><th>평균</th><th>어휘</th>';
          tableHtml += '</tr></thead><tbody>';

          todayLogs.forEach((log, idx) => {
            const unitCode = log.unit || '';

            // 과목명 추출 (종합 학습 기록과 동일 로직)
            let subjectName = '-';
            let subjectKey = '';
            let numStr = '';
            if (unitCode && unitCode.includes('_')) {
              const parts = unitCode.split('_');
              subjectKey = parts[0];
              numStr = parts[1];
              if ((parts[0] === 'fit' || parts[0] === 'deep' || parts[0] === 'on') && parts.length >= 3) {
                subjectKey = parts[1];
                numStr = parts[2];
              }
              let number = numStr ? parseInt(numStr, 10) : 0;
              if (subjectKey === 'world' && number > 40) {
                subjectName = '세계문학2';
              } else {
                subjectName = subjectMap[subjectKey] || subjectKey;
              }
            }

            // 시리즈 추출
            let series = 'BRAIN업';
            if (unitCode.includes('on_')) series = 'BRAIN온';
            else if (unitCode.includes('fit_')) series = 'BRAIN핏';
            else if (unitCode.includes('deep_')) series = 'BRAIN딥';

            // 분야
            const field = fieldMap[subjectKey] || '기타';

            // 단원명 (UNIT_TITLES에서 풀네임 가져오기)
            // 과목명 + 번호 형태로 기본값 생성
            let shortName = unitCode;
            if (unitCode && unitCode.includes('_')) {
              const parts = unitCode.split('_');
              let sk = parts[0];
              let ns = parts[1];
              if ((parts[0] === 'fit' || parts[0] === 'deep' || parts[0] === 'on') && parts.length >= 3) {
                sk = parts[1];
                ns = parts[2];
              }
              const subject = subjectMap[sk] || sk;
              let number = ns ? parseInt(ns, 10) : 0;
              shortName = subject + ' ' + number;
            }

            // UNIT_TITLES에서 풀네임 가져오기, 없으면 shortName 사용
            const fullTitle = UNIT_TITLES[unitCode];
            let unitName = fullTitle ? (shortName + ' ' + fullTitle) : shortName;

            // 레이더 평균 점수 계산 (종합 학습 기록과 동일)
            const r = log.radar || {};
            const scores = [r.literal, r.structural, r.lexical, r.inferential, r.critical].filter(s => s != null);
            const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

            // 등급 결정 (종합 학습 기록과 동일)
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

            // 어휘 점수 - UNIT_PROGRESS_MAP에서 vocabState 가져오기
            // 1차: 원본 unitCode로 조회 (on_bio_01, fit_bio_01 등)
            // 2차 fallback: 접두어 제거 버전으로 조회 (bio_01 등)
            let unitProgress = UNIT_PROGRESS_MAP[unitCode] || {};

            // fallback: 접두어 제거 버전으로 재조회
            if (!unitProgress.vocabState) {
              let normalizedUnitCode = unitCode;
              if (unitCode.startsWith('fit_')) normalizedUnitCode = unitCode.substring(4);
              else if (unitCode.startsWith('deep_')) normalizedUnitCode = unitCode.substring(5);
              else if (unitCode.startsWith('on_')) normalizedUnitCode = unitCode.substring(3);
              unitProgress = UNIT_PROGRESS_MAP[normalizedUnitCode] || {};
            }

            // vocabState에서 직접 점수 계산
            let vocabScorePercent = 0;
            const vocabState = unitProgress.vocabState;
            if (vocabState && vocabState.vocabData && Array.isArray(vocabState.vocabData)) {
              const total = vocabState.vocabData.length;
              const correct = vocabState.vocabData.filter(v => v.isCorrect).length;
              if (total > 0) {
                vocabScorePercent = Math.round((correct / total) * 100);
              }
            } else {
              // fallback: reportState.vocabScoreRatio 사용
              const reportState = unitProgress.reportState || {};
              const vocabScoreRatio = reportState.vocabScoreRatio || 0;
              vocabScorePercent = Math.round(vocabScoreRatio * 100);
            }
            const vocabScoreDisplay = vocabScorePercent > 0 ? vocabScorePercent + '점' : '-';

            // 어휘 학습 페이지 URL 생성
            const folder = folderMap[subjectKey] || 'science';
            const vocabPageUrl = '/BRAINUP/' + folder + '/' + unitCode + '.html?tab=vocab';

            tableHtml += '<tr>';
            tableHtml += '<td>' + (idx + 1) + '</td>';
            tableHtml += '<td>' + series + '</td>';
            tableHtml += '<td>' + field + '</td>';
            tableHtml += '<td>' + unitName + '</td>';
            tableHtml += '<td><span class="badge ' + badgeClass + '">' + badgeText + '</span></td>';
            tableHtml += '<td>' + avgScore.toFixed(1) + '</td>';
            // 어휘 점수 클릭 시 해당 단원 어휘 페이지로 이동
            if (vocabScorePercent > 0) {
              tableHtml += '<td><span class="vocab-score-link" onclick="goToVocabPage(' + "'" + vocabPageUrl + "'" + ')" style="cursor:pointer; color:#3b82f6 !important; font-weight:600;">' + vocabScoreDisplay + '</span></td>';
            } else {
              tableHtml += '<td>' + vocabScoreDisplay + '</td>';
            }
            tableHtml += '</tr>';
          });

          tableHtml += '</tbody></table>';
          tableContainer.innerHTML = tableHtml;

          // 레이더 카드 생성 (단원별 문해력 레이더 차트와 동일 스타일)
          radarWrap.innerHTML = '';

          todayLogs.forEach((log, idx) => {
            const unitCode = log.unit || '';
            const r = log.radar || {};

            // 점수 계산
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

            // 단원명 (짧은 형태)
            let shortName = unitCode;
            if (unitCode && unitCode.includes('_')) {
              const parts = unitCode.split('_');
              let sk = parts[0];
              let ns = parts[1];
              if ((parts[0] === 'fit' || parts[0] === 'deep' || parts[0] === 'on') && parts.length >= 3) {
                sk = parts[1];
                ns = parts[2];
              }
              const subject = subjectMap[sk] || sk;
              let number = ns ? parseInt(ns, 10) : 0;
              shortName = subject + ' ' + number;
            }

            // 카드 생성 (radar-card 클래스 사용)
            const card = document.createElement('div');
            card.className = 'radar-card';
            // AI 피드백용 레이더 점수 데이터 저장
            card.setAttribute('data-radar', JSON.stringify({
              literal: r.literal || 0,
              structural: r.structural || 0,
              lexical: r.lexical || 0,
              inferential: r.inferential || 0,
              critical: r.critical || 0
            }));

            const header = document.createElement('div');
            header.className = 'radar-card-header';

            const title = document.createElement('div');
            title.className = 'radar-card-title';
            title.textContent = shortName;

            const time = document.createElement('div');
            time.className = 'radar-card-time';
            time.innerHTML = log.timestamp ? new Date(log.timestamp).toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'}) : '-';

            const badge = document.createElement('div');
            badge.className = 'score-badge ' + badgeClass;
            badge.textContent = badgeText;

            header.appendChild(title);
            header.appendChild(time);
            header.appendChild(badge);
            card.appendChild(header);

            const canvas = document.createElement('canvas');
            canvas.id = 'todayRadar' + idx;
            canvas.width = 130;
            canvas.height = 130;
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

            // 카드 클릭 시 해당 단원 페이지로 이동
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
              if (unitCode) {
                const parts = unitCode.split('_');
                let subject = parts[0] || '';
                if ((subject === 'fit' || subject === 'deep' || subject === 'on') && parts.length >= 3) {
                  subject = parts[1];
                }
                const folderMap = {
                  'geo': 'social', 'soc': 'social', 'law': 'social', 'pol': 'social',
                  'bio': 'science', 'earth': 'science', 'physics': 'science', 'chem': 'science',
                  'modern': 'korlit', 'classic': 'korlit',
                  'world': 'worldlit', 'world1': 'worldlit', 'world2': 'worldlit',
                  'people': 'person', 'people1': 'person', 'people2': 'person', 'person1': 'person', 'person2': 'person'
                };
                const folder = folderMap[subject] || 'social';
                const unitUrl = '/BRAINUP/' + folder + '/' + unitCode + '.html';
                window.location.href = unitUrl;
              }
            });

            radarWrap.appendChild(card);

            // Chart.js 레이더 차트 생성
            new Chart(canvas.getContext('2d'), {
              type: 'radar',
              data: {
                labels: ['핵심 이해력', '구조 파악력', '어휘 맥락력', '추론·통합력', '비판·적용력'],
                datasets: [{
                  data: scores,
                  backgroundColor: 'rgba(102, 126, 234, 0.2)',
                  borderColor: '#667eea',
                  borderWidth: 2,
                  pointBackgroundColor: '#667eea',
                  pointBorderColor: '#fff',
                  pointBorderWidth: 1,
                  pointRadius: 3
                }]
              },
              options: {
                responsive: false,
                layout: {
                  padding: {
                    top: 10,
                    bottom: 5,
                    left: 5,
                    right: 5
                  }
                },
                plugins: {
                  legend: { display: false },
                  datalabels: { display: false }
                },
                scales: {
                  r: {
                    suggestedMin: 0,
                    suggestedMax: 10,
                    ticks: {
                      display: false,
                      stepSize: 2
                    },
                    grid: {
                      color: 'rgba(102, 126, 234, 0.1)'
                    },
                    angleLines: {
                      color: 'rgba(102, 126, 234, 0.1)'
                    },
                    pointLabels: {
                      display: false
                    }
                  }
                }
              }
            });
          });
        }

        // 페이지 로드 시 Today 섹션 렌더링
        renderTodaySection();

        // 지수별 추이 그래프 렌더링
        renderIndexTrendChart();

        // 날짜별 과목 평균 평점 막대 그래프 렌더링
        renderSubjectBarChart();

        // ===== 날짜별 어휘 점수 가로 막대 그래프 렌더링 =====
        let vocabScoreCurrentDate = new Date(); // 현재 선택된 날짜

        // 과목별 색상 설정 (기존 subjectConfig 재사용)
        const vocabSubjectConfig = [
          { key: 'bio', name: '생물', color: '#4CAF50' },
          { key: 'earth', name: '지구과학', color: '#2196F3' },
          { key: 'physics', name: '물리', color: '#9C27B0' },
          { key: 'chem', name: '화학', color: '#FF5722' },
          { key: 'soc', name: '사회문화', color: '#E91E63' },
          { key: 'geo', name: '지리', color: '#00BCD4' },
          { key: 'law', name: '법', color: '#795548' },
          { key: 'pol', name: '정치경제', color: '#607D8B' },
          { key: 'classic', name: '고전소설', color: '#8BC34A' },
          { key: 'modern', name: '현대문학', color: '#FFC107' },
          { key: 'world1', name: '세계문학1', color: '#FF9800' },
          { key: 'world2', name: '세계문학2', color: '#F44336' },
          { key: 'person1', name: '한국인물', color: '#673AB7' },
          { key: 'person2', name: '세계인물', color: '#3F51B5' },
          { key: 'people1', name: '한국인물', color: '#673AB7' },
          { key: 'people2', name: '세계인물', color: '#3F51B5' }
        ];

        function getVocabSubjectColor(unitCode) {
          if (!unitCode) return '#888';
          const parts = unitCode.split('_');
          let subjectKey = parts[0];

          // fit_, deep_, on_ 접두사 처리
          if ((parts[0] === 'fit' || parts[0] === 'deep' || parts[0] === 'on') && parts.length >= 3) {
            subjectKey = parts[1];
          }

          const found = vocabSubjectConfig.find(s => s.key === subjectKey);
          return found ? found.color : '#888';
        }

        function getVocabSubjectName(unitCode) {
          if (!unitCode) return '기타';
          const parts = unitCode.split('_');
          let subjectKey = parts[0];
          let unitNum = '';

          // fit_, deep_, on_ 접두사 처리
          if ((parts[0] === 'fit' || parts[0] === 'deep' || parts[0] === 'on') && parts.length >= 3) {
            subjectKey = parts[1];
            unitNum = parts[2] || '';
          } else {
            unitNum = parts[1] || '';
          }

          const found = vocabSubjectConfig.find(s => s.key === subjectKey);
          const subjectName = found ? found.name : subjectKey;
          return unitNum ? subjectName + ' ' + unitNum : subjectName;
        }

        function renderVocabScoreChart() {
          const section = document.getElementById('vocabScoreSection');
          const container = document.getElementById('vocabScoreChartContainer');
          const dateDisplay = document.getElementById('vocabScoreDate');

          if (!section || !container) return;

          // 날짜 표시 업데이트
          const dateStr = vocabScoreCurrentDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
          });
          dateDisplay.textContent = dateStr;

          // 해당 날짜의 학습 기록 필터링 (현재 시리즈만, 어휘점수가 있는 것만)
          const targetDateStr = toKSTDateString(vocabScoreCurrentDate);
          const dayLogs = allLogs.filter(log => {
            if (!log.timestamp || log.deleted) return false;
            // 현재 시리즈만 필터링 (테이블과 동일하게)
            if (!matchesSeries(log.unit, currentSeries)) return false;
            const logDateStr = toKSTDateString(new Date(log.timestamp));
            return logDateStr === targetDateStr;
          });

          // 어휘점수가 있는 로그만 필터
          const vocabLogs = dayLogs.filter(log => {
            // 테이블 행에서 어휘점수를 찾아야 함 - allLogs에 vocabularyScore가 있는지 확인
            // 실제로는 테이블에서 표시되는 어휘점수를 사용
            return log.unit && typeof log.vocabularyScore !== 'undefined';
          });

          // 데이터가 없으면 빈 상태 표시
          if (dayLogs.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.6); padding: 40px;">해당 날짜의 학습 기록이 없습니다.</div>';
            section.style.display = 'block';
            return;
          }

          // 단원별 어휘 점수 데이터 수집 (UNIT_PROGRESS_MAP 활용)
          const vocabData = [];

          dayLogs.forEach(log => {
            if (!log.unit) return;

            const unitCode = log.unit;
            // 단원 코드 정규화 (fit_, deep_, on_ 접두사 제거)
            let normalizedUnitCode = unitCode;
            const parts = unitCode.split('_');
            if ((parts[0] === 'fit' || parts[0] === 'deep' || parts[0] === 'on') && parts.length >= 3) {
              normalizedUnitCode = parts[1] + '_' + parts[2];
            }

            // UNIT_PROGRESS_MAP에서 어휘 점수 계산
            let vocabScorePercent = 0;
            const unitProgress = UNIT_PROGRESS_MAP[unitCode] || UNIT_PROGRESS_MAP[normalizedUnitCode] || {};
            const vocabState = unitProgress.vocabState;

            if (vocabState && vocabState.vocabData && Array.isArray(vocabState.vocabData)) {
              const total = vocabState.vocabData.length;
              const correct = vocabState.vocabData.filter(v => v.isCorrect).length;
              if (total > 0) {
                vocabScorePercent = Math.round((correct / total) * 100);
              }
            } else {
              // fallback: reportState.vocabScoreRatio 사용
              const reportState = unitProgress.reportState || {};
              const vocabScoreRatio = reportState.vocabScoreRatio || 0;
              vocabScorePercent = Math.round(vocabScoreRatio * 100);
            }

            // 어휘 점수가 있는 경우만 추가
            if (vocabScorePercent > 0) {
              vocabData.push({
                unit: unitCode,
                name: getVocabSubjectName(unitCode),
                score: vocabScorePercent,
                color: getVocabSubjectColor(unitCode)
              });
            }
          });

          if (vocabData.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.6); padding: 40px;">해당 날짜의 어휘 점수 기록이 없습니다.</div>';
            section.style.display = 'block';
            return;
          }

          // 과목별 평균 점수 설정
          const subjectAvgScores = {
            'bio': 78,        // 생물
            'earth': 75,      // 지구과학
            'physics': 63,    // 물리
            'chem': 68,       // 화학
            'soc': 82,        // 사회문화
            'geo': 79,        // 지리
            'law': 72,        // 법
            'pol': 74,        // 정치경제
            'classic': 78,    // 고전소설
            'modern': 84,     // 현대소설
            'world': 85,      // 세계문학1
            'world1': 85,     // 세계문학1
            'world2': 84,     // 세계문학2
            'people': 80,     // 한국인물
            'people1': 80,    // 한국인물
            'people2': 80,    // 세계인물
            'person1': 80,    // 한국인물
            'person2': 80     // 세계인물
          };

          // 단원 코드에서 과목 키 추출하는 함수
          function getSubjectKeyFromUnit(unitCode) {
            if (!unitCode || !unitCode.includes('_')) return null;
            const parts = unitCode.split('_');
            let subjectKey = parts[0];
            let numStr = parts[1];
            if ((parts[0] === 'fit' || parts[0] === 'deep' || parts[0] === 'on') && parts.length >= 3) {
              subjectKey = parts[1];
              numStr = parts[2];
            }
            // world_41~80은 세계문학2
            if (subjectKey === 'world') {
              const num = parseInt(numStr, 10) || 0;
              if (num > 40) return 'world2';
            }
            return subjectKey;
          }

          // folderMap for URL generation
          const folderMap = {
            'bio': 'science', 'earth': 'science', 'physics': 'science', 'chem': 'science',
            'geo': 'social', 'soc': 'social', 'law': 'social', 'pol': 'social',
            'modern': 'korlit', 'classic': 'korlit',
            'world': 'worldlit', 'world1': 'worldlit', 'world2': 'worldlit',
            'people': 'person', 'people1': 'person', 'people2': 'person', 'person1': 'person', 'person2': 'person'
          };

          // 가로 막대 그래프 HTML 생성
          let html = '<div class="vocab-score-bars">';

          vocabData.forEach((item, idx) => {
            const barWidth = Math.min(100, item.score); // 최대 100%
            // 과목별 평균 점수 가져오기
            const subjectKey = getSubjectKeyFromUnit(item.unit);
            const avgScore = subjectAvgScores[subjectKey] || 75;
            const avgPosition = avgScore; // 평균선 위치 (%)
            const isAboveAvg = item.score >= avgScore;
            // 평균 기준 색상: 이상=초록, 미만=주황
            const barColor = isAboveAvg ? '#4CAF50' : '#FF9800';

            // 어휘 학습 페이지 URL 생성
            const folder = folderMap[subjectKey] || 'science';
            const vocabPageUrl = '/BRAINUP/' + folder + '/' + item.unit + '.html?tab=vocab';

            html += '<div class="vocab-bar-row" data-url="' + vocabPageUrl + '" style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: all 0.3s ease;">';

            // 단원명 (좌측)
            html += '<div class="vocab-bar-label" style="width: 100px; font-size: 12px; color: #fff; text-align: right; padding-right: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + item.name + '</div>';

            // 막대 그래프 영역
            html += '<div class="vocab-bar-container" style="flex: 1; height: 24px; background: rgba(255,255,255,0.1); border-radius: 4px; position: relative; overflow: visible;">';

            // 실제 막대 (평균 기준 색상 적용)
            html += '<div class="vocab-bar" style="height: 100%; width: ' + barWidth + '%; background: ' + barColor + '; border-radius: 4px; transition: all 0.3s ease;"></div>';

            // 평균선 (과목별 평균 위치)
            html += '<div class="vocab-avg-line" style="position: absolute; left: ' + avgPosition + '%; top: -4px; bottom: -4px; width: 2px; background: #fff; opacity: 0.8;"></div>';

            html += '</div>';

            // 점수 표시 (우측) - 과목별 평균 표시
            html += '<div class="vocab-bar-score" style="width: 80px; display: flex; align-items: center; justify-content: flex-start; padding-left: 10px;">';
            html += '<span style="font-size: 14px; font-weight: 600; color: ' + (isAboveAvg ? '#4CAF50' : '#FF9800') + ';">' + item.score + '점</span>';
            html += '<span style="font-size: 11px; color: rgba(255,255,255,0.5); margin-left: 6px;">/ ' + avgScore + '</span>';
            html += '</div>';

            html += '</div>';
          });

          html += '</div>';

          // 범례 추가
          html += '<div style="display: flex; justify-content: center; margin-top: 15px; gap: 8px; flex-wrap: wrap;">';
          html += '<div style="display: flex; align-items: center; gap: 4px;"><div style="width: 16px; height: 2px; background: #fff;"></div><span style="font-size: 11px; color: rgba(255,255,255,0.7);">과목별 평균</span></div>';
          html += '<div style="display: flex; align-items: center; gap: 4px;"><span style="color: #4CAF50; font-size: 11px;">●</span><span style="font-size: 11px; color: rgba(255,255,255,0.7);">평균 이상</span></div>';
          html += '<div style="display: flex; align-items: center; gap: 4px;"><span style="color: #FF9800; font-size: 11px;">●</span><span style="font-size: 11px; color: rgba(255,255,255,0.7);">평균 미만</span></div>';
          html += '</div>';

          container.innerHTML = html;
          section.style.display = 'block';

          // 막대 그래프 호버 효과 및 클릭 이벤트 추가
          const barRows = container.querySelectorAll('.vocab-bar-row');
          barRows.forEach(row => {
            // 마우스 호버 효과 (빛 강조)
            row.addEventListener('mouseenter', function() {
              this.style.background = 'rgba(255, 255, 255, 0.15)';
              this.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1)';
              this.style.transform = 'scale(1.02)';
              const bar = this.querySelector('.vocab-bar');
              if (bar) {
                bar.style.boxShadow = '0 0 12px 2px ' + (bar.style.background.includes('76, 175, 80') || bar.style.background === '#4CAF50' ? 'rgba(76, 175, 80, 0.6)' : 'rgba(255, 152, 0, 0.6)');
                bar.style.filter = 'brightness(1.2)';
              }
            });

            row.addEventListener('mouseleave', function() {
              this.style.background = 'transparent';
              this.style.boxShadow = 'none';
              this.style.transform = 'scale(1)';
              const bar = this.querySelector('.vocab-bar');
              if (bar) {
                bar.style.boxShadow = 'none';
                bar.style.filter = 'brightness(1)';
              }
            });

            // 클릭 시 어휘 학습 페이지로 이동
            row.addEventListener('click', function() {
              const url = this.getAttribute('data-url');
              if (url) {
                window.location.href = url;
              }
            });
          });
        }

        // 어휘 점수 날짜 네비게이션
        document.getElementById('vocabScorePrev')?.addEventListener('click', function() {
          vocabScoreCurrentDate.setDate(vocabScoreCurrentDate.getDate() - 1);
          renderVocabScoreChart();
        });

        document.getElementById('vocabScoreNext')?.addEventListener('click', function() {
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          const nextDate = new Date(vocabScoreCurrentDate);
          nextDate.setDate(nextDate.getDate() + 1);

          if (nextDate <= today) {
            vocabScoreCurrentDate = nextDate;
            renderVocabScoreChart();
          }
        });

        // 어휘 점수 차트 초기 렌더링은 allLogs 초기화 후에 수행
        // renderVocabScoreChart(); // allLogs 초기화 후 호출됨

        // ===== 창의활동 내역 기능 =====
        let creativeCurrentDate = new Date();
        let creativeDataCache = null;
        const pageGrade = '${grade}';
        const pageName = '${name}';

        // 단원 코드를 단원명으로 변환
        function getUnitDisplayName(unitCode) {
          if (!unitCode || !unitCode.includes('_')) return unitCode;
          const parts = unitCode.split('_');
          let subjectKey = parts[0];
          let number = parts[1] ? parts[1].replace(/^0+/, '') : '';

          // on_bio_01, fit_geo_01, deep_modern_01 형식 처리
          if ((parts[0] === 'on' || parts[0] === 'fit' || parts[0] === 'deep') && parts.length >= 3) {
            subjectKey = parts[1];
            number = parts[2] ? parts[2].replace(/^0+/, '') : '';
          }

          const subjectNames = {
            'bio': '생명과학', 'earth': '지구과학', 'physics': '물리학', 'chem': '화학',
            'geo': '지리', 'soc': '사회', 'law': '법', 'pol': '정치',
            'modern': '현대문학', 'classic': '고전문학',
            'world': '세계문학', 'world1': '세계문학1', 'world2': '세계문학2',
            'people': '인물', 'people1': '인물1', 'people2': '인물2', 'person1': '인물1', 'person2': '인물2'
          };
          const subject = subjectNames[subjectKey] || subjectKey;
          return subject + ' ' + number;
        }

        // 창의활동 테이블 렌더링
        async function renderCreativeTable() {
          const dateLabel = document.getElementById('creativeDate');
          const tbody = document.getElementById('creativeTableBody');
          if (!dateLabel || !tbody) {
            console.log('[renderCreativeTable] 요소 없음');
            return;
          }

          console.log('[renderCreativeTable] 시작:', pageGrade, pageName);

          // 날짜 표시
          const year = creativeCurrentDate.getFullYear();
          const month = creativeCurrentDate.getMonth() + 1;
          const date = creativeCurrentDate.getDate();
          const days = ['일', '월', '화', '수', '목', '금', '토'];
          const dayName = days[creativeCurrentDate.getDay()];
          dateLabel.textContent = year + '년 ' + month + '월 ' + date + '일 ' + dayName;

          // 항상 서버에서 최신 데이터 가져오기
          try {
            console.log('[renderCreativeTable] API 호출 중...');
            const res = await fetch('/api/user-progress/creative-activities?grade=' + encodeURIComponent(pageGrade) + '&name=' + encodeURIComponent(pageName));
            if (res.ok) {
              const json = await res.json();
              creativeDataCache = json.data || [];
              console.log('[renderCreativeTable] 데이터 수신:', creativeDataCache.length + '건');
            } else {
              console.log('[renderCreativeTable] API 응답 오류:', res.status);
              creativeDataCache = [];
            }
          } catch (e) {
            console.error('[renderCreativeTable] 창의활동 데이터 조회 실패:', e);
            creativeDataCache = [];
          }

          // unit code로 시리즈 판단하는 함수
          function getSeriesFromUnit(unitCode) {
            if (!unitCode) return 'BRAIN업';
            if (unitCode.startsWith('on_')) return 'BRAIN온';
            if (unitCode.startsWith('fit_')) return 'BRAIN핏';
            if (unitCode.startsWith('deep_')) return 'BRAIN딥';
            return 'BRAIN업'; // 접두사 없으면 브레인업
          }

          // 선택한 날짜에 해당하는 데이터 필터링
          const selectedDateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(date).padStart(2, '0');
          const filteredData = creativeDataCache.filter(item => {
            if (!item.submittedAt) return false;
            const itemDate = new Date(item.submittedAt);
            const itemDateStr = itemDate.getFullYear() + '-' + String(itemDate.getMonth() + 1).padStart(2, '0') + '-' + String(itemDate.getDate()).padStart(2, '0');
            if (itemDateStr !== selectedDateStr) return false;

            // 시리즈 필터링 (currentSelectedSeries가 'all'이 아니면 해당 시리즈만)
            if (currentSelectedSeries && currentSelectedSeries !== 'all') {
              const itemSeries = getSeriesFromUnit(item.unit);
              return itemSeries === currentSelectedSeries;
            }
            return true;
          });

          // 테이블 렌더링
          if (filteredData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="creative-empty">해당 날짜에 제출된 창의활동이 없습니다.</td></tr>';
            return;
          }

          let html = '';
          filteredData.forEach((item, index) => {
            const unitName = getUnitDisplayName(item.unit);
            const topic = item.topic || '자유 글쓰기';
            const charCount = item.text ? item.text.length : 0;
            const textContent = item.text || '내용 없음';
            const rowId = 'creative-row-' + index;
            const contentId = 'creative-content-' + index;

            // 메인 행
            html += '<tr id="' + rowId + '" class="creative-row" data-index="' + index + '" onclick="toggleCreativeContent(' + index + ')">';
            html += '<td class="creative-num"><span class="creative-arrow" id="arrow-' + index + '">▶</span>' + (index + 1) + '</td>';
            html += '<td class="creative-unit">' + unitName + '</td>';
            html += '<td class="creative-topic">' + topic + '</td>';
            html += '<td><div class="creative-chars">' + charCount.toLocaleString() + '</div></td>';
            html += '</tr>';

            // 드롭다운 내용 행 (처음엔 숨김)
            html += '<tr id="' + contentId + '" class="creative-content-row" style="display: none;">';
            html += '<td colspan="4">';
            html += '<div class="creative-content-box">';
            html += '<div class="creative-content-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/></svg>작성 내용</div>';
            html += '<div class="creative-content-text">' + textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
            html += '</div>';
            html += '</td>';
            html += '</tr>';
          });

          tbody.innerHTML = html;
        }

        // 창의활동 드롭다운 토글 함수 (전역)
        window.toggleCreativeContent = function(index) {
          const contentRow = document.getElementById('creative-content-' + index);
          const arrow = document.getElementById('arrow-' + index);

          if (!contentRow || !arrow) return;

          const isVisible = contentRow.style.display !== 'none';

          if (isVisible) {
            // 닫기
            contentRow.style.display = 'none';
            arrow.style.transform = 'rotate(0deg)';
          } else {
            // 열기
            contentRow.style.display = 'table-row';
            arrow.style.transform = 'rotate(90deg)';
          }
        };

        // 창의활동 날짜 네비게이션
        document.getElementById('creativePrev')?.addEventListener('click', function() {
          creativeCurrentDate.setDate(creativeCurrentDate.getDate() - 1);
          renderCreativeTable();
        });

        document.getElementById('creativeNext')?.addEventListener('click', function() {
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          const nextDate = new Date(creativeCurrentDate);
          nextDate.setDate(nextDate.getDate() + 1);

          if (nextDate <= today) {
            creativeCurrentDate = nextDate;
            renderCreativeTable();
          }
        });

        // 초기 렌더링
        renderCreativeTable();

        // ===== Today 레이더 슬라이더 기능 =====
        let todayRadarSlideIndex = 0;

        function slideTodayRadar(direction) {
          const wrap = document.getElementById('today-radar-wrap');
          const viewport = document.querySelector('.today-radar-viewport');
          const cards = wrap.querySelectorAll('.radar-card');
          const prevBtn = document.getElementById('todayRadarPrev');
          const nextBtn = document.getElementById('todayRadarNext');

          if (cards.length === 0) return;

          const cardWidth = 180 + 15; // 카드 너비 + gap
          const viewportWidth = viewport.offsetWidth;
          const visibleCards = Math.floor(viewportWidth / cardWidth);
          const maxSlide = Math.max(0, cards.length - visibleCards);

          todayRadarSlideIndex += direction;
          todayRadarSlideIndex = Math.max(0, Math.min(todayRadarSlideIndex, maxSlide));

          const translateX = todayRadarSlideIndex * cardWidth;
          wrap.style.transform = 'translateX(-' + translateX + 'px)';

          // 버튼 상태 업데이트
          prevBtn.disabled = todayRadarSlideIndex === 0;
          nextBtn.disabled = todayRadarSlideIndex >= maxSlide;
        }

        function updateSliderButtons() {
          const wrap = document.getElementById('today-radar-wrap');
          const viewport = document.querySelector('.today-radar-viewport');
          const cards = wrap.querySelectorAll('.radar-card');
          const prevBtn = document.getElementById('todayRadarPrev');
          const nextBtn = document.getElementById('todayRadarNext');

          if (cards.length === 0) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
          }

          const cardWidth = 180 + 15;
          const viewportWidth = viewport.offsetWidth;
          const visibleCards = Math.floor(viewportWidth / cardWidth);
          const maxSlide = Math.max(0, cards.length - visibleCards);

          // 카드가 뷰포트 안에 모두 들어가면 화살표 숨김
          if (cards.length <= visibleCards) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
          } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            prevBtn.disabled = todayRadarSlideIndex === 0;
            nextBtn.disabled = todayRadarSlideIndex >= maxSlide;
          }
        }

        // 렌더링 후 슬라이더 버튼 상태 업데이트
        setTimeout(updateSliderButtons, 100);
        window.addEventListener('resize', updateSliderButtons);

        // ===== 전체 보기 토글 기능 =====
        let isTodayRadarExpanded = false;
        let todayGridCharts = [];

        function toggleTodayRadarView() {
          const slider = document.getElementById('todayRadarSlider');
          const grid = document.getElementById('todayRadarGrid');
          const toggleBtn = document.getElementById('todayRadarToggle');
          const toggleText = document.getElementById('todayRadarToggleText');
          const toggleWrap = document.getElementById('todayRadarToggleWrap');

          isTodayRadarExpanded = !isTodayRadarExpanded;

          if (isTodayRadarExpanded) {
            // 전체 보기 모드
            slider.style.display = 'none';
            grid.style.display = 'flex';
            toggleText.textContent = '접기';
            toggleBtn.classList.add('expanded');

            // 그리드에 차트 렌더링
            renderTodayRadarGrid();
          } else {
            // 슬라이더 모드
            slider.style.display = 'flex';
            grid.style.display = 'none';
            toggleText.textContent = '전체 보기';
            toggleBtn.classList.remove('expanded');

            // 그리드 차트 정리
            todayGridCharts.forEach(chart => chart.destroy());
            todayGridCharts = [];
            grid.innerHTML = '';
          }
        }

        function renderTodayRadarGrid() {
          const grid = document.getElementById('todayRadarGrid');
          grid.innerHTML = '';
          todayGridCharts = [];

          const todayStr = new Date().toISOString().split('T')[0];
          const todayLogs = logsForChart.filter(log => {
            // 현재 시리즈만 필터링 (동적)
            if (!matchesSeries(log.unit, currentSeries)) return false;
            const logDate = log.timestamp || log.createdAt;
            if (!logDate) return false;
            return new Date(logDate).toISOString().split('T')[0] === todayStr;
          });

          if (todayLogs.length === 0) {
            grid.innerHTML = '<div class="today-empty-cards">오늘 완료한 학습 기록이 없습니다.</div>';
            return;
          }

          const subjectMap = { 'geo': '지리', 'bio': '생물', 'earth': '지구과학', 'physics': '물리', 'chem': '화학', 'soc': '사회문화', 'law': '법', 'pol': '정치경제', 'modern': '현대문학', 'classic': '고전문학', 'world': '세계문학1', 'world1': '세계문학1', 'world2': '세계문학2', 'people': '한국인물', 'people1': '한국인물', 'people2': '세계인물', 'person1': '한국인물', 'person2': '세계인물' };

          todayLogs.forEach((log, idx) => {
            const unitCode = log.unit || '';
            const r = log.radar || {};

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

            let shortName = unitCode;
            if (unitCode && unitCode.includes('_')) {
              const parts = unitCode.split('_');
              let sk = parts[0];
              let ns = parts[1];
              if ((parts[0] === 'fit' || parts[0] === 'deep' || parts[0] === 'on') && parts.length >= 3) {
                sk = parts[1];
                ns = parts[2];
              }
              const subject = subjectMap[sk] || sk;
              let number = ns ? parseInt(ns, 10) : 0;
              shortName = subject + ' ' + number;
            }

            const card = document.createElement('div');
            card.className = 'radar-card';

            const header = document.createElement('div');
            header.className = 'radar-card-header';

            const title = document.createElement('div');
            title.className = 'radar-card-title';
            title.textContent = shortName;

            const time = document.createElement('div');
            time.className = 'radar-card-time';
            time.innerHTML = log.timestamp ? new Date(log.timestamp).toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'}) : '-';

            const badge = document.createElement('div');
            badge.className = 'score-badge ' + badgeClass;
            badge.textContent = badgeText;

            header.appendChild(title);
            header.appendChild(time);
            header.appendChild(badge);
            card.appendChild(header);

            const canvas = document.createElement('canvas');
            canvas.id = 'gridRadar' + idx;
            canvas.width = 130;
            canvas.height = 130;
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

            // 카드 클릭 시 해당 단원 페이지로 이동
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
              if (unitCode) {
                const parts = unitCode.split('_');
                let subject = parts[0] || '';
                if ((subject === 'fit' || subject === 'deep' || subject === 'on') && parts.length >= 3) {
                  subject = parts[1];
                }
                const folderMap = {
                  'geo': 'social', 'soc': 'social', 'law': 'social', 'pol': 'social',
                  'bio': 'science', 'earth': 'science', 'physics': 'science', 'chem': 'science',
                  'modern': 'korlit', 'classic': 'korlit',
                  'world': 'worldlit', 'world1': 'worldlit', 'world2': 'worldlit',
                  'people': 'person', 'people1': 'person', 'people2': 'person', 'person1': 'person', 'person2': 'person'
                };
                const folder = folderMap[subject] || 'social';
                const unitUrl = '/BRAINUP/' + folder + '/' + unitCode + '.html';
                window.location.href = unitUrl;
              }
            });

            grid.appendChild(card);

            const chart = new Chart(canvas.getContext('2d'), {
              type: 'radar',
              data: {
                labels: ['핵심 이해력', '구조 파악력', '어휘 맥락력', '추론·통합력', '비판·적용력'],
                datasets: [{
                  data: scores,
                  backgroundColor: 'rgba(102, 126, 234, 0.2)',
                  borderColor: '#667eea',
                  borderWidth: 2,
                  pointBackgroundColor: '#667eea',
                  pointBorderColor: '#fff',
                  pointBorderWidth: 1,
                  pointRadius: 3
                }]
              },
              options: {
                responsive: false,
                plugins: {
                  legend: { display: false },
                  datalabels: { display: false }
                },
                scales: {
                  r: {
                    suggestedMin: 0,
                    suggestedMax: 10,
                    ticks: { display: false, stepSize: 2 },
                    grid: { color: 'rgba(102, 126, 234, 0.1)' },
                    angleLines: { color: 'rgba(102, 126, 234, 0.1)' },
                    pointLabels: { display: false }
                  }
                }
              }
            });
            todayGridCharts.push(chart);
          });
        }

        // ===== 진행률 표시를 위한 헬퍼 함수 및 데이터 =====
        // 과목 코드 → 총 단원 수 매핑
        const subjectUnitCounts = {
          'bio': 20, 'earth': 20, 'physics': 20, 'chem': 20,
          'geo': 20, 'soc': 20, 'law': 20, 'pol': 20,
          'modern': 40, 'classic': 40,
          'world': 40, 'world1': 40, 'world2': 40,
          'people': 40, 'people1': 40, 'people2': 40, 'person1': 40, 'person2': 40
        };

        // 분야별 총 단원 수
        const fieldUnitCounts = {
          '과학분야': 80,
          '사회분야': 80,
          '한국문학': 80,
          '세계문학': 80,
          '인물분야': 80
        };

        // 시리즈 총 단원 수
        const seriesTotalUnits = 400;

        // 단원 코드 정규화 함수 (world1_XX, world2_XX, people1_XX, people2_XX가 표준 형식)
        function normalizeUnitCode(unit) {
          // fit_ 접두어 제거: fit_bio_01 -> bio_01
          if (unit.startsWith('fit_')) {
            unit = unit.substring(4);
          }
          // deep_ 접두어 제거: deep_bio_01 -> bio_01
          if (unit.startsWith('deep_')) {
            unit = unit.substring(5);
          }
          // on_ 접두어 제거: on_bio_01 -> bio_01
          if (unit.startsWith('on_')) {
            unit = unit.substring(3);
          }
          // world1_XX, world2_XX는 이미 표준 형식
          if (unit.startsWith('world1_') || unit.startsWith('world2_')) {
            return unit;
          }
          // people1_XX, people2_XX는 이미 표준 형식
          if (unit.startsWith('people1_') || unit.startsWith('people2_')) {
            return unit;
          }
          // 레거시: world_01~40 -> world1_XX, world_41~80 -> world2_XX
          if (unit.startsWith('world_')) {
            const numMatch = unit.match(/world_([0-9]+)$/);
            if (numMatch) {
              const num = parseInt(numMatch[1]);
              if (num >= 1 && num <= 40) {
                return 'world1_' + String(num).padStart(2, '0');
              } else if (num >= 41 && num <= 80) {
                return 'world2_' + String(num - 40).padStart(2, '0');
              }
            }
          }
          // 레거시: people_01~40 -> people1_XX, people_41~80 -> people2_XX
          if (unit.startsWith('people_')) {
            const numMatch = unit.match(/people_([0-9]+)$/);
            if (numMatch) {
              const num = parseInt(numMatch[1]);
              if (num >= 1 && num <= 40) {
                return 'people1_' + String(num).padStart(2, '0');
              } else if (num >= 41 && num <= 80) {
                return 'people2_' + String(num - 40).padStart(2, '0');
              }
            }
          }
          return unit;
        }

        // logsForChart에서 완료된 고유 단원 수집 (정규화된 코드 사용)
        const completedUnitsSet = new Set();
        logsForChart.forEach(log => {
          if (log.unit) {
            completedUnitsSet.add(normalizeUnitCode(log.unit));
          }
        });

        // 과목별 완료 개수 계산 (logsForChart 기반)
        function getCompletedCount(subjectCode) {
          let count = 0;
          completedUnitsSet.forEach(unit => {
            // world1, world2, people1, people2는 이제 표준 형식으로 직접 매칭
            if (unit.startsWith(subjectCode + '_')) {
              count++;
            }
          });
          return count;
        }

        // 분야별 완료 개수 계산
        function getFieldCompletedCount(fieldName) {
          const fieldSubjects = {
            '과학분야': ['bio', 'earth', 'physics', 'chem'],
            '사회분야': ['geo', 'soc', 'law', 'pol'],
            '한국문학': ['modern', 'classic'],
            '세계문학': ['world1', 'world2'],
            '인물분야': ['people1', 'people2']
          };
          const subjects = fieldSubjects[fieldName] || [];
          let total = 0;
          subjects.forEach(subjectCode => {
            total += getCompletedCount(subjectCode);
          });
          return total;
        }

        // 시리즈 전체 완료 개수 계산
        function getSeriesCompletedCount() {
          return completedUnitsSet.size;
        }

        // ===== 종합 레이더 차트 생성 =====
        const summaryWrap = document.getElementById('summary-radar-wrap');

        // 과목 코드 → 과목명 매핑
        const subjectNames = {
          'geo': '지리',
          'bio': '생물',
          'earth': '지구과학',
          'physics': '물리',
          'chem': '화학',
          'soc': '사회문화',
          'law': '법',
          'pol': '정치경제',
          'modern': '현대문학',
          'classic': '고전문학',
          'world': '세계문학1',
          'world1': '세계문학1',
          'world2': '세계문학2',
          'people': '한국인물',
          'people1': '한국인물',
          'people2': '세계인물',
          'person1': '한국인물',
          'person2': '세계인물'
        };

        // 과목 코드 → 분야 클래스 매핑
        const subjectToFieldClass = {
          'bio': 'science',
          'earth': 'science',
          'physics': 'science',
          'chem': 'science',
          'geo': 'society',
          'soc': 'society',
          'law': 'society',
          'pol': 'society',
          'modern': 'korean-lit',
          'classic': 'korean-lit',
          'world': 'world-lit',
          'world1': 'world-lit',
          'world2': 'world-lit',
          'people': 'person',
          'people1': 'person',
          'people2': 'person',
          'person1': 'person',
          'person2': 'person'
        };

        // ===== 과목별 종합 레이더 함수 =====
        function renderSubjectRadar(logs) {
          // 기존 카드 제거
          summaryWrap.innerHTML = '';

          // 필터링된 로그에서 완료된 과목별 단원 수 계산
          function getFilteredCompletedCount(subjectCode, filteredLogs) {
            const unitSet = new Set();
            filteredLogs.forEach(log => {
              if (log.unit) {
                let unitCode = log.unit;
                if (unitCode.startsWith('fit_')) unitCode = unitCode.substring(4);
                else if (unitCode.startsWith('deep_')) unitCode = unitCode.substring(5);
                else if (unitCode.startsWith('on_')) unitCode = unitCode.substring(3);
                if (unitCode.startsWith(subjectCode + '_')) {
                  unitSet.add(unitCode);
                }
              }
            });
            return unitSet.size;
          }

          // 과목별로 그룹화 (unit 코드에서 과목 추출: geo, history 등)
          const subjectGroups = {};
          logs.forEach(log => {
            if (!log.radar || !log.unit) return;

            // unit 코드에서 과목 추출 (geo_01 -> geo, history_01 -> history)
            // fit_ / deep_ / on_ 접두어 제거: fit_bio_01 -> bio_01, deep_bio_01 -> bio_01, on_bio_01 -> bio_01
            let unitForSubject = log.unit;
            if (unitForSubject.startsWith('fit_')) {
              unitForSubject = unitForSubject.substring(4);
            } else if (unitForSubject.startsWith('deep_')) {
              unitForSubject = unitForSubject.substring(5);
            } else if (unitForSubject.startsWith('on_')) {
              unitForSubject = unitForSubject.substring(3);
            }
            let subjectCode = unitForSubject.split('_')[0];

          // world_01~40 -> world1, world_41~80 -> world2 (people도 동일)
          // world2_XX, people2_XX는 직접 world2, people2로 매핑
          if (subjectCode === 'world' || subjectCode === 'people') {
            const numMatch = unitForSubject.match(/_([0-9]+)$/);
            const num = numMatch ? parseInt(numMatch[1]) : 0;
            if (subjectCode === 'world') {
              subjectCode = num <= 40 ? 'world1' : 'world2';
            } else {
              subjectCode = num <= 40 ? 'people1' : 'people2';
            }
          } else if (subjectCode === 'world1' || subjectCode === 'world2' || subjectCode === 'people1' || subjectCode === 'people2' || subjectCode === 'person1' || subjectCode === 'person2') {
            // world1, world2, people1, people2, person1, person2는 그대로 유지
            // person1 -> people1, person2 -> people2로 통합
            if (subjectCode === 'person1') subjectCode = 'people1';
            if (subjectCode === 'person2') subjectCode = 'people2';
          }

          // unit 코드에서 시리즈명 추출
          const seriesFromUnit = (function(unit) {
            if (!unit) return 'BRAIN업';
            if (unit.includes('on_')) return 'BRAIN온';
            if (unit.includes('fit_')) return 'BRAIN핏';
            if (unit.includes('deep_')) return 'BRAIN딥';
            return 'BRAIN업';
          })(log.unit);
          const subjectKey = seriesFromUnit + '_' + subjectCode;

          if (!subjectGroups[subjectKey]) {
            subjectGroups[subjectKey] = {
              series: seriesFromUnit,
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
          const subjectTotal = subjectUnitCounts[group.subjectCode] || 20;
          const subjectCompleted = getFilteredCompletedCount(group.subjectCode, logs);
          const displayTitle = group.series + ' ' + subjectName + ' (' + subjectCompleted + '/' + subjectTotal + ')';

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
          const fieldClass = subjectToFieldClass[group.subjectCode] || '';
          const card = document.createElement('div');
          card.className = 'radar-card summary-card subject-card ' + fieldClass + (summaryIndex >= 6 ? ' hidden-card' : '');
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
          } else {
            document.getElementById('toggleSummaryBtn').style.display = 'none';
          }
        }
        // renderSubjectRadar 함수 끝

        // ===== 개별 레이더 차트 함수 =====
        const radarWrap = document.getElementById('radar-wrap');

        function renderIndividualRadar(logs) {
          // 기존 카드 제거
          radarWrap.innerHTML = '';
          let radarIndex = 0;

          logs.forEach(function(log, idx) {
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
          card.style.cursor = 'pointer';

          // 단원 클릭 시 해당 단원으로 이동
          const unitCode = log.unit || '';
          // FIT 시리즈는 항상 BRAINUP 폴더에 저장됨
          let seriesCode = 'BRAINUP';
          if (unitCode) {
            // unit 코드에서 과목과 번호 추출 (예: bio_01, geo_01, fit_bio_01, deep_bio_01)
            const parts = unitCode.split('_');
            let subject = parts[0] || '';

            // fit_ / deep_ 접두어인 경우 실제 과목명은 parts[1]
            if ((subject === 'fit' || subject === 'deep') && parts.length >= 3) {
              subject = parts[1]; // fit_bio_01 → bio, deep_bio_01 → bio
            }

            // 과목별 폴더 매핑
            const folderMap = {
              'geo': 'social', 'soc': 'social', 'law': 'social', 'pol': 'social',
              'bio': 'science', 'earth': 'science', 'physics': 'science', 'chem': 'science',
              'modern': 'korlit', 'classic': 'korlit',
              'world': 'worldlit', 'world1': 'worldlit', 'world2': 'worldlit',
              'people': 'person', 'people1': 'person', 'people2': 'person', 'person1': 'person', 'person2': 'person'
            };
            const folder = folderMap[subject] || 'social';

            // 디버그 로그
            console.log('[단원 이동] unitCode:', unitCode, 'subject:', subject, 'folder:', folder);

            const unitPath = '/' + seriesCode + '/' + folder + '/' + unitCode + '.html';

            card.onclick = function() {
              console.log('[클릭] 이동 경로:', unitPath);
              window.location.href = unitPath;
            };
            card.title = '클릭하여 단원으로 이동';
          }
          radarIndex++;

          const header = document.createElement('div');
          header.className = 'radar-card-header';

          const titleSection = document.createElement('div');
          titleSection.style.cssText = 'flex: 1; text-align: center;';

          const seriesLabel = document.createElement('div');
          seriesLabel.style.cssText = 'font-size: 11px; color: #95a5a6; margin-bottom: 4px;';
          // unit 코드에서 시리즈명 추출
          const seriesFromUnitForLabel = (function(unit) {
            if (!unit) return 'BRAIN업';
            if (unit.includes('on_')) return 'BRAIN온';
            if (unit.includes('fit_')) return 'BRAIN핏';
            if (unit.includes('deep_')) return 'BRAIN딥';
            return 'BRAIN업';
          })(log.unit);
          seriesLabel.textContent = '📚 ' + seriesFromUnitForLabel;

          const title = document.createElement('div');
          title.className = 'radar-card-title';

          // 단원 코드 → 단원명 변환 (예: geo_01 → 지리 01, world2_01 → 세계문학2 1, fit_bio_01 → 생물 1, on_bio_01 → 생물 1)
          let unitName = log.unit || '단원';
          if (unitName && unitName.includes('_')) {
            const parts = unitName.split('_');
            const subjectMap = { 'geo': '지리', 'bio': '생물', 'earth': '지구과학', 'physics': '물리', 'chem': '화학', 'soc': '사회문화', 'law': '법', 'pol': '정치경제', 'modern': '현대문학', 'classic': '고전문학', 'world': '세계문학1', 'world1': '세계문학1', 'world2': '세계문학2', 'people': '한국인물', 'person1': '한국인물', 'person2': '세계인물', 'people1': '한국인물', 'people2': '세계인물' };
            // fit_/deep_/on_ 접두어 처리: fit_bio_01 → ['fit', 'bio', '01'], deep_bio_01 → ['deep', 'bio', '01'], on_bio_01 → ['on', 'bio', '01']
            let subjectKey = parts[0];
            let numStr = parts[1];
            if ((parts[0] === 'fit' || parts[0] === 'deep' || parts[0] === 'on') && parts.length >= 3) {
              subjectKey = parts[1];
              numStr = parts[2];
            }
            const subject = subjectMap[subjectKey] || subjectKey;
            let number = numStr ? parseInt(numStr, 10) : 0;
            // world_41~80은 세계문학2로 표시 (world_41 → 세계문학2 1)
            if (subjectKey === 'world' && number > 40) {
              number = number - 40;
              unitName = '세계문학2 ' + number;
            } else {
              unitName = subject + ' ' + number;
            }
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
            const unitCode = log.unit; // 예: geo_01, bio_01, fit_bio_01
            if (unitCode) {
              // 단원 코드에서 과목 추출 (fit_ / deep_ 접두어 처리)
              const parts = unitCode.split('_');
              let subject = parts[0] || '';

              // fit_ / deep_ / on_ 접두어인 경우 실제 과목명은 parts[1]
              if ((subject === 'fit' || subject === 'deep' || subject === 'on') && parts.length >= 3) {
                subject = parts[1]; // fit_bio_01 → bio, deep_bio_01 → bio, on_bio_01 → bio
              }

              // 과목별 폴더 매핑
              const folderMap = {
                'geo': 'social', 'soc': 'social', 'law': 'social', 'pol': 'social',
                'bio': 'science', 'earth': 'science', 'physics': 'science', 'chem': 'science',
                'modern': 'korlit', 'classic': 'korlit',
                'world': 'worldlit', 'world1': 'worldlit', 'world2': 'worldlit',
                'people': 'person', 'people1': 'person', 'people2': 'person', 'person1': 'person', 'person2': 'person'
              };
              const folder = folderMap[subject] || 'social';

              // series 코드를 unit에서 추출
              let seriesCode = 'BRAINUP';
              if (unitCode.includes('on_')) seriesCode = 'BRAINUP'; // on_ 파일은 BRAINUP 폴더에 있음
              else if (unitCode.includes('fit_')) seriesCode = 'BRAINUP';
              else if (unitCode.includes('deep_')) seriesCode = 'BRAINUP';

              const unitUrl = '/' + seriesCode + '/' + folder + '/' + unitCode + '.html';
              console.log('[레이더 클릭] unitCode:', unitCode, 'subject:', subject, 'folder:', folder, 'url:', unitUrl);
              window.location.href = unitUrl;
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
          } else {
            document.getElementById('toggleRadarBtn').style.display = 'none';
          }
        }
        // renderIndividualRadar 함수 끝

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

              // 캡처 전에 스크롤 영역 높이 자동 조정
              const body = document.body;
              const html = document.documentElement;
              const originalBodyHeight = body.style.height;
              const originalHtmlHeight = html.style.height;
              const originalBodyOverflow = body.style.overflow;
              const originalHtmlOverflow = html.style.overflow;

              // 전체 내용이 보이도록 높이 조정
              body.style.height = 'auto';
              html.style.height = 'auto';
              body.style.overflow = 'visible';
              html.style.overflow = 'visible';

              console.log('🎨 캔버스 생성 중... (스크롤 없음 모드)');
              const canvas = await html2canvas(target, {
                scale: 1.5,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                windowHeight: target.scrollHeight,
                height: target.scrollHeight
              });

              // 원래대로 복구
              body.style.height = originalBodyHeight;
              html.style.height = originalHtmlHeight;
              body.style.overflow = originalBodyOverflow;
              html.style.overflow = originalHtmlOverflow;

              console.log('✅ 캔버스 생성 완료:', canvas.width, 'x', canvas.height);

              // PNG 대신 JPEG 사용 (품질 0.5, 용량 대폭 감소)
              const imgData = canvas.toDataURL('image/jpeg', 0.5);
              console.log('📸 이미지 데이터 생성 완료 (JPEG, 품질 0.5)');

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

        // ===== 시리즈 종합 레이더 =====
        function renderSeriesRadar(logs) {
          console.log('🎯 renderSeriesRadar 실행, 총 로그:', logs.length);
          const seriesWrap = document.getElementById('series-radar-wrap');

          // 기존 카드 제거
          seriesWrap.innerHTML = '';

          // 모든 radar 데이터가 있는 로그 수집
          const validLogs = logs.filter(log => log.radar);
          console.log('📊 radar 데이터가 있는 로그:', validLogs.length);

          if (validLogs.length === 0) {
            console.log('⚠️ 유효한 로그가 없음');
            seriesWrap.innerHTML = '<p style="color:#777; font-size:13px;">아직 분석 리포트가 있는 학습 기록이 없습니다.</p>';
            return;
          }
          console.log('✅ 시리즈 레이더 차트 생성 시작');

          // 시리즈별로 그룹화 (unit 코드에서 시리즈 추출)
          const seriesGroups = {};
          validLogs.forEach(log => {
            // unit 코드에서 시리즈명 추출
            let series = 'BRAIN업';
            if (log.unit) {
              if (log.unit.includes('on_')) series = 'BRAIN온';
              else if (log.unit.includes('fit_')) series = 'BRAIN핏';
              else if (log.unit.includes('deep_')) series = 'BRAIN딥';
            }
            if (!seriesGroups[series]) {
              seriesGroups[series] = [];
            }
            seriesGroups[series].push(log);
          });

          // 각 시리즈별로 카드 생성
          Object.keys(seriesGroups).forEach(seriesName => {
            const seriesLogs = seriesGroups[seriesName];

            // 평균 계산
            let totalLiteral = 0, totalStructural = 0, totalLexical = 0;
            let totalInferential = 0, totalCritical = 0;
            let count = 0;

            seriesLogs.forEach(log => {
              totalLiteral += log.radar.literal || 0;
              totalStructural += log.radar.structural || 0;
              totalLexical += log.radar.lexical || 0;
              totalInferential += log.radar.inferential || 0;
              totalCritical += log.radar.critical || 0;
              count++;
            });

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
            let gradeClass = 'normal';
            if (avgScore >= 9) {
              badgeClass = 'badge-excellent';
              badgeText = '우수';
              gradeClass = 'excellent';
            } else if (avgScore >= 8) {
              badgeClass = 'badge-good';
              badgeText = '양호';
              gradeClass = 'good';
            } else if (avgScore >= 7) {
              badgeClass = 'badge-normal';
              badgeText = '보통';
              gradeClass = 'normal';
            } else {
              badgeClass = 'badge-encourage';
              badgeText = '격려';
              gradeClass = 'encourage';
            }

            // 해당 시리즈의 고유 단원 수 계산
            const seriesUnitsSet = new Set();
            seriesLogs.forEach(log => {
              if (log.unit) {
                seriesUnitsSet.add(normalizeUnitCode(log.unit));
              }
            });
            const seriesCompleted = seriesUnitsSet.size;

            // 차트 카드 생성
            const card = document.createElement('div');
            card.className = 'radar-card summary-card series-card';

            const header = document.createElement('div');
            header.className = 'radar-card-header';

            const title = document.createElement('div');
            title.className = 'radar-card-title';
            title.textContent = seriesName + ' (' + seriesCompleted + '/' + seriesTotalUnits + ')';

            const badge = document.createElement('div');
            badge.className = 'badge ' + badgeClass;
            badge.textContent = badgeText;

            header.appendChild(title);
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

            seriesWrap.appendChild(card);

            // 차트 생성
            new Chart(canvas.getContext('2d'), {
              type: 'radar',
              data: {
                labels: ['핵심 이해력', '구조 파악력', '어휘 맥락력', '추론·통합력', '비판·적용력'],
                datasets: [{
                  label: seriesName + ' 전체',
                  data: scores,
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgb(54, 162, 235)',
                  borderWidth: 3,
                  pointBackgroundColor: 'rgb(54, 162, 235)',
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
        }

        // ===== 분야별 종합 레이더 =====
        function renderFieldRadar(logs) {
          console.log('🎯 renderFieldRadar 실행, 총 로그:', logs.length);
          const fieldWrap = document.getElementById('field-radar-wrap');
          fieldWrap.innerHTML = '';  // 기존 카드 제거

          // 과목 코드 → 분야 매핑
          const subjectToField = {
            'geo': '사회분야',
            'soc': '사회분야',
            'law': '사회분야',
            'pol': '사회분야',
            'bio': '과학분야',
            'earth': '과학분야',
            'physics': '과학분야',
            'chem': '과학분야',
            'modern': '한국문학',
            'classic': '한국문학',
            'world': '세계문학',
            'world1': '세계문학',
            'world2': '세계문학',
            'people': '인물분야',
            'people1': '인물분야',
            'people2': '인물분야',
            'person1': '인물분야',
            'person2': '인물분야'
          };

          // 분야명 → CSS 클래스 매핑
          const fieldToClass = {
            '과학분야': 'science',
            '사회분야': 'society',
            '한국문학': 'korean-lit',
            '세계문학': 'world-lit',
            '인물분야': 'person'
          };

          // 정규화된 단원 코드로 중복 제거 후 시리즈+분야별로 그룹화
          const fieldGroups = {};
          const processedUnits = new Set(); // 이미 처리된 시리즈_정규화단원코드 추적

          logs.forEach(log => {
            if (!log.radar || !log.unit) return;

            // 정규화된 단원 코드 생성
            const normalizedUnit = normalizeUnitCode(log.unit);
            // unit 코드에서 시리즈명 추출
            let seriesName = 'BRAIN업';
            if (log.unit.includes('on_')) seriesName = 'BRAIN온';
            else if (log.unit.includes('fit_')) seriesName = 'BRAIN핏';
            else if (log.unit.includes('deep_')) seriesName = 'BRAIN딥';

            // 시리즈+단원 조합으로 중복 체크
            const uniqueKey = seriesName + '_' + normalizedUnit;
            if (processedUnits.has(uniqueKey)) return;
            processedUnits.add(uniqueKey);

            // 정규화된 unit 코드에서 과목 추출
            const subjectCode = normalizedUnit.split('_')[0];
            const fieldName = subjectToField[subjectCode];

            if (!fieldName) return; // 매핑되지 않은 과목은 제외

            // 시리즈+분야를 키로 사용
            const groupKey = seriesName + '_' + fieldName;
            if (!fieldGroups[groupKey]) {
              fieldGroups[groupKey] = {
                series: seriesName,
                field: fieldName,
                logs: []
              };
            }
            fieldGroups[groupKey].logs.push(log);
          });

          // 각 시리즈+분야별로 평균 계산 및 차트 생성
          let fieldIndex = 0;
          console.log('📊 분야별 그룹화 결과:', Object.keys(fieldGroups).map(f => f + ': ' + fieldGroups[f].logs.length + '개'));
          Object.keys(fieldGroups).forEach(groupKey => {
            const group = fieldGroups[groupKey];
            const seriesName = group.series;
            const fieldName = group.field;
            const fieldLogs = group.logs;
            console.log('🎯 시리즈+분야:', groupKey, '로그 수:', fieldLogs.length, '단원:', fieldLogs.map(l => l.unit));

            // 평균 계산
            let totalLiteral = 0, totalStructural = 0, totalLexical = 0;
            let totalInferential = 0, totalCritical = 0;
            let count = 0;

            fieldLogs.forEach(log => {
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
            let gradeClass = 'normal';
            if (avgScore >= 9) {
              badgeClass = 'badge-excellent';
              badgeText = '우수';
              gradeClass = 'excellent';
            } else if (avgScore >= 8) {
              badgeClass = 'badge-good';
              badgeText = '양호';
              gradeClass = 'good';
            } else if (avgScore >= 7) {
              badgeClass = 'badge-normal';
              badgeText = '보통';
              gradeClass = 'normal';
            }

            // 차트 카드 생성
            const fieldCssClass = fieldToClass[fieldName] || '';
            const card = document.createElement('div');
            card.className = 'radar-card summary-card field-card ' + fieldCssClass + (fieldIndex >= 5 ? ' hidden-card' : '');
            fieldIndex++;

            const header = document.createElement('div');
            header.className = 'radar-card-header';

            // 분야별 총 단원 수
            const fieldTotal = fieldUnitCounts[fieldName] || 80;
            // fieldLogs.length가 이미 해당 분야의 고유 단원 수 (processedUnits에서 중복 제거됨)
            const fieldCompleted = fieldLogs.length;

            const title = document.createElement('div');
            title.className = 'radar-card-title';
            title.textContent = seriesName + ' ' + fieldName + ' (' + fieldCompleted + '/' + fieldTotal + ')';

            const badge = document.createElement('div');
            badge.className = 'badge ' + badgeClass;
            badge.textContent = badgeText;

            header.appendChild(title);
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

            fieldWrap.appendChild(card);

            // 차트 생성
            new Chart(canvas.getContext('2d'), {
              type: 'radar',
              data: {
                labels: ['핵심 이해력', '구조 파악력', '어휘 맥락력', '추론·통합력', '비판·적용력'],
                datasets: [{
                  label: fieldName,
                  data: scores,
                  backgroundColor: 'rgba(153, 102, 255, 0.2)',
                  borderColor: 'rgb(153, 102, 255)',
                  borderWidth: 3,
                  pointBackgroundColor: 'rgb(153, 102, 255)',
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

          // 분야별 레이더가 없으면 안내 메시지
          if (fieldIndex === 0) {
            console.log('⚠️ 분야별 레이더 데이터 없음');
            fieldWrap.innerHTML = '<p style="color:#777; font-size:13px;">아직 분석 리포트가 있는 학습 기록이 없습니다.</p>';
          } else {
            console.log('✅ 분야별 레이더 차트 생성 완료, 총:', fieldIndex);
          }
        }

        // ===== 시리즈 선택 기능 =====
        // URL 파라미터에서 초기 시리즈 설정
        const urlParams = new URLSearchParams(window.location.search);
        const initialSeries = urlParams.get('series');
        let currentSelectedSeries = 'all';

        // series 파라미터에 따라 초기 시리즈 설정
        if (initialSeries === 'fit') {
          currentSelectedSeries = 'BRAIN핏';
        } else if (initialSeries === 'up') {
          currentSelectedSeries = 'BRAIN업';
        } else if (initialSeries === 'deep') {
          currentSelectedSeries = 'BRAIN딥';
        } else if (initialSeries === 'on') {
          currentSelectedSeries = 'BRAIN온';
        }

        const allLogs = logsForChart;

        // 어휘 점수 차트 초기 렌더링 (allLogs 초기화 후)
        renderVocabScoreChart();

        // 드롭다운 토글
        document.getElementById('seriesButton').addEventListener('click', function() {
          const menu = document.getElementById('seriesMenu');
          const button = this;
          menu.classList.toggle('show');
          button.classList.toggle('active');
        });

        // ===== 정렬 기준 변수 =====
        let currentSortBy = 'final'; // 기본값: 최종
        let aiSortDirection = 'desc'; // AI과제부여 정렬 방향: desc(내림차순), asc(오름차순)

        // ===== 정렬 함수 =====
        function sortLogsByTime(sortBy) {
          currentSortBy = sortBy;
          const filteredLogs = getFilteredLogs();
          const sortedLogs = sortLogs(filteredLogs, sortBy);
          renderLogTable(sortedLogs);
        }

        // ===== AI과제부여 날짜 정렬 함수 (클릭 가능한 헤더용) =====
        function sortByAIAssignDate() {
          // 토글: 현재 aiTask 정렬이면 방향 전환, 아니면 aiTask 정렬로 변경
          if (currentSortBy === 'aiTask') {
            aiSortDirection = aiSortDirection === 'desc' ? 'asc' : 'desc';
          } else {
            currentSortBy = 'aiTask';
            aiSortDirection = 'desc'; // 기본값: 최신순
          }

          const filteredLogs = getFilteredLogs();
          const sortedLogs = sortLogsWithAIDirection(filteredLogs, aiSortDirection);
          renderLogTable(sortedLogs);

          // 아이콘 업데이트
          const sortIcon = document.getElementById('aiSortIcon');
          if (sortIcon) {
            sortIcon.textContent = aiSortDirection === 'desc' ? '↓' : '↑';
          }

          console.log('📊 AI과제부여 정렬:', aiSortDirection === 'desc' ? '최신순' : '오래된순');

          // 다른 정렬 아이콘 초기화
          const finalIcon = document.getElementById('finalSortIcon');
          if (finalIcon) finalIcon.textContent = '⇅';
          const gradeIcon = document.getElementById('gradeSortIcon');
          if (gradeIcon) gradeIcon.textContent = '⇅';
        }

        // ===== 최종 날짜 정렬 함수 (클릭 가능한 헤더용) =====
        let finalSortDirection = 'desc'; // 최종 날짜 정렬 방향

        function sortByFinalDate() {
          // 토글: 현재 final 정렬이면 방향 전환, 아니면 final 정렬로 변경
          if (currentSortBy === 'final') {
            finalSortDirection = finalSortDirection === 'desc' ? 'asc' : 'desc';
          } else {
            currentSortBy = 'final';
            finalSortDirection = 'desc'; // 기본값: 최신순
          }

          const filteredLogs = getFilteredLogs();
          const sortedLogs = sortLogsWithFinalDirection(filteredLogs, finalSortDirection);
          renderLogTable(sortedLogs);

          // 아이콘 업데이트
          const sortIcon = document.getElementById('finalSortIcon');
          if (sortIcon) {
            sortIcon.textContent = finalSortDirection === 'desc' ? '↓' : '↑';
          }

          // 다른 정렬 아이콘 초기화
          const aiIcon = document.getElementById('aiSortIcon');
          if (aiIcon) aiIcon.textContent = '⇅';

          console.log('📊 최종 날짜 정렬:', finalSortDirection === 'desc' ? '최신순' : '오래된순');

          // 다른 정렬 아이콘 초기화
          const gradeIcon = document.getElementById('gradeSortIcon');
          if (gradeIcon) gradeIcon.textContent = '⇅';
        }

        // ===== 등급 정렬 함수 (클릭 가능한 헤더용) =====
        let gradeSortDirection = 'desc'; // 등급 정렬 방향: desc(높은순), asc(낮은순)

        function sortByGrade() {
          // 토글: 현재 grade 정렬이면 방향 전환, 아니면 grade 정렬로 변경
          if (currentSortBy === 'grade') {
            gradeSortDirection = gradeSortDirection === 'desc' ? 'asc' : 'desc';
          } else {
            currentSortBy = 'grade';
            gradeSortDirection = 'desc'; // 기본값: 높은순 (우수→격려)
          }

          const filteredLogs = getFilteredLogs();
          const sortedLogs = sortLogsWithGradeDirection(filteredLogs, gradeSortDirection);
          renderLogTable(sortedLogs);

          // 아이콘 업데이트
          const sortIcon = document.getElementById('gradeSortIcon');
          if (sortIcon) {
            sortIcon.textContent = gradeSortDirection === 'desc' ? '↓' : '↑';
          }

          // 다른 정렬 아이콘 초기화
          const aiIcon = document.getElementById('aiSortIcon');
          if (aiIcon) aiIcon.textContent = '⇅';
          const finalIcon = document.getElementById('finalSortIcon');
          if (finalIcon) finalIcon.textContent = '⇅';

          console.log('📊 등급 정렬:', gradeSortDirection === 'desc' ? '높은순' : '낮은순');
        }

        // ===== 등급 정렬 (방향 지정 가능) =====
        function sortLogsWithGradeDirection(logs, direction) {
          // 등급 점수 매핑: 우수(9+) > 양호(8+) > 보통(7+) > 격려(7미만)
          function getGradeScore(log) {
            const r = log.radar || {};
            const scores = [r.literal, r.structural, r.lexical, r.inferential, r.critical].filter(s => s != null);
            if (scores.length === 0) return 0;
            return scores.reduce((a, b) => a + b, 0) / scores.length;
          }

          return [...logs].sort((a, b) => {
            const scoreA = getGradeScore(a);
            const scoreB = getGradeScore(b);
            return direction === 'desc' ? (scoreB - scoreA) : (scoreA - scoreB);
          });
        }

        // ===== 최종 날짜 정렬 (방향 지정 가능) =====
        function sortLogsWithFinalDirection(logs, direction) {
          return [...logs].sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return direction === 'desc' ? (timeB - timeA) : (timeA - timeB);
          });
        }

        // ===== AI과제부여 정렬 (방향 지정 가능) =====
        function sortLogsWithAIDirection(logs, direction) {
          return [...logs].sort((a, b) => {
            // AI과제부여가 없는 항목(-)은 항상 맨 아래
            const hasAiA = a.aiTaskAssignedAt ? 1 : 0;
            const hasAiB = b.aiTaskAssignedAt ? 1 : 0;
            if (hasAiA !== hasAiB) {
              return hasAiB - hasAiA; // AI과제부여 있는 것이 먼저
            }

            // 둘 다 AI과제부여가 있으면 시간순 정렬
            if (hasAiA && hasAiB) {
              const timeA = new Date(a.aiTaskAssignedAt).getTime();
              const timeB = new Date(b.aiTaskAssignedAt).getTime();
              return direction === 'desc' ? (timeB - timeA) : (timeA - timeB);
            }

            // 둘 다 AI과제부여가 없으면 최종 시간 기준 내림차순
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeB - timeA;
          });
        }

        function sortLogs(logs, sortBy) {
          return [...logs].sort((a, b) => {
            let timeA, timeB;

            if (sortBy === 'first') {
              // 최초 시간 (timestamp) - 오름차순 (가장 오래된 기록이 맨 위)
              timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
              timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
              return timeA - timeB; // 오름차순 (오래된 것이 맨 위)
            } else if (sortBy === 'aiTask') {
              // AI과제부여 시간 - 내림차순 (최신이 맨 위)
              // AI과제부여가 있는 항목이 먼저, 없는 항목은 뒤로
              const hasAiA = a.aiTaskAssignedAt ? 1 : 0;
              const hasAiB = b.aiTaskAssignedAt ? 1 : 0;
              if (hasAiA !== hasAiB) {
                return hasAiB - hasAiA; // AI과제부여 있는 것이 먼저
              }
              // 둘 다 AI과제부여가 있으면 시간순 내림차순
              if (hasAiA && hasAiB) {
                timeA = new Date(a.aiTaskAssignedAt).getTime();
                timeB = new Date(b.aiTaskAssignedAt).getTime();
                return timeB - timeA;
              }
              // 둘 다 AI과제부여가 없으면 최종 시간 기준 내림차순
              timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
              timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
              return timeB - timeA;
            } else {
              // 최종 시간 = 학습 완료 시점 (timestamp) - 내림차순 (최신이 맨 위)
              timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
              timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
              return timeB - timeA; // 내림차순 (최신이 맨 위)
            }
          });
        }

        // 시리즈별 로그 필터링 헬퍼 함수 (unit prefix 기반)
        function filterLogsBySeries(logs, series) {
          if (series === 'all') return logs;
          return logs.filter(log => {
            if (!log.unit) return false;
            if (series === 'BRAIN온') return log.unit.includes('on_');
            if (series === 'BRAIN핏') return log.unit.includes('fit_');
            if (series === 'BRAIN딥') return log.unit.includes('deep_');
            if (series === 'BRAIN업') return !log.unit.includes('fit_') && !log.unit.includes('deep_') && !log.unit.includes('on_');
            return log.series === series;
          });
        }

        function getFilteredLogs() {
          // 현재 시리즈 필터 적용
          return filterLogsBySeries(allLogs, currentSelectedSeries);
        }

        // ===== 필터 적용 함수 =====
        window.newApplyFilters = function() {
          // 1. 시리즈 필터 적용 (unit prefix 기반)
          let filteredLogs = filterLogsBySeries([...allLogs], currentSelectedSeries);

          // 2. 최종순 정렬 (기본)
          filteredLogs.sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeB - timeA;
          });

          // 3. 테이블 렌더링
          renderLogTable(filteredLogs);
        };

        // ===== 단원 코드로 학습 페이지 경로 생성 =====
        function getUnitPath(unitCode, series) {
          if (!unitCode) return null;

          // 시리즈별 폴더 매핑 (BRAIN핏, BRAIN온, BRAIN딥 모두 BRAINUP 폴더 사용)
          const seriesFolders = {
            'BRAIN업': 'BRAINUP',
            'BRAIN온': 'BRAINUP',  // on_ 파일들도 BRAINUP 폴더에 있음
            'BRAIN핏': 'BRAINUP',
            'BRAIN딥': 'BRAINUP',
            'BRAIN중등': 'BRAINMID',
            'BRAIN고등': 'BRAINHIGH'
          };

          // 과목 코드 → 폴더 매핑
          const subjectFolders = {
            'geo': 'social',
            'soc': 'social',
            'law': 'social',
            'pol': 'social',
            'bio': 'science',
            'chem': 'science',
            'physics': 'science',
            'earth': 'science',
            'classic': 'korlit',
            'modern': 'korlit',
            'world': 'worldlit',
            'world1': 'worldlit',
            'world2': 'worldlit',
            'people': 'person',
            'people1': 'person',
            'people2': 'person',
            'person1': 'person',
            'person2': 'person'
          };

          const parts = unitCode.split('_');
          console.log('🔍 getUnitPath - parts:', parts, 'series:', series);
          if (parts.length < 2) {
            console.log('❌ parts.length < 2');
            return null;
          }

          // fit_ / deep_ / on_ 접두어 처리: fit_geo_13 → subjectCode = 'geo', deep_bio_01 → subjectCode = 'bio', on_bio_01 → subjectCode = 'bio'
          let subjectCode = parts[0];
          if ((subjectCode === 'fit' || subjectCode === 'deep' || subjectCode === 'on') && parts.length >= 3) {
            subjectCode = parts[1];
          }
          console.log('🔍 getUnitPath - subjectCode:', subjectCode);

          const seriesFolder = seriesFolders[series] || 'BRAINUP';
          const subjectFolder = subjectFolders[subjectCode];
          console.log('🔍 getUnitPath - seriesFolder:', seriesFolder, 'subjectFolder:', subjectFolder);

          if (!subjectFolder) {
            console.log('❌ subjectFolder not found for subjectCode:', subjectCode);
            return null;
          }

          // 경로 생성: /BRAINUP/social/geo_01.html, /BRAINUP/social/fit_geo_01.html, /BRAINUP/science/deep_bio_01.html
          const finalPath = '/' + seriesFolder + '/' + subjectFolder + '/' + unitCode + '.html';
          console.log('✅ getUnitPath - finalPath:', finalPath);
          return finalPath;
        }

        // ===== 단원 페이지로 이동 =====
        function goToUnit(unitCode, series) {
          const path = getUnitPath(unitCode, series);
          console.log('🔍 goToUnit 호출:', { unitCode, series, path });
          if (path) {
            window.open(path, '_blank');
          } else {
            alert('해당 단원 페이지를 찾을 수 없습니다.\\n\\nunitCode: ' + unitCode + '\\nseries: ' + series);
          }
        }

        // ===== 학습 기록 테이블 렌더링 함수 =====
        function renderLogTable(logs) {
          const tbody = document.getElementById('logTableBody');
          const toggleBtn = document.getElementById('toggleBtn');
          const logCountBadge = document.getElementById('logCountBadge');
          const normalLearningCount = document.getElementById('normalLearningCount');
          const aiLearningCount = document.getElementById('aiLearningCount');

          // 일반학습과 AI추천학습 건수 계산
          let normalCount = 0;
          let aiCount = 0;

          logs.forEach(log => {
            // 일반학습: LearningLog에 기록된 모든 학습
            normalCount++;

            // AI추천학습: aiTaskAssignedAt이 있는 경우 (과제 부여됨)
            if (log.aiTaskAssignedAt) {
              aiCount++;
            }
          });

          // 배지 업데이트
          const totalCount = normalCount;
          logCountBadge.textContent = \`📚 총 \${totalCount}건의 학습 기록\`;
          normalLearningCount.textContent = \`📖 일반학습 \${normalCount}건\`;
          aiLearningCount.textContent = \`🤖 AI추천학습 \${aiCount}건\`;

          // 테이블 초기화
          tbody.innerHTML = '';

          // 과목 매핑 (world1/world2는 세계문학1/세계문학2, people1/people2는 한국인물/세계인물로 분리)
          const subjectMap = { 'geo': '지리', 'bio': '생물', 'earth': '지구과학', 'physics': '물리', 'chem': '화학', 'soc': '사회문화', 'law': '법', 'pol': '정치경제', 'modern': '현대문학', 'classic': '고전문학', 'world': '세계문학1', 'world1': '세계문학1', 'world2': '세계문학2', 'people': '한국인물', 'people1': '한국인물', 'people2': '세계인물', 'person1': '한국인물', 'person2': '세계인물' };

          logs.forEach((log, idx) => {
            // 과목명 추출 (unit 코드에서)
            let subjectName = '-';
            const unitCode = log.unit || '';
            if (unitCode && unitCode.includes('_')) {
              const parts = unitCode.split('_');
              // fit_/deep_/on_ 접두어 처리: fit_bio_01 → ['fit', 'bio', '01'], deep_bio_01 → ['deep', 'bio', '01'], on_bio_01 → ['on', 'bio', '01']
              let subjectKey = parts[0];
              let numStr = parts[1];
              if ((parts[0] === 'fit' || parts[0] === 'deep' || parts[0] === 'on') && parts.length >= 3) {
                subjectKey = parts[1];
                numStr = parts[2];
              }
              let number = numStr ? parseInt(numStr, 10) : 0;
              // world_41~80은 세계문학2
              if (subjectKey === 'world' && number > 40) {
                subjectName = '세계문학2';
              } else {
                subjectName = subjectMap[subjectKey] || subjectKey;
              }
            }

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

            // 단원 코드 → 단원명 변환 (예: world2_01 → 세계문학2 1, fit_bio_01 → 생물 1, deep_bio_01 → 생물 1)
            let unitName = log.unit || "";
            if (unitName && unitName.includes('_')) {
              const parts = unitName.split('_');
              // fit_/deep_/on_ 접두어 처리: fit_bio_01 → ['fit', 'bio', '01'], deep_bio_01 → ['deep', 'bio', '01'], on_bio_01 → ['on', 'bio', '01']
              let subjectKey = parts[0];
              let numStr = parts[1];
              if ((parts[0] === 'fit' || parts[0] === 'deep' || parts[0] === 'on') && parts.length >= 3) {
                subjectKey = parts[1];
                numStr = parts[2];
              }
              const subject = subjectMap[subjectKey] || subjectKey;
              let number = numStr ? parseInt(numStr, 10) : 0;
              // world_41~80은 세계문학2로 표시 (world_41 → 세계문학2 1)
              if (subjectKey === 'world' && number > 40) {
                number = number - 40;
                unitName = '세계문학2 ' + number;
              } else {
                unitName = subject + ' ' + number;
              }
            }

            const hiddenClass = idx >= 10 ? 'hidden-row' : '';

            // AI과제부여 예정 시간 계산 (학습 완료 시간 + 등급별 대기 시간)
            // 우수: 부여 안 함, 양호: 14일, 보통: 7일, 격려: 3일
            let aiTaskTimestamp = '-';
            let aiTaskStyle = 'color: #999;';
            if (log.timestamp && avgScore < 9) { // 우수 등급이 아닌 경우만
              const completedAt = new Date(log.timestamp);
              let waitHours = 168; // 기본: 보통 7일(168시간)
              if (avgScore >= 8) {
                waitHours = 336; // 양호: 14일(336시간)
              } else if (avgScore < 7) {
                waitHours = 72; // 격려: 3일(72시간)
              }
              const scheduledAt = new Date(completedAt.getTime() + waitHours * 60 * 60 * 1000);
              aiTaskTimestamp = scheduledAt.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
              aiTaskStyle = 'color: #6b21a8; font-weight: 600;';
            }

            // 최종완료 시간 = 학습 완료 시점 (timestamp) - AI과제부여와 무관
            const finalTimestamp = log.timestamp ?
              new Date(log.timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) : '-';
            const finalTimeStyle = 'color: #059669; font-weight: 600;';

            const unitCodeForClick = log.unit || '';
            // unit 코드에서 시리즈명 추출
            let seriesForClick = 'BRAIN업';
            if (log.unit) {
              if (log.unit.includes('on_')) seriesForClick = 'BRAIN온';
              else if (log.unit.includes('fit_')) seriesForClick = 'BRAIN핏';
              else if (log.unit.includes('deep_')) seriesForClick = 'BRAIN딥';
            }

            const row = document.createElement('tr');
            if (hiddenClass) row.className = hiddenClass;
            row.title = '클릭하여 단원으로 이동';
            row.style.cursor = 'pointer';
            row.onclick = (function(uc, sr) {
              return function() { goToUnit(uc, sr); };
            })(unitCodeForClick, seriesForClick);
            row.innerHTML = \`
              <td>\${idx + 1}</td>
              <td>\${subjectName}</td>
              <td style="\${aiTaskStyle}">\${aiTaskTimestamp}</td>
              <td style="\${finalTimeStyle}">\${finalTimestamp}</td>
              <td><span class="badge \${badgeClass}">\${badgeText}</span></td>
              <td>\${(function(unit) {
                if (!unit) return log.series || '';
                if (unit.includes('on_')) return 'BRAIN온';
                if (unit.includes('fit_')) return 'BRAIN핏';
                if (unit.includes('deep_')) return 'BRAIN딥';
                return 'BRAIN업';
              })(log.unit)}</td>
              <td class="unit-link">\${unitName}</td>
            \`;
            tbody.appendChild(row);
          });

          // 더보기 버튼 표시/숨김
          if (logs.length > 10) {
            toggleBtn.style.display = 'inline-block';
            toggleBtn.textContent = '더보기 ▼';
          } else {
            toggleBtn.style.display = 'none';
          }
        }

        // 시리즈 선택
        document.querySelectorAll('.series-item').forEach(item => {
          item.addEventListener('click', function() {
            const series = this.dataset.series;
            currentSelectedSeries = series;

            // 메뉴 업데이트
            document.querySelectorAll('.series-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('currentSeries').textContent = this.textContent;
            document.getElementById('seriesMenu').classList.remove('show');
            document.getElementById('seriesButton').classList.remove('active');

            // currentSeries 업데이트 (차트 함수들이 사용)
            currentSeries = series;

            // 데이터 필터링 (unit prefix 기반으로 시리즈 판단)
            const filteredLogs = filterLogsBySeries(allLogs, series);

            console.log('선택된 시리즈:', series, '필터링된 로그:', filteredLogs.length);

            // 차트, 진도율 및 학습 기록 테이블 업데이트
            renderSeriesRadar(filteredLogs);
            renderFieldRadar(filteredLogs);
            renderSubjectRadar(filteredLogs);
            renderIndividualRadar(filteredLogs);
            calculateProgress(filteredLogs);
            renderLogTable(filteredLogs);

            // 날짜별 차트 재렌더링 (시리즈 변경 시)
            renderIndexTrendChart();
            renderSubjectBarChart();

            // 창의활동 테이블 재렌더링 (시리즈 변경 시)
            renderCreativeTable();

            // 데이터 유무에 따라 날짜별 차트 섹션 표시/숨김
            const indexTrendSection = document.getElementById('indexTrendSection');
            const subjectBarSection = document.getElementById('subjectBarSection');
            if (filteredLogs.length > 0) {
              if (indexTrendSection) indexTrendSection.style.display = 'block';
              if (subjectBarSection) subjectBarSection.style.display = 'block';
            } else {
              if (indexTrendSection) indexTrendSection.style.display = 'none';
              if (subjectBarSection) subjectBarSection.style.display = 'none';
            }

            // 부모 창(menu.html)에 시리즈 변경 알림 - 뱃지 업데이트용
            // iframe 내부에서 실행 중이거나, 직접 열린 경우에도 동작하도록 try-catch 사용
            try {
              // 시리즈별 총 단원 수
              const seriesTotals = {
                'BRAIN온': 400,
                'BRAIN업': 400,
                'BRAIN핏': 400,
                'BRAIN딥': 400,
                'BRAIN중등': 400,
                'BRAIN고등': 400
              };
              const totalUnits = series === 'all' ? 400 : (seriesTotals[series] || 400);

              // 평균 점수 및 진도율 계산
              const validLogs = filteredLogs.filter(log => log.radar);
              let avgScore = 0;
              if (validLogs.length > 0) {
                let totalLiteral = 0, totalStructural = 0, totalLexical = 0;
                let totalInferential = 0, totalCritical = 0;
                validLogs.forEach(log => {
                  totalLiteral += log.radar.literal || 0;
                  totalStructural += log.radar.structural || 0;
                  totalLexical += log.radar.lexical || 0;
                  totalInferential += log.radar.inferential || 0;
                  totalCritical += log.radar.critical || 0;
                });
                const count = validLogs.length;
                const scores = [
                  totalLiteral / count,
                  totalStructural / count,
                  totalLexical / count,
                  totalInferential / count,
                  totalCritical / count
                ];
                avgScore = parseFloat((scores.reduce((a, b) => a + b, 0) / 5).toFixed(1));
              }

              // 고유 단원 수 계산
              const completedUnits = new Set();
              filteredLogs.forEach(log => {
                if (log.unit) completedUnits.add(log.unit);
              });
              const progressPercent = Math.round((completedUnits.size / totalUnits) * 100);

              // 부모 창에 메시지 전송 (iframe 내부인 경우)
              if (window.parent && window.parent !== window) {
                window.parent.postMessage({
                  type: 'seriesChanged',
                  series: series,
                  avgScore: avgScore,
                  progressPercent: progressPercent,
                  completedCount: completedUnits.size,
                  totalUnits: totalUnits
                }, '*');
                console.log('📤 부모 창에 시리즈 변경 알림:', series, avgScore, progressPercent + '%');
              } else {
                console.log('📤 직접 열린 페이지 - postMessage 건너뜀');
              }

              // localStorage에도 저장 (모달 닫을 때 복원용)
              localStorage.setItem('selectedSeriesBadge', JSON.stringify({
                series: series,
                avgScore: avgScore,
                progressPercent: progressPercent
              }));

              // 시리즈 변경 시 URL 파라미터 업데이트 후 새로고침
              const seriesParamMap = {
                'BRAIN업': 'up',
                'BRAIN온': 'on',
                'BRAIN핏': 'fit',
                'BRAIN딥': 'deep'
              };
              const newSeriesParam = seriesParamMap[series];
              if (newSeriesParam) {
                const url = new URL(window.location.href);
                const currentSeriesParam = url.searchParams.get('series');
                if (currentSeriesParam !== newSeriesParam) {
                  url.searchParams.set('series', newSeriesParam);
                  console.log('🔄 시리즈 변경으로 페이지 새로고침:', series, '->', newSeriesParam);
                  window.location.href = url.toString();
                }
              }
            } catch (e) {
              console.log('postMessage 오류:', e);
            }
          });
        });

        // 외부 클릭 시 메뉴 닫기
        document.addEventListener('click', function(e) {
          const selector = document.querySelector('.series-selector');
          if (!selector.contains(e.target)) {
            document.getElementById('seriesMenu').classList.remove('show');
            document.getElementById('seriesButton').classList.remove('active');
          }
        });

        // 라이브러리 로드 확인
        window.addEventListener('load', function() {
          console.log('📚 페이지 로드 완료');
          console.log('📚 html2canvas:', typeof html2canvas);
          console.log('📚 jsPDF:', typeof window.jspdf);

          // ✅ URL 파라미터로 전달된 시리즈가 있으면 우선 사용
          let defaultSeries = currentSelectedSeries; // 이미 URL 파라미터에서 설정됨

          // URL 파라미터가 없으면 가장 최근 학습한 시리즈 찾기
          if (defaultSeries === 'all' && logsForChart.length > 0) {
            // 가장 최근 로그의 시리즈 (이미 timestamp 내림차순 정렬되어 있음)
            const recentSeries = logsForChart[0].series;
            if (recentSeries) {
              defaultSeries = recentSeries;
              currentSelectedSeries = recentSeries;
            }
          }

          // UI 업데이트 (URL 파라미터 또는 최근 시리즈)
          if (defaultSeries !== 'all') {
            document.querySelectorAll('.series-item').forEach(item => {
              if (item.dataset.series === defaultSeries) {
                item.classList.add('active');
                document.getElementById('currentSeries').textContent = item.textContent;
              } else {
                item.classList.remove('active');
              }
            });
            console.log('📊 초기 시리즈 설정:', defaultSeries);
          }

          // 선택된 시리즈에 맞게 필터링 (unit prefix 기반)
          const initialLogs = filterLogsBySeries(logsForChart, defaultSeries);

          // 레이더 차트 렌더링
          renderSeriesRadar(initialLogs);
          renderFieldRadar(initialLogs);
          renderSubjectRadar(initialLogs);
          renderIndividualRadar(initialLogs);

          // 진도율 계산 및 표시
          calculateProgress(initialLogs);

          // 학습 기록 테이블 렌더링 (기본값: 최종 시간 기준 정렬)
          const sortedInitialLogs = sortLogs(initialLogs, 'final');
          renderLogTable(sortedInitialLogs);

          // 데이터 유무에 따라 날짜별 차트 섹션 표시/숨김 (초기 로드)
          const indexTrendSection = document.getElementById('indexTrendSection');
          const subjectBarSection = document.getElementById('subjectBarSection');
          if (initialLogs.length > 0) {
            if (indexTrendSection) indexTrendSection.style.display = 'block';
            if (subjectBarSection) subjectBarSection.style.display = 'block';
          } else {
            if (indexTrendSection) indexTrendSection.style.display = 'none';
            if (subjectBarSection) subjectBarSection.style.display = 'none';
          }
        });

        // ===== 진도율 계산 함수 =====
        function calculateProgress(logs) {
          // 과목 코드 매핑
          const subjectMapping = {
            bio: 'science',
            earth: 'science',
            physics: 'science',
            chem: 'science',
            soc: 'society',
            geo: 'society',
            law: 'society',
            pol: 'society',
            modern: 'korean-lit',
            classic: 'korean-lit',
            world: 'world-lit',  // world_01 ~ world_80
            world1: 'world-lit',
            world2: 'world-lit',
            people: 'person',  // people_01 ~ people_80
            people1: 'person',  // people1_01 ~ people1_40 (한국인물)
            people2: 'person',  // people2_01 ~ people2_40 (세계인물)
            person1: 'person',
            person2: 'person'
          };

          // 진도 카운트 초기화
          const progress = {
            total: 0,
            science: { total: 0, bio: 0, earth: 0, physics: 0, chem: 0 },
            society: { total: 0, soc: 0, geo: 0, law: 0, pol: 0 },
            'korean-lit': { total: 0, modern: 0, classic: 0 },
            'world-lit': { total: 0, world1: 0, world2: 0 },
            person: { total: 0, person1: 0, person2: 0 }
          };

          // 완료된 단원 집합 (중복 제거 - 정규화된 코드 사용)
          const completedUnits = new Set();

          // 단원 코드 정규화 함수 (진도율용)
          function normalizeForProgress(unit) {
            // fit_ 접두어 제거: fit_bio_01 -> bio_01
            if (unit.startsWith('fit_')) {
              unit = unit.substring(4); // 'fit_' 제거
            }
            // deep_ 접두어 제거: deep_bio_01 -> bio_01
            if (unit.startsWith('deep_')) {
              unit = unit.substring(5); // 'deep_' 제거
            }
            // on_ 접두어 제거: on_bio_01 -> bio_01
            if (unit.startsWith('on_')) {
              unit = unit.substring(3); // 'on_' 제거
            }
            // world_41~80 -> world2_01~40
            if (unit.startsWith('world_')) {
              const numMatch = unit.match(/world_([0-9]+)$/);
              if (numMatch) {
                const num = parseInt(numMatch[1]);
                if (num >= 41 && num <= 80) {
                  return 'world2_' + String(num - 40).padStart(2, '0');
                } else if (num >= 1 && num <= 40) {
                  return 'world1_' + String(num).padStart(2, '0');
                }
              }
            }
            // people_41~80 -> people2_01~40
            if (unit.startsWith('people_')) {
              const numMatch = unit.match(/people_([0-9]+)$/);
              if (numMatch) {
                const num = parseInt(numMatch[1]);
                if (num >= 41 && num <= 80) {
                  return 'people2_' + String(num - 40).padStart(2, '0');
                } else if (num >= 1 && num <= 40) {
                  return 'people1_' + String(num).padStart(2, '0');
                }
              }
            }
            return unit;
          }

          logs.forEach(log => {
            const unit = log.unit;
            if (!unit) return;

            // 정규화된 단원 코드로 중복 체크
            const normalizedUnit = normalizeForProgress(unit);
            if (completedUnits.has(normalizedUnit)) return;

            completedUnits.add(normalizedUnit);
            progress.total++;

            // 정규화된 코드에서 과목 코드 추출 (예: "bio_01" -> "bio", "world2_01" -> "world2")
            const subjectCode = normalizedUnit.match(/^[a-z]+[0-9]*/)?.[0];
            if (!subjectCode) return;

            const field = subjectMapping[subjectCode];
            if (field && progress[field]) {
              progress[field].total++;

              // world1, world2는 직접 처리
              if (subjectCode === 'world1' || subjectCode === 'world2') {
                if (progress[field][subjectCode] !== undefined) {
                  progress[field][subjectCode]++;
                }
              } else if (subjectCode === 'people1') {
                // people1_XX -> person1로 처리 (한국인물)
                if (progress[field].person1 !== undefined) {
                  progress[field].person1++;
                }
              } else if (subjectCode === 'people2') {
                // people2_XX -> person2로 처리 (세계인물)
                if (progress[field].person2 !== undefined) {
                  progress[field].person2++;
                }
              } else if (subjectCode === 'person1') {
                // person1_XX 형태 직접 처리
                if (progress[field][subjectCode] !== undefined) {
                  progress[field][subjectCode]++;
                }
              } else if (subjectCode === 'person2') {
                // person2_XX 형태 직접 처리
                if (progress[field][subjectCode] !== undefined) {
                  progress[field][subjectCode]++;
                }
              } else if (progress[field][subjectCode] !== undefined) {
                progress[field][subjectCode]++;
              }
            }
          });

          // 진도율 업데이트 함수
          function updateProgress(barId, textId, completed, total) {
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            const bar = document.getElementById(barId);
            const text = document.getElementById(textId);

            if (bar) {
              bar.style.width = percent + '%';
              if (barId.includes('total')) {
                bar.querySelector('span').textContent = percent + '%';
              }
            }
            if (text) {
              text.textContent = completed + ' / ' + total;
            }
            return percent;
          }

          function updateSubjectProgress(barId, percentId, completed, total) {
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            const bar = document.getElementById(barId);
            const percentEl = document.getElementById(percentId);

            if (bar) {
              bar.style.width = percent + '%';
            }
            if (percentEl) {
              percentEl.textContent = percent + '%';
            }
          }

          // 전체 시리즈 진도율
          const totalPercent = updateProgress('totalProgressBar', 'totalProgressTextCount', progress.total, 400);
          const totalPercentEl = document.getElementById('totalProgressTextPercent');
          if (totalPercentEl) {
            totalPercentEl.textContent = '(' + totalPercent + '%)';
          }

          // 과학분야
          const sciencePercent = updateProgress('scienceFieldBar', 'scienceFieldText', progress.science.total, 80);
          document.getElementById('scienceFieldPercent').textContent = sciencePercent + '%';
          updateSubjectProgress('bioBar', 'bioPercent', progress.science.bio, 20);
          updateSubjectProgress('earthBar', 'earthPercent', progress.science.earth, 20);
          updateSubjectProgress('physicsBar', 'physicsPercent', progress.science.physics, 20);
          updateSubjectProgress('chemBar', 'chemPercent', progress.science.chem, 20);

          // 사회분야
          const societyPercent = updateProgress('societyFieldBar', 'societyFieldText', progress.society.total, 80);
          document.getElementById('societyFieldPercent').textContent = societyPercent + '%';
          updateSubjectProgress('socBar', 'socPercent', progress.society.soc, 20);
          updateSubjectProgress('geoBar', 'geoPercent', progress.society.geo, 20);
          updateSubjectProgress('lawBar', 'lawPercent', progress.society.law, 20);
          updateSubjectProgress('polBar', 'polPercent', progress.society.pol, 20);

          // 한국문학
          const koreanLitPercent = updateProgress('koreanLitFieldBar', 'koreanLitFieldText', progress['korean-lit'].total, 80);
          document.getElementById('koreanLitFieldPercent').textContent = koreanLitPercent + '%';
          updateSubjectProgress('modernBar', 'modernPercent', progress['korean-lit'].modern, 40);
          updateSubjectProgress('classicBar', 'classicPercent', progress['korean-lit'].classic, 40);

          // 세계문학 (각 40개씩, 총 80개)
          const worldLitPercent = updateProgress('worldLitFieldBar', 'worldLitFieldText', progress['world-lit'].total, 80);
          document.getElementById('worldLitFieldPercent').textContent = worldLitPercent + '%';
          updateSubjectProgress('world1Bar', 'world1Percent', progress['world-lit'].world1, 40);
          updateSubjectProgress('world2Bar', 'world2Percent', progress['world-lit'].world2, 40);

          // 인물분야 (각 40개씩, 총 80개)
          const personPercent = updateProgress('personFieldBar', 'personFieldText', progress.person.total, 80);
          document.getElementById('personFieldPercent').textContent = personPercent + '%';
          updateSubjectProgress('person1Bar', 'person1Percent', progress.person.person1, 40);
          updateSubjectProgress('person2Bar', 'person2Percent', progress.person.person2, 40);

          console.log('진도율 계산 완료:', progress);
        }

        // ===== 뱃지 데이터는 menu.html에서 실시간 계산 =====
        // DB 저장 로직 제거: 항상 최신 학습 기록 기반으로 계산

        // 🔄 로딩 스피너 제어
        window.addEventListener('load', function() {
          const loadingOverlay = document.getElementById('loading-overlay');
          if (loadingOverlay) {
            loadingOverlay.classList.add('fade-out');
            setTimeout(() => {
              loadingOverlay.style.display = 'none';
            }, 500);
          }
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

  // 슈퍼관리자 key 또는 브랜치 관리자 세션 체크
  const isSuperAdmin = key === ADMIN_KEY;
  const isBranchAdmin = req.session && req.session.admin;

  if (!isSuperAdmin && !isBranchAdmin) {
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

// ===== 학습이력 전송 API =====
app.post("/admin/send-learning-history", async (req, res) => {
  const { key, grade, name, email, phone, pdfData } = req.body;

  // 슈퍼관리자 key 또는 브랜치 관리자 세션 체크
  const isSuperAdmin = key === ADMIN_KEY;
  const isBranchAdmin = req.session && req.session.admin;

  if (!isSuperAdmin && !isBranchAdmin) {
    return res.status(403).json({
      success: false,
      message: "관리자 인증 실패"
    });
  }

  if (!email || !pdfData) {
    return res.status(400).json({
      success: false,
      message: "이메일과 PDF 데이터가 필요합니다"
    });
  }

  try {
    // Base64 PDF 데이터를 Buffer로 변환
    const pdfBuffer = Buffer.from(pdfData.split(',')[1], 'base64');

    // 이메일 옵션 설정
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `[단단교실] ${grade} ${name} 학생 학습이력`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin-bottom: 10px;">📚 단단교실 학습이력</h1>
            <p style="color: #7f8c8d; font-size: 16px;">학생의 학습 성과를 확인해보세요</p>
          </div>

          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; padding: 25px; color: white; margin-bottom: 20px;">
            <h2 style="margin: 0 0 15px; font-size: 24px;">학생 정보</h2>
            <p style="margin: 5px 0; font-size: 18px;"><strong>학년:</strong> ${grade}</p>
            <p style="margin: 5px 0; font-size: 18px;"><strong>이름:</strong> ${name}</p>
            ${phone ? `<p style="margin: 5px 0; font-size: 16px;"><strong>연락처:</strong> ${phone}</p>` : ''}
          </div>

          <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <p style="color: #2c3e50; font-size: 15px; line-height: 1.6; margin: 0;">
              첨부된 PDF 파일에서 ${name} 학생의 상세한 학습이력과 성취도를 확인하실 수 있습니다.
              각 과목별 레이더 차트와 통계 데이터를 통해 학습 현황을 파악해보세요.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef;">
            <p style="color: #7f8c8d; font-size: 13px; margin: 0;">
              이 메일은 단단교실 관리자 시스템에서 자동으로 발송되었습니다.
            </p>
            <p style="color: #7f8c8d; font-size: 13px; margin: 5px 0 0;">
              문의사항이 있으시면 관리자에게 연락해주세요.
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `${grade}_${name}_학습이력.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    // 이메일 발송
    await transporter.sendMail(mailOptions);

    console.log(`✅ 학습이력 전송 성공: ${email} (${grade} ${name})`);

    res.json({
      success: true,
      message: "학습이력이 성공적으로 전송되었습니다"
    });

  } catch (err) {
    console.error("❌ 학습이력 전송 오류:", err);
    res.status(500).json({
      success: false,
      message: `전송 실패: ${err.message}`
    });
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
          background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
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
          background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
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

      mock_exam: `당신은 친절한 AI 국어 선생님입니다. 고등학생들의 국어 모의고사 관련 질문에 답변합니다.

⚠️ 중요: 답변 형식 규칙 (반드시 준수)
- 답변은 최대 4~5문장 이내로 간결하게 작성하세요
- 핵심만 짧게 설명하고, 필요시 추가 질문으로 대화를 이어가세요
- 개조식으로 작성할 때 최대 3~4개 항목만 제시하세요

주요 역할:
- 국어 모의고사 문제 유형 (화법과 작문, 문법, 비문학, 문학) 설명
- 문제 풀이 전략 및 팁 제공
- 국어 학습 방법 조언
- 틀린 문제에 대한 해설 및 개념 설명
- 학생들의 궁금증에 친절하게 답변

교정 내용:
- 학생의 질문을 경청하고 공감해주세요
- 복잡한 개념은 쉽게 풀어서 설명해주세요
- 격려와 함께 구체적인 조언을 제공하세요`,

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

// ===== 학습 기록 삭제 API (테스트용) =====
app.post('/api/learning-log/delete-units', async (req, res) => {
  try {
    const { grade, name, units } = req.body;

    if (!grade || !name || !units || !Array.isArray(units)) {
      return res.status(400).json({
        ok: false,
        message: 'grade, name, units(배열)이 필요합니다'
      });
    }

    // 특정 단원들의 학습 기록을 소프트 삭제
    const result = await LearningLog.updateMany(
      {
        grade,
        name,
        unit: { $in: units },
        deleted: false
      },
      {
        $set: { deleted: true }
      }
    );

    res.json({
      ok: true,
      message: `${result.modifiedCount}개의 학습 기록이 삭제되었습니다`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('학습 기록 삭제 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다',
      error: error.message
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

// ==========================================
// 사용자 진행 데이터 API
// ==========================================

// 사용자 데이터 조회
app.get('/api/user-progress', async (req, res) => {
  try {
    const { grade, name } = req.query;

    if (!grade || !name) {
      return res.status(400).json({
        ok: false,
        message: 'grade와 name 파라미터가 필요합니다'
      });
    }

    // unitProgress 제외하고 필요한 필드만 조회 (성능 최적화 - 1.3MB → 수KB)
    let progress = await UserProgress.findOne(
      { grade, name },
      { unitProgress: 0 }  // unitProgress 제외
    ).lean();

    // 데이터가 없으면 초기 데이터 생성
    if (!progress) {
      const newProgress = new UserProgress({
        grade,
        name,
        vocabularyQuiz: {
          totalScore: 0,
          quizCount: 0,
          avgScore: 0,
          totalCoins: 0,
          usedCoins: 0,
          currentRank: 0,
          previousRank: 0
        },
        studyRoom: {
          assignedTasks: []
        }
      });
      await newProgress.save();
      progress = newProgress.toObject();
      delete progress.unitProgress;
    }

    res.json({
      ok: true,
      data: progress
    });
  } catch (error) {
    console.error('사용자 데이터 조회 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 어휘퀴즈 데이터 저장
app.post('/api/user-progress/vocabulary', async (req, res) => {
  try {
    const { grade, name, vocabularyData } = req.body;

    if (!grade || !name || !vocabularyData) {
      return res.status(400).json({
        ok: false,
        message: 'grade, name, vocabularyData가 필요합니다'
      });
    }

    let progress = await UserProgress.findOne({ grade, name });

    if (!progress) {
      progress = new UserProgress({ grade, name });
    }

    // 어휘퀴즈 데이터 업데이트
    progress.vocabularyQuiz = {
      ...progress.vocabularyQuiz.toObject(),
      ...vocabularyData,
      lastRankUpdate: vocabularyData.lastRankUpdate || progress.vocabularyQuiz.lastRankUpdate
    };

    await progress.save();

    res.json({
      ok: true,
      message: '어휘퀴즈 데이터가 저장되었습니다',
      data: progress
    });
  } catch (error) {
    console.error('어휘퀴즈 데이터 저장 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 어휘학습 이력 저장 API
app.post('/api/user-progress/vocabulary-history/add', async (req, res) => {
  try {
    const { grade, name, historyData } = req.body;

    if (!grade || !name || !historyData) {
      return res.status(400).json({
        ok: false,
        message: 'grade, name, historyData가 필요합니다'
      });
    }

    const { vocabCount, correctAnswers, totalQuestions, score } = historyData;

    if (!vocabCount || correctAnswers === undefined || !totalQuestions || score === undefined) {
      return res.status(400).json({
        ok: false,
        message: '어휘학습 이력 데이터가 올바르지 않습니다'
      });
    }

    let progress = await UserProgress.findOne({ grade, name });

    if (!progress) {
      progress = new UserProgress({ grade, name });
    }

    // 이력 추가 (최신순으로 유지하기 위해 배열 앞에 추가)
    progress.vocabularyQuizHistory.unshift({
      date: new Date(),
      vocabCount,
      correctAnswers,
      totalQuestions,
      score
    });

    await progress.save();

    res.json({
      ok: true,
      message: '어휘학습 이력이 저장되었습니다',
      data: progress.vocabularyQuizHistory
    });
  } catch (error) {
    console.error('어휘학습 이력 저장 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 어휘학습 이력 조회 API
app.get('/api/user-progress/vocabulary-history', async (req, res) => {
  try {
    const { grade, name, offset = 0, limit = 10 } = req.query;

    if (!grade || !name) {
      return res.status(400).json({
        ok: false,
        message: 'grade와 name이 필요합니다'
      });
    }

    const progress = await UserProgress.findOne({ grade, name });

    if (!progress) {
      return res.json({
        ok: true,
        history: [],
        total: 0,
        hasMore: false
      });
    }

    const offsetNum = parseInt(offset) || 0;
    const limitNum = parseInt(limit) || 10;

    // 이미 최신순으로 저장되어 있음
    const history = progress.vocabularyQuizHistory || [];
    const total = history.length;
    const slicedHistory = history.slice(offsetNum, offsetNum + limitNum);
    const hasMore = (offsetNum + limitNum) < total;

    res.json({
      ok: true,
      history: slicedHistory,
      total,
      hasMore
    });
  } catch (error) {
    console.error('어휘학습 이력 조회 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 오늘 날짜 어휘퀴즈 완료 여부 확인 API
app.get('/api/user-progress/vocabulary-history/today', async (req, res) => {
  try {
    const { grade, name } = req.query;

    if (!grade || !name) {
      return res.status(400).json({
        ok: false,
        message: 'grade와 name이 필요합니다'
      });
    }

    const progress = await UserProgress.findOne({ grade, name });

    if (!progress || !progress.vocabularyQuizHistory || progress.vocabularyQuizHistory.length === 0) {
      return res.json({
        ok: true,
        completedToday: false
      });
    }

    // 오늘 날짜 범위 계산 (KST 기준 00:00:00 ~ 23:59:59)
    // 서버가 UTC로 실행되는 경우 한국 시간과 9시간 차이가 발생하므로 KST 기준으로 계산
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000; // KST = UTC + 9시간
    const kstNow = new Date(now.getTime() + kstOffset);

    // KST 기준 오늘 00:00:00 (UTC 기준으로 변환하면 전날 15:00:00)
    const kstTodayStart = new Date(Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate(), 0, 0, 0) - kstOffset);
    // KST 기준 오늘 23:59:59 (UTC 기준으로 변환하면 당일 14:59:59)
    const kstTodayEnd = new Date(Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate(), 23, 59, 59) - kstOffset);

    // 오늘 날짜에 학습이력이 있는지 확인 (KST 기준)
    const todayHistory = progress.vocabularyQuizHistory.find(history => {
      const historyDate = new Date(history.date);
      return historyDate >= kstTodayStart && historyDate <= kstTodayEnd;
    });

    res.json({
      ok: true,
      completedToday: !!todayHistory,
      latestHistory: todayHistory || null
    });
  } catch (error) {
    console.error('오늘 어휘학습 이력 확인 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다',
      error: error.message
    });
  }
});

// ========== 독서 감상문 API ==========

// 독서 감상문 제출
app.post('/api/user-progress/reading-reports/submit', async (req, res) => {
  try {
    const { grade, name, title, content, type, storyId, storyTitle } = req.body;

    if (!grade || !name || !title || !content || !type) {
      return res.status(400).json({
        ok: false,
        message: '모든 필드가 필요합니다'
      });
    }

    // 현재 월 계산
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let progress = await UserProgress.findOne({ grade, name });

    if (!progress) {
      progress = new UserProgress({
        grade,
        name,
        readingReports: []
      });
    }

    if (!progress.readingReports) {
      progress.readingReports = [];
    }

    // 새로운 리포트 추가
    progress.readingReports.push({
      title,
      content,
      type,
      storyId: storyId || 'whale_island',
      storyTitle: storyTitle || '푸른 고래섬의 비밀 모험단 시즌 1: 푸른 고래섬 탐험',
      submittedAt: new Date(),
      month
    });

    await progress.save();

    res.json({
      ok: true,
      message: '독서 감상문이 제출되었습니다',
      reportId: progress.readingReports[progress.readingReports.length - 1]._id
    });
  } catch (error) {
    console.error('독서 감상문 제출 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류',
      error: error.message
    });
  }
});

// 독서 감상문 이력 조회
app.get('/api/user-progress/reading-reports/history', async (req, res) => {
  try {
    const { grade, name } = req.query;

    if (!grade || !name) {
      return res.status(400).json({
        ok: false,
        message: 'grade와 name이 필요합니다'
      });
    }

    const progress = await UserProgress.findOne({ grade, name });

    if (!progress || !progress.readingReports) {
      return res.json({
        ok: true,
        reports: []
      });
    }

    // 최신순으로 정렬
    const reports = progress.readingReports
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    res.json({
      ok: true,
      reports
    });
  } catch (error) {
    console.error('독서 감상문 이력 조회 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류',
      error: error.message
    });
  }
});

// 이번 달 제출 개수 확인
app.get('/api/user-progress/reading-reports/monthly-count', async (req, res) => {
  try {
    const { grade, name } = req.query;

    if (!grade || !name) {
      return res.status(400).json({
        ok: false,
        message: 'grade와 name이 필요합니다'
      });
    }

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const progress = await UserProgress.findOne({ grade, name });

    if (!progress || !progress.readingReports) {
      return res.json({
        ok: true,
        count: 0
      });
    }

    // 이번 달 제출 개수 계산
    const count = progress.readingReports.filter(report => report.month === currentMonth).length;

    res.json({
      ok: true,
      count
    });
  } catch (error) {
    console.error('월간 제출 개수 확인 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류',
      error: error.message
    });
  }
});

// ===== Multer 설정 (이미지 업로드용) =====
// 임시 이미지 저장을 위한 디렉토리 생성
const tempUploadsDir = path.join(__dirname, 'public', 'temp-uploads');
if (!fs.existsSync(tempUploadsDir)) {
  fs.mkdirSync(tempUploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempUploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'reading-report-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 제한
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다 (jpeg, jpg, png)'));
    }
  }
});

// 임시 이미지 업로드 API
app.post('/api/upload-temp-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: '이미지 파일이 없습니다'
      });
    }

    // 공개 URL 생성
    const imageUrl = `${req.protocol}://${req.get('host')}/temp-uploads/${req.file.filename}`;

    console.log('📤 임시 이미지 업로드 성공:', imageUrl);

    // 1시간 후 자동 삭제 스케줄
    setTimeout(() => {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('임시 이미지 삭제 실패:', err);
        } else {
          console.log('✅ 임시 이미지 자동 삭제:', req.file.filename);
        }
      });
    }, 60 * 60 * 1000); // 1시간

    res.json({
      ok: true,
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    res.status(500).json({
      ok: false,
      message: '이미지 업로드 중 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 창의활동 데이터 조회 (unitProgress에서 creativeState 추출)
app.get('/api/user-progress/creative-activities', async (req, res) => {
  try {
    const { grade, name } = req.query;

    if (!grade || !name) {
      return res.status(400).json({
        ok: false,
        message: 'grade와 name이 필요합니다'
      });
    }

    // unitProgress만 조회
    const progress = await UserProgress.findOne(
      { grade, name },
      { unitProgress: 1, lastUpdated: 1 }
    );

    console.log('[creative-activities] 조회:', grade, name, '결과:', progress ? '있음' : '없음');

    if (!progress || !progress.unitProgress) {
      return res.json({
        ok: true,
        data: []
      });
    }

    // unitProgress에서 creativeState가 있는 단원만 추출
    const creativeActivities = [];
    const unitProgressMap = progress.unitProgress instanceof Map
      ? progress.unitProgress
      : new Map(Object.entries(progress.unitProgress));

    console.log('[creative-activities] unitProgress 키 개수:', unitProgressMap.size);

    unitProgressMap.forEach((unitData, unitCode) => {
      // creativeState가 있고, text가 있는 경우 (isSubmitted 조건 완화)
      if (unitData && unitData.creativeState && unitData.creativeState.text) {
        const creativeState = unitData.creativeState;
        creativeActivities.push({
          unit: unitCode,
          text: creativeState.text || '',
          topic: creativeState.topic || '자유 글쓰기',
          submittedAt: creativeState.submittedAt || unitData.updatedAt || progress.lastUpdated || new Date()
        });
        console.log('[creative-activities] 추가:', unitCode, '글자수:', (creativeState.text || '').length);
      }
    });

    // 제출일시 기준 최신순 정렬
    creativeActivities.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    console.log('[creative-activities] 총 개수:', creativeActivities.length);

    res.json({
      ok: true,
      data: creativeActivities
    });
  } catch (error) {
    console.error('창의활동 데이터 조회 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 학습실 과제 데이터 조회
app.get('/api/user-progress/study-room', async (req, res) => {
  try {
    const { grade, name } = req.query;

    if (!grade || !name) {
      return res.status(400).json({
        ok: false,
        message: 'grade와 name이 필요합니다'
      });
    }

    // unitProgress 제외하고 필요한 필드만 조회 (성능 최적화)
    const progress = await UserProgress.findOne(
      { grade, name },
      { studyRoom: 1, completedPages: 1, grade: 1, name: 1 }
    ).lean();

    if (!progress) {
      return res.json({
        ok: true,
        data: {
          studyRoom: {
            assignedTasks: []
          }
        }
      });
    }

    res.json({
      ok: true,
      data: progress
    });
  } catch (error) {
    console.error('학습실 데이터 조회 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 학습실 과제 데이터 저장
app.post('/api/user-progress/study-room', async (req, res) => {
  try {
    const { grade, name, assignedTasks, studyRoomData } = req.body;

    if (!grade || !name) {
      return res.status(400).json({
        ok: false,
        message: 'grade, name이 필요합니다'
      });
    }

    let progress = await UserProgress.findOne({ grade, name });

    if (!progress) {
      progress = new UserProgress({ grade, name });
    }

    // 학습실 데이터 업데이트 (assignedTasks 또는 studyRoomData 지원)
    if (assignedTasks) {
      progress.studyRoom = {
        assignedTasks: assignedTasks
      };
    } else if (studyRoomData) {
      progress.studyRoom = studyRoomData;
    }

    await progress.save();

    res.json({
      ok: true,
      message: '학습실 데이터가 저장되었습니다',
      data: progress
    });
  } catch (error) {
    console.error('학습실 데이터 저장 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다',
      error: error.message
    });
  }
});

// AI 추천 과제 복습 완료 처리 API
app.post('/api/user-progress/ai-task/complete', async (req, res) => {
  try {
    const { grade, name, unitId } = req.body;

    if (!grade || !name || !unitId) {
      return res.status(400).json({
        ok: false,
        message: 'grade, name, unitId가 필요합니다'
      });
    }

    const progress = await UserProgress.findOne({ grade, name });

    if (!progress) {
      return res.json({
        ok: true,
        message: '사용자 데이터가 없습니다'
      });
    }

    // 학습실 과제 중에서 해당 단원의 AI 추천 과제 찾기
    const tasks = progress.studyRoom?.assignedTasks || [];
    let updated = false;

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      // AI 과제이면서 해당 단원인 경우
      if (task.isAI && task.id === unitId) {
        task.status = 'completed';
        task.completedAt = new Date();
        updated = true;
        console.log(`✅ AI 과제 복습 완료: ${grade} ${name} - ${unitId}`);
      }
    }

    if (updated) {
      await progress.save();
      res.json({
        ok: true,
        message: 'AI 추천 과제 복습이 완료되었습니다'
      });
    } else {
      res.json({
        ok: true,
        message: '해당 단원의 AI 추천 과제가 없습니다'
      });
    }

  } catch (error) {
    console.error('AI 과제 복습 완료 처리 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다',
      error: error.message
    });
  }
});

// AI 추천과제 목록 조회 API (관리자 전용)
app.get('/api/admin/ai-tasks', async (req, res) => {
  try {
    const { key } = req.query;

    // 관리자 키 확인
    if (key !== ADMIN_KEY) {
      return res.status(403).json({
        ok: false,
        message: '관리자 권한이 없습니다'
      });
    }

    // 모든 UserProgress에서 AI 추천과제만 추출
    const allProgress = await UserProgress.find({});

    const aiTasksList = [];

    for (const progress of allProgress) {
      const aiTasks = progress.studyRoom?.assignedTasks?.filter(t => t.isAI) || [];

      // User 모델에서 academyName 가져오기
      const user = await User.findOne({ grade: progress.grade, name: progress.name });
      const academyName = user?.academyName || progress.school || '-';

      aiTasks.forEach(task => {
        aiTasksList.push({
          grade: progress.grade,
          name: progress.name,
          school: progress.school || '-',
          academyName: academyName,
          taskTitle: task.title,
          series: task.series,
          field: task.field || task.domain,
          subject: task.subject,
          assignedAt: task.assignedAt,
          status: task.status,
          unitId: task.id || task.unitId
        });
      });
    }

    // 부여시간 기준 최신순 정렬
    aiTasksList.sort((a, b) => {
      const dateA = new Date(a.assignedAt || 0);
      const dateB = new Date(b.assignedAt || 0);
      return dateB - dateA;
    });

    res.json({
      ok: true,
      tasks: aiTasksList,
      total: aiTasksList.length
    });

  } catch (error) {
    console.error('AI 추천과제 목록 조회 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 데이터 개수 확인 API (관리자 전용)
app.get('/api/check-data-count', async (req, res) => {
  try {
    const { key } = req.query;

    // 관리자 키 확인
    if (key !== ADMIN_KEY) {
      return res.status(403).json({
        success: false,
        message: '관리자 권한이 없습니다'
      });
    }

    const usersCount = await User.countDocuments({});
    const logsCount = await LearningLog.countDocuments({});

    let progressCount = 0;
    try {
      progressCount = await UserProgress.countDocuments({});
    } catch (e) {
      console.log('UserProgress 조회 중 오류:', e.message);
    }

    res.json({
      success: true,
      users: usersCount,
      learningLogs: logsCount,
      userProgress: progressCount,
      total: usersCount + logsCount + progressCount
    });

  } catch (err) {
    console.error('데이터 개수 확인 에러:', err);
    res.status(500).json({
      success: false,
      message: '데이터 확인 중 오류가 발생했습니다: ' + err.message
    });
  }
});

// 전체 데이터 삭제 API (관리자 전용)
app.post('/api/delete-all-data', async (req, res) => {
  try {
    const { key } = req.body;

    // 관리자 키 확인
    if (key !== ADMIN_KEY) {
      return res.status(403).json({
        success: false,
        message: '관리자 권한이 없습니다'
      });
    }

    // 모든 회원 삭제
    const usersResult = await User.deleteMany({});

    // 모든 학습 기록 삭제
    const logsResult = await LearningLog.deleteMany({});

    // UserProgress 컬렉션도 삭제 (있다면)
    let progressResult = { deletedCount: 0 };
    try {
      progressResult = await UserProgress.deleteMany({});
    } catch (e) {
      console.log('UserProgress 삭제 중 오류 (컬렉션이 없을 수 있음):', e.message);
    }

    console.log(`🗑️ 전체 데이터 삭제 완료: 회원 ${usersResult.deletedCount}명, 학습기록 ${logsResult.deletedCount}개, 진도 ${progressResult.deletedCount}개`);

    res.json({
      success: true,
      deletedUsers: usersResult.deletedCount,
      deletedRecords: logsResult.deletedCount,
      deletedProgress: progressResult.deletedCount
    });

  } catch (err) {
    console.error('전체 데이터 삭제 에러:', err);
    res.status(500).json({
      success: false,
      message: '데이터 삭제 중 오류가 발생했습니다: ' + err.message
    });
  }
});

// 학습실 데이터 삭제 API
app.post('/api/user-progress/clear-study-room', async (req, res) => {
  try {
    const { grade, name } = req.body;

    if (!grade || !name) {
      return res.status(400).json({
        ok: false,
        message: 'grade, name이 필요합니다'
      });
    }

    const progress = await UserProgress.findOne({ grade, name });

    if (!progress) {
      return res.json({
        ok: true,
        message: '해당 학생의 데이터가 없습니다'
      });
    }

    // 학습실 데이터 초기화
    progress.studyRoom = {
      assignedTasks: []
    };

    await progress.save();

    res.json({
      ok: true,
      message: '학습실 데이터가 삭제되었습니다'
    });
  } catch (error) {
    console.error('학습실 데이터 삭제 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// 종합리포트 뱃지 데이터 저장
app.post('/api/user-progress/report-badge', async (req, res) => {
  try {
    const { grade, name, radarAvg, totalProgress } = req.body;

    if (!grade || !name || radarAvg === undefined || totalProgress === undefined) {
      return res.status(400).json({
        ok: false,
        message: 'grade, name, radarAvg, totalProgress가 필요합니다'
      });
    }

    let progress = await UserProgress.findOne({ grade, name });

    if (!progress) {
      progress = new UserProgress({ grade, name });
    }

    // 종합리포트 뱃지 데이터 업데이트
    progress.reportBadge = {
      radarAvg: Number(radarAvg),
      totalProgress: Number(totalProgress),
      lastUpdated: new Date()
    };

    await progress.save();

    res.json({
      ok: true,
      message: '종합리포트 뱃지 데이터가 저장되었습니다',
      data: progress.reportBadge
    });
  } catch (error) {
    console.error('종합리포트 뱃지 저장 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// 메뉴 완료 상태 저장
app.post('/api/user-progress/menu-completion', async (req, res) => {
  try {
    const { grade, name, completionData } = req.body;

    if (!grade || !name || !completionData) {
      return res.status(400).json({
        ok: false,
        message: 'grade, name, completionData가 필요합니다'
      });
    }

    let progress = await UserProgress.findOne({ grade, name });

    if (!progress) {
      progress = new UserProgress({ grade, name });
    }

    // 메뉴 완료 상태 업데이트
    progress.menuCompletion = new Map(Object.entries(completionData));

    await progress.save();

    res.json({
      ok: true,
      message: '메뉴 완료 상태가 저장되었습니다',
      data: progress
    });
  } catch (error) {
    console.error('메뉴 완료 상태 저장 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다',
      error: error.message
    });
  }
});

/* ====================================
 * ✅ 자동과제부여 설정 API
 * ==================================== */

// 자동과제부여 설정 스키마
const autoTaskSettingsSchema = new mongoose.Schema({
  grade: { type: String, required: true },
  name: { type: String, required: true },
  series: [{ type: String }],        // 선택된 시리즈 ('up', 'fit')
  days: [{ type: String }],          // 선택된 요일 (0~6, 'everyday')
  taskCount: { type: Number, default: 3 }, // 과제 개수
  status: { type: String, enum: ['running', 'paused', 'stopped'], default: 'stopped' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
autoTaskSettingsSchema.index({ grade: 1, name: 1 }, { unique: true });
const AutoTaskSettings = mongoose.model('AutoTaskSettings', autoTaskSettingsSchema);

// 자동과제부여 설정 조회
app.get('/api/auto-task-settings', async (req, res) => {
  try {
    const { grade, name } = req.query;
    if (!grade || !name) {
      return res.status(400).json({ ok: false, message: 'grade, name이 필요합니다' });
    }

    const settings = await AutoTaskSettings.findOne({ grade, name });
    res.json({ ok: true, settings: settings || null });
  } catch (error) {
    console.error('자동과제부여 설정 조회 오류:', error);
    res.status(500).json({ ok: false, message: '서버 오류가 발생했습니다' });
  }
});

// 자동과제부여 설정 저장
app.post('/api/auto-task-settings', async (req, res) => {
  try {
    const { grade, name, settings } = req.body;
    if (!grade || !name || !settings) {
      return res.status(400).json({ ok: false, message: 'grade, name, settings가 필요합니다' });
    }

    // 기존 설정 조회 (설정 변경 여부 확인용)
    const existingSettings = await AutoTaskSettings.findOne({ grade, name });

    // 설정이 변경되었는지 확인 (시리즈, 요일, 개수 변경 시)
    const settingsChanged = existingSettings && (
      JSON.stringify(existingSettings.series?.sort()) !== JSON.stringify(settings.series?.sort()) ||
      JSON.stringify(existingSettings.days?.sort()) !== JSON.stringify(settings.days?.sort()) ||
      existingSettings.taskCount !== settings.taskCount
    );

    // 설정이 변경되었으면 기존 자동부여 과제 삭제
    if (settingsChanged || settings.status === 'running') {
      console.log(`🗑️ [${grade} ${name}] 자동과제부여 설정 변경 - 기존 자동부여 과제 삭제`);

      // 학습실에서 isAutoAssigned === true인 과제만 삭제 (일반 과제는 유지)
      const userProgress = await UserProgress.findOne({ grade, name });
      if (userProgress?.studyRoom?.assignedTasks) {
        const manualTasks = userProgress.studyRoom.assignedTasks.filter(task => !task.isAutoAssigned);
        const deletedCount = userProgress.studyRoom.assignedTasks.length - manualTasks.length;

        await UserProgress.updateOne(
          { grade, name },
          { $set: { 'studyRoom.assignedTasks': manualTasks } }
        );

        console.log(`  ✅ ${deletedCount}개 자동부여 과제 삭제 완료`);
      }
    }

    const updatedSettings = await AutoTaskSettings.findOneAndUpdate(
      { grade, name },
      {
        ...settings,
        grade,
        name,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // "시작" 상태이면 바로 자동과제부여 실행
    if (settings.status === 'running') {
      console.log(`▶️ [${grade} ${name}] 자동과제부여 즉시 실행`);
      // 비동기로 자동과제 부여 실행 (응답은 먼저 보냄)
      executeAutoTaskForStudent(grade, name, updatedSettings).catch(err => {
        console.error(`❌ [${grade} ${name}] 자동과제부여 실행 오류:`, err);
      });
    }

    res.json({ ok: true, settings: updatedSettings });
  } catch (error) {
    console.error('자동과제부여 설정 저장 오류:', error);
    res.status(500).json({ ok: false, message: '서버 오류가 발생했습니다' });
  }
});

/* ====================================
 * ✅ AI 자동 과제 부여 시스템
 * ==================================== */

// AI 과제 스케줄 스키마
const aiTaskScheduleSchema = new mongoose.Schema({
  studentGrade: { type: String, required: true },
  studentName: { type: String, required: true },
  unitId: { type: String, required: true },
  unitTitle: { type: String, required: true },
  seriesName: { type: String, required: true },
  fieldName: { type: String, required: true },
  subjectName: { type: String, required: true },
  grade: { type: String, required: true }, // 등급: excellent, good, average, encourage
  gradeText: { type: String, required: true }, // 등급 텍스트: 우수, 양호, 보통, 격려
  avgScore: { type: Number, required: true }, // 평균 점수
  completedAt: { type: Date, required: true }, // 학습 완료 날짜
  scheduledDate: { type: Date, required: true }, // 부여 예정 날짜
  assignedAt: { type: Date }, // 실제 부여된 날짜
  status: {
    type: String,
    enum: ['pending', 'assigned', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

const AITaskSchedule = mongoose.model('AITaskSchedule', aiTaskScheduleSchema);

// 등급 판정 함수 (menu.html과 동일한 로직)
// AI 추천과제 부여 시간 설정
function getGradeInfo(avgScore) {
  if (avgScore >= 9) {
    return { grade: 'excellent', text: '우수', hours: 0 }; // 우수는 부여 안 함
  } else if (avgScore >= 8) {
    return { grade: 'good', text: '양호', hours: 336 }; // 양호: 14일(336시간) 후
  } else if (avgScore >= 7) {
    return { grade: 'average', text: '보통', hours: 168 }; // 보통: 7일(168시간) 후
  } else {
    return { grade: 'encourage', text: '격려', hours: 72 }; // 격려: 3일(72시간) 후
  }
}

// [DEPRECATED] AI 과제 스케줄 생성/업데이트 API
// 이제 assignAITasksDaily()가 LearningLog 테이블에서 직접 데이터를 읽어 과제를 부여함
// 클라이언트에서 더 이상 이 API를 호출하지 않음
app.post('/api/ai-task/create-schedule', async (req, res) => {
  try {
    const {
      studentGrade,
      studentName,
      unitId,
      unitTitle,
      seriesName,
      fieldName,
      subjectName,
      avgScore,
      completedAt
    } = req.body;

    // 등급 판정
    const gradeInfo = getGradeInfo(avgScore);

    // 우수 등급은 스케줄 생성 안 함
    if (gradeInfo.grade === 'excellent') {
      return res.json({
        ok: true,
        message: '우수 등급은 재학습이 필요하지 않습니다',
        schedule: null
      });
    }

    // 부여 예정 날짜 계산 - 현재 시간 기준으로 계산 (복습 완료 시점 = 지금)
    const now = new Date();
    const scheduledDate = new Date(now);
    // 등급별 일정 적용: 격려 24시간, 보통 48시간, 양호 72시간
    scheduledDate.setHours(scheduledDate.getHours() + gradeInfo.hours);

    // 기존 스케줄 확인 (같은 학생, 같은 단원)
    let schedule = await AITaskSchedule.findOne({
      studentGrade,
      studentName,
      unitId,
      status: { $in: ['pending', 'assigned'] }
    });

    if (schedule) {
      // 기존 스케줄 업데이트
      schedule.grade = gradeInfo.grade;
      schedule.gradeText = gradeInfo.text;
      schedule.avgScore = avgScore;
      schedule.completedAt = now;  // 현재 시간 (복습 완료 시점)
      schedule.scheduledDate = scheduledDate;
      schedule.status = 'pending';
      schedule.assignedAt = null;
      await schedule.save();
    } else {
      // 새 스케줄 생성
      schedule = await AITaskSchedule.create({
        studentGrade,
        studentName,
        unitId,
        unitTitle,
        seriesName,
        fieldName,
        subjectName,
        grade: gradeInfo.grade,
        gradeText: gradeInfo.text,
        avgScore,
        completedAt: now,  // 현재 시간 (복습 완료 시점)
        scheduledDate
      });
    }

    res.json({
      ok: true,
      message: 'AI 과제 스케줄이 생성되었습니다',
      schedule
    });

  } catch (error) {
    console.error('AI 과제 스케줄 생성 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다',
      error: error.message
    });
  }
});

// 매일 자정 실행: AI 과제 자동 부여 (LearningLog 테이블 기준)
// - 최종완료 시간과 최종등급을 기준으로 AI 추천과제 부여
// - 격려: 24시간 후, 보통: 48시간 후, 양호: 72시간 후, 우수: 부여 안 함
async function assignAITasksDaily() {
  try {
    console.log('🤖 [NEW] AI 자동 과제 부여 시작 (LearningLog 기준):', new Date().toISOString());

    const now = new Date();

    // 모든 LearningLog 조회 (completed된 것만)
    const allLogs = await LearningLog.find({ completed: true, deleted: { $ne: true } });
    console.log(`📚 조회된 학습 로그 수: ${allLogs.length}개`);

    // 학생별로 그룹화 (grade + name 조합)
    const studentLogsMap = {};
    for (const log of allLogs) {
      const studentKey = `${log.grade}::${log.name}`;
      if (!studentLogsMap[studentKey]) {
        studentLogsMap[studentKey] = {
          grade: log.grade,
          name: log.name,
          logs: []
        };
      }
      studentLogsMap[studentKey].logs.push(log);
    }

    const studentKeys = Object.keys(studentLogsMap);
    console.log(`👥 처리할 학생 수: ${studentKeys.length}명`);

    for (const studentKey of studentKeys) {
      const studentData = studentLogsMap[studentKey];
      const { grade, name, logs } = studentData;

      if (!logs || logs.length === 0) continue;

      // 단원별로 최신 기록만 추출 (최종완료 시간 = timestamp or aiReviewCompletedAt 중 최신)
      const unitLatestLogs = {};

      for (const log of logs) {
        let unitId = log.unit;
        if (!unitId || !log.radar) continue;

        // 🔧 unit 코드 정규화: world2_XX → world_4X
        // LearningLog에 world2_01 같은 코드가 저장되어 있지만, 실제 파일은 world_41.html
        // (인물은 people2_XX.html 파일이 실제로 존재하므로 변환하지 않음)
        if (unitId.startsWith('world2_')) {
          const num = parseInt(unitId.replace('world2_', ''), 10);
          unitId = `world_${num + 40}`;
          console.log(`🔄 [${name}] 코드 변환: ${log.unit} → ${unitId}`);
        }

        // 최종완료 시간 = 학습 완료 시간 (timestamp) 기준으로만 계산
        // 학습 기록 목록에서 보여주는 예정 시간과 동일하게 적용
        const finalCompletedAt = log.timestamp ? new Date(log.timestamp) : new Date(0);

        // 평균 점수 계산
        const scores = [
          log.radar.literal || 0,
          log.radar.structural || 0,
          log.radar.lexical || 0,
          log.radar.inferential || 0,
          log.radar.critical || 0
        ];
        const avgScore = scores.reduce((a, b) => a + b, 0) / 5;

        // 단원별 최신 기록만 유지 (timestamp 기준)
        const existingEntry = unitLatestLogs[unitId];
        if (!existingEntry || finalCompletedAt.getTime() > existingEntry.finalCompletedAt.getTime()) {
          unitLatestLogs[unitId] = {
            unitId,
            originalUnit: log.unit, // 원본 unit 코드 보존 (title 생성용)
            avgScore,
            finalCompletedAt,
            series: log.series
          };
        }
      }

      // UserProgress 조회
      let progress = await UserProgress.findOne({ grade, name });
      if (!progress) {
        progress = new UserProgress({
          grade,
          name,
          studyRoom: { assignedTasks: [] }
        });
      }

      // 기존 학습실 과제 목록
      const existingTasks = progress.studyRoom?.assignedTasks || [];
      // 기존 과제의 unitId 추출 (./BRAINUP/science/bio_02.html -> bio_02, 또는 bio_02 그대로)
      const existingUnitIds = new Set(existingTasks.map(t => {
        const taskId = t.unitId || t.id;
        // ./BRAINUP/xxx/yyy.html 형식에서 unit 코드 추출
        const match = taskId.match(/([a-z]+\d*_\d+)\.html$/i);
        if (match) return match[1];
        // 이미 unit 코드 형식이면 그대로 반환
        return taskId;
      }));

      let assignedCount = 0;

      // 디버그: 기존 학습실 과제 ID 출력
      console.log(`🔍 [${name}] 기존 학습실 과제 IDs:`, Array.from(existingUnitIds));

      // 각 단원의 최종등급과 최종완료 시간 확인
      for (const unitId in unitLatestLogs) {
        const unitInfo = unitLatestLogs[unitId];
        const { avgScore, finalCompletedAt, series } = unitInfo;

        // 등급 판정
        const gradeInfo = getGradeInfo(avgScore);

        // 우수 등급은 AI 과제 부여 안 함
        if (gradeInfo.grade === 'excellent') {
          console.log(`⏭️ [${name}] ${unitId}: 우수 등급 → 스킵`);
          continue;
        }

        // 이미 학습실에 있으면 스킵
        if (existingUnitIds.has(unitId)) {
          console.log(`⏭️ [${name}] ${unitId}: 이미 학습실에 있음 → 스킵`);
          continue;
        }

        // 등급별 대기 시간 계산
        const waitHours = gradeInfo.hours;
        const assignableAt = new Date(finalCompletedAt.getTime() + waitHours * 60 * 60 * 1000);

        // 현재 시간이 부여 가능 시간을 지났는지 확인
        console.log(`🕐 [${name}] ${unitId}: 등급=${gradeInfo.text}, 대기=${waitHours}시간, 부여가능시간=${assignableAt.toISOString()}, 현재=${now.toISOString()}`);
        if (now >= assignableAt) {
          // 단원 정보 추출 (원본 unit 코드에서 파싱 - title 생성용)
          const originalUnit = unitInfo.originalUnit || unitId;
          const parts = originalUnit.split('_');
          const subjectCode = parts[0];
          const unitNumber = parts[1] ? parseInt(parts[1], 10) : 1;

          // 과목명 매핑 (world1, world2를 구분하여 세계문학1, 세계문학2로 표시)
          const subjectMap = {
            'geo': '지리', 'bio': '생물', 'earth': '지구과학', 'physics': '물리', 'chem': '화학',
            'soc': '사회문화', 'law': '법', 'pol': '정치경제',
            'modern': '현대문학', 'classic': '고전문학',
            'world1': '세계문학1', 'world2': '세계문학2', 'world': '세계문학1',
            'person1': '한국인물', 'person2': '세계인물', 'people': '한국인물',
            'people1': '한국인물', 'people2': '세계인물'
          };
          const subjectName = subjectMap[subjectCode] || subjectCode;

          // 분야명 매핑
          const fieldMap = {
            'geo': '사회', 'soc': '사회', 'law': '사회', 'pol': '사회',
            'bio': '과학', 'earth': '과학', 'physics': '과학', 'chem': '과학',
            'modern': '한국문학', 'classic': '한국문학',
            'world1': '세계문학', 'world2': '세계문학', 'world': '세계문학',
            'person1': '인물', 'person2': '인물', 'people': '인물',
            'people1': '인물', 'people2': '인물'
          };
          const fieldName = fieldMap[subjectCode] || '기타';

          // 단원명 생성 (원본 단원번호 그대로 사용, +40 변환 제거)
          const unitTitle = `${subjectName} ${unitNumber}`;

          // 학습실에 추가
          existingTasks.push({
            id: unitId,
            title: unitTitle,
            series: series || 'BRAINUP',
            field: fieldName,
            subject: subjectName,
            isAI: true,
            assignedAt: now,
            originalGrade: gradeInfo.text // 원래 등급 기록
          });

          existingUnitIds.add(unitId);
          assignedCount++;

          // 🔥 LearningLog에도 aiTaskAssignedAt 저장 (학습 기록 테이블에 표시)
          await LearningLog.updateOne(
            { grade, name, unit: unitId },
            { $set: { aiTaskAssignedAt: now } }
          );

          console.log(`✅ [${name}] AI 과제 부여: ${unitTitle} (${gradeInfo.text}, 최종완료: ${finalCompletedAt.toLocaleString('ko-KR')})`);
        }
      }

      if (assignedCount > 0) {
        // UserProgress 저장
        progress.studyRoom = {
          assignedTasks: existingTasks,
          lastAIAssignedAt: now
        };
        await progress.save();

        console.log(`🎉 ${name} 학생에게 ${assignedCount}개 AI 과제 부여 완료`);
      }
    }

    console.log('🤖 [NEW] AI 자동 과제 부여 완료:', new Date().toISOString());

  } catch (error) {
    console.error('❌ AI 자동 과제 부여 오류:', error);
  }
}

// (기존 AI 과제 cron 스케줄러는 이미 상단에 구현되어 있음)

// 서버 시작 시 한 번 실행 (테스트용 - 프로덕션에서는 주석 처리)
// assignAITasksDaily();

// AI 과제 title 조회 API (디버그용)
app.get('/api/debug-ai-task-titles', async (req, res) => {
  try {
    const allProgress = await UserProgress.find({ 'studyRoom.assignedTasks': { $exists: true, $ne: [] } });
    const titles = [];
    for (const progress of allProgress) {
      const tasks = progress.studyRoom?.assignedTasks || [];
      for (const task of tasks) {
        if (task.isAI) {
          titles.push({ userId: progress.userId, title: task.title, taskId: task.taskId });
        }
      }
    }
    res.json({ ok: true, count: titles.length, titles });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

// AI 추천과제 title 일괄 수정 API (마이그레이션용)
app.post('/api/migrate-ai-task-titles', async (req, res) => {
  try {
    const allProgress = await UserProgress.find({ 'studyRoom.assignedTasks': { $exists: true, $ne: [] } });

    let updatedCount = 0;
    let taskCount = 0;

    for (const progress of allProgress) {
      const tasks = progress.studyRoom?.assignedTasks || [];
      let modified = false;

      for (const task of tasks) {
        if (!task.isAI) continue;

        const oldTitle = task.title || '';
        let newTitle = oldTitle;

        // "세계문학1 01" → "세계문학1 1" (앞에 0 제거)
        // "세계문학 01" → "세계문학1 1"
        const worldMatch1 = oldTitle.match(/^세계문학1?\s+0*(\d+)$/);
        if (worldMatch1) {
          const num = parseInt(worldMatch1[1], 10);
          if (num >= 1 && num <= 40) {
            newTitle = `세계문학1 ${num}`;
          } else if (num >= 41 && num <= 80) {
            newTitle = `세계문학2 ${num - 40}`;
          }
        }

        // "세계문학2 01" → "세계문학2 1"
        const worldMatch2 = oldTitle.match(/^세계문학2\s+0*(\d+)$/);
        if (worldMatch2) {
          const num = parseInt(worldMatch2[1], 10);
          newTitle = `세계문학2 ${num}`;
        }

        // "한국인물 01" → "한국인물 1"
        const personMatch1 = oldTitle.match(/^한국인물\s+0*(\d+)$/);
        if (personMatch1) {
          const num = parseInt(personMatch1[1], 10);
          newTitle = `한국인물 ${num}`;
        }

        // "세계인물 01" → "세계인물 1"
        const personMatch2 = oldTitle.match(/^세계인물\s+0*(\d+)$/);
        if (personMatch2) {
          const num = parseInt(personMatch2[1], 10);
          newTitle = `세계인물 ${num}`;
        }

        // "인물 41" → "세계인물 1" (people_41 형식)
        const personMatch3 = oldTitle.match(/^인물\s+(\d+)$/);
        if (personMatch3) {
          const num = parseInt(personMatch3[1], 10);
          if (num >= 41) {
            newTitle = `세계인물 ${num - 40}`;
          } else {
            newTitle = `한국인물 ${num}`;
          }
        }

        // "지리 01단원" → "지리 1" (단원 제거 + 0 제거)
        const unitMatch = oldTitle.match(/^(.+?)\s+0*(\d+)단원$/);
        if (unitMatch) {
          const subject = unitMatch[1];
          const num = parseInt(unitMatch[2], 10);
          newTitle = `${subject} ${num}`;
        }

        // "people1 1" → "한국인물 1"
        const people1Match = oldTitle.match(/^people1\s+(\d+)$/);
        if (people1Match) {
          const num = parseInt(people1Match[1], 10);
          newTitle = `한국인물 ${num}`;
        }

        // "people2 1" → "세계인물 1"
        const people2Match = oldTitle.match(/^people2\s+(\d+)$/);
        if (people2Match) {
          const num = parseInt(people2Match[1], 10);
          newTitle = `세계인물 ${num}`;
        }

        if (newTitle !== oldTitle) {
          console.log(`🔄 title 변환: "${oldTitle}" → "${newTitle}"`);
          task.title = newTitle;
          modified = true;
          taskCount++;
        }
      }

      if (modified) {
        await progress.save();
        updatedCount++;
      }
    }

    res.json({ ok: true, message: `${updatedCount}명의 ${taskCount}개 AI 과제 title이 업데이트되었습니다.` });
  } catch (error) {
    console.error('AI 과제 title 마이그레이션 오류:', error);
    res.status(500).json({ ok: false, message: error.message });
  }
});

// AI 과제 스케줄 조회 API (관리자용)
app.get('/api/ai-task/schedules', async (req, res) => {
  try {
    const { studentGrade, studentName, status } = req.query;

    const filter = {};
    if (studentGrade) filter.studentGrade = studentGrade;
    if (studentName) filter.studentName = studentName;
    if (status) filter.status = status;

    const schedules = await AITaskSchedule.find(filter).sort({ scheduledDate: 1 });

    res.json({
      ok: true,
      schedules
    });
  } catch (error) {
    console.error('AI 스케줄 조회 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// 학생의 마지막 AI 과제 부여 시간 조회
app.get('/api/ai-task/last-assigned', async (req, res) => {
  try {
    const { grade, name } = req.query;

    if (!grade || !name) {
      return res.status(400).json({
        ok: false,
        message: 'grade와 name이 필요합니다'
      });
    }

    const progress = await UserProgress.findOne({ grade, name });

    res.json({
      ok: true,
      lastAIAssignedAt: progress?.studyRoom?.lastAIAssignedAt || null
    });

  } catch (error) {
    console.error('마지막 AI 부여 시간 조회 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// AI 과제 수동 부여 API (테스트용)
app.post('/api/ai-task/manual-assign', async (req, res) => {
  try {
    await assignAITasksDaily();
    res.json({
      ok: true,
      message: 'AI 과제 부여가 완료되었습니다'
    });
  } catch (error) {
    console.error('수동 AI 과제 부여 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// AI 스케줄 초기화 API (테스트용 - assigned를 pending으로 변경)
app.post('/api/ai-task/reset-schedules', async (req, res) => {
  try {
    const { studentGrade, studentName } = req.body;

    const filter = {};
    if (studentGrade) filter.studentGrade = studentGrade;
    if (studentName) filter.studentName = studentName;
    filter.status = 'assigned';

    const result = await AITaskSchedule.updateMany(filter, {
      status: 'pending',
      assignedAt: null
    });

    res.json({
      ok: true,
      message: `${result.modifiedCount}개 스케줄이 pending으로 변경되었습니다`,
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('스케줄 초기화 오류:', error);
    res.status(500).json({
      ok: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// ========================================
// 자동 과제 스케줄 관리 API
// ========================================

// 1. 자동 과제 스케줄 저장 (POST)
app.post('/api/auto-task-schedule', async (req, res) => {
  try {
    const { studentIds, subjects, days, taskCount } = req.body;

    console.log('📥 [POST] /api/auto-task-schedule 요청:', { studentIds, subjects, days, taskCount });

    // 입력 검증
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: '학생을 선택해주세요.' });
    }
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ success: false, message: '과목을 선택해주세요.' });
    }
    if (!days || !Array.isArray(days) || days.length === 0) {
      return res.status(400).json({ success: false, message: '요일을 선택해주세요.' });
    }
    if (!taskCount || taskCount < 1 || taskCount > 5) {
      return res.status(400).json({ success: false, message: '과제 개수는 1~5개 사이여야 합니다.' });
    }

    const results = [];

    // 각 학생에게 스케줄 추가
    for (const student of studentIds) {
      // studentId는 이제 { grade, name } 객체
      const user = await UserProgress.findOne({
        grade: student.grade,
        name: student.name
      });

      if (!user) {
        console.log(`⚠️  학생을 찾을 수 없음: ${student.grade} ${student.name}`);
        results.push({ student, success: false, message: '사용자를 찾을 수 없습니다.' });
        continue;
      }

      // 고유 스케줄 ID 생성
      const scheduleId = `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 다음 실행 예정일 계산
      const nextScheduledDate = calculateNextScheduledDate(days);

      const newSchedule = {
        scheduleId,
        subjects,
        days: days.map(d => parseInt(d)),
        taskCount: parseInt(taskCount),
        isActive: true,
        createdAt: new Date(),
        lastExecutedAt: null,
        nextScheduledDate
      };

      // 스케줄 추가
      if (!user.studyRoom) {
        user.studyRoom = { assignedTasks: [], autoTaskSchedules: [] };
      }
      if (!user.studyRoom.autoTaskSchedules) {
        user.studyRoom.autoTaskSchedules = [];
      }

      user.studyRoom.autoTaskSchedules.push(newSchedule);
      await user.save();

      console.log(`✅ 스케줄 저장 성공: ${student.grade} ${student.name} - ${scheduleId}`);
      results.push({ student, success: true, scheduleId });
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `스케줄 등록 완료 (성공: ${successCount}명, 실패: ${failCount}명)`,
      results
    });

  } catch (error) {
    console.error('스케줄 저장 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 다음 실행 예정일 계산 함수
function calculateNextScheduledDate(days) {
  const now = new Date();
  const currentDay = now.getDay(); // 0(일) ~ 6(토)
  const sortedDays = days.map(d => parseInt(d)).sort((a, b) => a - b);

  // 오늘 이후 가장 가까운 요일 찾기
  let nextDay = sortedDays.find(d => d > currentDay);

  // 없으면 다음 주 첫 번째 요일
  if (nextDay === undefined) {
    nextDay = sortedDays[0];
  }

  const daysUntilNext = nextDay >= currentDay
    ? nextDay - currentDay
    : 7 - currentDay + nextDay;

  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysUntilNext);
  nextDate.setHours(0, 0, 0, 0);

  return nextDate;
}

// 2. 특정 학생의 스케줄 목록 조회 (GET)
app.get('/api/auto-task-schedule', async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ success: false, message: '학생 ID가 필요합니다.' });
    }

    const user = await UserProgress.findOne({
      $or: [{ grade: studentId }, { name: studentId }]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    const schedules = user.studyRoom?.autoTaskSchedules || [];

    res.json({
      success: true,
      schedules
    });

  } catch (error) {
    console.error('스케줄 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 3. 스케줄 일시정지/재개 (PATCH)
app.patch('/api/auto-task-schedule/:scheduleId/toggle', async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { grade, name } = req.body;

    console.log(`📥 [PATCH] /api/auto-task-schedule/${scheduleId}/toggle:`, { grade, name });

    if (!grade || !name) {
      return res.status(400).json({ success: false, message: '학년과 이름이 필요합니다.' });
    }

    const user = await UserProgress.findOne({
      grade: grade,
      name: name
    });

    if (!user) {
      console.log(`⚠️  사용자를 찾을 수 없음: ${grade} ${name}`);
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    const schedule = user.studyRoom?.autoTaskSchedules?.find(s => s.scheduleId === scheduleId);

    if (!schedule) {
      return res.status(404).json({ success: false, message: '스케줄을 찾을 수 없습니다.' });
    }

    // 상태 토글
    schedule.isActive = !schedule.isActive;
    await user.save();

    res.json({
      success: true,
      message: schedule.isActive ? '스케줄이 재개되었습니다.' : '스케줄이 일시정지되었습니다.',
      isActive: schedule.isActive
    });

  } catch (error) {
    console.error('스케줄 토글 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 4. 스케줄 삭제 (DELETE)
app.delete('/api/auto-task-schedule/:scheduleId', async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { grade, name } = req.query;

    console.log(`📥 [DELETE] /api/auto-task-schedule/${scheduleId}:`, { grade, name });

    if (!grade || !name) {
      return res.status(400).json({ success: false, message: '학년과 이름이 필요합니다.' });
    }

    const user = await UserProgress.findOne({
      grade: grade,
      name: name
    });

    if (!user) {
      console.log(`⚠️  사용자를 찾을 수 없음: ${grade} ${name}`);
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    // 스케줄 제거
    const originalLength = user.studyRoom?.autoTaskSchedules?.length || 0;
    user.studyRoom.autoTaskSchedules = user.studyRoom?.autoTaskSchedules?.filter(
      s => s.scheduleId !== scheduleId
    ) || [];

    const newLength = user.studyRoom.autoTaskSchedules.length;

    if (originalLength === newLength) {
      return res.status(404).json({ success: false, message: '스케줄을 찾을 수 없습니다.' });
    }

    await user.save();

    res.json({
      success: true,
      message: '스케줄이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('스케줄 삭제 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 🔍 디버그: 전체 스케줄 조회
app.get('/api/debug/schedules', async (req, res) => {
  try {
    const allProgress = await UserProgress.find({
      'studyRoom.autoTaskSchedules': { $exists: true, $ne: [] }
    }).select('grade name studyRoom.autoTaskSchedules').lean();

    const result = allProgress.map(p => ({
      student: `${p.grade} ${p.name}`,
      scheduleCount: p.studyRoom?.autoTaskSchedules?.length || 0,
      schedules: p.studyRoom?.autoTaskSchedules || []
    }));

    res.json({
      success: true,
      totalStudents: result.length,
      data: result
    });
  } catch (error) {
    console.error('디버그 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// ========================================
// 자동 과제 부여 스케줄러 (매일 0시 실행)
// ========================================

// 과목별 전체 단원 맵핑
const SUBJECT_UNITS_MAP = {
  'science/bio': Array.from({ length: 80 }, (_, i) => `bio_${String(i + 1).padStart(2, '0')}`),
  'science/geo_earth': Array.from({ length: 80 }, (_, i) => `geo_${String(i + 1).padStart(2, '0')}`),
  'science/physics': Array.from({ length: 80 }, (_, i) => `phy_${String(i + 1).padStart(2, '0')}`),
  'science/chemistry': Array.from({ length: 80 }, (_, i) => `chem_${String(i + 1).padStart(2, '0')}`),
  'social/geo': Array.from({ length: 80 }, (_, i) => `geo_${String(i + 1).padStart(2, '0')}`),
  'social/history': Array.from({ length: 80 }, (_, i) => `history_${String(i + 1).padStart(2, '0')}`),
  'social/politic': Array.from({ length: 80 }, (_, i) => `politic_${String(i + 1).padStart(2, '0')}`),
  'korlit/classic': Array.from({ length: 80 }, (_, i) => `classic_${String(i + 1).padStart(2, '0')}`),
  'korlit/modern': Array.from({ length: 80 }, (_, i) => `modern_${String(i + 1).padStart(2, '0')}`),
  'korlit/essay': Array.from({ length: 80 }, (_, i) => `essay_${String(i + 1).padStart(2, '0')}`),
  'korlit/nonfiction': Array.from({ length: 80 }, (_, i) => `nonfiction_${String(i + 1).padStart(2, '0')}`),
  'worldlit/classic': Array.from({ length: 80 }, (_, i) => `classic_${String(i + 1).padStart(2, '0')}`),
  'worldlit/modern': Array.from({ length: 80 }, (_, i) => `modern_${String(i + 1).padStart(2, '0')}`),
  'worldlit/essay': Array.from({ length: 80 }, (_, i) => `essay_${String(i + 1).padStart(2, '0')}`),
  'worldlit/nonfiction': Array.from({ length: 80 }, (_, i) => `nonfiction_${String(i + 1).padStart(2, '0')}`),
  'person/korea': Array.from({ length: 80 }, (_, i) => `korea_${String(i + 1).padStart(2, '0')}`),
  'person/world': Array.from({ length: 80 }, (_, i) => `world_${String(i + 1).padStart(2, '0')}`)
};

// 과목별 메타데이터 매핑
const SUBJECT_META_MAP = {
  'science/bio': { series: 'BRAIN업', field: '과학분야', subject: '생물' },
  'science/geo_earth': { series: 'BRAIN업', field: '과학분야', subject: '지구과학' },
  'science/physics': { series: 'BRAIN업', field: '과학분야', subject: '물리' },
  'science/chemistry': { series: 'BRAIN업', field: '과학분야', subject: '화학' },
  'social/geo': { series: 'BRAIN업', field: '사회분야', subject: '지리' },
  'social/history': { series: 'BRAIN업', field: '사회분야', subject: '역사' },
  'social/politic': { series: 'BRAIN업', field: '사회분야', subject: '정치경제' },
  'korlit/classic': { series: 'BRAIN업', field: '국문학', subject: '고전소설' },
  'korlit/modern': { series: 'BRAIN업', field: '국문학', subject: '현대소설' },
  'korlit/essay': { series: 'BRAIN업', field: '국문학', subject: '수필시' },
  'korlit/nonfiction': { series: 'BRAIN업', field: '국문학', subject: '비문학' },
  'worldlit/classic': { series: 'BRAIN업', field: '세계문학', subject: '고전소설' },
  'worldlit/modern': { series: 'BRAIN업', field: '세계문학', subject: '현대소설' },
  'worldlit/essay': { series: 'BRAIN업', field: '세계문학', subject: '수필시' },
  'worldlit/nonfiction': { series: 'BRAIN업', field: '세계문학', subject: '비문학' },
  'person/korea': { series: 'BRAIN업', field: '인물', subject: '한국인물' },
  'person/world': { series: 'BRAIN업', field: '인물', subject: '세계인물' }
};

// 미완료 단원 조회 함수
async function getIncompleteUnits(grade, name, subjectPath) {
  try {
    // 모든 단원
    const allUnits = SUBJECT_UNITS_MAP[subjectPath] || [];

    // 완료된 단원 조회 (학습 로그에서)
    const completedLogs = await LearningLog.find({
      grade,
      name,
      subject: SUBJECT_META_MAP[subjectPath]?.subject
    });

    const completedUnits = new Set(completedLogs.map(log => log.unitId));

    // 미완료 단원 필터링
    const incompleteUnits = allUnits.filter(unit => !completedUnits.has(unit));

    return incompleteUnits;
  } catch (error) {
    console.error('미완료 단원 조회 오류:', error);
    return [];
  }
}

// 자동 과제 부여 함수
async function executeAutoTaskSchedules() {
  try {
    console.log('🕐 자동 과제 부여 스케줄러 실행 시작...');

    const today = new Date().getDay(); // 0(일) ~ 6(토)

    // 모든 사용자 조회
    const users = await UserProgress.find({
      'studyRoom.autoTaskSchedules': { $exists: true, $ne: [] }
    });

    let totalSchedules = 0;
    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
      const schedules = user.studyRoom?.autoTaskSchedules || [];

      for (const schedule of schedules) {
        // 활성화되지 않은 스케줄은 건너뛰기
        if (!schedule.isActive) continue;

        // 오늘 요일이 실행 요일에 포함되는지 확인
        if (!schedule.days.includes(today)) continue;

        totalSchedules++;

        try {
          // 과목별로 과제 부여
          let tasksAssigned = 0;

          for (const subjectPath of schedule.subjects) {
            // 미완료 단원 조회
            const incompleteUnits = await getIncompleteUnits(user.grade, user.name, subjectPath);

            if (incompleteUnits.length === 0) {
              console.log(`⚠️ ${user.name} - ${subjectPath}: 미완료 단원 없음`);
              continue;
            }

            // taskCount만큼 순차적으로 과제 부여
            const unitsToAssign = incompleteUnits.slice(0, schedule.taskCount);
            const meta = SUBJECT_META_MAP[subjectPath];

            for (const unitId of unitsToAssign) {
              const newTask = {
                id: unitId,
                unitId: unitId,
                title: `${meta.subject} ${unitId}`,
                series: meta.series,
                field: meta.field,
                subject: meta.subject,
                isAI: false,
                assignedAt: new Date(),
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
                status: 'pending',
                progress: 0
              };

              if (!user.studyRoom.assignedTasks) {
                user.studyRoom.assignedTasks = [];
              }

              user.studyRoom.assignedTasks.push(newTask);
              tasksAssigned++;
            }
          }

          // 스케줄 업데이트
          schedule.lastExecutedAt = new Date();
          schedule.nextScheduledDate = calculateNextScheduledDate(schedule.days);

          await user.save();

          console.log(`✅ ${user.name}: ${tasksAssigned}개 과제 부여 완료`);
          successCount++;

        } catch (error) {
          console.error(`❌ ${user.name} 과제 부여 실패:`, error);
          failCount++;
        }
      }
    }

    console.log(`🎉 자동 과제 부여 완료 - 총 ${totalSchedules}개 스케줄 (성공: ${successCount}, 실패: ${failCount})`);

  } catch (error) {
    console.error('자동 과제 부여 스케줄러 오류:', error);
  }
}

// Cron 스케줄러 설정 (매일 0시 실행)
cron.schedule('0 0 * * *', () => {
  console.log('⏰ 매일 0시 - 자동 과제 부여 스케줄러 트리거');
  executeAutoTaskSchedules();
}, {
  timezone: "Asia/Seoul"
});

console.log('✅ 자동 과제 부여 스케줄러 등록 완료 (매일 0시 실행)');

// AI 추천과제 스케줄러 (매시 정각 실행 - 등급별 시간 체크)
cron.schedule('0 * * * *', () => {
  console.log('⏰ AI 추천과제 스케줄러 트리거 (매시 정각)');
  assignAITasksDaily();
}, {
  timezone: "Asia/Seoul"
});

console.log('✅ AI 추천과제 스케줄러 등록 완료 (매시 정각 실행)');

// ========== 독서 감상문 월간 리셋 ==========
// 매월 1일 0시 0분에 실행 (월간 과제 리셋)
cron.schedule('0 0 1 * *', async () => {
  console.log('📚 독서 감상문 월간 리셋 스케줄러 트리거');

  try {
    // 모든 사용자의 독서 감상문 데이터 조회
    const allUsers = await UserProgress.find({
      'readingReports.0': { $exists: true }
    });

    console.log(`📊 총 ${allUsers.length}명의 사용자 독서 감상문 데이터 확인`);

    // 참고: 실제로는 데이터를 삭제하지 않고 유지합니다.
    // 각 리포트에 month 필드가 있어서 월별로 필터링 가능
    // 이 스케줄러는 로깅 및 통계 목적으로만 사용

    let totalReports = 0;
    allUsers.forEach(user => {
      if (user.readingReports && user.readingReports.length > 0) {
        totalReports += user.readingReports.length;
      }
    });

    console.log(`✅ 독서 감상문 월간 리셋 완료 - 총 ${totalReports}개 리포트 보관 중`);
  } catch (error) {
    console.error('❌ 독서 감상문 월간 리셋 오류:', error);
  }
}, {
  timezone: "Asia/Seoul"
});

console.log('✅ 독서 감상문 월간 리셋 스케줄러 등록 완료 (매월 1일 0시 실행)');

// ========== 자동과제부여 시스템 (학생별 설정 기반) ==========

// 과목 우선순위 순서 (사용자 지정)
// 생물 > 지구과학 > 물리 > 화학 > 사회문화 > 지리 > 법 > 정치경제 > 현대문학 > 고전문학 > 세계문학1 > 세계문학2 > 한국인물 > 세계인물
const AUTO_TASK_SUBJECT_PRIORITY = ['bio', 'earth', 'physics', 'chem', 'soc', 'geo', 'law', 'pol', 'modern', 'classic', 'world1', 'world2', 'people1', 'people2'];

// 각 과목별 최대 단원 수
const SUBJECT_MAX_UNITS = {
  bio: 20, chem: 20, physics: 20, earth: 20,
  geo: 20, soc: 20, law: 20, pol: 20, econ: 20,
  classic: 30, modern: 30, world1: 20, world2: 20, people1: 20, people2: 20
};

// 과목 정보 매핑 (field는 한글로 표시)
const SUBJECT_INFO = {
  bio: { field: '과학분야', label: '생물' },
  chem: { field: '과학분야', label: '화학' },
  physics: { field: '과학분야', label: '물리' },
  earth: { field: '과학분야', label: '지구과학' },
  geo: { field: '사회분야', label: '지리' },
  soc: { field: '사회분야', label: '사회문화' },
  law: { field: '사회분야', label: '법과정치' },
  pol: { field: '사회분야', label: '정치' },
  econ: { field: '사회분야', label: '경제' },
  classic: { field: '국어분야', label: '고전문학' },
  modern: { field: '국어분야', label: '현대문학' },
  world1: { field: '국어분야', label: '세계문학1' },
  world2: { field: '국어분야', label: '세계문학2' },
  people1: { field: '인물분야', label: '한국인물' },
  people2: { field: '인물분야', label: '세계인물' }
};

// 개별 학생용 자동과제부여 실행 함수 (설정 변경 시 즉시 실행용)
async function executeAutoTaskForStudent(grade, name, setting) {
  try {
    console.log(`🎯 [${grade} ${name}] 개별 자동과제부여 시작`);

    // 해당 학생의 완료된 학습 기록 조회
    const completedLogs = await LearningLog.find({
      grade,
      name,
      completed: true,
      deleted: { $ne: true }
    });

    // 완료된 단원 목록 추출
    const completedUnits = new Set();
    for (const log of completedLogs) {
      const unitValue = log.unit || log.unitId;
      if (unitValue && unitValue !== 'undefined') {
        const match = unitValue.match(/((?:fit_|deep_|on_)?[a-z]+\d?)_(\d+)/i);
        if (match) {
          completedUnits.add(`${match[1].toLowerCase()}_${match[2]}`);
        }
      }
    }
    console.log(`  📊 완료된 단원: ${completedUnits.size}개`);

    // 현재 학습실에 있는 과제 조회 (일반 과제만 - 자동부여 과제는 이미 삭제됨)
    const userProgress = await UserProgress.findOne({ grade, name });

    const existingTasks = new Set();
    if (userProgress?.studyRoom?.assignedTasks) {
      for (const task of userProgress.studyRoom.assignedTasks) {
        const match = task.unitId?.match(/((?:fit_|deep_|on_)?[a-z]+\d?)_(\d+)/i);
        if (match) {
          existingTasks.add(`${match[1].toLowerCase()}_${match[2]}`);
        }
      }
    }

    // 부여할 과제 목록 생성
    const tasksToAssign = [];

    // 시리즈별로 각각 taskCount개씩 부여
    for (const series of setting.series) {
      if (series === 'on') {
        console.log(`  ⏭️ 시리즈: ${series} (콘텐츠 없음 - 스킵)`);
        continue;
      }
      console.log(`  🔹 시리즈: ${series}`);
      let seriesTaskCount = 0;

      let prefix = '';
      let seriesName = 'BRAIN업';
      if (series === 'fit') {
        prefix = 'fit_';
        seriesName = 'BRAIN핏';
      } else if (series === 'deep') {
        prefix = 'deep_';
        seriesName = 'BRAIN딥';
      } else if (series === 'on') {
        prefix = 'on_';
        seriesName = 'BRAIN온';
      } else if (series === 'up') {
        prefix = '';
        seriesName = 'BRAIN업';
      }

      const maxUnitNum = 30;

      outerLoop:
      for (let unitNum = 1; unitNum <= maxUnitNum; unitNum++) {
        if (seriesTaskCount >= setting.taskCount) break;

        const unitNo = String(unitNum).padStart(2, '0');

        for (const subject of AUTO_TASK_SUBJECT_PRIORITY) {
          if (seriesTaskCount >= setting.taskCount) break outerLoop;

          const maxUnits = SUBJECT_MAX_UNITS[subject] || 20;
          if (unitNum > maxUnits) continue;

          const subjectInfo = SUBJECT_INFO[subject];
          const unitKey = `${prefix}${subject}_${unitNo}`;

          if (completedUnits.has(unitKey) || existingTasks.has(unitKey)) {
            continue;
          }

          if (tasksToAssign.some(t => t.unitKey === unitKey && t.series === series)) {
            continue;
          }

          let unitPath;
          if (['bio', 'chem', 'physics', 'earth'].includes(subject)) {
            unitPath = `./BRAINUP/science/${prefix}${subject}_${unitNo}.html`;
          } else if (['geo', 'soc', 'law', 'pol', 'econ'].includes(subject)) {
            unitPath = `./BRAINUP/social/${prefix}${subject}_${unitNo}.html`;
          } else if (['classic', 'modern'].includes(subject)) {
            unitPath = `./BRAINUP/korlit/${prefix}${subject}_${unitNo}.html`;
          } else if (['world1', 'world2'].includes(subject)) {
            unitPath = `./BRAINUP/worldlit/${prefix}${subject}_${unitNo}.html`;
          } else if (['people1', 'people2'].includes(subject)) {
            unitPath = `./BRAINUP/person/${prefix}${subject}_${unitNo}.html`;
          }

          const contentTitle = getContentTitle(unitKey, unitPath);
          const fullTitle = contentTitle
            ? `${subjectInfo.label} ${unitNo} ${contentTitle}`
            : `${subjectInfo.label} ${unitNo}`;

          tasksToAssign.push({
            unitKey,
            unitId: unitPath,
            unitTitle: fullTitle,
            series: series,
            seriesName: seriesName,
            fieldName: subjectInfo.field,
            subjectName: subjectInfo.label,
            assignedAt: new Date(),
            isAutoAssigned: true
          });
          seriesTaskCount++;
        }
      }
    }

    // 과제 부여
    if (tasksToAssign.length > 0) {
      let progress = userProgress;
      if (!progress) {
        progress = new UserProgress({
          grade,
          name,
          studyRoom: { assignedTasks: [] }
        });
      }

      if (!progress.studyRoom) {
        progress.studyRoom = { assignedTasks: [] };
      }

      for (const task of tasksToAssign) {
        progress.studyRoom.assignedTasks.push({
          unitId: task.unitId,
          unitTitle: task.unitTitle,
          seriesName: task.seriesName,
          fieldName: task.fieldName,
          subjectName: task.subjectName,
          assignedAt: task.assignedAt,
          isAutoAssigned: true
        });
      }

      await progress.save();
      console.log(`✅ [${grade} ${name}] ${tasksToAssign.length}개 과제 부여 완료`);
      tasksToAssign.forEach(t => console.log(`   - ${t.seriesName} > ${t.subjectName} ${t.unitTitle.split(' ')[1]}`));
    } else {
      console.log(`ℹ️ [${grade} ${name}] 부여할 미완료 과제가 없습니다`);
    }

  } catch (error) {
    console.error(`❌ [${grade} ${name}] 개별 자동과제부여 오류:`, error);
    throw error;
  }
}

// 자동과제부여 실행 함수
async function executeAutoTaskAssignment() {
  try {
    console.log('🎯 자동과제부여 시작:', new Date().toISOString());

    const now = new Date();
    const today = now.getDay(); // 0=일, 1=월, ..., 6=토

    // running 상태인 모든 설정 조회
    const activeSettings = await AutoTaskSettings.find({ status: 'running' });
    console.log(`📋 활성화된 자동과제부여 설정: ${activeSettings.length}개`);

    for (const setting of activeSettings) {
      try {
        // 요일 체크
        const shouldAssignToday = setting.days.includes('everyday') ||
                                   setting.days.includes(String(today));

        if (!shouldAssignToday) {
          console.log(`⏭️ [${setting.grade} ${setting.name}] 오늘(${today})은 부여 요일이 아닙니다`);
          continue;
        }

        console.log(`🔄 [${setting.grade} ${setting.name}] 자동과제 부여 시작 (${setting.taskCount}개)`);

        // 해당 학생의 완료된 학습 기록 조회
        const completedLogs = await LearningLog.find({
          grade: setting.grade,
          name: setting.name,
          completed: true,
          deleted: { $ne: true }
        });

        // 완료된 단원 목록 추출 (시리즈 prefix 포함: deep_bio_06, fit_bio_06, bio_06)
        const completedUnits = new Set();
        for (const log of completedLogs) {
          // LearningLog에서는 'unit' 필드 사용 (예: deep_bio_06, fit_physics_02)
          const unitValue = log.unit || log.unitId;
          if (unitValue && unitValue !== 'undefined') {
            // 시리즈 prefix 포함 패턴: (fit_|deep_|on_)?(과목코드\d?)_(번호)
            const match = unitValue.match(/((?:fit_|deep_|on_)?[a-z]+\d?)_(\d+)/i);
            if (match) {
              completedUnits.add(`${match[1].toLowerCase()}_${match[2]}`);
            }
          }
        }
        console.log(`  📊 완료된 단원: ${completedUnits.size}개`);

        // 현재 학습실에 있는 과제 조회
        const userProgress = await UserProgress.findOne({
          grade: setting.grade,
          name: setting.name
        });

        const existingTasks = new Set();
        if (userProgress?.studyRoom?.assignedTasks) {
          for (const task of userProgress.studyRoom.assignedTasks) {
            // 시리즈 prefix 포함 패턴
            const match = task.unitId?.match(/((?:fit_|deep_|on_)?[a-z]+\d?)_(\d+)/i);
            if (match) {
              existingTasks.add(`${match[1].toLowerCase()}_${match[2]}`);
            }
          }
        }

        // 부여할 과제 목록 생성
        const tasksToAssign = [];

        // 시리즈별로 각각 taskCount개씩 부여
        for (const series of setting.series) {
          // BRAIN온은 아직 콘텐츠가 없으므로 스킵
          if (series === 'on') {
            console.log(`  ⏭️ 시리즈: ${series} (콘텐츠 없음 - 스킵)`);
            continue;
          }
          console.log(`  🔹 시리즈: ${series}`);
          let seriesTaskCount = 0;  // 이 시리즈에서 부여한 개수

          // 시리즈별 prefix와 이름 설정
          let prefix = '';
          let seriesName = 'BRAIN업';
          if (series === 'fit') {
            prefix = 'fit_';
            seriesName = 'BRAIN핏';
          } else if (series === 'deep') {
            prefix = 'deep_';
            seriesName = 'BRAIN딥';
          } else if (series === 'on') {
            prefix = 'on_';
            seriesName = 'BRAIN온';
          } else if (series === 'up') {
            prefix = '';
            seriesName = 'BRAIN업';
          }

          // 우선순위: 1. 미완료 단원 2. 단원번호 낮은 순 3. 과목 우선순위
          // 단원 번호 01부터 시작하여, 각 번호에서 과목 우선순위대로 검색
          const maxUnitNum = 30;  // 가장 큰 단원 수 (현대/고전문학)

          outerLoop:
          for (let unitNum = 1; unitNum <= maxUnitNum; unitNum++) {
            if (seriesTaskCount >= setting.taskCount) break;

            const unitNo = String(unitNum).padStart(2, '0');

            // 같은 단원번호 내에서 과목 우선순위대로
            for (const subject of AUTO_TASK_SUBJECT_PRIORITY) {
              if (seriesTaskCount >= setting.taskCount) break outerLoop;

              const maxUnits = SUBJECT_MAX_UNITS[subject] || 20;
              if (unitNum > maxUnits) continue;  // 해당 과목의 최대 단원 수 초과하면 스킵

              const subjectInfo = SUBJECT_INFO[subject];
              const unitKey = `${prefix}${subject}_${unitNo}`;

              // 이미 완료했거나 학습실에 있는 경우 스킵
              if (completedUnits.has(unitKey) || existingTasks.has(unitKey)) {
                continue;
              }

              // 중복 체크 (이번에 추가할 목록에서)
              if (tasksToAssign.some(t => t.unitKey === unitKey && t.series === series)) {
                continue;
              }

              // 경로 설정
              let unitPath;
              if (['bio', 'chem', 'physics', 'earth'].includes(subject)) {
                unitPath = `./BRAINUP/science/${prefix}${subject}_${unitNo}.html`;
              } else if (['geo', 'soc', 'law', 'pol', 'econ'].includes(subject)) {
                unitPath = `./BRAINUP/social/${prefix}${subject}_${unitNo}.html`;
              } else if (['classic', 'modern'].includes(subject)) {
                unitPath = `./BRAINUP/korlit/${prefix}${subject}_${unitNo}.html`;
              } else if (['world1', 'world2'].includes(subject)) {
                unitPath = `./BRAINUP/worldlit/${prefix}${subject}_${unitNo}.html`;
              } else if (['people1', 'people2'].includes(subject)) {
                unitPath = `./BRAINUP/person/${prefix}${subject}_${unitNo}.html`;
              }

              // 콘텐츠 파일에서 전체 제목 가져오기
              const contentTitle = getContentTitle(unitKey, unitPath);
              const fullTitle = contentTitle
                ? `${subjectInfo.label} ${unitNo} ${contentTitle}`
                : `${subjectInfo.label} ${unitNo}`;

              tasksToAssign.push({
                unitKey,
                unitId: unitPath,
                unitTitle: fullTitle,
                series: series,
                seriesName: seriesName,
                fieldName: subjectInfo.field,
                subjectName: subjectInfo.label,
                assignedAt: new Date(),
                isAutoAssigned: true
              });
              seriesTaskCount++;
            }
          }
        }

        // 과제 부여
        if (tasksToAssign.length > 0) {
          let progress = userProgress;
          if (!progress) {
            progress = new UserProgress({
              grade: setting.grade,
              name: setting.name,
              studyRoom: { assignedTasks: [] }
            });
          }

          if (!progress.studyRoom) {
            progress.studyRoom = { assignedTasks: [] };
          }

          // 새 과제 추가
          for (const task of tasksToAssign) {
            const newTask = {
              unitId: task.unitId,
              unitTitle: task.unitTitle,
              seriesName: task.seriesName,
              fieldName: task.fieldName,
              subjectName: task.subjectName,
              assignedAt: task.assignedAt,
              isAutoAssigned: true
            };
            console.log(`    📦 저장할 과제: ${JSON.stringify(newTask)}`);
            progress.studyRoom.assignedTasks.push(newTask);
          }

          await progress.save();
          console.log(`✅ [${setting.grade} ${setting.name}] ${tasksToAssign.length}개 과제 부여 완료`);
          tasksToAssign.forEach(t => console.log(`   - ${t.seriesName} > ${t.subjectName} ${t.unitTitle.split(' ')[1]}`));
        } else {
          console.log(`ℹ️ [${setting.grade} ${setting.name}] 부여할 미완료 과제가 없습니다`);
        }

      } catch (studentError) {
        console.error(`❌ [${setting.grade} ${setting.name}] 과제 부여 오류:`, studentError);
      }
    }

    console.log('🎯 자동과제부여 완료:', new Date().toISOString());

  } catch (error) {
    console.error('❌ 자동과제부여 전체 오류:', error);
  }
}

// 자동과제부여 스케줄러 (매일 0시 실행)
cron.schedule('0 0 * * *', () => {
  console.log('⏰ 매일 0시 - 자동과제부여 스케줄러 트리거');
  executeAutoTaskAssignment();
}, {
  timezone: "Asia/Seoul"
});

console.log('✅ 자동과제부여 스케줄러 등록 완료 (매일 0시 실행)');

// 🧪 테스트용 엔드포인트: 자동과제부여 수동 트리거
app.post('/api/test/auto-task-trigger', async (req, res) => {
  try {
    console.log('🧪 [테스트] 자동과제부여 수동 트리거 시작');

    // 자동과제부여 함수 실행
    await executeAutoTaskAssignment();

    res.json({
      ok: true,
      message: '자동과제부여가 수동으로 실행되었습니다. 서버 로그를 확인하세요.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ [테스트] 자동과제부여 실행 오류:', error);
    res.status(500).json({
      ok: false,
      message: '자동과제부여 실행 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// ========================================
// 📝 진단테스트 및 수강신청 API
// ========================================

// 진단테스트 정보 저장 (진단 시작하기 버튼 클릭 시)
app.post("/api/diagnostic-test", async (req, res) => {
  try {
    const { branchName, studentGrade, studentName, studentPhone, parentName, parentPhone } = req.body;

    const diagnosticTest = new DiagnosticTest({
      branchName,
      studentGrade,
      studentName,
      studentPhone,
      parentName,
      parentPhone
    });

    await diagnosticTest.save();

    res.json({ success: true, message: "진단테스트 정보가 저장되었습니다." });
  } catch (error) {
    console.error("진단테스트 저장 오류:", error);
    res.status(500).json({ success: false, message: "저장 중 오류가 발생했습니다." });
  }
});

// 수강신청(상담) 정보 저장 (상담신청 팝업에서 제출 시)
app.post("/api/course-application", async (req, res) => {
  try {
    const { branchName, studentGrade, studentName, studentPhone, parentPhone, grade, series, answers, score } = req.body;

    const courseApplication = new CourseApplication({
      branchName,
      studentGrade,
      studentName,
      studentPhone,
      parentPhone,
      grade,
      series,
      answers: answers || [],
      score: score || 0
    });

    await courseApplication.save();

    res.json({ success: true, message: "수강신청 정보가 저장되었습니다.", applicationId: courseApplication._id });
  } catch (error) {
    console.error("수강신청 저장 오류:", error);
    res.status(500).json({ success: false, message: "저장 중 오류가 발생했습니다." });
  }
});

// 진단테스트 목록 조회 (슈퍼 관리자용)
app.get("/api/diagnostic-tests", async (req, res) => {
  try {
    const tests = await DiagnosticTest.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tests });
  } catch (error) {
    console.error("진단테스트 조회 오류:", error);
    res.status(500).json({ success: false, message: "조회 중 오류가 발생했습니다." });
  }
});

// 수강신청 목록 조회 (슈퍼 관리자용)
app.get("/api/course-applications", async (req, res) => {
  try {
    const applications = await CourseApplication.find().sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (error) {
    console.error("수강신청 조회 오류:", error);
    res.status(500).json({ success: false, message: "조회 중 오류가 발생했습니다." });
  }
});

// 개별 수강신청 시험지 조회 (관리자용 - ID로 조회)
app.get("/api/course-application/:id", async (req, res) => {
  try {
    const application = await CourseApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "해당 수강신청 정보를 찾을 수 없습니다." });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    console.error("수강신청 개별 조회 오류:", error);
    res.status(500).json({ success: false, message: "조회 중 오류가 발생했습니다." });
  }
});

// 진단테스트 정보 수정 (슈퍼 관리자용)
app.put("/api/diagnostic-tests/:id", async (req, res) => {
  try {
    const { branchName, studentGrade, studentName, studentPhone, parentName, parentPhone } = req.body;

    const updatedTest = await DiagnosticTest.findByIdAndUpdate(
      req.params.id,
      {
        branchName,
        studentGrade,
        studentName,
        studentPhone,
        parentName,
        parentPhone
      },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ success: false, message: "해당 진단테스트 정보를 찾을 수 없습니다." });
    }

    res.json({ success: true, data: updatedTest });
  } catch (error) {
    console.error("진단테스트 수정 오류:", error);
    res.status(500).json({ success: false, message: "수정 중 오류가 발생했습니다." });
  }
});

// 수강신청 정보 수정 (슈퍼 관리자용)
app.put("/api/course-applications/:id", async (req, res) => {
  try {
    const { branchName, studentGrade, studentName, studentPhone, parentPhone } = req.body;

    const updatedApplication = await CourseApplication.findByIdAndUpdate(
      req.params.id,
      {
        branchName,
        studentGrade,
        studentName,
        studentPhone,
        parentPhone
      },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ success: false, message: "해당 수강신청 정보를 찾을 수 없습니다." });
    }

    res.json({ success: true, data: updatedApplication });
  } catch (error) {
    console.error("수강신청 수정 오류:", error);
    res.status(500).json({ success: false, message: "수정 중 오류가 발생했습니다." });
  }
});

// 관리자 정보 조회 (브랜치 관리자용)
app.get("/api/admin/info", async (req, res) => {
  try {
    if (!req.session || !req.session.admin) {
      return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
    }
    res.json({
      success: true,
      academyName: req.session.admin.academyName || "",
      adminId: req.session.admin.adminId || ""
    });
  } catch (error) {
    console.error("관리자 정보 조회 오류:", error);
    res.status(500).json({ success: false, message: "조회 중 오류가 발생했습니다." });
  }
});

// 진단테스트 목록 조회 (브랜치 관리자용 - 지점명 필터링)
app.get("/api/admin/diagnostic-tests", async (req, res) => {
  try {
    // 세션에서 관리자 정보 확인
    if (!req.session || !req.session.admin || !req.session.admin.academyName) {
      return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
    }

    const academyName = req.session.admin.academyName;

    // 지점명으로 필터링하여 조회 (지점명에 academyName이 포함된 경우 매칭)
    const tests = await DiagnosticTest.find({
      branchName: { $regex: academyName, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: tests, academyName: academyName });
  } catch (error) {
    console.error("브랜치 관리자 진단테스트 조회 오류:", error);
    res.status(500).json({ success: false, message: "조회 중 오류가 발생했습니다." });
  }
});

// 수강신청 목록 조회 (브랜치 관리자용 - 지점명 필터링)
app.get("/api/admin/course-applications", async (req, res) => {
  try {
    // 세션에서 관리자 정보 확인
    if (!req.session || !req.session.admin || !req.session.admin.academyName) {
      return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
    }

    const academyName = req.session.admin.academyName;

    // 지점명으로 필터링하여 조회 (지점명에 academyName이 포함된 경우 매칭)
    const applications = await CourseApplication.find({
      branchName: { $regex: academyName, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: applications, academyName: academyName });
  } catch (error) {
    console.error("브랜치 관리자 수강신청 조회 오류:", error);
    res.status(500).json({ success: false, message: "조회 중 오류가 발생했습니다." });
  }
});

// ===== 학습 진행 데이터 API (localStorage 대체) =====

// 단원별 학습 진행 데이터 저장
app.post("/api/unit-progress/save", async (req, res) => {
  try {
    const { grade, name, unit, data } = req.body;
    console.log('[unit-progress/save] 요청:', { grade, name, unit, data });

    if (!grade || !name || !unit) {
      return res.status(400).json({ success: false, message: "grade, name, unit은 필수입니다." });
    }

    let userProgress = await UserProgress.findOne({ grade, name });
    console.log('[unit-progress/save] 기존 문서:', userProgress ? '있음' : '없음');

    if (!userProgress) {
      userProgress = new UserProgress({ grade, name });
    }

    // unitProgress Map에 데이터 저장
    if (!userProgress.unitProgress) {
      userProgress.unitProgress = new Map();
    }

    // Map이 아닌 경우 Map으로 변환
    if (!(userProgress.unitProgress instanceof Map)) {
      console.log('[unit-progress/save] unitProgress를 Map으로 변환');
      userProgress.unitProgress = new Map(Object.entries(userProgress.unitProgress || {}));
    }

    let existingData = userProgress.unitProgress.get(unit) || {};
    // Mongoose subdocument를 일반 객체로 변환
    if (existingData && typeof existingData.toObject === 'function') {
      existingData = existingData.toObject();
    }
    console.log('[unit-progress/save] 기존 데이터:', existingData);

    const updatedData = {
      ...existingData,
      ...data,
      lastUpdated: new Date()
    };
    console.log('[unit-progress/save] 업데이트된 데이터:', updatedData);

    userProgress.unitProgress.set(unit, updatedData);

    // 완료 페이지 목록 업데이트
    if (data.completedPages && Array.isArray(data.completedPages)) {
      if (!userProgress.completedPages) {
        userProgress.completedPages = [];
      }
      data.completedPages.forEach(pageId => {
        if (!userProgress.completedPages.includes(pageId)) {
          userProgress.completedPages.push(pageId);
        }
      });
    }

    await userProgress.save();
    console.log('[unit-progress/save] 저장 완료');

    res.json({ success: true, message: "학습 진행 데이터 저장 완료" });
  } catch (error) {
    console.error("학습 진행 데이터 저장 오류:", error);
    res.status(500).json({ success: false, message: "저장 중 오류가 발생했습니다." });
  }
});

// 단원별 학습 진행 데이터 불러오기
app.get("/api/unit-progress/load", async (req, res) => {
  try {
    const { grade, name, unit } = req.query;
    console.log('[unit-progress/load] 요청:', { grade, name, unit });

    if (!grade || !name) {
      return res.status(400).json({ success: false, message: "grade, name은 필수입니다." });
    }

    const userProgress = await UserProgress.findOne({ grade, name });
    console.log('[unit-progress/load] 문서:', userProgress ? '있음' : '없음');

    if (!userProgress) {
      return res.json({ success: true, data: null, completedPages: [] });
    }

    // 디버그 로그 제거 (성능 향상)

    // 특정 단원 데이터 반환
    if (unit) {
      let unitData = null;
      if (userProgress.unitProgress) {
        // Map인 경우
        if (userProgress.unitProgress instanceof Map) {
          unitData = userProgress.unitProgress.get(unit);
        } else {
          // Object인 경우
          unitData = userProgress.unitProgress[unit];
        }
      }
      return res.json({
        success: true,
        data: unitData || null,
        completedPages: userProgress.completedPages || []
      });
    }

    // 전체 데이터 반환 (unit 미지정 시)
    const allUnitProgress = {};
    if (userProgress.unitProgress) {
      if (userProgress.unitProgress instanceof Map) {
        userProgress.unitProgress.forEach((value, key) => {
          allUnitProgress[key] = value;
        });
      } else {
        Object.assign(allUnitProgress, userProgress.unitProgress);
      }
    }

    res.json({
      success: true,
      data: allUnitProgress,
      completedPages: userProgress.completedPages || []
    });
  } catch (error) {
    console.error("학습 진행 데이터 불러오기 오류:", error);
    res.status(500).json({ success: false, message: "불러오기 중 오류가 발생했습니다." });
  }
});

// 단원별 학습 진행 데이터 삭제 (리셋)
app.post("/api/unit-progress/reset", async (req, res) => {
  try {
    const { grade, name, unit } = req.body;

    if (!grade || !name || !unit) {
      return res.status(400).json({ success: false, message: "grade, name, unit은 필수입니다." });
    }

    const userProgress = await UserProgress.findOne({ grade, name });

    if (!userProgress) {
      return res.json({ success: true, message: "삭제할 데이터가 없습니다." });
    }

    // 해당 단원 데이터 삭제
    if (userProgress.unitProgress) {
      userProgress.unitProgress.delete(unit);
    }

    // completedPages에서 해당 단원 관련 페이지 제거
    if (userProgress.completedPages) {
      userProgress.completedPages = userProgress.completedPages.filter(
        pageId => !pageId.startsWith(unit)
      );
    }

    await userProgress.save();

    res.json({ success: true, message: "학습 진행 데이터 삭제 완료" });
  } catch (error) {
    console.error("학습 진행 데이터 삭제 오류:", error);
    res.status(500).json({ success: false, message: "삭제 중 오류가 발생했습니다." });
  }
});

// ===== AI 추천 보완 학습 시스템 =====

// 모의고사 보완 학습 과제 스키마
const mockExamRecommendTaskSchema = new mongoose.Schema({
  userId: { type: String, required: true },           // MockExamUser ID
  phone: { type: String, required: true },            // 사용자 전화번호
  areaKey: { type: String, required: true },          // 12개 세부 영역 키 (speechTalk, grammarModern 등)
  areaName: { type: String, required: true },         // 영역 한글명 (화법, 현대문법 등)
  parentArea: { type: String, required: true },       // 상위 영역 (speech, grammar, reading, literature)
  correctCount: { type: Number, default: 0 },         // 맞힌 문항 수 (-는 최초)
  totalCount: { type: Number, default: 0 },           // 총 문항 수 (-는 최초)
  userRate: { type: Number, required: true },         // 사용자 정답률 (%)
  avgRate: { type: Number, required: true },          // 평균 정답률 (%)
  diffPercent: { type: Number, required: true },      // 차이 (평균 - 사용자)
  weekNumber: { type: Number, required: true },       // 해당 주차 번호 (주간 구분용)
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }                         // 완료 시점
});
mockExamRecommendTaskSchema.index({ userId: 1, weekNumber: 1 });
mockExamRecommendTaskSchema.index({ phone: 1, weekNumber: 1 });
const MockExamRecommendTask = mongoose.model('MockExamRecommendTask', mockExamRecommendTaskSchema);

// 보완 학습 시험지 스키마 (영역별 시험문제 세트)
const supplementExamSchema = new mongoose.Schema({
  examId: { type: String, required: true, unique: true }, // 시험지 고유 ID (예: supplement_speechTalk_1)
  areaKey: { type: String, required: true },              // 12개 세부 영역 키 (speechTalk, grammarModern 등)
  areaName: { type: String, required: true },             // 영역 한글명 (화법, 현대문법 등)
  parentArea: { type: String, required: true },           // 상위 영역 (speech, grammar, reading, literature)
  title: { type: String, required: true },                // 시험지 제목
  questionCount: { type: Number, default: 0 },            // 문항 수
  questions: [{                                           // 문제 배열
    questionNumber: Number,
    questionText: String,
    passage: String,                                      // 지문
    options: [String],                                    // 선택지 배열
    correctAnswer: Number,                                // 정답 (1-5)
    explanation: String                                   // 해설
  }],
  isActive: { type: Boolean, default: true },             // 활성화 여부
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
supplementExamSchema.index({ areaKey: 1 });
supplementExamSchema.index({ parentArea: 1 });
const SupplementExam = mongoose.model('SupplementExam', supplementExamSchema);

// 보완 학습 풀이 결과 스키마 (사용자별 저장)
const supplementResultSchema = new mongoose.Schema({
  examId: { type: String, required: true },              // 시험지 ID (예: supplement_classic_poem)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  phone: { type: String },                               // 전화번호 (백업 식별자)
  studentInfo: {
    name: String,
    school: String,
    grade: String
  },
  answers: { type: Map, of: Number },                    // 문제별 답안 { "1": 2, "2": 1, ... }
  correctCount: { type: Number, default: 0 },            // 정답 개수
  totalQuestions: { type: Number, default: 0 },          // 전체 문항 수
  score: { type: Number, default: 0 },                   // 총점
  isGraded: { type: Boolean, default: false },           // 채점 완료 여부
  completedAt: { type: Date },                           // 완료 시점
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
supplementResultSchema.index({ examId: 1, userId: 1 });
supplementResultSchema.index({ examId: 1, phone: 1 });
const SupplementResult = mongoose.model('SupplementResult', supplementResultSchema);

// 12개 세부 영역 정보
const DETAIL_AREA_INFO = {
  speechTalk: { name: '화법', parent: 'speech' },
  speechWrite: { name: '작문', parent: 'speech' },
  speechIntegrated: { name: '화작통합', parent: 'speech' },
  grammarModern: { name: '현대문법', parent: 'grammar' },
  grammarClassic: { name: '중세문법', parent: 'grammar' },
  readingHumanities: { name: '인문사회예술', parent: 'reading' },
  readingScience: { name: '과학기술', parent: 'reading' },
  readingLaw: { name: '법경제', parent: 'reading' },
  litModernPoem: { name: '현대시', parent: 'literature' },
  litModernNovel: { name: '현대소설', parent: 'literature' },
  litClassicPoem: { name: '고전시가', parent: 'literature' },
  litClassicProse: { name: '당태종전', parent: 'literature' }
};

// 시험별 12개 세부 영역 문항 매핑
const examDetailMappingsServer = {
  'korean_mock_1': {
    speechTalk: [1, 2, 4, 5, 6],
    speechWrite: [28, 29, 30],
    speechIntegrated: [24, 25, 26, 27],
    grammarModern: [3, 7, 9, 10],
    grammarClassic: [8],
    readingHumanities: [11, 12, 13],
    readingScience: [14, 15, 16, 17],
    readingLaw: [18, 19, 20, 21, 22, 23],
    litModernPoem: [43, 44, 45],
    litModernNovel: [39, 40, 41, 42],
    litClassicPoem: [34, 35, 36, 37, 38],
    litClassicProse: [31, 32, 33]
  },
  'korean_mock_2': {
    speechTalk: [1, 2, 3],
    speechWrite: [8, 9, 10],
    speechIntegrated: [4, 5, 6, 7],
    grammarModern: [11, 12, 13, 14],
    grammarClassic: [15],
    readingHumanities: [16, 17, 18, 19, 20, 21],
    readingScience: [26, 27, 28, 29],
    readingLaw: [30, 31, 32, 33, 34],
    litModernPoem: [43, 44, 45],
    litModernNovel: [22, 23, 24, 25],
    litClassicPoem: [35, 36, 37, 38],
    litClassicProse: [39, 40, 41, 42]
  },
  'korean_mock_3': {
    speechTalk: [1, 2, 3],
    speechWrite: [8, 9, 10],
    speechIntegrated: [4, 5, 6, 7],
    grammarModern: [11, 12, 14, 15],
    grammarClassic: [13],
    readingHumanities: [20, 21, 22, 23, 24],
    readingScience: [32, 33, 34, 35, 36, 37],
    readingLaw: [28, 29, 30, 31],
    litModernPoem: [43, 44, 45],
    litModernNovel: [16, 17, 18, 19],
    litClassicPoem: [38, 39, 40, 41, 42],
    litClassicProse: [25, 26, 27]
  },
  'korean_mock_4': {
    speechTalk: [1, 2, 3],
    speechWrite: [8, 9, 10],
    speechIntegrated: [4, 5, 6, 7],
    grammarModern: [11, 12, 13, 14],
    grammarClassic: [15],
    readingHumanities: [29, 30, 31, 32, 33],
    readingScience: [38, 39, 40, 41, 42],
    readingLaw: [21, 22, 23, 24, 25],
    litModernPoem: [43, 44, 45],
    litModernNovel: [26, 27, 28],
    litClassicPoem: [16, 17, 18, 19, 20],
    litClassicProse: [34, 35, 36, 37]
  }
};

// 현재 주차 번호 계산 (2025년 1주차부터 시작)
function getWeekNumber(date = new Date()) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

// AI 추천 보완 학습 과제 조회 API
app.get('/api/mock-exam/recommend-tasks/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentWeek = getWeekNumber();

    // 현재 주차의 과제만 조회 (userId는 String 타입)
    const tasks = await MockExamRecommendTask.find({
      userId: userId,
      weekNumber: currentWeek
    }).sort({ diffPercent: -1 }); // 차이가 큰 순서대로

    res.json({ ok: true, tasks, weekNumber: currentWeek });
  } catch (err) {
    console.error('❌ [/api/mock-exam/recommend-tasks] 오류:', err);
    res.status(500).json({ ok: false, message: '조회 중 오류가 발생했습니다.', error: err.message });
  }
});

// AI 추천 보완 학습 과제 완료 처리 API
app.post('/api/mock-exam/recommend-tasks/:taskId/complete', async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await MockExamRecommendTask.findByIdAndUpdate(
      taskId,
      { status: 'completed', completedAt: new Date() },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ ok: false, message: '과제를 찾을 수 없습니다.' });
    }

    res.json({ ok: true, task });
  } catch (err) {
    console.error('❌ [/api/mock-exam/recommend-tasks/complete] 오류:', err);
    res.status(500).json({ ok: false, message: '완료 처리 중 오류가 발생했습니다.', error: err.message });
  }
});

// AI 추천 보완 학습 목표 점수 조회 API
app.get('/api/mock-exam/target-score/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await MockExamUser.findById(userId).select('targetScore');

    if (!user) {
      return res.status(404).json({ ok: false, message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({ ok: true, targetScore: user.targetScore });
  } catch (err) {
    console.error('❌ [/api/mock-exam/target-score GET] 오류:', err);
    res.status(500).json({ ok: false, message: '조회 중 오류가 발생했습니다.', error: err.message });
  }
});

// AI 추천 보완 학습 목표 점수 저장 API
app.put('/api/mock-exam/target-score/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { targetScore } = req.body;

    if (targetScore !== null && (typeof targetScore !== 'number' || targetScore < 0 || targetScore > 100)) {
      return res.status(400).json({ ok: false, message: '목표 점수는 0~100 사이의 숫자여야 합니다.' });
    }

    const user = await MockExamUser.findByIdAndUpdate(
      userId,
      { targetScore },
      { new: true }
    ).select('targetScore');

    if (!user) {
      return res.status(404).json({ ok: false, message: '사용자를 찾을 수 없습니다.' });
    }

    console.log(`✅ [목표점수 설정] 사용자 ${userId}: ${targetScore}점`);
    res.json({ ok: true, targetScore: user.targetScore });
  } catch (err) {
    console.error('❌ [/api/mock-exam/target-score PUT] 오류:', err);
    res.status(500).json({ ok: false, message: '저장 중 오류가 발생했습니다.', error: err.message });
  }
});

// =============================================
// 보완 학습 시험지 관리 API
// =============================================

// 삭제된 하드코딩 시험지 ID를 저장하는 Set (서버 재시작 시 초기화됨)
const deletedHardcodedExams = new Set();

// 보완 학습 시험지 전체 조회 (영역별 그룹핑)
app.get('/api/supplement-exams', async (req, res) => {
  try {
    const exams = await SupplementExam.find().sort({ areaKey: 1, createdAt: -1 });

    // 영역별로 그룹핑
    const grouped = {};
    for (const key of Object.keys(DETAIL_AREA_INFO)) {
      grouped[key] = {
        areaKey: key,
        areaName: DETAIL_AREA_INFO[key].name,
        parentArea: DETAIL_AREA_INFO[key].parent,
        exams: []
      };
    }

    exams.forEach(exam => {
      if (grouped[exam.areaKey]) {
        grouped[exam.areaKey].exams.push({
          _id: exam._id,
          examId: exam.examId,
          title: exam.title,
          questionCount: exam.questionCount,
          isActive: exam.isActive,
          createdAt: exam.createdAt,
          updatedAt: exam.updatedAt
        });
      }
    });

    // 하드코딩된 보완 학습 시험지 추가 (HTML 파일로 직접 만든 시험지)
    const hardcodedExams = [
      {
        areaKey: 'litClassicPoem',
        examId: 'supplement_classic_poem',
        title: '개암정가 + 청청각기',
        questionCount: 6,
        isActive: true,
        isHardcoded: true,
        pageUrl: '/supplement_classic_poem.html',
        createdAt: new Date('2024-12-30'),
        updatedAt: new Date('2024-12-30')
      },
      {
        areaKey: 'speechWrite',
        examId: 'supplement_writing',
        title: '자전거 주차장 방치 문제',
        questionCount: 7,
        isActive: true,
        isHardcoded: true,
        pageUrl: '/supplement_writing.html',
        createdAt: new Date('2024-12-31'),
        updatedAt: new Date('2024-12-31')
      },
      {
        areaKey: 'grammarClassic',
        examId: 'supplement_grammar_classic',
        title: '연결어미+주격조사',
        questionCount: 2,
        isActive: true,
        isHardcoded: true,
        pageUrl: '/supplement_grammar_classic.html',
        createdAt: new Date('2024-12-31'),
        updatedAt: new Date('2024-12-31')
      },
      {
        areaKey: 'litModernNovel',
        examId: 'supplement_modern_novel',
        title: '213호 주택',
        questionCount: 7,
        isActive: true,
        isHardcoded: true,
        pageUrl: '/supplement_modern_novel.html',
        createdAt: new Date('2024-12-31'),
        updatedAt: new Date('2024-12-31')
      },
      {
        areaKey: 'speechTalk',
        examId: 'supplement_speech',
        title: '발표 : 식물의 인지 행동',
        questionCount: 6,
        isActive: true,
        isHardcoded: true,
        pageUrl: '/supplement_speech.html',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      },
      {
        areaKey: 'litClassicProse',
        examId: 'supplement_classic_prose',
        title: '당태종전',
        questionCount: 6,
        isActive: true,
        isHardcoded: true,
        pageUrl: '/supplement_classic_prose.html',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      },
      {
        areaKey: 'speechIntegrated',
        examId: 'supplement_speech_integrated',
        title: '환경 동아리 대화 + 초고',
        questionCount: 4,
        isActive: true,
        isHardcoded: true,
        pageUrl: '/supplement_speech_integrated.html',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      },
      {
        areaKey: 'litModernPoem',
        examId: 'supplement_modern_poem',
        title: '목련나무 옆+그리운 곳',
        questionCount: 6,
        isActive: true,
        isHardcoded: true,
        pageUrl: '/supplement_modern_poem.html',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      },
      {
        areaKey: 'grammarModern',
        examId: 'supplement_grammar_modern',
        title: '문장의 종류+음운변동',
        questionCount: 4,
        isActive: true,
        isHardcoded: true,
        pageUrl: '/supplement_grammar_modern.html',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      },
      {
        areaKey: 'readingScience',
        examId: 'supplement_reading_science',
        title: '기술 : 햅틱스',
        questionCount: 6,
        isActive: true,
        isHardcoded: true,
        pageUrl: '/supplement_reading_science.html',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      },
      {
        areaKey: 'readingLaw',
        examId: 'supplement_reading_law',
        title: '법 : 민법 공유물 분할',
        questionCount: 7,
        isActive: true,
        isHardcoded: true,
        pageUrl: '/supplement_reading_law.html',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      },
      {
        areaKey: 'readingHumanities',
        examId: 'supplement_reading_humanities',
        title: '인문 : 언어철학 퍼트넘',
        questionCount: 6,
        isActive: true,
        isHardcoded: true,
        pageUrl: '/supplement_reading_humanities.html',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      },
      {
        areaKey: 'readingHumanities',
        examId: 'supplement_reading_social',
        title: '사회 독서 보완학습',
        questionCount: 6,
        isActive: false,
        isHardcoded: true,
        pageUrl: '/supplement_reading_social.html',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      },
      {
        areaKey: 'readingScience',
        examId: 'supplement_reading_tech',
        title: '기술 독서 보완학습',
        questionCount: 6,
        isActive: false,
        isHardcoded: true,
        pageUrl: '/supplement_reading_tech.html',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      },
      {
        areaKey: 'readingHumanities',
        examId: 'supplement_reading_art',
        title: '예술 독서 보완학습',
        questionCount: 6,
        isActive: false,
        isHardcoded: true,
        pageUrl: '/supplement_reading_art.html',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      }
    ];

    hardcodedExams.forEach(exam => {
      // 삭제된 하드코딩 시험지는 스킵
      if (deletedHardcodedExams.has(exam.examId)) {
        return;
      }
      if (grouped[exam.areaKey]) {
        grouped[exam.areaKey].exams.unshift({
          _id: exam.examId,
          examId: exam.examId,
          title: exam.title,
          questionCount: exam.questionCount,
          isActive: exam.isActive,
          isHardcoded: exam.isHardcoded,
          pageUrl: exam.pageUrl,
          createdAt: exam.createdAt,
          updatedAt: exam.updatedAt
        });
      }
    });

    res.json({ ok: true, data: grouped });
  } catch (err) {
    console.error('❌ [/api/supplement-exams] 오류:', err);
    res.status(500).json({ ok: false, message: '조회 중 오류가 발생했습니다.', error: err.message });
  }
});

// 보완 학습 시험지 상세 조회
app.get('/api/supplement-exams/:examId', async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await SupplementExam.findOne({ examId });

    if (!exam) {
      return res.status(404).json({ ok: false, message: '시험지를 찾을 수 없습니다.' });
    }

    res.json({ ok: true, exam });
  } catch (err) {
    console.error('❌ [/api/supplement-exams/:examId] 오류:', err);
    res.status(500).json({ ok: false, message: '조회 중 오류가 발생했습니다.', error: err.message });
  }
});

// 보완 학습 시험지 생성
app.post('/api/supplement-exams', async (req, res) => {
  try {
    const { areaKey, title, questions } = req.body;

    if (!areaKey || !DETAIL_AREA_INFO[areaKey]) {
      return res.status(400).json({ ok: false, message: '유효하지 않은 영역입니다.' });
    }

    // examId 자동 생성 (supplement_영역키_번호)
    const existingCount = await SupplementExam.countDocuments({ areaKey });
    const examId = `supplement_${areaKey}_${existingCount + 1}`;

    const exam = await SupplementExam.create({
      examId,
      areaKey,
      areaName: DETAIL_AREA_INFO[areaKey].name,
      parentArea: DETAIL_AREA_INFO[areaKey].parent,
      title: title || `${DETAIL_AREA_INFO[areaKey].name} 보완 학습 ${existingCount + 1}`,
      questionCount: questions ? questions.length : 0,
      questions: questions || []
    });

    res.json({ ok: true, exam });
  } catch (err) {
    console.error('❌ [POST /api/supplement-exams] 오류:', err);
    res.status(500).json({ ok: false, message: '생성 중 오류가 발생했습니다.', error: err.message });
  }
});

// 보완 학습 시험지 수정
app.put('/api/supplement-exams/:examId', async (req, res) => {
  try {
    const { examId } = req.params;
    const { title, questions, isActive } = req.body;

    const updateData = { updatedAt: new Date() };
    if (title !== undefined) updateData.title = title;
    if (questions !== undefined) {
      updateData.questions = questions;
      updateData.questionCount = questions.length;
    }
    if (isActive !== undefined) updateData.isActive = isActive;

    const exam = await SupplementExam.findOneAndUpdate(
      { examId },
      updateData,
      { new: true }
    );

    if (!exam) {
      return res.status(404).json({ ok: false, message: '시험지를 찾을 수 없습니다.' });
    }

    res.json({ ok: true, exam });
  } catch (err) {
    console.error('❌ [PUT /api/supplement-exams/:examId] 오류:', err);
    res.status(500).json({ ok: false, message: '수정 중 오류가 발생했습니다.', error: err.message });
  }
});

// 보완 학습 시험지 삭제
app.delete('/api/supplement-exams/:examId', async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await SupplementExam.findOneAndDelete({ examId });

    if (!exam) {
      return res.status(404).json({ ok: false, message: '시험지를 찾을 수 없습니다.' });
    }

    res.json({ ok: true, message: '시험지가 삭제되었습니다.' });
  } catch (err) {
    console.error('❌ [DELETE /api/supplement-exams/:examId] 오류:', err);
    res.status(500).json({ ok: false, message: '삭제 중 오류가 발생했습니다.', error: err.message });
  }
});

// 하드코딩된 시험지 삭제 (비활성화) - 런타임에서는 삭제할 수 없으므로 비활성화 처리
app.delete('/api/supplement-exams/hardcoded/:examId', async (req, res) => {
  try {
    const { examId } = req.params;

    // 삭제된 목록에 추가
    deletedHardcodedExams.add(examId);

    console.log(`✅ [DELETE /api/supplement-exams/hardcoded/${examId}] 하드코딩 시험지 비활성화됨`);
    res.json({ ok: true, message: '시험지가 삭제되었습니다. (서버 재시작 시 복구됩니다. 영구 삭제하려면 server.js에서 직접 제거하세요.)' });
  } catch (err) {
    console.error('❌ [DELETE /api/supplement-exams/hardcoded/:examId] 오류:', err);
    res.status(500).json({ ok: false, message: '삭제 중 오류가 발생했습니다.', error: err.message });
  }
});

// ===== 보완 학습 풀이 결과 저장/조회 API =====

// 보완 학습 답안 저장 (실시간 저장)
app.post('/api/supplement-result/save-answer', async (req, res) => {
  try {
    const { examId, questionNumber, answer } = req.body;
    const userId = req.session?.user?._id;
    const phone = req.session?.user?.phone;

    if (!examId || !questionNumber || answer === undefined) {
      return res.status(400).json({ ok: false, message: '필수 정보가 누락되었습니다.' });
    }

    // 기존 결과 찾기 또는 새로 생성
    let result = await SupplementResult.findOne({
      examId,
      $or: [{ userId }, { phone }]
    });

    if (!result) {
      result = new SupplementResult({
        examId,
        userId,
        phone,
        studentInfo: {
          name: req.session?.user?.name,
          school: req.session?.user?.school,
          grade: req.session?.user?.grade
        },
        answers: new Map()
      });
    }

    // 답안 저장
    result.answers.set(String(questionNumber), answer);
    result.updatedAt = new Date();
    await result.save();

    console.log(`✅ [보완학습] 답안 저장: ${examId} - 문제 ${questionNumber} = ${answer} (사용자: ${phone || userId})`);
    res.json({ ok: true });
  } catch (err) {
    console.error('❌ [POST /api/supplement-result/save-answer] 오류:', err);
    res.status(500).json({ ok: false, message: '답안 저장 중 오류가 발생했습니다.' });
  }
});

// 보완 학습 채점 결과 저장
app.post('/api/supplement-result/save-grade', async (req, res) => {
  try {
    const { examId, answers, correctCount, totalQuestions, score, userId: clientUserId, phone: clientPhone, studentInfo: clientStudentInfo } = req.body;
    // 클라이언트에서 전송한 정보 우선 사용, 없으면 세션에서 가져옴
    const userId = clientUserId || req.session?.user?._id;
    const phone = clientPhone || req.session?.user?.phone;
    const studentInfo = clientStudentInfo || {
      name: req.session?.user?.name,
      school: req.session?.user?.school,
      grade: req.session?.user?.grade
    };

    if (!examId) {
      return res.status(400).json({ ok: false, message: '시험 ID가 필요합니다.' });
    }

    // 사용자 정보가 없으면 에러
    if (!userId && !phone) {
      return res.status(400).json({ ok: false, message: '사용자 정보가 필요합니다.' });
    }

    // 기존 결과 찾기 또는 새로 생성
    const queryConditions = [];
    if (userId) queryConditions.push({ userId });
    if (phone) queryConditions.push({ phone });

    let result = await SupplementResult.findOne({
      examId,
      $or: queryConditions
    });

    if (!result) {
      result = new SupplementResult({
        examId,
        userId,
        phone,
        studentInfo
      });
    }

    // 채점 결과 저장
    if (answers) {
      result.answers = new Map(Object.entries(answers));
    }
    result.correctCount = correctCount || 0;
    result.totalQuestions = totalQuestions || 0;
    result.score = score || 0;
    result.isGraded = true;
    result.completedAt = new Date();
    result.updatedAt = new Date();
    await result.save();

    console.log(`✅ [보완학습] 채점 완료: ${examId} - ${correctCount}/${totalQuestions} (${score}점) (사용자: ${phone || userId})`);
    res.json({ ok: true, result: { correctCount, totalQuestions, score } });
  } catch (err) {
    console.error('❌ [POST /api/supplement-result/save-grade] 오류:', err);
    res.status(500).json({ ok: false, message: '채점 결과 저장 중 오류가 발생했습니다.' });
  }
});

// 보완 학습 결과 조회 (사용자별)
app.get('/api/supplement-result/:examId', async (req, res) => {
  try {
    const { examId } = req.params;
    // 클라이언트에서 전송한 정보 우선 사용, 없으면 세션에서 가져옴
    const userId = req.query.userId || req.session?.user?._id;
    const phone = req.query.phone || req.session?.user?.phone;

    // 사용자 정보가 없으면 결과 없음으로 반환 (보안)
    if (!userId && !phone) {
      return res.json({ ok: true, result: null });
    }

    // userId나 phone이 있는 경우에만 조회
    const queryConditions = [];
    if (userId) queryConditions.push({ userId });
    if (phone) queryConditions.push({ phone });

    const result = await SupplementResult.findOne({
      examId,
      $or: queryConditions
    });

    if (!result) {
      return res.json({ ok: true, result: null });
    }

    // Map을 일반 객체로 변환
    const answersObj = {};
    if (result.answers) {
      result.answers.forEach((value, key) => {
        answersObj[key] = value;
      });
    }

    res.json({
      ok: true,
      result: {
        examId: result.examId,
        answers: answersObj,
        correctCount: result.correctCount,
        totalQuestions: result.totalQuestions,
        score: result.score,
        isGraded: result.isGraded,
        completedAt: result.completedAt
      }
    });
  } catch (err) {
    console.error('❌ [GET /api/supplement-result/:examId] 오류:', err);
    res.status(500).json({ ok: false, message: '결과 조회 중 오류가 발생했습니다.' });
  }
});

// 보완 학습 결과 초기화 (다시 풀기)
app.delete('/api/supplement-result/:examId', async (req, res) => {
  try {
    const { examId } = req.params;
    // 쿼리 파라미터에서 사용자 정보 받기 (세션 만료 대비)
    const userId = req.query.userId || req.session?.user?._id;
    const phone = req.query.phone || req.session?.user?.phone;

    // 사용자 정보가 없으면 에러
    if (!userId && !phone) {
      return res.status(400).json({ ok: false, message: '사용자 정보가 필요합니다.' });
    }

    const queryConditions = [];
    if (userId) queryConditions.push({ userId });
    if (phone) queryConditions.push({ phone });

    await SupplementResult.deleteOne({
      examId,
      $or: queryConditions
    });

    console.log(`✅ [보완학습] 결과 초기화: ${examId} (사용자: ${phone || userId})`);
    res.json({ ok: true });
  } catch (err) {
    console.error('❌ [DELETE /api/supplement-result/:examId] 오류:', err);
    res.status(500).json({ ok: false, message: '초기화 중 오류가 발생했습니다.' });
  }
});

// ===== 예측 레이더 데이터 API (실제 모의고사 + 보완학습 누적) =====
app.get('/api/mock-exam/supplement-progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const phone = req.query.phone;

    if (!userId && !phone) {
      return res.json({ ok: false, message: '사용자 정보가 필요합니다.' });
    }

    // 1. 사용자의 모든 보완학습 결과 조회 (채점 완료된 것만)
    const queryConditions = [];
    // SupplementResult.userId는 ObjectId 타입이므로 변환 필요
    if (userId && userId !== 'undefined') {
      try {
        queryConditions.push({ userId: new mongoose.Types.ObjectId(userId) });
      } catch (e) {
        // ObjectId 변환 실패시 문자열로 시도
        queryConditions.push({ userId });
      }
    }
    if (phone) queryConditions.push({ phone });

    // 조건이 없으면 빈 결과 반환
    if (queryConditions.length === 0) {
      return res.json({ ok: true, progress: { speech: { correct: 0, total: 0, percent: 0 }, grammar: { correct: 0, total: 0, percent: 0 }, reading: { correct: 0, total: 0, percent: 0 }, literature: { correct: 0, total: 0, percent: 0 } } });
    }

    const supplementResults = await SupplementResult.find({
      $or: queryConditions,
      isGraded: true
    });

    // 2. 모든 보완학습 시험지 조회 (parentArea, areaKey 매핑을 위해)
    const supplementExams = await SupplementExam.find({});
    const examAreaMap = {
      // 하드코딩된 시험지 매핑 (HTML 파일 기반)
      'supplement_classic_poem': { parentArea: 'literature', areaKey: 'litClassicPoem' },
      'supplement_classic_prose': { parentArea: 'literature', areaKey: 'litClassicProse' },
      'supplement_writing': { parentArea: 'speech', areaKey: 'speechWrite' },
      'supplement_grammar_classic': { parentArea: 'grammar', areaKey: 'grammarClassic' },
      'supplement_modern_novel': { parentArea: 'literature', areaKey: 'litModernNovel' },
      'supplement_speech': { parentArea: 'speech', areaKey: 'speechTalk' },
      'supplement_modern_poem': { parentArea: 'literature', areaKey: 'litModernPoem' },
      'supplement_grammar_modern': { parentArea: 'grammar', areaKey: 'grammarModern' },
      'supplement_reading_science': { parentArea: 'reading', areaKey: 'readingScience' },
      'supplement_reading_law': { parentArea: 'reading', areaKey: 'readingLaw' },
      'supplement_reading_social': { parentArea: 'reading', areaKey: 'readingHumanities' },
      'supplement_reading_tech': { parentArea: 'reading', areaKey: 'readingScience' },
      'supplement_reading_humanities': { parentArea: 'reading', areaKey: 'readingHumanities' },
      'supplement_reading_art': { parentArea: 'reading', areaKey: 'readingHumanities' },
      'supplement_speech_integrated': { parentArea: 'speech', areaKey: 'speechIntegrated' }
    };
    // DB에 저장된 시험지 매핑 추가
    supplementExams.forEach(exam => {
      examAreaMap[exam.examId] = { parentArea: exam.parentArea, areaKey: exam.areaKey };
    });

    // 3. 영역별 보완학습 정답 집계 (4개 대분류)
    const supplementProgress = {
      speech: { correct: 0, total: 0 },
      grammar: { correct: 0, total: 0 },
      reading: { correct: 0, total: 0 },
      literature: { correct: 0, total: 0 }
    };

    // 12개 세부 영역별 집계
    const detailProgress = {
      speechTalk: { correct: 0, total: 0 },
      speechWrite: { correct: 0, total: 0 },
      speechIntegrated: { correct: 0, total: 0 },
      grammarModern: { correct: 0, total: 0 },
      grammarClassic: { correct: 0, total: 0 },
      readingHumanities: { correct: 0, total: 0 },
      readingScience: { correct: 0, total: 0 },
      readingLaw: { correct: 0, total: 0 },
      litModernPoem: { correct: 0, total: 0 },
      litClassicPoem: { correct: 0, total: 0 },
      litModernNovel: { correct: 0, total: 0 },
      litClassicProse: { correct: 0, total: 0 }
    };

    supplementResults.forEach(result => {
      const mapping = examAreaMap[result.examId];
      if (mapping) {
        const { parentArea, areaKey } = mapping;
        // 대분류 집계
        if (parentArea && supplementProgress[parentArea]) {
          supplementProgress[parentArea].correct += result.correctCount || 0;
          supplementProgress[parentArea].total += result.totalQuestions || 0;
        }
        // 세부 영역 집계
        if (areaKey && detailProgress[areaKey]) {
          detailProgress[areaKey].correct += result.correctCount || 0;
          detailProgress[areaKey].total += result.totalQuestions || 0;
        }
      }
    });

    // 4. AI 추천 보완 과제 완료 데이터도 추가 (MockExamRecommendTask에서 status='completed'인 것)
    const recommendTaskQuery = [];
    if (userId && userId !== 'undefined') recommendTaskQuery.push({ userId });
    if (phone) recommendTaskQuery.push({ phone });

    if (recommendTaskQuery.length > 0) {
      const completedTasks = await MockExamRecommendTask.find({
        $or: recommendTaskQuery,
        status: 'completed'
      });

      completedTasks.forEach(task => {
        const parentArea = task.parentArea;
        const areaKey = task.areaKey;
        const taskTotal = task.totalCount || 5;
        const taskCorrect = task.correctCount || Math.round(taskTotal * (task.avgRate || 70) / 100);

        // 대분류 집계
        if (parentArea && supplementProgress[parentArea]) {
          supplementProgress[parentArea].correct += taskCorrect;
          supplementProgress[parentArea].total += taskTotal;
        }
        // 세부 영역 집계
        if (areaKey && detailProgress[areaKey]) {
          detailProgress[areaKey].correct += taskCorrect;
          detailProgress[areaKey].total += taskTotal;
        }
      });

      console.log(`[예측레이더] AI 추천 과제 완료 ${completedTasks.length}건 반영`);
    }

    // 5. 퍼센트 계산 (대분류)
    Object.keys(supplementProgress).forEach(area => {
      const data = supplementProgress[area];
      data.percent = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    });

    // 세부 영역 퍼센트 계산
    Object.keys(detailProgress).forEach(area => {
      const data = detailProgress[area];
      data.percent = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    });

    console.log(`[예측레이더] 사용자 ${userId || phone} 보완학습 진행현황:`, supplementProgress);

    res.json({
      ok: true,
      progress: supplementProgress,
      detailProgress: detailProgress
    });
  } catch (err) {
    console.error('❌ [GET /api/mock-exam/supplement-progress] 오류:', err);
    res.status(500).json({ ok: false, message: '서버 오류가 발생했습니다.' });
  }
});

// AI 추천 보완 학습 과제 생성 함수 (사용자별)
async function generateRecommendTasksForUser(userId, phone) {
  try {
    const currentWeek = getWeekNumber();

    // 이미 이번 주 과제가 있으면 스킵
    const existingTasks = await MockExamRecommendTask.findOne({ userId, weekNumber: currentWeek });
    if (existingTasks) {
      console.log(`[RecommendTask] 사용자 ${userId}는 이미 ${currentWeek}주차 과제가 있음`);
      return;
    }

    // 사용자의 모든 모의고사 결과 조회
    const results = await MockExamResult.find({
      $or: [
        { userId },
        { 'studentInfo.phoneNumber': phone }
      ]
    }).sort({ completedAt: -1 });

    if (!results || results.length === 0) {
      console.log(`[RecommendTask] 사용자 ${userId}의 모의고사 결과 없음`);
      return;
    }

    // 12개 세부 영역별 점수 계산
    const scores = {};
    Object.keys(DETAIL_AREA_INFO).forEach(key => {
      scores[key] = { correct: 0, total: 0 };
    });

    // 각 회차별 최신 결과 1개씩만 사용
    const latestByExam = {};
    results.forEach(result => {
      const examId = result.examId || 'korean_mock_1';
      if (!latestByExam[examId]) {
        latestByExam[examId] = result;
      }
    });

    Object.values(latestByExam).forEach(result => {
      const examId = result.examId || 'korean_mock_1';
      const areaQuestions = examDetailMappingsServer[examId] || examDetailMappingsServer['korean_mock_1'];
      const wrongAnswers = result.wrongAnswers || [];
      const wrongQuestionNums = wrongAnswers.map(w => w.questionNum);

      Object.keys(areaQuestions).forEach(key => {
        const questions = areaQuestions[key];
        questions.forEach(qNum => {
          scores[key].total++;
          if (!wrongQuestionNums.includes(qNum)) {
            scores[key].correct++;
          }
        });
      });
    });

    // 정답률 계산
    Object.keys(scores).forEach(key => {
      scores[key].rate = scores[key].total > 0
        ? Math.round((scores[key].correct / scores[key].total) * 100)
        : 0;
    });

    // 사용자의 전체 평균 점수 계산 (상단에 표시되는 평균 점수와 동일)
    // 각 회차별 최신 결과의 점수 평균
    const examResults = Object.values(latestByExam);
    const totalScore = examResults.reduce((sum, r) => sum + (r.score || 0), 0);
    const avgScore = examResults.length > 0 ? Math.round(totalScore / examResults.length) : 0;

    // 사용자의 목표 점수 조회 (설정되어 있으면 목표 점수, 없으면 현재 평균 점수 사용)
    const user = await MockExamUser.findById(userId).select('targetScore');
    const targetScore = (user && user.targetScore !== null) ? user.targetScore : avgScore;

    // 목표 점수를 기준으로 설정
    const AVG_RATE = targetScore;
    console.log(`[RecommendTask] 사용자 ${userId} 평균 점수: ${avgScore}점, 목표 점수: ${targetScore}점`);

    // 평균 대비 차이 계산 및 과제 대상 선정
    const taskCandidates = [];
    Object.keys(scores).forEach(key => {
      const userRate = scores[key].rate;
      const diff = AVG_RATE - userRate; // 평균 - 사용자 (양수면 사용자가 낮음)

      if (diff > 5) { // 6% 이상 차이나면 과제 대상
        taskCandidates.push({
          areaKey: key,
          areaName: DETAIL_AREA_INFO[key].name,
          parentArea: DETAIL_AREA_INFO[key].parent,
          correctCount: scores[key].correct,
          totalCount: scores[key].total,
          userRate,
          avgRate: AVG_RATE,
          diffPercent: diff
        });
      }
    });

    // 차이가 큰 순서대로 정렬
    taskCandidates.sort((a, b) => b.diffPercent - a.diffPercent);

    // 과제 개수 결정: 6% 이상 차이나는 모든 영역 (최대 12개까지)
    // 목표 점수 대비 부족한 영역은 모두 보완 과제로 추천
    const tasksToCreate = taskCandidates; // 이미 diff > 5 조건으로 필터링됨
    for (const task of tasksToCreate) {
      await MockExamRecommendTask.create({
        userId,
        phone,
        ...task,
        weekNumber: currentWeek
      });
    }

    console.log(`[RecommendTask] 사용자 ${userId}에게 ${tasksToCreate.length}개 과제 생성 (${currentWeek}주차)`);
  } catch (err) {
    console.error(`[RecommendTask] 사용자 ${userId} 과제 생성 오류:`, err);
  }
}

// 모든 사용자에게 AI 추천 보완 학습 과제 생성 (스케줄러용)
async function generateRecommendTasksForAllUsers() {
  try {
    console.log('🔄 AI 추천 보완 학습 과제 생성 시작...');

    // 모든 모의고사 사용자 조회
    const users = await MockExamUser.find({}).lean();
    console.log(`📊 총 ${users.length}명의 사용자 대상`);

    for (const user of users) {
      await generateRecommendTasksForUser(user._id.toString(), user.phone);
    }

    console.log('✅ AI 추천 보완 학습 과제 생성 완료');
  } catch (err) {
    console.error('❌ AI 추천 보완 학습 과제 생성 오류:', err);
  }
}

// 매주 월요일 00:00 스케줄러 - AI 추천 보완 학습 과제 생성
cron.schedule('0 0 * * 1', () => {
  console.log('⏰ 매주 월요일 00:00 - AI 추천 보완 학습 과제 생성 스케줄러 트리거');
  generateRecommendTasksForAllUsers();
}, {
  timezone: "Asia/Seoul"
});

console.log('✅ AI 추천 보완 학습 스케줄러 등록 완료 (매주 월요일 00:00 실행)');

// 테스트용 수동 트리거 엔드포인트
app.post('/api/mock-exam/recommend-tasks/generate/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await MockExamUser.findById(userId);
    if (!user) {
      return res.status(404).json({ ok: false, message: '사용자를 찾을 수 없습니다.' });
    }

    // 기존 과제 삭제 후 재생성 (테스트용)
    const currentWeek = getWeekNumber();
    await MockExamRecommendTask.deleteMany({ userId, weekNumber: currentWeek });
    await generateRecommendTasksForUser(userId, user.phone);

    const tasks = await MockExamRecommendTask.find({ userId, weekNumber: currentWeek });
    res.json({ ok: true, message: '과제가 생성되었습니다.', tasks });
  } catch (err) {
    console.error('❌ [/api/mock-exam/recommend-tasks/generate] 오류:', err);
    res.status(500).json({ ok: false, message: '생성 중 오류가 발생했습니다.', error: err.message });
  }
});

// ===== 형성평가 관문 시스템 API =====

// 관문 통과 기록 스키마
const gatePassSchema = new mongoose.Schema({
  grade: String,
  name: String,
  gate: Number,           // 관문 레벨 (1, 2, 3, ...)
  passedAt: { type: Date, default: Date.now },
  units: [String]         // 해당 관문에 포함된 단원들
});
const GatePass = mongoose.model("GatePass", gatePassSchema);

// 관문 시도 기록 스키마 (상세 데이터)
const gateAttemptSchema = new mongoose.Schema({
  grade: String,
  name: String,
  gate: Number,                    // 관문 레벨
  attemptAt: { type: Date, default: Date.now },  // 시도 시각
  passed: { type: Boolean, default: false },     // 통과 여부
  totalTime: { type: Number, default: 0 },       // 전체 풀이 시간 (초)
  totalWrongClicks: { type: Number, default: 0 }, // 전체 오답 클릭 횟수
  questionDetails: [{              // 각 문항별 상세
    questionNo: Number,            // 문항 번호 (1, 2, 3, ...)
    unitCode: String,              // 단원 코드
    timeSpent: Number,             // 머문 시간 (초)
    wrongClicks: Number,           // 오답 클릭 횟수
    correct: Boolean               // 정답 여부
  }]
});
const GateAttempt = mongoose.model("GateAttempt", gateAttemptSchema);

// 관문 문제 생성 API
app.get("/api/gate-quiz/generate", async (req, res) => {
  try {
    const { grade, name, gate } = req.query;
    const gateLevel = parseInt(gate) || 1;

    console.log(`[gate-quiz/generate] grade=${grade}, name=${name}, gate=${gateLevel}`);

    if (!grade || !name) {
      return res.json({ ok: false, message: "학생 정보가 필요합니다." });
    }

    // 1) 해당 학생의 완료된 단원 조회 (완료 시간순 정렬)
    const completedLogs = await LearningLog.find({
      grade,
      name,
      completed: true,
      deleted: { $ne: true }
    }).select('unit timestamp').sort({ timestamp: 1 }).lean();

    // 중복 제거 (첫 번째 완료 기록만 유지, 완료 순서 보존)
    const seen = new Set();
    const allCompletedUnits = [];
    for (const log of completedLogs) {
      if (!seen.has(log.unit)) {
        seen.add(log.unit);
        allCompletedUnits.push(log.unit);
      }
    }
    console.log(`[gate-quiz/generate] 전체 완료 단원 (순서대로): ${allCompletedUnits.length}개`);

    // 2) 이미 통과한 관문 확인
    const passedGates = await GatePass.find({ grade, name }).select('gate').lean();
    const passedGateNums = passedGates.map(g => g.gate);
    console.log(`[gate-quiz/generate] 통과한 관문: ${passedGateNums}`);

    // 3) 해당 관문에 해당하는 단원 범위 계산 (완료 순서 기준)
    // 관문 1: 1~5번째 완료, 관문 2: 6~10번째 완료, ...
    const startIdx = (gateLevel - 1) * 5;  // 관문 1: 0, 관문 2: 5, 관문 3: 10
    const endIdx = gateLevel * 5;          // 관문 1: 5, 관문 2: 10, 관문 3: 15

    // 완료 순서대로 해당 범위의 단원들
    const gateUnits = allCompletedUnits.slice(startIdx, endIdx);
    console.log(`[gate-quiz/generate] 관문 ${gateLevel} 범위 단원 (${startIdx + 1}~${endIdx}번째 완료): ${gateUnits.length}개`, gateUnits);

    if (gateUnits.length < 5) {
      return res.json({
        ok: false,
        message: `관문 ${gateLevel} 시험을 보려면 ${endIdx}개 단원 완료가 필요합니다. (현재: ${allCompletedUnits.length}개)`
      });
    }

    // 4) 각 단원에서 q1 또는 q2 문제 추출 (서버에서 콘텐츠 파일 읽기)
    const quizzes = [];

    for (const unitCode of gateUnits.slice(0, 5)) {
      // unitCode 예: "geo_01", "bio_05", "classic_12", "fit_physics_01", "fit_bio_02"
      // FIT 시리즈: fit_physics_01, fit_bio_02 등
      const isFit = unitCode.startsWith('fit_');
      let subject, num;

      if (isFit) {
        // fit_physics_01 → subject: physics, num: 01
        const fitMatch = unitCode.match(/fit_([a-z]+\d?)_(\d{1,2})/);
        if (!fitMatch) continue;
        subject = fitMatch[1];
        num = fitMatch[2].padStart(2, '0');
      } else {
        // geo_01, bio_05 → subject: geo, num: 01
        const match = unitCode.match(/([a-z]+\d?)_(\d{1,2})/);
        if (!match) continue;
        subject = match[1];
        num = match[2].padStart(2, '0');
      }

      // 과목에 따른 폴더 경로 결정
      let folder = 'social';
      if (['bio', 'physics', 'chem', 'earth'].includes(subject)) folder = 'science';
      else if (['modern', 'classic'].includes(subject)) folder = 'korlit';
      else if (['world1', 'world2'].includes(subject)) folder = 'worldlit';
      else if (['people1', 'people2'].includes(subject)) folder = 'person';

      // FIT 시리즈는 fit_xxx_content.js 파일 사용
      const contentFileName = isFit ? `fit_${subject}_content.js` : `${subject}_content.js`;
      const contentPath = path.join(__dirname, 'public', 'BRAINUP', folder, contentFileName);

      try {
        if (fs.existsSync(contentPath)) {
          const content = fs.readFileSync(contentPath, 'utf8');

          // 해당 단원의 quiz 객체 찾기
          // FIT 시리즈는 fit_physics_01 형식, 일반 시리즈는 physics_01 형식
          const unitKey = isFit ? `fit_${subject}_${num}` : `${subject}_${num}`;
          const labelNoMatch = content.match(new RegExp(`labelNo:\\s*["']${num}["']`));

          if (labelNoMatch) {
            // 해당 단원 블록에서 quiz 추출
            const unitIndex = content.indexOf(labelNoMatch[0]);
            const nextUnitMatch = content.slice(unitIndex + 100).match(/labelNo:\s*["']\d{2}["']/);
            const endIndex = nextUnitMatch ? unitIndex + 100 + content.slice(unitIndex + 100).indexOf(nextUnitMatch[0]) : content.length;
            const unitBlock = content.slice(unitIndex, endIndex);

            // title 추출
            const titleMatch = unitBlock.match(/title:\s*["'](.+?)["']/);
            const unitTitle = titleMatch ? titleMatch[1] : `${subject} ${num}`;

            // answerKey에서 정답 찾기 (q1: '1' 또는 q1: 1 형태)
            const answerKeyMatch = unitBlock.match(/answerKey:\s*\{([^}]+)\}/);
            let q1Answer = 1;
            let q2Answer = 1;
            if (answerKeyMatch) {
              const answerKeyBlock = answerKeyMatch[1];
              const q1AnsMatch = answerKeyBlock.match(/q1:\s*['"]?(\d)['"]?/);
              const q2AnsMatch = answerKeyBlock.match(/q2:\s*['"]?(\d)['"]?/);
              if (q1AnsMatch) q1Answer = parseInt(q1AnsMatch[1]);
              if (q2AnsMatch) q2Answer = parseInt(q2AnsMatch[1]);
            }

            // passage 추출 (본문 4문단 - 이스케이프된 따옴표 처리)
            const passageMatch = unitBlock.match(/passage:\s*\[([\s\S]*?)\],?\s*\n\s*vocab:/);
            let passages = [];
            if (passageMatch) {
              // 각 문단 추출 - 이스케이프된 따옴표(\')를 포함한 패턴 사용
              const passageRaw = passageMatch[1];
              // '...' 패턴에서 내부의 \' 를 허용 (역슬래시+따옴표는 종료로 간주하지 않음)
              passages = passageRaw.match(/'((?:\\'|[^'])+)'/g)?.map(s => {
                // 양쪽 따옴표 제거 후 이스케이프된 따옴표를 일반 따옴표로 변환
                return s.slice(1, -1).replace(/\\'/g, "'");
              }) || [];
            }

            // q1_text와 q1_opts 추출 (실제 콘텐츠 구조)
            // 작은따옴표로 시작하면 작은따옴표로만 종료 (내부 쌍따옴표 허용)
            const q1TextMatch = unitBlock.match(/q1_text:\s*'((?:\\'|[^'])+?)'/) ||
                                unitBlock.match(/q1_text:\s*"((?:\\"|[^"])+?)"/);
            const q1OptsMatch = unitBlock.match(/q1_opts:\s*\[([\s\S]*?)\]/);

            if (q1TextMatch && q1OptsMatch) {
              // 이스케이프 문자 제거 (\' → ', \" → ")
              const q1Question = q1TextMatch[1].replace(/\\'/g, "'").replace(/\\"/g, '"');

              // 옵션 파싱 - ① ② ③ ④ 제거, 이스케이프 문자 처리
              const optionsRaw = q1OptsMatch[1];
              let options = optionsRaw.match(/['"]((\\['"]|[^'"])+?)['"]/g)?.map(s => {
                let opt = s.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"').trim();
                // ① ② ③ ④ 제거
                opt = opt.replace(/^[①②③④]\s*/, '');
                return opt;
              }) || [];

              if (options.length === 4) {
                quizzes.push({
                  unit: unitKey,
                  unitCode: unitCode,
                  unitTitle: unitTitle,
                  passage: passages,
                  question: q1Question,
                  options: options,
                  correct: q1Answer,
                  qType: 'q1'  // 지수 유형: 핵심이해력
                });
                console.log(`[gate-quiz] ${unitKey} q1 추출 성공 (passage: ${passages.length}문단)`);
                continue;
              }
            }

            // q1 실패 시 q2 시도
            const q2TextMatch = unitBlock.match(/q2_text:\s*'((?:\\'|[^'])+?)'/) ||
                                unitBlock.match(/q2_text:\s*"((?:\\"|[^"])+?)"/);
            const q2OptsMatch = unitBlock.match(/q2_opts:\s*\[([\s\S]*?)\]/);

            if (q2TextMatch && q2OptsMatch) {
              // 이스케이프 문자 제거
              const q2Question = q2TextMatch[1].replace(/\\'/g, "'").replace(/\\"/g, '"');
              const optionsRaw = q2OptsMatch[1];
              let options = optionsRaw.match(/['"]((\\['"]|[^'"])+?)['"]/g)?.map(s => {
                let opt = s.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"').trim();
                opt = opt.replace(/^[①②③④]\s*/, '');
                return opt;
              }) || [];

              if (options.length === 4) {
                quizzes.push({
                  unit: unitKey,
                  unitCode: unitCode,
                  unitTitle: unitTitle,
                  passage: passages,
                  question: q2Question,
                  options: options,
                  correct: q2Answer,
                  qType: 'q2'  // 지수 유형: 구조파악력
                });
                console.log(`[gate-quiz] ${unitKey} q2 추출 성공 (passage: ${passages.length}문단)`);
              }
            }
          }
        }
      } catch (err) {
        console.error(`[gate-quiz] ${unitCode} 문제 추출 실패:`, err.message);
      }
    }

    console.log(`[gate-quiz/generate] 생성된 문제: ${quizzes.length}개`);

    if (quizzes.length < 10) {
      return res.json({
        ok: false,
        message: `문제 생성에 실패했습니다. (생성: ${quizzes.length}/10)`
      });
    }

    res.json({
      ok: true,
      gate: gateLevel,
      quizzes: quizzes.slice(0, 10),
      units: gateUnits.slice(0, 10)
    });

  } catch (err) {
    console.error("[gate-quiz/generate] error:", err);
    res.status(500).json({ ok: false, message: "서버 오류가 발생했습니다." });
  }
});

// 관문 통과 저장 API
app.post("/api/gate-quiz/pass", async (req, res) => {
  try {
    const { grade, name, gate, units } = req.body;

    console.log(`[gate-quiz/pass] grade=${grade}, name=${name}, gate=${gate}`);

    if (!grade || !name || !gate) {
      return res.json({ ok: false, message: "필수 정보가 부족합니다." });
    }

    // 이미 통과했는지 확인
    const existing = await GatePass.findOne({ grade, name, gate });
    if (existing) {
      return res.json({ ok: true, message: "이미 통과한 관문입니다." });
    }

    // 새 관문 통과 기록 저장
    const gatePass = new GatePass({
      grade,
      name,
      gate,
      units: units || []
    });
    await gatePass.save();

    console.log(`[gate-quiz/pass] 관문 ${gate} 통과 저장 완료`);
    res.json({ ok: true, message: "관문 통과가 저장되었습니다." });

  } catch (err) {
    console.error("[gate-quiz/pass] error:", err);
    res.status(500).json({ ok: false, message: "서버 오류가 발생했습니다." });
  }
});

// 관문 시도 기록 저장 API
app.post("/api/gate-quiz/attempt", async (req, res) => {
  try {
    const { grade, name, gate, passed, totalTime, totalWrongClicks, questionDetails } = req.body;

    console.log(`[gate-quiz/attempt] grade=${grade}, name=${name}, gate=${gate}, passed=${passed}`);

    if (!grade || !name || !gate) {
      return res.json({ ok: false, message: "필수 정보가 부족합니다." });
    }

    // 새 시도 기록 저장
    const attempt = new GateAttempt({
      grade,
      name,
      gate,
      passed: passed || false,
      totalTime: totalTime || 0,
      totalWrongClicks: totalWrongClicks || 0,
      questionDetails: questionDetails || []
    });
    await attempt.save();

    console.log(`[gate-quiz/attempt] 관문 ${gate} 시도 기록 저장 완료`);
    res.json({ ok: true, message: "시도 기록이 저장되었습니다.", attemptId: attempt._id });

  } catch (err) {
    console.error("[gate-quiz/attempt] error:", err);
    res.status(500).json({ ok: false, message: "서버 오류가 발생했습니다." });
  }
});

// 관문 상세 정보 조회 API (슈퍼관리자용)
app.get("/api/super/gate-pass-details", requireSuperAdmin, async (req, res) => {
  try {
    const { grade, name, gate } = req.query;

    if (!grade || !name || !gate) {
      return res.json({ ok: false, message: "필수 정보가 부족합니다." });
    }

    // 해당 관문의 모든 시도 기록 조회
    const attempts = await GateAttempt.find({
      grade,
      name,
      gate: parseInt(gate)
    }).sort({ attemptAt: 1 }).lean();

    // 통과 기록 조회
    const passRecord = await GatePass.findOne({
      grade,
      name,
      gate: parseInt(gate)
    }).lean();

    // 재도전 횟수 계산 (통과 전 시도 횟수)
    const retryCount = attempts.filter(a => !a.passed).length;

    // 누적 데이터 계산
    let totalTimeAll = 0;
    let totalWrongClicksAll = 0;
    const questionTimeMap = {};  // 문항별 누적 시간
    const questionWrongMap = {}; // 문항별 누적 오답

    attempts.forEach(attempt => {
      totalTimeAll += attempt.totalTime || 0;
      totalWrongClicksAll += attempt.totalWrongClicks || 0;

      if (attempt.questionDetails) {
        attempt.questionDetails.forEach(q => {
          const key = q.questionNo;
          if (!questionTimeMap[key]) {
            questionTimeMap[key] = {
              time: 0,
              wrongs: 0,
              unitCode: q.unitCode,
              unitTitle: q.unitTitle || '',
              qType: q.qType || 'q1'
            };
          }
          // 최신 데이터로 업데이트 (unitTitle, qType은 마지막 시도 기준)
          if (q.unitTitle) questionTimeMap[key].unitTitle = q.unitTitle;
          if (q.qType) questionTimeMap[key].qType = q.qType;
          questionTimeMap[key].time += q.timeSpent || 0;
          questionTimeMap[key].wrongs += q.wrongClicks || 0;
        });
      }
    });

    // 최종 통과 시도 데이터
    const finalAttempt = attempts.find(a => a.passed) || attempts[attempts.length - 1];

    res.json({
      ok: true,
      data: {
        grade,
        name,
        gate: parseInt(gate),
        passedAt: passRecord?.passedAt,
        retryCount,                          // 재도전 횟수
        totalAttempts: attempts.length,      // 총 시도 횟수
        cumulativeTime: totalTimeAll,        // 누적 전체 시간
        cumulativeWrongClicks: totalWrongClicksAll, // 누적 오답 클릭
        questionDetails: Object.entries(questionTimeMap).map(([no, data]) => ({
          questionNo: parseInt(no),
          unitCode: data.unitCode,
          unitTitle: data.unitTitle || UNIT_TITLES[data.unitCode] || '',
          qType: data.qType || 'q1',
          cumulativeTime: data.time,         // 문항별 누적 시간
          cumulativeWrongClicks: data.wrongs // 문항별 누적 오답
        })),
        finalAttempt: finalAttempt ? {
          totalTime: finalAttempt.totalTime,
          totalWrongClicks: finalAttempt.totalWrongClicks,
          passed: finalAttempt.passed,
          attemptAt: finalAttempt.attemptAt
        } : null,
        attempts: attempts.map(a => ({
          attemptAt: a.attemptAt,
          passed: a.passed,
          totalTime: a.totalTime,
          totalWrongClicks: a.totalWrongClicks
        }))
      }
    });

  } catch (err) {
    console.error("[gate-pass-details] error:", err);
    res.status(500).json({ ok: false, message: "서버 오류가 발생했습니다." });
  }
});

// 관문 상태 확인 API
app.get("/api/gate-quiz/status", async (req, res) => {
  try {
    const { grade, name } = req.query;

    if (!grade || !name) {
      return res.json({ ok: false, message: "학생 정보가 필요합니다." });
    }

    // 완료된 단원 목록
    const completedLogs = await LearningLog.find({
      grade,
      name,
      completed: true,
      deleted: { $ne: true }
    }).select('unit').lean();
    const completedUnitIds = [...new Set(completedLogs.map(log => log.unit))];
    const completedCount = completedUnitIds.length;

    // 통과한 관문들
    const passedGates = await GatePass.find({ grade, name }).select('gate passedAt').lean();

    // 다음 관문 레벨 계산
    const highestPassedGate = passedGates.length > 0
      ? Math.max(...passedGates.map(g => g.gate))
      : 0;
    const nextGate = highestPassedGate + 1;

    // 다음 관문을 볼 수 있는지 (5개 단원마다)
    const requiredUnits = nextGate * 5;
    const canTakeGate = completedCount >= requiredUnits;

    res.json({
      ok: true,
      completedUnits: completedCount,
      completedUnitIds,  // 완료된 단원 ID 목록 추가
      passedGates: passedGates.map(g => g.gate),
      highestPassedGate,  // 가장 높은 통과 관문 추가
      nextGate,
      canTakeGate,
      requiredUnits
    });

  } catch (err) {
    console.error("[gate-quiz/status] error:", err);
    res.status(500).json({ ok: false, message: "서버 오류가 발생했습니다." });
  }
});

// ===== 메뉴 초기화 통합 API (성능 최적화) =====
// 여러 API를 한 번에 호출하여 네트워크 왕복 횟수를 줄임
app.get("/api/menu-init", async (req, res) => {
  const startTime = Date.now();
  console.log("🚀 [/api/menu-init] 통합 API 호출 시작");

  try {
    const { grade, name, series, phone } = req.query;

    if (!grade || !name) {
      return res.status(400).json({
        ok: false,
        message: "grade, name 파라미터가 필요합니다."
      });
    }

    // 세션 정보
    const session = req.session && req.session.user
      ? { ok: true, user: req.session.user }
      : { ok: false, user: null };

    // 병렬로 모든 데이터 조회
    const [
      userInfo,
      userProgress,
      completedLogs,
      allLogs,
      unitGradesData
    ] = await Promise.all([
      // 1. user-info: 사용자 정보
      User.findOne({ grade, name, deleted: { $ne: true } }).lean(),

      // 2. UserProgress: study-room, today, last-assigned 모두 포함
      UserProgress.findOne({ grade, name }).lean(),

      // 3. completion-status: 완료된 단원 목록 (series가 있을 때만)
      series
        ? LearningLog.find({ grade, name, series, completed: true }).select('unit').lean()
        : Promise.resolve([]),

      // 4. learning-logs: 학습 기록
      LearningLog.find(phone ? { grade, name, phone } : { grade, name })
        .sort({ timestamp: -1 })
        .lean(),

      // 5. unit-grades: 단원별 등급
      LearningLog.find({ grade, name, deleted: false })
        .sort({ timestamp: -1 })
        .lean()
    ]);

    // user-info 가공
    const userInfoResult = userInfo
      ? {
          _id: userInfo._id,
          grade: userInfo.grade,
          name: userInfo.name,
          school: userInfo.school,
          assignedSeries: userInfo.assignedSeries || []
        }
      : null;

    // study-room 가공
    const studyRoom = {
      ok: true,
      data: userProgress
        ? {
            studyRoom: userProgress.studyRoom || { assignedTasks: [] },
            completedPages: userProgress.completedPages || [],
            grade: userProgress.grade,
            name: userProgress.name
          }
        : {
            studyRoom: { assignedTasks: [] }
          }
    };

    // today (어휘퀴즈 완료 여부)
    let todayResult = { ok: true, completedToday: false };
    if (userProgress && userProgress.vocabularyQuizHistory && userProgress.vocabularyQuizHistory.length > 0) {
      const now = new Date();
      const kstOffset = 9 * 60 * 60 * 1000;
      const kstNow = new Date(now.getTime() + kstOffset);
      const kstTodayStart = new Date(Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate(), 0, 0, 0) - kstOffset);
      const kstTodayEnd = new Date(Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate(), 23, 59, 59) - kstOffset);

      const todayHistory = userProgress.vocabularyQuizHistory.find(history => {
        const historyDate = new Date(history.date);
        return historyDate >= kstTodayStart && historyDate <= kstTodayEnd;
      });

      todayResult = {
        ok: true,
        completedToday: !!todayHistory,
        latestHistory: todayHistory || null
      };
    }

    // last-assigned
    const lastAssigned = {
      ok: true,
      lastAIAssignedAt: userProgress?.studyRoom?.lastAIAssignedAt || null
    };

    // completion-status
    const completionStatus = {
      ok: true,
      completedUnits: completedLogs.map(log => log.unit)
    };

    // learning-logs 가공 (AI 복습 완료 시간 추가)
    const aiTaskMap = new Map();
    if (userProgress && userProgress.studyRoom && userProgress.studyRoom.assignedTasks) {
      userProgress.studyRoom.assignedTasks.forEach(task => {
        if (task.isAI && task.completedAt) {
          aiTaskMap.set(task.id, task.completedAt);
        }
      });
    }
    const learningLogs = allLogs.map(log => ({
      ...log,
      aiReviewCompletedAt: aiTaskMap.get(log.unit) || null
    }));

    // unit-grades 가공
    const unitGradesMap = {};
    unitGradesData.forEach(log => {
      const unitId = log.unit;
      if (!unitGradesMap[unitId] && log.radar) {
        const radarValues = Object.values(log.radar);
        const radarAvg = radarValues.reduce((sum, val) => sum + val, 0) / radarValues.length;

        let gradeLabel = '격려';
        if (radarAvg >= 9) {
          gradeLabel = '우수';
        } else if (radarAvg >= 8) {
          gradeLabel = '양호';
        } else if (radarAvg >= 7) {
          gradeLabel = '보통';
        }

        unitGradesMap[unitId] = {
          unit: unitId,
          grade: gradeLabel,
          radarAvg: Math.round(radarAvg * 10) / 10,
          radar: log.radar,
          timestamp: log.timestamp
        };
      }
    });

    const elapsed = Date.now() - startTime;
    console.log(`✅ [/api/menu-init] 완료 (${elapsed}ms)`);

    // 모든 결과를 한 번에 반환
    res.json({
      ok: true,
      session,
      userInfo: userInfoResult,
      studyRoom,
      today: todayResult,
      lastAssigned,
      completionStatus,
      learningLogs,
      unitGrades: unitGradesMap,  // /api/unit-grades와 동일한 형식 (객체)
      _meta: {
        elapsed: elapsed,
        timestamp: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error("❌ [/api/menu-init] 오류:", err);
    res.status(500).json({
      ok: false,
      message: "통합 API 처리 중 오류가 발생했습니다.",
      error: err.message
    });
  }
});

// ===== 모의고사 결과 저장 API =====
app.post("/api/mock-exam/submit", async (req, res) => {
  try {
    const { visitorId, studentInfo, examId, examTitle, grade, answers, score, correctCount, totalQuestions, wrongAnswers, elapsedTimeStr } = req.body;

    if (!visitorId || !answers || !studentInfo) {
      return res.status(400).json({ ok: false, message: "필수 정보가 누락되었습니다." });
    }

    const result = new MockExamResult({
      userId: visitorId,
      studentInfo: {
        schoolName: studentInfo.schoolName,
        grade: studentInfo.grade,
        studentName: studentInfo.studentName,
        phoneNumber: studentInfo.phoneNumber
      },
      examId: examId || 'korean_mock_1',
      examTitle: examTitle || '국어 모의고사 1회',
      grade: grade,
      answers: new Map(Object.entries(answers)),
      score,
      correctCount,
      totalQuestions: totalQuestions || 45,
      wrongAnswers: wrongAnswers || [],
      elapsedTimeStr: elapsedTimeStr || '--:--'
    });

    await result.save();

    // 사용자의 examProgress 업데이트 (대시보드 연동용)
    try {
      const user = await MockExamUser.findById(visitorId);
      if (user) {
        // examProgress 배열에서 해당 시험 찾기
        const examIndex = user.examProgress.findIndex(p => p.examId === (examId || 'korean_mock_1'));

        if (examIndex >= 0) {
          // 기존 진행 상태 업데이트
          user.examProgress[examIndex].status = 'completed';
          user.examProgress[examIndex].resultId = result._id;
          user.examProgress[examIndex].completedAt = new Date();
        } else {
          // 새로 추가
          user.examProgress.push({
            examId: examId || 'korean_mock_1',
            status: 'completed',
            resultId: result._id,
            completedAt: new Date()
          });
        }

        await user.save();
        console.log(`✅ [submit] 사용자 ${visitorId}의 examProgress 업데이트 완료`);
      }
    } catch (userErr) {
      console.error("❌ [submit] examProgress 업데이트 실패:", userErr);
      // 결과 저장은 성공했으므로 에러를 무시하고 계속 진행
    }

    res.json({
      ok: true,
      message: "채점 결과가 저장되었습니다.",
      resultId: result._id
    });
  } catch (err) {
    console.error("❌ [/api/mock-exam/submit] 오류:", err);
    res.status(500).json({ ok: false, message: "저장 중 오류가 발생했습니다.", error: err.message });
  }
});

// 모의고사 결과 조회 API
app.get("/api/mock-exam/results/:visitorId", async (req, res) => {
  try {
    const { visitorId } = req.params;
    const { examId } = req.query;

    // MockExamUser의 _id인 경우 해당 사용자의 phone + 이름으로 결과 조회
    let query = {};
    if (mongoose.Types.ObjectId.isValid(visitorId)) {
      const user = await MockExamUser.findById(visitorId);
      if (user) {
        // 전화번호와 이름 모두 일치하는 결과만 조회 (같은 전화번호 다른 학생 구분)
        query = {
          'studentInfo.phoneNumber': user.phone,
          'studentInfo.studentName': user.name
        };
      } else {
        query = { userId: visitorId };
      }
    } else {
      query = { userId: visitorId };
    }

    if (examId) query.examId = examId;

    const results = await MockExamResult.find(query)
      .sort({ completedAt: -1 });
      // limit 제거: 12+ 상세 지표에서 모든 회차 결과를 조회하기 위함

    res.json({ ok: true, results });
  } catch (err) {
    console.error("❌ [/api/mock-exam/results] 오류:", err);
    res.status(500).json({ ok: false, message: "조회 중 오류가 발생했습니다.", error: err.message });
  }
});

// examId와 userId로 결과 조회 (AI 분석 팝업용) - 더 구체적인 라우트를 먼저 배치
app.get("/api/mock-exam/result/:examId/:userId", async (req, res) => {
  try {
    const { examId, userId } = req.params;

    // 먼저 MockExamUser에서 해당 사용자 찾기
    const user = await MockExamUser.findById(userId);

    let result;
    if (user) {
      // 사용자의 전화번호로 결과 조회
      result = await MockExamResult.findOne({
        examId,
        'studentInfo.phoneNumber': user.phone
      }).sort({ completedAt: -1 });
    }

    // 사용자로 찾지 못했으면 직접 userId로 시도
    if (!result) {
      result = await MockExamResult.findOne({ examId, userId }).sort({ completedAt: -1 });
    }

    if (!result) {
      return res.status(404).json({ ok: false, message: "결과를 찾을 수 없습니다." });
    }

    res.json({ ok: true, result });
  } catch (err) {
    console.error("❌ [/api/mock-exam/result/:examId/:userId] 오류:", err);
    res.status(500).json({ ok: false, message: "조회 중 오류가 발생했습니다.", error: err.message });
  }
});

// 단일 결과 조회 (시험지 보기용) - ObjectId로 조회
app.get("/api/mock-exam/result/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MockExamResult.findById(id);

    if (!result) {
      return res.status(404).json({ ok: false, message: "결과를 찾을 수 없습니다." });
    }

    res.json({ ok: true, result });
  } catch (err) {
    console.error("❌ [/api/mock-exam/result] 오류:", err);
    res.status(500).json({ ok: false, message: "조회 중 오류가 발생했습니다.", error: err.message });
  }
});

// ===== 모의고사 관리자 API =====
// 전체 결과 조회 (관리자용)
app.get("/api/mock-exam/admin/results", async (req, res) => {
  try {
    const results = await MockExamResult.find({})
      .sort({ completedAt: -1 });

    res.json({ ok: true, results });
  } catch (err) {
    console.error("❌ [/api/mock-exam/admin/results] 오류:", err);
    res.status(500).json({ ok: false, message: "조회 중 오류가 발생했습니다.", error: err.message });
  }
});

// 학생 정보 수정 (관리자용)
app.put("/api/mock-exam/admin/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { studentInfo } = req.body;

    const result = await MockExamResult.findByIdAndUpdate(
      id,
      { studentInfo },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ ok: false, message: "결과를 찾을 수 없습니다." });
    }

    res.json({ ok: true, message: "수정되었습니다.", result });
  } catch (err) {
    console.error("❌ [/api/mock-exam/admin/update] 오류:", err);
    res.status(500).json({ ok: false, message: "수정 중 오류가 발생했습니다.", error: err.message });
  }
});

// 결과 삭제 (관리자용)
app.delete("/api/mock-exam/admin/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await MockExamResult.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ ok: false, message: "결과를 찾을 수 없습니다." });
    }

    res.json({ ok: true, message: "삭제되었습니다." });
  } catch (err) {
    console.error("❌ [/api/mock-exam/admin/delete] 오류:", err);
    res.status(500).json({ ok: false, message: "삭제 중 오류가 발생했습니다.", error: err.message });
  }
});

// ===== 모의고사 회원 API =====
// 회원가입 (전화번호가 비밀번호 역할)
app.post("/api/mock-exam/register", async (req, res) => {
  try {
    const { name, school, grade, phone } = req.body;

    // 필수 필드 확인
    if (!name || !school || !grade || !phone) {
      return res.status(400).json({ ok: false, error: "모든 필드를 입력해주세요." });
    }

    // 동일 학년+이름+전화번호 중복 확인
    const existingUser = await MockExamUser.findOne({
      grade,
      name,
      phone,
      deleted: { $ne: true }
    });
    if (existingUser) {
      return res.status(400).json({ ok: false, error: "이미 등록된 회원입니다." });
    }

    // 새 사용자 생성
    const newUser = new MockExamUser({
      name,
      school,
      grade,
      phone,
      password: phone, // 전화번호를 비밀번호로 사용
      examProgress: []
    });

    await newUser.save();

    console.log(`✅ [모의고사] 신규 회원가입: ${name} (${phone})`);
    res.json({ ok: true, message: "회원가입이 완료되었습니다." });
  } catch (err) {
    console.error("❌ [/api/mock-exam/register] 오류:", err);
    res.status(500).json({ ok: false, error: "회원가입 중 오류가 발생했습니다." });
  }
});

// 로그인 (학년 + 이름 + 전화번호로 인증)
app.post("/api/mock-exam/login", async (req, res) => {
  try {
    const { grade, name, phone } = req.body;

    if (!grade || !name || !phone) {
      return res.status(400).json({ ok: false, error: "학년, 이름, 전화번호를 모두 입력해주세요." });
    }

    // 학년 + 이름 + 전화번호로 사용자 찾기
    const user = await MockExamUser.findOne({
      grade,
      name,
      phone,
      deleted: { $ne: true }
    });

    if (!user) {
      return res.status(401).json({ ok: false, error: "일치하는 회원 정보가 없습니다. 학년, 이름, 전화번호를 확인해주세요." });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ ok: false, error: "비활성화된 계정입니다. 관리자에게 문의하세요." });
    }

    // 마지막 로그인 시간 업데이트
    user.lastLogin = new Date();
    await user.save();

    console.log(`✅ [모의고사] 로그인: ${user.name} (${phone})`);

    // 비밀번호 제외하고 반환
    const userInfo = {
      _id: user._id,
      name: user.name,
      school: user.school,
      grade: user.grade,
      phone: user.phone,
      examProgress: user.examProgress
    };

    res.json({ ok: true, user: userInfo });
  } catch (err) {
    console.error("❌ [/api/mock-exam/login] 오류:", err);
    res.status(500).json({ ok: false, error: "로그인 중 오류가 발생했습니다." });
  }
});

// 나의 모의고사 목록 조회
app.get("/api/mock-exam/my-exams", async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ ok: false, error: "로그인이 필요합니다." });
    }

    // 사용자 정보 조회 (ObjectId인 경우에만)
    let user = null;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await MockExamUser.findById(userId);
    }

    // 모의고사 목록 (현재는 하드코딩, 추후 DB에서 가져올 수 있음)
    const exams = [
      { id: 'korean_mock_1', round: 1, title: '겨울방학 AI 모의고사 1회' },
      { id: 'korean_mock_2', round: 2, title: '겨울방학 AI 모의고사 2회' },
      { id: 'korean_mock_3', round: 3, title: '겨울방학 AI 모의고사 3회' },
      { id: 'korean_mock_4', round: 4, title: '겨울방학 AI 모의고사 4회' }
    ];

    // 사용자의 시험 진행 상태와 완료된 결과 조회
    const progress = [];

    // MockExamResult에서 직접 사용자의 모든 완료된 시험 결과 조회
    // userId 또는 전화번호+이름으로 매칭 (visitor_xxx 형태의 userId도 지원)
    let queryConditions = [{ userId: userId }];
    if (user) {
      queryConditions.push({
        'studentInfo.phoneNumber': user.phone,
        'studentInfo.studentName': user.name
      });
    }
    const allResults = await MockExamResult.find({
      $or: queryConditions
    }).sort({ completedAt: -1 });

    for (const exam of exams) {
      const examProg = user && user.examProgress ? user.examProgress.find(p => p.examId === exam.id) : null;

      // 먼저 MockExamResult에서 해당 시험 결과 찾기 (가장 최근 결과)
      const directResult = allResults.find(r => r.examId === exam.id);

      if (directResult) {
        // 결과가 있으면 완료 상태로 표시
        progress.push({
          examId: exam.id,
          status: 'completed',
          score: directResult.score,
          grade: directResult.grade ? `${directResult.grade}등급` : '-등급',
          correctCount: directResult.correctCount,
          elapsedTimeStr: directResult.elapsedTimeStr || '--:--',
          wrongAnswers: directResult.wrongAnswers || [],
          completedAt: directResult.completedAt
        });
      } else if (examProg) {
        if (examProg.status === 'completed' && examProg.resultId) {
          // examProgress에서 완료 상태인 경우 결과 조회
          const result = await MockExamResult.findById(examProg.resultId);
          if (result) {
            progress.push({
              examId: exam.id,
              status: 'completed',
              score: result.score,
              grade: result.grade ? `${result.grade}등급` : '-등급',
              correctCount: result.correctCount,
              elapsedTimeStr: result.elapsedTimeStr || '--:--',
              wrongAnswers: result.wrongAnswers || [],
              completedAt: result.completedAt
            });
          } else {
            progress.push({
              examId: exam.id,
              status: examProg.status,
              remainingTime: examProg.remainingTime
            });
          }
        } else {
          progress.push({
            examId: exam.id,
            status: examProg.status,
            remainingTime: examProg.remainingTime
          });
        }
      } else {
        progress.push({
          examId: exam.id,
          status: 'not_started'
        });
      }
    }

    res.json({ ok: true, exams, progress });
  } catch (err) {
    console.error("❌ [/api/mock-exam/my-exams] 오류:", err);
    res.status(500).json({ ok: false, error: "조회 중 오류가 발생했습니다." });
  }
});

// 영역별 분석 데이터 조회
app.get("/api/mock-exam/area-analysis/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(401).json({ ok: false, error: "로그인이 필요합니다." });
    }

    // 사용자 정보 조회 (전화번호+이름으로 매칭하기 위해)
    const user = await MockExamUser.findById(userId);

    // 해당 사용자의 완료된 모든 시험 결과 조회
    // userId 또는 전화번호+이름으로 매칭 (visitor_xxx 형태의 userId도 지원)
    const queryConditions = [{ userId }];
    if (user) {
      queryConditions.push({
        'studentInfo.phoneNumber': user.phone,
        'studentInfo.studentName': user.name
      });
    }
    const allResults = await MockExamResult.find({ $or: queryConditions }).sort({ completedAt: -1 });

    if (!allResults || allResults.length === 0) {
      return res.json({ ok: true, hasData: false });
    }

    // 각 회차(examId)별로 최신 결과 1개씩만 사용
    const latestByExam = {};
    allResults.forEach(result => {
      const examId = result.examId || 'korean_mock_1';
      if (!latestByExam[examId]) {
        latestByExam[examId] = result;
      }
    });
    const results = Object.values(latestByExam);

    // 시험별 영역별 문항 번호
    const areaQuestionsByExam = {
      'korean_mock_1': {
        speech: [1, 2, 4, 5, 6, 24, 25, 26, 27, 28, 29, 30],  // 화법과 작문 (12문항)
        grammar: [3, 7, 8, 9, 10],                             // 문법 (5문항)
        reading: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], // 비문학 (13문항)
        literature: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]  // 문학 (15문항)
      },
      'korean_mock_2': {
        speech: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],   // 화법과 작문 (10문항)
        grammar: [11, 12, 13, 14, 15],              // 문법 (5문항)
        reading: [16, 17, 18, 19, 20, 21, 26, 27, 28, 29, 30, 31, 32, 33, 34], // 비문학 (15문항)
        literature: [22, 23, 24, 25, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]  // 문학 (15문항)
      },
      'korean_mock_3': {
        speech: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],   // 화법과 작문 (10문항)
        grammar: [11, 12, 13, 14, 15],              // 문법 (5문항)
        reading: [20, 21, 22, 23, 24, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37], // 비문학 (15문항)
        literature: [16, 17, 18, 19, 25, 26, 27, 38, 39, 40, 41, 42, 43, 44, 45]  // 문학 (15문항)
      },
      'korean_mock_4': {
        speech: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],   // 화법과 작문 (10문항)
        grammar: [11, 12, 13, 14, 15],              // 문법 (5문항)
        reading: [21, 22, 23, 24, 25, 29, 30, 31, 32, 33, 38, 39, 40, 41, 42], // 비문학 (15문항)
        literature: [16, 17, 18, 19, 20, 26, 27, 28, 34, 35, 36, 37, 43, 44, 45]  // 문학 (15문항)
      }
    };
    // 기본값 (1회차)
    const defaultAreaQuestions = areaQuestionsByExam['korean_mock_1'];

    // 누적 통계 계산
    const totals = {
      speech: { correct: 0, total: 0 },
      grammar: { correct: 0, total: 0 },
      reading: { correct: 0, total: 0 },
      literature: { correct: 0, total: 0 }
    };

    results.forEach(result => {
      const wrongSet = new Set((result.wrongAnswers || []).map(w => w.questionNum));
      // 해당 시험의 영역 매핑 사용
      const areaQuestions = areaQuestionsByExam[result.examId] || defaultAreaQuestions;

      ['speech', 'grammar', 'reading', 'literature'].forEach(area => {
        const questions = areaQuestions[area];
        const wrongCount = questions.filter(q => wrongSet.has(q)).length;
        totals[area].total += questions.length;
        totals[area].correct += questions.length - wrongCount;
      });
    });

    const areaScores = {
      speech: {
        correct: totals.speech.correct,
        total: totals.speech.total,
        percent: totals.speech.total > 0 ? Math.round((totals.speech.correct / totals.speech.total) * 100) : 0
      },
      grammar: {
        correct: totals.grammar.correct,
        total: totals.grammar.total,
        percent: totals.grammar.total > 0 ? Math.round((totals.grammar.correct / totals.grammar.total) * 100) : 0
      },
      reading: {
        correct: totals.reading.correct,
        total: totals.reading.total,
        percent: totals.reading.total > 0 ? Math.round((totals.reading.correct / totals.reading.total) * 100) : 0
      },
      literature: {
        correct: totals.literature.correct,
        total: totals.literature.total,
        percent: totals.literature.total > 0 ? Math.round((totals.literature.correct / totals.literature.total) * 100) : 0
      }
    };

    res.json({ ok: true, hasData: true, areaScores, examCount: results.length });
  } catch (err) {
    console.error("❌ [/api/mock-exam/area-analysis] 오류:", err);
    res.status(500).json({ ok: false, error: "조회 중 오류가 발생했습니다." });
  }
});

// AI 피드백 생성 API
app.post("/api/mock-exam/generate-ai-feedback", async (req, res) => {
  try {
    const { areaScores, examCount } = req.body;

    if (!areaScores) {
      return res.status(400).json({ ok: false, error: "영역별 점수 데이터가 필요합니다." });
    }

    // 영역별 점수 정리
    const scores = {
      grammar: areaScores.grammar?.percent || 0,
      speech: areaScores.speech?.percent || 0,
      reading: areaScores.reading?.percent || 0,
      literature: areaScores.literature?.percent || 0
    };

    // 점수 순으로 영역 정렬
    const sortedAreas = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([area]) => area);

    const areaNames = {
      grammar: '문법',
      speech: '화법과 작문',
      reading: '비문학',
      literature: '문학'
    };

    const strongestArea = areaNames[sortedAreas[0]];
    const weakestArea = areaNames[sortedAreas[3]];
    const areaOrder = sortedAreas.slice(1).map(a => areaNames[a]).join(' → ');

    // OpenAI 프롬프트
    const prompt = `당신은 학생들을 진심으로 응원하는 따뜻하고 친근한 국어 교육 전문가입니다.
학생의 모의고사 영역별 성적을 분석하고, 마치 좋은 선생님이 학생에게 직접 말해주듯이 따뜻하고 구체적인 피드백을 제공해주세요.

학생 성적 데이터:
- 문법: ${scores.grammar}%
- 화법과 작문: ${scores.speech}%
- 비문학: ${scores.reading}%
- 문학: ${scores.literature}%
- 응시 횟수: ${examCount || 1}회

다음 형식으로 JSON을 반환해주세요 (반드시 유효한 JSON만 출력):
{
  "summary": "전체 성적에 대한 따뜻하고 격려하는 4-5문장 요약. 강점 영역을 구체적으로 칭찬하고, 개선이 필요한 영역도 긍정적인 시선으로 격려해주세요. '정말 잘하고 있어요', '대단해요', '충분히 할 수 있어요' 같은 칭찬과 격려를 많이 넣어주세요.",
  "areaFeedback": {
    "grammar": {
      "level": "9단계 등급 중 하나 (상상/상중/상하/중상/중중/중하/하상/하중/하하)",
      "tip": "문법 영역에 대한 따뜻하고 구체적인 학습 조언 3-4문장. 현재 상태를 칭찬하고, 구체적인 학습 방법을 제안하고, 격려로 마무리해주세요."
    },
    "speech": {
      "level": "9단계 등급 중 하나",
      "tip": "화법과 작문 영역에 대한 따뜻하고 구체적인 학습 조언 3-4문장. 현재 상태를 칭찬하고, 구체적인 학습 방법을 제안하고, 격려로 마무리해주세요."
    },
    "reading": {
      "level": "9단계 등급 중 하나",
      "tip": "비문학 영역에 대한 따뜻하고 구체적인 학습 조언 3-4문장. 현재 상태를 칭찬하고, 구체적인 학습 방법을 제안하고, 격려로 마무리해주세요."
    },
    "literature": {
      "level": "9단계 등급 중 하나",
      "tip": "문학 영역에 대한 따뜻하고 구체적인 학습 조언 3-4문장. 현재 상태를 칭찬하고, 구체적인 학습 방법을 제안하고, 격려로 마무리해주세요."
    }
  }
}

9단계 level 기준 (퍼센트 기준으로 정확히 적용):
- 상상: 95% 이상
- 상중: 90-94%
- 상하: 85-89%
- 중상: 80-84%
- 중중: 75-79%
- 중하: 70-74%
- 하상: 60-69%
- 하중: 50-59%
- 하하: 50% 미만

피드백 작성 가이드라인:

1. 칭찬을 아끼지 마세요!
   - "정말 잘하고 있어요!", "대단해요!", "너무 멋져요!", "자랑스러워요!"
   - "이 정도면 정말 훌륭한 거예요!", "노력이 빛나고 있어요!"
   - 점수가 낮더라도 노력과 가능성을 칭찬해주세요.

2. 격려를 많이 해주세요!
   - "조금만 더 하면 분명 더 좋아질 거예요!", "충분히 할 수 있어요!"
   - "이 페이스로 가면 금방 상위권이에요!", "믿어도 돼요, 잘하고 있어요!"
   - "걱정 마세요, 선생님이 보기에 충분한 실력이에요!"

3. 구체적인 조언을 해주세요!
   - 무엇을 어떻게 공부하면 좋을지 구체적으로 알려주세요.
   - 예: "매일 10분씩 문법 개념을 정리해보세요", "지문을 읽을 때 문단별로 핵심을 메모해보세요"

4. 따뜻한 말투를 사용하세요!
   - 반드시 ~해요, ~예요, ~거예요, ~이에요 같은 친근한 종결어미를 사용해주세요.
   - 딱딱하거나 차가운 표현은 피해주세요.

5. summary는 충분히 길게!
   - 최소 4-5문장으로 작성해주세요.
   - 강점 영역 칭찬 + 잘한 점 구체적 언급 + 개선 영역 격려 + 앞으로의 기대 + 응원 메시지

중요: 학생이 피드백을 읽고 "나도 할 수 있다!", "힘이 난다!"고 느낄 수 있도록 진심 어린 격려와 칭찬을 담아주세요!`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "당신은 학생들을 진심으로 응원하는 따뜻하고 친근한 국어 교육 전문가입니다. 학생들에게 칭찬과 격려를 아끼지 않고, 항상 긍정적이고 희망적인 메시지를 전합니다. 친근한 말투(~해요, ~예요, ~거예요)를 사용하세요. 반드시 유효한 JSON 형식으로만 응답하고, 각 영역의 객체는 반드시 닫는 괄호로 완성해주세요." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const responseText = completion.choices[0].message.content.trim();

    // JSON 파싱 시도
    let feedbackData;
    try {
      // JSON 블록 추출 (```json ... ``` 형태일 경우 대비)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        feedbackData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("JSON을 찾을 수 없습니다.");
      }
    } catch (parseError) {
      console.error("❌ JSON 파싱 실패:", parseError, responseText);
      // 파싱 실패 시 기본 응답 생성 (9단계 등급, 친근한 톤)
      const getLevel9 = (p) => {
        if (p >= 95) return "상상";
        if (p >= 90) return "상중";
        if (p >= 85) return "상하";
        if (p >= 80) return "중상";
        if (p >= 75) return "중중";
        if (p >= 70) return "중하";
        if (p >= 60) return "하상";
        if (p >= 50) return "하중";
        return "하하";
      };
      const getTip = (area, p) => {
        const tips = {
          grammar: {
            high: "문법 실력이 정말 대단해요! 이 정도면 최상위권 수준이에요. 현재 수준을 유지하면서 가끔씩 실전 감각만 점검해주세요. 고난도 문항 위주로 선별해서 연습하면 완벽해질 거예요!",
            mid: "문법 기본기가 탄탄하게 잡혀 있어요! 정말 잘하고 있어요. 문법 유형별로 풀이 루틴을 정리해보면 점수가 더 쑥쑥 오를 거예요. 조금만 더 다듬으면 상위권 진입도 충분히 가능해요!",
            low: "문법 영역은 차근차근 개념부터 정리하면 금방 올라갈 수 있어요! 걱정 마세요. 기초 개념을 하나씩 익히고, 쉬운 문제부터 풀어보면서 자신감을 쌓아보세요. 노력하면 분명 좋은 결과가 있을 거예요!"
          },
          speech: {
            high: "화법과 작문 실력이 정말 뛰어나요! 자랑스러워요. 이 정도면 최상위권 수준이에요. 고난도 문항만 선별해서 연습하고, 실전 감각을 유지해주세요. 완벽에 가까워지고 있어요!",
            mid: "화법과 작문 영역에서 좋은 성과를 보여주고 있어요! 지문의 논리 구조를 파악하는 연습을 해보세요. 사고 흐름을 정리하면 점수가 확 오를 거예요. 이 페이스면 금방 상위권이에요!",
            low: "화법과 작문은 충분히 올릴 수 있는 영역이에요! 쉬운 문제부터 차근차근 접근해보세요. 같은 유형을 반복하면서 감을 익히면 실력이 금방 늘 거예요. 포기하지 마세요, 할 수 있어요!"
          },
          reading: {
            high: "비문학 실력이 정말 안정적이에요! 대단해요. 다양한 주제의 지문을 읽으면서 실전 감각을 유지해주세요. 이 정도면 어떤 지문이 나와도 잘 풀 수 있을 거예요!",
            mid: "비문학 영역에서 좋은 기본기를 보여주고 있어요! 핵심 논지를 정리하는 연습을 해보세요. 문단별 역할을 파악하는 게 중요해요. 꾸준히 하면 분명 상위권에 도달할 수 있어요!",
            low: "비문학은 연습하면 확실히 오르는 영역이에요! 개념 설명 → 예제 → 적용 순서로 단계별 학습을 해보세요. 속도보다 정확성을 먼저 잡으면 점수가 따라올 거예요. 화이팅!"
          },
          literature: {
            high: "문학 감각이 정말 뛰어나요! 이 정도면 최상위권 수준이에요. 다양한 작품을 접하면서 감각을 유지해주세요. 작품 분석 능력이 훌륭해요, 자신감을 가져도 돼요!",
            mid: "문학 영역에서 좋은 감각을 보여주고 있어요! 작품의 맥락과 표현 기법을 분석하는 연습을 더 해보세요. 조금만 더 다듬으면 상위권 진입이 충분히 가능해요. 잘하고 있어요!",
            low: "문학은 작품을 많이 읽으면서 감을 익히면 금방 오르는 영역이에요! 천천히 읽으면서 감상하는 연습부터 해보세요. 기초가 쌓이면 점수도 따라올 거예요. 포기하지 마세요, 할 수 있어요!"
          }
        };
        const level = p >= 85 ? 'high' : p >= 70 ? 'mid' : 'low';
        return tips[area][level];
      };
      feedbackData = {
        summary: `${strongestArea} 영역에서 정말 훌륭한 실력을 보여주고 있어요! 이 부분은 자신감을 가져도 좋아요. ${weakestArea} 영역도 조금만 더 집중하면 분명 좋아질 거예요. 전체적으로 균형 있는 성장을 하고 있고, 노력이 빛나고 있어요. 앞으로도 지금처럼만 하면 좋은 결과가 있을 거예요. 화이팅!`,
        areaFeedback: {
          grammar: { level: getLevel9(scores.grammar), tip: getTip('grammar', scores.grammar) },
          speech: { level: getLevel9(scores.speech), tip: getTip('speech', scores.speech) },
          reading: { level: getLevel9(scores.reading), tip: getTip('reading', scores.reading) },
          literature: { level: getLevel9(scores.literature), tip: getTip('literature', scores.literature) }
        }
      };
    }

    res.json({
      ok: true,
      feedback: {
        strongestArea,
        weakestArea,
        areaOrder,
        ...feedbackData
      },
      scores
    });

  } catch (err) {
    console.error("❌ [/api/mock-exam/generate-ai-feedback] 오류:", err);
    res.status(500).json({ ok: false, error: "AI 피드백 생성 중 오류가 발생했습니다." });
  }
});

// 영역별 성적 변화 추이 데이터 조회
app.get("/api/mock-exam/area-trend/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(401).json({ ok: false, error: "로그인이 필요합니다." });
    }

    // 사용자 정보 조회 (전화번호+이름으로 매칭하기 위해)
    const user = await MockExamUser.findById(userId);

    // 해당 사용자의 완료된 모든 시험 결과 조회 (최신순으로)
    const queryConditions = [{ userId }];
    if (user) {
      queryConditions.push({
        'studentInfo.phoneNumber': user.phone,
        'studentInfo.studentName': user.name
      });
    }
    const allResults = await MockExamResult.find({ $or: queryConditions }).sort({ completedAt: -1 });

    if (!allResults || allResults.length < 1) {
      return res.json({ ok: true, hasData: false, trendData: [] });
    }

    // 각 회차(examId)별로 최신 결과 1개씩만 사용
    const latestByExam = {};
    allResults.forEach(result => {
      const examId = result.examId || 'korean_mock_1';
      if (!latestByExam[examId]) {
        latestByExam[examId] = result;
      }
    });
    // 회차 순서대로 정렬 (korean_mock_1, korean_mock_2, ...)
    const results = Object.values(latestByExam).sort((a, b) => {
      const aNum = parseInt((a.examId || 'korean_mock_1').replace('korean_mock_', ''));
      const bNum = parseInt((b.examId || 'korean_mock_1').replace('korean_mock_', ''));
      return aNum - bNum;
    });

    // 시험별 영역별 문항 번호
    const areaQuestionsByExam = {
      'korean_mock_1': {
        speech: [1, 2, 4, 5, 6, 24, 25, 26, 27, 28, 29, 30],  // 화법과 작문 (12문항)
        grammar: [3, 7, 8, 9, 10],                             // 문법 (5문항)
        reading: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], // 비문학 (13문항)
        literature: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]  // 문학 (15문항)
      },
      'korean_mock_2': {
        speech: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],   // 화법과 작문 (10문항)
        grammar: [11, 12, 13, 14, 15],              // 문법 (5문항)
        reading: [16, 17, 18, 19, 20, 21, 26, 27, 28, 29, 30, 31, 32, 33, 34], // 비문학 (15문항)
        literature: [22, 23, 24, 25, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]  // 문학 (15문항)
      },
      'korean_mock_3': {
        speech: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],   // 화법과 작문 (10문항)
        grammar: [11, 12, 13, 14, 15],              // 문법 (5문항)
        reading: [20, 21, 22, 23, 24, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37], // 비문학 (15문항)
        literature: [16, 17, 18, 19, 25, 26, 27, 38, 39, 40, 41, 42, 43, 44, 45]  // 문학 (15문항)
      },
      'korean_mock_4': {
        speech: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],   // 화법과 작문 (10문항)
        grammar: [11, 12, 13, 14, 15],              // 문법 (5문항)
        reading: [21, 22, 23, 24, 25, 29, 30, 31, 32, 33, 38, 39, 40, 41, 42], // 비문학 (15문항)
        literature: [16, 17, 18, 19, 20, 26, 27, 28, 34, 35, 36, 37, 43, 44, 45]  // 문학 (15문항)
      }
    };

    // 각 회차별 전체 평균 계산 (모든 응시자 대상)
    const examIds = [...new Set(results.map(r => r.examId || 'korean_mock_1'))];
    const globalAvgByExam = {};

    for (const examId of examIds) {
      const allExamResults = await MockExamResult.find({ examId });
      if (allExamResults.length > 0) {
        const totalCorrect = allExamResults.reduce((sum, r) => {
          const wrongCount = (r.wrongAnswers || []).length;
          return sum + (45 - wrongCount);
        }, 0);
        globalAvgByExam[examId] = Math.round((totalCorrect / allExamResults.length / 45) * 100);
      } else {
        globalAvgByExam[examId] = 0;
      }
    }

    // 각 시험별 영역 점수 계산
    const trendData = results.map(result => {
      const wrongSet = new Set((result.wrongAnswers || []).map(w => w.questionNum));

      // 해당 시험의 영역 매핑 사용 (없으면 1회차 기본값)
      const areaQuestions = areaQuestionsByExam[result.examId] || areaQuestionsByExam['korean_mock_1'];

      // 디버그 로그
      console.log(`[area-trend] examId: ${result.examId}, wrongAnswers: ${JSON.stringify(result.wrongAnswers)}`);
      console.log(`[area-trend] speech questions: ${areaQuestions.speech}, wrongSet: ${[...wrongSet]}`);

      const areaScores = {};
      const areaDetails = {};  // 영역별 맞은개수/총개수 정보
      ['speech', 'grammar', 'reading', 'literature'].forEach(area => {
        const questions = areaQuestions[area];
        const wrongCount = questions.filter(q => wrongSet.has(q)).length;
        const correctCount = questions.length - wrongCount;
        areaScores[area] = Math.round((correctCount / questions.length) * 100);
        areaDetails[area] = { correct: correctCount, total: questions.length };
        console.log(`[area-trend] ${area}: questions=${questions.length}, wrongCount=${wrongCount}, correctCount=${correctCount}, score=${areaScores[area]}`);
      });

      // 전체 평균 점수 계산 (45문항 기준)
      const totalQuestions = 45;
      const wrongCount = wrongSet.size;
      const correctCount = totalQuestions - wrongCount;
      const avgScore = Math.round((correctCount / totalQuestions) * 100);

      // 응시일 포맷팅
      const date = new Date(result.completedAt);
      const dateStr = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;

      return {
        date: dateStr,
        fullDate: result.completedAt,
        examId: result.examId,
        examTitle: result.examTitle,
        correctCount,
        totalQuestions,
        avgScore,
        globalAvg: globalAvgByExam[result.examId || 'korean_mock_1'] || 0,
        areaDetails,  // 영역별 맞은개수/총개수 정보
        ...areaScores
      };
    });

    res.json({ ok: true, hasData: trendData.length >= 1, trendData });
  } catch (err) {
    console.error("❌ [/api/mock-exam/area-trend] 오류:", err);
    res.status(500).json({ ok: false, error: "조회 중 오류가 발생했습니다." });
  }
});

// 시험 진행 상태 업데이트
app.post("/api/mock-exam/update-progress", async (req, res) => {
  try {
    const { userId, examId, status, currentAnswers, remainingTime, resultId } = req.body;

    if (!userId || !examId) {
      return res.status(400).json({ ok: false, error: "필수 정보가 누락되었습니다." });
    }

    const user = await MockExamUser.findById(userId);
    if (!user) {
      return res.status(404).json({ ok: false, error: "사용자를 찾을 수 없습니다." });
    }

    // 기존 진행 상태 찾기
    const existingIndex = user.examProgress.findIndex(p => p.examId === examId);

    const progressData = {
      examId,
      status: status || 'in_progress',
      currentAnswers: currentAnswers ? new Map(Object.entries(currentAnswers)) : undefined,
      remainingTime,
      startedAt: status === 'in_progress' ? new Date() : undefined,
      resultId: resultId || undefined
    };

    if (existingIndex >= 0) {
      // 기존 상태 업데이트
      user.examProgress[existingIndex] = {
        ...user.examProgress[existingIndex].toObject(),
        ...progressData
      };
    } else {
      // 새로 추가
      user.examProgress.push(progressData);
    }

    await user.save();

    res.json({ ok: true, message: "진행 상태가 업데이트되었습니다." });
  } catch (err) {
    console.error("❌ [/api/mock-exam/update-progress] 오류:", err);
    res.status(500).json({ ok: false, error: "업데이트 중 오류가 발생했습니다." });
  }
});

// ===== 모의고사 회원 관리자 API =====
// 모든 회원 조회
app.get("/api/mock-exam/admin/users", async (req, res) => {
  try {
    const users = await MockExamUser.find({ deleted: { $ne: true } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ ok: true, users });
  } catch (err) {
    console.error("❌ [/api/mock-exam/admin/users] 오류:", err);
    res.status(500).json({ ok: false, error: "조회 중 오류가 발생했습니다." });
  }
});

// 일괄 이용권 부여 (관리자) - :id 라우트보다 먼저 정의해야 함
app.put("/api/mock-exam/admin/users/bulk-tickets", async (req, res) => {
  try {
    const { userIds, addTickets } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ ok: false, error: "선택된 사용자가 없습니다." });
    }

    if (typeof addTickets !== 'number' || addTickets <= 0) {
      return res.status(400).json({ ok: false, error: "부여할 이용권 수를 1 이상으로 입력해주세요." });
    }

    // 선택된 모든 사용자의 이용권 추가
    const result = await MockExamUser.updateMany(
      { _id: { $in: userIds } },
      { $inc: { tickets: addTickets } }
    );

    console.log(`✅ 일괄 이용권 부여: ${result.modifiedCount}명에게 ${addTickets}회 추가`);

    res.json({
      ok: true,
      updatedCount: result.modifiedCount,
      addedTickets: addTickets
    });
  } catch (err) {
    console.error("❌ [/api/mock-exam/admin/users/bulk-tickets] 오류:", err);
    res.status(500).json({ ok: false, error: "일괄 이용권 부여 중 오류가 발생했습니다." });
  }
});

// 회원 정보 수정
app.put("/api/mock-exam/admin/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, school, grade, phone } = req.body;

    const user = await MockExamUser.findByIdAndUpdate(
      id,
      { name, school, grade, phone, password: phone },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ ok: false, error: "사용자를 찾을 수 없습니다." });
    }

    console.log(`✅ [모의고사] 회원 정보 수정: ${name} (${phone})`);
    res.json({ ok: true, user });
  } catch (err) {
    console.error("❌ [/api/mock-exam/admin/users] 오류:", err);
    res.status(500).json({ ok: false, error: "수정 중 오류가 발생했습니다." });
  }
});

// 회원 상태 변경
app.put("/api/mock-exam/admin/users/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await MockExamUser.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ ok: false, error: "사용자를 찾을 수 없습니다." });
    }

    res.json({ ok: true, user });
  } catch (err) {
    console.error("❌ [/api/mock-exam/admin/users/status] 오류:", err);
    res.status(500).json({ ok: false, error: "상태 변경 중 오류가 발생했습니다." });
  }
});

// 회원 이용권 조회
app.get("/api/mock-exam/user/:id/tickets", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await MockExamUser.findById(id).select('tickets');

    if (!user) {
      return res.status(404).json({ ok: false, error: "사용자를 찾을 수 없습니다." });
    }

    res.json({ ok: true, tickets: user.tickets || 0 });
  } catch (err) {
    console.error("❌ [/api/mock-exam/user/tickets] 오류:", err);
    res.status(500).json({ ok: false, error: "조회 중 오류가 발생했습니다." });
  }
});

// 회원 이용권 부여 (관리자)
app.put("/api/mock-exam/admin/users/:id/tickets", async (req, res) => {
  try {
    const { id } = req.params;
    const { tickets } = req.body;

    if (typeof tickets !== 'number' || tickets < 0) {
      return res.status(400).json({ ok: false, error: "유효한 이용권 개수를 입력해주세요." });
    }

    const user = await MockExamUser.findByIdAndUpdate(
      id,
      { tickets },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ ok: false, error: "사용자를 찾을 수 없습니다." });
    }

    res.json({ ok: true, user });
  } catch (err) {
    console.error("❌ [/api/mock-exam/admin/users/tickets] 오류:", err);
    res.status(500).json({ ok: false, error: "이용권 부여 중 오류가 발생했습니다." });
  }
});

// 재응시 여부 확인 (이용권 차감 없이 체크만)
app.post("/api/mock-exam/check-retake", async (req, res) => {
  try {
    const { userId, examId } = req.body;

    if (!userId || !examId) {
      return res.status(400).json({ ok: false, error: "사용자 ID와 시험 ID가 필요합니다." });
    }

    const user = await MockExamUser.findById(userId);
    if (!user) {
      return res.status(404).json({ ok: false, error: "사용자를 찾을 수 없습니다." });
    }

    // 1. 해당 회차에 이미 채점 완료된 결과가 있는지 확인
    const existingResult = await MockExamResult.findOne({
      'studentInfo.phoneNumber': user.phone,
      examId: examId
    });

    // 2. 또는 이미 이용권을 사용해서 시험을 시작한 적이 있는지 확인 (examProgress)
    const examProgressEntry = user.examProgress?.find(ep => ep.examId === examId);
    const hasStarted = examProgressEntry && (examProgressEntry.status === 'in_progress' || examProgressEntry.status === 'completed');

    res.json({
      ok: true,
      isRetake: !!existingResult || hasStarted,
      tickets: user.tickets || 0
    });
  } catch (err) {
    console.error("❌ [/api/mock-exam/check-retake] 오류:", err);
    res.status(500).json({ ok: false, error: "확인 중 오류가 발생했습니다." });
  }
});

// 이용권 사용 (시험 시작 시)
app.post("/api/mock-exam/use-ticket", async (req, res) => {
  try {
    const { userId, examId } = req.body;

    if (!userId || !examId) {
      return res.status(400).json({ ok: false, error: "사용자 ID와 시험 ID가 필요합니다." });
    }

    const user = await MockExamUser.findById(userId);
    if (!user) {
      return res.status(404).json({ ok: false, error: "사용자를 찾을 수 없습니다." });
    }

    // 1. 해당 회차에 이미 채점 완료된 결과가 있는지 확인
    const existingResult = await MockExamResult.findOne({
      'studentInfo.phoneNumber': user.phone,
      examId: examId
    });

    if (existingResult) {
      // 이미 응시한 회차 - 이용권 차감 없이 시작 허용
      return res.json({ ok: true, ticketUsed: false, message: "재응시입니다. 이용권이 차감되지 않습니다." });
    }

    // 2. 이미 이용권을 사용해서 시험을 시작한 적이 있는지 확인 (examProgress)
    const examProgressEntry = user.examProgress?.find(ep => ep.examId === examId);
    if (examProgressEntry && (examProgressEntry.status === 'in_progress' || examProgressEntry.status === 'completed')) {
      // 이미 이용권 사용해서 시작함 - 추가 차감 없이 허용
      return res.json({ ok: true, ticketUsed: false, message: "이미 시작된 시험입니다. 이용권이 차감되지 않습니다." });
    }

    // 첫 응시 - 이용권 확인
    if (!user.tickets || user.tickets <= 0) {
      return res.status(400).json({ ok: false, error: "이용권이 부족합니다.", needPurchase: true });
    }

    // 이용권 차감 및 examProgress에 기록
    user.tickets -= 1;

    // examProgress에 시험 시작 기록 추가
    if (!user.examProgress) {
      user.examProgress = [];
    }

    const existingProgressIndex = user.examProgress.findIndex(ep => ep.examId === examId);
    if (existingProgressIndex >= 0) {
      // 기존 기록 업데이트
      user.examProgress[existingProgressIndex].status = 'in_progress';
      user.examProgress[existingProgressIndex].startedAt = new Date();
    } else {
      // 새 기록 추가
      user.examProgress.push({
        examId: examId,
        status: 'in_progress',
        startedAt: new Date()
      });
    }

    await user.save();

    res.json({ ok: true, ticketUsed: true, remainingTickets: user.tickets, message: "이용권이 사용되었습니다." });
  } catch (err) {
    console.error("❌ [/api/mock-exam/use-ticket] 오류:", err);
    res.status(500).json({ ok: false, error: "이용권 사용 중 오류가 발생했습니다." });
  }
});

// 회원 삭제 (소프트 삭제)
app.delete("/api/mock-exam/admin/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await MockExamUser.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ ok: false, error: "사용자를 찾을 수 없습니다." });
    }

    res.json({ ok: true, message: "삭제되었습니다." });
  } catch (err) {
    console.error("❌ [/api/mock-exam/admin/users/delete] 오류:", err);
    res.status(500).json({ ok: false, error: "삭제 중 오류가 발생했습니다." });
  }
});

// ===== 상담 신청 API =====
// 상담 신청 (랜딩 페이지에서 호출)
app.post("/api/mock-exam/consultation", async (req, res) => {
  try {
    const { school, grade, name, phone } = req.body;

    // 유효성 검사
    if (!school || !grade || !name || !phone) {
      return res.status(400).json({ ok: false, error: "모든 필드를 입력해주세요." });
    }

    const consultation = new MockExamConsultation({
      school,
      grade,
      name,
      phone,
      status: 'pending'
    });

    await consultation.save();
    console.log(`✅ [상담신청] ${name} (${school} ${grade}) - ${phone}`);

    res.json({ ok: true, message: "상담 신청이 완료되었습니다." });
  } catch (err) {
    console.error("❌ [/api/mock-exam/consultation] 오류:", err);
    res.status(500).json({ ok: false, error: "상담 신청 중 오류가 발생했습니다." });
  }
});

// 상담 신청 목록 조회 (관리자)
app.get("/api/mock-exam/admin/consultations", async (req, res) => {
  try {
    const consultations = await MockExamConsultation.find()
      .sort({ createdAt: -1 });
    res.json({ ok: true, consultations });
  } catch (err) {
    console.error("❌ [/api/mock-exam/admin/consultations] 오류:", err);
    res.status(500).json({ ok: false, error: "데이터 조회 중 오류가 발생했습니다." });
  }
});

// 상담 상태 업데이트 (관리자)
app.put("/api/mock-exam/admin/consultations/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'contacted', 'completed'].includes(status)) {
      return res.status(400).json({ ok: false, error: "잘못된 상태값입니다." });
    }

    const consultation = await MockExamConsultation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!consultation) {
      return res.status(404).json({ ok: false, error: "상담 신청을 찾을 수 없습니다." });
    }

    res.json({ ok: true, consultation });
  } catch (err) {
    console.error("❌ [/api/mock-exam/admin/consultations/status] 오류:", err);
    res.status(500).json({ ok: false, error: "상태 변경 중 오류가 발생했습니다." });
  }
});

// 12+ 상세 세부 지표 AI 피드백 API
app.post("/api/openai/detail-feedback", async (req, res) => {
  try {
    const { scores, scoreText } = req.body;

    if (!scores) {
      return res.status(400).json({ ok: false, error: "점수 데이터가 필요합니다." });
    }

    const prompt = `당신은 수능 국어 전문 강사입니다. 학생의 12개 세부 영역 성적을 분석하여 강점과 보완점을 친근하고 따뜻한 말투로 피드백해주세요.

${scoreText}

다음 JSON 형식으로 응답해주세요:
{
  "strength": "강점 분석 (80% 이상 영역 중심으로, 잘하는 영역과 왜 잘하는지 칭찬. 2-3문장)",
  "weakness": "보완점 분석 (60% 미만 영역 중심으로, 구체적인 학습 팁 제공. 2-3문장)"
}

응답 가이드:
1. 친근한 말투 사용 (~해요, ~예요, ~거예요)
2. 구체적인 영역명 언급
3. 격려와 칭찬 포함
4. 실질적인 학습 조언 제공
5. 만약 모든 영역이 80% 이상이면 강점에서 칭찬하고, 보완점에서는 더 완벽해지기 위한 팁 제공
6. 만약 모든 영역이 60% 미만이면 보완점에서 기초부터 차근차근 접근하는 방법 안내, 강점에서는 조금이라도 높은 영역 칭찬`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "당신은 학생들을 진심으로 응원하는 따뜻하고 친근한 국어 교육 전문가입니다. 반드시 유효한 JSON 형식으로만 응답하세요." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500
    });

    const responseText = completion.choices[0].message.content.trim();
    let feedbackData;

    try {
      feedbackData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON 파싱 실패:", parseError);
      // 기본 응답
      feedbackData = {
        strength: "분석 중 오류가 발생했습니다. 다시 시도해주세요.",
        weakness: "분석 중 오류가 발생했습니다. 다시 시도해주세요."
      };
    }

    res.json({
      ok: true,
      strength: feedbackData.strength || "강점 분석 데이터가 없습니다.",
      weakness: feedbackData.weakness || "보완점 분석 데이터가 없습니다."
    });

  } catch (err) {
    console.error("❌ [/api/openai/detail-feedback] 오류:", err);
    res.status(500).json({ ok: false, error: "AI 피드백 생성 중 오류가 발생했습니다." });
  }
});

// 상담 신청 삭제 (관리자)
app.delete("/api/mock-exam/admin/consultations/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const consultation = await MockExamConsultation.findByIdAndDelete(id);

    if (!consultation) {
      return res.status(404).json({ ok: false, error: "상담 신청을 찾을 수 없습니다." });
    }

    res.json({ ok: true, message: "삭제되었습니다." });
  } catch (err) {
    console.error("❌ [/api/mock-exam/admin/consultations/delete] 오류:", err);
    res.status(500).json({ ok: false, error: "삭제 중 오류가 발생했습니다." });
  }
});

// ===== AI 학습 피드백 생성 API =====
app.post("/api/ai-learning-feedback", async (req, res) => {
  try {
    const { grade, name, section, data } = req.body;

    if (!grade || !name || !section || !data) {
      return res.status(400).json({ error: "필수 파라미터가 누락되었습니다." });
    }

    console.log(`🤖 [AI 피드백] ${grade} ${name} - ${section} 섹션 피드백 생성 요청`);

    // 섹션별 프롬프트 생성
    let systemPrompt = `당신은 초등학생과 중학생을 위한 따뜻하고 격려하는 교육 피드백 전문가입니다.
학생의 학습 데이터를 분석하여 친근하고 긍정적인 피드백을 제공합니다.

[필수 규칙]
- 반말체를 사용하여 친근하게 말합니다 (예: "정말 잘했어!", "대단해!")
- 이모지를 문장 중간이나 끝에 적절히 1-2개 사용합니다
- 구체적인 칭찬과 격려를 포함합니다
- 앞으로의 성장 가능성을 언급합니다

[중요: 반드시 5줄로 작성]
피드백은 반드시 5줄(5문장)으로 작성해야 합니다.
각 줄은 줄바꿈(\\n)으로 구분합니다.
예시:
1줄: 오늘 학습에 대한 칭찬
2줄: 구체적인 성과 언급
3줄: 잘한 점 강조
4줄: 격려와 응원
5줄: 앞으로의 기대`;

    let userPrompt = "";

    switch (section) {
      case "today_summary":
        userPrompt = `다음은 ${grade} ${name} 학생의 오늘 학습 기록입니다.

학습 데이터:
- 총 학습 건수: ${data.completedCount || 0}건
- 완료한 단원: ${data.unitList || "없음"}
- 등급 분포: ${data.gradesSummary || "없음"}
- 학습 영역: ${data.fieldsSummary || "없음"}
- 평균 점수: ${data.avgScore || "측정 중"}

이 데이터를 바탕으로 "오늘 나의 AI 학습 기록" 섹션에 대한 따뜻한 피드백을 작성해주세요.
학생이 오늘 열심히 공부한 것을 칭찬하고, 구체적인 단원명이나 성과를 언급하며 격려해주세요.
${data.completedCount > 0 ? `특히 "${data.units?.[0] || ''}"과 같은 단원을 완료한 점을 칭찬해주세요.` : ''}`;
        break;

      case "radar_chart":
        userPrompt = `다음은 ${grade} ${name} 학생의 오늘 완료한 단원별 문해력 AI 레이더 데이터입니다.

레이더 데이터:
- 완료한 단원 수: ${data.chartCount || 0}개
- 문해력 영역별 평균 점수:
  * 사실적 이해: ${data.avgLiteral || "-"}점
  * 구조적 이해: ${data.avgStructural || "-"}점
  * 어휘력: ${data.avgLexical || "-"}점
  * 추론적 이해: ${data.avgInferential || "-"}점
  * 비판적 이해: ${data.avgCritical || "-"}점
- 가장 강한 영역: ${data.strongestArea || "-"}
- 보완이 필요한 영역: ${data.weakestArea || "-"}

이 데이터를 바탕으로 "오늘 완료한 단원별 문해력 AI 레이더" 섹션에 대한 따뜻한 피드백을 작성해주세요.
강한 영역을 구체적으로 칭찬하고, 보완이 필요한 영역은 성장 가능성으로 언급해주세요.`;
        break;

      case "growth_trend":
        userPrompt = `다음은 ${grade} ${name} 학생의 날짜별 문해력 성장 지수 변화 데이터입니다.

성장 추이:
- 분석된 날짜 수: ${data.dateCount || 0}일
- 최근 날짜: ${data.dates || "-"}
- 점수 변화: ${data.scores || "-"}
- 첫 점수 → 최근 점수: ${data.firstScore || "-"}점 → ${data.latestScore || "-"}점
- 전체 추세: ${data.trend || "분석 중"} 추세

이 데이터를 바탕으로 "날짜별 문해력 성장 지수 변화" 섹션에 대한 따뜻한 피드백을 작성해주세요.
${data.trend === '상승' ? '점수가 올라가는 추세를 칭찬하고 계속 성장 중임을 강조해주세요.' :
  data.trend === '하락' ? '그래프의 오르내림은 자연스러운 학습 과정이며, 곧 다시 올라갈 수 있다고 격려해주세요.' :
  '꾸준히 안정적인 실력을 유지하고 있다고 칭찬해주세요.'}`;
        break;

      case "subject_scores":
        userPrompt = `다음은 ${grade} ${name} 학생의 날짜별 과목 평균 평점 데이터입니다.

과목별 평점:
- 과목별 평균: ${data.subjectList || "분석 중"}
- 가장 강한 과목: ${data.strongSubject || "-"}
- 보완이 필요한 과목: ${data.weakSubject || "-"}

이 데이터를 바탕으로 "날짜별 과목 평균 평점" 섹션에 대한 따뜻한 피드백을 작성해주세요.
강한 과목을 구체적으로 칭찬하고, 보완이 필요한 과목은 성장 가능성으로 언급해주세요.
${data.strongSubject ? `특히 ${data.strongSubject}에서 뛰어난 점을 강조해주세요.` : ''}`;
        break;

      case "vocab_scores":
        if (!data.hasData) {
          return res.json({ ok: true, feedback: "아직 어휘 퀴즈 점수 기록이 없어요. 본문 학습 후 어휘 퀴즈를 풀어보면 여기에 분석 결과가 나타날 거예요! 화이팅!" });
        }
        userPrompt = `다음은 ${grade} ${name} 학생의 어휘 퀴즈 점수 데이터입니다.

어휘 점수 현황:
- 총 어휘 퀴즈 개수: ${data.summary?.totalCount || 0}개
- 전체 평균 점수: ${data.summary?.avgScore || 0}점
- 과목별 평균 이상인 단원 수: ${data.summary?.aboveAvgCount || 0}개
- 과목별 평균 미만인 단원 수: ${data.summary?.belowAvgCount || 0}개
- 평균 이상 비율: ${data.summary?.aboveAvgPercent || 0}%
- 단원별 점수: ${data.summary?.itemsList || "없음"}

이 데이터를 바탕으로 "어휘 점수 분석" 섹션에 대한 따뜻한 피드백을 작성해주세요.
${data.summary?.aboveAvgPercent >= 70 ? '평균 이상인 단원이 많으니 어휘력이 뛰어나다고 칭찬해주세요!' :
  data.summary?.aboveAvgPercent >= 50 ? '균형 잡힌 어휘 실력을 칭찬하고, 조금만 더 노력하면 더 좋아질 수 있다고 격려해주세요.' :
  '어휘 학습의 중요성을 언급하며, 꾸준히 학습하면 빠르게 성장할 수 있다고 응원해주세요.'}
구체적인 단원명과 점수를 언급하며 피드백을 작성해주세요.`;
        break;

      default:
        return res.status(400).json({ error: "알 수 없는 섹션입니다." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.8
    });

    let feedback = completion.choices[0].message.content;
    // 줄바꿈을 공백으로 변환하여 통일감 있게 표시
    feedback = feedback.replace(/\n/g, ' ');
    console.log(`✅ [AI 피드백] ${section} 피드백 생성 완료`);

    res.json({ ok: true, feedback });
  } catch (err) {
    console.error("❌ [AI 피드백] 오류:", err);
    res.status(500).json({ error: "피드백 생성 중 오류가 발생했습니다." });
  }
});

// ===== 서버 시작 =====
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Atlas 연결 성공");

    // 인덱스 동기화 (성능 최적화)
    try {
      await LearningLog.syncIndexes();
      console.log("✅ LearningLog 인덱스 동기화 완료");
    } catch (indexErr) {
      console.error("⚠️ 인덱스 동기화 오류:", indexErr.message);
    }

    app.listen(PORT, () => {
      console.log(`✅ 서버 실행 중: ${PORT}`);
    });

// ============================================
// 📢 활동 피드 API (롤링 배너용)
// ============================================
app.get("/api/activity-feed", async (req, res) => {
  try {
    const feeds = [];

    // 1. 최근 학습 완료 기록 (형성평가 통과) - 학생별 최신 1건만 (무제한)
    const recentLogs = await LearningLog.aggregate([
      { $match: { completed: true, deleted: { $ne: true } } },
      { $sort: { timestamp: -1 } },
      { $group: {
        _id: { grade: '$grade', name: '$name' },
        latestLog: { $first: '$$ROOT' }
      }},
      { $replaceRoot: { newRoot: '$latestLog' } },
      { $sort: { timestamp: -1 } }
    ]);

    recentLogs.forEach(log => {
      // 이름 마스킹 (예: 김민수 → 김○수)
      const maskedName = log.name ?
        log.name.charAt(0) + '○' + log.name.slice(-1) : '학생';

      // 단원 코드에서 숫자 추출 (예: "geo_01" → "01")
      const unitMatch = log.unit ? log.unit.match(/(\d+)$/) : null;
      const unitNum = unitMatch ? unitMatch[1].padStart(2, '0') : null;
      const unitText = unitNum ? `${unitNum}관문 ` : '';

      feeds.push({
        type: 'learning',
        icon: '🎉',
        message: `${log.grade} ${maskedName} 학생이 ${unitText}형성평가를 통과하였습니다!`,
        series: log.series || '',
        timestamp: log.timestamp
      });
    });

    // 2. 최근 어휘퀴즈 코인 획득 기록 (무제한) - 삭제된 학생 제외
    const recentCoins = await UserProgress.find({
      'vocabularyQuiz.totalCoins': { $gt: 0 },
      deleted: { $ne: true }
    })
    .sort({ 'vocabularyQuiz.lastRankUpdate': -1 })
    .lean();

    recentCoins.forEach(user => {
      const maskedName = user.name ?
        user.name.charAt(0) + '○' + user.name.slice(-1) : '학생';
      const coins = user.vocabularyQuiz?.totalCoins || 0;

      if (coins > 0) {
        feeds.push({
          type: 'coin',
          icon: '🐳',
          message: `${user.grade} ${maskedName} 학생이 고래 뱃지 ${coins}개를 획득하였습니다!`,
          timestamp: user.vocabularyQuiz?.lastRankUpdate || new Date()
        });
      }
    });

    // 시간순 정렬 (무제한)
    feeds.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ success: true, feeds });
  } catch (err) {
    console.error("활동 피드 조회 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================
// 🎉 형성평가 통과 학생 관리 API (관리자용)
// ============================================

// 형성평가 통과 학생 목록 조회 (관리자용 - 최근 32개)
app.get("/api/learning-log/admin/list", async (req, res) => {
  try {
    // 모든 통과 기록 조회
    const allLogs = await LearningLog.find({
      completed: true,
      deleted: { $ne: true }
    })
    .sort({ timestamp: -1 })
    .lean();

    // 학생별로 최종(가장 높은) 통과 관문만 추출
    const studentMaxGate = {};

    allLogs.forEach(log => {
      const key = `${log.grade}_${log.name}`;

      // unit에서 관문 번호 추출 (마지막 숫자)
      const gateMatch = (log.unit || '').match(/(\d+)$/);
      const gateNum = gateMatch ? parseInt(gateMatch[1], 10) : 0;

      // 해당 학생의 기존 최고 관문보다 높으면 교체
      if (!studentMaxGate[key] || gateNum > studentMaxGate[key].gateNum) {
        studentMaxGate[key] = {
          ...log,
          _id: log._id.toString(), // _id를 문자열로 변환
          gateNum
        };
      }
    });

    // Object에서 배열로 변환하고 최근 업데이트 순으로 정렬, 32명 제한
    const logs = Object.values(studentMaxGate)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 32);

    res.json({ success: true, logs });
  } catch (err) {
    console.error("형성평가 통과 목록 조회 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 형성평가 통과 기록 개별 삭제 (해당 학생의 모든 기록 소프트 삭제)
app.delete("/api/learning-log/admin/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 먼저 해당 기록을 찾아서 학생 정보 확인
    const log = await LearningLog.findById(id);
    if (!log) {
      return res.status(404).json({ success: false, error: '해당 기록을 찾을 수 없습니다' });
    }

    // 해당 학생의 모든 기록을 삭제 처리 (같은 grade + name)
    const result = await LearningLog.updateMany(
      { grade: log.grade, name: log.name },
      { deleted: true }
    );

    res.json({ success: true, message: `${result.modifiedCount}개 기록 삭제 완료` });
  } catch (err) {
    console.error("형성평가 통과 기록 삭제 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 형성평가 통과 기록 일괄 삭제 (소프트 삭제)
app.post("/api/learning-log/admin/bulk-delete", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: '삭제할 ID 목록이 필요합니다' });
    }

    const result = await LearningLog.updateMany(
      { _id: { $in: ids } },
      { deleted: true }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount}건 삭제 완료`
    });
  } catch (err) {
    console.error("형성평가 통과 기록 일괄 삭제 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 형성평가 통과 기록 수정
app.put("/api/learning-log/admin/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, name, unit, series } = req.body;

    const result = await LearningLog.findByIdAndUpdate(
      id,
      {
        ...(grade && { grade }),
        ...(name && { name }),
        ...(unit && { unit }),
        ...(series && { series })
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, error: '해당 기록을 찾을 수 없습니다' });
    }

    res.json({ success: true, log: result });
  } catch (err) {
    console.error("형성평가 통과 기록 수정 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================
// 📢 확성기 메시지 API (응원 메시지)
// ============================================

// 확성기 메시지 보내기 (코인 차감)
app.post("/api/megaphone/send", async (req, res) => {
  console.log("📢 확성기 API 호출됨:", req.body);
  try {
    const { phone, grade, name, school, message } = req.body;
    const MEGAPHONE_COST = 200; // 확성기 비용

    if (!grade || !name || !message) {
      return res.status(400).json({ success: false, error: '학년, 이름, 메시지가 필요합니다' });
    }

    if (message.length > 100) {
      return res.status(400).json({ success: false, error: '메시지는 100자 이내로 작성해주세요' });
    }

    // 한국어 비속어 변형어 필터 (초성, 변형 패턴)
    const koreanBadWordPatterns = [
      // 시발/씨발/시바/씨바 변형 (euphemism 포함)
      /[시씨쉬싀슈][발빨벌팔]/gi,  // 시발, 씨발 등
      /[시씨쉬싀슈][바빠파]/gi,     // 시바, 씨바 등 (euphemism)
      /[sS][iI1][bB][aA][lL]?/gi,
      /ㅅㅂ/g,
      /ㅆㅂ/g,
      // 병신 변형
      /[병뼝][신씬sinSIN]/gi,
      /ㅂㅅ/g,
      /ㅄ/g,
      // 지랄 변형
      /[지쥐][랄랼럴]/gi,
      /ㅈㄹ/g,
      // 개새끼 변형
      /개[새쌔세][끼키낑]/gi,
      /ㄱㅅㄲ/g,
      // 좆 변형
      /[좆좃졷죳]/g,
      /ㅈㅇㅌ/g,
      // 씹 변형
      /[씹씨씌][새세쌔]/gi,
      // 느금마 변형
      /느[금끔][마빠]/gi,
      /ㄴㄱㅁ/g,
      // 니애미/니엄 변형
      /니[애에]미/gi,
      /니[엄]마/gi,
      // 썅 변형
      /[썅쌍]/g,
      // 꺼져 등 (너무 강한 표현)
      /꺼[져저쪄]/gi,
      // 죽어 (협박성)
      /[죽쥬][어어라]/gi,
      // 미친 변형
      /[미]친[놈년]/gi,
      /ㅁㅊ/g,
      // 짱나 (과도한 표현)
      /짱[나놔내]/gi
    ];

    const messageNormalized = message.replace(/\s+/g, ''); // 공백 제거하여 검사
    for (const pattern of koreanBadWordPatterns) {
      if (pattern.test(messageNormalized)) {
        console.log("🚫 한국어 변형 비속어 차단:", message);
        return res.status(400).json({
          success: false,
          error: '부적절한 표현이 포함되어 있습니다. 다시 입력해주세요.'
        });
      }
    }

    // OpenAI Moderation API로 비속어/부적절한 내용 검사
    try {
      const moderationResponse = await fetch('https://api.openai.com/v1/moderations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({ input: message })
      });

      const moderationResult = await moderationResponse.json();

      if (moderationResult.results && moderationResult.results[0]?.flagged) {
        console.log("🚫 부적절한 메시지 차단:", message);
        return res.status(400).json({
          success: false,
          error: '부적절한 표현이 포함되어 있습니다. 다시 입력해주세요.'
        });
      }
    } catch (moderationError) {
      console.error("Moderation API 오류:", moderationError);
      // API 오류 시에도 계속 진행 (선택적으로 차단할 수도 있음)
    }

    // 사용자 조회 (grade + name으로 검색)
    console.log("📢 사용자 조회 시작:", { grade, name });
    const user = await UserProgress.findOne({ grade, name });
    console.log("📢 사용자 조회 결과:", user ? "찾음" : "없음");
    if (!user) {
      return res.status(404).json({ success: false, error: '사용자를 찾을 수 없습니다' });
    }

    // 코인 잔액 확인 (totalCoins - usedCoins = 사용 가능한 코인)
    const totalCoins = user.vocabularyQuiz?.totalCoins || 0;
    const usedCoins = user.vocabularyQuiz?.usedCoins || 0;
    const availableCoins = totalCoins - usedCoins;
    if (availableCoins < MEGAPHONE_COST) {
      return res.status(400).json({
        success: false,
        error: `코인이 부족합니다. (현재: ${availableCoins}코인, 필요: ${MEGAPHONE_COST}코인)`
      });
    }

    // 24시간 후 만료 시간 계산
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 확성기 메시지 저장
    const megaphoneMsg = new MegaphoneMessage({
      senderPhone: phone || '',
      senderName: name || '학생',
      senderSchool: school || user.school || '',
      senderGrade: grade || '',
      message: message,
      coinUsed: MEGAPHONE_COST,
      expiresAt: expiresAt
    });
    await megaphoneMsg.save();

    // 코인 차감 (usedCoins 증가 방식)
    await UserProgress.updateOne(
      { grade, name },
      { $inc: { 'vocabularyQuiz.usedCoins': MEGAPHONE_COST } }
    );

    res.json({
      success: true,
      message: '응원 메시지가 전송되었습니다!',
      remainingCoins: availableCoins - MEGAPHONE_COST,
      expiresAt: expiresAt
    });

  } catch (err) {
    console.error("확성기 메시지 전송 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 활성 확성기 메시지 조회 (Live 배너용)
app.get("/api/megaphone/active", async (req, res) => {
  try {
    // 24시간 이내 생성된 메시지 조회 (최신 1개만)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const messages = await MegaphoneMessage.find({
      createdAt: { $gt: oneDayAgo }
    }).sort({ createdAt: -1 }).limit(1);

    const feeds = messages.map(msg => {
      // 이름 마스킹 (예: 박민수 → 박○수)
      const name = msg.senderName || '학생';
      const maskedName = name.length >= 2
        ? name.charAt(0) + '○' + name.slice(-1)
        : name;

      return {
        type: 'megaphone',
        message: `❤️ ${msg.senderGrade} ${maskedName}: "${msg.message}"`,
        timestamp: msg.createdAt,
        expiresAt: msg.expiresAt
      };
    });

    res.json({ success: true, feeds });
  } catch (err) {
    console.error("확성기 메시지 조회 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================
// 📢 확성기 관리자 API (슈퍼관리자 전용)
// ============================================

// 확성기 메시지 목록 조회 (관리자)
app.get("/api/megaphone/admin/list", requireSuperAdmin, async (req, res) => {
  try {
    const messages = await MegaphoneMessage.find({ deleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .lean();

    // 필드명 변환 (senderGrade -> grade, senderName -> name 등)
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      grade: msg.senderGrade || '',
      name: msg.senderName || '',
      message: msg.message,
      coinsUsed: msg.coinUsed || 0,
      type: msg.type || 'megaphone',
      expiresAt: msg.expiresAt,
      createdAt: msg.createdAt
    }));

    res.json({ ok: true, messages: formattedMessages });
  } catch (err) {
    console.error("확성기 메시지 목록 조회 오류:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 확성기 메시지 추가 (관리자 공지용)
app.post("/api/megaphone/admin/add", requireSuperAdmin, async (req, res) => {
  try {
    const { type, grade, name, message, coinsUsed } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ ok: false, error: "메시지 내용을 입력해주세요." });
    }

    const newMessage = new MegaphoneMessage({
      senderGrade: grade || '',
      senderName: name || '관리자',
      message: message.trim(),
      coinUsed: coinsUsed || 0,
      type: type || 'notice',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24시간 후
    });

    await newMessage.save();
    console.log("✅ 확성기 메시지 추가 완료:", newMessage._id);

    res.json({ ok: true, message: newMessage });
  } catch (err) {
    console.error("확성기 메시지 추가 오류:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 확성기 메시지 수정 (관리자)
app.put("/api/megaphone/admin/:id", requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, grade, name, message, coinsUsed } = req.body;

    const updateData = {
      senderGrade: grade || '',
      senderName: name || '',
      message: message,
      coinUsed: coinsUsed || 0,
      type: type || 'megaphone'
    };

    const updated = await MegaphoneMessage.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ ok: false, error: "메시지를 찾을 수 없습니다." });
    }

    console.log("✅ 확성기 메시지 수정 완료:", id);
    res.json({ ok: true, message: updated });
  } catch (err) {
    console.error("확성기 메시지 수정 오류:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 확성기 메시지 일괄 삭제 (관리자) - ⚠️ :id 라우트보다 먼저 정의해야 함
app.delete("/api/megaphone/admin/bulk-delete", requireSuperAdmin, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ ok: false, error: "삭제할 메시지를 선택해주세요." });
    }

    // 소프트 삭제
    const result = await MegaphoneMessage.updateMany(
      { _id: { $in: ids } },
      { deleted: true }
    );

    console.log(`✅ 확성기 메시지 일괄 삭제 완료: ${result.modifiedCount}개`);
    res.json({ ok: true, deletedCount: result.modifiedCount });
  } catch (err) {
    console.error("확성기 메시지 일괄 삭제 오류:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 확성기 메시지 삭제 (관리자)
app.delete("/api/megaphone/admin/:id", requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // 소프트 삭제
    const updated = await MegaphoneMessage.findByIdAndUpdate(id, { deleted: true }, { new: true });

    if (!updated) {
      return res.status(404).json({ ok: false, error: "메시지를 찾을 수 없습니다." });
    }

    console.log("✅ 확성기 메시지 삭제 완료:", id);
    res.json({ ok: true });
  } catch (err) {
    console.error("확성기 메시지 삭제 오류:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ============================================
// 📢 공지사항 API (Live 피드 롤링 배너용)
// ============================================

// 기본 공지사항 목록 (DB에 데이터가 없을 때 초기화용)
const defaultNotices = [
  { icon: '📚', message: '[공지] 어휘학습은 최초 1회 완료 후에 어휘력 지수가 반영됩니다!', order: 0 },
  { icon: '🐳', message: '[공지] AI고래쌤 하루 고래뱃지는 매일 10뱃지가 지급됩니다!', order: 1 },
  { icon: '🤖', message: '[공지] 학습실의 AI추천과제는 미흡한 단원을 AI고래쌤이 확인하여 부여됩니다!', order: 2 },
  { icon: '📖', message: '[공지] 고래 독서 감상문은 최소 월 1회 제출이지만 추가 제출도 가능합니다!', order: 3 },
  { icon: '✅', message: '[공지] 완료된 학습과제는 선생님 확인 후 삭제가 가능합니다!', order: 4 },
  { icon: '📊', message: '[공지] 종합리포트는 최신 완료된 과제 순으로 기록됩니다!', order: 5 }
];

// 공지사항 목록 조회 (공개 - 모든 사용자)
app.get("/api/notices", async (req, res) => {
  try {
    let notices = await Notice.find({ deleted: { $ne: true } })
      .sort({ order: 1 })
      .lean();

    // DB에 공지사항이 없으면 기본 공지사항 생성
    if (notices.length === 0) {
      await Notice.insertMany(defaultNotices);
      notices = await Notice.find({ deleted: { $ne: true } })
        .sort({ order: 1 })
        .lean();
      console.log("✅ 기본 공지사항 초기화 완료");
    }

    res.json({
      success: true,
      notices: notices.map(n => ({
        _id: n._id,
        icon: n.icon,
        message: n.message
      }))
    });
  } catch (err) {
    console.error("공지사항 조회 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 공지사항 목록 조회 (관리자용 - 전체 정보 포함)
app.get("/api/notices/admin", requireSuperAdmin, async (req, res) => {
  try {
    let notices = await Notice.find({ deleted: { $ne: true } })
      .sort({ order: 1 })
      .lean();

    // DB에 공지사항이 없으면 기본 공지사항 생성
    if (notices.length === 0) {
      await Notice.insertMany(defaultNotices);
      notices = await Notice.find({ deleted: { $ne: true } })
        .sort({ order: 1 })
        .lean();
    }

    res.json({ success: true, notices });
  } catch (err) {
    console.error("공지사항 관리자 조회 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 공지사항 추가 (관리자)
app.post("/api/notices/admin", requireSuperAdmin, async (req, res) => {
  try {
    const { icon, message } = req.body;

    if (!icon || !message) {
      return res.status(400).json({ success: false, error: "아이콘과 메시지를 입력해주세요." });
    }

    // 새 공지사항의 순서 계산
    const maxOrderNotice = await Notice.findOne({ deleted: { $ne: true } })
      .sort({ order: -1 })
      .lean();
    const newOrder = maxOrderNotice ? maxOrderNotice.order + 1 : 0;

    const notice = new Notice({
      icon: icon.trim(),
      message: message.trim(),
      order: newOrder
    });

    await notice.save();
    console.log("✅ 공지사항 추가 완료:", notice._id);
    res.json({ success: true, notice });
  } catch (err) {
    console.error("공지사항 추가 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 공지사항 수정 (관리자)
app.put("/api/notices/admin/:id", requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, message } = req.body;

    const updated = await Notice.findByIdAndUpdate(
      id,
      { icon: icon.trim(), message: message.trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: "공지사항을 찾을 수 없습니다." });
    }

    console.log("✅ 공지사항 수정 완료:", id);
    res.json({ success: true, notice: updated });
  } catch (err) {
    console.error("공지사항 수정 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 공지사항 삭제 (관리자)
app.delete("/api/notices/admin/:id", requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // 소프트 삭제
    const updated = await Notice.findByIdAndUpdate(id, { deleted: true }, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, error: "공지사항을 찾을 수 없습니다." });
    }

    console.log("✅ 공지사항 삭제 완료:", id);
    res.json({ success: true });
  } catch (err) {
    console.error("공지사항 삭제 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================
// 📢 모의고사 활동 피드 API (Live 롤링 배너용)
// ============================================
app.get("/api/mock-exam-activity-feed", async (req, res) => {
  try {
    const feeds = [];

    // 점수에서 등급 텍스트 계산 함수
    const getGradeText = (score) => {
      if (score >= 97) return '1등급 상';
      if (score >= 94) return '1등급 중';
      if (score >= 91) return '1등급 하';
      if (score >= 88) return '2등급 상';
      if (score >= 85) return '2등급 중';
      if (score >= 82) return '2등급 하';
      return null; // 2등급 하 미만은 표시 안함
    };

    // 모의고사 결과 - 학생별 최신 1건만 (2등급 하 이상만)
    const examResults = await MockExamResult.aggregate([
      { $match: { score: { $gte: 82 } } }, // 2등급 하 이상만
      { $sort: { createdAt: -1 } },
      { $group: {
        _id: '$studentInfo.phoneNumber',
        latestResult: { $first: '$$ROOT' }
      }},
      { $replaceRoot: { newRoot: '$latestResult' } },
      { $sort: { createdAt: -1 } }
    ]);

    examResults.forEach(result => {
      const gradeText = getGradeText(result.score);
      if (!gradeText) return; // 2등급 하 미만 제외

      // 이름 마스킹 (예: 박민수 → 박○수)
      const studentName = result.studentInfo?.studentName || '학생';
      const maskedName = studentName.length >= 2
        ? studentName.charAt(0) + '○' + studentName.slice(-1)
        : studentName;

      const schoolName = result.studentInfo?.schoolName || '';
      const grade = result.studentInfo?.grade || '';
      const examTitle = result.examTitle || '모의고사';

      feeds.push({
        type: 'grade',
        message: `${schoolName} ${grade} ${maskedName} 학생이 ${examTitle} '${gradeText}' 축하합니다`,
        timestamp: result.createdAt
      });
    });

    // 시간순 정렬
    feeds.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ success: true, feeds });
  } catch (err) {
    console.error("모의고사 활동 피드 조회 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
  })
  .catch((err) => {
    console.error("❌ MongoDB 연결 실패:", err);
  });