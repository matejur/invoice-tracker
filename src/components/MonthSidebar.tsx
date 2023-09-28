import { useEffect, useState } from "react";
import { getMonths } from "../lib/db";

const NUM_TO_NAME = [
    "Januar",
    "Februar",
    "Marec",
    "April",
    "Maj",
    "Junij",
    "Julij",
    "Avgust",
    "September",
    "Oktober",
    "November",
    "December",
];

export default function MonthSidebar({
    select_callback,
    year,
}: {
    select_callback: React.Dispatch<React.SetStateAction<number | undefined>>;
    year: number;
}) {
    const [months, setMonths] = useState<number[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>();

    function onMonthSelect(month: number | undefined) {
        select_callback(month);
        setSelectedMonth(month);
    }

    useEffect(() => {
        onMonthSelect(undefined);
        getMonths(year).then(setMonths).catch(console.error);
    }, [year]);

    return (
        <div className="sidebar">
            {months.map((month) => {
                return (
                    <button
                        className={`sidebar_button ${
                            month === selectedMonth ? "bg-gray-400" : ""
                        }`}
                        key={month}
                        onClick={() => onMonthSelect(month)}
                    >
                        {NUM_TO_NAME[month]}
                    </button>
                );
            })}
        </div>
    );
}
