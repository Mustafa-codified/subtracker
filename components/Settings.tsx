import React, { useState } from 'react';
import { Bell, Shield, Mail, Smartphone, RefreshCw } from 'lucide-react';

export const Settings: React.FC = () => {
    const [settings, setSettings] = useState({
        trialAlerts: true,
        autoCancel: false,
        emailReports: true,
        pushNotifs: true
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-indigo-600" />
                        Notifications
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Manage how and when you want to be alerted.</p>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-600 h-fit">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-medium text-slate-800">Free Trial Alerts</div>
                                <div className="text-sm text-slate-500">Get notified 3 days before a trial ends.</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => toggle('trialAlerts')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.trialAlerts ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.trialAlerts ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 h-fit">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-medium text-slate-800">Weekly Email Report</div>
                                <div className="text-sm text-slate-500">A summary of your weekly spending.</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => toggle('emailReports')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.emailReports ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.emailReports ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-indigo-600" />
                        Automation
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Let SubTrackr handle the boring stuff.</p>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between opacity-75">
                        <div className="flex gap-3">
                            <div className="p-2 bg-rose-50 rounded-lg text-rose-600 h-fit">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-medium text-slate-800 flex items-center gap-2">
                                    Auto-Cancel Trials
                                    <span className="text-[10px] uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">Beta</span>
                                </div>
                                <div className="text-sm text-slate-500">Automatically cancel trials on the last day.</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => toggle('autoCancel')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoCancel ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.autoCancel ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}