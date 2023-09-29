import { useEffect, useState } from "react";
import { Invoice } from "../lib/types";
import { getInvoicesForYear } from "../lib/db";
import { Table } from "./Table";

export default function MainWindow({
    year,
    month,
    isModalOpen,
}: {
    year: number;
    month: number | undefined;
    isModalOpen: boolean;
}) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        getInvoicesForYear(year).then(setInvoices).catch(console.error);
    }, [year, month, isModalOpen]);

    console.log(invoices);

    return (
        <div className="flex flex-col w-full justify-center items-center">
            <Table invoices={invoices} />
        </div>
    );
}
