const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = "users.json";

const MONGO_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://kukicoollevitt_db_user:Dandan1234!@dandanapp.m20fsfr.mongodb.net/dandanapp?retryWrites=true&w=majority&appName=dandanapp";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

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
});
const User = mongoose.model("User", userSchema);

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

// 로그인 페이지
app.get("/login", (req, res) => {
  console.log("✅ [GET] /login 페이지 요청");
  res.sendFile(path.join(__dirname, "login.html"));
});

// 메인
app.get("/", (req, res) => {
  res.send('메인입니다. <a href="/ping">ping</a> / <a href="/signup">회원가입</a>');
});

// ✅ 회원가입 처리 (진짜 저장되는 부분)
app.post("/signup", async (req, res) => {
  console.log("📥 [POST] /signup 에서 받은 값:", req.body);

  const grade = req.body.grade || "";
  const name = req.body.name || "";
  const phone = req.body.phone || "";

  const id = phone;
  const pw = phone;

  try {
    // MongoDB 저장
    const created = await User.create({ grade, name, phone, id, pw });

    // JSON 백업
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    users.push({ grade, name, phone, id, pw });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    console.log("✅ [POST] 회원가입 DB 저장 완료:", created.name);
    res.redirect("/login");
  } catch (err) {
    console.error("❌ [POST] 회원가입 에러:", err);
    res.status(500).send("회원가입 중 오류 발생: " + err.message);
  }
});

// ✅ 로그인 처리
app.post("/login", async (req, res) => {
  console.log("📥 [POST] /login 에서 받은 값:", req.body);
  const { name, grade, password } = req.body;

  try {
    const user = await User.findOne({ name, grade, pw: password });

    if (!user) {
      console.log("❌ [POST] /login: 사용자 없음");
      return res.send('로그인 정보가 올바르지 않습니다. <a href="/login">다시 로그인</a>');
    }

    console.log("✅ [POST] /login 성공:", user.name);
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
