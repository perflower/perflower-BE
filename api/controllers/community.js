const { Review, Perfume, User } = require("../../models");
const { Op } = require("sequelize");

//커뮤니티 이번주 HOT
community = async (req, res) => {
  try {
    const hotPopular = await User.findAll({
      order: [["followerCnt", "DESC"]],
      raw: true,
      limit: 5,
      attributes: ["userId", "userNickname", "followerCnt", "userImgUrl"],
    });

    const hotReview = await Review.findAll({
      order: [["reviewLikeCnt", "DESC"]],
      raw: true,
      limit: 5,
      attributes: ["reviewId", "reviewLikeCnt", "userId", "content"],
      include: [
        {
          model: Perfume,
          attributes: ["perfumeId", "imgUrl"],
        },
        {
          model: User,
          attributes: ["userId", "userNickname", "userImgUrl", "userFrag"],
        },
      ],
    });

    res.status(200).json({ result: "true", hotPopular, hotReview });
  } catch (error) {
    console.log(`커뮤니티 페이지 발생한 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "커뮤니티 페이지 에러가 발생했습니다",
    });
  }
};

//커뮤니티 실시간 리뷰달린 향수

module.exports = {
  community,
};
