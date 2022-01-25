const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const axios = require("axios");

const { User } = require("../../models");

const kakao = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "https://perflower.co.kr//api/user/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // const res = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
          //   headers: { Authorization: `Bearer ${accessToken}` },
          // });
          const exUser = await User.findOne({
            where: { kakaoId: profile.id },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              userNickname: profile.username,
              kakaoId: profile.id,
              userImgUrl: profile._json.properties.profile_image,
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};

const checkKakaoLogin = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "https://perflower.co.kr//api/user/kakao/check",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findOne({
            where: { kakaoId: profile.id },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              userNickname: profile.username,
              kakaoId: profile.id,
              userImgUrl: profile._json.properties.profile_image,
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};

module.exports = {
  kakao,
  checkKakaoLogin,
};
