const RateLimit = require("express-rate-limit");

const apiLimiter = RateLimit({
  windowMs: 1000, // 1초 동안
  max: 15, // 최대 15회
  handler(req, res) {
    //조건을 어겼을 경우
    res.status(this.statusCode).json({
      code: this.statusCode, //기본값 429
      errorMessage: "요청 회수를 초과하였습니다.",
    });
  },
});

module.exports = apiLimiter;
