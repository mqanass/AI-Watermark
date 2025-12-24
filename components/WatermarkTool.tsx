
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Asset, UserState } from '../types';
import { analyzeWatermark } from '../services/geminiService';

const WatermarkTool: React.FC = () => {
  const [user, setUser] = useState<UserState>({
    credits: 10,
    history: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const id = Math.random().toString(36).substring(7);
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video') ? 'video' : 'image';

    const newAsset: Asset = {
      id,
      name: file.name,
      type,
      url,
      status: 'processing',
      timestamp: Date.now()
    };

    setCurrentAsset(newAsset);

    // Simulate the process
    if (type === 'image') {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const report = await analyzeWatermark(base64);
        setAiReport(report);
      };
      reader.readAsDataURL(file);
    }

    // Mock processing time
    setTimeout(() => {
      const completedAsset: Asset = { ...newAsset, status: 'completed' };
      setCurrentAsset(completedAsset);
      setUser(prev => ({
        credits: prev.credits - 1,
        history: [completedAsset, ...prev.history]
      }));
      setIsUploading(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">W</div>
          <span className="text-xl font-bold tracking-tight">UnWatermark</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full text-left px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium">Dashboard</button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50">API Docs</button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50">Settings</button>
        </nav>

        <div className="mt-auto p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500 uppercase font-bold mb-2">Available Credits</p>
          <p className="text-2xl font-bold text-gray-900">{user.credits}</p>
          <button className="w-full mt-4 bg-white border border-gray-200 py-2 rounded-lg text-sm font-medium hover:shadow-sm">Buy More</button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workspace</h1>
              <p className="text-gray-500">Upload your images or videos to remove watermarks</p>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Upload Asset
            </button>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
              accept="image/*,video/mp4,video/quicktime,video/x-msvideo"
            />
          </header>

          {/* Active Upload / Result */}
          <AnimatePresence mode="wait">
            {currentAsset ? (
              <motion.div
                key={currentAsset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-12"
              >
                <div className="grid md:grid-cols-2">
                  <div className="p-6 bg-gray-900 flex items-center justify-center min-h-[400px]">
                    {currentAsset.type === 'video' ? (
                      <video src={currentAsset.url} controls className="max-w-full rounded-lg shadow-2xl" />
                    ) : (
                      <div className="relative group">
                        <img src={currentAsset.url} className={`max-w-full rounded-lg shadow-2xl transition-all ${currentAsset.status === 'processing' ? 'blur-md grayscale' : ''}`} alt="Asset" />
                        {currentAsset.status === 'processing' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-blue-600 animate-pulse">
                              Removing Artifacts...
                            </div>
                          </div>
                        )}
                        {currentAsset.status === 'completed' && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col">
                    <div className="mb-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${currentAsset.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {currentAsset.status}
                      </span>
                      <h3 className="text-xl font-bold">{currentAsset.name}</h3>
                      <p className="text-gray-500 text-sm">{currentAsset.type.toUpperCase()} • {new Date(currentAsset.timestamp).toLocaleString()}</p>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">AI Detection Report</h4>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 min-h-[100px] text-sm text-gray-700 leading-relaxed italic">
                        {aiReport || "Initializing model for frame-by-frame analysis..."}
                      </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                      <button 
                        disabled={currentAsset.status !== 'completed'}
                        className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-black transition-colors"
                      >
                        Download Result
                      </button>
                      <button 
                        onClick={() => setCurrentAsset(null)}
                        className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <h2 className="text-xl font-bold mb-2">Start a new project</h2>
                <p className="text-gray-500 max-w-xs mb-8">Drop files here or click upload to remove watermarks from your media using our GenAI model.</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold hover:shadow-md transition-shadow"
                >
                  Browse Files
                </button>
              </div>
            )}
          </AnimatePresence>

          {/* History */}
          <section className="mt-12">
            <h2 className="text-lg font-bold mb-6">Recent History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.history.map(asset => (
                <div key={asset.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:shadow-sm transition-shadow">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {asset.type === 'video' ? (
                       <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-[10px]">VIDEO</div>
                    ) : (
                      <img src={asset.url} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold truncate">{asset.name}</h4>
                    <p className="text-xs text-gray-500">{new Date(asset.timestamp).toLocaleDateString()}</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </button>
                </div>
              ))}
              {user.history.length === 0 && (
                <p className="col-span-full text-center text-gray-400 py-8">Your processed assets will appear here.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default WatermarkTool;
