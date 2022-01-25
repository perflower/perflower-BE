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
    } = req.body;
    const userId = res.locals.users.userId;
    let today = new Date();

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1; // 월
    let date = today.getDate(); // 날짜
    let hour = today.getHours();
    let minute = today.getMinutes();
    const dayCreated =
      year + "년" + month + "월" + date + "일" + hour + ":" + minute;

    const thisReview = await Review.create({
      userId: userId,
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
      createdAt: dayCreated,
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
    const userId = res.locals.users.userId;
    const review = await Review.findAll({
      where: { reviewId: reviewId },
      limit: 1,
      raw: true,
    });

    const checkList = await ReviewLike.findAll({
      where: { userId: userId },
      raw: true,
    });
    const arr = [];
    checkList.forEach((a) => arr.push(a.reviewId));
    review.forEach((a) => {
      if (arr.includes(a.reviewId)) {
        a.likeBoolean = true;
      }
    });

    if (review.length == 0) {
      return res.status(404).json({ result: "리뷰가 존재하지 않습니다" });
    } else {
      return res.status(200).json({ result: "true", review });
    }
  } catch (error) {
    console.log(`리뷰 상세조회 중 발생한 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "리뷰 상세조회 중 에러가 발생했습니다",
    });
  }
};

//리뷰 3개 조회(최신순)
reviewGetThreeByLatest = async (req, res) => {
  try {
    const { perfumeId } = req.params;
    const userId = res.locals.users.userId;
    const threeReview = await Review.findAll({
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
        "likeBoolean",
      ],
      include: [
        {
          model: User,
          attributes: ["userId", "userNickname", "userImgUrl", "userFrag"],
        },
      ],
    });

    const checkList = await ReviewLike.findAll({
      where: { userId: userId },
    });
    const arr = [];
    checkList.forEach((a) => arr.push(a.reviewId));
    threeReview.forEach((a) => {
      if (arr.includes(a.reviewId)) {
        a.likeBoolean = true;
      }
    });

    if (threeReview.length == 0) {
      return res.status(200).json({
        result: "해당 향수에 대한 리뷰가 존재하지 않습니다",
      });
    } else {
      return res.status(200).json({ result: "true", review: threeReview });
    }
  } catch (error) {
    console.log(`리뷰 3개조회 중 발생한 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "리뷰 3개 조회 중 에러가 발생했습니다",
    });
  }
};

