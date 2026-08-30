import axios from "axios";


const api = axios.create({

    baseURL: "https://ai-interview-planner-xzw3.onrender.com",

    withCredentials: true

});


// =====================================================
// GENERATE INTERVIEW REPORT
// =====================================================

export const generateInterviewReport = async ({
    jobDescription,
    selfDescription,
    resumeFile
}) => {

    const formData = new FormData();


    formData.append(
        "jobDescription",
        jobDescription
    );


    formData.append(
        "selfDescription",
        selfDescription || ""
    );


    if (resumeFile) {

        formData.append(
            "resume",
            resumeFile
        );

    }


    const response = await api.post(
        "/api/interview/",
        formData
    );


    return response.data;

};


// =====================================================
// GET REPORT BY ID
// =====================================================

export const getInterviewReportById = async (
    interviewId
) => {

    const response = await api.get(
        `/api/interview/report/${interviewId}`
    );


    return response.data;

};


// =====================================================
// GET ALL REPORTS
// =====================================================

export const getAllInterviewReports = async () => {

    const response = await api.get(
        "/api/interview/"
    );


    return response.data;

};


// =====================================================
// DOWNLOAD INTERVIEW REPORT PDF
// =====================================================

export const downloadInterviewReportPDF = async (
    interviewId
) => {

    const response = await api.get(
        `/api/interview/report/${interviewId}/pdf`,
        {
            responseType: "blob"
        }
    );


    return response.data;

};