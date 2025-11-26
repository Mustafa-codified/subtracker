import React from 'react';
import { Shield, Database, LayoutDashboard, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (loadDemo: boolean) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in duration-500">
        <div className="p-8 text-center space-y-4">
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-indigo-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800">
            Privacy-First Tracking
          </h2>
          
          <p className="text-slate-500 leading-relaxed">
            SubTrackr operates entirely on your device. We <strong>do not</strong> store your financial data on our servers. 
            <br/><br/>
            You don't need to link your bank account. Simply paste your subscription list or manually add them to start saving.
          </p>

          <div className="space-y-3 mt-8">
            <button 
              onClick={() => onComplete(true)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-white text-indigo-600">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <span className="block font-bold">Try with Demo Data</span>
                    <span className="text-xs opacity-75">See how it works instantly</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button 
              onClick={() => onComplete(false)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-slate-100 text-slate-600">
                  <Database className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-slate-800">Start Fresh</span>
                    <span className="text-xs text-slate-500">Add your own subscriptions manually</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6">
              <p className="text-xs text-slate-400">
                  Your data is stored in your browser's Local Storage. 
                  Clearing your cache will reset your data.
              </p>
          </div>

        </div>
      </div>
    </div>
  );
};