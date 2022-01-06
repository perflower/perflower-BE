const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const {
  User,

} = require("../../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((userId, done) => {
    User.findOne({
      where: { userId },
      include: [{
        model: User,
        attributes: ['userId', 'userNickname'],
        as: 'Followers',
      }, {
        model: User,
        attributes: ['userId', 'userNickname'],
        as: 'Followings',
      }]
    })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
  kakao();
};