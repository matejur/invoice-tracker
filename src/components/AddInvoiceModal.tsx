import { useState } from "react";
import { open } from "@tauri-apps/api/dialog";

export default function AddInvoiceModal() {
    const [manualEntry, setManualEntry] = useState<boolean>(false);

    const [company, setCompany] = useState<string>();
    const [amount, setAmount] = useState<string>();
    const [month, setMonth] = useState<string>();
    const [year, setYear] = useState<string>();

    const [xml, setXml] = useState<string>();
    const [pdf, setPdf] = useState<string>();

    const [error, setError] = useState<string>();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (manualEntry) {
            if (!company || !amount || !month || !year) {
                setError("Vnesite vsa polja!");
                return;
            }
        } else {
            if (!xml) {
                setError("Izberite XML datoteko!");
                return;
            }
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

                                            if (/^\d*$/.test(value)) {
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
                                                setXml(result);
                                            }
                                        });
                                    }}
                                >
                                    Izberi datoteko
                                </button>
                                {xml}
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
                                            setPdf(result);
                                        }
                                    });
                                }}
                            >
                                Izberi datoteko
                            </button>
                            {pdf}
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <button className="p-3 mt-4 bg-slate-100 border border-gray-300 rounded-lg">
                            Dodaj
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
