import React, { useEffect, useRef, useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';

export default function CardGenerator({ confirmedData, onReset, onEdit }) {
  const iframeRef = useRef(null);
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    // We listen to iframe load event or just wait a bit to ensure it's ready to receive postMessage
    const timer = setTimeout(() => {
      setIframeReady(true);
    }, 1500); // Give the legacy React bundle time to mount and expose window.__SET_FARMER

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (iframeReady && iframeRef.current && confirmedData) {
      // Map the extended data back to the legacy schema
      const legacyData = {
        farmerId: confirmedData.farmer.farmerId || "",
        nameEng: confirmedData.farmer.nameEng || "",
        nameLocal: confirmedData.farmer.nameLocal || "",
        gender: confirmedData.farmer.gender || "Male",
        dob: confirmedData.farmer.dob || "",
        aadhaar: confirmedData.farmer.aadhaar || "",
        mobile: confirmedData.contact.mobile || "",
        address: confirmedData.address.full || "",
        photo: confirmedData.photo || "",
        landRecords: confirmedData.landRecords.length > 0 ? confirmedData.landRecords : [
          { id: "1", state: "", subDist: "", village: "", sNo: "", ss: "*", area: "" }
        ]
      };

      iframeRef.current.contentWindow.postMessage({
        type: 'SET_FARMER',
        payload: legacyData
      }, '*');
    }
  }, [iframeReady, confirmedData]);

  const handleDownloadPdf = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({
        type: 'DOWNLOAD_PDF',
        payload: 'A4'
      }, '*');
    }
  };

  const handleDownload4x6 = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({
        type: 'DOWNLOAD_PDF',
        payload: '4x6'
      }, '*');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your AgriCard is Ready</h1>
          <p className="text-slate-500 mt-1">Review the preview below and select your export format.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onEdit}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Go Back & Edit
          </button>
          <button 
            onClick={onReset}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-slate-200/50 rounded-2xl overflow-hidden border border-slate-200 relative" style={{ minHeight: '600px' }}>
          {!iframeReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-sm font-medium text-slate-500">Generating secure preview...</p>
              </div>
            </div>
          )}
          <iframe 
            ref={iframeRef}
            src="/legacy/card-legacy.html" 
            title="Card Preview"
            className="w-full h-full border-0 absolute inset-0"
          />
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Ready for Export
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={handleDownloadPdf}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download A4 PDF
              </button>
              
              <button 
                onClick={handleDownload4x6}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download 4×6 Photo PDF
              </button>
            </div>
            
            <p className="text-xs text-slate-500 mt-6 text-center leading-relaxed">
              Your data remains secure and is only processed locally for rendering this card.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
