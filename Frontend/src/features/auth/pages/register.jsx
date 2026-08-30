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


    if (loading) {

        return (
            <main>
                <h1>Loading...</h1>
            </main>
        );
    }


    return (
        <main>

            <div className="form-container">

                <h1>Register</h1>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">

                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter Your Username"
                            required
                        />

                    </div>


                    <div className="input-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter Your Email Here"
                            required
                        />

                    </div>


                    <div className="input-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter Your Password Here"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="button primary-button"
                    >
                        Register
                    </button>

                </form>


                <p>
                    Already Have An Account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>

        </main>
    );
};

export default Register;