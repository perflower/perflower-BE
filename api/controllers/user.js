const {
    User,
    Perfume,
    Review
  
  } = require("../../models");
  const { Op } = require("sequelize");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const authorization = require("../middlewares/auth-middleware");
  const { findAll } = require("../../models/user");
  require("dotenv").config();
  
  
  
  
  
  
  // 유저 정보 조회
  // const getUser = async (req, res) => {
  //     const { user } = res.locals;
  //     res.status(200).json({ userId: user.userId, userNickname: user.userNickname });
  // }
  
  // 로그인
  const userLogin = async (req, res) => {
    try {
      const { userEmail, userPassword } = req.body;
      const user = await User.findOne({ where: { userEmail } }); // user 조회, findOne 사용 가능, 이메일과 패스워드가 둘 다 맞아야함
  
      // user 정보 불일치
      if (!user) {
        res.status(400).send({
          errorMessage: "이메일 정보가 잘못됐습니다.",
        });
        return;
      }
  
      else if (user) {
        const result = await bcrypt.compare(userPassword, user.userPassword)
        if (result) {
          // user 정보 일치
          const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY);
          res.send({
            token,
            user: {userId: user.userId, userEmail: user.userEmail, userNickname: user.userNickname }
          });
        } else {
          res.status(400).send({
            errorMessage: "비밀번호가 잘못됐습니다.",
          });
        }
      }
  
    } catch (err) {
      console.log(err);
      res.status(400).send({
        errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  
  }
  
  // 회원가입
  async function userRegister(req, res) {
    try {
      const { userEmail, userPassword, passwordCheck, userNickname } = req.body;
      console.log(req.body);
  
      // 공백 확인
      if (userEmail === "" || userPassword === "" || passwordCheck === "" || userNickname === "") {
        res.status(412).send({
          errorMessage: "빠짐 없이 입력해주세요.",
        });
        return;
      }
  
      // 이메일 양식 확인
      const emailForm = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
      if (emailForm.test(userEmail) !== true) {
        res.status(400).send({
          errorMessage: "이메일 형식으로 입력해주세요.",
        });
        return;
      }
  
      // 암호화 추가하기
  
      // 패스워드 양식 확인
      if (userPassword.length < 6 == true) {
        res.status(400).send({
          errorMessage: "패스워드는 6자 이상으로 입력해주세요.",
        });
        return;
      }
  
      // 패스워드 불일치(입력, 재입력 칸)
      if (userPassword !== passwordCheck) {
        res.status(400).send({
          errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
        });
        return; // return 을 해야지 본 코드에서 나감 (비번 동일하지 않을 경우 괄호 밖 코드 실행 안함)
      }
  
      // 이미 동일 정보가 있을 경우
      const existUsers = await User.findAll({ // find 지원안하기 때문에 findAll로 변경
        where: {
          [Op.or]: [{ userEmail }], // [Op.or]: 조건[{ email }]이 하나라도 맞으면 가져와라 / Op라는 객체는 시퀄라이즈가 지원
        },
      });
      if (existUsers.length) {
        res.status(400).send({
          errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
        });
        return;
      }
      // 암호화 하기
      const hash = await bcrypt.hash(userPassword, 10);
  
      // 회원가입 정보를 db에 저장
      await User.create({ userEmail, userNickname, userPassword: hash, }); // 비동기 함수라 await 붙여줌, save() 안해줘도 되기 때문에 지웠음
  
      res.status(201).send({}); // post created 201 반환
  
    } catch (err) {
      console.log(err);
      res.status(400).send({
        errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  
  };
  
  
  // const kakaoLogin = async (req, res) => {
  
  
  // };
  
  
  // 유저 정보 페이지
  const getUser = async (req, res) => {
    try {
  
      const { userId } = req.params;
      console.log(userId)
  
      const user = await User.findOne({
        where: {
          userId: userId,
  
        },
      });
      res.send({
        user: {
          userId: user.userId,
          userEmail: user.userEmail,
          userNickname: user.userNickname,
          followingCnt: user.followingCnt,
          followerCnt: user.follwerCnt,
          likePerfumeCnt: user.likePerfumeCnt,
  
        },
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        errorMessage: "유저 조회 실패",
      });
    }
  };
  
  
  
  
  // // 내정보 페이지
  // const getUser = async (req, res) => {
  //     try {
  //         const { userId } = res.locals.user;
  
  //         const user = await User.findAll({
  //             where: {
  //                 userId: userId,
  
  //             },
  //         });
  //         res.send({
  //             user
  //         });
  //     } catch (err) {
  //         console.log(err);
  //         res.status(400).send({
  //             errorMessage: "유저 조회 실패",
  //         });
  //     }
  // };
  
  
  // 리뷰 등록한 향수 리스트
  const reviewPerfume = async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(userId)
  
      const reviewList = await Review.findAll({
        where: {
          userId: userId,
        },
      });
      console.log(reviewList)
  
      let perfumes = ""
      const imageUrl = []
      if (reviewList.length !== 0) {
        for (let i = 0; i < reviewList.length; i++) {
  
          perfumes = await Perfume.fineAll({
            where: {
              perfumeId: reviewList[i][perfumeId]
            },
          })
          imageUrl += perfumes[i][perfumeImageUrl]
        }
      }
      res.send({
        imageUrl // []
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        errorMessage: "유저 조회 실패",
      });
    }
  };
  
  
  const likePerfume = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const usersAllLike = await PerfumeLike.findAll({
        where: {
          userId : userId,
        },
      });
  
      let perfumeArr = [];
      
      if(usersAllLike.length !== 0){
        for(let i = 0; i < usersAllLike.length; i++){
          usersAllLike[i].perfumeId
        }
      }
      const userPerfumeId = await Perfume.findAll({
        where: {
          perfumeId : userPerfumeId,
        },
      });
  
    } catch (err) {
      console.log(err);
      res.status(400).send({
        errorMessage: "유저 조회 실패",
      });
    }
  
  };
  
  
  
  
  
  
  const userFollow = async (req, res, next) => {
  
    try {
      const user = await User.findOne({ where: { userId: res.locals.user.userId } });
      console.log(user.userId) // 내 id
      
      if (user) {
        await user.addFollowings(parseInt(req.params.userId, 10)); // add할 상대 id
        res.send('success');
      } else {
        res.status(404).send('no user');
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
  
  
  
  
  
  
  module.exports = {
    userLogin,
    userRegister,
    // kakaoLogin,
    getUser,
    reviewPerfume,
    likePerfume,
    userFollow,
  };