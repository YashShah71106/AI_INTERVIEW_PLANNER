import puppeteer from "puppeteer";


// =====================================================
// HELPER FUNCTIONS
// =====================================================

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// -----------------------------------------------------
// Extract candidate information from resume text
// -----------------------------------------------------

function extractCandidateInfo(resume = "") {

    const text = String(resume || "").trim();

    const lines = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);


    // -------------------------------------------------
    // NAME
    // -------------------------------------------------

    let name = "Candidate";

    for (const line of lines.slice(0, 10)) {

        const cleaned = line
            .replace(/\s+/g, " ")
            .trim();

        // Skip obvious headings
        if (
            !cleaned ||
            /^(resume|curriculum vitae|cv)$/i.test(cleaned) ||
            /^(professional summary|summary|objective)$/i.test(cleaned) ||
            /@/.test(cleaned) ||
            /linkedin|github/i.test(cleaned)
        ) {
            continue;
        }

        // Name normally contains letters/spaces only
        if (
            /^[A-Za-z][A-Za-z .'-]{2,60}$/.test(cleaned)
        ) {
            name = cleaned;
            break;
        }
    }


    // -------------------------------------------------
    // EMAIL
    // -------------------------------------------------

    const emailMatch = text.match(
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
    );

    const email =
        emailMatch?.[0] || "";


    // -------------------------------------------------
    // PHONE
    // -------------------------------------------------

    const phoneMatch = text.match(
        /(?:\+?\d[\d\s().-]{8,}\d)/
    );

    const phone =
        phoneMatch?.[0]
            ?.replace(/\s+/g, " ")
            .trim() || "";


    // -------------------------------------------------
    // LINKEDIN
    // -------------------------------------------------

    const linkedinMatch = text.match(
        /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s|,)]+/i
    );

    const linkedin =
        linkedinMatch?.[0] || "";


    // -------------------------------------------------
    // GITHUB
    // -------------------------------------------------

    const githubMatch = text.match(
        /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s|,)]+/i
    );

    const github =
        githubMatch?.[0] || "";


    // -------------------------------------------------
    // LOCATION
    // -------------------------------------------------

    let location = "";

    // Common pattern:
    // Bhopal, India
    // Mumbai, India
    // Delhi, India

    const locationMatch = text.match(
        /\b([A-Z][A-Za-z .'-]{2,30},\s*[A-Z][A-Za-z .'-]{2,30})\b/
    );

    if (locationMatch) {
        location = locationMatch[1];
    }


    return {
        name,
        email,
        phone,
        linkedin,
        github,
        location
    };
}


// =====================================================
// GENERATE INTERVIEW REPORT PDF
// =====================================================

