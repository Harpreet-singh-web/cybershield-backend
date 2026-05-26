import Globe from "react-globe.gl"

import { useEffect, useState } from "react"

import API from "../services/api"

import "./ThreatGlobe.css"

export default function ThreatGlobe(){

  const [attacks, setAttacks] = useState([])

  useEffect(()=>{

    fetchAttacks()

  },[])

  const fetchAttacks = async()=>{

    try{

      const res = await API.get(
        "/map/attacks"
      )

      const formatted = res.data
      .filter(
        attack =>
          attack.lat &&
          attack.lon
      )
      .map(attack => ({

        lat: attack.lat,

        lng: attack.lon,

        size: 0.4,

        color:
          attack.status === "failed"
          ? "#ff0033"
          : "#00ff99",

        email: attack.email,

        city: attack.city,

        country: attack.country,

        ip: attack.ipAddress

      }))

      setAttacks(formatted)

    }catch(err){

      console.log(err)

    }

  }

  return(

    <div className="globe-container">

      <h2 className="globe-title">
        Live Global Threat Intelligence
      </h2>

      <Globe

        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"

        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

        pointsData={attacks}

        pointAltitude="size"

        pointColor="color"

        pointRadius={0.5}

        pointLabel={d => `

          <div style="color:white">

            <b>${d.email}</b><br/>

            ${d.city}, ${d.country}<br/>

            IP: ${d.ip}

          </div>

        `}

      />

    </div>
  )
}