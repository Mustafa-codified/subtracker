import React, { useState } from 'react';
import { detectSubscriptions } from '../services/geminiService';
import { Subscription } from '../types';
import { Loader2, Wand2, ArrowRight, CheckCircle, Lock } from 'lucide-react';

interface ScannerProps {
  onSubscriptionsFound: (newSubs: Subscription[]) => void;
  onCancel: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onSubscriptionsFound, onCancel }) => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const detected = await detectSubscriptions(inputText);
      
      const newSubscriptions: Subscription[] = detected.map((sub) => ({
        ...sub,
        id: crypto.randomUUID(),
        status: sub.isTrial ? 'Expiring Soon' : 'Active',
        logoUrl: `https://picsum.photos/seed/${sub.name}/64/64`
      }));
      
      onSubscriptionsFound(newSubscriptions);
    } catch (err) {
      setError("We couldn't detect any subscriptions. Please try pasting a clearer list or statement.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Scan for Subscriptions</h2>
        <p className="text-slate-500">Paste your bank statement text, email summaries, or a list of expenses below. Our AI will automatically detect recurring charges.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-3 text-xs text-slate-500 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
            <Lock className="w-3 h-3 text-indigo-600" />
            <span>Privacy Note: This text is processed by AI to extract data but is <strong>never stored</strong> on our servers.</span>
        </div>

        <textarea
          className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none text-slate-700 placeholder:text-slate-400 font-mono text-sm"
          placeholder={`Example:\nNetflix $15.99 on Oct 5\nSpotify $9.99 on Oct 12\nAWS Service $35.00 Monthly`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isAnalyzing}
        />
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
             <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
            <button 
                onClick={onCancel}
                className="text-slate-500 hover:text-slate-700 font-medium px-4 py-2"
                disabled={isAnalyzing}
            >
                Cancel
            </button>
            <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-semibold transition-all shadow-lg shadow-indigo-200
                ${isAnalyzing || !inputText.trim() 
                    ? 'bg-indigo-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95'}`}
            >
                {isAnalyzing ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                </>
                ) : (
                <>
                    <Wand2 className="w-5 h-5" />
                    Detect Subscriptions
                </>
                )}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-100">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Bank Statements</span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-100">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Email Confirmations</span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-100">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Credit Card Exports</span>
        </div>
      </div>
    </div>
  );
};