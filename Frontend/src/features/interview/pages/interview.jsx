import React, { useState } from "react";

import "../styles/interview.scss";

import { useInterview } from "../hooks/useInterview.jsx";

import { useParams } from "react-router";

import {
    downloadInterviewReportPDF
} from "../services/interview.api.js";


// =====================================================
// NAV ITEMS
// =====================================================

const NAV_ITEMS = [
    {
        id: "technical",
        label: "Technical Questions"
    },
    {
        id: "behavioral",
        label: "Behavioral Questions"
    },
    {
        id: "roadmap",
        label: "Road Map"
    }
];


// =====================================================
// QUESTION CARD
// =====================================================

const QuestionCard = ({ item, index }) => {

    const [open, setOpen] = useState(false);

    return (

        <div className="q-card">

            <div
                className="q-card__header"
                onClick={() => setOpen(prev => !prev)}
            >

                <span className="q-card__index">
                    Q{index + 1}
                </span>

                <p className="q-card__question">
                    {item?.question || "Question not available"}
                </p>

                <span
                    className={`q-card__chevron ${open
                            ? "q-card__chevron--open"
                            : ""
                        }`}
                >
                    ▼
                </span>

            </div>


            {open && (

                <div className="q-card__body">

                    <div className="q-card__section">

                        <span className="q-card__tag">
                            Why is this asked?
                        </span>

                        <p>
                            {item?.intention ||
                                "No explanation available."}
                        </p>

                    </div>


                    <div className="q-card__section">

                        <span className="q-card__tag">
                            Model Answer
                        </span>

                        <p>
                            {item?.answer ||
                                "No answer available."}
                        </p>

                    </div>


                    {item?.difficulty && (

                        <div className="q-card__section">

                            <span className="q-card__tag">
                                Difficulty
                            </span>

                            <p>
                                {item.difficulty}
                            </p>

                        </div>

                    )}

                </div>

            )}

        </div>

    );
};


// =====================================================
// ROADMAP DAY
// =====================================================

const RoadMapDay = ({ day }) => {

    return (

        <div className="roadmap-day">

            <div className="roadmap-day__header">

                <span className="roadmap-day__badge">
                    Day {day?.day}
                </span>

                <h3 className="roadmap-day__focus">
                    {day?.focus || "Preparation"}
                </h3>

            </div>


            <ul className="roadmap-day__tasks">

                {(day?.tasks || []).map(
                    (task, index) => (

                        <li key={index}>

                            <span className="roadmap-day__bullet" />

                            {task}

                        </li>

                    )
                )}

            </ul>

        </div>

    );
};


// =====================================================
// INTERVIEW PAGE
// =====================================================

