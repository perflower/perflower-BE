const { Review, User, ReviewLike, Perfume } = require("../../models");
const { Op } = require("sequelize");

//리뷰등록 > trycatch 로 수정하기
reviewPost = async (req, res) => {
  try {
    const { perfumeId } = req.params;
    const {
      content,
      reviewLikeCnt,
      starRating,
      indexSexual,
      indexTone,
      indexBody,
      indexDesign,
      seasonSpring,
      seasonSummer,
      seasonFall,
      seasonWinter,
      userId,
    } = req.body;
    // const { userId } = res.locals.users;

    const thisReview = await Review.create({
      perfumeId: perfumeId,
      content: content,
      reviewLikeCnt: reviewLikeCnt,
      starRating: starRating,
      indexSexual: indexSexual,
      indexTone: indexTone,
      indexBody: indexBody,
      indexDesign: indexDesign,
      seasonSpring: seasonSpring,
      seasonSummer: seasonSummer,
      seasonFall: seasonFall,
      seasonWinter: seasonWinter,
      userId: userId,
    });

    const reviewFind = await Review.count({
      where: { perfumeId: perfumeId },
    });

    const ppap = await Review.findAll({
      where: { perfumeId: perfumeId },
      raw: true,
    });

    const ppapLength = ppap.length;

    let sumRating = 0;
    let sumSex = 0;
    let sumTone = 0;
    let sumBody = 0;
    let sumDesign = 0;
    let sumSpring = 0;
    let sumSummer = 0;
    let sumFall = 0;
    let sumWinter = 0;
    for (let i = 0; i < ppap.length; i++) {
      sumRating += ppap[i].starRating;
      sumSex += ppap[i].indexSexual;
      sumTone += ppap[i].indexTone;
      sumBody += ppap[i].indexBody;
      sumDesign += ppap[i].indexDesign;
      sumSpring += ppap[i].seasonSpring;
      sumSummer += ppap[i].seasonSummer;
      sumFall += ppap[i].seasonFall;
      sumWinter += ppap[i].seasonWinter;
    }
    let avgRating = sumRating / ppapLength;
    let avgSex = sumSex / ppapLength;
    let avgTone = sumTone / ppapLength;
    let avgBody = sumBody / ppapLength;
    let avgDesign = sumDesign / ppapLength;

    await Perfume.update(
      {
        starRatingAvg: avgRating,
        indexSexualAvg: avgSex,
        indexToneAvg: avgTone,
        indexBodyAvg: avgBody,
        indexDesignAvg: avgDesign,
        seasonSpringCnt: sumSpring,
        seasonSummerCnt: sumSummer,
        seasonFallCnt: sumFall,
        seasonWinterCnt: sumWinter,
        reviewCnt: reviewFind,
      },
      { where: { perfumeId: perfumeId } }
    );

    return res.status(200).json({ result: "true", thisReview });
  } catch (error) {
    console.log(`리뷰 등록 중 발생한 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "리뷰 등록 중 에러가 발생했습니다",
    });
  }
};
//리뷰 상세조회
reviewGet = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findOne({
      where: { reviewId: reviewId },
      raw: true,
    });
    return res.status(200).json({ result: "true", review });
  } catch (error) {
    console.log(`리뷰 3개조회 중 발생한 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "리뷰 3개조회 중 에러가 발생했습니다",
    });
  }
};

