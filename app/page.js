"use client"

import { useEffect, useState } from "react";
import TamperInstancesDropdown from "@/components/TamperInstancesDropdown.js"
import BleIndicator from "@/components/BleIndicator.js";
import Image from "next/image";
import bleConnectedSvg from "@/icons/ble-connected.svg"
import bleDisconnectedSvg from "@/icons/ble-disconnected.svg"


export default function Home() {

  var tamperCountCharacteristic, timestampsCharacteristic, tamperTypesCharacteristic;

  const [tamperCount, setTamperCount] = useState(0);
  const [timestamps, setTimestamps] = useState([])
  const [tamperTypes, setTamperTypes] = useState([0])
  const [bleConnected, setBleConnected] = useState(false)

  var device;

  // const getPermission = () => {
  //   navigator.permissions.query({ name: "bluetooth" })
  //     .then(btPermission => {
  //       if (btPermission.state == "denied") {
  //       }
  //     }).catch(error => { console.log(error) })
  // }

  const handleTamperCountChange = async (event) => {
    setTamperCount(event.target.value.getUint16(0, 1))
    const timestamps = await timestampsCharacteristic.readValue();
    const tamperTypesRaw = await tamperTypesCharacteristic.readValue();
    let tamperTypesSliced = (new Uint8Array(tamperTypesRaw.buffer)).slice(1);
    setTamperTypes(tamperTypesSliced)
    timestamps.setUint32(0, 2**32-1, true)

    let timestampUnixArray = new Uint32Array(timestamps.buffer)
    var timestampDateArray = []
    for (let i = 0; i < 20; i++) {
      if (timestampUnixArray[i] == 0) break
      timestampDateArray.push(new Date(timestampUnixArray[i] * 1000 - 8*3600*1000))
    }
    setTimestamps(timestampDateArray.slice(1));
  }

  const connect = async () => {
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true, optionalServices: ["cd327be0-eb57-42ac-8b17-bc919b162bbb"],
      // filters: [{services: ["cd327be0-eb57-42ac-8b17-bc919b162bbb"]}]
    })
    const server = await device.gatt.connect()
    const service = await server.getPrimaryService("cd327be0-eb57-42ac-8b17-bc919b162bbb")
    setBleConnected(server.connected)
    const characteristics = await service.getCharacteristics()
    tamperCountCharacteristic = await characteristics[0]
    timestampsCharacteristic = await characteristics[1]
    tamperTypesCharacteristic = await characteristics[2];
    // let setTimestampCharacterisitc = await characteristics[3];
    // let timestamp = new Int32Array(1)
    // timestamp[0] = Math.floor(Date.now() / 1000)
    // setTimestampCharacterisitc.writeValue(timestamp)

    tamperCountCharacteristic.startNotifications()

    characteristics[0].startNotifications()
    characteristics[0].addEventListener('characteristicvaluechanged', handleTamperCountChange);
    const value = await characteristics[0].readValue();
    setTamperCount(value.getUint16(0, 1));
  }

  return (
    <div className="flex flex-col bg-[#021526] min-h-screen text-[#d9dcde]">
      <div className=" flex flex-row w-screen">
        <img className="w-1/4 sm:w-1/6 md:w-[9vw] object-contain mx-10 mt-5 mr-auto" src="https://www.pmc.sg/wp-content/uploads/2018/11/sst.png" alt="SST Logo"/>
        <img className="w-1/4 sm:w-1/6 md:w-[12vw] object-contain mx-10 mt-5" src="https://www.logo.wine/a/logo/Infineon_Technologies/Infineon_Technologies-Logo.wine.svg" alt="Infineon Logo"/>
      </div>
      <div>
        <div className="flex flex-col text-center mb-8 w-screen">
          <p className="text-2xl md:text-4xl mb-10 font-semibold">Tamper Instances Detected</p>
          {/* <p className="text-2xl md:text-4xl mb-10 font-semibold">Tampering Detection Module</p> */}
          {/* <p className="text-xl">Tamper Instances Detected:</p> */}
          <p className="text-6xl m-5">{tamperCount}</p>
          <div className="grid grid-cols-3 mx-auto mt-10 mb-3">
            <div/>
            <button onClick={connect} className="w-fit rounded-2xl px-7 h-16 text-[#000] font-semibold text-xl bg-[#b7b7b7]">Connect to TDM</button>
            <div className="w-12 h-12 ml-5 my-auto rounded-full flex" style={{backgroundColor: bleConnected ? "#b7b7b7" : "#b7b7b7"}}><Image className="w-7 m-auto" src={bleConnected ? bleConnectedSvg : bleDisconnectedSvg}/></div>
          </div>
          {/* <BleIndicator isConnected={bleConnected}/> */}
        </div>
        {tamperCount > 0 ? (<TamperInstancesDropdown tamperEvents={timestamps} tamperTypes={tamperTypes} />) : <></>}
      </div>
      <div className="h-20" />
    </div>
  );
}

