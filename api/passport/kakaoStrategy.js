const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const axios = require("axios");

const { User } = require('../../models');

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: '/api/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        
        try {
          const res = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          
          const exUser = await User.findOne({
            where: { kakaoId: profile.id,},
          });

          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              userEmail: res.data.kakao_account.email,
              userNickname: res.data.properties.nickname,
              kakaoId: res.data.id,
              userImgUrl: res.data.properties.profile_image
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }));
};