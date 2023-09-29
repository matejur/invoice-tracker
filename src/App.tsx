import { useState } from "react";
import YearSidebar from "./components/YearSidebar";
import MonthSidebar from "./components/MonthSidebar";
import AddInvoiceModal from "./components/AddInvoiceModal";
import MainWindow from "./components/MainWindow";
import { PdfViewer } from "./components/PdfViewer";

export default function App() {
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear()
    );
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [openPdfPath, setOpenPdfPath] = useState<string>("");

    return (
        <main className="flex">
            <YearSidebar
                select_callback={setSelectedYear}
                isModalOpen={isModalOpen}
            />
            <MonthSidebar
                select_callback={setSelectedMonth}
                year={selectedYear}
            />
            <MainWindow
                year={selectedYear}
                month={selectedMonth}
                isModalOpen={isModalOpen}
                setOpenPdfPath={setOpenPdfPath}
            />
            {isModalOpen && <AddInvoiceModal modalOpen={setIsModalOpen} />}
            {openPdfPath && (
                <>
                    <PdfViewer pdfPath={openPdfPath} />
                    <button
                        onClick={() => setOpenPdfPath("")}
                        className="absolute bottom-0 right-0 w-24 h-24 m-10 text-center bg-red-500 hover:bg-red-400 rounded-full font-bold text-5xl"
                    >
                        x
                    </button>
                </>
            )}

            {!isModalOpen && !openPdfPath && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute bottom-0 right-0 w-24 h-24 m-10 text-center bg-green-500 hover:bg-green-400 rounded-full font-bold text-5xl"
                >
                    +
                </button>
            )}
        </main>
    );
}
