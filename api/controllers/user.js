const {
  User,
  Perfume,
  Review,
  PerfumeLike,
  Follow,
  Brand,

} = require("../../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();




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
        console.log(token)
        res.send({
          token,
          user: { userId: user.userId, userEmail: user.userEmail, userNickname: user.userNickname }
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

    res.status(201).send({ result: true }); // post created 201 반환

  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
};

// 카카오 콜백
const kakaoCallback = async (req, res) => {
  try {
    console.log("여기서 테스트 한번 합시다.");
    const user = req.user;

    const token = jwt.sign(
      { userId: user.userId }, process.env.SECRET_KEY);
    const data = { user: user };
    
    res.status(200).send({
      message: "로그인에 성공하였습니다.",
      data: data,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
    });
  }
}

// 카카오 로그아웃
const kakaoLogout = async (req, res) => {
  req.logout();
  req.session.destroy();
  // res.redirect('/');
}


// 유저 정보 페이지
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const myUserId = res.locals.users.userId
    console.log(myUserId)

    const user = await User.findOne({
      where: {
        userId: userId,
      },
    });
    res.send({
        userId: user.userId,
        userEmail: user.userEmail,
        userNickname: user.userNickname,
        followingCnt: user.followingCnt,
        followerCnt: user.followerCnt,
        likePerfumeCnt: user.likePerfumeCnt,
        userReviewCnt: user.userReviewCnt,
        userImgUrl: user.userImgUrl,
        userFrag: user.userFrag,

    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "유저 조회 실패",
    });
  }
};

// // 내정보 페이지
// const myUserPage = async (req, res) => {
//   try {
//     const { userId } = res.locals.users;
//     console.log(userId)

//     const user = await User.findOne({
//       where: {
//         userId: userId,
//       },
//     });
//     res.send({
//         userId: user.userId,
//         userEmail: user.userEmail,
//         userNickname: user.userNickname,
//         followingCnt: user.followingCnt,
//         followerCnt: user.followerCnt,
//         likePerfumeCnt: user.likePerfumeCnt,
//         userReviewCnt: user.userReviewCnt,
//         userImgUrl: user.userImgUrl,
//         userFrag: user.userFrag,

//     });
//   } catch (err) {
//     console.log(err);
//     res.status(400).send({
//       errorMessage: "유저 조회 실패",
//     });
//   }
// }


// 팔로잉 리스트
const getFollowingList = async (req, res) => {
  const { userId } = res.locals.users;
  console.log(userId)

  const followingUserList = [];

  try {
    const followingList = await Follow.findAll({
      where: { followerId: userId },
      attributes: ['followingId'],
    })

    for (let i = 0; i < followingList.length; i++) {
      const userList = await User.findOne({
        where: { userId: followingList[i].followingId },
        attributes: ['userId', 'userNickname', 'userImgUrl'],
      })
      followingUserList.push(userList)
    }

    res.send({
      followingUserList,
    });

  } catch {
    console.log(err);
    res.status(400).send({
      errorMessage: "팔로잉 조회 실패",
    });
  }
}

// 팔로워 리스트
const getFollowerList = async (req, res) => {
  const { userId } = res.locals.users;
  const followerUserList = [];
  try {

    const followerList = await Follow.findAll({
      where: { followingId: userId },
      attributes: ['followerId'],
    })

    for (let i = 0; i < followerList.length; i++) {
      const userList = await User.findOne({
        where: { userId: followerList[i].followerId },
        attributes: ['userId', 'userNickname', 'userImgUrl'],
      })
      followerUserList.push(userList)
    }
    res.send({
      followerUserList
    });

  } catch {
    console.log(err);
    res.status(400).send({
      errorMessage: "팔로워 조회 실패",
    });
  }
}


// 프로필 이미지 업로드
const profileUpload = async (req, res) => {

  const { location } = req.file;
  try {
    res.json({ url: location });
  } catch (err) {
    res.status(400).send({ errorMessage: " 업로드 실패" });
  }

};



