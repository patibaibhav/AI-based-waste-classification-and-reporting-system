import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, Leaf, Mail, UserCircle, Moon, Sun, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedType, setSelectedType] = useState<'user' | 'admin' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogin = () => {
    if (selectedType && name && email) {
      login(selectedType, name, email);
      if (selectedType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  };

  if (!selectedType) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-black flex justify-center">
        <div className="w-full max-w-md min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 relative shadow-2xl flex flex-col">
          {/* Theme Toggle */}
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full shadow-lg text-gray-800 dark:text-gray-200 min-w-[56px] min-h-[56px] flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={28} /> : <Moon size={28} />}
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 py-8">
            <div className="w-full pb-8">
              {/* Logo & Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-28 h-28 bg-green-500 rounded-full mb-6 shadow-xl shadow-green-500/30">
                  <Leaf size={56} className="text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">Welcome</h1>
                <p className="text-gray-600 dark:text-gray-400 text-xl px-4">AI Waste Segregation System</p>
              </div>

              {/* Selection Cards */}
              <div className="space-y-5 px-2">
                <button
                  onClick={() => setSelectedType('user')}
                  className="w-full bg-white dark:bg-gray-900 rounded-3xl p-8 border-4 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] min-h-[120px]"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex-shrink-0 w-20 h-20 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center">
                      <User size={40} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-left flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Login as User</h2>
                      <p className="text-gray-600 dark:text-gray-400 text-base">Access waste classification and reporting</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedType('admin')}
                  className="w-full bg-white dark:bg-gray-900 rounded-3xl p-8 border-4 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] min-h-[120px]"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex-shrink-0 w-20 h-20 bg-purple-100 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center">
                      <ShieldCheck size={40} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-left flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Login as Admin</h2>
                      <p className="text-gray-600 dark:text-gray-400 text-base">Access dashboard and manage complaints</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Footer Info */}
              <div className="mt-8 bg-blue-50 dark:bg-blue-900/40 border-2 border-blue-200 dark:border-blue-800/60 rounded-3xl p-6 mx-2">
                <p className="text-blue-800 dark:text-blue-300 text-center text-base font-semibold">
                  Select your role to continue
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login Form
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 relative shadow-2xl flex flex-col">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full shadow-lg text-gray-800 dark:text-gray-200 min-w-[56px] min-h-[56px] flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={28} /> : <Moon size={28} />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div className="w-full">
            {/* Back Button */}
            <button
              onClick={() => setSelectedType(null)}
              className="mb-8 px-6 py-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold text-lg flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm active:scale-95 transition-transform min-h-[60px]"
            >
              <ArrowLeft size={24} />
              Back to selection
            </button>

            {/* Logo & Header */}
            <div className="text-center mb-10">
              <div className={`inline-flex items-center justify-center w-24 h-24 ${selectedType === 'admin' ? 'bg-purple-500' : 'bg-blue-500'} rounded-full mb-6 shadow-xl`}>
                {selectedType === 'admin' ? (
                  <ShieldCheck size={48} className="text-white" />
                ) : (
                  <User size={48} className="text-white" />
                )}
              </div>
              <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                {selectedType === 'admin' ? 'Admin Login' : 'User Login'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg px-4">
                {selectedType === 'admin' ? 'Enter your admin credentials' : 'Enter your details to continue'}
              </p>
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-2xl">
              <div className="space-y-7">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <div className="flex items-center gap-2">
                      <UserCircle size={24} />
                      Full Name
                    </div>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none text-xl min-h-[72px] placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <div className="flex items-center gap-2">
                      <Mail size={24} />
                      Email Address
                    </div>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    inputMode="email"
                    className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none text-xl min-h-[72px] placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                <Button
                  variant={selectedType === 'admin' ? 'primary' : 'primary'}
                  fullWidth
                  onClick={handleLogin}
                  disabled={!name || !email}
                >
                  {selectedType === 'admin' ? 'Login as Admin' : 'Login as User'}
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/40 border-2 border-blue-200 dark:border-blue-800/60 rounded-3xl p-6">
              <p className="text-blue-800 dark:text-blue-300 text-center text-base font-semibold leading-relaxed">
                Demo login - just enter any name and email
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}