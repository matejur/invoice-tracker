import { useEffect, useState } from "react";
import { Invoice } from "../lib/types";
import { getInvoicesForYear } from "../lib/db";
import { Table } from "./Table";

export default function MainWindow({
    year,
    month,
    isModalOpen,
    setOpenPdfPath,
}: {
    year: number;
    month: number | undefined;
    isModalOpen: boolean;
    setOpenPdfPath: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        getInvoicesForYear(year).then(setInvoices).catch(console.error);
    }, [year, month, isModalOpen]);

    return (
        <div className="flex flex-col w-full justify-center items-center">
            <Table
                invoices={invoices}
                setOpenPdfPath={setOpenPdfPath}
                setInvoices={setInvoices}
            />
        </div>
    );
}
