const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const config = require("./config/key");

// application/x-www-form-urlencloded  형식으로 된 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({ extended: true }));

//application/json 으로 된 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());

const { User } = require("./models/User");

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!!! cool"));

//Register Router
app.post("/register", (req, res) => {
  // body-parser를 통해서 req.body로 client에서 보내주는 정보를 받아준다.
  const user = new User(req.body);

  // 몽고 db에서 오는 메소드이다.
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
  });

  //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
  user.comparePassword(req.body.password, (err, isMatch) => {
    if (!isMatch)
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다.",
      });

    //비밀번호가 맞다면 토큰을 생성한다.
    user.generateToken((err, user) => {});
  });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
