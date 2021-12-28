const mongoose = require("mongoose");
// const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/scregistration", {

    // these are no longer supported in mongoose 6
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
    // useCreateIndex:true
}).then( () => {
    console.log(`connection successful`);
}).catch((e)=>{
    console.log(`No connection`);
})