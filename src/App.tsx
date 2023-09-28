import { useState } from "react";
import YearSidebar from "./components/YearSidebar";
import MonthSidebar from "./components/MonthSidebar";
import AddInvoiceModal from "./components/AddInvoiceModal";

export default function App() {
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear()
    );
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    return (
        <main className="flex">
            <YearSidebar select_callback={setSelectedYear} />
            <MonthSidebar
                select_callback={setSelectedMonth}
                year={selectedYear}
            />
            {selectedYear} {selectedMonth}
            {isModalOpen && <AddInvoiceModal modalOpen={setIsModalOpen} />}
            {!isModalOpen && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute bottom-0 right-0 w-24 h-24 m-10 flex justify-center items-center bg-green-500 hover:bg-green-400 rounded-full font-bold text-5xl"
                >
                    +
                </button>
            )}
        </main>
    );
}
