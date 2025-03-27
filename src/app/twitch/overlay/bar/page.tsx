"use client";
import { useEffect, useState } from "react";

export default function Bar() {
    return (
        <div className="absolute top-0 w-screen h-1/32 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-b-lg border-b-2 border-blue-500/30 shadow-lg">
            <div className="absolute left-0 flex items-center h-full pl-4">
                <p className="text-lg font-bold text-white">Wiibleyde</p>
            </div>
            <div className="absolute right-0 flex items-center h-full pr-4">
                <Clock />
                <p className="text-lg font-bold text-white mx-4">-</p>
                <DateComponent />
            </div>
        </div>
    )
}

export function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <p className="text-lg font-black text-white">{time.toLocaleTimeString()}</p>
    );
}

export function DateComponent() {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setDate(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-lg font-black text-white">
            {date.toLocaleDateString()}
        </div>
    );
}
