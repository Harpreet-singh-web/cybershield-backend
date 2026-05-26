import { useEffect, useState }
from "react"

import API from "../services/api"

import "./Dashboard.css"



export default function Dashboard(){

  const [users, setUsers] = useState([])

  const [logs, setLogs] = useState([])

  useEffect(() => {

    fetchUsers()
    fetchLogs()

  }, [])

  // =========================
  // FETCH USERS
  // =========================

  const fetchUsers = async () => {

    try{

      const res = await API.get("/users")

      setUsers(res.data)

    } catch(err){

      console.log(err)
    }
  }

  // =========================
  // FETCH LOGS
  // =========================

  const fetchLogs = async () => {

    try{

      const res = await API.get("/logs")

      setLogs(res.data)

    } catch(err){

      console.log(err)
    }
  }

  // =========================
  // USER STATS
  // =========================

  const getUserStats = (email) => {

    const userLogs = logs.filter(
      log => log.email === email
    )

    const success = userLogs.filter(
      log => log.status === "success"
    ).length

    const failed = userLogs.filter(
      log => log.status === "failed"
    ).length

    return {
      total: userLogs.length,
      success,
      failed
    }
  }

  // =========================
  // OPEN USER DASHBOARD
  // =========================

  const openUserDashboard = (email) => {

    localStorage.setItem(
      "selectedUser",
      email
    )

    window.location.href =
      "/threat-dashboard"
  }

  return (

    <div className="admin-dashboard">

      <h1>
        CyberShield Admin Panel
      </h1>

      <p className="subtitle">
        Monitor all registered accounts
      </p>

      <div className="users-grid">

        {users.map((user, index) => {

          const stats =
            getUserStats(user.email)

          return (

            <div
              className="user-card"
              key={index}
            >

              <h2>
                {user.username}
              </h2>

              <p className="email">
                {user.email}
              </p>

              <div className="stats">

                <div>
                  <span>Total</span>
                  <h3>{stats.total}</h3>
                </div>

                <div>
                  <span>Success</span>
                  <h3 className="success">
                    {stats.success}
                  </h3>
                </div>

                <div>
                  <span>Failed</span>
                  <h3 className="failed">
                    {stats.failed}
                  </h3>
                </div>

              </div>

              <button
                onClick={() =>
                  openUserDashboard(
                    user.email
                  )
                }
              >

                Open Dashboard

              </button>

            </div>
          )
        })}

      </div>

    </div>
  )
}