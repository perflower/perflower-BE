// const express = require('express');
// const passport = require('passport');
// const bcrypt = require('bcrypt');
// // const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
// const { User } = require('../../models');
// const jwt = require("jsonwebtoken");
// const router = express.Router();



// router.get('/kakao/logout', (req, res) => {
//   req.logout();
//   req.session.destroy();
//   res.redirect('/');
// });

// router.get('/kakao', passport.authenticate('kakao'));

// router.get(
//   "/kakao/callback",
//   passport.authenticate("kakao", {
//     failureRedirect: "/",
//   }),
//   (req, res) => {
//     try {
//       console.log("여기서 테스트 한번 합시다.");
      
//       const user = req.user;
//       const token = jwt.sign(
//         { userId: user.userId }, process.env.SECRET_KEY);
//       const data = { user: user };
      
//       res.status(200).send({
//         message: "로그인에 성공하였습니다.",
//         data: data,
//         token: token,
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({
//         message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
//       });
//     }
//   }
// );
// module.exports = router;