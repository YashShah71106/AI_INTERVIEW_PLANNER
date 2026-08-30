import {
    useContext,
    useEffect
} from "react";

import {
    useParams
} from "react-router";

import {
    InterviewContext
} from "../styles/interview.context.jsx";

import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById
} from "../services/interview.api.js";


export const useInterview = () => {

    const context = useContext(InterviewContext);

    const { interviewId } = useParams();


    if (!context) {
        throw new Error(
            "useInterview must be used within an InterviewProvider"
        );
    }


    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports
    } = context;


    // =========================================
    // GENERATE INTERVIEW REPORT
    // =========================================

    const generateReport = async ({
        jobDescription,
        selfDescription,
        resumeFile
    }) => {

        setLoading(true);

        try {

            const response =
                await generateInterviewReport({
                    jobDescription,
                    selfDescription,
                    resumeFile
                });


            console.log(
                "Generate API Response:",
                response
            );


            const interviewReport =
                response?.interviewReport ||
                response?.interViewReport ||
                null;


            if (!interviewReport) {

                throw new Error(
                    "Interview report was not returned by server."
                );

            }


            setReport(interviewReport);


            return interviewReport;


        } catch (error) {

            console.error(
                "Generate Interview Report Error:",
                error
            );

            setReport(null);

            throw error;


        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // GET REPORT BY ID
    // =========================================

    const getReportById = async (id) => {

        setLoading(true);

        try {

            const response =
                await getInterviewReportById(id);


            console.log(
                "Get Report By ID Response:",
                response
            );


            const interviewReport =
                response?.interviewReport ||
                response?.interViewReport ||
                null;


            if (!interviewReport) {

                throw new Error(
                    "Interview report was not returned by server."
                );

            }


            setReport(interviewReport);


            return interviewReport;


        } catch (error) {

            console.error(
                "Get Interview Report Error:",
                error
            );

            setReport(null);

            throw error;


        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // GET ALL REPORTS
    // =========================================

    const getReports = async () => {

        setLoading(true);

        try {

            const response =
                await getAllInterviewReports();


            console.log(
                "All Interview Reports Response:",
                response
            );


            const interviewReports =
                response?.interviewReports ||
                response?.interViewReports ||
                [];


            console.log(
                "Reports:",
                interviewReports
            );


            setReports(interviewReports);


            return interviewReports;


        } catch (error) {

            console.error(
                "Get All Interview Reports Error:",
                error
            );

            setReports([]);

            throw error;


        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // LOAD DATA AUTOMATICALLY
    // =========================================

    useEffect(() => {

        if (interviewId) {

            // Interview detail page
            getReportById(interviewId)
                .catch((error) => {

                    console.error(
                        "Failed to load interview:",
                        error
                    );

                });

        } else {

            // Home page
            // Load previous interview reports
            getReports()
                .catch((error) => {

                    console.error(
                        "Failed to load interview reports:",
                        error
                    );

                });

        }

    }, [interviewId]);


    return {

        loading,

        report,

        reports,

        generateReport,

        getReportById,

        getReports

    };

};