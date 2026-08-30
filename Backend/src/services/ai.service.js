import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";


// =====================================================
// GEMINI CONFIG
// =====================================================

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});


// =====================================================
// INTERVIEW REPORT SCHEMA
// This schema MUST match interViewReport.model.js
// =====================================================

const interviewReportSchema = z.object({

    // =================================================
    // CANDIDATE SUMMARY
    // =================================================

    candidateSummary: z.string(),


    // =================================================
    // MATCH INFORMATION
    // =================================================

    matchScore: z
        .number()
        .min(0)
        .max(100),

    matchVerdict: z.string(),

    matchExplanation: z.string(),


    // =================================================
    // STRENGTHS
    // =================================================

    strengths: z
        .array(
            z.object({

                title: z.string(),

                description: z.string()

            })
        )
        .min(3),


    // =================================================
    // TECHNICAL QUESTIONS
    // =================================================

    technicalQuestions: z
        .array(
            z.object({

                question: z.string(),

                intention: z.string(),

                answer: z.string(),

                difficulty: z.enum([
                    "Easy",
                    "Medium",
                    "Hard"
                ])

            })
        )
        .min(5),


    // =================================================
    // BEHAVIOURAL QUESTIONS
    // =================================================

    behaviourQuestions: z
        .array(
            z.object({

                question: z.string(),

                intention: z.string(),

                answer: z.string(),

                difficulty: z.enum([
                    "Easy",
                    "Medium",
                    "Hard"
                ])

            })
        )
        .min(5),


    // =================================================
    // SKILL GAPS
    // =================================================

    skillGaps: z
        .array(
            z.object({

                skill: z.string(),

                currentLevel: z.string(),

                requiredLevel: z.string(),

                gap: z.string(),

                recommendation: z.string(),

                severity: z.enum([
                    "Low",
                    "Medium",
                    "High"
                ])

            })
        )
        .min(3),


    // =================================================
    // PREPARATION PLAN
    // =================================================

    preparationPlan: z
        .array(
            z.object({

                day: z.coerce.number(),

                focus: z.string(),

                tasks: z
                    .array(z.string())
                    .min(1)

            })
        )
        .min(5),


    // =================================================
    // READINESS
    // =================================================

    readinessScore: z
        .number()
        .min(0)
        .max(100),

    readinessSummary: z.string(),


    // =================================================
    // FOCUS AREAS
    // =================================================

    focusAreas: z
        .array(z.string())
        .min(3)

});


