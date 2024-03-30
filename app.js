const express = require('express');

const app = express();

// JSON 본문과 URL 인코딩된 본문을 파싱하도록 앱 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 사용자 정보를 저장할 데이터베이스
const db = new Map();

app.listen(3000, () => {
    console.log('server is running at 3000');
});

//서버 시작시 계정2개 setting
const newUser1 = {
    password:"1234",
};
const newUser2 = {
    password:"4321",
};
db.set("1234", newUser1);
db.set("4321", newUser2);

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const exists = db.get(username);
    console.log(username);

    if (!exists) {
        res.status(400).send(`no user: ${username}`);
        return;
    }
    // response
    return res.status(200).json({
      code: 200,
      message: "login succes",
    });
  });