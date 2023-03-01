//import mongodb library
const mongoose=require("mongoose")

//mongodb connect
const db=()=>{
mongoose.connect(process.env.DATABASE_URI,{
    useUnifiedTopology:true,
    useNewUrlParser:true
})
.then(()=>
    console.log("mongo connection successful"))
.catch((err)=>
    console.log("mongo connection failed",err))
// mongoose.connection.on("connected",()=>{console.log("mongodb connection successful")})
// mongoose.connection.on("error",()=>{console.log("mongodb connection unsuccessful")})
}



module.exports=db;