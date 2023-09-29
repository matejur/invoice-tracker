export interface Invoice {
    id: number;
    amount: number;
    company: string;
    month: number;
    year: number;
    pdfPath: string | null;
}