const generateInterviewReportPDF = async (report) => {

    let browser;


    try {

        // =================================================
        // LAUNCH PUPPETEER
        // =================================================

        browser = await puppeteer.launch({

            headless: true,

            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox"
            ]

        });


        const page = await browser.newPage();


        // =================================================
        // DATA
        // =================================================

        const matchScore =
            report.matchScore ??
            report.match_score ??
            0;


        const matchVerdict =
            report.matchVerdict ??
            report.match_verdict ??
            "Good Match";


        const matchExplanation =
            report.matchExplanation ??
            report.match_explanation ??
            "";


        const candidateSummary =
            report.candidateSummary ??
            report.candidate_summary ??
            "";


        const readinessScore =
            report.readinessScore ??
            report.readiness_score ??
            0;


        const readinessSummary =
            report.readinessSummary ??
            report.readiness_summary ??
            "";


        const focusAreas =
            report.focusAreas ??
            report.focus_areas ??
            [];


        const strengths =
            report.strengths ??
            [];


        const technicalQuestions =
            report.technicalQuestions ??
            report.technical_questions ??
            [];


        const behaviouralQuestions =
            report.behaviourQuestions ??
            report.behaviorQuestions ??
            report.behaviouralQuestions ??
            report.behavioral_questions ??
            [];


        const skillGaps =
            report.skillGaps ??
            report.skill_gaps ??
            [];


        const roadmap =
            report.preparationPlan ??
            report.preparation_plan ??
            report.roadmap ??
            [];


        // =================================================
        // CANDIDATE DETAILS
        // =================================================

        const candidate =
            extractCandidateInfo(
                report.resume || ""
            );


        // =================================================
        // JOB TITLE
        // =================================================

        let targetRole = "Target Position";

        if (report.jobDescription) {

            const jobText =
                String(report.jobDescription)
                    .trim();

            if (jobText.length <= 100) {

                targetRole = jobText;

            } else {

                const firstLine =
                    jobText
                        .split(/\r?\n/)
                        .map(line => line.trim())
                        .find(Boolean);

                if (firstLine) {
                    targetRole = firstLine;
                }

            }

        }


        // =================================================
        // STRENGTHS HTML
        // =================================================

        const strengthsHtml =
            strengths.length
                ? strengths.map(strength => {

                    const title =
                        strength?.title ??
                        strength?.name ??
                        "Strength";

                    const description =
                        strength?.description ??
                        "";

                    return `

                        <div class="strength-card">

                            <div class="strength-title">
                                ${escapeHtml(title)}
                            </div>

                            <div class="strength-description">
                                ${escapeHtml(description)}
                            </div>

                        </div>

                    `;

                }).join("")
                : `
                    <div class="empty-message">
                        No specific strengths were identified.
                    </div>
                `;


        // =================================================
        // SKILL GAPS HTML
        // =================================================

        const skillGapsHtml =
            skillGaps.length
                ? skillGaps.map(skill => {

                    const skillName =
                        skill?.skill ??
                        skill?.name ??
                        "Skill";


                    const currentLevel =
                        skill?.currentLevel ??
                        "Not specified";


                    const requiredLevel =
                        skill?.requiredLevel ??
                        "Not specified";


                    const gap =
                        skill?.gap ??
                        "";


                    const recommendation =
                        skill?.recommendation ??
                        "";


                    const severity =
                        skill?.severity ??
                        "Medium";


                    return `

                        <div class="skill-gap-card">

                            <div class="skill-gap-header">

                                <div class="skill-name">
                                    ${escapeHtml(skillName)}
                                </div>

                                <div class="severity ${severity.toLowerCase()}">
                                    ${escapeHtml(severity)}
                                </div>

                            </div>


                            <div class="skill-levels">

                                <div>
                                    <span>Current Level</span>
                                    <strong>
                                        ${escapeHtml(currentLevel)}
                                    </strong>
                                </div>

                                <div>
                                    <span>Required Level</span>
                                    <strong>
                                        ${escapeHtml(requiredLevel)}
                                    </strong>
                                </div>

                            </div>


                            ${
                                gap
                                    ? `
                                        <div class="skill-detail">

                                            <strong>Gap:</strong>

                                            ${escapeHtml(gap)}

                                        </div>
                                    `
                                    : ""
                            }


                            ${
                                recommendation
                                    ? `
                                        <div class="skill-detail recommendation">

                                            <strong>Recommendation:</strong>

                                            ${escapeHtml(recommendation)}

                                        </div>
                                    `
                                    : ""
                            }

                        </div>

                    `;

                }).join("")
                : `
                    <div class="empty-message">
                        No major skill gaps identified.
                    </div>
                `;


        // =================================================
        // TECHNICAL QUESTIONS HTML
        // =================================================

        const technicalQuestionsHtml =
            technicalQuestions.length
                ? technicalQuestions.map(
                    (question, index) => {

                        const questionText =
                            typeof question === "string"
                                ? question
                                : question?.question ??
                                  question?.text ??
                                  "";


                        const intention =
                            question?.intention ??
                            "";


                        const answer =
                            question?.answer ??
                            "";


                        const difficulty =
                            question?.difficulty ??
                            "Medium";


                        return `

                            <div class="question-card">

                                <div class="question-header">

                                    <span class="question-number">
                                        Q${index + 1}
                                    </span>

                                    <span class="difficulty ${difficulty.toLowerCase()}">
                                        ${escapeHtml(difficulty)}
                                    </span>

                                </div>


                                <div class="question-text">

                                    ${escapeHtml(questionText)}

                                </div>


                                ${
                                    intention
                                        ? `
                                            <div class="question-info">

                                                <strong>
                                                    What this evaluates
                                                </strong>

                                                <p>
                                                    ${escapeHtml(intention)}
                                                </p>

                                            </div>
                                        `
                                        : ""
                                }


                                ${
                                    answer
                                        ? `
                                            <div class="answer-box">

                                                <strong>
                                                    Suggested Answer
                                                </strong>

                                                <p>
                                                    ${escapeHtml(answer)}
                                                </p>

                                            </div>
                                        `
                                        : ""
                                }

                            </div>

                        `;

                    }
                ).join("")
                : `
                    <div class="empty-message">
                        No technical questions available.
                    </div>
                `;


        // =================================================
        // BEHAVIOURAL QUESTIONS HTML
        // =================================================

        const behaviouralQuestionsHtml =
            behaviouralQuestions.length
                ? behaviouralQuestions.map(
                    (question, index) => {

                        const questionText =
                            typeof question === "string"
                                ? question
                                : question?.question ??
                                  question?.text ??
                                  "";


                        const intention =
                            question?.intention ??
                            "";


                        const answer =
                            question?.answer ??
                            "";


                        const difficulty =
                            question?.difficulty ??
                            "Medium";


                        return `

                            <div class="question-card">

                                <div class="question-header">

                                    <span class="question-number">
                                        Q${index + 1}
                                    </span>

                                    <span class="difficulty ${difficulty.toLowerCase()}">
                                        ${escapeHtml(difficulty)}
                                    </span>

                                </div>


                                <div class="question-text">

                                    ${escapeHtml(questionText)}

                                </div>


                                ${
                                    intention
                                        ? `
                                            <div class="question-info">

                                                <strong>
                                                    What this evaluates
                                                </strong>

                                                <p>
                                                    ${escapeHtml(intention)}
                                                </p>

                                            </div>
                                        `
                                        : ""
                                }


                                ${
                                    answer
                                        ? `
                                            <div class="answer-box">

                                                <strong>
                                                    Suggested Answer
                                                </strong>

                                                <p>
                                                    ${escapeHtml(answer)}
                                                </p>

                                            </div>
                                        `
                                        : ""
                                }

                            </div>

                        `;

                    }
                ).join("")
                : `
                    <div class="empty-message">
                        No behavioural questions available.
                    </div>
                `;


        // =================================================
        // PREPARATION ROADMAP HTML
        // =================================================

        const roadmapHtml =
            roadmap.length
                ? roadmap.map(
                    (item, index) => {

                        const day =
                            item?.day ??
                            index + 1;


                        const focus =
                            item?.focus ??
                            item?.title ??
                            "Preparation";


                        const tasks =
                            Array.isArray(item?.tasks)
                                ? item.tasks
                                : [];


                        return `

                            <div class="roadmap-card">

                                <div class="roadmap-day">

                                    DAY ${escapeHtml(day)}

                                </div>


                                <div class="roadmap-content">

                                    <h3>
                                        ${escapeHtml(focus)}
                                    </h3>


                                    ${
                                        tasks.length
                                            ? `
                                                <ul>

                                                    ${tasks.map(
                                                        task => `
                                                            <li>
                                                                ${escapeHtml(task)}
                                                            </li>
                                                        `
                                                    ).join("")}

                                                </ul>
                                            `
                                            : ""
                                    }

                                </div>

                            </div>

                        `;

                    }
                ).join("")
                : `
                    <div class="empty-message">
                        No preparation roadmap available.
                    </div>
                `;


        // =================================================
        // FOCUS AREAS HTML
        // =================================================

        const focusAreasHtml =
            focusAreas.length
                ? focusAreas.map(
                    area => `
                        <span class="focus-tag">
                            ${escapeHtml(area)}
                        </span>
                    `
                ).join("")
                : `
                    <span class="focus-tag">
                        General interview preparation
                    </span>
                `;


        // =================================================
        // CONTACT DETAILS
        // =================================================

        const contactParts = [];


        if (candidate.location) {

            contactParts.push(
                escapeHtml(candidate.location)
            );

        }


        if (candidate.phone) {

            contactParts.push(
                escapeHtml(candidate.phone)
            );

        }


        const contactLine =
            contactParts.join("  |  ");


        const socialParts = [];


        if (candidate.email) {

            socialParts.push(
                escapeHtml(candidate.email)
            );

        }


        if (candidate.linkedin) {

            socialParts.push(
                `<span>LinkedIn</span>`
            );

        }


        if (candidate.github) {

            socialParts.push(
                `<span>GitHub</span>`
            );

        }


        const socialLine =
            socialParts.join("  |  ");


        // =================================================
        // HTML
        // =================================================

        const html = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
    ${escapeHtml(candidate.name)} - Interview Preparation
</title>


<style>

* {
    box-sizing: border-box;
}


body {

    margin: 0;

    padding: 0;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    background: #ffffff;

    color: #1f2937;

    line-height: 1.55;

}


.container {

    width: 100%;

    max-width: 900px;

    margin: 0 auto;

    padding: 42px 48px;

}


/* =====================================================
   CANDIDATE HEADER
===================================================== */

.candidate-header {

    padding-bottom: 20px;

    border-bottom: 2px solid #374151;

}


.candidate-name {

    margin: 0;

    font-size: 31px;

    font-weight: 700;

    color: #111827;

}


.contact-line {

    margin-top: 7px;

    font-size: 12px;

    color: #4b5563;

}


.social-line {

    margin-top: 3px;

    font-size: 12px;

    color: #4b5563;

}


.target-role {

    margin-top: 12px;

    font-size: 14px;

    font-weight: 600;

    color: #374151;

}


/* =====================================================
   SECTIONS
===================================================== */

.section {

    margin-top: 27px;

}


.section-title {

    margin: 0 0 13px 0;

    padding-bottom: 6px;

    border-bottom: 1.5px solid #374151;

    font-size: 18px;

    font-weight: 700;

    color: #111827;

    text-transform: uppercase;

}


/* =====================================================
   SUMMARY
===================================================== */

.summary {

    font-size: 13px;

    color: #374151;

    text-align: justify;

}


/* =====================================================
   MATCH SCORE
===================================================== */

.match-box {

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 25px;

    padding: 20px;

    border: 1px solid #d1d5db;

    border-radius: 8px;

    background: #f9fafb;

}


.match-score {

    font-size: 40px;

    font-weight: 700;

    color: #111827;

}


.match-verdict {

    font-size: 17px;

    font-weight: 700;

    color: #111827;

}


.match-explanation {

    margin-top: 5px;

    font-size: 12px;

    color: #4b5563;

}


/* =====================================================
   STRENGTHS
===================================================== */

.strength-grid {

    display: grid;

    grid-template-columns: 1fr 1fr;

    gap: 12px;

}


.strength-card {

    padding: 13px;

    border-left: 3px solid #374151;

    background: #f9fafb;

}


.strength-title {

    font-weight: 700;

    font-size: 13px;

    color: #111827;

}


.strength-description {

    margin-top: 4px;

    font-size: 12px;

    color: #4b5563;

}


/* =====================================================
   SKILL GAPS
===================================================== */

.skill-gap-card {

    margin-bottom: 12px;

    padding: 15px;

    border: 1px solid #d1d5db;

    border-radius: 7px;

    page-break-inside: avoid;

}


.skill-gap-header {

    display: flex;

    justify-content: space-between;

    align-items: center;

}


.skill-name {

    font-size: 14px;

    font-weight: 700;

    color: #111827;

}


.severity {

    padding: 3px 9px;

    border-radius: 10px;

    font-size: 10px;

    font-weight: 700;

}


.severity.low {

    background: #ecfdf5;

    color: #047857;

}


.severity.medium {

    background: #fffbeb;

    color: #b45309;

}


.severity.high {

    background: #fef2f2;

    color: #b91c1c;

}


.skill-levels {

    display: grid;

    grid-template-columns: 1fr 1fr;

    gap: 15px;

    margin-top: 10px;

}


.skill-levels div {

    display: flex;

    flex-direction: column;

}


.skill-levels span {

    font-size: 10px;

    color: #6b7280;

    text-transform: uppercase;

}


.skill-levels strong {

    font-size: 12px;

    color: #374151;

}


.skill-detail {

    margin-top: 9px;

    font-size: 12px;

    color: #4b5563;

}


.recommendation {

    padding-top: 8px;

    border-top: 1px solid #e5e7eb;

}


/* =====================================================
   QUESTIONS
===================================================== */

.question-card {

    margin-bottom: 14px;

    padding: 16px;

    border: 1px solid #d1d5db;

    border-radius: 7px;

    page-break-inside: avoid;

}


.question-header {

    display: flex;

    align-items: center;

    justify-content: space-between;

}


.question-number {

    font-size: 13px;

    font-weight: 700;

    color: #111827;

}


.difficulty {

    padding: 3px 8px;

    border-radius: 10px;

    font-size: 10px;

    font-weight: 700;

}


.difficulty.easy {

    background: #ecfdf5;

    color: #047857;

}


.difficulty.medium {

    background: #fffbeb;

    color: #b45309;

}


.difficulty.hard {

    background: #fef2f2;

    color: #b91c1c;

}


.question-text {

    margin-top: 8px;

    font-size: 13px;

    font-weight: 600;

    color: #111827;

}


.question-info {

    margin-top: 11px;

    padding-top: 9px;

    border-top: 1px solid #e5e7eb;

}


.question-info strong,
.answer-box strong {

    font-size: 11px;

    color: #374151;

}


.question-info p,
.answer-box p {

    margin: 3px 0 0;

    font-size: 11px;

    color: #4b5563;

}


.answer-box {

    margin-top: 10px;

    padding: 10px;

    background: #f9fafb;

    border-radius: 5px;

}


/* =====================================================
   ROADMAP
===================================================== */

.roadmap-card {

    display: flex;

    gap: 18px;

    margin-bottom: 12px;

    padding: 14px;

    border: 1px solid #d1d5db;

    border-radius: 7px;

    page-break-inside: avoid;

}


.roadmap-day {

    min-width: 65px;

    font-size: 11px;

    font-weight: 700;

    color: #111827;

}


.roadmap-content {

    flex: 1;

}


.roadmap-content h3 {

    margin: 0;

    font-size: 14px;

    color: #111827;

}


.roadmap-content ul {

    margin: 6px 0 0 17px;

    padding: 0;

}


.roadmap-content li {

    margin-bottom: 3px;

    font-size: 11px;

    color: #4b5563;

}


/* =====================================================
   READINESS
===================================================== */

.readiness-box {

    padding: 18px;

    border: 1px solid #d1d5db;

    border-radius: 8px;

    background: #f9fafb;

}


.readiness-score {

    font-size: 34px;

    font-weight: 700;

    color: #111827;

}


.readiness-summary {

    margin-top: 5px;

    font-size: 12px;

    color: #4b5563;

}


.focus-tags {

    display: flex;

    flex-wrap: wrap;

    gap: 7px;

    margin-top: 12px;

}


.focus-tag {

    padding: 5px 9px;

    border: 1px solid #d1d5db;

    border-radius: 15px;

    font-size: 10px;

    color: #374151;

    background: #ffffff;

}


/* =====================================================
   EMPTY
===================================================== */

.empty-message {

    padding: 12px;

    font-size: 12px;

    color: #6b7280;

}


/* =====================================================
   FOOTER
===================================================== */

.footer {

    margin-top: 35px;

    padding-top: 12px;

    border-top: 1px solid #d1d5db;

    text-align: center;

    font-size: 10px;

    color: #9ca3af;

}


/* =====================================================
   PRINT
===================================================== */

@media print {

    body {
        background: white;
    }

    .container {
        padding: 20px 30px;
    }

}

</style>

</head>


<body>

<div class="container">


    <!-- =================================================
         CANDIDATE HEADER
    ================================================== -->

    <div class="candidate-header">

        <h1 class="candidate-name">
            ${escapeHtml(candidate.name)}
        </h1>


        ${
            contactLine
                ? `
                    <div class="contact-line">
                        ${contactLine}
                    </div>
                `
                : ""
        }


        ${
            socialLine
                ? `
                    <div class="social-line">
                        ${socialLine}
                    </div>
                `
                : ""
        }


        <div class="target-role">

            Target Role:
            ${escapeHtml(targetRole)}

        </div>

    </div>



    <!-- =================================================
         PROFESSIONAL SUMMARY
    ================================================== -->

    ${
        candidateSummary
            ? `

                <div class="section">

                    <h2 class="section-title">
                        Professional Summary
                    </h2>


                    <div class="summary">

                        ${escapeHtml(candidateSummary)}

                    </div>

                </div>

            `
            : ""
    }



    <!-- =================================================
         OVERALL MATCH
    ================================================== -->

    <div class="section">

        <h2 class="section-title">
            Overall Match
        </h2>


        <div class="match-box">

            <div>

                <div class="match-score">
                    ${escapeHtml(matchScore)}%
                </div>

            </div>


            <div style="flex:1">

                <div class="match-verdict">
                    ${escapeHtml(matchVerdict)}
                </div>


                ${
                    matchExplanation
                        ? `
                            <div class="match-explanation">

                                ${escapeHtml(matchExplanation)}

                            </div>
                        `
                        : ""
                }

            </div>

        </div>

    </div>



    <!-- =================================================
         KEY STRENGTHS
    ================================================== -->

    <div class="section">

        <h2 class="section-title">
            Key Strengths
        </h2>


        <div class="strength-grid">

            ${strengthsHtml}

        </div>

    </div>



    <!-- =================================================
         SKILL GAPS
    ================================================== -->

    <div class="section">

        <h2 class="section-title">
            Skill Gaps & Recommendations
        </h2>


        ${skillGapsHtml}

    </div>



    <!-- =================================================
         TECHNICAL QUESTIONS
    ================================================== -->

    <div class="section">

        <h2 class="section-title">
            Technical Interview Questions
        </h2>


        ${technicalQuestionsHtml}

    </div>



    <!-- =================================================
         BEHAVIOURAL QUESTIONS
    ================================================== -->

    <div class="section">

        <h2 class="section-title">
            Behavioural Interview Questions
        </h2>


        ${behaviouralQuestionsHtml}

    </div>



    <!-- =================================================
         PREPARATION ROADMAP
    ================================================== -->

    <div class="section">

        <h2 class="section-title">
            5-Day Preparation Roadmap
        </h2>


        ${roadmapHtml}

    </div>



    <!-- =================================================
         FINAL READINESS
    ================================================== -->

    <div class="section">

        <h2 class="section-title">
            Final Readiness
        </h2>


        <div class="readiness-box">

            <div class="readiness-score">

                ${escapeHtml(readinessScore)}%

            </div>


            ${
                readinessSummary
                    ? `
                        <div class="readiness-summary">

                            ${escapeHtml(readinessSummary)}

                        </div>
                    `
                    : ""
            }


            <div class="focus-tags">

                ${focusAreasHtml}

            </div>

        </div>

    </div>



    <!-- =================================================
         FOOTER
    ================================================== -->

    <div class="footer">

        Personalized interview preparation report

    </div>


</div>

</body>

</html>

        `;


        // =================================================
        // SET HTML
        // =================================================

        await page.setContent(html, {

            waitUntil: "networkidle0"

        });


        // =================================================
        // GENERATE PDF
        // =================================================

        const pdf =
            await page.pdf({

                format: "A4",

                printBackground: true,

                preferCSSPageSize: true,

                margin: {

                    top: "18mm",

                    right: "14mm",

                    bottom: "18mm",

                    left: "14mm"

                }

            });


        return pdf;


    } catch (error) {

        console.error(
            "PDF Generation Error:",
            error
        );

        throw error;


    } finally {

        if (browser) {

            await browser.close();

        }

    }

};


export default generateInterviewReportPDF;