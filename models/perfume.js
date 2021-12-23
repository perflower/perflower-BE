const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose); // postId sequence 처리

const perfumeSchema = new mongoose.Schema({});

postSchema.plugin(AutoIncrement, { inc_field: "perfumeId" });

module.exports = mongoose.model("Perfume", perfumeSchema);
