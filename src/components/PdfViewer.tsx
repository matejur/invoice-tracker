import { readBinaryFile, BaseDirectory } from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";

export function PdfViewer({ pdfPath }: { pdfPath: string }) {
    const [pdfUrl, setPdfUrl] = useState<string>("");

    useEffect(() => {
        const readPdf = async () => {
            const file = await readBinaryFile(pdfPath, {
                dir: BaseDirectory.AppData,
            });
            const blob = new Blob([file], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        };
        readPdf();
    }, [pdfPath]);

    return (
        <div className="modal_background">
            <div className="pdf_iframe">
                <iframe height="80%" width="80%" src={pdfUrl}></iframe>
            </div>
            ;
        </div>
    );
}
