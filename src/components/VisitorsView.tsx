"use client";
import React, { useEffect, useState } from 'react';
import { supabase, Member } from '@/lib/supabase';
import { Phone, Clock, Radio } from 'lucide-react';

export default function VisitorView() {
  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveMember = async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('active', true)
        .maybeSingle();

      if (!error && data) {
        setActiveMember(data);
      } else {
        setActiveMember(null);
      }
      setLoading(false);
    };

    fetchActiveMember();

    // Supabase Realtime naročnina
    const channel = supabase
      .channel('public:members')
      .on('postgres_changes', { event: 'UPDATE', pattern: 'public:members' }, () => {
        fetchActiveMember();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('sl-SI', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-kts-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto text-center animate-fade-in">
      {/* Logo & Header */}
      <div className="mb-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-kts-orange rounded-3xl flex items-center justify-center font-black text-2xl text-black shadow-lg shadow-kts-orange/20 mb-4 tracking-tighter">
          KTŠ
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Uradne ure</h1>
        <p className="text-neutral-400 text-sm mt-1">Klub Tržiških Študentov</p>
      </div>

      {/* Status Card */}
      <div className="bg-kts-gray border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
        {activeMember ? (
          <>
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-kts-orange/10 border border-kts-orange/20 text-kts-orange px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider animate-pulse-subtle">
              <Radio className="w-3 h-3" /> V živo
            </div>

            <div className="flex flex-col items-center mt-4">
              <img 
                src={activeMember.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeMember.name}`} 
                alt={activeMember.name}
                className="w-24 h-24 rounded-full border-2 border-kts-orange/40 p-1 mb-4 bg-neutral-800"
              />
              <h2 className="text-2xl font-bold text-white mb-1">{activeMember.name}</h2>
              <p className="text-neutral-400 text-sm flex items-center gap-1.5 mb-6">
                <Clock className="w-4 h-4 text-kts-orange" /> Prijavljen ob {formatTime(activeMember.login_time)}
              </p>

              <a 
                href={`tel:${activeMember.phone.replace(/\s+/g, '')}`}
                className="w-full bg-kts-orange hover:bg-kts-orange/90 text-black font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition duration-200 active:scale-[0.98] shadow-lg shadow-kts-orange/20"
              >
                <Phone className="w-5 h-5 fill-black" /> Pokliči člana
              </a>
            </div>
          </>
        ) : (
          <div className="py-8 px-4 flex flex-col items-center">
            <div className="w-12 h-12 bg-neutral-800/80 rounded-full flex items-center justify-center text-neutral-500 mb-4">
              <Radio className="w-6 h-6" />
            </div>
            <p className="text-xl font-medium text-neutral-300 max-w-[280px] leading-relaxed">
              Trenutno ni nikogar na uradnih urah.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}