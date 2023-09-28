import { useEffect, useState } from "react";
import { Invoice } from "../lib/types";
import { getInvoicesForYear } from "../lib/db";

export default function MainWindow({
    year,
    month,
}: {
    year: number;
    month: number | undefined;
}) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        getInvoicesForYear(year).then(setInvoices).catch(console.error);
    }, [year, month]);

    return (
        <div className="flex flex-col w-full justify-center items-center">
            {invoices.map((invoice) => {
                return (
                    <div className="flex p-5 w-full justify-between">
                        <div>{invoice.company}</div>
                        <div>{invoice.amount}</div>
                        <div>{invoice.month}</div>
                        <div>{invoice.year}</div>
                    </div>
                );
            })}
        </div>
    );
}
