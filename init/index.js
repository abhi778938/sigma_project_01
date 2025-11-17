const mongoose=require("mongoose");
const initData= require("./data.js")
const listing = require("../models/listing.js");


main().then(() => {
    console.log("MongoDB connected");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/majorpro', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

const initDB= async (req,res) => {
    await listing.deleteMany({});
    await listing.insertMany(initData.data)
    console.log("data soccessfully insert");
    
    
}

initDB()