import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import React, { useState } from "react";
import "../auth.form.scss";

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { loading, handleLogin } = useAuth();


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await handleLogin({
                email,
                password
            });

            navigate("/");

        } catch (error) {

            alert(
                error?.response?.data?.message ||
                "Login failed. Please try again."
            );

        }

    };


    // =====================================================
    // ANIMATED LOGIN LOADER
    // =====================================================

    if (loading) {

        return (

            <main className="auth-loading">

                <div className="ai-loader">

                    <div className="ai-loader-ring"></div>

                    <div className="ai-loader-core">
                        ✦
                    </div>

                </div>


                <h2>
                    Authenticating
                    <span className="loading-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                </h2>


                <p className="loading-message">
                    Securing your account...
                </p>


                <div className="loading-progress">
                    <span></span>
                </div>


                <small>
                    Please wait a moment
                </small>

            </main>

        );

    }


    return (

        <main className="auth-page">

            <div className="form-container">

                <div className="auth-icon">
                    ✦
                </div>


                <h1>
                    Welcome Back
                </h1>


                <p className="auth-subtitle">
                    Login to continue your interview journey
                </p>


                <form onSubmit={handleSubmit}>


                    {/* EMAIL */}

                    <div className="input-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter Your Email Here"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="input-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter Your Password Here"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>


                    <button
                        className="button primary-button"
                        type="submit"
                        disabled={loading}
                    >
                        Login
                    </button>


                </form>


                <p className="auth-switch">

                    Don't Have An Account?

                    {" "}

                    <Link to="/register">
                        Register
                    </Link>

                </p>


            </div>

        </main>

    );

};


export default Login;