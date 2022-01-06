const perfumeBasic = async () => {
    const { perfumeBasic } = require("./perfumeBasic/perfumeBasic");
};
const fragrance = async () => require("./fragrance/fragrance");
const brand = async () => require("./brand/brand");
const concentration = async () => require("./concentration/concentration");
const getPerfumes = async () => require("./relation/relation");

(async function () {
    await getPerfumes();
    await perfumeBasic();
    await concentration();
    await fragrance();
    await brand();
    console.log(perfumesByFrag);
})();

// module.exports = {
//     perfumeBasic,
//     fragrance,
//     brand,
//     concentration,
// };
