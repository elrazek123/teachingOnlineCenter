import { Router } from "express";
import * as validation from '../../validation/validation.js';
import * as insController from './instructor.controller.js';
import * as insSchema from './instructor.schema.js';
import uploadingFileRequets from "../../utils/uploadingFiles.js";
import authentecationEmployee from './../../auth/employee.auth.js';
import authorizationEmpoyee from "../../authorization/employee.authorization.js";
import courseRouter from "../courses/courses.routes.js";
const instRouter=Router({mergeParams:true });
// cousrers routes:
instRouter.use("/courses",courseRouter);
// instriuctors api's:
// add request:
instRouter.post("/addRequestInstructor",uploadingFileRequets().any(),validation.bodyValidation(insSchema.addRequestSchema),insController.addRequet);
// delete request:
instRouter.delete("/insRequet",authentecationEmployee,insController.deleteRequet);
// get the request result:
instRouter.get("/getRequestResult",authentecationEmployee,authorizationEmpoyee("instructor"),insController.getInsReqRes);
// delete the account:
instRouter.delete("/deleteMyAccount",authentecationEmployee,authorizationEmpoyee("instructor"),insController.deleteAccount)

export default instRouter;