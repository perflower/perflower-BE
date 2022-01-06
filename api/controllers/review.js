const { Review, User } = require("../../models");
const { Op } = require("sequelize");
const { findAndCountAll } = require("../../models/user");

//리뷰등록 > trycatch 로 수정하기
reviewPost = async (req, res) => {
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
        season,
        userId,
    } = req.body;
    // const { userId } = res.locals.users;
    const reviewCntAllb = await Review.count({});
    console.log(reviewCntAllb);
    const allReview = await Review.create({
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
        season: season,
        userId: userId,
    });
    const reviewCntAlla = await Review.count({});
    console.log(reviewCntAlla);
    res.status(200).json({ result: "true", allReview });
};

//리뷰3개조회(최신순) , 인기순 추가하기
reviewGetThree = async (req, res) => {
    const { perfumeId } = req.params;

    const threeReview = await Review.findAll({
        // where: { perfumeId: perfumeId }, 퍼퓸이랑 잇고나서 한다.
        // where: { perfumeId: { [Op.eq]: perfumeId } },
        offset: 0,
        limit: 3,
        order: [["reviewId", "DESC"]], //차순 asc = 오름차순, desc = 내림차순
    });
    return res.status(200).json({ result: "true", threeReview });
};

//리뷰전체조회(최신순), 인기순 추가하기
reviewGetAll = async (req, res) => {
    const { perfumeId } = req.params;

    const allReview = await Review.findAll({
        // where: { perfumeId: perfumeId }, 퍼퓸이랑 잇고나서 한다.
        order: [["reviewId", "DESC"]],
        include: [
            {
                model: User,
                attributes: ["userId", "userNickname"],
            },
            {
                model: User,
                attributes: ["userId", "userNickname"],
                as: "Liker",
            },
        ],
    });
    const reviewCntAll = await Review.count({});
    console.log(reviewCntAll);
    return res.status(200).json({ result: "true", allReview, reviewCntAll });
};

//리뷰수정
reviewUpdate = async (req, res) => {
    const { reviewId } = req.params;
    const { content, userId } = req.body;
    // const userId = res.locals.userId;

    //본인확인
    const test = await Review.findOne({
        where: { reviewId: reviewId },
    });
    console.log(test);
    const testId = test.dataValues.userId;
    console.log(reviewId);
    console.log(testId);
    console.log(userId);
    if (testId !== userId) {
        return res.status(400).json({
            errorMessage: "본인 댓글만 수정가능합니다.",
        });
    }

    try {
        await Review.update(
            { content: content },
            { where: { userId: { [Op.eq]: userId }, reviewId: reviewId } }
        );
        return res.status(200).json({ result: "true" });
    } catch (error) {
        console.error(error);
        next(err);
    }
};

//리뷰삭제
reviewDelete = async (req, res) => {
    const { reviewId } = req.params;
    const { userId } = req.body;
    // const userId = res.locals.userId;

    //본인확인
    const deltest = await Review.findOne({
        where: { reviewId: reviewId },
    });

    const testId = deltest._previousDataValues.userId;
    console.log(testId);
    if (testId !== userId) {
        return res.status(400).json({
            errorMessage: "본인 댓글만 삭제가능합니다.",
        });
    }
    try {
        const result = await Review.destroy({
            where: { userId: userId, reviewId: reviewId },
        });
        res.json({ result: "true" });
    } catch (error) {
        console.error(error);
        next(err);
    }
};

//리뷰좋아요
reviewLike = async (req, res) => {
    const { reviewId } = req.params;
    const { userId } = req.body;
    const review = await Review.findOne({ where: { reviewId: reviewId } });
    await review.addLiker(userId);
    // const aareviewLikeCnt = Review.RevieLikes.count({
    //     where: { reviewId: reviewId },
    // });
    // console.log(aareviewLikeCnt);
    res.send("좋아요 완료");
};

//리뷰좋아요취소
reviewLikeDelete = async (req, res) => {
    const { reviewId } = req.params;
    const { userId } = req.body;
    const review = await Review.findOne({ where: { reviewId: reviewId } });
    await review.removeLiker(userId);
    res.send("좋아요 삭제완료");
};

//include 테스트
test = async (req, res) => {
    const user = await User.findOne({
        include: [
            {
                model: Review,
                //where : {perfumeId : req.params.perfumeId};
                offset: 0,
                limit: 3,
                order: [["reviewId", "DESC"]],
                attributes: ["content", "starRating"],
            },
        ],
    });
    console.log(user);
    res.json({ user });
};
module.exports = {
    reviewPost: reviewPost,
    reviewGetThree: reviewGetThree,
    reviewGetAll: reviewGetAll,
    reviewUpdate: reviewUpdate,
    reviewDelete: reviewDelete,
    reviewLike: reviewLike,
    reviewLikeDelete: reviewLikeDelete,
    test,
};
