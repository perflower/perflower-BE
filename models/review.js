const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose); // postId sequence 처리

const reviewSchema = new mongoose.Schema({});

postSchema.plugin(AutoIncrement, { inc_field: "reviewId" });

module.exports = mongoose.model("Review", reviewSchema);
