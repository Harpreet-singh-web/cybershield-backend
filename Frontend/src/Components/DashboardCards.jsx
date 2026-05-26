import "./DashboardCards.css"

export default function DashboardCards({ total, success, failed }) {
  return (
    <div className="cards">
      <div className="card total">
        <h3>Total Logins</h3>
        <p>{total}</p>
      </div>

      <div className="card success">
        <h3>Successful</h3>
        <p>{success}</p>
      </div>

      <div className="card failed">
        <h3>Failed</h3>
        <p>{failed}</p>
      </div>
    </div>
  )
}