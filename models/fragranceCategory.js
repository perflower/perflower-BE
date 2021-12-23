const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose); // postId sequence 처리

const fragranceSchema = new mongoose.Schema({});

postSchema.plugin(AutoIncrement, { inc_field: "fragranceCategoryId" });

module.exports = mongoose.model("Fragrance", fragranceSchema);
