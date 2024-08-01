import mongoose from "mongoose";
async function connectToDb()
{
try
{
return await mongoose.connect("mongodb+srv://EngAhmedHesham:ahmed12345@onlineteachingcenter.7g1vkkj.mongodb.net/?retryWrites=true&w=majority&appName=onlineTeachingCenter").then((res)=>console.log("the db is connected sucessfully")).catch(err=>console.log("the db have errro in connection",err));
}
catch(err)
{
    console.log(err);
}
}
export default connectToDb;