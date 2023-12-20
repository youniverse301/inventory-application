const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AlbumStockSchema = new Schema({
  album: { type: Schema.Types.ObjectId, ref: "Album", required: true }, // reference to the associated album
  numInStock: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ["In Stock", "Out of Stock", "Backorder"],
    default: "Out of Stock",
  },
});

// Export model
module.exports = mongoose.model("AlbumStock", AlbumStockSchema);
