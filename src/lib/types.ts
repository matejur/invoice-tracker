export interface Invoice {
    amount: number;
    company: string;
    month: number;
    year: number;
    pdf_path: string | null;
}
