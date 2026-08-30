import { PDFParse } from "pdf-parse";

import generateInterviewReport
    from "../services/ai.service.js";

import {
    interViewReportModel
} from "../models/interViewReport.model.js";

import generateInterviewReportPDF
    from "../services/pdf.service.js";

import mongoose from "mongoose";


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
                message: "Job description is required",
                success: false
            });

        }


        const resume = req.file;


        // ---------------------------------------------
        // Resume OR Self Description required
        // ---------------------------------------------

        if (!resume && !selfDescription?.trim()) {

            return res.status(400).json({
                message:
                    "Resume or self description is required",
                success: false
            });

        }


        // =================================================
        // RESUME TEXT
        // =================================================

        let resumeText = "";


        if (resume) {

            // Only PDF supported
            if (
                resume.mimetype !==
                "application/pdf"
            ) {

                return res.status(400).json({
                    message:
                        "Only PDF resume is supported currently.",
                    success: false
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

            success: true,

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

            success: false,

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

            success: true,

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

            success: false,

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


        // ---------------------------------------------
        // Validate MongoDB ObjectId
        // ---------------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(
                interviewId
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid interview ID",

                success: false

            });

        }


        // ---------------------------------------------
        // Find report belonging to logged-in user
        // ---------------------------------------------

        const interviewReport =
            await interViewReportModel.findOne({

                _id: interviewId,

                user: req.user.id

            });


        if (!interviewReport) {

            return res.status(404).json({

                message:
                    "Interview report not found",

                success: false

            });

        }


        return res.status(200).json({

            message:
                "Interview Report Fetched Successfully",

            success: true,

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

            success: false,

            error:
                error.message

        });

    }

}



// =====================================================
// DOWNLOAD INTERVIEW REPORT AS PDF
// =====================================================

async function downloadInterviewReportPDFController(
    req,
    res
) {

    try {

        const {
            interviewId
        } = req.params;


        console.log(
            "PDF REQUEST FOR INTERVIEW:",
            interviewId
        );


        // ---------------------------------------------
        // Validate interview ID
        // ---------------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(
                interviewId
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid interview ID",

                success: false

            });

        }


        // ---------------------------------------------
        // Find report belonging to logged-in user
        // ---------------------------------------------

        const interviewReport =
            await interViewReportModel.findOne({

                _id: interviewId,

                user: req.user.id

            });


        if (!interviewReport) {

            console.log(
                "PDF REPORT NOT FOUND"
            );


            return res.status(404).json({

                message:
                    "Interview report not found",

                success: false

            });

        }


        console.log(
            "REPORT FOUND. GENERATING PDF..."
        );


        // ---------------------------------------------
        // Generate PDF
        // ---------------------------------------------

        const pdf =
            await generateInterviewReportPDF(
                interviewReport
            );


        // ---------------------------------------------
        // Make sure PDF exists
        // ---------------------------------------------

        if (!pdf) {

            throw new Error(
                "PDF generation returned empty result"
            );

        }


        // ---------------------------------------------
        // Convert to Buffer if necessary
        // ---------------------------------------------

        const pdfBuffer =
            Buffer.isBuffer(pdf)
                ? pdf
                : Buffer.from(pdf);


        if (pdfBuffer.length === 0) {

            throw new Error(
                "Generated PDF is empty"
            );

        }


        console.log(
            "PDF GENERATED:",
            pdfBuffer.length,
            "bytes"
        );


        // ---------------------------------------------
        // PDF RESPONSE HEADERS
        // ---------------------------------------------

        res.status(200);

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="interview-report-${interviewId}.pdf"`
        );

        res.setHeader(
            "Content-Length",
            pdfBuffer.length
        );

        res.setHeader(
            "Cache-Control",
            "no-cache, no-store, must-revalidate"
        );


        // ---------------------------------------------
        // SEND PDF
        // ---------------------------------------------

        return res.end(pdfBuffer);


    } catch (error) {

        console.error(
            "Download Interview Report PDF Error:",
            error
        );


        // If headers are already sent,
        // don't try to send JSON again.

        if (res.headersSent) {

            return res.end();

        }


        return res.status(500).json({

            message:
                "Failed to generate interview report PDF",

            success: false,

            error:
                error.message

        });

    }

}



// =====================================================
// EXPORT
// =====================================================

export default {

    generateInterviewReportController,

    getAllInterviewReportsController,

    getInterviewReportByIdController,

    downloadInterviewReportPDFController

};