// 내 정보 비번,닉네임,이미지 수정하기
const updateUser = async (req, res) => {
  const { userNickname, nowPassword, userPassword, userImgUrl, description } = req.body;
  const { userId } = res.locals.users;

  try {
    // 공백 확인
    if (userPassword === "" || userNickname === "") {
      res.status(412).send({
        errorMessage: "빠짐 없이 입력해주세요.",
      });
      return;
    }
    const user = await User.findOne({ where: { userId } });
    // user 정보 불일치
    if (!user) {
      res.status(400).send({
        errorMessage: "계정 정보가 잘못됐습니다.",
      });
      return;
    }

    const existUsers = await User.findOne({
      where: {
        [Op.or]: [{ userNickname }],
      },
    });

    if (existUsers) {
      res.status(400).send({
        errorMessage: "이미 존재하는 닉네임이 있습니다.",
      });
      return;
    }

    const result = await bcrypt.compare(nowPassword, user.userPassword)
    if(!result){
      res.status(400).send({
        errorMessage: "기존 비밀번호가 다릅니다.",
      });
      return;
    }
    const hash = await bcrypt.hash(userPassword, 10);

    // 회원가입 정보를 db에 저장
    await User.update({
      userNickname: userNickname,
      userPassword: hash,
      userImgUrl: userImgUrl,
      description: description,
    },
      { where: { userId: userId } });

    res.send({
      result: true
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: "프로필 수정 에러"
    });
  }
};

// 유저 삭제
const deleteUser = async (req, res) => {
  try {
    const { userId } = res.locals.users;
    console.log(userId)

    const exUser = await User.findOne({
      where: { userId: userId },
    });
    if (exUser.userId == userId) {
      const result = await User.destroy({
        where: { userId: userId },
      });
    }
    console.log(result)
    res.send({ result: true });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "유저 삭제 실패",
    });
  }
};

// 리뷰 등록한 향수 리스트
const reviewPerfume = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("파람" + userId)
    console.log("내id" + res.locals.users.userId);
    const reviewList = await Review.findAll({
      where: {
        userId: userId,
      },
    });
    console.log(reviewList)
    let reviewPerfumeList = []

    if (reviewList.length == 0) return res.send({ Message: "reviewId없음", })

    else if (reviewList !== 0) {
      for (let i = 0; i < reviewList.length; i++) {
        const perfumes = await Perfume.findOne({
          where: {
            perfumeId: reviewList[i].reviewId
          },
          attributes: ['brandId', 'perfumeName','originImgUrl'],
          include: [
            {
              model: Brand,
              attributes: ["brandName"],
            },
          ],
          raw: true,
        })
        reviewPerfumeList.push(perfumes)
      }
    }

    res.send({
      reviewPerfumeList
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "향수 조회실패",
    });
  }
};

// 좋아요한 향수 리스트
const likePerfume = async (req, res) => {
  try {
    const { userId } = req.params;
    const likeList = await PerfumeLike.findAll({
      where: {
        userId: userId,
      },
    });

    let likePerfumeList = []
    let imageUrl = []
    if (likeList.length == 0) return res.send({ errorMessage: "조회실패", })
    else if (likeList.length !== 0) {
      for (let i = 0; i < likeList.length; i++) {
        const perfumes = await Perfume.findOne({
          where: {
            perfumeId: likeList[i].perfumeId
          },
          attributes: ['brandId', 'perfumeName','price', 'originImgUrl'],
          include: [
            {
              model: Brand,
              attributes: ["brandName"],
            },
          ],
          raw: true,
        })
        likePerfumeList.push(perfumes)
      }
      res.send({
        likePerfumeList
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "유저 조회 실패",
    });
  }
};


//팔로잉하기 / 팔로잉취소하기
const userFollow = async (req, res, next) => {

  const { userId } = res.locals.users;
  const targetUser = req.params.userId;

  try {
    const user = await User.findOne({ where: { userId: userId } });
    console.log(user.userId) // 내 id
    console.log(targetUser) // params

    const { followingCnt } = await User.findOne({ where: { userId: user.userId } })
    const { followerCnt } = await User.findOne({ where: { userId: targetUser } })

    if (user) {
      const existUser = await Follow.findOne({ where: { followerId: user.userId, followingId: targetUser } })
      console.log("existUser" + existUser)
      if (!existUser) {
        await user.addFollowings(parseInt(targetUser, 10)); // add할 상대 id
        User.update({ followingCnt: followingCnt + 1 }, { where: { userId: user.userId } })
        User.update({ followerCnt: followerCnt + 1 }, { where: { userId: targetUser } })
        res.send({ result: "팔로잉성공" });
      } else {
        await user.removeFollowing(parseInt(targetUser, 10))
        await User.update({ followingCnt: followingCnt - 1 }, { where: { userId: user.userId } })
        await User.update({ followerCnt: followerCnt - 1 }, { where: { userId: targetUser } })
        res.send({ result: "팔로잉취소" });
      }
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
  kakaoCallback,
  kakaoLogout,
  getUser,
  reviewPerfume,
  likePerfume,
  userFollow,
  updateUser,
  deleteUser,
  profileUpload,
  getFollowingList,
  getFollowerList,

};