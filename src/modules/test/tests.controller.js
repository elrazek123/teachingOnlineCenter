import { nanoid } from "nanoid";
import courseModel from "../../../db/models/courses/courses.model.js";
import testModel from "../../../db/models/tests/tests.model.js";
import checkTestValidation, { checkOnTheUpdatingOptions, checkRealationBetweenAnswersAndChoosesAdding, checkTestIfItWillMarkAutoOrNot } from "./tests.fucntions.js";
import { addingChoosesOfAnswersSchema, addingChoosesValidation, deleteChoosesTest, deletingTestChooses, updateTestQuestions, updateTestsAnswersOfTets } from "./test.schema.js";

// make the test controller:
export const makeNewTest=async (req,res,next)=>
{
    try 
    {
        // egt the id ogf the ins:
        const {_id}=req.data;
        // get the id of the course:
        const {courseId}=req.params;
        // chekc the realtion bwteeen the ins and the course:
        const course=await courseModel.findOne({_id:courseId});
        if(!course)
        {
            return next(new Error("checl the id of the course the cousre is not exists"));
        }
        // hcekc on the realtion bwtween the ins and the course:
        if(course.instructor.toString()!=_id.toString())
        {
            return next(new Error("you are not the owner of this course to make any action on it"));
        }
        // now get the data of the test:
        let data=req.body;
        // check on all the cases now and make the changes:
        // now we will check i the same cousre have the same name or not:
        const getTest=await testModel.findOne({forCourse:courseId,testName:data.testName});
        if(getTest)
        {
            return next(new Error("this test with the same name has already exists before"));
        }
        data.forCourse=courseId;
        // male th eid for each question:
        data.testQuestions.forEach((ele)=>
        {
            ele.questionId=nanoid(5);
        });
        data.autoCorrectOrNot=true;
        // we must chekc if the anwers are exist  we will check that the answer and that number are already exists or not(important and check on the answer and chooses number and choose text):
        for(let i=0;i<data.testQuestions.length;i++)
        {
            const {questionsChooses,questionAnswer}=data.testQuestions[i];
            if(questionsChooses)
            {
                if(questionsChooses.length>0)
                {
                    let choosesIdsWithAllOfIt=[]
                    // we must make an id for each choose option:
                    for(let j=0;j<questionsChooses.length;j++)
                    {                        
                        // we will make an id for each choose:
                        let id=nanoid(5);
                        data.testQuestions[i].questionsChooses[j].chooseId=id;
                       let objectOfQuestion={id,chooseName:data.testQuestions[i].questionsChooses[j].choose};
                       choosesIdsWithAllOfIt.push(objectOfQuestion);
                    }
                    // now we will check on the if the answer of quetion  exists or not:
                    if(!questionAnswer||questionAnswer.length<=0)
                    {
                        return next(new Error("sorry,when you add an questionsChooses you must add an answer to it"));
                    }
                    // loop on it on the question chooses and get the choose number and other:
                    questionAnswer.forEach((ele2)=>
                        {
                            const {choose}=ele2;
                            let flag=false;
                            choosesIdsWithAllOfIt.forEach((ele3)=>
                            {
                                const {id,chooseName}=ele3;
                                if(chooseName==choose)
                                {
                                    flag=true;
                                    ele2.chooseId=id;
                                }
                            });
                            if(!flag)
                            {
                                return next(new Error("you must choose the answer from the chooses you make only"))
                            }
                            ele2.answerId=nanoid(5);
                        });
                        data.testQuestions[i].questionAnswer=questionAnswer;
                        console.log("yes or no i'm good")
                }                
            }
            else
            {
                data.autoCorrectOrNot=false;
            }
        }
        // make the test in the db:
        await testModel.create(data);
        // return the response:
        return res.json({success:true,message:"the test is maked sucessfully"});
    }
    catch(err)
    {
        return next(err);
    }
}
// updaet the test data:
export const updateTestData=async (req,res,next)=>
{
    try
    {
        // get the id of the test:
        const {testId}=req.params;
        // get the id of the ins:
        const {_id}=req.data;
        // check the test is it ecists:
        const testData=await testModel.findOne({_id:testId}).populate([{path:"forCourse"}]);
        if(!testData)
        {
            return next(new Error("the test is not exists check the id of the test and try again"));
        }
        // cehck the authority of the ins and the tester:
        if(testData.forCourse.instructor.toString()!=_id.toString())
        {
            return next(new Error("you can't make any update or modification on this test because you are not the owener of this test"));
        }
        // egt the data of  the test previous:
        const {testQuestions}=testData;
        // get the data of update:
        const dataUpdate=req.body;
        // chekc on the every fields first:
        const {testQuestionsModif}=dataUpdate;
        if(testQuestionsModif)
        {
            if(testQuestionsModif.length>0)
            {
                // loop on the array and make the modifications:
                testQuestionsModif.forEach((ele)=>
                {
                    const {questionId,questionModifications}=ele;
                    let flagOfIdExists=false;
                    // we now have the first object with two fields one fro the id and one for question modifications:
                    // first we will chekc on the question id:
                    let indexOfEleemntOnTheArray="";
                    testQuestions.forEach((ele2,indexOnArrayOfQuestion)=>
                    {
                        if(ele2.questionId.toString()===questionId.toString())
                        {
                            flagOfIdExists=true;
                            indexOfEleemntOnTheArray=indexOnArrayOfQuestion;
                        }
                    });
                    if(!flagOfIdExists)
                    {
                        return next(new Error("check the id of question because it is not correct"));
                    }
                    // hcekc on the index first also:
                    if(!indexOfEleemntOnTheArray&&indexOfEleemntOnTheArray!=0)
                    {
                        return next(new Error("there is an eror in the logic and index of question"));
                    }
                    // check for the data that will update:
                    // check first for the question photo:
                    const {questionPhoto}=questionModifications;
                    // chek cfotr the option sof delete aslo:
                    const {questionPhotoOption}=questionModifications;
                    if(questionPhotoOption||questionPhotoOption==true)
                    {
                       
                            // check for the photo if it exists or not:
                            if(testQuestions[indexOfEleemntOnTheArray].questionPhoto)
                            {
                                testQuestions[indexOfEleemntOnTheArray].questionPhoto="";
                                questionPhoto="";
                            }
                            else
                            {
                                return next(new Error("there is no eror to the question to delete it"))
                            }
                    }
                    if(questionPhoto)
                    {
                            testQuestions[indexOfEleemntOnTheArray].questionPhoto=questionPhoto;
                    }
                    // check now for the question marks:
                    const {questionNote}=questionModifications;
                    if(questionNote)
                    {
                        testQuestions[indexOfEleemntOnTheArray].questionNote=questionNote;
                    }
                    // chekc also for the question notes:
                    const {questionMarks}=questionModifications;
                    if(questionMarks)
                    {
                        testQuestions[indexOfEleemntOnTheArray].questionMarks=questionMarks;
                    }
                    // check for the question only:
                    const {question}=questionModifications;
                    if(question)
                    {
                        testQuestions[indexOfEleemntOnTheArray].question=question;
                    }
                    // check for th ethers of the question chooses:
                    const {questionsChooses}=questionModifications;
                    if(questionsChooses)
                    {
                            // check on the options if it exists or not:
                            const {questionChoosesOptions}=req.query;
                            if(!questionChoosesOptions)
                            {
                                return next(new Error("you must send the testQuestion options in the query"));
                            }
                            if(questionChoosesOptions=="adding")
                            {
                                // make the validation for adding:
                                const getVal=checkTestValidation(questionsChooses,addingChoosesValidation);
                                const afetrVal=getVal(req,res,next);
                                if(afetrVal)
                                {
                                    // loop on the chooses:
                                    for(let i=0;i<testQuestions.length;i++)
                                    {
                                        testQuestions[i].chooseId=nanoid(5);
                                        testQuestions[indexOfEleemntOnTheArray].push(testQuestions[i]);
                                    }
                                }
                                else
                                {
                                    return next(new Error("there is an error in the validation of test questionn chooses"));
                                }
                                // make the logic for all the elemtts on the same ques:
                            }
                            else if(questionChoosesOptions=="updating")
                            {
                                // make the validation on the questionsChooses:
                                const getVal=checkTestValidation(questionsChooses,updateTestQuestions);
                                const getRes=getVal(req,res,next);
                                if(getRes)
                                {
                                    //make the logic:
                                    for(let i=0;i<questionsChooses.length;i++)
                                    {
                                        // loop on each chooses and mae the logic:
                                        let flagIndexExist=false;
                                        const {chooseId,chooseUpdates}=questionsChooses[i];
                                        for(let j=0;j<testQuestions[indexOfEleemntOnTheArray].questionsChooses.length;j++)
                                        {
                                            if(testQuestions[indexOfEleemntOnTheArray].questionsChooses[j].chooseId.toString()==chooseId.toString())
                                            {
                                                flagIndexExist=true;
                                                // make the logic then break:
                                                const {chooseNumber,choose}=chooseUpdates;
                                                if(chooseNumber)
                                                {
                                                    testQuestions[indexOfEleemntOnTheArray].questionsChooses[j].chooseNumber=chooseNumber;
                                                }
                                                if(choose)
                                                {
                                                    testQuestions[indexOfEleemntOnTheArray].questionsChooses[j].choose=choose;
                                                }
                                                break;
                                            }
                                        }
                                        if(!flagIndexExist)
                                        {
                                            return next(new Error("the question chooses id is not exists check the id of choose and try again"));
                                        }
                                    }
                                }
                                else
                                {
                                    return next(new Error("the testChooses updating not valid check the structure of send"));
                                }
                            }
                            else if(questionChoosesOptions=="deleting")
                            {
                                // make the validation on the questionsChooses:
                                const getValidationForDelete=checkTestValidation(questionsChooses,deletingTestChooses);
                                const getResOfVal=getValidationForDelete(req,res,next);
                                if(getResOfVal)
                                {
                                    // make the logic of it:
                                    for(let i=0;i<questionsChooses.length;i++)
                                    {
                                        const {choosoeId}=questionsChooses[i];
                                        let arrayOfIndexesThatWillDelete=[];
                                     testQuestions[indexOfEleemntOnTheArray].questionsChooses=testQuestions[indexOfEleemntOnTheArray].questionsChooses.filter((ele3)=>
                                        {
                                          if(ele3.chooseId.toString()!=choosoeId.toString())
                                          {
                                            return ele3;
                                          }
                                        });
                                    }
                                }
                                else
                                {
                                    return next(new Error("there is an error on deleting the the chooses val"));
                                }
                                // make the logic and make an update on the choose:
                            }
                            else
                            {
                                return next(new Error("the questionChoosesOptions must be one ot it (adding,updating,deleting)"));
                            }

                    }
                    // check on the answers object if it exists to maek the modifications:
                    // choose now on the answers if it have an modification:
            const {answerChooses}=questionModifications;
            if(answerChooses)
            {
                if(answerChooses.length>0)
                {
                    const {answersoptions}=req.query;
                    if(answersoptions)
                    {
                        if(answersoptions=="adding")
                        {
                            // check and make validation on it first:
                            const getAfetrVal=checkTestValidation(answerChooses,addingChoosesOfAnswersSchema);
                            const getRes=getAfetrVal(req,res,next);
                            if(getRes)
                            {
                                for(let j=0;j<answerChooses.length;i++)
                                {
                                    const {chooseId,choose}=answerChooses[j];
                                   let resultAfterFun=checkRealationBetweenAnswersAndChoosesAdding(chooseId,choose,testQuestions[indexOfEleemntOnTheArray].questionAnswer,testQuestions[indexOfEleemntOnTheArray].questionsChooses);
                                   if(resultAfterFun=="all is good now")
                                   {
                                    // make the id for the answer:
                                    const makeId=nanoid(5);
                                    answerChooses[j].answerId=makeId;
                                    testQuestions[indexOfEleemntOnTheArray].questionAnswer.push(answerChooses[j]);
                                   }
                                   else
                                   {
                                    return next(new Error(resultAfterFun))
                                   }
                                }
                            }
                            else
                            {
                                return next(new Error("the answer chooses validation is not true"));
                            }
                        }
                        else if(answersoptions=="updating")
                        {
                            //check on the answer and check on the ohters:
                            const getVal=checkTestValidation(answerChooses,updateTestsAnswersOfTets);
                            const getAdter=getVal(req,res,next);
                            if(getAdter)
                            {
                                for(let i=0;i<answerChooses.length;i++)
                                {
                                    const {answerId,choose,chooseId}=answersoptions[i];
                                    const getresult=checkOnTheUpdatingOptions(answerId,choose,chooseId,testQuestions[indexOfEleemntOnTheArray].questionAnswer,testQuestions[indexOfEleemntOnTheArray].questionsChooses);
                                    if(getresult.startsWith("error"))
                                    {
                                        return next(new Error(getresult))
                                    }
                                    else
                                    {
                                        const index=+getresult.split(",")[1];
                                        testQuestions[indexOfEleemntOnTheArray].questionAnswer[index].chooseId=chooseId;
                                        testQuestions[indexOfEleemntOnTheArray].questionAnswer[index].choose=choose;
                                    }
                                }
                            }
                            else
                            {
                                return next(new Error("the test answers update not true of validation"));
                            }
                        }
                        else if(answersoptions=="deleting")
                        {
                            // validation on the delting options of the :
                            const getVal=checkTestValidation(answerChooses,deleteChoosesTest);
                            // make the updating o fthe lemtts:
                            const getRes=getVal(req,res.next);
                            if(getRes)
                            {
                                let indexes=[];
                                for(let i=0;i<answerChooses.length;i++)
                                {
                                    for(let j=0;j<testQuestions[indexOfEleemntOnTheArray].questionAnswer.length;j++)
                                    {
                                        const {answerId}=testQuestions[indexOfEleemntOnTheArray].questionAnswer[j];
                                        if(answerId.toString()==answerChooses[i].toString())
                                        {
                                            indexes.push(j);
                                        }
                                    }
                                }
                                testQuestions[indexOfEleemntOnTheArray].questionAnswer=testQuestions[indexOfEleemntOnTheArray].questionAnswer.filter((ele,index)=>
                                    {
                                        if(!indexes.includes(index))
                                        {
                                            return ele;
                                        }
                                    });
                            }
                    
                            else
                            {
                                return next(new Error(getRes));
                            }
                        }
                    }
                    else
                    {
                        return next(new Error("the answers options must be exists to know what action we will take"))
                    }
                }
                else
                {
                  // we nmust check f the question if it have question chooses it have answers and the answers must be from the question chooses (very im[portnat check):
                }
            }
            else
            {
                // we nmust check f the question if it have question chooses it have answers and the answers must be from the question chooses (very im[portnat check):
            }
                })
            }
            else
            {
                return next(new Error("there is no question updated because you are not making any change on any question"))
            }
            // make the modificartions:
            const getRes=checkTestIfItWillMarkAutoOrNot(testQuestions);
            let updateFinal=await testModel.findOneAndUpdate({_id:testId},{testQuestions,autoCorrectOrNot:getRes}).populate([{path:'forCourse'}]);
            return res.json({success:true,message:"the teste is updated sucessfully",test:updateFinal})
        }
        else
        {
            return next(new Error("sending the data on the body is not true"));
        }
    }
    catch(err)
    {
        return next(err);
    }
}