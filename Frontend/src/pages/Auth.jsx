import { useState } from "react"
import API from "../services/api"
import "./Auth.css"

export default function Auth() {

  // ==============================
  // TOGGLE LOGIN / REGISTER
  // ==============================

  const [isLogin, setIsLogin] = useState(true)

  // ==============================
  // FORM STATE
  // ==============================

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  })

  // ==============================
  // HANDLE INPUT CHANGE
  // ==============================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  // ==============================
  // HANDLE FORM SUBMIT
  // ==============================

  const handleSubmit = async () => {

    try {

      // =====================================
      // LOGIN
      // =====================================

      if (isLogin) {

        const res = await API.post(
          "/auth/login",
          {
            email: form.email,
            password: form.password
          }
        )

        alert(res.data.message)

        // SAVE AUTH DATA
        localStorage.setItem(
          "token",
          res.data.token
        )

        localStorage.setItem(
          "email",
          res.data.email
        )

        localStorage.setItem(
          "role",
          res.data.role
        )

        // ADMIN REDIRECT
        if (res.data.role === "admin") {

          window.location.href = "/admin"
        }

        // USER REDIRECT
        else {

          window.location.href = "/dashboard"
        }
      }

      // =====================================
      // REGISTER
      // =====================================

      else {

        const res = await API.post(
          "/auth/register",
          form
        )

        alert(res.data.message)

        // SWITCH BACK TO LOGIN
        setIsLogin(true)
      }

      // =====================================
      // CLEAR FORM
      // =====================================

      setForm({
        username: "",
        email: "",
        password: ""
      })

    }

    catch (err) {

      alert(
        err.response?.data?.message ||
        "Error"
      )

      // CLEAR FORM ON ERROR
      setForm({
        username: "",
        email: "",
        password: ""
      })
    }
  }

  // ==============================
  // UI
  // ==============================

  return (

    <div className="auth-wrapper">
     <div className="particles">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>
      <div className="auth-card">

        {/* LEFT SIDE */}
        <div className="auth-left">
  <div className="overlay-text">
    <h1>CYBERSHIELD</h1>

    <p>
      AI Powered Cybersecurity Platform
      with Real-Time Threat Detection,
      Live Attack Monitoring and
      IP Intelligence Tracking.
    </p>
  </div>
</div>

        {/* RIGHT SIDE */}
        <div className="auth-right">

          <h1>
            {isLogin
              ? "Welcome Back"
              : "Create Account"}
          </h1>

          <p>
            Secure Authentication Portal
          </p>

          {/* USERNAME */}
          {!isLogin && (

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />
          )}

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          {/* BUTTON */}
          <button onClick={handleSubmit}>

            {isLogin
              ? "Login"
              : "Register"}

          </button>

          {/* TOGGLE */}
          <p className="toggle-text">

            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

          </p>

          <span
            className="link"
            onClick={() => {

              setIsLogin(!isLogin)

              // CLEAR FORM WHEN SWITCHING
              setForm({
                username: "",
                email: "",
                password: ""
              })
            }}
          >

            {isLogin
              ? "Sign Up"
              : "Login"}

          </span>

        </div>

      </div>

    </div>
  )
}