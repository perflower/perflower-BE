const {
  User,
  Perfume,
  Review,
  PerfumeLike,
  Follow,
  Brand,
  ReviewLike,
} = require("../../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../mail/passwordEmail");
const s3 = require("../../config/s3");
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
    } else if (user) {
      const result = await bcrypt.compare(userPassword, user.userPassword);
      if (result) {
        // user 정보 일치
        const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY);
        console.log(token);
        res.send({
          token,
          user: {
            userId: user.userId,
            userEmail: user.userEmail,
            userNickname: user.userNickname,
          },
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
};

// 회원가입
async function userRegister(req, res) {
  try {
    const { userEmail, userPassword, passwordCheck, userNickname } = req.body;

    // 공백 확인
    if (
      userEmail === "" ||
      userPassword === "" ||
      passwordCheck === "" ||
      userNickname === ""
    ) {
      res.status(412).send({
        errorMessage: "빠짐 없이 입력해주세요.",
      });
      return;
    }

    // 이메일 양식 확인
    const emailForm =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
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
    // 닉네임중복
    const exUser = await User.findOne({
      where: {
        userNickname: userNickname,
      },
    });
    console.log(exUser);
    if (exUser) {
      res.status(205).send({
        errorMessage: "존재하는 닉네임입니다.",
      });
      return;
    }
    // 이미 동일 정보가 있을 경우
    const existUsers = await User.findAll({
      // find 지원안하기 때문에 findAll로 변경
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
    await User.create({ userEmail, userNickname, userPassword: hash }); // 비동기 함수라 await 붙여줌, save() 안해줘도 되기 때문에 지웠음

    res.status(201).send({ result: true }); // post created 201 반환
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

// 이메일 중복확인
const existEmail = async (req, res) => {
  const { userEmail } = req.body;
  if (userEmail === "") {
    res.status(400).send({
      errorMessage: "빈 문자열입니다.",
    });
    return;
  }
  try {
    const exUser = await User.findOne({
      where: {
        userEmail: userEmail,
      },
    });
    if (exUser) {
      res.status(205).send({
        errorMessage: "존재하는 이메일입니다.",
      });
      return;
    }
    const emailForm =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    if (emailForm.test(userEmail) !== true) {
      res.status(400).send({
        errorMessage: "이메일 형식으로 입력해주세요.",
      });
      return;
    }
    res.send({ result: true });
  } catch (err) {
    res.status(400).send({ errorMessage: "fail" });
  }
};

// 닉네임 중복확인
const existNickname = async (req, res) => {
  const { userNickname } = req.body;
  if (userNickname === "") {
    res.status(400).send({
      errorMessage: "빈 문자열입니다.",
    });
    return;
  }
  try {
    const exUser = await User.findOne({
      where: {
        userNickname: userNickname,
      },
    });
    if (exUser) {
      res.status(205).send({
        errorMessage: "존재하는 닉네임입니다.",
      });
      return;
    }
    res.send({ result: true });
  } catch (err) {
    res.status(400).send({ errorMessage: "fail" });
  }
};

// 비밀번호 확인
const confirmPassword = async (req, res) => {
  const { userPassword } = req.body;

  // 공백 확인
  if (userPassword === "") {
    res.status(400).send({
      errorMessage: "빈 문자열입니다.",
    });
    return;
  }
  try {
    // 패스워드 양식 확인
    if (userPassword.length < 6) {
      res.status(400).send({
        errorMessage: "패스워드는 6자 이상으로 입력해주세요.",
      });
      return;
    }
    res.send({ result: true });
  } catch (err) {
    res.status(400).send({ errorMessage: "fail" });
  }
};

// 비밀번호 찾기 (이메일 발송)
const resetPassword = async (req, res) => {
  const { userEmail } = req.body;
  try {
    if (userEmail === "") {
      res.status(400).send({
        errorMessage: "빈 문자열입니다.",
      });
      return;
    }
    const user = await User.findOne({ where: { userEmail: userEmail } });
    console.log(user);
    if (!user) {
      res.status(406).send({ errorMessage: "존재하지 않는 이메일입니다" });
      return;
    }

    // 새 비밀번호 (암호화)
    const randomPassword = String(Math.floor(Math.random() * 1000000) + 100000);
    const hash = await bcrypt.hash(randomPassword, 10);
    await User.update(
      { userPassword: hash },
      { where: { userEmail: userEmail } }
    );

    let emailParam = {
      toEmail: userEmail, // 수신할 이메일
      subject: "perflower 임시 비밀번호 메일발송", // 메일 제목
      text: `${user.userNickname} 회원님! 임시 비밀번호는 ${randomPassword} 입니다`, // 메일 내용
    };

    mailer.sendGmail(emailParam);

    res.send({ result: true });
  } catch (err) {
    res.status(400).json({ errorMessage: "fail" });
  }
};
// 카카오 로그인
// 카카오 콜백
const kakaoCallback = async (req, res) => {
  try {
    console.log("여기서 테스트 한번 합시다.");
    const user = req.user;

    const token = jwt.sign(
      { userId: user.userId, userNickname: user.userNickname },
      process.env.SECRET_KEY
    );
    const data = { user: user };

    res.status(200).header({ token: token }).send({
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
};

// 카카오 로그아웃
const kakaoLogout = async (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
};

// 유저 정보 페이지
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const myUserId = res.locals.users.userId;
    console.log(myUserId);
    const user = await User.findOne({
      where: {
        userId: userId,
      },
    });
    const myFollow = await Follow.findOne({
      where: { followingId: userId, followerId: myUserId },
      attributes: ["followerId"],
    });
    if (!myFollow) {
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
        description: user.description,
      });
      return;
    }

    res.send({
      following: myFollow.followerId,
      userId: user.userId,
      userEmail: user.userEmail,
      userNickname: user.userNickname,
      followingCnt: user.followingCnt,
      followerCnt: user.followerCnt,
      likePerfumeCnt: user.likePerfumeCnt,
      userReviewCnt: user.userReviewCnt,
      userImgUrl: user.userImgUrl,
      userFrag: user.userFrag,
      description: user.description,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "유저 조회 실패",
    });
  }
};

// 팔로잉 리스트
const getFollowingList = async (req, res) => {
  const { userId } = res.locals.users;
  const thisUserId = req.params.userId;

  const followingUserList = [];
  try {
    const followingList = await Follow.findAll({
      where: { followerId: thisUserId },
      attributes: ["followingId"],
      raw: true,
    });
    for (let i = 0; i < followingList.length; i++) {
      const userList = await User.findOne({
        where: { userId: followingList[i].followingId },
        attributes: ["userId", "userNickname", "userImgUrl"],
        raw: true,
      });
      followingUserList.push(userList);
    }

    res.send({
      followingUserList,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "팔로잉 조회 실패",
    });
  }
};

// 팔로워 리스트
const getFollowerList = async (req, res) => {
  const { userId } = res.locals.users;
  const thisUserId = req.params.userId;

  const followerUserList = [];
  try {
    const followerList = await Follow.findAll({
      where: { followingId: thisUserId },
      attributes: ["followerId"],
      raw: true,
    });
    for (let i = 0; i < followerList.length; i++) {
      const userList = await User.findOne({
        where: { userId: followerList[i].followerId },
        attributes: ["userId", "userNickname", "userImgUrl"],
        raw: true,
      });
      followerUserList.push(userList);
    }
    res.send({
      followerUserList,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "팔로워 조회 실패",
    });
  }
};

// 내 정보 비번,닉네임,이미지 수정하기
const updateUser = async (req, res) => {
  const { userNickname, nowPassword, userPassword, description } = req.body;
  const { userId } = res.locals.users;
  let imgUrl, hash, delFileName;

  try {
    const user = await User.findOne({ where: { userId } });

    // user 정보 불일치
    if (!user) {
      res.status(400).send({
        result: false,
        errorMessage: "계정 정보가 잘못됐습니다.",
      });
      return;
    }

    const existUsers = await User.findOne({
      where: {
        userNickname: userNickname,
      },
    });

    //변경하고자 하는 닉네임이 있는 경우
    if (existUsers) {
      //닉네임이 본인 닉네임이 아닐 경우
      if (existUsers.userId !== userId) {
        res.status(400).send({
          result: false,
          errorMessage: "이미 존재하는 닉네임이 있습니다.",
        });
        return;
      }
    }

    //비밀번호 변경을 하지 않는 경우(기존 비번 사용)
    hash = user.dataValues.userPassword;

    //비밀번호를 변경하고자 하는 경우
    if (userPassword !== undefined && nowPassword !== undefined) {
      if (user.dataValues.kakaoId !== 0) {
        res.status(400).send({
          result: false,
          errorMessage: "소셜 계정은 비밀번호 변경이 불가능합니다.",
        });
        return;
      }
      const result = await bcrypt.compare(nowPassword, user.userPassword);

      if (!result) {
        res.status(400).send({
          result: false,
          errorMessage: "기존 비밀번호가 다릅니다.",
        });
        return;
      }
      hash = await bcrypt.hash(userPassword, 10);
    }

    //클라이언트에서 img 파일이 넘어왔을 경우
    if (req.file) {
      imgUrl = req.file.location;
      //s3 버킷 내의 기존 이미지 삭제
      if (user.dataValues.userImgUrl !== null) {
        delFileName = user.dataValues.userImgUrl.split("/").reverse()[0];
      } else delFileName = null;
      //파일이 있는 경우에만 삭제, 없으면 건너뜀
      s3.getObject(
        {
          Bucket: "perflowerbucket1",
          Key: `profiles/${delFileName}`,
        },
        (err, data) => {
          if (err) {
            console.log(err);
          } else if (data) {
            s3.deleteObject(
              {
                Bucket: "perflowerbucket1",
                Key: `profiles/${delFileName}`,
              },
              function (err, data) {
                if (err) console.log(err, err.stack);
                else console.log(data);
              }
            );
          }
        }
      );
    } else imgUrl = user.dataValues.userImgUrl; // 클라에서 img 파일이 안 넘어왔을 경우에는 기존 imgUrl 사용

    await User.update(
      {
        userNickname: userNickname,
        userPassword: hash,
        userImgUrl: imgUrl,
        description: description,
      },
      { where: { userId: userId } }
    );

    res.send({
      result: true,
    });
  } catch (err) {
    res.status(400).send({
      result: false,
      errorMessage: "프로필 수정 에러",
    });
    console.error(err);
  }
};

// 유저 삭제
const deleteUser = async (req, res) => {
  const { userId } = res.locals.users;
  console.log(userId);
  try {
    const { userId } = res.locals.users;

    const me = await User.findOne({
      where: { userId: userId },
      raw: true,
    });
    if (me.userId !== userId) {
      return res.status(401).json({
        result: "본인 계정만 탈퇴가능합니다.",
      });
    } else {
      await Review.destroy({
        where: {
          userId: userId,
        },
      });
      await ReviewLike.destroy({
        where: {
          userId: userId,
        },
      });
      await Follow.destroy({
        where: {
          followerId: userId,
          followingId: userId,
        },
      });
      await User.destroy({
        where: {
          userId: userId,
        },
      });

      res.status(200).json({ result: "탈퇴완료" });
    }
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
    console.log("파람" + userId);
    const reviewList = await Review.findAll({
      where: {
        userId: userId,
      },
    });
    console.log(reviewList);
    let reviewPerfumeList = [];
    if (reviewList.length == 0) return res.send({ Message: "reviewId없음" });
    else if (reviewList !== 0) {
      for (let i = 0; i < reviewList.length; i++) {
        const perfumes = await Perfume.findOne({
          where: {
            perfumeId: reviewList[i].perfumeId,
          },
          attributes: ["perfumeId", "brandId", "perfumeName", "imgUrl"],
          include: [
            {
              model: Review,
              attributes: ["reviewId"],
              where: { userId: userId },
            },
            {
              model: Brand,
              attributes: ["brandName"],
            },
          ],
          raw: true,
        });
        reviewPerfumeList.push(perfumes);
      }
    }

    res.send({
      reviewPerfumeList,
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

    let likePerfumeList = [];
    if (likeList.length == 0) return res.send({ errorMessage: "조회실패" });
    else if (likeList.length !== 0) {
      for (let i = 0; i < likeList.length; i++) {
        const perfumes = await Perfume.findOne({
          where: {
            perfumeId: likeList[i].perfumeId,
          },
          attributes: [
            "perfumeId",
            "brandId",
            "perfumeName",
            "price",
            "imgUrl",
          ],
          include: [
            {
              model: Brand,
              attributes: ["brandName"],
            },
          ],
          raw: true,
        });
        likePerfumeList.push(perfumes);
      }
      res.send({
        likePerfumeList,
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
  const userId = res.locals.users.userId;
  const targetUser = req.params.userId;
  let myFollow, targetFollower, myFollowCnt, targetFollowerCnt;

  try {
    const user = await User.findOne({ where: { userId: userId } });
    console.log(user.userId); // 내 id
    console.log(targetUser); // params

    if (user) {
      const existUser = await Follow.findOne({
        where: { followerId: userId, followingId: targetUser },
      });
      console.log("existUser" + existUser);
      if (!existUser) {
        // await user.addFollowings(parseInt(targetUser, 10)); // add할 상대 id
        await Follow.create({
          followerId: userId,
          followingId: targetUser,
        });

        //follows Table의 followerId가 팔로우를 하는 사람이고, followingId가 팔로워를 당하는 사람임.
        //그런데, users Table의 followerCnt가 팔로우 당한 숫자고, followingCnt가 팔로우를 한 숫자다..
        //내가 팔로우하는 숫자(나의 팔로잉)
        myFollow = await Follow.findAll({
          where: {
            followerId: userId,
          },
        });
        myFollowCnt = myFollow.length;
        console.log("my followCnt : ", myFollowCnt);

        //상대방을 팔로우 하는 숫자(상대방 팔로워)
        targetFollower = await Follow.findAll({
          where: {
            followingId: targetUser,
          },
        });
        targetFollowerCnt = targetFollower.length;
        console.log("target followerCnt : ", targetFollower.length);

        await User.update(
          { followingCnt: myFollowCnt },
          { where: { userId: user.userId } }
        );
        await User.update(
          { followerCnt: targetFollowerCnt },
          { where: { userId: targetUser } }
        );
        res.send({ result: "팔로잉성공" });
      } else {
        // await user.removeFollowing(parseInt(targetUser, 10));

        await Follow.destroy({
          where: {
            [Op.and]: [
              {
                followerId: userId,
              },
              {
                followingId: targetUser,
              },
            ],
          },
        });

        //내가 팔로우하는 숫자(나의 팔로잉)
        myFollow = await Follow.findAll({
          where: {
            followerId: userId,
          },
        });
        myFollowCnt = myFollow.length;
        console.log("my followCnt : ", myFollowCnt);

        //상대방을 팔로우 하는 숫자(상대방 팔로워)
        targetFollower = await Follow.findAll({
          where: {
            followingId: targetUser,
          },
        });
        targetFollowerCnt = targetFollower.length;
        console.log("target followerCnt : ", targetFollower.length);

        await User.update(
          { followingCnt: myFollowCnt },
          { where: { userId: user.userId } }
        );
        await User.update(
          { followerCnt: targetFollowerCnt },
          { where: { userId: targetUser } }
        );
        res.send({ result: "팔로잉취소" });
      }
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  userLogin,
  userRegister,
  existEmail,
  existNickname,
  confirmPassword,
  resetPassword,
  kakaoCallback,
  kakaoLogout,
  getUser,
  reviewPerfume,
  likePerfume,
  userFollow,
  updateUser,
  deleteUser,
  // profileUpload,
  getFollowingList,
  getFollowerList,
};
