import React, { useState } from 'react';
import { Subscription } from '../types';
import { generateCancellationEmail } from '../services/geminiService';
import { Trash2, ExternalLink, AlertTriangle, Calendar, Mail, Check, X, Copy, Tag } from 'lucide-react';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onCancelSubscription: (id: string) => void;
  onUpdateCategory: (id: string, newCategory: string) => void;
}

export const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions, onCancelSubscription, onUpdateCategory }) => {
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [emailTemplate, setEmailTemplate] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // State for category editing
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [tempCategory, setTempCategory] = useState("");

  const handleCancelClick = async (sub: Subscription) => {
    setCancelingId(sub.id);
    const email = await generateCancellationEmail(sub.name);
    setEmailTemplate(email);
  };

  const confirmCancel = () => {
    if (cancelingId) {
      onCancelSubscription(cancelingId);
      closeModal();
    }
  };

  const closeModal = () => {
    setCancelingId(null);
    setEmailTemplate(null);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (emailTemplate) {
        navigator.clipboard.writeText(emailTemplate);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  }

  const handleCategorySave = (id: string) => {
      if (tempCategory.trim()) {
          onUpdateCategory(id, tempCategory.trim());
      }
      setEditingCategoryId(null);
  }

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700';
      case 'Expiring Soon': return 'bg-amber-100 text-amber-700';
      case 'Canceled': return 'bg-slate-100 text-slate-500';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="space-y-4">
      <datalist id="categories">
        <option value="Entertainment" />
        <option value="Software" />
        <option value="Utilities" />
        <option value="Health & Fitness" />
        <option value="Food & Drink" />
        <option value="Shopping" />
        <option value="Services" />
        <option value="Education" />
        <option value="Other" />
      </datalist>

      {subscriptions.map((sub) => (
        <div key={sub.id} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
               <img src={sub.logoUrl} alt={sub.name} className="w-full h-full object-cover opacity-80" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-lg">{sub.name}</h4>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                  {sub.status}
                </span>
                <span>• {sub.billingCycle}</span>
                
                {/* Category Inline Edit */}
                <span className="text-slate-300">|</span>
                {editingCategoryId === sub.id ? (
                    <div className="flex items-center gap-1">
                        <input 
                            type="text" 
                            list="categories"
                            autoFocus
                            value={tempCategory}
                            onChange={(e) => setTempCategory(e.target.value)}
                            onBlur={() => handleCategorySave(sub.id)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCategorySave(sub.id)}
                            className="w-32 px-2 py-0.5 text-xs border border-indigo-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 bg-white"
                            placeholder="Category..."
                        />
                    </div>
                ) : (
                    <button 
                        onClick={() => { setEditingCategoryId(sub.id); setTempCategory(sub.category); }}
                        className="flex items-center gap-1 hover:text-indigo-600 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition-colors group"
                        title="Edit Category"
                    >
                        <Tag className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                        <span>{sub.category}</span>
                    </button>
                )}

                {sub.isTrial && <span className="text-amber-500 font-medium ml-1">• Free Trial</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-1 w-full md:w-auto justify-between md:justify-end items-center gap-6">
            <div className="text-right">
              <div className="text-xl font-bold text-slate-900">
                {sub.currency === 'USD' ? '$' : sub.currency} {sub.cost.toFixed(2)}
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-end gap-1">
                 <Calendar className="w-3 h-3" />
                 Next: {new Date(sub.nextRenewalDate).toLocaleDateString()}
              </div>
            </div>

            {sub.status !== 'Canceled' && (
              <button 
                onClick={() => handleCancelClick(sub)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Cancel Subscription"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ))}

      {subscriptions.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
              <p>No subscriptions found. Scan a statement to get started.</p>
          </div>
      )}

      {/* Cancellation Modal */}
      {cancelingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Cancel Subscription?
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-slate-600">
                We've generated a cancellation request for you. You can copy this email or confirm to mark it as canceled in the dashboard.
              </p>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                {emailTemplate ? (
                  <pre className="text-xs md:text-sm font-mono text-slate-700 whitespace-pre-wrap font-sans">{emailTemplate}</pre>
                ) : (
                  <div className="flex items-center justify-center py-8 text-slate-400">
                    <span className="animate-pulse">Generating email draft...</span>
                  </div>
                )}
                
                {emailTemplate && (
                    <button 
                        onClick={copyToClipboard}
                        className="absolute top-2 right-2 p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-slate-500"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                )}
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
              >
                Keep It
              </button>
              <button 
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                Confirm Canceled
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};