import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { LayoutDashboard, List, Plus, CreditCard, Bell, Menu, X, DollarSign, BarChart2, Settings as SettingsIcon } from 'lucide-react';
import { SubscriptionList } from './components/SubscriptionList';
import { Scanner } from './components/Scanner';
import { SpendingChart } from './components/SpendingChart';
import { Onboarding } from './components/Onboarding';
import { Insights } from './components/Insights';
import { Settings } from './components/Settings';
import { Subscription, ViewState } from './types';

// Default demo data for first-time users if they choose "Load Demo Data"
const DEMO_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    name: 'Netflix Premium',
    cost: 19.99,
    currency: 'USD',
    billingCycle: 'Monthly',
    nextRenewalDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Entertainment',
    isTrial: false,
    status: 'Active',
    logoUrl: 'https://picsum.photos/seed/netflix/64/64'
  },
  {
    id: '2',
    name: 'Adobe Creative Cloud',
    cost: 54.99,
    currency: 'USD',
    billingCycle: 'Monthly',
    nextRenewalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Software',
    isTrial: false,
    status: 'Active',
    logoUrl: 'https://picsum.photos/seed/adobe/64/64'
  },
  {
    id: '3',
    name: 'Fitness Plus',
    cost: 9.99,
    currency: 'USD',
    billingCycle: 'Monthly',
    nextRenewalDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Health',
    isTrial: true,
    status: 'Expiring Soon',
    logoUrl: 'https://picsum.photos/seed/fitness/64/64'
  }
];