//리뷰 3개 조회(최신순)
reviewGetThreeByLatest = async (req, res) => {
  try {
    const { perfumeId } = req.params;
    const thisPerfumeReviewId = await Review.findAll({
      where: { perfumeId: perfumeId },
      raw: true,
    });
    console.log(thisPerfumeReviewId);
    let aaa = "";
    let qqq = "";
    for (let i = 0; i < thisPerfumeReviewId.length; i++) {
      aaa += thisPerfumeReviewId[i].reviewId + ",";
      qqq += thisPerfumeReviewId[i].userId + ",";
    }
    //해당향수의 reviewId 구하기 결과 예 : [1,2,3,4]
    let bb = aaa.length - 1;
    let aaaa = aaa.substring(0, bb);
    let aaaaa = JSON.parse("[" + aaaa + "]");
    //리뷰작성한 userId 구하기 결과 예 : [1,2,3,4]
    let tt = qqq.length - 1;
    let qqqq = qqq.substring(0, tt);
    let qqqqq = JSON.parse("[" + qqqq + "]");
    const threeReview = await Review.findAndCountAll({
      where: { perfumeId: perfumeId },
      offset: 0,
      limit: 3,
      raw: true,
      order: [["reviewId", "DESC"]],
      attributes: [
        "perfumeId",
        "reviewId",
        "userId",
        "content",
        "starRating",
        "reviewLikeCnt",
        "createdAt",
      ],
      include: [
        // 나중에 page offset 설정( 아마 10 ?)
        {
          model: User,
          where: { userId: { [Op.or]: qqqqq } },
          attributes: ["userNickname", "userImgUrl", "userFrag", "createdAt"],
        },
      ], //차순 asc = 오름차순, desc = 내림차순
    });
    if (threeReview.length !== 0) {
      return res.status(200).json({ result: "true", threeReview });
    } else {
      return res.status(200).json({
        result: "해당 향수에 대한 리뷰가 존재하지 않습니다!",
        threeReview,
      });
    }
  } catch (error) {
    console.log(`리뷰 3개조회 중 발생한 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "리뷰 3개조회 중 에러가 발생했습니다",
    });
  }
};

//리뷰3개조회(인기순)
reviewGetThreeByPopular = async (req, res) => {
  try {
    const { perfumeId } = req.params;
    const thisPerfumeReviewId = await Review.findAll({
      where: { perfumeId: perfumeId },
      raw: true,
    });
    console.log(thisPerfumeReviewId);
    let aaa = "";
    let qqq = "";
    for (let i = 0; i < thisPerfumeReviewId.length; i++) {
      aaa += thisPerfumeReviewId[i].reviewId + ",";
      qqq += thisPerfumeReviewId[i].userId + ",";
    }
    //해당향수의 reviewId 구하기 결과 예 : [1,2,3,4]
    let bb = aaa.length - 1;
    let aaaa = aaa.substring(0, bb);
    let aaaaa = JSON.parse("[" + aaaa + "]");
    //리뷰작성한 userId 구하기 결과 예 : [1,2,3,4]
    let tt = qqq.length - 1;
    let qqqq = qqq.substring(0, tt);
    let qqqqq = JSON.parse("[" + qqqq + "]");
    const threeReview = await Review.findAll({
      where: { perfumeId: perfumeId },
      order: [["reviewLikeCnt", "DESC"]], //차순 asc = 오름차순, desc = 내림차순
      offset: 0,
      limit: 3,
      raw: true,
      attributes: [
        "perfumeId",
        "reviewId",
        "userId",
        "content",
        "starRating",
        "reviewLikeCnt",
        "createdAt",
      ],
      include: [
        // 나중에 page offset 설정( 아마 10 ?)
        {
          model: User,
          where: { userId: { [Op.or]: qqqqq } },
          attributes: ["userNickname", "userImgUrl", "userFrag", "createdAt"],
        },
      ],
    });
    if (threeReview.length !== 0) {
      return res.status(200).json({ result: "true", threeReview });
    } else {
      return res.status(200).json({
        result: "해당 향수에 대한 리뷰가 존재하지 않습니다!",
        threeReview,
      });
    }
  } catch (error) {
    console.log(`리뷰 3개조회 중 발생한 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "리뷰 3개조회 중 에러가 발생했습니다",
    });
  }
};

