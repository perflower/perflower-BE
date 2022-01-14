const express = require("express");
const {
    Perfume,
    Brand,
    Fragrance,
    Concentration,
    PerfumeLike,
} = require("../../models");
const { Op } = require("sequelize");

// 전체 향수 목록 제공
const getPerfumes = async (req, res) => {
    try {
        const perfumes = await Perfume.findAll({
            attributes: [
                "perfumeId",
                "fragId",
                "brandId",
                "concentrationId",
                "perfumeName",
                "price",
                "likeCnt",
                "reviewCnt",
                "imgUrl",
            ],
            order: [["likeCnt", "DESC"]],
        });
        res.status(200).send({
            result: true,
            list: perfumes,
        });
    } catch {
        res.status(400).send({
            errorMessage: "전체 향수 데이터를 가져오는데 실패하였습니다.",
        });
    }
};

//향수 필터링 필터 목록 제공
const getFilters = async (req, res) => {
    try {
        const { filterNum } = req.query;
        let filter;
        console.log(filterNum);

        if (filterNum == 0) {
            filter = await Brand.findAll({
                attributes: ["brandId", "brandName"],
            });
        }
        if (filterNum == 1) {
            filter = await Fragrance.findAll({
                attributes: ["fragId", "fragName"],
            });
        }
        if (filterNum == 2) {
            filter = await Concentration.findAll({
                attributes: ["concentrationId", "concentrationName"],
            });
        }
        res.status(200).send({
            result: true,
            list: filter,
        });
    } catch {
        res.status(400).send({
            errorMessage: "향수 필터 데이터를 가져오는데 실패하였습니다.",
        });
    }
};

//브랜드 필터링된 향수 목록 제공
const getBrandPerfumes = async (req, res) => {
    try {
        const { brandId } = req.params;

        const perfumes = await Perfume.findAll({
            where: {
                brandId: brandId,
            },
            attributes: [
                "perfumeId",
                "fragId",
                "brandId",
                "concentrationId",
                "perfumeName",
                "price",
                "likeCnt",
                "reviewCnt",
                "imgUrl",
            ],
        });
        res.status(200).send({
            result: true,
            list: perfumes,
        });
    } catch {
        res.status(400).send({
            errorMessage: "향수 데이터를 가져오는데 실패하였습니다.",
        });
    }
};

//향 필터링된 향수 목록 제공
const getFragPerfumes = async (req, res) => {
    try {
        const { fragId } = req.params;

        const perfumes = await Perfume.findAll({
            where: {
                fragId: fragId,
            },
            attributes: [
                "perfumeId",
                "fragId",
                "brandId",
                "concentrationId",
                "perfumeName",
                "price",
                "likeCnt",
                "reviewCnt",
                "imgUrl",
            ],
        });
        res.status(200).send({
            result: true,
            list: perfumes,
        });
    } catch {
        res.status(400).send({
            errorMessage: "향수 데이터를 가져오는데 실패하였습니다.",
        });
    }
};

//농도 필터링된 향수 목록 제공
const getConcentPerfumes = async (req, res) => {
    try {
        const { concentrationId } = req.params;

        const perfumes = await Perfume.findAll({
            where: {
                concentrationId: concentrationId,
            },
            attributes: [
                "perfumeId",
                "fragId",
                "brandId",
                "concentrationId",
                "perfumeName",
                "price",
                "likeCnt",
                "reviewCnt",
                "imgUrl",
            ],
        });
        res.status(200).send({
            result: true,
            list: perfumes,
        });
    } catch {
        res.status(400).send({
            errorMessage: "향수 데이터를 가져오는데 실패하였습니다.",
        });
    }
};

//가격 필터링된 향수 목록 제공
const getPricePerfumes = async (req, res) => {
    try {
        const { priceRange } = req.query;
        const price = priceRange.split("~");

        console.log(price);

        const perfumes = await Perfume.findAll({
            where: {
                [Op.and]: [
                    { price: { [Op.gte]: price[0] } },
                    { price: { [Op.lte]: price[1] } },
                ],
            },
            attributes: [
                "perfumeId",
                "fragId",
                "brandId",
                "concentrationId",
                "perfumeName",
                "price",
                "likeCnt",
                "reviewCnt",
                "imgUrl",
            ],
        });
        res.status(200).send({
            result: true,
            list: perfumes,
        });
    } catch {
        res.status(400).send({
            errorMessage: "향수 데이터를 가져오는데 실패하였습니다.",
        });
    }
};

//향수 상세정보 제공
const getPerfumeDetail = async (req, res) => {
    try {
        const { perfumeId } = req.params;

        const perfume = await Perfume.findAll({
            where: { perfumeId: perfumeId },
        });
        res.status(200).send({
            result: true,
            constent: perfume,
        });
    } catch {
        res.status(400).send({
            errorMessage: "향수 상세데이터를 가져오는데 실패하였습니다.",
        });
    }
};

//향수 좋아요 & 좋아요 취소
const perfumeLike = async (req, res) => {
    const { perfumeId } = req.params;
    const userId = res.locals.users;

    try {
        const likeList = await PerfumeLike.findOne({ perfumeId });
        // const check = perfume.likePerson.filter((id) => id === userId);
        console.log(likeList);
        res.status(200).json({
            result: true,
            list: likeList,
        });

        // if (check[0]) {
        //     const change = perfume.likePerson.filter((id) => id !== userId);
        //     perfume.likePerson = change;
        //     perfume.likeCnt = perfume.likePerson.length;
        //     await perfume.save();
        //     return res.send("좋아요 취소");
        // }
        // perfume.likePerson.push(userId);
        // perfume.likeCnt = perfume.likePerson.length;
        // await post.save();
        // return res.send("좋아요 추가");
    } catch {
        res.status(400).send({
            errorMessage: "좋아요 오류 발생",
        });
    }
};

module.exports = {
    getPerfumes,
    getFilters,
    getBrandPerfumes,
    getFragPerfumes,
    getConcentPerfumes,
    getPricePerfumes,
    getPerfumeDetail,
    perfumeLike,
};
