const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        await page.setContent(`
            <!DOCTYPE html>
            <html>
            <head>
                <script src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js'></script>
            </head>
            <body>
                <script>
                    window.extractedText = '';
                    async function parsePDF(base64Data) {
                        try {
                            const pdfData = atob(base64Data);
                            const uint8Array = new Uint8Array(pdfData.length);
                            for (let i = 0; i < pdfData.length; i++) {
                                uint8Array[i] = pdfData.charCodeAt(i);
                            }
                            const loadingTask = pdfjsLib.getDocument({data: uint8Array});
                            const pdf = await loadingTask.promise;
                            
                            for (let i = 1; i <= pdf.numPages; i++) {
                                const page = await pdf.getPage(i);
                                const content = await page.getTextContent();
                                const strings = content.items.map(item => item.str);
                                window.extractedText += strings.join(' ') + '\\n';
                            }
                            return window.extractedText;
                        } catch(e) {
                            return 'ERROR: ' + e.toString();
                        }
                    }
                </script>
            </body>
            </html>
        `);
        
        const dataBuffer = fs.readFileSync('C:\\Users\\Aditya\\Desktop\\form.pdf');
        const base64Data = dataBuffer.toString('base64');
        
        const text = await page.evaluate(async (b64) => {
            return await parsePDF(b64);
        }, base64Data);
        
        console.log(text);
        await browser.close();
    } catch (e) {
        console.log('Puppeteer failed:', e);
    }
})();