//리뷰3개조회(인기순)
reviewGetThreeByPopular = async (req, res) => {
  try {
    const { perfumeId } = req.params;
    const userId = res.locals.users.userId;
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
        "likeBoolean",
      ],
      include: [
        {
          model: User,
          attributes: ["userId", "userNickname", "userImgUrl", "userFrag"],
        },
      ],
    });

    const checkList = await ReviewLike.findAll({
      where: { userId: userId },
    });
    const arr = [];
    checkList.forEach((a) => arr.push(a.reviewId));
    threeReview.forEach((a) => {
      if (arr.includes(a.reviewId)) {
        a.likeBoolean = true;
      }
    });

    if (threeReview.length == 0) {
      return res.status(200).json({
        result: "해당 향수에 대한 리뷰가 존재하지 않습니다",
      });
    } else {
      return res.status(200).json({ result: "true", review: threeReview });
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
    const userId = res.locals.users.userId;
    const { scrollNum } = req.query;

    let offsetCnt,
      lastPage = false;
    let allReview = await Review.findAll({
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
        "likeBoolean",
      ],
      include: [
        {
          model: User,
          attributes: ["userId", "userNickname", "userImgUrl", "userFrag"],
        },
      ],
    });

    allReviewCnt = allReview.length;
    offsetCnt = scrollNum * 10;
    allReview = allReview.slice(offsetCnt, offsetCnt + 10);
    if (offsetCnt + 10 >= allReviewCnt) {
      lastPage = true;
    }

    const checkList = await ReviewLike.findAll({
      where: { userId: userId },
    });
    const arr = [];
    checkList.forEach((a) => arr.push(a.reviewId));
    allReview.forEach((a) => {
      if (arr.includes(a.reviewId)) {
        a.likeBoolean = true;
      }
    });

    if (allReview.length === 0) {
      return res.status(200).json({
        result: "해당 향수에 대한 리뷰가 존재하지 않습니다",
      });
    } else {
      return res.status(200).json({ result: "true", allReview, lastPage });
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
    const userId = res.locals.users.userId;
    const { scrollNum } = req.query;

    let offsetCnt,
      lastPage = false;

    let allReview = await Review.findAll({
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
        "likeBoolean",
      ],
      include: [
        {
          model: User,
          attributes: ["userId", "userNickname", "userImgUrl", "userFrag"],
        },
      ],
    });

    allReviewCnt = allReview.length;
    offsetCnt = scrollNum * 10;
    allReview = allReview.slice(offsetCnt, offsetCnt + 10);
    if (offsetCnt + 10 >= allReviewCnt) {
      lastPage = true;
    }

    const checkList = await ReviewLike.findAll({
      where: { userId: userId },
    });
    const arr = [];
    checkList.forEach((a) => arr.push(a.reviewId));
    allReview.forEach((a) => {
      if (arr.includes(a.reviewId)) {
        a.likeBoolean = true;
      }
    });

    if (allReview.length == 0) {
      return res.status(200).json({
        result: "해당 향수에 대한 리뷰가 존재하지 않습니다",
      });
    } else {
      return res.status(200).json({ result: "true", allReview, lastPage });
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
    const {
      content,
      starRating,
      indexSexual,
      indexTone,
      indexBody,
      indexDesign,
      seasonSpring,
      seasonSummer,
      seasonFall,
      seasonWinter,
    } = req.body;
    const userId = res.locals.users.userId;
    //본인확인
    const thisReview = await Review.findOne({
      where: { reviewId: reviewId },
      raw: true,
    });
    let perfumeId = thisReview.perfumeId;
    if (!thisReview) {
      return res.status(404).json({ result: "해당 리뷰가 존재하지 않습니다." });
    }
    if (thisReview.userId !== userId) {
      return res.status(401).json({
        result: "본인 리뷰만 수정가능합니다.",
      });
    }
    await Review.update(
      {
        content: content,
        starRating: starRating,
        indexSexual: indexSexual,
        indexTone: indexTone,
        indexBody: indexBody,
        indexDesign: indexDesign,
        seasonSpring: seasonSpring,
        seasonSummer: seasonSummer,
        seasonFall: seasonFall,
        seasonWinter: seasonWinter,
      },
      { where: { reviewId: reviewId, userId: userId } }
    );

    //수정한 내용을 토대로 review table 수정
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
    console.log(ppap);
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
    const userId = res.locals.users.userId;

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
    const userId = res.locals.users.userId;

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
    const userId = res.locals.users.userId;

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

// 테스트
asdtest = async (req, res) => {
  // const { userId } = res.locals.users;
  // const me = await User.findOne({
  //   where: { userId: userId },
  //   raw: true,
  // });
  // console.log(me);
  // if (me.userId !== userId) {
  //   return res.status(401).json({
  //     result: "본인 계정만 탈퇴가능합니다.",
  //   });
  // } else {
  //   let review = await Review.findAll({
  //     where: {
  //       userId: userId,
  //     },
  //     raw: true,
  //   });
  //   console.log(review);
  //   let reviewIds = "";
  //   let perfumeIds = "";
  //   for (let i = 0; i < review.length; i++) {
  //     console.log(review[i].reviewId);
  //     reviewIds += review[i].reviewId + ",";
  //     perfumeIds += review[i].perfumeId + ",";
  //   }
  //   reviewIds = reviewIds.slice(0, -1);
  //   reviewIds = reviewIds.split(",");
  //   perfumeIds = perfumeIds.slice(0, -1);
  //   perfumeIds = perfumeIds.split(",");
  //   console.log(reviewIds);
  //   console.log(perfumeIds);
  //   await Review.destroy({
  //     where: { userId: userId },
  //   });
  //   //향수테이블 reviewCnt 수정
  //   const reviewFind = await Review.count({
  //     where: { perfumeId: { [Op.eq]: perfumeIds } },
  //   });
  //   //4 -> 2로 되겠지?
  //   const ppap = await Review.findAll({
  //     where: { perfumeId: { [Op.eq]: perfumeIds } },
  //     raw: true,
  //   });
  //   console.log(ppap.length); // 아마 2
  //   if (ppap.length == 0) {
  //     await Perfume.update(
  //       {
  //         starRatingAvg: 0,
  //         indexSexualAvg: 0,
  //         indexToneAvg: 0,
  //         indexBodyAvg: 0,
  //         indexDesignAvg: 0,
  //         seasonSpringCnt: 0,
  //         seasonSummerCnt: 0,
  //         seasonFallCnt: 0,
  //         seasonWinterCnt: 0,
  //         reviewCnt: reviewFind,
  //       },
  //       { where: { perfumeId: { [Op.eq]: perfumeIds } } }
  //     );
  //     await ReviewLike.destroy({
  //       where: { userId: userId },
  //     });
  //     res.status(200).json({
  //       result: " 해당 향수 마지막 리뷰 삭제 완료",
  //     });
  //   } else {
  //     const ppapLength = ppap.length;
  //     let sumRating = 0;
  //     let sumSex = 0;
  //     let sumTone = 0;
  //     let sumBody = 0;
  //     let sumDesign = 0;
  //     let sumSpring = 0;
  //     let sumSummer = 0;
  //     let sumFall = 0;
  //     let sumWinter = 0;
  //     for (let i = 0; i < ppap.length; i++) {
  //       sumRating += ppap[i].starRating;
  //       sumSex += ppap[i].indexSexual;
  //       sumTone += ppap[i].indexTone;
  //       sumBody += ppap[i].indexBody;
  //       sumDesign += ppap[i].indexDesign;
  //       sumSpring += ppap[i].seasonSpring;
  //       sumSummer += ppap[i].seasonSummer;
  //       sumFall += ppap[i].seasonFall;
  //       sumWinter += ppap[i].seasonWinter;
  //     }
  //     let avgRating = sumRating / ppapLength;
  //     let avgSex = sumSex / ppapLength;
  //     let avgTone = sumTone / ppapLength;
  //     let avgBody = sumBody / ppapLength;
  //     let avgDesign = sumDesign / ppapLength;
  //     await Perfume.update(
  //       {
  //         starRatingAvg: avgRating,
  //         indexSexualAvg: avgSex,
  //         indexToneAvg: avgTone,
  //         indexBodyAvg: avgBody,
  //         indexDesignAvg: avgDesign,
  //         seasonSpringCnt: sumSpring,
  //         seasonSummerCnt: sumSummer,
  //         seasonFallCnt: sumFall,
  //         seasonWinterCnt: sumWinter,
  //         reviewCnt: reviewFind,
  //       },
  //       { where: { perfumeId: { [Op.eq]: perfumeIds } } }
  //     );
  //     await ReviewLike.destroy({
  //       where: { userId: userId },
  //     });
  //     const me = await User.findOne({
  //       where: { userId: userId },
  //       raw: true,
  //     });
  //     if (me.userId !== userId) {
  //       return res.status(401).json({
  //         result: "본인 계정만 탈퇴가능합니다.",
  //       });
  //     } else {
  //       await User.destroy({
  //         where: {
  //           userId: userId,
  //         },
  //       });
  //     }
  //     res.status(200).json({ result: "리뷰 삭제 완료" });
  //   }
  //   res.status(200).json({ reviewIds, perfumeIds });
  // }
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
  asdtest,
};