const App: React.FC = () => {
  // Load state from local storage
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem('subtrackr_onboarded') === 'true';
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('subtrackr_subscriptions');
    return saved ? JSON.parse(saved) : [];
  });

  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('subtrackr_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('subtrackr_onboarded', hasOnboarded.toString());
  }, [hasOnboarded]);

  const totalMonthlySpend = useMemo(() => {
    return subscriptions
      .filter(s => s.status !== 'Canceled')
      .reduce((acc, curr) => acc + curr.cost, 0);
  }, [subscriptions]);

  const upcomingRenewals = useMemo(() => {
    return subscriptions
      .filter(s => s.status !== 'Canceled')
      .sort((a, b) => new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime())
      .slice(0, 3);
  }, [subscriptions]);

  const handleAddSubscriptions = (newSubs: Subscription[]) => {
    setSubscriptions(prev => [...prev, ...newSubs]);
    setView(ViewState.DASHBOARD);
  };

  const handleCancelSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: 'Canceled' } : sub
    ));
  };

  const handleUpdateCategory = (id: string, newCategory: string) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, category: newCategory } : sub
    ));
  };

  const handleOnboardingComplete = (loadDemo: boolean) => {
    if (loadDemo) {
      setSubscriptions(DEMO_SUBSCRIPTIONS);
    }
    setHasOnboarded(true);
  };

  const handleClearData = () => {
      if(window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
          // 1. Update React state immediately to give visual feedback and clear UI
          setSubscriptions([]);
          setHasOnboarded(false);
          
          // 2. Clear storage keys specifically
          localStorage.removeItem('subtrackr_subscriptions');
          localStorage.removeItem('subtrackr_onboarded');
          
          // 3. Force reload to ensure a clean slate, using timeout to allow storage operations to complete
          setTimeout(() => {
             window.location.reload();
          }, 100);
      }
  }

  const NavItem = ({ viewTarget, icon: Icon, label }: { viewTarget: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => {
        setView(viewTarget);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all ${
        view === viewTarget 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  // Show Onboarding Flow
  if (!hasOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <CreditCard className="w-6 h-6" />
          <span>SubTrackr</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-0 z-10 bg-white md:sticky md:top-0 md:h-screen border-r border-slate-200 p-6 flex flex-col
        transition-transform duration-300 ease-in-out overflow-y-auto
        ${isMobileMenuOpen ? 'translate-x-0 pt-20' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:flex items-center gap-2 text-indigo-600 font-bold text-2xl mb-10 px-2">
          <CreditCard className="w-7 h-7" />
          <span>SubTrackr</span>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem viewTarget={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem viewTarget={ViewState.SUBSCRIPTIONS} icon={List} label="My Subscriptions" />
          <NavItem viewTarget={ViewState.SCANNER} icon={Plus} label="Scan & Add" />
          <NavItem viewTarget={ViewState.INSIGHTS} icon={BarChart2} label="Insights" />
          <NavItem viewTarget={ViewState.SETTINGS} icon={SettingsIcon} label="Settings" />
        </nav>

        <div className="mt-8 space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Total Monthly</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                    ${totalMonthlySpend.toFixed(2)}
                </div>
                <p className="text-xs text-slate-400 mt-1">Local data • Private</p>
            </div>
            
            <button onClick={handleClearData} className="text-xs text-slate-400 hover:text-red-500 w-full text-center py-2">
                Reset App Data
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {view === ViewState.DASHBOARD && 'Dashboard'}
                {view === ViewState.SCANNER && 'Scan Subscriptions'}
                {view === ViewState.SUBSCRIPTIONS && 'All Subscriptions'}
                {view === ViewState.INSIGHTS && 'Spending Insights'}
                {view === ViewState.SETTINGS && 'Settings'}
              </h1>
              <p className="text-slate-500 mt-1">
                {view === ViewState.DASHBOARD && `Welcome back. You have ${upcomingRenewals.length} renewals coming up.`}
                {view === ViewState.SCANNER && 'Paste text to detect subscriptions locally.'}
                {view === ViewState.SUBSCRIPTIONS && 'Manage and audit your recurring expenses.'}
                {view === ViewState.INSIGHTS && 'Analyze your spending habits and find savings.'}
                {view === ViewState.SETTINGS && 'Manage notifications and automation preferences.'}
              </p>
            </div>
            
            {(view === ViewState.DASHBOARD || view === ViewState.SUBSCRIPTIONS) && (
              <button 
                onClick={() => setView(ViewState.SCANNER)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New
              </button>
            )}
          </header>

          {/* View: Dashboard */}
          {view === ViewState.DASHBOARD && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
              
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="text-slate-400 text-sm font-medium mb-1">Active Subs</div>
                      <div className="text-2xl font-bold text-slate-800">{subscriptions.filter(s => s.status === 'Active').length}</div>
                   </div>
                   <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="text-slate-400 text-sm font-medium mb-1">Monthly Spend</div>
                      <div className="text-2xl font-bold text-indigo-600">${totalMonthlySpend.toFixed(2)}</div>
                   </div>
                   <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="text-slate-400 text-sm font-medium mb-1">Yearly Proj.</div>
                      <div className="text-2xl font-bold text-slate-800">${(totalMonthlySpend * 12).toFixed(2)}</div>
                   </div>
                </div>

                {/* Spending Chart Summary */}
                <SpendingChart subscriptions={subscriptions} />

                {/* Recent Subs Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Your Subscriptions</h3>
                    <button onClick={() => setView(ViewState.SUBSCRIPTIONS)} className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
                  </div>
                  <SubscriptionList 
                    subscriptions={subscriptions.slice(0, 4)} 
                    onCancelSubscription={handleCancelSubscription}
                    onUpdateCategory={handleUpdateCategory}
                  />
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                
                {/* Renewals Widget */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-500" />
                    Upcoming Renewals
                  </h3>
                  <div className="space-y-4">
                    {upcomingRenewals.map(sub => (
                      <div key={sub.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 text-xs font-bold text-slate-700">
                          {new Date(sub.nextRenewalDate).getDate()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 truncate">{sub.name}</div>
                          <div className="text-xs text-slate-500">In {Math.ceil((new Date(sub.nextRenewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days</div>
                        </div>
                        <div className="font-bold text-slate-800">${sub.cost}</div>
                      </div>
                    ))}
                    {upcomingRenewals.length === 0 && (
                        <div className="text-sm text-slate-400 text-center py-4">No upcoming renewals soon.</div>
                    )}
                  </div>
                </div>

                {/* Trial Alert Widget */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200">
                   <h3 className="font-bold text-lg mb-2">Save Money Today</h3>
                   <p className="text-indigo-100 text-sm mb-4">You have {subscriptions.filter(s => s.isTrial).length} active free trials. Don't forget to cancel before they charge you!</p>
                   <button 
                     onClick={() => setView(ViewState.INSIGHTS)}
                     className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white rounded-lg py-2 text-sm font-medium transition-colors"
                   >
                     View Savings
                   </button>
                </div>

              </div>
            </div>
          )}

          {/* View: Scanner */}
          {view === ViewState.SCANNER && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Scanner 
                onSubscriptionsFound={handleAddSubscriptions}
                onCancel={() => setView(ViewState.DASHBOARD)}
              />
            </div>
          )}

          {/* View: Subscriptions List */}
          {view === ViewState.SUBSCRIPTIONS && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <SubscriptionList 
                    subscriptions={subscriptions} 
                    onCancelSubscription={handleCancelSubscription}
                    onUpdateCategory={handleUpdateCategory} 
                  />
                </div>
             </div>
          )}

          {/* View: Insights */}
          {view === ViewState.INSIGHTS && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Insights subscriptions={subscriptions} />
             </div>
          )}

          {/* View: Settings */}
          {view === ViewState.SETTINGS && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Settings />
             </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;