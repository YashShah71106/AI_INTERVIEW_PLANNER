import express from "express";

import authMiddleware
    from "../middlewares/auth.middleware.js";

import {
    upload
} from "../middlewares/file.middleware.js";

import interviewController
    from "../controllers/interview.controller.js";


const interviewRouter = express.Router();


// =====================================================
// GENERATE INTERVIEW REPORT
// =====================================================

interviewRouter.post(
    "/",
    authMiddleware.authUser,
    upload.single("resume"),
    interviewController.generateInterviewReportController
);


// =====================================================
// GET ALL INTERVIEW REPORTS
// =====================================================

interviewRouter.get(
    "/",
    authMiddleware.authUser,
    interviewController.getAllInterviewReportsController
);


// =====================================================
// GET REPORT BY ID
// =====================================================

interviewRouter.get(
    "/report/:interviewId",
    authMiddleware.authUser,
    interviewController.getInterviewReportByIdController
);


// =====================================================
// DOWNLOAD REPORT AS PDF
// =====================================================

interviewRouter.get(
    "/report/:interviewId/pdf",
    authMiddleware.authUser,
    interviewController.downloadInterviewReportPDFController
);


export default interviewRouter;