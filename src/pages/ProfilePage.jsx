import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Sliders,
  PieChart,
  Key,
  Shield,
  Camera,
  Brain,
  Lock,
  Database,
  ArrowLeft,
  Check,
  Trash2,
  Zap,
  Save,
  Copy,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/dataStoring';
import { fetchModels, sendChatMessage } from '../APIs/chatApi';
import NexoraLogo from '../components/NexoraLogo';

 function ProfilePage() {
  const navigate = useNavigate();

  // Navigation State
  const [activeTab, setActiveTab] = useState('ai-preferences');

  // Firebase user
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Form & Settings States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    model: 'openai/gpt-oss-120b',
    temperature: 0.7,
    instructions: 'I am a Senior React developer. Keep answers concise, code-first, and avoid unnecessary explanations unless asked.',
    saveHistory: true,
    memoryRetention: true,
  });

  // UI States
  const [isSaved, setIsSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const apiKey = 'sk-proj-8f92a10b4c8d1e2f3g4h5i6j7k8l9m0n';

  // Fetch real models from Groq API
  const { data: groqModels, isLoading: modelsLoading, isError: modelsError } = useQuery({
    queryKey: ['groqModels'],
    queryFn: fetchModels,
    staleTime: 1000 * 60 * 60,
  });

  // Load the authenticated user from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setFormData((prev) => ({
          ...prev,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
          email: firebaseUser.email || '',
          model: prev.model || 'openai/gpt-oss-120b',
        }));
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Input Change Handlers
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Helper function for temperature description
  const getTempDescription = (val) => {
    if (val < 0.4) return 'Precise & Deterministic';
    if (val > 0.7) return 'Creative & Imaginative';
    return 'Balanced & Standard';
  };

  const navItems = [
    { id: 'account', label: 'Account & Profile', icon: User },
    { id: 'ai-preferences', label: 'AI Preferences', icon: Sliders },
    { id: 'usage', label: 'Token Usage & Billing', icon: PieChart },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'privacy', label: 'Data & Privacy', icon: Shield },
  ];

  // Auth Loading / No User State
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-screen bg-slate-950 text-emerald-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-medium">Loading profile...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-screen bg-slate-950 text-slate-400 px-6 text-center">
        <User className="w-10 h-10" />
        <span className="text-sm font-medium">You are not signed in.</span>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Save Toast Notification */}
      {isSaved && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl shadow-lg font-medium text-sm transition-all animate-bounce">
          <Check className="w-4 h-4" />
          Settings saved successfully!
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to={"/home"}><NexoraLogo className="w-8 h-8" textClassName="text-lg" /></Link>
          </div>
          <button onClick={() => navigate('/home')} className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Chat
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-2">
            <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1 overflow-x-auto pb-2 lg:pb-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition w-full text-left whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-800 text-emerald-400 border border-slate-700/50 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Plan Usage Widget */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hidden lg:block">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Plan</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-medium border border-emerald-500/20">
                  Pro Member
                </span>
              </div>
              <p className="text-sm text-slate-300 font-medium">GPT-4o & Claude 3.5</p>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Monthly Tokens</span>
                  <span>68.4k / 100k</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
                    style={{ width: '68%' }}
                  />
                </div>
              </div>
              <button className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg transition font-medium border border-slate-700 flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Upgrade Tier
              </button>
            </div>
          </aside>

          {/* Main Form Body */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* User Profile Header Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="relative group cursor-pointer">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center ring-2 ring-emerald-500/30">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-xs font-medium text-white gap-1">
                    <Camera className="w-4 h-4" /> Edit
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white">{formData.name}</h2>
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                      Pro
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{formData.email}</p>
                  <p className="text-xs text-slate-500 mt-1">Member since Jan 2024</p>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full md:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>

            {/* TAB 1: ACCOUNT & PROFILE */}
            {(activeTab === 'account' || activeTab === 'all') && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-400" /> Account Details
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Manage your basic personal information.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: AI PREFERENCES */}
            {(activeTab === 'ai-preferences' || activeTab === 'all') && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-emerald-400" /> Default AI Preferences
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Configure default model behaviors and prompts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Model Selector */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">Default Model</label>
                    <select
                      value={formData.model}
                      onChange={(e) => handleChange('model', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                    >
                      {modelsLoading && (
                        <option value={formData.model}>Loading models...</option>
                      )}
                      {modelsError && (
                        <option value={formData.model}>
                          {formData.model || 'Error loading models'}
                        </option>
                      )}
                      {groqModels?.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.id}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Temperature Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-slate-300">Creativity / Temperature</label>
                      <span className="text-xs text-emerald-400 font-mono">
                        {formData.temperature} ({getTempDescription(formData.temperature)})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-3"
                    />
                  </div>
                </div>

                {/* Custom System Prompt */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Custom System Prompt / Context Memory
                  </label>
                  <textarea
                    rows={4}
                    value={formData.instructions}
                    onChange={(e) => handleChange('instructions', e.target.value)}
                    placeholder="Tell the AI who you are, your tech stack, or how you like responses formatted..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition resize-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: TOKEN USAGE & BILLING */}
            {(activeTab === 'usage' || activeTab === 'all') && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-emerald-400" /> Token Usage & Limits
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Monitor consumption across your models this cycle.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-400">Total Spent</p>
                    <p className="text-xl font-bold text-white mt-1">$14.20 / $25.00</p>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-400">Tokens Generated</p>
                    <p className="text-xl font-bold text-white mt-1">68,400</p>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-400">Billing Cycle Ends</p>
                    <p className="text-xl font-bold text-emerald-400 mt-1">12 Days</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: API KEYS */}
            {(activeTab === 'api-keys' || activeTab === 'all') && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-emerald-400" /> Personal API Keys
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Use your key to integrate BotForge into external apps.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Active Secret Key</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        readOnly
                        value={apiKey}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-300 font-mono focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition flex items-center gap-2 border border-slate-700"
                    >
                      {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      {copiedKey ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: PRIVACY & DATA */}
            {(activeTab === 'privacy' || activeTab === 'all') && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" /> Data & Privacy Controls
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Manage chat history retention and account data.</p>
                </div>

                <div className="space-y-4">
                  {/* Switch 1 */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div>
                      <p className="text-sm font-medium text-slate-200">Save Conversation History</p>
                      <p className="text-xs text-slate-500">Allow chats to be stored for future retrieval.</p>
                    </div>
                    <button
                      onClick={() => handleChange('saveHistory', !formData.saveHistory)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                        formData.saveHistory ? 'bg-emerald-600' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          formData.saveHistory ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Switch 2 */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div>
                      <p className="text-sm font-medium text-slate-200">Memory & Context Retention</p>
                      <p className="text-xs text-slate-500">Allow AI to remember facts about you across chats.</p>
                    </div>
                    <button
                      onClick={() => handleChange('memoryRetention', !formData.memoryRetention)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                        formData.memoryRetention ? 'bg-emerald-600' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          formData.memoryRetention ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-4 justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Danger Zone
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Irreversibly clear all active model memories.</p>
                  </div>
                  <button className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium rounded-xl transition flex items-center gap-2">
                    <Trash2 className="w-3.5 h-3.5" /> Clear All Memories
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage