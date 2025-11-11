const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
// 🔥 Render에서 포트를 내려주면 그걸 쓰고, 아니면 로컬에서 3000을 쓰도록
const PORT = process.env.PORT || 3000;
const USERS_FILE = "users.json";

app.use(bodyParser.urlencoded({ extended: true }));
// 프런트에서 fetch로 JSON을 보낼 수도 있으니까 이거도 깔아두면 좋아요
app.use(express.json());

app.use(express.static("public"));

// 디버그용: 이 파일이 진짜 실행됐는지 확인
console.log("✅ 이 server.js가 실행됐습니다!");

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, "[]");
}

// 0) 확인용 라우트
app.get("/ping", (req, res) => {
  console.log("✅ /ping 요청 들어옴!");
  res.send("pong from server.js ✅");
});

// 1) 회원가입 페이지
app.get("/signup", (req, res) => {
  console.log("✅ /signup 요청 들어옴!");
  res.sendFile(path.join(__dirname, "signup.html"));
});

// 2) 로그인 페이지
app.get("/login", (req, res) => {
  console.log("✅ /login 요청 들어옴!");
  res.sendFile(path.join(__dirname, "login.html"));
});

// 3) 메인
app.get("/", (req, res) => {
  console.log("✅ / 요청 들어옴!");
  res.send('메인입니다. <a href="/ping">/ping</a> / <a href="/signup">/signup</a>');
});

// 4) 회원가입 처리
app.post("/signup", (req, res) => {
  const { grade, name, phone } = req.body;
  const id = phone;
  const pw = phone;

  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

  if (users.find((u) => u.id === id)) {
    return res.send(/* ... 너가 만든 예쁜 HTML 그대로 ... */);
  }

  users.push({ grade, name, phone, id, pw });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.redirect('/login');

});

// 5) 로그인 처리
app.post("/login", (req, res) => {
  // 프런트에서 오는 이름들 맞춰서 받기
  const { name, grade, password } = req.body;

  // 사용자 목록 읽기
  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

  // 이름 + 학년 + 비밀번호가 모두 맞는 학생 찾기
  const user = users.find(
    (u) => u.name === name && u.grade === grade && u.pw === password
  );

  if (!user) {
    return res.send('로그인 정보가 올바르지 않습니다. <a href="/login">다시 로그인</a>');
  }

  // 성공하면 학습실로 보내기
  const encName = encodeURIComponent(user.name);
  const encGrade = encodeURIComponent(user.grade);
  res.redirect(`/menu.html?name=${encName}&grade=${encGrade}`);
});


// ✅ 여기만 바꾼 거!
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
