const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  let user = this;

  // password일 때만 암호화 시킨다.
  if (user.isModified("password")) {
    //비밀번호를 암호화 시킨다.
    //Salt를 이용해서 비밀번호를 암호화 해야한다.
    // Salt 생성
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        // Store hash in your password DB.
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword와 암호화된 비밀번호가 같은지 체크해야 함
  //plainPassword를 암호화 해서 원래 암호화된 비밀번호와 같은지 체크해야함
  //암호화된 password를 복호화 할 수는 없음
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err), cb(null, isMatch);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
