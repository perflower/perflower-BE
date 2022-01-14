const { Review, Perfume } = require("../../models");
const { Op } = require("sequelize");

//커뮤니티 이번주 HOT
communityPerfume = async (req, res) => {};

//커뮤니티 실시간 리뷰달린 향수
communityReview = async (req, res) => {};

module.exports = {
    communityPerfume,
    communityReview,
};
