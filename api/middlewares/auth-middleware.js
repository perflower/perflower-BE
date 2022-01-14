const jwt = require("jsonwebtoken"); // jsonwebtoken 호출
require("dotenv").config();
const { User } = require("../../models"); // 뒤(경로)로 가서 user 호출 (mysql은 index.js 를 통해 모델 참조해야함)

module.exports = (req, res, next) => {// => 대신 function써도됨

    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(' '); // Bearer와 토큰 값 같이나오니까 공백 기준으로 분리

    console.log("미들웨어 통과")

    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        });
        return;
    }

    try { // 유효한 토큰일 경우
        const { userId } = jwt.verify(tokenValue, process.env.SECRET_KEY);

        User.findByPk(userId).then((user) => { // sequlize 는 기본적으로 promise 반환해서 then 써줌
            res.locals.users = user; // locals에 담음 (이 미들웨어 사용하는 다른데서도 공통적으로 사용 가능)

            next(); // 미들웨어는 반드시 next 호출되어야함. 호출되지 않으면, 예외처리에 걸려서 그 다음 미들웨어까지 연결 안됨
        }); // findOne과 findById 같음 Id는 고유하기 때문에, 여기서 await 사용 못함(async 함수 아님)

    } catch (error) { // 유효한 토큰이 아닐 경우
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        });
        return; // return 해줘야 다음 next() 미들웨어가 호출되지 않음
    }

};
