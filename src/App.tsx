import { useState } from "react";
import YearSidebar from "./components/YearSidebar";
import MonthSidebar from "./components/MonthSidebar";

export default function App() {
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear()
    );

    const [selectedMonth, setSelectedMonth] = useState<number | undefined>();

    return (
        <main className="flex">
            <YearSidebar select_callback={setSelectedYear} />
            <MonthSidebar
                select_callback={setSelectedMonth}
                year={selectedYear}
            />
            {selectedYear} {selectedMonth}
        </main>
    );
}
