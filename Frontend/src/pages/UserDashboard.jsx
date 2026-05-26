import { useEffect, useState } from "react"
import API from "../services/api"
import "./UserDashboard.css"

export default function UserDashboard(){

  const [logs, setLogs] = useState([])

 const email =
  localStorage.getItem("selectedUser")
  ||
  localStorage.getItem("email")

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {

    try{

      const res = await API.get("/logs")

      const userLogs = res.data.filter(
        log => log.email === email
      )

      setLogs(userLogs)

    } catch(err){
      console.log(err)
    }
  }

  const success = logs.filter(
    log => log.status === "success"
  ).length

  const failed = logs.filter(
    log => log.status === "failed"
  ).length

  return (

    <div className="user-dashboard">

      <h1>
        Welcome Back
      </h1>

      <p className="subtitle">
        Security Activity Overview
      </p>

      <div className="dashboard-cards">

        <div className="card">
          <h2>Total Activity</h2>
          <p>{logs.length}</p>
        </div>

        <div className="card success">
          <h2>Successful Logins</h2>
          <p>{success}</p>
        </div>

        <div className="card failed">
          <h2>Failed Attempts</h2>
          <p>{failed}</p>
        </div>

      </div>

      <div className="activity-section">

        <h2>Recent Activity</h2>

        {logs.map((log, index) => (

          <div className="activity-card" key={index}>

            <p>
              <strong>Status:</strong>
              {log.status}
            </p>

            <p>
              <strong>IP:</strong>
              {log.ipAddress}
            </p>

            <p>
              <strong>Time:</strong>
              {new Date(log.timestamp)
                .toLocaleString()}
            </p>

          </div>
        ))}

      </div>

    </div>
  )
}