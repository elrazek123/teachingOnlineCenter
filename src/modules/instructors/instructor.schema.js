import joi from 'joi';

export const addRequestSchema=joi.object(
{
name:joi.string().min(10).required(),
email:joi.string().email().required(),
password:joi.string().min(8).max(20).required(),
introductionPerson:joi.string().min(10).required(),
job:joi.string().min(5).required(),
subjects:joi.string().min(10).required(),
address:joi.string().min(10).required(),
phone:joi.string().regex(/^(010|011|015|012)[0-9]{8,9}$/).required(),
}).required();

export const checkIdOfIns=joi.object(
{
    insId:joi.string().min(5).max(50).required(),
}).required();