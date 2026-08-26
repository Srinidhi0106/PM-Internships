import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure local worker bundled by Vite to avoid CDN/CORS dynamic import errors
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
  } catch (e) {
    console.warn('PDF Worker initialization notice:', e);
  }
}

/**
 * Extracts full text from a PDF File, Blob, or ArrayBuffer asynchronously using pdfjs-dist
 */
export async function extractTextFromPdfAsync(fileOrBuffer: File | Blob | ArrayBuffer | string): Promise<string> {
  try {
    let data: Uint8Array;

    if (typeof fileOrBuffer === 'string') {
      const cleanBase64 = fileOrBuffer.includes('base64,') ? fileOrBuffer.split('base64,')[1] : fileOrBuffer;
      const binaryString = window.atob(cleanBase64);
      const len = binaryString.length;
      data = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        data[i] = binaryString.charCodeAt(i);
      }
    } else if (fileOrBuffer instanceof Blob) {
      const buffer = await fileOrBuffer.arrayBuffer();
      data = new Uint8Array(buffer);
    } else if (fileOrBuffer && typeof fileOrBuffer === 'object' && 'byteLength' in fileOrBuffer) {
      data = new Uint8Array(fileOrBuffer as ArrayBuffer);
    } else {
      return '';
    }

    const loadingTask = pdfjsLib.getDocument({
      data,
      useSystemFonts: true,
      disableFontFace: true
    });

    const pdfDoc = await loadingTask.promise;
    const maxPages = Math.min(pdfDoc.numPages, 10);
    const pagePromises: Promise<string>[] = [];

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      pagePromises.push(
        pdfDoc.getPage(pageNum).then(async (page) => {
          const textContent = await page.getTextContent();
          return textContent.items
            .map((item: any) => (item.str ? item.str.trim() : ''))
            .filter(Boolean)
            .join(' ');
        }).catch(() => '')
      );
    }

    const pages = await Promise.all(pagePromises);
    const fullText = pages.join('\n').trim();

    if (fullText && fullText.length > 20) {
      return fullText;
    }
  } catch (err) {
    console.warn('PDF async extraction fallback triggered:', err);
  }

  // Fallback: binary string stream scanner
  return extractTextFromPdfFallback(fileOrBuffer);
}

/**
 * Fast synchronous binary stream scanner fallback for environments without worker access
 */
export function extractTextFromPdfFallback(fileOrBuffer: File | Blob | ArrayBuffer | string): string {
  try {
    let rawStr = '';
    if (typeof fileOrBuffer === 'string') {
      const cleanBase64 = fileOrBuffer.includes('base64,') ? fileOrBuffer.split('base64,')[1] : fileOrBuffer;
      rawStr = window.atob(cleanBase64);
    }

    if (!rawStr) return '';

    const textBlocks: string[] = [];

    // 1. Text blocks inside BT ... ET
    const btRegex = /BT[\s\S]*?ET/g;
    let match;
    while ((match = btRegex.exec(rawStr)) !== null) {
      const block = match[0];
      const strRegex = /\(([^)]+)\)|\[([^\]]+)\]/g;
      let strMatch;
      while ((strMatch = strRegex.exec(block)) !== null) {
        const captured = strMatch[1] || strMatch[2] || '';
        const clean = captured.replace(/\\(\d{3}|[\\()])/g, ' ').trim();
        if (clean.length > 0) {
          textBlocks.push(clean);
        }
      }
    }

    // 2. Direct string literals
    const parenRegex = /\(([a-zA-Z0-9\s.,@:+\-_/&]{3,100})\)/g;
    let pMatch;
    while ((pMatch = parenRegex.exec(rawStr)) !== null) {
      const text = pMatch[1].trim();
      if (text.length > 2 && !text.includes('/Filter') && !text.includes('/Font') && !text.includes('/Type')) {
        textBlocks.push(text);
      }
    }

    if (textBlocks.length > 0) {
      return textBlocks.join(' ').replace(/\s+/g, ' ').trim();
    }

    // 3. Extract clean printable character sequences
    const printable = rawStr.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    const tokens = printable.split(/\s+/).filter((w) => /^[a-zA-Z0-9.,@:/-]{2,30}$/.test(w) && !w.startsWith('/'));
    if (tokens.length > 5) {
      return tokens.join(' ').slice(0, 8000);
    }
  } catch (err) {
    console.warn('PDF stream scanner notice:', err);
  }
  return '';
}
