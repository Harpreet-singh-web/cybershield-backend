import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup
} from "react-leaflet"

import { useEffect, useState } from "react"

import API from "../services/api"

import "./LiveAttackMap.css"

export default function LiveAttackMap(){

  const [attacks, setAttacks] =
  useState([])

  useEffect(()=>{

    fetchAttacks()

  },[])

  const fetchAttacks = async()=>{

    try{

      const res = await API.get(
        "/map/attacks"
      )

      setAttacks(res.data)

    }catch(err){

      console.log(err)

    }

  }

  return(

    <div className="live-map-container">

      <MapContainer
        center={[20,0]}
        zoom={2}
        className="leaflet-map"
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {attacks.map((attack,index)=>(

          attack.latitude &&
          attack.longitude && (

            <CircleMarker

              key={index}

              center={[
                attack.latitude,
                attack.longitude
              ]}

              radius={12}

              pathOptions={{
                color: "red",
                fillColor: "red",
                fillOpacity: 0.8
              }}

            >

              <Popup>

                <div>

                  <h3>{attack.email}</h3>

                  <p>
                    IP:
                    {attack.ipAddress}
                  </p>

                  <p>
                    {attack.city},
                    {attack.country}
                  </p>

                  <p>
                    Status:
                    {attack.status}
                  </p>

                </div>

              </Popup>

            </CircleMarker>

          )

        ))}

      </MapContainer>

    </div>
  )
}