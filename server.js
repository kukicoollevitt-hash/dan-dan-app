const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const USERS_FILE = "users.json";

app.use(bodyParser.urlencoded({ extended: true }));
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

// 1) 회원가입 페이지 (일단 텍스트)
app.get("/signup", (req, res) => {
  console.log("✅ /signup 요청 들어옴!");
  res.sendFile(path.join(__dirname, "signup.html"));
});


// 2) 로그인 페이지 (일단 텍스트)
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
  return res.send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>단단국어 - 가입 실패</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        :root {
          --bg: #f2ede5;
          --card: #fff;
          --primary: #8b2f2f;
          --text: #2f2f2f;
        }
        body {
          margin: 0;
          background: var(--bg);
          font-family: "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .card {
          background: var(--card);
          width: min(420px, 95vw);
          border-radius: 16px;
          padding: 26px 26px 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          text-align: center;
        }
        .title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text);
        }
        .msg {
          font-size: 14px;
          color: #7a6c5e;
          margin-bottom: 16px;
          line-height: 1.4;
        }
        .btn {
          display: inline-block;
          background: var(--primary);
          color: #fff;
          padding: 9px 16px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
        }
        .sub {
          margin-top: 14px;
          font-size: 13px;
          color: #6b5a4d;
        }
        .sub a {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="title">이미 가입된 전화번호예요</div>
        <div class="msg">
          이 번호로 가입한 기록이 있어서 새로 만들 수 없어요.<br/>
          로그인으로 들어가 주세요.
        </div>
        <a class="btn" href="/login">로그인하기</a>
        <div class="sub">
          다른 번호로 가입하려면 <a href="/signup">돌아가기</a>
        </div>
      </div>
    </body>
    </html>
  `);
}


  users.push({ grade, name, phone, id, pw });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.send('회원가입 완료! <a href="/login">로그인하러 가기</a>');
});

// 5) 로그인 처리
app.post("/login", (req, res) => {
  const { id, pw } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

  const user = users.find((u) => u.id === id && u.pw === pw);
  if (!user) {
    return res.send('아이디 또는 비밀번호가 올바르지 않습니다. <a href="/login">다시 시도</a>');
  }

  // 필요하면 나중에 쓸 수 있으니까 인코딩은 남겨둠
  const name = encodeURIComponent(user.name);
  const grade = encodeURIComponent(user.grade);

  // ✅ 로그인 성공하면 바로 목차로 보내기
  // 지금 menu.html이 public 폴더에 있으니까 이렇게만 써도 됨
  res.redirect("/menu.html");
  // 만약 나중에 이름/학년 보여주고 싶으면:
  // res.redirect(`/menu.html?name=${name}&grade=${grade}`);
});


app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
