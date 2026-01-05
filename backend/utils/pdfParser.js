import fs from 'fs/promises';
import {PDFParse} from 'pdf-parse';


/**
 * Extract text content from a PDF file buffer.
 * @param {string} filePath - The buffer of the PDF file.
 * @returns {Promise<{text: string,numPages: number}>} - The extracted text content.
 */

export const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer=await fs.readFile(filePath);
        //pdf -parse expects a Unit8Array, not a buffer
        const parser=new PDFParse(new Uint8Array(dataBuffer));
        const data=await parser.getText();
        return{
            text:data.text,
            numPages:data.numpages,
            info:data.info
        }

    }catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error('Failed to extract text from PDF');
    }

}