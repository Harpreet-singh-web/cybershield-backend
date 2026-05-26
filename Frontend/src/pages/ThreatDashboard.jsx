import { useEffect, useState }
from "react"

import API from "../services/api"

import "./ThreatDashboard.css"

import ThreatGlobe from "../components/ThreatGlobe.jsx"

export default function ThreatDashboard(){

  const [logs, setLogs] = useState([])

  const email =
    localStorage.getItem("selectedUser")

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

    <div className="threat-dashboard">

      <div className="top-bar">

        <h1>
          Threat Intelligence Dashboard
        </h1>

        <p>
          Monitoring:
          <span>{email}</span>
        </p>

      </div>

      {/* ======================
          STATS
      ====================== */}

      <div className="stats-grid">

        <div className="threat-card">

          <h2>Total Activity</h2>

          <p>{logs.length}</p>

        </div>

        <div className="threat-card success">

          <h2>Successful Logins</h2>

          <p>{success}</p>

        </div>

        <div className="threat-card failed">

          <h2>Attack Attempts</h2>

          <p>{failed}</p>

        </div>

      </div>

      {/* ======================
          LIVE ATTACK MAP
      ====================== */}

      <div className="map-section">

        <h2>Live Threat Map</h2>

        <ThreatGlobe />

      </div>

      {/* ======================
          BLOCKED IPS
      ====================== */}

      <div className="blocked-section">

        <h2>
          Blocked IP Addresses
        </h2>

        {logs
          .filter(log =>
            log.status === "failed"
          )
          .map((log, index) => (

            <div
              className="blocked-card"
              key={index}
            >

              <p>
                {log.ipAddress}
              </p>

              <button>
                Unblock
              </button>

            </div>
        ))}

      </div>

      {/* ======================
          RECENT ACTIVITY
      ====================== */}

      <div className="activity-section">

        <h2>
          Security Activity
        </h2>

        {logs.map((log, index) => (

          <div
            className="activity-card"
            key={index}
          >

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
              {new Date(
                log.timestamp
              ).toLocaleString()}
            </p>

          </div>
        ))}

      </div>

    </div>
  )
}