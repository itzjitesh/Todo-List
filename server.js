const app = require("./index");
const logger = require("./logger");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path: "./config.env"});

const db = process.env.MONGO_DB;
const port = process.env.PORT || 3000;

// mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});
mongoose.set('strictQuery', false);
mongoose.connect(db)
    .then(()=>{
        logger.log("info", "connected to mongodb...");
        // console.log("running");
        app.listen(port, ()=>{
            logger.log("info", `server is running at ${port}`);
        });
    })
    .catch(err=>{
        logger.log("error", err);
});

