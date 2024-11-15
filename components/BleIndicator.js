"use client"

import Image from "next/image";
import bleConnectedSvg from "@/icons/ble-connected.svg"
import bleDisconnectedSvg from "@/icons/ble-disconnected.svg"


export default function BleIndicator({ isConnected }) {
    return (
        <div className="grid grid-cols-3 mx-auto gap-2 w-1/4">
            <p></p>
            <p className="ml-auto">{isConnected ? "Connected" : "Not Connected"}</p>
            <Image className="w-5 mr-auto mt-[2px]" src={isConnected ? bleConnectedSvg : bleDisconnectedSvg} />
        </div>
    )
}
