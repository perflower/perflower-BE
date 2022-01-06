const express = require("express");
const { Perfume } = require("../../models");
const { Brand } = require("../../models");
const { Concentration } = require("../../models");
const { Fragrance } = require("../../models");
const byBrandFilePath = "./perfumesByBrand.cvs";
const byConcentFilePath = "./perfumesByConcent.cvs";
const byFragFilePath = "./perfumesByFrag.cvs";
const csv = require("csvtojson");

//빈 배열 생성
let perfumesByBrand = [],
    perfumesByConcent = [],
    perfumesByFrag = [];

//브랜드별 향수 배열 생성
const getPerfumesByBrand = csv()
    .fromFile(byBrandFilePath)
    .then((jsonObj) => {
        jsonObj.forEach((a) => perfumesByBrand.push(a));
    });

//농도별 향수 배열 생성
const getPerfumesByConcent = csv()
    .fromFile(byConcentFilePath)
    .then((jsonObj) => {
        jsonObj.forEach((a) => perfumesByConcent.push(a));
    });

//향별 향수 배열 생성
const getPerfumesByFrag = csv()
    .fromFile(byFragFilePath)
    .then((jsonObj) => {
        jsonObj.forEach((a) => perfumesByFrag.push(a));
    });

async function getPerfumes() {
    await getPerfumesByBrand;
    await getPerfumesByConcent;
    await getPerfumesByFrag;
}

/*
<<향수DB의 카테고리(브랜드, 농도, 향 => FK)에 PK 값 집어넣는 전체적인 흐름>>
1. perfumesByBrand(브랜드별 향수 목록)랑 brands DB(DB에 있는 브랜드 목록)의 brandName을 대조해서
   perfumesByBrand(브랜드별 향수 목록에 brandId를 추가한다.
2. perfumes DB(DB에 있는 향수 목록)랑 perfumesByBrand(브랜드별 향수 목록)를 대조해서
   perfumeName이 같으면 perfumesByBrand(브랜드별 향수 목록)의 brandID를 perfumes DB(DB에 있는 향수 목록)에 추가한다.
   */

//<코드 작성 중 의문점>
//쿼리를 실행한 후에 왜 forEach에서 벗어나질 못하는 걸까?
//그것 때문에 뎁스가 너무 깊어졌다...
//-> forEach 대신 for문을 한 번 써서 나중에 시도해보자..
//이유도 알아보자

//카테고리별 향수 배열 생성하기
getPerfumes().then(async () => {
    let brandArr = [];
    let concentArr = [];
    let fragArr = [];
    let num = 0;

    //브랜드별 향수 배열 순회
    perfumesByBrand.forEach(async (a) => {
        //브랜드별 향수의 브랜드와 DB내 brand table의 브랜드를 비교한다.
        //브랜드가 동일하면 brandID를 브랜드별 향수 속성에 추가.
        const brand = await Brand.findOne({
            where: {
                brandName: a.brandName,
            },
        });

        //brand table의 brandId값 추출
        const brandId = brand.dataValues.brandId;

        //브랜드별 향수에 brandId 속성 추가
        a.brandId = brandId;
        num = num + 1;
        console.log("x번째 향수 : ", num);
        console.log("brandId : ", brandId);

        //빈 배열에 brandId 속성이 추가된 브랜브별 향수 추가
        brandArr.push(a);

        //브랜드별 향수 배열 순회 종료 시
        if (brandArr.length == perfumesByBrand.length) {
            num = 0;

            //brandId가 추가된 향수 배열 순회
            brandArr.forEach(async (a) => {
                //brandId가 추가된 향수와 같은 이름의 향수에 brandId 입력
                await Perfume.update(
                    {
                        brandId: a.brandId,
                    },
                    {
                        where: { perfumeName: a.perfumeName },
                    }
                );
                num = num + 1;
                console.log("x번째 향수 : ", num);

                //=======마지막 배열 순회 시=========
                if (num == brandArr.length) {
                    num = 0;

                    //------------농도별 향수 작업 시작-------------
                    perfumesByConcent.forEach(async (a) => {
                        const concent = await Concentration.findOne({
                            where: {
                                concentrationName: a.concentrationName,
                            },
                        });
                        const concentrationId =
                            concent.dataValues.concentrationId;
                        a.concentrationId = concentrationId;
                        concentArr.push(a);
                        if (concentArr.length == perfumesByConcent.length) {
                            concentArr.forEach(async (a) => {
                                await Perfume.update(
                                    {
                                        concentrationId: a.concentrationId,
                                    },
                                    {
                                        where: { perfumeName: a.perfumeName },
                                    }
                                );
                                num = num + 1;
                                console.log("x번째 향수 : ", num);

                                //=======마지막 배열 순회 시=======
                                if (num == concentArr.length) {
                                    num = 0;

                                    //------------향별 향수 작업 시작------------
                                    perfumesByFrag.forEach(async (a) => {
                                        const frag = await Fragrance.findOne({
                                            where: {
                                                fragName: a.fragranceName,
                                            },
                                        });
                                        const fragId = frag.dataValues.fragId;
                                        a.fragId = fragId;
                                        fragArr.push(a);
                                        if (
                                            fragArr.length ==
                                            perfumesByFrag.length
                                        ) {
                                            fragArr.forEach(async (a) => {
                                                await Perfume.update(
                                                    {
                                                        fragId: a.fragId,
                                                    },
                                                    {
                                                        where: {
                                                            perfumeName:
                                                                a.perfumeName,
                                                        },
                                                    }
                                                );
                                                num = num + 1;
                                                console.log(
                                                    "x번째 향수 : ",
                                                    num
                                                );
                                                //=======마지막 배열 순회 시=======
                                                if (num == fragArr.length) {
                                                    //concentrationId가 존재하지 않는 향수는 제거
                                                    await Perfume.destroy({
                                                        where: {
                                                            concentrationId:
                                                                null,
                                                        },
                                                    });
                                                    console.log("DB 입력 완료");
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});
