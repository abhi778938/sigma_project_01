const mongoose = require("mongoose");

// Use mongoose.Schema (capital 'S'), not mongoose.sechma
const Schema = mongoose.Schema;

// Define the Review schema properly
const reviewSchema = new Schema({
  comment: {            // field names should be lowercase (good practice)
    type: String,        // use native JS types like String, Number, Date
    required: true       // spelling: "required", not "require"
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now     // note: use Date.now (without parentheses)
  }
});

// Export the model
module.exports = mongoose.model("Review", reviewSchema);
