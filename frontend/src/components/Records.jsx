import React, { useEffect, useState } from 'react';
import { getAllRecords, deleteRecord } from '../utils/db';
import { Trash2, ExternalLink, Calendar, Search } from 'lucide-react';

export default function Records({ onViewCard }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await getAllRecords();
      setRecords(data);
    } catch (err) {
      console.error("Failed to load records", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await deleteRecord(id);
      loadRecords();
    }
  };

  const filteredRecords = records.filter(record => 
    record.data.farmer.nameEng.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.data.farmer.farmerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Farmer Records</h1>
          <p className="text-slate-500 mt-1">View and manage locally generated Farmer Cards.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No records found</h3>
          <p className="text-sm text-slate-500">You haven't generated any Farmer Cards yet on this device.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map(record => (
            <div key={record.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                  {record.data.photo ? (
                    <img src={record.data.photo} alt={record.data.farmer.nameEng} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">No Pic</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{record.data.farmer.nameEng || 'Unnamed'}</h3>
                  <p className="text-xs text-slate-500 truncate">{record.data.farmer.nameLocal || '-'}</p>
                  <p className="text-xs font-mono text-emerald-600 mt-2 bg-emerald-50 inline-block px-2 py-0.5 rounded">
                    ID: {record.data.farmer.farmerId || 'N/A'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(record.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => onViewCard(record.data)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Card
                </button>
                <button 
                  onClick={() => handleDelete(record.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