const Interview = () => {

    const [activeNav, setActiveNav] =
        useState("technical");


    const [downloading, setDownloading] =
        useState(false);


    const { interviewId } =
        useParams();


    const {
        report,
        loading
    } = useInterview();


    // =================================================
    // DOWNLOAD PDF
    // =================================================

    const handleDownloadPDF = async () => {

        if (!interviewId) {

            alert(
                "Interview ID not found."
            );

            return;

        }


        try {

            setDownloading(true);


            const pdfBlob =
                await downloadInterviewReportPDF(
                    interviewId
                );


            // Create download URL
            const url =
                window.URL.createObjectURL(
                    pdfBlob
                );


            // Create invisible link
            const link =
                document.createElement("a");


            link.href = url;


            link.download =
                `interview-report-${interviewId}.pdf`;


            document.body.appendChild(link);


            link.click();


            link.remove();


            // Clean URL
            window.URL.revokeObjectURL(
                url
            );


        } catch (error) {

            console.error(
                "PDF Download Error:",
                error
            );


            alert(
                "Failed to download PDF. Please try again."
            );


        } finally {

            setDownloading(false);

        }

    };


    // =================================================
    // LOADING
    // =================================================

    if (loading || !report) {

        return (

            <main className="loading-screen">

                <h1>
                    Loading your interview plan...
                </h1>

            </main>

        );

    }


    // =================================================
    // REPORT DATA
    // =================================================

    const technicalQuestions =
        report?.technicalQuestions || [];


    const behavioralQuestions =
        report?.behaviourQuestions ||
        report?.behaviorQuestions ||
        report?.behavioralQuestions ||
        [];


    const preparationPlan =
        report?.preparationPlan || [];


    const skillGaps =
        report?.skillGaps || [];


    const matchScore =
        Number(report?.matchScore) || 0;


    const strengths =
        report?.strengths || [];


    const scoreColor =
        matchScore >= 80
            ? "score--high"
            : matchScore >= 60
                ? "score--mid"
                : "score--low";


    // =================================================
    // PAGE
    // =================================================

    return (

        <div className="interview-page">

            <div className="interview-layout">


                {/* =====================================
                    LEFT NAVIGATION
                ===================================== */}

                <nav className="interview-nav">

                    <div className="nav-content">

                        <p className="interview-nav__label">
                            Sections
                        </p>


                        {NAV_ITEMS.map(item => (

                            <button
                                key={item.id}
                                className={`
                                    interview-nav__item
                                    ${activeNav === item.id
                                        ? "interview-nav__item--active"
                                        : ""
                                    }
                                `}
                                onClick={() =>
                                    setActiveNav(
                                        item.id
                                    )
                                }
                            >

                                {item.label}

                            </button>

                        ))}

                    </div>


                    {/* =================================
                        DOWNLOAD BUTTON
                    ================================= */}

                    <button
                        className="download-pdf-button"
                        onClick={
                            handleDownloadPDF
                        }
                        disabled={downloading}
                    >

                        {downloading
                            ? "Generating PDF..."
                            : "📄 Download PDF"
                        }

                    </button>

                </nav>


                <div className="interview-divider" />


                {/* =====================================
                    MAIN CONTENT
                ===================================== */}

                <main className="interview-content">


                    {/* =================================
                        TECHNICAL
                    ================================= */}

                    {activeNav === "technical" && (

                        <section>

                            <div className="content-header">

                                <div>

                                    <h2>
                                        Technical Questions
                                    </h2>

                                    <span className="content-header__count">
                                        {technicalQuestions.length}
                                        {" "}questions
                                    </span>

                                </div>

                            </div>


                            <div className="q-list">

                                {technicalQuestions.length > 0 ? (

                                    technicalQuestions.map(
                                        (question, index) => (

                                            <QuestionCard
                                                key={index}
                                                item={question}
                                                index={index}
                                            />

                                        )
                                    )

                                ) : (

                                    <p>
                                        No technical questions
                                        available.
                                    </p>

                                )}

                            </div>

                        </section>

                    )}


                    {/* =================================
                        BEHAVIOURAL
                    ================================= */}

                    {activeNav === "behavioral" && (

                        <section>

                            <div className="content-header">

                                <div>

                                    <h2>
                                        Behavioral Questions
                                    </h2>

                                    <span className="content-header__count">
                                        {behavioralQuestions.length}
                                        {" "}questions
                                    </span>

                                </div>

                            </div>


                            <div className="q-list">

                                {behavioralQuestions.length > 0 ? (

                                    behavioralQuestions.map(
                                        (question, index) => (

                                            <QuestionCard
                                                key={index}
                                                item={question}
                                                index={index}
                                            />

                                        )
                                    )

                                ) : (

                                    <p>
                                        No behavioral questions
                                        available.
                                    </p>

                                )}

                            </div>

                        </section>

                    )}


                    {/* =================================
                        ROADMAP
                    ================================= */}

                    {activeNav === "roadmap" && (

                        <section>

                            <div className="content-header">

                                <div>

                                    <h2>
                                        Preparation Road Map
                                    </h2>

                                    <span className="content-header__count">
                                        {preparationPlan.length}
                                        -day plan
                                    </span>

                                </div>

                            </div>


                            <div className="roadmap-list">

                                {preparationPlan.length > 0 ? (

                                    preparationPlan.map(
                                        (day) => (

                                            <RoadMapDay
                                                key={day.day}
                                                day={day}
                                            />

                                        )
                                    )

                                ) : (

                                    <p>
                                        No preparation plan
                                        available.
                                    </p>

                                )}

                            </div>

                        </section>

                    )}

                </main>


                <div className="interview-divider" />


                {/* =====================================
                    RIGHT SIDEBAR
                ===================================== */}

                <aside className="interview-sidebar">


                    {/* =================================
                        MATCH SCORE
                    ================================= */}

                    <div className="match-score">

                        <p className="match-score__label">
                            Match Score
                        </p>


                        <div
                            className={`
                                match-score__ring
                                ${scoreColor}
                            `}
                        >

                            <span className="match-score__value">
                                {matchScore}
                            </span>

                            <span className="match-score__pct">
                                %
                            </span>

                        </div>


                        <p className="match-score__sub">

                            {report?.matchVerdict ||
                                "Overall match for this role"}

                        </p>

                    </div>


                    <div className="sidebar-divider" />


                    {/* =================================
                        STRENGTHS
                    ================================= */}

                    {strengths.length > 0 && (

                        <div className="skill-gaps">

                            <p className="skill-gaps__label">
                                Key Strengths
                            </p>


                            <div className="skill-gaps__list">

                                {strengths.map(
                                    (strength, index) => (

                                        <span
                                            key={index}
                                            className="skill-tag"
                                            title={
                                                strength?.description
                                            }
                                        >

                                            ✓{" "}
                                            {strength?.title ||
                                                "Strength"}

                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    {/* =================================
                        SKILL GAPS
                    ================================= */}

                    <div className="skill-gaps">

                        <p className="skill-gaps__label">
                            Skill Gaps
                        </p>


                        <div className="skill-gaps__list">

                            {skillGaps.length > 0 ? (

                                skillGaps.map(
                                    (gap, index) => (

                                        <span
                                            key={index}
                                            className={`
                                                skill-tag
                                                skill-tag--${(
                                                    gap?.severity ||
                                                    "Low"
                                                ).toLowerCase()
                                                }
                                            `}
                                            title={
                                                gap?.gap ||
                                                gap?.recommendation ||
                                                ""
                                            }
                                        >

                                            {gap?.skill ||
                                                "Unknown Skill"}

                                        </span>

                                    )
                                )

                            ) : (

                                <span>
                                    No major skill gaps
                                </span>

                            )}

                        </div>

                    </div>


                    {/* =================================
                        READINESS
                    ================================= */}

                    {report?.readinessScore !== undefined && (

                        <>

                            <div className="sidebar-divider" />

                            <div className="skill-gaps">

                                <p className="skill-gaps__label">
                                    Interview Readiness
                                </p>

                                <h2>
                                    {report.readinessScore}%
                                </h2>

                                <p>
                                    {report?.readinessSummary ||
                                        "Keep preparing for the interview."}
                                </p>

                            </div>

                        </>

                    )}

                </aside>


            </div>

        </div>

    );

};


export default Interview;