const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const _ = require("lodash");
const {Item, List} = require("./models/Item");
const logger = require("./logger");
const path = require("path");

dotenv.config({ path: "./config.env"});

app.set('view engine', 'ejs');

app.set("views", path.join(__dirname, "/client/views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const item1 = new Item({
  name: "Click + to add a new item =>"
});

const item2 = new Item({
  name: "<= Click on the checklist to delete"
});

const item3 = new Item({
  name: "add /yourTitlename to base url to make your custom title"
});

const item4 = new Item({
  name: "For Eg. /Tomorrow in base url for making the title Tomorrow"
});

const defaultItems = [item1, item2, item3, item4];

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          logger.error(err);
        } else {
          logger.log("info", "Successfully!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        itemsAdded: foundItems
      });
      }
  });
});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

   List.findOne({name:customListName},function(err, foundList){
     if(!err){
       if(!foundList){
         const list = new List({
           name: customListName,
           items: defaultItems
         });
         list.save();
         res.redirect("/" + customListName);

       }else{
        res.render("list", {listTitle: foundList.name, itemsAdded: foundList.items});
       }
     };
   }); 
});

app.post("/", function(req, res) {
  // console.log(req.body);
  const itemName = req.body.addlist;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(!err){
        logger.log("info","Successfully deleted!");
        res.redirect("/");
      }
    });
  }else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if(!err){ 
      res.redirect("/" + listName);
      }
    });
  }
});

module.exports = app;


