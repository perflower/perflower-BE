const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./config");

const corsOptions = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Request-Method": "POST, GET, DELETE, PATCH, PUT",
    "Access-Control-Request-Headers": "X-Custom-Header",
    credentials: true,
};
app.use(cors());

const connect = require("./models");
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const index = require("./api/routes");
app.use("/api", index);

app.listen(config.port, () => {
    console.log(`listening at http://localhost:${config.port}`);
});
