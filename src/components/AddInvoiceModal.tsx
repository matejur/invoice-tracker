import { useState } from "react";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import { join } from "@tauri-apps/api/path";
import { copyFile, BaseDirectory } from "@tauri-apps/api/fs";
import { Invoice } from "../lib/types";
import { insertInvoice } from "../lib/db";

export default function AddInvoiceModal({
    modalOpen,
}: {
    modalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [manualEntry, setManualEntry] = useState<boolean>(false);

    const [company, setCompany] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [month, setMonth] = useState<string>("0");
    const [year, setYear] = useState<string>("");

    const [xmlPath, setXmlPath] = useState<string>();
    const [pdfPath, setPdfPath] = useState<string>();

    const [error, setError] = useState<string>();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        let invoice: Invoice = {
            company: company,
            amount: parseFloat(amount.replace(",", ".")),
            month: parseInt(month),
            year: parseInt(year),
            pdf_path: null,
        };

        if (manualEntry) {
            if (!company || !amount || !month || !year) {
                setError("Vnesite vsa polja!");
                return;
            }
        } else {
            if (!xmlPath) {
                setError("Izberite XML datoteko!");
                return;
            }

            try {
                invoice = await invoke<Invoice>("parse_xml", { path: xmlPath });
            } catch (e) {
                setError("Napaka pri branju XML datoteke!");
                return;
            }
        }

        let pdfPathNew = null;
        if (pdfPath) {
            let uuid = crypto.randomUUID();
            pdfPathNew = await join("pdfs", uuid + ".pdf");
            await copyFile(pdfPath, pdfPathNew, { dir: BaseDirectory.AppData });
        }

        invoice.pdf_path = pdfPathNew;
        const result = await insertInvoice(invoice);

        if (result.lastInsertId > 0) {
            modalOpen(false);
        } else {
            setError("Napaka pri vnosu v bazo!");
        }
    }

    return (
        <div className="modal_background">
            <div className="modal">
                <div className="flex flex-col m-8">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            value=""
                            onChange={() => {
                                setError("");
                                setManualEntry(!manualEntry);
                            }}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-4">Ročni vnos podatkov</span>
                    </label>
                    <br />
                    <form onSubmit={handleSubmit} className="">
                        {manualEntry && (
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center">
                                    Podjetje:
                                    <input
                                        className="m-1 w-1/3 bg-slate-100 border border-gray-300 rounded-lg"
                                        type="text"
                                        value={company}
                                        onChange={(e) =>
                                            setCompany(e.target.value)
                                        }
                                    />
                                    Znesek:
                                    <input
                                        className="m-1 w-1/3 bg-slate-100 border border-gray-300 rounded-lg"
                                        type="text"
                                        value={amount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const decimalPattern =
                                                /^\d*[,.]?\d{0,2}$/;

                                            if (decimalPattern.test(value)) {
                                                setAmount(value);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    Mesec:
                                    <select
                                        className="m-1 bg-slate-100 border border-gray-300 rounded-lg"
                                        name="mesec"
                                        onChange={(e) =>
                                            setMonth(e.target.value)
                                        }
                                    >
                                        <option value="0">Januar</option>
                                        <option value="1">Februar</option>
                                        <option value="2">Marec</option>
                                        <option value="3">April</option>
                                        <option value="4">Maj</option>
                                        <option value="5">Junij</option>
                                        <option value="6">Julij</option>
                                        <option value="7">Avgust</option>
                                        <option value="8">September</option>
                                        <option value="9">Oktober</option>
                                        <option value="10">November</option>
                                        <option value="11">December</option>
                                    </select>
                                    Leto:
                                    <input
                                        className="m-1 bg-slate-100 border border-gray-300 rounded-lg"
                                        type="text"
                                        value={year}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d{0,4}$/.test(value)) {
                                                setYear(value);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                        {!manualEntry && (
                            <div>
                                XML:
                                <button
                                    type="button"
                                    className="m-3 p-1 bg-slate-100 border border-gray-300 rounded-lg"
                                    onClick={() => {
                                        open({
                                            directory: false,
                                            multiple: false,
                                            filters: [
                                                {
                                                    name: "XML",
                                                    extensions: ["xml"],
                                                },
                                            ],
                                        }).then((result) => {
                                            if (
                                                result !== undefined &&
                                                typeof result === "string"
                                            ) {
                                                setXmlPath(result);
                                            }
                                        });
                                    }}
                                >
                                    Izberi datoteko
                                </button>
                                {xmlPath}
                            </div>
                        )}

                        <div>
                            PDF:
                            <button
                                type="button"
                                className="m-3 p-1 bg-slate-100 border border-gray-300 rounded-lg"
                                onClick={() => {
                                    open({
                                        directory: false,
                                        multiple: false,
                                        filters: [
                                            {
                                                name: "PDF",
                                                extensions: ["pdf"],
                                            },
                                        ],
                                    }).then((result) => {
                                        if (
                                            result !== undefined &&
                                            typeof result === "string"
                                        ) {
                                            setPdfPath(result);
                                        }
                                    });
                                }}
                            >
                                Izberi datoteko
                            </button>
                            {pdfPath}
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => modalOpen(false)}
                                className="p-3 mt-4 bg-red-300 border border-red-400 rounded-lg"
                            >
                                Prekliči
                            </button>
                            <button className="p-3 mt-4 bg-green-300 border border-green-400 rounded-lg">
                                Dodaj
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
