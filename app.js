const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./config");
const { sequelize } = require("./models");
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const axios = require("axios");
const nunjucks = require("nunjucks");
const qs = require("qs");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
dotenv.config();

const passportConfig = require("./api/passport");

// const corsOptions = {
//   "Access-Control-Allow-Origin": "https://perf",
//   "Access-Control-Request-Method": "POST, GET, DELETE, PATCH, PUT",
//   "Access-Control-Request-Headers": "X-Custom-Header",
//   credentials: true,
// };
app.use(
  cors({
    origin: ["https://perflower.co.kr", "http://localhost:3000"],
    credentials: true,
  })
);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });
passportConfig(); // 패스포트 설정

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const index = require("./api/routes");
app.use("/api", index);

app.get("/kakao", (req, res, next) => {
  res.render("kakaologin");
});

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/image.html");
});
app.listen(config.port, () => {
  console.log(`listening at http://localhost:${config.port}`);
});

module.exports = app;