//리뷰전체조회(최신순)
reviewGetAllByLatest = async (req, res) => {
  try {
    const { perfumeId } = req.params;
    /*
        해당 향수의 리뷰id들을 찾고 그 리뷰들에 대한 정보를 
        향수 줄때 같이 준다.
        */
    const thisPerfumeReviewId = await Review.findAll({
      where: { perfumeId: perfumeId },
      raw: true,
    });
    console.log(thisPerfumeReviewId);
    let aaa = "";
    let qqq = "";
    for (let i = 0; i < thisPerfumeReviewId.length; i++) {
      aaa += thisPerfumeReviewId[i].reviewId + ",";
      qqq += thisPerfumeReviewId[i].userId + ",";
    }
    //해당향수의 reviewId 구하기 결과 예 : [1,2,3,4]
    let bb = aaa.length - 1;
    let aaaa = aaa.substring(0, bb);
    let aaaaa = JSON.parse("[" + aaaa + "]");
    //리뷰작성한 userId 구하기 결과 예 : [1,2,3,4]
    let tt = qqq.length - 1;
    let qqqq = qqq.substring(0, tt);
    let qqqqq = JSON.parse("[" + qqqq + "]");

    const allReview = await Review.findAndCountAll({
      where: { perfumeId: perfumeId },
      order: [["reviewId", "DESC"]],
      raw: true,
      attributes: [
        "perfumeId",
        "reviewId",
        "userId",
        "content",
        "starRating",
        "reviewLikeCnt",
        "createdAt",
      ],
      include: [
        // 나중에 page offset 설정( 아마 10 ?)
        {
          model: User,
          where: { userId: { [Op.or]: qqqqq } },
          attributes: ["userNickname", "userImgUrl", "userFrag", "createdAt"],
        },
      ],
    });
    console.log(allReview);
    if (allReview.length !== 0) {
      return res.status(200).json({ result: "true", allReview });
    } else {
      return res.status(404).json({
        result: "해당 향수에 대한 리뷰가 존재하지 않습니다!",
      });
    }
  } catch (error) {
    console.log(`리뷰 전체조회 중 발생한 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "리뷰 전체조회 중 에러가 발생했습니다",
    });
  }
};

//리뷰전체조회(인기순)
reviewGetAllByPopular = async (req, res) => {
  try {
    const { perfumeId } = req.params;
    /*
        해당 향수의 리뷰id들을 찾고 그 리뷰들에 대한 정보를 
        향수 줄때 같이 준다.
        */
    const thisPerfumeReviewId = await Review.findAll({
      where: { perfumeId: perfumeId },
      raw: true,
    });
    let aaa = "";
    let qqq = "";
    for (let i = 0; i < thisPerfumeReviewId.length; i++) {
      aaa += thisPerfumeReviewId[i].reviewId + ",";
      qqq += thisPerfumeReviewId[i].userId + ",";
    }
    //해당향수의 reviewId 구하기 결과 예 : [1,2,3,4]
    let bb = aaa.length - 1;
    let aaaa = aaa.substring(0, bb);
    let aaaaa = JSON.parse("[" + aaaa + "]");

    //리뷰작성한 userId 구하기 결과 예 : [1,2,3,4]
    let tt = qqq.length - 1;
    let qqqq = qqq.substring(0, tt);
    let qqqqq = JSON.parse("[" + qqqq + "]");

    const allReview = await Review.findAll({
      where: { perfumeId: perfumeId },
      order: [["reviewLikeCnt", "DESC"]],
      raw: true,
      attributes: [
        "perfumeId",
        "reviewId",
        "userId",
        "content",
        "starRating",
        "reviewLikeCnt",
        "createdAt",
      ],
      include: [
        // 나중에 page offset 설정( 아마 10 ?)
        {
          model: User,
          where: { userId: { [Op.or]: qqqqq } },
          attributes: ["userNickname", "userImgUrl", "userFrag"],
        },
        // {
        //     model: ReviewLike,
        //     where: { reviewId: { [Op.or]: [aaaaa] } },
        // },
      ],
    });
    console.log(allReview);
    const reviewCntAll = await Review.count({
      where: { perfumeId: perfumeId },
    });
    console.log(`reviewCntAll : ${reviewCntAll}`);
    if (allReview.length !== 0) {
      return res.status(200).json({ result: "true", allReview, reviewCntAll });
    } else {
      return res.status(404).json({
        result: "해당 향수에 대한 리뷰가 존재하지 않습니다!",
      });
    }
  } catch (error) {
    console.log(`리뷰 전체조회 중 발생한 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "리뷰 전체조회 중 에러가 발생했습니다",
    });
  }
};

