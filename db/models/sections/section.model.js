import mongoose,{Schema, Types} from "mongoose";
const sectionSchema=new Schema(
{
sectionName:
{
    type:String,
    required:true,
    min:1,
    max:150,
},

sectionDescribtion:
{
    type:String,
    required:true,
    min:1,
    max:250,
},

sectionHours:
{
    type:Number,
    min:1,
    max:1000000,
},

course:
{
    type:Types.ObjectId,
    ref:"course",
    required:true,
},

objectiveFromSection:
{
    type:[{objectiveId:{type:String,min:5,max:10,required:true},objective:{type:String,required:true,min:1,max:150}}],
    default:[],
},
},{timestamps:true,toObject:{virtuals:true},toJSON:{virtuals:true},strictQuery:true});

const sectionModel=mongoose.model("section",sectionSchema);

export default sectionModel;