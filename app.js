//jshint esversion:6

const express    = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");


app = express();

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs" );

// For deprication warning
mongoose.connect("mongodb+srv://admin_gaurav:Test1234@cluster0-4eqq5.mongodb.net/todolistDB",{useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

const itemSchema = new mongoose.Schema({ 
    name : String
});


const Item = mongoose.model("Item",itemSchema );

const item1 = new Item({
    name : "Welcome to your To Do list!"
});

const item2 = new Item({
    name : "Hit the + button to add new task"
});

const item3 = new Item({
    name : "<-- Hit this to delete a task"
});


var arr =[];

app.get("/", function(req, res){
    
    var today = new Date();

    var option = {
        weekday: "long" ,year: "numeric" ,month: "long" ,day: "numeric"  };

    var currentDay     = today.toLocaleDateString("en-US",option);

    Item.find({}, function(err, foundItems){
        if(foundItems.length === 0){
            const defaultItems = [item1, item2, item3] ;
            Item.insertMany(defaultItems, function(err){
                        if(err){
                            console.log(err);
                        }else{
                            console.log("Successfully saves default items to DB");
                            }
            });
            res.redirect("/");
        }else{
            res.render("list", {kindofday :currentDay, listing :foundItems});
        }
    });
});





app.post("/" ,function(req,res){
    var newItem =req.body.newentry;
    const item4 = new Item({
        name : newItem
    });

    item4.save();
    res.redirect("/");
    
 });


app.post("/delete", function(req, res){
    var checkedItemId = req.body.checkbox;
    
    if (!mongoose.Types.ObjectId.isValid(checkedItemId)) {            // to remove object id error
            checkedItemId = checkedItemId.replace(/\s/g, '');
           }

    Item.findByIdAndRemove(checkedItemId, function(err){
        if(!err) {
            console.log("Successully deleted the task");
            res.redirect("/");
        }
    });
});


app.get("/about", function(req, res){
    res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port , function(){
    console.log("The server has Started. ");
});