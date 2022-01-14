const { Review, User, ReviewLike } = require("../../models");
const { Op } = require("sequelize");
const { findAndCountAll } = require("../../models/user");

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
            season,
            userId,
        } = req.body;
        // const { userId } = res.locals.users;
        const reviewCntAllb = await Review.count({});
        console.log(reviewCntAllb);
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
            season: season,
            userId: userId,
        });
        const reviewCntAll = await Review.count({});
        console.log(reviewCntAll);
        res.status(200).json({ result: "true", thisReview, reviewCntAll });
    } catch (error) {
        console.log(`리뷰 등록 중 발생한 에러: ${error}`);
        return res.status(500).send({
            success: false,
            msg: "리뷰 등록 중 에러가 발생했습니다",
        });
    }
};

//리뷰3개조회(최신순) , 인기순 추가하기
reviewGetThreeByLatest = async (req, res) => {
    try {
        const { perfumeId } = req.params;
        const threeReview = await Review.findAll({
            where: { perfumeId: perfumeId },
            offset: 0,
            limit: 3,
            order: [["reviewId", "DESC"]], //차순 asc = 오름차순, desc = 내림차순
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

//리뷰전체조회(최신순), 인기순 추가하기
reviewGetAllByLatest = async (req, res) => {
    try {
        const { perfumeId } = req.params;
        /*
        해당 향수의 리뷰id들을 찾고 그 리뷰들에 대한 정보를 
        향수 줄때 같이 준다.
        */
        const thisPerfumeReviewId = await Review.findAll({
            where: { perfumeId },
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
            order: [["reviewId", "DESC"]],
            attributes: ["reviewId", "userId", "content", "starRating"],
            // raw : true,
            include: [
                // 나중에 page offset 설정( 아마 10 ?)
                {
                    model: User,
                    where: { userId: { [Op.or]: [qqqqq] } },
                    attributes: ["userNickname", "userFrag"],
                },
                {
                    model: ReviewLike,
                    where: { reviewId: { [Op.or]: [aaaaa] } },
                },
            ],
        });

        const reviewCntAll = await Review.count({
            where: { perfumeId: perfumeId },
        });
        console.log(`reviewCntAll : ${reviewCntAll}`);
        if (allReview.length !== 0) {
            return res
                .status(200)
                .json({ result: "true", allReview, reviewCntAll });
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
        const findReview = await Review.findOne({
            where: { reviewId: reviewId },
        });
        if (!findReview) {
            return res
                .status(404)
                .send({ result: "해당 리뷰이 존재하지 않습니다." });
        }
        const thisReviewId = findReview._previousDataValues.userId;
        console.log(findReview);
        // console.log(findReview._previousDataValues);
        if (thisReviewId !== userId) {
            return res.status(401).json({
                errorMessage: "본인 리뷰만 수정가능합니다.",
            });
        }
        await Review.update(
            { content: content },
            { where: { reviewId: reviewId, userId: thisReviewId } }
        );
        console.log(updatedReview);
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
        });
        console.log(delReview);
        if (!delReview) {
            return res
                .status(404)
                .send({ result: "해당 리뷰이 존재하지 않습니다." });
        }
        const delUser = delReview._previousDataValues.userId;
        console.log(delUser);
        if (delUser !== userId) {
            return res.status(401).json({
                result: "본인 리뷰만 삭제가능합니다.",
            });
        }
        await Review.destroy({
            where: { reviewId: reviewId, userId: delUser },
        });
        res.status(200).json({ result: "리뷰 삭제 완료" });
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
        const { reviewId } = req.params;
        const { userId } = req.body;
        // const userId = res.locals.userId;
        const reviewLikeCheck = await ReviewLike.findOne({
            where: { reviewId, userId },
        });
        console.log(reviewLikeCheck);
        if (reviewLikeCheck) {
            return res.status(400).json({ result: "잘못된 요청입니다." });
        } else {
            await ReviewLike.create({ reviewId, userId });
            const thisReviewLikeCnt = await ReviewLike.count({
                where: { reviewId: reviewId },
            });
            console.log(
                `지금 보는 ${reviewId}의 리뷰좋아요갯수는 ${thisReviewLikeCnt}개`
            );
            await Review.update(
                { reviewLikeCnt: thisReviewLikeCnt },
                { where: { reviewId: reviewId } }
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
        const { reviewId } = req.params;
        const { userId } = req.body;
        // const userId = res.locals.userId;
        const review = await ReviewLike.findOne({
            where: { reviewId, userId },
        });
        if (review.length == 0) {
            return res.status(400).json({ result: "잘못된 요청입니다." });
        } else {
            await ReviewLike.destroy({ where: { reviewId, userId } });
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
            {
                model: ReviewLike,
            },
        ],
    });
    console.log(user);
    res.json({ user });
};
module.exports = {
    reviewPost,
    reviewGetThreeByLatest,
    reviewGetAllByLatest,
    reviewUpdate,
    reviewDelete,
    reviewLike,
    reviewLikeDelete,
    test,
};
