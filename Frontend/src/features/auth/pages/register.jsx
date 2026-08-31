import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import React, { useState } from "react";

const Register = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {
        loading,
        handleRegister
    } = useAuth();


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await handleRegister({
                username,
                email,
                password
            });

            navigate("/");

        } catch (err) {

            console.log(
                "Register failed:",
                err.response?.data || err.message
            );

        }
    };


    // =====================================================
    // PREMIUM LOADING SCREEN
    // =====================================================

    if (loading) {

        return (
            <main className="auth-loading">

                <div className="loader-orbit">

                    <div className="loader-ring ring-one"></div>

                    <div className="loader-ring ring-two"></div>

                    <div className="loader-ring ring-three"></div>

                    <div className="loader-core">
                        <span>✦</span>
                    </div>

                    <div className="loader-dot dot-one"></div>
                    <div className="loader-dot dot-two"></div>
                    <div className="loader-dot dot-three"></div>

                </div>


                <div className="loading-content">

                    <h2>
                        Creating your account
                        <span className="loading-dots">
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                        </span>
                    </h2>

                    <p>
                        Setting things up for you
                    </p>

                    <div className="loading-progress">
                        <span></span>
                    </div>

                </div>

            </main>
        );
    }


    return (
        <main className="auth-page">

            <div className="auth-background-glow glow-one"></div>
            <div className="auth-background-glow glow-two"></div>


            <div className="form-container">

                {/* AUTH ICON */}

                <div className="auth-icon">
                    <span>✦</span>
                </div>


                <h1>
                    Create Account
                </h1>


                <p className="auth-subtitle">
                    Create your account and start preparing
                    for your next interview.
                </p>


                <form onSubmit={handleSubmit}>

                    {/* USERNAME */}

                    <div className="input-group">

                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter Your Username"
                            autoComplete="username"
                            required
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="input-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter Your Email Here"
                            autoComplete="email"
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="input-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter Your Password Here"
                            autoComplete="new-password"
                            required
                        />

                    </div>


                    {/* REGISTER BUTTON */}

                    <button
                        type="submit"
                        className="button primary-button"
                        disabled={loading}
                    >
                        Create Account
                    </button>

                </form>


                {/* LOGIN LINK */}

                <p className="auth-switch">

                    Already have an account?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </main>
    );
};

export default Register;