const express = require('express');
const admin = require('firebase-admin');

const app = express();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });

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

app.post('/storeToken', (req, res) => {
  const { userId, token } = req.body;   //프론트에서 잘 key어떻게 넘겨줄지 생각

  // 토큰 저장하기
  db.set(userId, token);

  res.status(200).send('Token stored successfully');
});

app.post('/sendNotification', (req, res) => {
  const userId = req.body;
  const { data } = "검증자로 선정되셨습니다. 검증을 하시겠습니까??";

  // DB에서 deviceToken 가져오기
  const deviceToken = db.get(userId);   //프론트에서 알맞게 넘겨주도록 수정

  if (!deviceToken) {
    res.status(400).send(`No device token found for user: ${userId}`);
    return;
  }
  const message = {
    data,
    token: deviceToken,
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
      res.status(200).send('Successfully sent message');
    })
    .catch((error) => {
      console.error('Error sending message:', error);
      res.status(500).send('Error sending message');
    });
});