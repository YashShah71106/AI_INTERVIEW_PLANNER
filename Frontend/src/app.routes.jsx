import { createBrowserRouter } from "react-router";

import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";

import Protected from "./features/auth/components/protected.jsx";

import Home from "./features/interview/pages/Home.jsx";
import Interview from "./features/interview/pages/interview.jsx";

import {
    InterviewProvider
} from "./features/interview/styles/interview.context.jsx";


export const router = createBrowserRouter([

    // =====================================================
    // AUTH ROUTES
    // =====================================================

    {
        path: "/login",
        element: <Login />,
    },

    {
        path: "/register",
        element: <Register />,
    },


    // =====================================================
    // HOME
    // =====================================================

    {
        path: "/",
        element: (
            <Protected>

                <InterviewProvider>

                    <Home />

                </InterviewProvider>

            </Protected>
        ),
    },


    // =====================================================
    // INTERVIEW REPORT
    // =====================================================

    {
        path: "/interview/:interviewId",
        element: (
            <Protected>

                <InterviewProvider>

                    <Interview />

                </InterviewProvider>

            </Protected>
        ),
    },

]);