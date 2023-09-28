import { BaseDirectory, createDir, exists } from "@tauri-apps/api/fs";
import Database from "tauri-plugin-sql-api";
import { Invoice } from "./types.ts";

const db = await Database.load("sqlite:invoices.db");

console.log("CONNECTED TO DB");

db.execute(
    `CREATE TABLE IF NOT EXISTS invoice (
        id    INTEGER PRIMARY KEY,
        company  TEXT NOT NULL,
        amount   REAL NOT NULL,
        month    INTEGER NOT NULL,
        year     INTEGER NOT NULL,
        pdfPath  TEXT)`
);

if (!(await exists("pdfs", { dir: BaseDirectory.AppData }))) {
    await createDir("pdfs", {
        dir: BaseDirectory.AppData,
    });
}

async function getYears() {
    let years: { year: number }[] = await db.select(
        `SELECT DISTINCT year FROM invoice`
    );
    return years.map((row) => row.year);
}

async function getMonths(year: number) {
    let months: { month: number }[] = await db.select(
        "SELECT DISTINCT month FROM invoice WHERE year = ?",
        [year]
    );
    return months.map((row) => row.month);
}

async function insertInvoice(invoice: Invoice, pdfPath: string | null) {
    return await db.execute(
        "INSERT INTO invoice (company, amount, month, year, pdfPath) VALUES (?, ?, ?, ?, ?)",
        [invoice.company, invoice.amount, invoice.month, invoice.year, pdfPath]
    );
}

export { getYears, getMonths, insertInvoice };
