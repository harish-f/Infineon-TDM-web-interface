"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import arrow from "../right-arrow.svg"

const tamperTypesText = ["Unkown Tamper Cause", "Phone Lid Removed", "BMS Disconnect", "Battery Disconnected"]

export default function TamperInstancesDropdown({ tamperEvents, tamperTypes }) {
    const [openedDropdown, setOpenedDropdown] = useState(true)
    return (
        <div>
            <div className="flex flex-row mb-5 gap-3 w-fit mx-auto cursor-pointer" onClick={() => {
                setOpenedDropdown(state => !state)
            }}>
                <Image src={arrow} className="w-5 fill-white" style={{ transform: openedDropdown ? "rotate(270deg)" : "rotate(90deg)" }} />
                <p className="text-xl font-bold">Tamper History</p>
            </div>
            {openedDropdown ? 
            <table className="mx-auto">
                <tr className="font-semibold">
                    <th>Timestamp</th>
                    <th></th>
                    <th>Cause</th>
                </tr>
                {tamperEvents.map((timestamp, index) => {
                    return (
                        <tr className="text-center text-lg" key={index}>
                            <td className="mr-5">{timestamp.toLocaleString()}</td>
                            <td className="w-5"></td>
                            <td>{tamperTypesText[tamperTypes[index]]}</td>
                        </tr>)
                }
                )}
            </table>
            : <></>
            }
        </div>
    )
}