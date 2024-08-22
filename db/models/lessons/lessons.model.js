import { required } from "joi";
import mongoose,{Schema, Types} from "mongoose";
const lessonsSchema=new Schema(
{
lessonName:
{
    type:String,
    required:[true,"the lesson name is required"],
    min:2,
    max:300,
},
lessonDescribtion:
{
    type:String,
    required:[true,"the lesson Describtion is required"],
    min:5,
    max:1200,
},
test:
{
    type:Types.ObjectId,
    ref:"test",
},

pdf:
{
    type:
    {
        public_id:{type:String,required:true,},
        secure_url:{type:String,required:true},
    },
    default:null,
    required:false,
},

videoLinks:
{
    type:[{type:{videoUrl:{type:String,required:true,unique:true,min:5,max:150},videoId:{type:String,required:true,unique:true,min:1,max:10}}}],
    default:[],
    required:false,
},

ObjectivesFromLesson:
{
    type:[{objectiveId:{type:String,required:true,min:1,max:10},objective:{type:String,required:true,min:1,max:200}}],
    default:[],
    required:false,
},

section:
{
    type:Types.ObjectId,
    ref:"section",
    required:[true,"the section of lesson is required"],
}
},{timestamps:true,toObject:{virtuals:true},toJSON:{virtuals:true},strictQuery:true});