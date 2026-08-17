import React, { useState } from 'react';
import { emptyFarmerData } from '../models';

export default function ManualForm({ onConfirm, onBack }) {
  const [data, setData] = useState(emptyFarmerData);

  const handleChange = (section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLandChange = (index, field, value) => {
    setData(prev => {
      const newLand = [...prev.landRecords];
      newLand[index] = { ...newLand[index], [field]: value };
      return { ...prev, landRecords: newLand };
    });
  };

  const addLandRow = () => {
    setData(prev => ({
      ...prev,
      landRecords: [...prev.landRecords, { id: Date.now().toString(), state: "", subDist: "", village: "", sNo: "", ss: "*", area: "" }]
    }));
  };

  const removeLandRow = (index) => {
    setData(prev => {
      const newLand = [...prev.landRecords];
      newLand.splice(index, 1);
      return { ...prev, landRecords: newLand };
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enter Details Manually</h1>
        <p className="text-slate-500 mt-2 text-sm">Fill in the farmer information below to generate the AgriCard.</p>
      </div>

      <div className="space-y-8">
        {/* Farmer Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800 text-sm">Farmer Information & Photo</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Farmer Photograph</label>
              <div className="flex items-center gap-4">
                {data.photo ? (
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                    <img src={data.photo} alt="Farmer" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-24 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400">
                    <span className="text-[10px] uppercase font-bold text-center px-2">No Photo</span>
                  </div>
                )}
                <div>
                  <input type="file" accept="image/*" id="photo-upload" className="hidden" onChange={handlePhotoUpload} />
                  <label htmlFor="photo-upload" className="cursor-pointer px-4 py-2 bg-white border border-slate-200 hover:border-emerald-500 rounded-lg text-sm font-medium text-slate-700 shadow-sm transition-all inline-block">
                    {data.photo ? 'Change Photo' : 'Upload Photo'}
                  </label>
                  <p className="text-xs text-slate-400 mt-1.5">Required for the ID Card.</p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Enrollment Number / Farmer ID</label>
              <input type="text" value={data.farmer.farmerId} onChange={e => handleChange('farmer', 'farmerId', e.target.value)} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500" placeholder="e.g. UP123456" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Aadhaar Number</label>
              <input type="text" value={data.farmer.aadhaar} onChange={e => handleChange('farmer', 'aadhaar', e.target.value)} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500" placeholder="XXXX XXXX 1234" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Name (English)</label>
              <input type="text" value={data.farmer.nameEng} onChange={e => handleChange('farmer', 'nameEng', e.target.value)} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Name (Local Language)</label>
              <input type="text" value={data.farmer.nameLocal} onChange={e => handleChange('farmer', 'nameLocal', e.target.value)} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500" placeholder="जॉन डो" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date of Birth</label>
              <input type="text" value={data.farmer.dob} onChange={e => handleChange('farmer', 'dob', e.target.value)} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500" placeholder="DD/MM/YYYY" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Gender</label>
              <select value={data.farmer.gender} onChange={e => handleChange('farmer', 'gender', e.target.value)} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 bg-white">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact & Address */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800 text-sm">Contact & Address</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mobile Number</label>
              <input type="text" value={data.contact.mobile} onChange={e => handleChange('contact', 'mobile', e.target.value)} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500" placeholder="9876543210" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Address</label>
              <input type="text" value={data.address.full} onChange={e => handleChange('address', 'full', e.target.value)} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500" placeholder="House, Street, Village..." />
            </div>
          </div>
        </div>

        {/* Land Records */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800 text-sm">Land Records</h2>
            <button onClick={addLandRow} className="text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1.5 rounded-lg transition-colors">+ Add Plot</button>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold">
                  <th className="pb-3 pr-2">State</th>
                  <th className="pb-3 pr-2">Sub-Dist</th>
                  <th className="pb-3 pr-2">Village</th>
                  <th className="pb-3 pr-2">S.No</th>
                  <th className="pb-3 pr-2">Area (Hec)</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.landRecords.map((record, i) => (
                  <tr key={record.id || i}>
                    <td className="py-2 pr-2"><input type="text" value={record.state} onChange={e => handleLandChange(i, 'state', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:border-emerald-500 focus:outline-none" /></td>
                    <td className="py-2 pr-2"><input type="text" value={record.subDist} onChange={e => handleLandChange(i, 'subDist', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:border-emerald-500 focus:outline-none" /></td>
                    <td className="py-2 pr-2"><input type="text" value={record.village} onChange={e => handleLandChange(i, 'village', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:border-emerald-500 focus:outline-none" /></td>
                    <td className="py-2 pr-2"><input type="text" value={record.sNo} onChange={e => handleLandChange(i, 'sNo', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:border-emerald-500 focus:outline-none" /></td>
                    <td className="py-2 pr-2"><input type="text" value={record.area} onChange={e => handleLandChange(i, 'area', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:border-emerald-500 focus:outline-none" /></td>
                    <td className="py-2 text-right">
                      <button onClick={() => removeLandRow(i)} className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded text-lg">&times;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.landRecords.length === 0 && <p className="text-sm text-slate-500 italic mt-2">No land records added yet.</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-10">
        <button onClick={onBack} className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          Cancel
        </button>
        <button onClick={() => onConfirm(data)} className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md transition-all">
          Continue to Generation
        </button>
      </div>
    </div>
  );
}
