import React, { useState } from 'react';
import { Sprout } from 'lucide-react';
import AutoExtract from './components/AutoExtract';
import ManualForm from './components/ManualForm';
import ReviewScreen from './components/ReviewScreen';
import CardGenerator from './components/CardGenerator';
import Records from './components/Records';
import Settings from './components/Settings';
import { saveRecord } from './utils/db';

function App() {
  const [view, setView] = useState('create'); // 'create', 'records', 'settings'
  const [step, setStep] = useState('onboarding'); // onboarding, auto, manual, review, generate
  const [extractedData, setExtractedData] = useState(null);
  const [confirmedData, setConfirmedData] = useState(null);

  const handleExtractionSuccess = (data) => {
    setExtractedData(data);
    setStep('review');
  };

  const handleReviewConfirm = async (data) => {
    setConfirmedData(data);
    setStep('generate');
    try {
      // Save to local IndexedDB whenever a card is generated
      await saveRecord(data);
    } catch (err) {
      console.error("Failed to save record locally", err);
    }
  };

  const resetFlow = () => {
    setExtractedData(null);
    setConfirmedData(null);
    setStep('onboarding');
    setView('create');
  };

  const handleViewCardFromRecords = (data) => {
    setConfirmedData(data);
    setStep('generate');
    setView('create');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetFlow}>
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-lg">AgriCard Workspace</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-500">
            <span 
              className={`cursor-pointer transition-colors ${view === 'create' ? 'text-emerald-600 font-bold' : 'hover:text-slate-900'}`}
              onClick={() => setView('create')}
            >
              Create Card
            </span>
            <span 
              className={`cursor-pointer transition-colors ${view === 'records' ? 'text-emerald-600 font-bold' : 'hover:text-slate-900'}`}
              onClick={() => setView('records')}
            >
              Records & History
            </span>
            <span 
              className={`cursor-pointer transition-colors ${view === 'settings' ? 'text-emerald-600 font-bold' : 'hover:text-slate-900'}`}
              onClick={() => setView('settings')}
            >
              Settings
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-slate-50">
        {view === 'records' && (
          <Records onViewCard={handleViewCardFromRecords} />
        )}

        {view === 'settings' && (
          <Settings />
        )}

        {view === 'create' && (
          <>
            {step === 'onboarding' && (
              <div className="w-full max-w-4xl mx-auto py-16 px-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-12">
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Create Farmer Card</h1>
                  <p className="text-slate-500 mt-4 text-lg">Add farmer information manually or extract it automatically from your document.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <div 
                    onClick={() => setStep('manual')}
                    className="group cursor-pointer bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Enter manually</h3>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">Enter farmer information yourself using our structured digital form.</p>
                  </div>

                  <div 
                    onClick={() => setStep('auto')}
                    className="group cursor-pointer bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Extract automatically</h3>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">Upload the farmer document and let Gemini AI instantly structure all available information.</p>
                  </div>
                </div>
              </div>
            )}

            {step === 'auto' && (
              <AutoExtract onExtracted={handleExtractionSuccess} onBack={() => setStep('onboarding')} onFail={() => setStep('manual')} />
            )}

            {step === 'manual' && (
              <ManualForm initialData={confirmedData} onConfirm={handleReviewConfirm} onBack={() => setStep('onboarding')} />
            )}

            {step === 'review' && extractedData && (
              <ReviewScreen extractedData={confirmedData || extractedData} onConfirm={handleReviewConfirm} onBack={() => setStep('auto')} />
            )}

            {step === 'generate' && confirmedData && (
              <CardGenerator 
                confirmedData={confirmedData} 
                onReset={resetFlow} 
                onEdit={() => setStep(extractedData ? 'review' : 'manual')} 
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
