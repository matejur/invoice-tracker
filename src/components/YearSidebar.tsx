import React, { useEffect, useState } from "react";
import { getYears } from "../lib/db";

export default function YearSidebar({
    select_callback,
}: {
    select_callback: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [years, setYears] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear()
    );

    function onYearSelect(year: number) {
        setSelectedYear(year);
        select_callback(year);
    }

    useEffect(() => {
        getYears().then(setYears).catch(console.error);
    }, []);

    return (
        <div className="sidebar">
            {years.map((year) => {
                return (
                    <button
                        className={`sidebar_button ${
                            year === selectedYear ? "bg-gray-400" : ""
                        }`}
                        key={year}
                        onClick={() => onYearSelect(year)}
                    >
                        {year}
                    </button>
                );
            })}
        </div>
    );
}
