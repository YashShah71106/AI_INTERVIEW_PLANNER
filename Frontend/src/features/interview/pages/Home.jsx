import "../styles/home.scss";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview.jsx";
import { useAuth } from "../../auth/hooks/useAuth.js";


const Home = () => {

    const navigate = useNavigate();


    // =====================================================
    // INTERVIEW
    // =====================================================

    const {
        generateReport,
        reports = [],
        loading
    } = useInterview();


    // =====================================================
    // AUTH
    // =====================================================

    const {
        user,
        handleLogout
    } = useAuth();


    // =====================================================
    // FORM STATES
    // =====================================================

    const [jobDescription, setJobDescription] = useState("");

    const [selfDescription, setSelfDescription] = useState("");

    const [resumeFile, setResumeFile] = useState(null);


    // =====================================================
    // LOGOUT STATE
    // =====================================================

    const [logoutLoading, setLogoutLoading] = useState(false);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogoutClick = async () => {

        if (logoutLoading) return;


        try {

            setLogoutLoading(true);


            await handleLogout();


            navigate("/login", {
                replace: true
            });


        } catch (error) {

            console.error(
                "Logout Error:",
                error
            );


            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Logout failed. Please try again."
            );


        } finally {

            setLogoutLoading(false);

        }

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // -------------------------------------------------
        // JOB DESCRIPTION
        // -------------------------------------------------

        if (!jobDescription.trim()) {

            alert(
                "Please enter Job Description."
            );

            return;
        }


        // -------------------------------------------------
        // RESUME / SELF DESCRIPTION
        // -------------------------------------------------

        if (
            !resumeFile &&
            !selfDescription.trim()
        ) {

            alert(
                "Please upload a Resume or enter Self Description."
            );

            return;
        }


        // -------------------------------------------------
        // RESUME VALIDATION
        // -------------------------------------------------

        if (resumeFile) {

            if (
                resumeFile.size >
                5 * 1024 * 1024
            ) {

                alert(
                    "Resume must be less than 5MB."
                );

                return;
            }


            const fileName =
                resumeFile.name.toLowerCase();


            if (
                !fileName.endsWith(".pdf") &&
                !fileName.endsWith(".docx")
            ) {

                alert(
                    "Only PDF or DOCX files are allowed."
                );

                return;
            }

        }


        // =================================================
        // GENERATE REPORT
        // =================================================

        try {

            const report =
                await generateReport({

                    jobDescription,

                    selfDescription,

                    resumeFile

                });


            console.log(
                "Generated Report:",
                report
            );


            // -------------------------------------------------
            // REPORT ID
            // -------------------------------------------------

            const reportId =
                report?._id ||
                report?.id ||
                report?.interviewReport?._id ||
                report?.interviewReport?.id;


            if (!reportId) {

                alert(
                    "Report generated but ID was not returned."
                );

                return;
            }


            // -------------------------------------------------
            // OPEN REPORT
            // -------------------------------------------------

            navigate(
                `/interview/${reportId}`
            );


        } catch (error) {

            console.error(
                "Generate interview error:",
                error
            );


            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to generate interview report."
            );

        }

    };


    // =====================================================
    // VIEW REPORT
    // =====================================================

    const handleViewReport = (id) => {

        if (!id) return;


        navigate(
            `/interview/${id}`
        );

    };


    // =====================================================
    // USER AVATAR
    // =====================================================

    const userInitial =
        user?.username
            ? user.username
                .charAt(0)
                .toUpperCase()
            : "U";


    // =====================================================
    // UI
    // =====================================================

    return (

        <main className="home">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="home-header">

                <div className="home-header-content">


                    {/* =================================================
                        HEADER TITLE
                    ================================================= */}

                    <div>

                        <h1>

                            Create Your Custom{" "}

                            <span>
                                Interview Plan
                            </span>

                        </h1>


                        <p>

                            Let our AI analyze the job requirements and your
                            unique profile to build a

                            <br />

                            winning strategy.

                        </p>

                    </div>



                    {/* =================================================
                        USER PROFILE
                    ================================================= */}

                    <div className="user-profile">


                        {/* USER AVATAR */}

                        <div
                            className="user-avatar"
                            aria-label="User profile"
                        >

                            {userInitial}

                        </div>



                        {/* USER INFORMATION */}

                        <div className="user-info">

                            <span className="user-name">

                                {user?.username || "User"}

                            </span>


                            <span className="user-email">

                                {user?.email || ""}

                            </span>

                        </div>



                        {/* LOGOUT BUTTON */}

                        <button
                            type="button"
                            className="logout-button"
                            onClick={handleLogoutClick}
                            disabled={logoutLoading}
                        >

                            {logoutLoading
                                ? "Logging out..."
                                : "Logout"
                            }

                        </button>


                    </div>


                </div>

            </header>



            {/* =================================================
                FORM
            ================================================= */}

            <form
                className="interview-input-group"
                onSubmit={handleSubmit}
            >


                {/* =================================================
                    LEFT
                ================================================= */}

                <div className="left">

                    <div className="section-heading">


                        <span
                            className="section-icon"
                            aria-hidden="true"
                        />


                        <label htmlFor="jobDescription">

                            Target Job Description

                        </label>


                        <span className="required">

                            Required

                        </span>


                    </div>



                    <div className="textarea-wrapper">

                        <textarea
                            name="jobDescription"
                            id="jobDescription"
                            maxLength={5000}
                            value={jobDescription}
                            onChange={(e) =>
                                setJobDescription(
                                    e.target.value
                                )
                            }
                            placeholder={`Paste the full job description here...
e.g. "Senior Frontend Engineer requires proficiency in React, TypeScript, and system design..."`}
                        />


                        <small>

                            {jobDescription.length} / 5000 chars

                        </small>


                    </div>

                </div>



                {/* =================================================
                    RIGHT
                ================================================= */}

                <div className="right">


                    <div className="section-heading profile-heading">


                        <span
                            className="section-icon profile-icon"
                            aria-hidden="true"
                        />


                        <h2>

                            Your Profile

                        </h2>


                    </div>



                    {/* =================================================
                        RESUME
                    ================================================= */}

                    <div className="input-group">


                        <p className="field-label">

                            Upload Resume{" "}

                            <small>

                                (Best Results)

                            </small>

                        </p>



                        <label
                            className="file-label"
                            htmlFor="resume"
                        >

                            <strong>

                                {resumeFile
                                    ? resumeFile.name
                                    : "Click to upload or drag & drop"
                                }

                            </strong>


                            <small>

                                PDF or DOCX (Max 5MB)

                            </small>


                        </label>



                        <input
                            type="file"
                            id="resume"
                            name="resume"
                            accept=".pdf,.docx"
                            hidden
                            onChange={(e) => {

                                const file =
                                    e.target.files?.[0];


                                if (!file) return;



                                if (
                                    file.size >
                                    5 * 1024 * 1024
                                ) {

                                    alert(
                                        "Resume must be less than 5MB."
                                    );

                                    e.target.value = "";

                                    return;

                                }



                                const fileName =
                                    file.name.toLowerCase();



                                if (
                                    !fileName.endsWith(".pdf") &&
                                    !fileName.endsWith(".docx")
                                ) {

                                    alert(
                                        "Only PDF or DOCX files are allowed."
                                    );

                                    e.target.value = "";

                                    return;

                                }



                                setResumeFile(file);

                            }}
                        />


                    </div>



                    {/* =================================================
                        OR
                    ================================================= */}

                    <div className="or-divider">

                        <span>

                            OR

                        </span>

                    </div>



                    {/* =================================================
                        SELF DESCRIPTION
                    ================================================= */}

                    <div
                        className="input-group self-description-group"
                    >

                        <label
                            className="field-label"
                            htmlFor="selfDescription"
                        >

                            Quick Self-Description

                        </label>


                        <textarea
                            id="selfDescription"
                            name="selfDescription"
                            value={selfDescription}
                            onChange={(e) =>
                                setSelfDescription(
                                    e.target.value
                                )
                            }
                            placeholder="Briefly describe your experience, key skills, and years of experience..."
                        />


                    </div>



                    {/* =================================================
                        HINT
                    ================================================= */}

                    <p className="form-hint">

                        <span>

                            i

                        </span>


                        Either a Resume or a Self Description is
                        required to generate a personalized plan.


                    </p>


                </div>



                {/* =================================================
                    FORM FOOTER
                ================================================= */}

                <footer className="card-footer">


                    <small>

                        AI-Powered Strategy Generation

                        <b>
                            {" • "}
                        </b>

                        Approx 30s

                    </small>



                    <button
                        className="button primary-button"
                        type="submit"
                        disabled={loading}
                    >

                        <span>

                            &#10024;

                        </span>


                        {loading
                            ? "Generating..."
                            : "Generate My Interview Strategy"
                        }


                    </button>


                </footer>


            </form>



            {/* =================================================
                FOOTER
            ================================================= */}

            <nav
                className="home-footer"
                aria-label="Footer navigation"
            >

                <a href="#privacy">

                    Privacy Policy

                </a>


                <a href="#terms">

                    Terms of Service

                </a>


                <a href="#help">

                    Help Center

                </a>

            </nav>



            {/* =================================================
                PREVIOUS REPORTS
            ================================================= */}

            <section className="previous-reports">


                <div className="previous-reports__header">


                    <div>

                        <span className="previous-reports__eyebrow">

                            YOUR HISTORY

                        </span>


                        <h2>

                            Previous Interview Reports

                        </h2>


                        <p>

                            View and continue your previously
                            generated interview plans.

                        </p>


                    </div>



                    <span className="reports-count">

                        {reports.length}{" "}

                        {reports.length === 1
                            ? "Report"
                            : "Reports"
                        }

                    </span>


                </div>



                {/* =================================================
                    NO REPORTS
                ================================================= */}

                {reports.length === 0 ? (

                    <div className="no-reports">


                        <div className="no-reports__icon">

                            📋

                        </div>


                        <h3>

                            No interview reports yet

                        </h3>


                        <p>

                            Generate your first interview strategy
                            and it will appear here.

                        </p>


                    </div>


                ) : (


                    /* =================================================
                       REPORT GRID
                    ================================================= */

                    <div className="previous-reports__grid">


                        {reports.map((report, index) => {


                            const reportId =
                                report?._id ||
                                report?.id ||
                                `report-${index}`;


                            const jobTitle =
                                report?.jobDescription?.trim()
                                    ? report.jobDescription.trim()
                                    : "Interview Strategy";


                            const description =
                                report?.selfDescription?.trim()
                                    ? report.selfDescription.trim()
                                    : "Personalized interview preparation plan";



                            return (


                                <article
                                    className="report-card"
                                    key={reportId}
                                >


                                    <div className="report-card__top">


                                        <div className="report-card__icon">

                                            ✦

                                        </div>


                                        <span className="report-card__score">

                                            {report?.matchScore ?? 0}%

                                            {" "}

                                            Match

                                        </span>


                                    </div>



                                    <h3>

                                        {jobTitle.length > 80
                                            ? `${jobTitle.slice(0, 80)}...`
                                            : jobTitle
                                        }

                                    </h3>



                                    <p className="report-card__description">

                                        {description.length > 110
                                            ? `${description.slice(0, 110)}...`
                                            : description
                                        }

                                    </p>



                                    {/* =================================================
                                        SKILLS
                                    ================================================= */}

                                    {Array.isArray(
                                        report?.skillGaps
                                    ) &&
                                        report.skillGaps.length > 0 && (


                                            <div className="report-card__skills">


                                                {report.skillGaps
                                                    .slice(0, 4)
                                                    .map((gap, i) => (


                                                        <span key={i}>


                                                            {typeof gap === "object"
                                                                ? gap?.skill || "Skill"
                                                                : gap
                                                            }


                                                        </span>


                                                    ))
                                                }


                                            </div>


                                        )
                                    }



                                    {/* =================================================
                                        CARD FOOTER
                                    ================================================= */}

                                    <div className="report-card__footer">


                                        <small>

                                            Interview Report

                                        </small>



                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleViewReport(
                                                    report?._id ||
                                                    report?.id
                                                )
                                            }
                                        >

                                            View Report →

                                        </button>


                                    </div>


                                </article>


                            );

                        })}


                    </div>


                )}


            </section>


        </main>

    );

};


export default Home;