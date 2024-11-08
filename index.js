import express, { urlencoded } from 'express';
import cors from 'cors';
import connectToDb from './db/connection.js';
import empRouter from './src/modules/employees/employees.routes.js';
import schedule from 'node-schedule';
import employeeModel from './db/models/employees/meployees.model.js';
import sendingEmail from './src/utils/sendEmail.js';
import categoryRouter from './src/modules/categories/catgeory.routes.js';
import calculateTotalTime from './src/utils/fucntion.time.js';
import userRouter from './src/modules/users/users.routes.js';
import  joi from 'joi';
const app=express();
app.use(express.json());
app.use(cors());
//connection to the db:
await connectToDb();
// api's of the models:
app.use("/employees",empRouter);
// catgeor routes:
app.use("/categories",categoryRouter);
// users routes:
app.use("/users",userRouter);


// not found page api:
app.all("*",(req,res,next)=>{
    return res.json({
        success:false,
        message:"the api is not found  please revise  the api initilization",
    })
});

// global error handler:
app.use((err,req,res,next)=>{
    return res.json({
        success:false,
        message:err.message,
        stack:err.stack,
    })
});

// schdeduling job:
schedule.scheduleJob("0 0 12 * * 5",async (req,res,next)=>
{
try
{
// get all the emails that not activate yet (schedule job);
const allUsers=await employeeModel.find({isActivated:false});
for(let i=0;i<allUsers.length;i++)
{
    const {email,emailCode,name}=allUsers[i];
    const sendingEmailOne=await sendingEmail({to:email,subject:"reminding for Activate your email(teachingOnlineCenter)",html:`  <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; background-color: #ffffff;">
                    <tr>
                        <td align="center" bgcolor="#ff9800" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                            Reminder to Activate Your Account
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                        <b>Hello, ${name}!</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                        We noticed that you haven't activated your account for Teaching Online Center yet. Please use the code below to activate your account and start using our services.
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #4CAF50; color: white; padding: 15px; font-size: 20px; font-weight: bolder; border-radius: 5px;">
                                            ${emailCode}
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
                        <td bgcolor="#ff9800" style="padding: 30px 30px 30px 30px;">
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
    if(!sendingEmailOne)
    {
        console.log("the email is not valid or the internet connection is not stable")
    }
}
}
catch(err)
{
    console.log(`this an error in the schedule job ${err}`);
}
})
// connect to the server port:
app.listen(3000,()=>{console.log("the server is conncted sucessfully on the port ",3000)});

