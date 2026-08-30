import "../auth.form.scss"
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";


const login = () => {
  const { loading, handleLogin } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin({ email, password });

      navigate("/");
    } catch (error) {
      console.log("Login failed:", error);
    }

  }

  if (loading) {
    return (<main>
      <h1>Loading...</h1>
    </main>)
  }
 

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => { setEmail(e.target.value) }} type="text" id='email' name='email' placeholder='Enter Your Email Here' />
          </div>


          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => { setPassword(e.target.value) }}
              type="text" id='password' name='password' placeholder='Enter Your Password Here' />
          </div>



          <button className='button primary-button'>Login</button>





        </form>
        <p>Don't Have An Account? <Link to={"/register"}>Register</Link></p>
      </div>
    </main>
  )
}

export default login