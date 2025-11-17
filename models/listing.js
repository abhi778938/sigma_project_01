const mongoose = require("mongoose");



const listingsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  image: { filename: { type: String },
    url: { type: String }},
  location: { type: String },
  country: { type: String },
  reviews:
  [
      {
        type:mongoose.Types.ObjectId,
        ref:"Review"
      }
    ]
  
});

const Listing = mongoose.model("Listing", listingsSchema);

module.exports = Listing;
 