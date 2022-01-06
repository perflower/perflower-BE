const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./config");
const { sequelize } = require("./models");

const corsOptions = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Request-Method": "POST, GET, DELETE, PATCH, PUT",
    "Access-Control-Request-Headers": "X-Custom-Header",
    credentials: true,
};
app.use(cors());

sequelize
    .sync({ force: false })
    .then(() => {
        console.log("데이터베이스 연결 성공");
    })
    .catch((err) => {
        console.error(err);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const index = require("./api/routes");
app.use("/api", index);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
    res.status(err.status || 500);
    // res.render("error");
});

app.listen(config.port, () => {
    console.log(`listening at http://localhost:${config.port}`);
});