//리뷰수정
reviewUpdate = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content, userId } = req.body;
    // const userId = res.locals.userId;

    //본인확인
    const thisReview = await Review.findOne({
      where: { reviewId: reviewId },
      raw: true,
    });
    if (!thisReview) {
      return res.status(404).json({ result: "해당 리뷰가 존재하지 않습니다." });
    }
    if (thisReview.userId !== userId) {
      return res.status(401).json({
        result: "본인 리뷰만 수정가능합니다.",
      });
    }
    await Review.update(
      { content: content },
      { where: { reviewId: reviewId, userId: userId } }
    );
    return res.status(200).json({ result: "리뷰 수정 완료" });
  } catch (error) {
    console.log(`리뷰 수정 중 발생한 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "리뷰 수정 중 에러가 발생했습니다",
    });
  }
};

//리뷰삭제
reviewDelete = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;
    // const userId = res.locals.userId;

    //본인확인
    const delReview = await Review.findOne({
      where: { reviewId: reviewId },
      raw: true,
    });
    const perfumeId = await delReview.perfumeId;
    const delUser = delReview.userId;

    if (delUser !== userId) {
      return res.status(401).json({
        result: "본인 리뷰만 삭제가능합니다.",
      });
    } else {
      await Review.destroy({
        where: {
          perfumeId: perfumeId,
          reviewId: reviewId,
          userId: userId,
        },
      });

      //향수테이블 reviewCnt 수정
      const reviewFind = await Review.count({
        where: { perfumeId: perfumeId },
      });
      const ppap = await Review.findAll({
        where: { perfumeId: perfumeId },
        raw: true,
      });
      if (ppap.length == 0) {
        await Perfume.update(
          {
            starRatingAvg: 0,
            indexSexualAvg: 0,
            indexToneAvg: 0,
            indexBodyAvg: 0,
            indexDesignAvg: 0,
            seasonSpringCnt: 0,
            seasonSummerCnt: 0,
            seasonFallCnt: 0,
            seasonWinterCnt: 0,
            reviewCnt: reviewFind,
          },
          { where: { perfumeId: perfumeId } }
        );
        await ReviewLike.destroy({
          where: { perfumeId: perfumeId, reviewId: reviewId },
        });
        res.status(200).json({
          result: " 해당 향수 마지막 리뷰 삭제 완료",
        });
      } else {
        const ppapLength = ppap.length;

        let sumRating = 0;
        let sumSex = 0;
        let sumTone = 0;
        let sumBody = 0;
        let sumDesign = 0;
        let sumSpring = 0;
        let sumSummer = 0;
        let sumFall = 0;
        let sumWinter = 0;
        for (let i = 0; i < ppap.length; i++) {
          sumRating += ppap[i].starRating;
          sumSex += ppap[i].indexSexual;
          sumTone += ppap[i].indexTone;
          sumBody += ppap[i].indexBody;
          sumDesign += ppap[i].indexDesign;
          sumSpring += ppap[i].seasonSpring;
          sumSummer += ppap[i].seasonSummer;
          sumFall += ppap[i].seasonFall;
          sumWinter += ppap[i].seasonWinter;
        }
        let avgRating = sumRating / ppapLength;
        let avgSex = sumSex / ppapLength;
        let avgTone = sumTone / ppapLength;
        let avgBody = sumBody / ppapLength;
        let avgDesign = sumDesign / ppapLength;

        await Perfume.update(
          {
            starRatingAvg: avgRating,
            indexSexualAvg: avgSex,
            indexToneAvg: avgTone,
            indexBodyAvg: avgBody,
            indexDesignAvg: avgDesign,
            seasonSpringCnt: sumSpring,
            seasonSummerCnt: sumSummer,
            seasonFallCnt: sumFall,
            seasonWinterCnt: sumWinter,
            reviewCnt: reviewFind,
          },
          { where: { perfumeId: perfumeId } }
        );

        await ReviewLike.destroy({
          where: { perfumeId: perfumeId, reviewId: reviewId },
        });
        res.status(200).json({ result: "리뷰 삭제 완료" });
      }
    }
  } catch (error) {
    console.log(`리뷰 삭제 중 발생한 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "리뷰 삭제 중 에러가 발생했습니다",
    });
  }
};

