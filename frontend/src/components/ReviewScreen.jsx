import React, { useState } from 'react';
import { Check, AlertCircle, HelpCircle, Edit3 } from 'lucide-react';

const FieldRow = ({ label, value, status, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');

  const getStatusIcon = () => {
    if (status === 'extracted') return <span className="flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><Check className="w-3 h-3" /> AI Extracted</span>;
    if (status === 'review') return <span className="flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"><HelpCircle className="w-3 h-3" /> Needs Review</span>;
    return <span className="flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"><AlertCircle className="w-3 h-3" /> Not Found</span>;
  };

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  return (
    <div className="group flex items-start justify-between py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors px-2 rounded-lg -mx-2">
      <div className="flex-1 pr-4">
        <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
        
        {isEditing ? (
          <div className="flex items-center gap-2 mt-1">
            <input 
              type="text" 
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="flex-1 text-sm text-slate-900 font-medium px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />
            <button onClick={handleSave} className="text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">Save</button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${!value ? 'text-slate-400 italic' : 'text-slate-900'}`}>
              {value || 'Missing data'}
            </p>
            <button 
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition-all p-1"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="shrink-0 mt-0.5">
        {!isEditing && getStatusIcon()}
      </div>
    </div>
  );
};

export default function ReviewScreen({ extractedData, onConfirm, onBack }) {
  const [data, setData] = useState(extractedData);

  const handleChange = (section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  const getFieldStatus = (val) => {
    if (val === null || val === undefined || val === '' || val === 'Not found') return 'missing';
    if (String(val).toLowerCase().includes('review')) return 'review';
    return 'extracted';
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <Check className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Information Extracted</h1>
        <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
          Please review the information extracted from your document. You can easily edit any incorrect or missing fields before generating the card.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800 text-sm">Personal Information</h2>
        </div>
        <div className="px-6 py-2">
          <FieldRow label="Farmer Name (English)" value={data.farmer.nameEng} status={getFieldStatus(data.farmer.nameEng)} onChange={(v) => handleChange('farmer', 'nameEng', v)} />
          <FieldRow label="Farmer Name (Local)" value={data.farmer.nameLocal} status={getFieldStatus(data.farmer.nameLocal)} onChange={(v) => handleChange('farmer', 'nameLocal', v)} />
          <FieldRow label="Date of Birth" value={data.farmer.dob} status={getFieldStatus(data.farmer.dob)} onChange={(v) => handleChange('farmer', 'dob', v)} />
          <FieldRow label="Gender" value={data.farmer.gender} status={getFieldStatus(data.farmer.gender)} onChange={(v) => handleChange('farmer', 'gender', v)} />
          <FieldRow label="Farmer ID" value={data.farmer.farmerId} status={getFieldStatus(data.farmer.farmerId)} onChange={(v) => handleChange('farmer', 'farmerId', v)} />
          <FieldRow label="Aadhaar" value={data.farmer.aadhaar} status={getFieldStatus(data.farmer.aadhaar)} onChange={(v) => handleChange('farmer', 'aadhaar', v)} />
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800 text-sm">Contact & Address</h2>
        </div>
        <div className="px-6 py-2">
          <FieldRow label="Mobile Number" value={data.contact.mobile} status={getFieldStatus(data.contact.mobile)} onChange={(v) => handleChange('contact', 'mobile', v)} />
          <FieldRow label="Full Address" value={data.address.full} status={getFieldStatus(data.address.full)} onChange={(v) => handleChange('address', 'full', v)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800 text-sm">Land Records</h2>
        </div>
        <div className="p-6 overflow-x-auto">
          {data.landRecords && data.landRecords.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold">
                  <th className="pb-3 pr-4">State</th>
                  <th className="pb-3 pr-4">District</th>
                  <th className="pb-3 pr-4">Village</th>
                  <th className="pb-3 pr-4">Survey No</th>
                  <th className="pb-3">Area</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-800 divide-y divide-slate-100">
                {data.landRecords.map((record, i) => (
                  <tr key={record.id || i}>
                    <td className="py-3 pr-4">{record.state || '-'}</td>
                    <td className="py-3 pr-4">{record.subDist || '-'}</td>
                    <td className="py-3 pr-4">{record.village || '-'}</td>
                    <td className="py-3 pr-4">{record.sNo || '-'}</td>
                    <td className="py-3">{record.area || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-6 text-sm text-slate-500 italic">No land records found.</div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-10">
        <button 
          onClick={onBack}
          className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={() => onConfirm(data)}
          className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md shadow-slate-200 transition-all transform active:scale-95"
        >
          Confirm & Generate Card
        </button>
      </div>
    </div>
  );
}
