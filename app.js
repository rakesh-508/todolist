//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");  
mongoose.set('strictQuery',true);
const date = require(__dirname + "/date.js");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://20501a0508:994893232@cluster0.ukbdmh6.mongodb.net/todolistDB",{useNewUrlparser:true});
const itemsSchema = new mongoose.Schema({
  name : String,
})
const Item = mongoose.model("Item",itemsSchema);

const item1 =  new  Item({
  name : "welcome to to-do list"
})

const item2 =  new  Item({
  name : "hit the bell icon to add the data"
})
const item3 =  new  Item({
  name : "hit the cheek- box to delete teh item"
})
const defaultItems = [item1,item2,item3];
app.get("/", function(req, res) {
  
  Item.find({},function(err, foundItems){
    if(foundItems.length === 0)
    {
        
      Item.insertMany(defaultItems,function(err)
     {
        if(err)
        {
            console.log(err)
        }
        else{
           console.log("the data has been insertd into the data base");
         }
      })
      res.redirect("/");
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
    
  })

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
   const item = new Item({
    name: itemName
   })
   item.save();
   res.redirect("/")

  
});
app.post("/delete",function(req,res)
{
     const checkedItemId = req.body.checkbox;
     Item.findByIdAndRemove(checkedItemId,function(err)
     {
      if(!err)
      {
      console.log("succesfully deleted the items")
      }
      else{
        console.log(err);
      }
     })
     res.redirect("/");
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000");
});