// =====================================================
// GENERATE INTERVIEW REPORT
// =====================================================

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    try {

        const prompt = `

You are an expert technical interviewer, hiring manager,
career coach and recruitment specialist.

Analyze the candidate's resume, self description and
target job description.

Create a professional and easy-to-understand
Interview Preparation Report.

The report will be shown to both technical and
non-technical users.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do NOT return markdown.
3. Do NOT use code fences.
4. Do NOT add explanations outside JSON.
5. Every required field MUST be present.
6. Never return undefined.
7. Never return null.
8. Follow the exact JSON structure provided below.
9. Use simple professional language.
10. Do not invent experience that is not supported by
   the resume or self description.


=====================================================
1. CANDIDATE SUMMARY
=====================================================

Create a professional summary of the candidate.

Include:

- Overall experience
- Main strengths
- Important technologies
- Relevant work experience
- Relevant projects
- Overall suitability for the target role

Write this so a non-technical person can understand it.

Do not simply copy the resume.


=====================================================
2. MATCH SCORE
=====================================================

Calculate a match score from 0 to 100.

Consider:

- Technical skills
- Experience
- Projects
- Job requirements
- Frontend skills
- Backend skills
- Database skills
- Tools
- Architecture knowledge
- Overall relevance

100 = excellent match.

Also provide:

matchVerdict

Examples:

"Excellent Match"
"Strong Match"
"Good Match"
"Partial Match"
"Needs Improvement"

The verdict must be based on the match score.


=====================================================
3. MATCH EXPLANATION
=====================================================

Explain why the candidate received the match score.

Mention:

- Skills that match the job
- Experience that matches the job
- Important missing skills
- Overall suitability

Use simple language.


=====================================================
4. STRENGTHS
=====================================================

Generate at least 3 candidate strengths.

Each strength MUST contain:

title
description

Example:

{
    "title": "Strong Backend Development",
    "description": "The candidate has practical experience building REST APIs using Node.js and Express."
}

Do not invent strengths that are unsupported.


=====================================================
5. TECHNICAL QUESTIONS
=====================================================

Generate at least 5 realistic technical interview questions.

Questions must be relevant to:

- Candidate's resume
- Target job
- Candidate's skills
- Candidate's experience

Each question MUST contain:

question
intention
answer
difficulty

difficulty MUST be exactly:

"Easy"
"Medium"
"Hard"

The intention explains what the interviewer is testing.

The answer should explain what a strong candidate should say.

Make answers useful for interview preparation.


=====================================================
6. BEHAVIOURAL QUESTIONS
=====================================================

Generate at least 5 realistic behavioural interview questions.

Questions should be relevant to:

- Work experience
- Team collaboration
- Problem solving
- Deadlines
- Conflict
- Leadership
- Communication
- Failure or challenges

Each question MUST contain:

question
intention
answer
difficulty

difficulty MUST be exactly:

"Easy"
"Medium"
"Hard"

Answers should be practical interview-style answers.


=====================================================
7. SKILL GAPS
=====================================================

Identify at least 3 important skill gaps.

Each skill gap MUST contain:

skill
currentLevel
requiredLevel
gap
recommendation
severity

severity MUST be exactly:

"Low"
"Medium"
"High"

currentLevel should describe the candidate's current
ability based on the available information.

requiredLevel should describe the level needed for the
target job.

gap should explain what is missing.

recommendation should explain how to improve.


=====================================================
8. PREPARATION PLAN
=====================================================

Create a minimum 5-day interview preparation plan.

Each day MUST contain:

day
focus
tasks

The day MUST be a number.

Correct:

1
2
3
4
5

Incorrect:

"Day 1"
"Day 2"

Each day should have at least 3 practical tasks.

The preparation plan should be personalized according
to the candidate's skill gaps and target job.


=====================================================
9. READINESS SCORE
=====================================================

Give an interview readiness score from 0 to 100.

This is DIFFERENT from matchScore.

matchScore =
How well the candidate matches the job.

readinessScore =
How prepared the candidate currently appears for the
interview.


=====================================================
10. READINESS SUMMARY
=====================================================

Explain:

- What the candidate is already prepared for
- What may cause difficulty
- What should be revised
- What should be practiced before the interview

Use simple professional language.


=====================================================
11. FOCUS AREAS
=====================================================

Provide at least 3 important areas the candidate should
focus on before the interview.

Examples:

- React
- Node.js
- Express
- MongoDB
- Authentication
- REST APIs
- System Design
- Docker
- Testing
- Deployment

Choose areas based on the candidate and target job.


=====================================================
EXACT JSON STRUCTURE
=====================================================

{
    "candidateSummary": "Professional summary here",

    "matchScore": 82,

    "matchVerdict": "Strong Match",

    "matchExplanation": "The candidate has strong experience in the core technologies required for the role, but should improve system design and testing knowledge.",

    "strengths": [
        {
            "title": "Strong Full Stack Development",
            "description": "The candidate has practical experience working with frontend, backend and database technologies."
        },
        {
            "title": "Backend Experience",
            "description": "The candidate has experience developing APIs and backend services."
        },
        {
            "title": "Problem Solving",
            "description": "The candidate has demonstrated experience solving application and performance-related problems."
        }
    ],

    "technicalQuestions": [
        {
            "question": "How does the Node.js event loop work?",
            "intention": "To evaluate understanding of asynchronous programming in Node.js.",
            "answer": "A strong answer should explain how Node.js handles asynchronous operations using the event loop and callbacks, promises or async/await.",
            "difficulty": "Medium"
        }
    ],

    "behaviourQuestions": [
        {
            "question": "Tell me about a difficult technical problem you solved.",
            "intention": "To evaluate problem-solving ability and communication.",
            "answer": "The candidate should describe the situation, explain the problem, discuss the actions taken and describe the result.",
            "difficulty": "Medium"
        }
    ],

    "skillGaps": [
        {
            "skill": "System Design",
            "currentLevel": "Basic understanding",
            "requiredLevel": "Intermediate to Advanced",
            "gap": "The candidate needs more experience designing scalable systems.",
            "recommendation": "Practice designing REST APIs, caching, databases, load balancing and scalable architectures.",
            "severity": "Medium"
        }
    ],

    "preparationPlan": [
        {
            "day": 1,
            "focus": "Core Technical Fundamentals",
            "tasks": [
                "Revise JavaScript fundamentals",
                "Practice asynchronous programming",
                "Review common interview questions"
            ]
        },
        {
            "day": 2,
            "focus": "Backend Development",
            "tasks": [
                "Revise Node.js",
                "Practice Express.js APIs",
                "Review middleware and error handling"
            ]
        },
        {
            "day": 3,
            "focus": "Database and API Design",
            "tasks": [
                "Revise MongoDB",
                "Practice aggregation and indexing",
                "Review REST API design"
            ]
        },
        {
            "day": 4,
            "focus": "System Design and Security",
            "tasks": [
                "Practice basic system design",
                "Revise authentication and authorization",
                "Review JWT and security concepts"
            ]
        },
        {
            "day": 5,
            "focus": "Mock Interview",
            "tasks": [
                "Practice technical questions",
                "Practice behavioural questions",
                "Complete a full mock interview"
            ]
        }
    ],

    "readinessScore": 75,

    "readinessSummary": "The candidate has a good foundation for the role but should revise system design, security and practical interview questions before the interview.",

    "focusAreas": [
        "Node.js and Express",
        "MongoDB",
        "System Design",
        "Authentication"
    ]
}


=====================================================
CANDIDATE RESUME
=====================================================

${resume || "No resume provided."}


=====================================================
SELF DESCRIPTION
=====================================================

${selfDescription || "No self description provided."}


=====================================================
TARGET JOB DESCRIPTION
=====================================================

${jobDescription}


=====================================================
FINAL CHECK
=====================================================

Before returning the response, verify that:

- candidateSummary exists
- matchScore exists
- matchVerdict exists
- matchExplanation exists
- strengths exists
- strengths has at least 3 items
- every strength has title and description
- technicalQuestions has at least 5 items
- every technical question has difficulty
- behaviourQuestions has at least 5 items
- every behavioural question has difficulty
- skillGaps has at least 3 items
- every skill gap has all 6 required fields
- preparationPlan has at least 5 days
- day is a number
- readinessScore exists
- readinessSummary exists
- focusAreas has at least 3 items

Return ONLY JSON.
`;


// =====================================================
// GEMINI REQUEST
// =====================================================

        const response = await ai.models.generateContent({

            model: "gemini-3-flash-preview",

            contents: prompt,

            config: {

                responseFormat: {

                    text: {

                        mimeType: "application/json",

                        schema:
                            zodToJsonSchema(
                                interviewReportSchema
                            )

                    }

                }

            }

        });


// =====================================================
// LOG GEMINI RESPONSE
// =====================================================

        console.log(
            "========== GEMINI RESPONSE =========="
        );

        console.log(response.text);

        console.log(
            "====================================="
        );


// =====================================================
// CLEAN RESPONSE
// =====================================================

        const cleanResponse =
            response.text
                .replace(
                    /^```json\s*/i,
                    ""
                )
                .replace(
                    /\s*```$/i,
                    ""
                )
                .trim();


// =====================================================
// PARSE JSON
// =====================================================

        const parsedResponse =
            JSON.parse(cleanResponse);


// =====================================================
// NORMALIZE PREPARATION PLAN
// =====================================================

        if (
            Array.isArray(
                parsedResponse.preparationPlan
            )
        ) {

            parsedResponse.preparationPlan =
                parsedResponse.preparationPlan.map(
                    (plan, index) => ({

                        ...plan,

                        day:
                            Number.isFinite(
                                Number(plan.day)
                            )
                                ? Number(plan.day)
                                : index + 1

                    })
                );

        }


// =====================================================
// NORMALIZE SCORES
// =====================================================

        parsedResponse.matchScore =
            Number(parsedResponse.matchScore);

        parsedResponse.readinessScore =
            Number(parsedResponse.readinessScore);


// =====================================================
// VALIDATE RESPONSE
// =====================================================

        const validatedResponse =
            interviewReportSchema.parse(
                parsedResponse
            );


        console.log(
            "========== REPORT VALIDATION SUCCESS =========="
        );


        return validatedResponse;


    } catch (error) {

        console.error(
            "AI Interview Report Generation Error:",
            error
        );

        throw error;

    }

}


// =====================================================
// EXPORT
// =====================================================

export default generateInterviewReport;