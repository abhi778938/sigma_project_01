const express = require('express');
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate")
const path = require("path")
// const listing = require("./models/listing.js");
const methodOverride = require("method-override");
const { log } = require('console');
const Listing = require('./models/listing.js');
const wrapAsync =require("./utili/asyncWrap.js")
const expressError =require("./utili/expressError.js")
const {Listingschema, ListingSchema}=require("./validation.js")
const Review= require("./models/revie.js")
const app = express();
app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"view"))
app.use(express.urlencoded({ extended: true }));
 app.engine('ejs', ejsMate);
app.use(methodOverride("_method")); 
app.use(express.static(path.join(__dirname,"/public")));

main().then(() => {
    console.log("MongoDB connected");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/majorpro', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}


app.get("/", (req, res) => {
  res.render("listing/home.ejs")
});


const SchemaValidate=(req,res,next)=>{
 const {err}=ListingSchema.validate(req.body)
console.log(err);
if(err){
  let errmsg= err.map(()=>err.details).join(",")
    throw new expressError(400,errmsg)
  }
  else
{
  next()
}

}
app.get("/listing",wrapAsync(async(req,res)=>{
  const allListing= await Listing.find({})
  res.render("listing/index.ejs",{allListing})
}))
app.get("/listing/new",(req,res)=>{
res.render("listing/new.ejs")
})
// show route
app.get("/listing/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  const listing= await Listing.findById(id).populate("reviews")
  res.render("listing/show.ejs",{listing})
}))

app.post("/listing",SchemaValidate,wrapAsync(async(req,res)=>{
 
  const newListing= new Listing(req.body.Listing)
  
await newListing.save()
console.log(newListing);
res.redirect("/listing")


}))

// edit  route
app.get("/listing/:id/edit",SchemaValidate,wrapAsync(async(req,res)=>{
   let {id}=req.params;
  const listing= await Listing.findById(id)
  res.render("listing/edit.ejs",{listing})
}))
// update route
app.put("/listing/:id",SchemaValidate,wrapAsync (async (req, res) => {
  
    let { id } = req.params;      
    id = id.trim();                

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { ...req.body.Listing },     
      
    );
    if (!updatedListing) {
      return res.status(404).send("Listing not found");
    }

    res.redirect("/listing");
  
}));
// DELETE ROUTE

app.delete("/listing/:id",wrapAsync(async(req,res)=>{
const {id}=req.params;
let deleteListing = await Listing.findByIdAndDelete(id);
console.log(deleteListing);
res.redirect("/listing");
}));

// review route 
app.post("/listing/:id/reviews",wrapAsync(async(req,res)=>{
const listing= await Listing.findById(req.params.id);
const newRev= new Review(req.body.review);
listing.reviews.push(newRev)
await newRev.save();
await listing.save();
console.log("raeview saved");

res.redirect(`/listing/${listing._id}`)

// res.send("new review added")
}))

app.delete("/listing/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
  let {id,reviewId}=req.params
  
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
  await Review.findByIdAndDelete(reviewId)
  res.redirect(`/listing/${id}`)
}))

// app.get("/error-test", wrapAsync(async (req, res) => {
//   throw new Error("Manual test error!");
// }));

app.use((req,res,next)=>{
next ( new expressError(404,"page not found"))
})

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Invalid server error" } = err;
  res.status(statusCode).render("alert.ejs",{message})
});


app.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
});