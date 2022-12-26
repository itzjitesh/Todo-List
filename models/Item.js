const mongoose = require("mongoose");

const itemsSchema = {
    name: String
};
  
const Item = mongoose.model("Item", itemsSchema); 

  
const listSchema = {
    name: String,
    items: [itemsSchema]
};
  
const List = mongoose.model("List", listSchema);

module.exports.Item = Item;
module.exports.List = List;