//리뷰좋아요
reviewLike = async (req, res) => {
  try {
    const { perfumeId, reviewId } = req.params;
    const { userId } = req.body;
    // const userId = res.locals.userId;

    const aacc = await Review.findOne({
      where: {
        perfumeId: perfumeId,
        reviewid: reviewId,
      },
      raw: true,
    });
    const bbcc = await ReviewLike.findOne({
      where: {
        [Op.and]: [
          { perfumeId: perfumeId },
          { reviewId: reviewId },
          { userId: userId },
        ],
      },
      raw: true,
    });
    console.log(aacc);
    if (!aacc) {
      return res.status(404).json({ result: "존재하지 않는 리뷰입니다." });
    } else if (bbcc) {
      return res
        .status(400)
        .json({ result: "이미 존재하는 리뷰라이크입니다." });
    } else {
      await ReviewLike.create({
        perfumeId: perfumeId,
        reviewId: reviewId,
        userId: userId,
      });
      const thisReviewLikeCnt = await ReviewLike.count({
        where: {
          perfumeId: perfumeId,
          reviewId: reviewId,
        },
      });
      await Review.update(
        { reviewLikeCnt: thisReviewLikeCnt },
        {
          where: {
            perfumeId: perfumeId,
            reviewId: reviewId,
          },
        }
      );
      console.log(
        `리뷰 좋아요 후 ${perfumeId} 향수의 ${reviewId} 리뷰의 좋아요갯수는 ${thisReviewLikeCnt}개`
      );
      return res.status(200).json({ result: "리뷰 좋아요 완료" });
    }
  } catch (error) {
    console.log(`리뷰 좋아요 중 발생한 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "리뷰 좋아요 중 에러가 발생했습니다",
    });
  }
};

//리뷰좋아요취소
reviewLikeDelete = async (req, res) => {
  try {
    const { perfumeId, reviewId } = req.params;
    const { userId } = req.body;
    // const userId = res.locals.userId;

    const aacc = await Review.findOne({
      where: {
        perfumeId: perfumeId,
        reviewid: reviewId,
      },
      raw: true,
    });
    const bbcc = await ReviewLike.findOne({
      where: {
        [Op.and]: [
          { perfumeId: perfumeId },
          { reviewId: reviewId },
          { userId: userId },
        ],
      },
      raw: true,
    });
    console.log(aacc);
    if (!aacc) {
      return res.status(404).json({ result: "존재하지 않는 리뷰입니다." });
    } else if (!bbcc) {
      return res
        .status(400)
        .json({ result: "존재하지 않는 리뷰라이크입니다." });
    } else {
      await ReviewLike.destroy({
        where: {
          perfumeId: perfumeId,
          reviewId: reviewId,
          userId: userId,
        },
      });
      const thisReviewLikeCnt = await ReviewLike.count({
        where: {
          perfumeId: perfumeId,
          reviewId: reviewId,
        },
      });
      console.log(thisReviewLikeCnt);
      await Review.update(
        { reviewLikeCnt: thisReviewLikeCnt },
        {
          where: {
            perfumeId: perfumeId,
            reviewId: reviewId,
          },
        }
      );
      console.log(
        `리뷰좋아요 취소 후 ${perfumeId}향수의 ${reviewId}의 리뷰좋아요갯수는 ${thisReviewLikeCnt}개`
      );
      return res.status(200).json({ result: "좋아요 삭제완료" });
    }
  } catch (error) {
    console.log(`리뷰 좋아요취소 중 발생한 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "리뷰 좋아요취소 중 에러가 발생했습니다",
    });
  }
};

//include 테스트
test = async (req, res) => {
  const user = await User.findAll({
    attributes: ["userId"],
  });
  res.json({ user });
  // const user = await User.findOne({
  //     include: [
  //         {
  //             model: Review,
  //             //where : {perfumeId : req.params.perfumeId};
  //             offset: 0,
  //             limit: 3,
  //             order: [["reviewId", "DESC"]],
  //             attributes: ["content", "starRating"],
  //         },
  //         {
  //             model: ReviewLike,
  //         },
  //     ],
  // });
  // console.log(user);
  // res.json({ user });
};
module.exports = {
  reviewPost,
  reviewGet,
  reviewGetThreeByLatest,
  reviewGetThreeByPopular,
  reviewGetAllByLatest,
  reviewGetAllByPopular,
  reviewUpdate,
  reviewDelete,
  reviewLike,
  reviewLikeDelete,
  test,
};
