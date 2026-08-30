import { PDFParse } from "pdf-parse";

import generateInterviewReport
    from "../services/ai.service.js";

import {
    interViewReportModel
} from "../models/interViewReport.model.js";
import generateInterviewReportPDF
    from "../services/pdf.service.js";



// =====================================================
// GENERATE INTERVIEW REPORT
// =====================================================

async function generateInterviewReportController(req, res) {

    try {

        const {
            selfDescription,
            jobDescription
        } = req.body;


        // ---------------------------------------------
        // Job description required
        // ---------------------------------------------

        if (!jobDescription?.trim()) {

            return res.status(400).json({

                message:
                    "Job description is required"

            });

        }


        const resume = req.file;


        // ---------------------------------------------
        // Resume OR Self Description required
        // ---------------------------------------------

        if (!resume && !selfDescription?.trim()) {

            return res.status(400).json({

                message:
                    "Resume or self description is required"

            });

        }



        // =================================================
        // RESUME TEXT
        // =================================================

        let resumeText = "";


        if (resume) {

            // Currently backend supports PDF parsing

            if (
                resume.mimetype !==
                "application/pdf"
            ) {

                return res.status(400).json({

                    message:
                        "Only PDF resume is supported currently."

                });

            }


            const resumeContent =
                await (
                    new PDFParse({
                        data: resume.buffer
                    })
                ).getText();


            resumeText =
                resumeContent?.text || "";

        }



        // =================================================
        // AI GENERATION
        // =================================================

        const interviewReportByAi =
            await generateInterviewReport({

                resume: resumeText,

                selfDescription:
                    selfDescription || "",

                jobDescription

            });



        // =================================================
        // SAVE TO DATABASE
        // =================================================

        const interviewReport =
            await interViewReportModel.create({

                user: req.user.id,

                resume: resumeText,

                selfDescription:
                    selfDescription || "",

                jobDescription,

                ...interviewReportByAi

            });



        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            message:
                "Interview Report Generated Successfully",

            interviewReport

        });


    } catch (error) {

        console.error(
            "Generate Interview Report Error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to generate interview report",

            error:
                error.message

        });

    }

}



// =====================================================
// GET ALL INTERVIEW REPORTS
// =====================================================

async function getAllInterviewReportsController(
    req,
    res
) {

    try {

        const interviewReports =
            await interViewReportModel
                .find({
                    user: req.user.id
                })
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            message:
                "Interview Reports Fetched Successfully",

            interviewReports

        });


    } catch (error) {

        console.error(
            "Get All Interview Reports Error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to fetch interview reports",

            error:
                error.message

        });

    }

}



// =====================================================
// GET REPORT BY ID
// =====================================================

async function getInterviewReportByIdController(
    req,
    res
) {

    try {

        const {
            interviewId
        } = req.params;


        const interviewReport =
            await interViewReportModel.findOne({

                _id: interviewId,

                user: req.user.id

            });


        if (!interviewReport) {

            return res.status(404).json({

                message:
                    "Interview report not found"

            });

        }


        return res.status(200).json({

            message:
                "Interview Report Fetched Successfully",

            interviewReport

        });


    } catch (error) {

        console.error(
            "Get Interview Report By ID Error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to fetch interview report",

            error:
                error.message

        });

    }

}


// ==========================================
// DOWNLOAD INTERVIEW REPORT AS PDF
// ==========================================

async function downloadInterviewReportPDFController(req, res) {

    try {

        const { interviewId } = req.params;


        // Find report belonging to logged-in user
        const interviewReport =
            await interViewReportModel.findOne({

                _id: interviewId,

                user: req.user.id

            });


        // Report not found
        if (!interviewReport) {

            return res.status(404).json({

                message:
                    "Interview report not found"

            });

        }


        // Generate PDF
        const pdf =
            await generateInterviewReportPDF(
                interviewReport
            );


        // Tell browser this is a PDF
        res.set({

            "Content-Type":
                "application/pdf",

            "Content-Disposition":
                `attachment; filename="interview-report-${interviewId}.pdf"`,

            "Content-Length":
                pdf.length

        });


        return res.status(200).send(pdf);


    } catch (error) {

        console.error(
            "Download Interview Report PDF Error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to generate interview report PDF",

            error:
                error.message

        });

    }

}


export default {

    generateInterviewReportController,

    getAllInterviewReportsController,

    getInterviewReportByIdController,

    downloadInterviewReportPDFController

};