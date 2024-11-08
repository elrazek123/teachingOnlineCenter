import { Router } from "express";
// import the controller:
import * as testSchema from './test.schema.js';
// import the controller  to make it good now then make it:
import * as testController from './tests.controller.js';
// import the params val an dother vaidation:
import * as validation from '../../validation/validation.js';
import authentecationEmployee from "../../auth/employee.auth.js";
import authorizationEmpoyee from "../../authorization/employee.authorization.js";
import checkInstrcutroOrnNot from "../courses/checkIfInstructorOrNot.js";
// import the schema: 
// make the routes to the test:
const testRouter=Router({mergeParams:true});
// mak the test end points (api's):
// make the test by the ins or the superadmin in an sp course:
testRouter.post("/makeTest/:courseId",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),checkInstrcutroOrnNot,validation.paramsValidation(testSchema.checkCousreId),validation.bodyValidation(testSchema.makeTestSchema),testController.makeNewTest)
// make an update:
testRouter.patch("/updateTestData/:testId",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),checkInstrcutroOrnNot,validation.paramsValidation(testSchema.checkTestSchema),validation.queryValidation(testSchema.testQuestionUpdatingQuery),validation.bodyValidation(testSchema.makeUpdtaeOnTestQuestions),testController.updateTestData)
// delete the test:


// ett he results of the tests:
// correct the tests that not correct automatically:
// watch the 
export default testRouter;

