const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose); // postId sequence 처리

const userSchema = new mongoose.Schema({});

postSchema.plugin(AutoIncrement, { inc_field: "userId" });

module.exports = mongoose.model("User", userSchema);
