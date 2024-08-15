import { nanoid } from "nanoid";
import cloudinary from "../../utils/cloudinary.config.js";
import courseModel from "../../../db/models/courses/courses.model.js";
import {addAccessBySchema, updateCccesspibeBySchemaDelete, updateCccesspibeBySchemaUpdate} from './coursers.schema.js';
import checkOnCourseUpdateSchema from "../../utils/checkOnCourseUpdate.js";
import categoryModel from "../../../db/models/catgeory/catagory.model.js";
import { json } from "express";
// add course comtroller:
export const addCourse=async (req,res,next)=>
{
try
{
// get the id of the instructor:
const  {_id,name}=req.data;
// egt the data o the course:
let data=req.body;
// make the validation required on the every field:
let uploadingPhotoObject={};
let accesibleByAnyOneObject={};
let objectUrlArray=[];
let arrayObjectOfObjectives=[];
let arrayDescribtionContent=[];
// check first on theprice of the course:
if(data.coursePrice)
{
    // check if the course if the course price is free:
    if(data.coursePrice!="free")
    {
       if(+data.coursePrice!=data.coursePrice||+data.coursePrice==NaN)
       {
        return next(new Error("the cousre price must be between 1 and 100000 or free"));
       }
       if(+data.coursePrice<=0)
       {
        return next(new Error("the cousre price must be between 1 and 100000 or free"))
       }
    }
}
// check on the course hours:
const {courseHours}=data;
if(courseHours)
{
    if(+courseHours!=courseHours||+courseHours==NaN)
    {
        return next(new Error("the cousre hourse must be a number between 1:100000"));
    }
    if(courseHours<=0)
    {
        return next(new Error("the course hours value must be large than 0"));
    }
}
// check on the files:
if(req.files||req.files.length>0)
{
    // check on the files:
    if(req.files.length>1)
    {
        return next(new Error("you only have the access to upload one image for the cover of the course"));
    }
    const uploadingPhoto=await cloudinary.uploader.upload(req.files[0].path,{folder:`/uploads/teachingOnlineCenter/employees/${name}/courses/cover/`});
    uploadingPhotoObject.public_id=uploadingPhoto.public_id;
    uploadingPhotoObject.secure_url=uploadingPhoto.secure_url;
    data.coursePicture=uploadingPhotoObject;
}
//handle the accesble by any one:
let {accesibleByAnyOne}=data;
accesibleByAnyOne=JSON.parse(accesibleByAnyOne);
data.accesibleByAnyOne=JSON.parse(data.accesibleByAnyOne);
console.log(accesibleByAnyOne);
if(accesibleByAnyOne&&accesibleByAnyOne.videoUrl||accesibleByAnyOne&&accesibleByAnyOne.describtion)
{
if(accesibleByAnyOne.videoUrl.length<=0&&accesibleByAnyOne.describtion==""||accesibleByAnyOne.describtion==null)
{
    delete data.accesibleByAnyOne;
}
if(accesibleByAnyOne.describtion.length!=accesibleByAnyOne.videoUrl.length)
    {
      return next(new Error("validation error you must add an describtion for each vidoeUrl"));
    }
// handle the vidoe url and make the code for it:
else
{
    if(accesibleByAnyOne.videoUrl)
        {
            // chekc on the two cases:
            // check on the array and make the things:
            console.log(accesibleByAnyOne.videoUrl[0]);
            if(accesibleByAnyOne.videoUrl.length>0)
            {
                // loop on the array:
                accesibleByAnyOne.videoUrl.forEach((ele)=>
                {
                    const objectUrl={};
                    objectUrl.urlId=nanoid(8);
                    objectUrl.url=ele;
                    objectUrlArray.push(objectUrl);
                });
                data.accesibleByAnyOne.videoUrl=objectUrlArray;
            }
        }
    // check on the describtion:
    if(accesibleByAnyOne.describtion.length>0)
    {
        if(accesibleByAnyOne.describtion.length!=accesibleByAnyOne.videoUrl.length)
            {
              return next(new Error("validation error you must add an describtion for each vidoeUrl"));
            }
        // loop on the array also:
        accesibleByAnyOne.describtion.forEach((ele)=>
        {
            // make the code :
            const objectDescribtion={};
            // add the new object fro each one:
            objectDescribtion.describtionId=nanoid(8);
            objectDescribtion.describtionContent=ele;
            // push on the array:
            arrayDescribtionContent.push(objectDescribtion);
        });
        data.accesibleByAnyOne.describtion=arrayDescribtionContent;
    }
}
}
// check on the whatWillYouLearn:
let {whatWillYouLearn}=data;
whatWillYouLearn=JSON.parse(whatWillYouLearn);
if(!whatWillYouLearn||whatWillYouLearn.length<=0)
{
    return next(new Error("you must add what the objectives of the course"));
}
else
{
    // make the loop on this and make all those:
    whatWillYouLearn.forEach((ele)=>
    {
        const objectObjective={};
        objectObjective.id=nanoid(8);
        objectObjective.objective=ele;
       arrayObjectOfObjectives.push(objectObjective);
    });
    // check on this now:
       data.whatWillYouLearn=arrayObjectOfObjectives;
}
// add the instructor:
data.instructor=_id;
// check on the catgeoiry and subCtgeory:
const {category,subCategory}=req.body;
// chekc on the catgeory and check on the subCatgeory:
if(subCategory&&!category)
{
    return next(new Error("if you are choose a subCatgeory you must select the catgeory of this category also"));
}
if(category)
{
   if(!subCategory)
   {
    return next(new Error("if you send the catgeory of the course you must also add subCategory"));
   }
   // check the catgeory if it exists or not and check on the subCategory:
   let categoryGet=await categoryModel.findOne({_id:category});
   if(!categoryGet)
   {
    return next(new Error("the category is not exists you can add it first or it may be deleted"));
   }
   // check on the subCategoryId:
   let flag=false;
   let subCategoryName="";
   categoryGet.subCategory.forEach((ele)=>
   {
       if(ele.subCategoryId.toString()==subCategory.toString())
       {
        flag=true;
         subCategoryName=ele.subCategoryName;
       }
   });
   if(!flag)
   {
    return next(new Error("this subCategory is not exists on the selected category"));
   }
   // make the object fro the subcatgeory:
   data.subCategory={subCategoryId:subCategory,subCategory:subCategoryName};
}
// make the  dcoument of the cousre now:
await courseModel.create(data);
// retur the resposne:
return res.json({success:true,message:"the course is added sucessfully"});
}
catch(err)
{
    return next(err);
}
}
// update course data:
export const updateSpCourse=async (req,res,next)=>
{
try
{
// egtt he id of the user :
const  {_id,name}=req.data;
// egtt he id of the course:
const {courseId}=req.params;
// check the relationship between the user and between the course:
const course=await courseModel.findOne({_id:courseId});
if(!course)
{
    return next(new Error("the course is not exists check the id it also may be deleted"));
}
if(course.instructor.toString()!=_id.toString())
{
return next(new Error("you not have the authity to update this course because you are not the owner of this"));
}
// check on the inputs fields:
const dataUPdate=req.body;
const flags=req.query;
// check on the photo:
if(req.files&&req.files.length>0)
{
    if(req.files.length>1)
    {
        return next(new Error("you can upload one photo only for the course"));
    }
    else if(req.files.length==1)
    {
        if(course.coursePicture.public_id)
        {
            // update:
            const uploadingPhoto=await cloudinary.uploader.upload(req.files[0].path,{public_id:course.coursePicture.public_id});
            let objectPhoto={};
            objectPhoto.public_id=uploadingPhoto.public_id;
            objectPhoto.secure_url=uploadingPhoto.secure_url;
            data.coursePicture=objectPhoto;
        }
        else
        {
            // add photo:
            const uplaodingPhoto=await cloudinary.uploader.upload(req.files[0].path,{folder:`/uploads/teachingOnlineCenter/employees/${name}/courses/cover/`});
            let objectPhoto={};
            objectPhoto.secure_url=uplaodingPhoto.secure_url;
            objectPhoto.public_id=uplaodingPhoto.public_id;
            data.coursePicture=objectPhoto;
        }
    }
    else
    {
        // check on the photo query:
        const {photoSelection}=flags;
        if(photoSelection=="delete")
        {
          // delett he photo:
          data.coursePicture={secure_url:"https://th.bing.com/th/id/OIP.afNN71LYRc9tIlOvk6EKUwHaE8?w=234&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"};
        }
        else{}
    }
}
// check on the hours:
const {courseHours}=dataUPdate;
if(courseHours)
{
    if(+courseHours!=courseHours||+courseHours==NaN)
    {
        return next(new Error("course hours must be between 1 and 10000 only"));
    }
    if(+courseHours==0)
    {
        return next(new Error("the hours of the course must ne larger than 0"));
    }
}
// check on the price:
const {coursePrice}=dataUPdate;
if(coursePrice)
{
    if(+coursePrice==coursePrice&&+coursePrice!=NaN)
    {
        console.log("yes good");
        if(+coursePrice<0)
        {
            return next(new Error("if you want to enter number for the price of the course it must be largar than 0"))
        }
    }
    else if(coursePrice=="free")
    {
        console.log("yes good")
    }   
    else
    {
        return next(new Error("the price of the course must be between 1:10000 or free only"));
    } 
}
// check on the on the ohter:
let {accesibleByAnyOne}=req.body;

if(accesibleByAnyOne&&Object.keys(accesibleByAnyOne).length>0)
{
    
    let query=req.query.accesibleByAnyOne;
    if(!query)
    {
        return next(new Error("you must send the accesibleByAnyOne in the query when you want to make any modification on the accesibleByAnyOne field"));
    }
    else if(query=="update")
    {
        accesibleByAnyOne=JSON.parse(accesibleByAnyOne);

        if(!course.accesibleByAnyOne)
            {
                return next(new Error("the course not have the field to update it"));
            }
      // make the update algorithm:
      const updateSchemaFunction=checkOnCourseUpdateSchema(updateCccesspibeBySchemaUpdate,accesibleByAnyOne);
      const result=updateSchemaFunction(req,res,next);
      if(result)
      {
       // make the algorithm:
       if((!accesibleByAnyOne.videoUrl||Object.keys(accesibleByAnyOne.videoUrl).length==0)&&(!accesibleByAnyOne.describtion||Object.keys(accesibleByAnyOne.describtion).length==0))
       {
        return next(new Error("the accesibleByAnyOne value must be valid"));
       }
       if(accesibleByAnyOne.videoUrl)
       {
          // make the code on this:
          const {videoUrl}=accesibleByAnyOne;
          // check on the urlId first:
          let flagVideo=false;
          let indexArray="";

          course.accesibleByAnyOne.videoUrl.forEach((ele,index)=>
        {
            if(videoUrl.urlId.toString()==ele.urlId.toString())
            {
                flagVideo=true;
                indexArray=index;
            }
        })
        if(!flagVideo)
        {
            return next(new Error("the id of the url of the video not exists"));
        }
        let arrayNew=[...course.accesibleByAnyOne.videoUrl];
        arrayNew[indexArray]={urlId:videoUrl.urlId,url:videoUrl.url};
        dataUPdate.accesibleByAnyOne={videoUrl:arrayNew};
        dataUPdate.accesibleByAnyOne.describtion=course.accesibleByAnyOne.describtion;
       }
       if(accesibleByAnyOne.describtion)
       {
         // maek the code on this:
         if(Object.keys(accesibleByAnyOne.describtion).length<=0)
         {
            return next(new Error("the describtion fiedls in the accesibleby must have fields"));
         }
         // also make these here:
         // get the describtionId and the describtion content:
         const {describtionId,describtionContent}=accesibleByAnyOne.describtion;
         if(!describtionId)
         {
            return next(new Error("the describtionId must have value"));
         }
         if(!describtionContent)
         {
            return next(new Error("the describtion content must have value also"));
         }
         // get the id:
         let indexDes="";
         let flagIndex=false;
         course.accesibleByAnyOne.describtion.forEach((ele,index)=>
        {
            if(ele.describtionId.toString()==describtionId)
            {
                indexDes=index;
                flagIndex=true;
            }
        });
        if(!flagIndex)
        {
            return next(new Error("the id of the describtion is not exists can't update it"));
        }
        let newArray=[...course.accesibleByAnyOne.describtion];
        newArray[indexDes]={describtionId:describtionId,describtionContent:describtionContent};
        dataUPdate.accesibleByAnyOne.describtion=newArray;
       }
      }
      else
      {
        console.log("there is an error")
      }
    }
    else if(query=="delete")
    {
      // mkae the delete algorithm:
      if(!course.accesibleByAnyOne)
        {
            return next(new Error("the course not have the field to update it"));
        }
        // check on the others:
        // check on the model and check on the every thing:
        let  newVar=req.body.accesibleByAnyOne;
        newVar=JSON.parse(req.body.accesibleByAnyOne);
        // check on it:
        console.log(newVar);
        const resultFunction=checkOnCourseUpdateSchema(updateCccesspibeBySchemaDelete,newVar);
        const resy=resultFunction(req,res,next);
        if(resy)
        {
           // make the algorithm:
           if(Object.keys(newVar).length<=0)
            {
                return next(new Error("if you want to delete any thing from the accesibleBy you kust send the urlId or describtionId"));
            }   
            const {urlId,describtionId}=newVar;
            if(urlId)
            {
            //make the algorithm:
            let indexArray="";
            let flagArray=false;
            course.accesibleByAnyOne.videoUrl.forEach((ele,index)=>
            {
                if(ele.urlId.toString()===urlId.toString())
                {
                    // make the code:
                    indexArray=index;
                    flagArray=true;
                }
            });
            if(!flagArray)
            {
                return next(new Error("the id is not exists"));
            }
            let  arrayNeWWUrl=[...course.accesibleByAnyOne.videoUrl];
            arrayNeWWUrl.splice(indexArray,1);
            let decribtionArra=[...course.accesibleByAnyOne.describtion];
            decribtionArra.splice(indexArray,1);
            dataUPdate.accesibleByAnyOne={videoUrl:arrayNeWWUrl,describtion:decribtionArra};
            }
            else if(describtionId)
            {
            // check and make the code also:
            let indexA=0;
            let indexFllag="";
            console.log(course.accesibleByAnyOne.describtion);
            course.accesibleByAnyOne.describtion.forEach((ele,index)=>
            {
                console.log(ele.describtionId.toString());
                if(ele.describtionId.toString()==newVar.describtionId.toString())
                {
                    indexA=index;
                    indexFllag=true;
                }
            });
            if(!indexFllag)
            {
                return next(new Error("the describtionId is not exists"));
            }
            let arr=[...course.accesibleByAnyOne.describtion];
            arr.splice(indexA,1);
            let arr2=[...course.accesibleByAnyOne.videoUrl];
            arr2.splice(indexA,1);
            dataUPdate.accesibleByAnyOne={videoUrl:arr2,describtion:arr};
            }
            else
            {
                return next(new Error("there is an errror if you want to delete any thing from the accesibleBy you kust send the urlId or describtionId "))
            }
        }
        else
        {
            console.log("there is an error");
        }
    }
    else if(query=="add")
    {
        // make the code and check on this:
        // check on the vaidation:
        let newVar=req.body.accesibleByAnyOne;
        newVar=JSON.parse(newVar);
        const validaton=checkOnCourseUpdateSchema(addAccessBySchema,newVar);
        const get=validaton(req,res,next);
        if(get)
        {
           // checke now on the two:
           const {videoUrl,describtion}=newVar;
           if(videoUrl.length!=describtion.length)
            {
                return next(new Error("you must add a describtion for each video url and opposite"));
            } 
            let arrayVideo=[...course.accesibleByAnyOne.videoUrl];
            let arrayDescribtion=[...course.accesibleByAnyOne.describtion];
           // check on the other:
           for(let i=0;i<videoUrl.length;i++)
           {
            const objectMakeVodeo={};
            const objectMakeDescribtion={}
            objectMakeVodeo.urlId=nanoid(8);
            objectMakeVodeo.url=videoUrl[i];
            arrayVideo.push(objectMakeVodeo);
            objectMakeDescribtion.describtionId=nanoid(8);
            objectMakeDescribtion.describtionContent=describtion[i];
            arrayDescribtion.push(objectMakeDescribtion);
           }
           dataUPdate.accesibleByAnyOne={videoUrl:arrayVideo,describtion:arrayDescribtion};
        }
        else
        {
            console.log("there is an error");
        }
    }    
    else
    {
        return next(new Error("the value of the accesibleByAnyOne on the query must be one of those add/update/delete"));
    } 
}
// check on the subcatgeiry and categiry logic:
const {category,subCategory}=dataUPdate;
let flagDeleteCategory=false;
let flagUpdateCategory=false;
let flagAddCategory=false;
// chekc if he want to delete
if(course.category)
{
    // if he it exists we can delete or the update because it exists:
    const {categoryDelete}=req.query;
    if(categoryDelete=="delete"&&categoryDelete!="")
    {
        // we should make the catgegory and the subCategory undefined:
        dataUPdate.category=undefined;
        dataUPdate.subCategory=undefined;
        flagDeleteCategory=true;
    }
    else
    {
        // check if thwe category field is exists or not:
        if(category)
        {
            // if there are category we will update it:
            var newCategory=await categoryModel.findOne({_id:category});
            if(!newCategory)
            {
                return next(new Error("the category you want to update by is not exists check the id or it may be deleted"));
            }
            dataUPdate.category=category;
            flagUpdateCategory=true;
        }
    }
}
else
{
    // the catgeory field is not exists thne check if the:
    if(category)
    {
        // check on the new category:
        var newCategoryAdding=await categoryModel.findOne({_id:category});
        if(!newCategoryAdding)
        {
            return next(new Error("the category is not exists chekc the id or it may be deleted"));
        }
        dataUPdate.category=category;
        flagAddCategory=true;
    }
}
// we will check o the subCategory:
if(subCategory)
{
    
    if(flagDeleteCategory)
    {
        return next(new Error("you can't add subCategory when you add category"));
    }
   if(!course.subCategory)
   {
       // we will check on the update:
       // check with the new:
       if(flagAddCategory)
       {
        let falgSubAdding=false;
          // check with the new category:
          newCategoryAdding.subCategory.forEach((ele)=>
        {
              if(ele.subCategoryId.toString()==subCategory)
              {
                flagAddCategory=true;
                dataUPdate.subCategory={subCategoryId:subCategory,subCategory:ele.subCategoryName};
              }
        });
        if(!falgSubAdding)
        {
            return next(new Error("you must adding subCategory asigned to this selected category"))
        }
       }
       // check with the old of the category:
   }
   // then check on the updating:now:
   if(course.subCategory)
   {
    // check now with the flag of updating:
    if(flagUpdateCategory)
    {
        let flagUpdateSub=false;
        // compare the new one with the new one of categoey:
        newCategory.subCategory.forEach((ele)=>
        {
            if(ele.subCategoryId.toString()==subCategory.toString())
            {
                flagUpdateSub=true;
                dataUPdate.subCategory={subCategoryId:subCategory,subCategory:ele.subCategoryName};
            }
        });
        if(!flagUpdateSub)
        {
            return next(new Error("the updated subCategory is not refer to the new catgeory check the if of subCategory and try again"));
        }
    }
    else
    {
        // we must check with the old category:
        const getCategory=await categoryModel.findOne({_id:course.category});
        if(!getCategory)
        {
            return next(new Error("the category is not exists"));
        }
        let flagOfNewSubWithOld=false;
        getCategory.subCategory.forEach((ele)=>
        {
          if(ele.subCategoryId.toString()==subCategory)
          {
              flagOfNewSubWithOld=true;
              dataUPdate.subCategory={subCategoryId:subCategory,subCategory:ele.subCategoryName};
          }
        });
        if(!flagOfNewSubWithOld)
        {
            return next(new Error("the new subCategory is not refer to the current category check the category and try again"));
        }
    }
   }
}
else
{
    // there no subCategory check the new category is assign  to the old one of subCategory:
    if(flagUpdateCategory)
    {
        let flag=false;
        newCategory.subCategory.forEach((ele)=>
        {
            if(ele.subCategoryId.toString()==course.subCategory.subCategoryId.toString())
            {
                flag=true;
            }
        });
        if(!flag)
        {
            return next(new Error("the updated category not matched with the subCategory you can solve this by chnging the subCategory also"));
        }
    }
    if(flagAddCategory&&!subCategory)
    {
        return next(new Error("if you want to add the New category you also shiuld add subCategory also and the subCategory should matched with the new Category"));
    }
}
// update:
const newCourse=await courseModel.findOneAndUpdate({_id:courseId},dataUPdate,{new:true});
// return the response with the updted data:
return res.json({success:true,message:"the course is updated sucessfully",course:newCourse});
}
catch(err)
{
    return next(err);
}
}
// delete the course:
export const deleteCourse=async (req,res,next)=>
{
    try
    {
        // egt the id of the ins:
        const {_id}=req.data;
        // egtt te id of the course:
        const {courseId}=req.params;
        // cehck if rhe course is exist :
        const course=await courseModel.findOne({_id:courseId});
        if(!course)
        {
            return next(new Error("the course is not exists checj the id of the course or it may be deleted"));
        }
        if(course.instructor.toString()!=_id.toString())
        {
            return next(new Error("sorry you can't delete this course because you are not the owner of it"));
        }
        await course.deleteOne();
        const deletd=await courseModel.find({instructor:_id}).populate([{path:"instructor"},{path:'category'}]).sort("-createdAt");
        // RETUR THE RESPOSNE:
        return res.json({success:true,message:"the course is deleted sucessfully",courses:deletd});
    }
    catch(err)
    {
        return next(err);
    }
}
// get my courses:
export const getInsCourses=async (req,res,next)=>
{
try
{
   const {_id}=req.data;
   let courses=[];
   // check on if there was an data:
   const data=req.query;
   // check first if the data is empty:
   if(Object.keys(data).keys==0)
   {
    console.log("enter that");
    courses=await courseModel.find({instructor:_id}).populate([{path:"category"}]).sort("-createdAt courseName");
    return res.json({success:true,courses,numberCourses:courses.length})
   }
   const mapObject=new Map(Object.entries(data));
   let flag=false;
   mapObject.forEach((value,key)=>
{
    console.log(value);
    if(value)
    {
        flag=true;
    }
})
   if(flag==false)
   {
    console.log("enter");
    courses=await courseModel.find({instructor:_id}).populate([{path:"category"}]).sort("-createdAt courseName");
    return res.json({success:true,courses,numberCourses:courses.length});
   }
   let objectFilter={instructor:_id};
    if(data.courseName)
        objectFilter.courseName={$regex:data.courseName,$options:"i"};
    if(data.coursePrice)
        objectFilter.coursePrice=data.coursePrice;
    if(data.category)
        objectFilter.category=data.category;
    courses=await courseModel.find(objectFilter).populate([{path:"category"}]).sort("-createdAt courseName");
   //retyrunt he response:
   return res.json({success:true,courses,numberCourses:courses.length});
}
catch(err)
{
    return next(err);
}
}
//get details of sp course:
//////////////////////