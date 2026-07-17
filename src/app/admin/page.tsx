"use client";
import React, { useState } from 'react';
import AdminView from '@/components/AdminView';
import { Lock } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Privzeto geslo, če okoljska spremenljivka ni nastavljena
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'kts_admin_2026';
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (isAuthenticated) {
    return (
      <main className="min-h-screen p-4 sm:p-8 bg-kts-black">
        <AdminView />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-kts-black">
      <div className="w-full max-w-sm bg-kts-gray border border-neutral-800 rounded-3xl p-8 shadow-2xl animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-kts-orange/10 rounded-2xl flex items-center justify-center text-kts-orange mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold">KTŠ Admin Prijava</h1>
          <p className="text-neutral-400 text-xs mt-1">Za dostop vnesite skrbniško geslo</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="password" 
              placeholder="Vnesite geslo" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-neutral-950 border rounded-xl py-3 px-4 text-sm text-white focus:outline-none transition ${
                error 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-neutral-800 focus:border-kts-orange'
              }`}
            />
            {error && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">
                Napačno geslo. Poskusite ponovno.
              </p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-kts-orange hover:bg-kts-orange/90 text-black font-bold py-3 px-4 rounded-xl text-sm transition duration-200 active:scale-[0.99]"
          >
            Prijava
          </button>
        </form>
      </div>
    </main>
  );
}
