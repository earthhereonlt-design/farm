import React, { useState } from 'react';
import { clearAllRecords } from '../utils/db';
import { Settings as SettingsIcon, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Settings() {
  const [cleared, setCleared] = useState(false);

  const handleClearData = async () => {
    if (window.confirm("WARNING: This will permanently delete all saved Farmer Cards on this device. Proceed?")) {
      await clearAllRecords();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
          <SettingsIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm">Manage your local data and application preferences.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex gap-4">
          <div className="shrink-0 mt-1">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Privacy & Data Security</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              All generated Farmer Cards and their associated data (including photos) are stored completely locally on this device using IndexedDB. No personal information is saved on any remote server after the session ends.
            </p>
          </div>
        </div>
        
        <div className="p-6 bg-red-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="shrink-0 mt-1">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">Danger Zone</h3>
              <p className="text-sm text-red-700/80 mt-1">
                Clear all locally saved records and history.
              </p>
            </div>
          </div>
          <button 
            onClick={handleClearData}
            className="shrink-0 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 font-medium text-sm rounded-lg transition-colors"
          >
            {cleared ? 'Data Cleared!' : 'Clear Local Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
