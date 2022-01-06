const express = require("express");
const router = express.Router();

router.route("/get").get(async (req, res) => {
    res.send("가랏");
});

module.exports = router;
