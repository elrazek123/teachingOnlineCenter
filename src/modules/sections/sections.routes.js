import { Router } from "express";
import * as sectionsSchema from './sections.schema.js';
import * as sectionController from './sections.controller.js';
import authentecationEmployee from "../../auth/employee.auth.js";
import authorizationEmpoyee from "../../authorization/employee.authorization.js";
import checkInstrcutroOrnNot from "../courses/checkIfInstructorOrNot.js";
import * as validation from '../../validation/validation.js';
import * as sectionsMiddleWare from '../../utils/sectionsMiddleware/sections.middelware.js';
const sectionRouter=Router({mergeParams:true});
// sections api's:
// add section:
sectionRouter.post("/addSection",authentecationEmployee,authorizationEmpoyee("instructor","superAdmin"),checkInstrcutroOrnNot,validation.bodyValidation(sectionsSchema.addSectionSchema),sectionController.addSection);
// delete section:
// update section:
sectionRouter.patch("/updateSection/:sectionId",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),validation.paramsValidation(sectionsSchema.checkSection),sectionsMiddleWare.checkOnSectionAndOwnerOfIt,validation.bodyValidation(sectionsSchema.updateSection),validation.queryValidation(sectionsSchema.checkIfObJectiveQuery),sectionController.updateSection);
// get sections from all options of filter:
export default sectionRouter;