import mongoose from "mongoose";


// =====================================================
// TECHNICAL QUESTIONS
// =====================================================

const technicalQuestionsSchema = new mongoose.Schema({

    question: {
        type: String,
        required: [true, "Technical Question Is Required"]
    },

    intention: {
        type: String,
        required: [true, "Intention Is Required"]
    },

    answer: {
        type: String,
        required: [true, "Answer Is Required"]
    },

    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: [true, "Difficulty Is Required"]
    }

}, { _id: false });


// =====================================================
// BEHAVIOURAL QUESTIONS
// =====================================================

const behaviourQuestionSchema = new mongoose.Schema({

    question: {
        type: String,
        required: [true, "Behavioural Question Is Required"]
    },

    intention: {
        type: String,
        required: [true, "Intention Is Required"]
    },

    answer: {
        type: String,
        required: [true, "Answer Is Required"]
    },

    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: [true, "Difficulty Is Required"]
    }

}, { _id: false });


// =====================================================
// SKILL GAP
// =====================================================

const skillGapSchema = new mongoose.Schema({

    skill: {
        type: String,
        required: [true, "Skill Is Required"]
    },

    currentLevel: {
        type: String,
        required: [true, "Current Level Is Required"]
    },

    requiredLevel: {
        type: String,
        required: [true, "Required Level Is Required"]
    },

    gap: {
        type: String,
        required: [true, "Skill Gap Description Is Required"]
    },

    recommendation: {
        type: String,
        required: [true, "Recommendation Is Required"]
    },

    severity: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: [true, "Severity Is Required"]
    }

}, { _id: false });


// =====================================================
// PREPARATION PLAN
// =====================================================

const preparationPlanSchema = new mongoose.Schema({

    day: {
        type: Number,
        required: [true, "Day Is Required"]
    },

    focus: {
        type: String,
        required: [true, "Focus Is Required"]
    },

    tasks: [{
        type: String,
        required: [true, "Task Is Required"]
    }]

}, { _id: false });


// =====================================================
// STRENGTHS
// =====================================================

const strengthSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Strength Title Is Required"]
    },

    description: {
        type: String,
        required: [true, "Strength Description Is Required"]
    }

}, { _id: false });


// =====================================================
// INTERVIEW REPORT
// =====================================================

const interViewSchema = new mongoose.Schema({

    // -------------------------------------------------
    // JOB INFORMATION
    // -------------------------------------------------

    jobDescription: {
        type: String,
        required: [true, "Job Description Is Required"]
    },


    // -------------------------------------------------
    // CANDIDATE INFORMATION
    // -------------------------------------------------

    resume: {
        type: String
    },

    selfDescription: {
        type: String
    },


    // -------------------------------------------------
    // CANDIDATE SUMMARY
    // -------------------------------------------------

    candidateSummary: {
        type: String,
        required: [true, "Candidate Summary Is Required"]
    },


    // -------------------------------------------------
    // MATCH SCORE
    // -------------------------------------------------

    matchScore: {
        type: Number,
        min: 0,
        max: 100,
        required: [true, "Match Score Is Required"]
    },

    matchVerdict: {
        type: String,
        required: [true, "Match Verdict Is Required"]
    },

    matchExplanation: {
        type: String,
        required: [true, "Match Explanation Is Required"]
    },


    // -------------------------------------------------
    // STRENGTHS
    // -------------------------------------------------

    strengths: [
        strengthSchema
    ],


    // -------------------------------------------------
    // TECHNICAL QUESTIONS
    // -------------------------------------------------

    technicalQuestions: [
        technicalQuestionsSchema
    ],


    // -------------------------------------------------
    // BEHAVIOURAL QUESTIONS
    // -------------------------------------------------

    behaviourQuestions: [
        behaviourQuestionSchema
    ],


    // -------------------------------------------------
    // SKILL GAPS
    // -------------------------------------------------

    skillGaps: [
        skillGapSchema
    ],


    // -------------------------------------------------
    // PREPARATION PLAN
    // -------------------------------------------------

    preparationPlan: [
        preparationPlanSchema
    ],


    // -------------------------------------------------
    // FINAL READINESS
    // -------------------------------------------------

    readinessScore: {
        type: Number,
        min: 0,
        max: 100,
        required: [true, "Readiness Score Is Required"]
    },

    readinessSummary: {
        type: String,
        required: [true, "Readiness Summary Is Required"]
    },

    focusAreas: [{
        type: String
    }],


    // -------------------------------------------------
    // USER
    // -------------------------------------------------

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }

}, {
    timestamps: true
});


// =====================================================
// MODEL
// =====================================================

export const interViewReportModel =
    mongoose.model(
        "InterviewReport",
        interViewSchema
    );