import cloudinary from "../../utils/cloudinary.config.js";
import { nanoid } from "nanoid";
import bcryptjs from 'bcryptjs';
import sendingEmail from "../../utils/sendEmail.js";
import employeeModel from "../../../db/models/employees/meployees.model.js";
export const addRequet=async (req,res,next)=>
{
    try
    {
        // get the data:
        const data=req.body;
        console.log(req.files);
        // check on the profile picture and resume:
        if(!req.files||req.files.length==0)
        {
            return next(new Error("you must uploaded your resume"));
        }
        else
        {
            console.log(req.files);
        }
        if(req.files.length>2)
        {
            return next(new Error("you uploaded more another two files you only can upload two files one for the your resume and  one for the profile picture"));
        }
        const objectPhoto={};
        const objectResume={};
        let ofResumeFlag=false;
        // check on he loop:
        for(let i=0;i<req.files.length;i++)
        {
          if(req.files.length>1)
          {
            if(req.files[0].fieldname==req.files[1].fieldname)
                {
                 return next(new Error("you can't upload two file swith the same fieldName"));
                }
          }
           if(req.files[i].fieldname=="profilePicture")
           {
               // amke the code of profile pic:
               const upladingFilePic=await cloudinary.uploader.upload(req.files[i].path,{folder:`/uploads/teachingOnlineCenter/employees/${data.name}/profilePicture/`});
               objectPhoto.secure_url=upladingFilePic.secure_url;
               objectPhoto.public_id=upladingFilePic.public_id; 
               data.profilePicture=objectPhoto;
           }
           else if(req.files[i].fieldname=="resume")
           {
     // amke the code of profile pic:
     const uploadingFileREsume=await cloudinary.uploader.upload(req.files[i].path,{folder:`/uploads/teachingOnlineCenter/employees/${data.name}/resume/`});
     objectResume.secure_url=uploadingFileREsume.secure_url;
     objectResume.public_id=uploadingFileREsume.public_id; 
     data.profileResume=objectResume;
     ofResumeFlag=true;
           }
           
           else
           {
            continue;
           }
        }
        if(!ofResumeFlag)
        {
            return next(new Error("the resume photo is not uploaded it is required"));
        }
        // amke the pass and send the code:
        const code=nanoid(8);
        data.emailCode=code;
        const sendingEmailOk=await sendingEmail({to:data.email,subject:"onlineTeachingCenter activationAccount",text:"this is your code to activate your account",html:`<table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff;">
                    <tr>
                        <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                            Activate Your Account
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                        <b>Hello, ${data.name}!</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                        Thank you for signing up for Teaching Online Center. Please use the code below to activate your account.
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                            ${code}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 30px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                        If you did not sign up for this account, please ignore this email.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                                        &reg; Teaching Online Center 2024<br/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`});
    if(!sendingEmailOk)
    {
        return next(new Error("the email is not valid or the internet connection is not stable"));
    }
        // make the pass:
        data.password=bcryptjs.hashSync(data.password,8);
        // make the state:
        data.state="notInQueue";
        data.role="instructor";
        await employeeModel.create(data);
    // return the resposne:
    return res.json({success:true,message:'sidned up successfully and your request is maked success you must go to your gmail to active your account'});
    }
    catch(err)
    {
        return next(err);
    }
}
// delet the request:
export const deleteRequet=async (req,res,next )=>
{
    try
    {
       const {_id,email}=req.data;
       const user=await employeeModel.findOne({_id:_id,email});
       if(!user)
       {
        return next(new Error("the user request is not exists"));
       }
       // cehck if the requets is have been seen:
       if(user.revisedBy&&user.state=="accepted")
       {
        return next(new Error("sorry you can't delete the request after it have beeen evaluated or in the accept state if you eant to delet it contact with the specialied Admin accepted"));
       }
       // sdelet the request:
       await user.deleteOne();
       // retru the response:
       return res.json({success:true,message:"your account with the request is deleted sucessfully"});

    }
    catch(err)
    {
        return next(err);
    }
}
//get the instructro request ressult:
export const getInsReqRes=async (req,res,next)=>
{
    try
    {
      // get the user data:
      const {_id}=req.data;
      const user=await employeeModel.findOne({_id});
      if(!user)
      {
        return next(new Error("the request is not exists"));
      }
      if(user.role!="instructor")
      {
        return next(new Error("sorry you are not authorized to get the rsult of request because you are not instructor"));
      }
      // retur the resposne:
      return res.json({success:true,requestData:user});
    }
    catch(err)
    {
        return next(err);
    }
}
// delete the account:
export const deleteAccount=async (req,res,next)=>
{
    try
    {
        const {_id}=req.data;
        // delete the acocunt:
        await employeeModel.deleteOne({_id});
        // retur the resposne:
        return res.json({success:true,message:"the account is deleted sucessfully"});
    }
    catch(err)
    {
        return next(err);
    }
}