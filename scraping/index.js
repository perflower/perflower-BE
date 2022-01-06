const perfumeBasic = async () => require("./perfumeBasic/perfumeBasic");
const fragrance = async () => require("./fragrance/fragrance");
const brand = async () => require("./brand/brand");
const concentration = async () => require("./concentration/concentration");

(async function () {
    await perfumeBasic();
    await concentration();
    await fragrance();
    await brand();
})();

// module.exports = {
//     perfumeBasic,
//     fragrance,
//     brand,
//     concentration,
// };
