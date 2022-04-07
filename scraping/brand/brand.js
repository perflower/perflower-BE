const { Brand } = require("../../models");
const byBrandFilePath = "./brand/brand.cvs";
const csv = require("csvtojson");
const { array } = require("../../api/middlewares/upload");

//빈 배열 생성
let perfumesByBrand = [];

//브랜드별 향수 배열 생성
const brand = csv()
  .fromFile(byBrandFilePath)
  .then((jsonObj) => {
    jsonObj.forEach((a) => {
      perfumesByBrand.push({
        brandName: a.brandName,
        engBrandName: a.engBrandName,
      });
    });

    //배열 내 중복값 제거
    //객체 배열은 중복값 제거가 안된다.. 이유는?
    const set = new Set(perfumesByBrand);
    const uniqueArr = [...set];

    //객체 배열 중복값 제거
    //findIndex() 메서드는 주어진 [[ 판별 함수를 만족하는 배열의 첫 번째 요소에 대한 인덱스를 반환 ]]합니다. 만족하는 요소가 없으면 -1을 반환합니다.
    //1. filter로 배열을 순회하며 x번 객체와 x번 객체의 idx를 얻는다.
    //2. findIndex로 배열 내 모든 객체에서 x번 객체와 이름이 동일한 객체 중 "첫 번째 객체의 인덱스"를 반환한다.(첫 번째 객체의 인덱스인게 중복을 잡기 위한 중요 포인트!!)
    //3. 해당 인덱스가 x번 객체의 인덱스와 같으면 x번 개체를 새로운 배열에 포함시킨다.
    const result = perfumesByBrand.filter(
      (item1, idx1) =>
        perfumesByBrand.findIndex(
          (item2, idx2) => item1.brandName == item2.brandName
        ) == idx1
    );

    //객체 배열 중복값 제거 방법 2
    //JSON.stringify로 객체를 JSON 문자열로 변환하면 Set으로 거를 수가 있다.
    console.log(
      [...new Set(perfumesByBrand.map(JSON.stringify))].map(JSON.parse)
    );

    result.forEach((a) =>
      Brand.create({
        brandName: a.brandName,
        engBrandName: a.engBrandName,
      })
    );
  });

module.exports = { brand };
