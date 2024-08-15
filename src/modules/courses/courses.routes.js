import { Router } from "express";
import * as courseController from './couresr.controller.js';
import * as courseSchema from './coursers.schema.js';
import authorizationEmpoyee from "../../authorization/employee.authorization.js";
import checkInstrcutroOrnNot from "./checkIfInstructorOrNot.js";
import uploadingFileRequets from "../../utils/uploadingFiles.js";
import * as validation from '../../validation/validation.js';
import authentecationEmployee from './../../auth/employee.auth.js';
const courseRouter=Router({mergeParams:true});
// courses api's:
// stage 1:
// add course:
courseRouter.post("/addCouse",authentecationEmployee,authorizationEmpoyee("instructor","superAdmin"),checkInstrcutroOrnNot,uploadingFileRequets().any(),validation.bodyValidation(courseSchema.addCourseSchema),courseController.addCourse);
// update course:
courseRouter.patch("/updateCourse/:courseId",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),checkInstrcutroOrnNot,validation.paramsValidation(courseSchema.checkCourse),uploadingFileRequets().any(),validation.queryValidation(courseSchema.updatingCourseQuery),validation.bodyValidation(courseSchema.updateCourseSchema),courseController.updateSpCourse)
// delete course:
courseRouter.delete("/deleteCourse/:courseId",authentecationEmployee,authorizationEmpoyee("instructor","superAdmin"),validation.paramsValidation(courseSchema.checkCourse),courseController.deleteCourse);
// get the courses of the instuctor:
courseRouter.get("/getMyCourses",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),validation.bodyValidation(courseSchema.getCoursesForSpIns),courseController.getInsCourses);
// and make the changes about the updating of what is the free and aslo:

export default courseRouter;