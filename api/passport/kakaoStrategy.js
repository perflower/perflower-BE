const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const axios = require("axios");

const { User } = require("../../models");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "https://perflower.co.kr/api/user/kakao/callback",
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
            //8자리 무작위 난수 생성
            function rand(min, max) {
              return Math.floor(Math.random() * (max - min)) + min;
            }
            let nickname = 0;

            while (nickname.toString().length < 7) {
              nickname = rand(1, 9999999);
            }

            const newUser = await User.create({
              userNickname: `kakao_${nickname}`,
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
