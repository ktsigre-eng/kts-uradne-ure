"use client";
import React from 'react';
import { Member } from '@/lib/supabase';
import { Phone, Check } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onActivate: (id: string) => void;
  loadingId: string | null;
}

export default function MemberCard({ member, onActivate, loadingId }: MemberCardProps) {
  const isLoading = loadingId === member.id;

  return (
    <div className={`bg-kts-gray border rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between ${member.active ? 'border-kts-orange shadow-lg shadow-kts-orange/5' : 'border-neutral-800'}`}>
      <div className="flex items-center gap-4 mb-5">
        <img 
          src={member.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${member.name}`} 
          alt={member.name}
          className="w-14 h-14 rounded-full bg-neutral-800 border border-neutral-700 p-0.5"
        />
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            {member.name}
            {member.active && <span className="w-2 h-2 rounded-full bg-kts-orange inline-block" />}
          </h3>
          <p className="text-sm text-neutral-400 flex items-center gap-1 mt-0.5">
            <Phone className="w-3.5 h-3.5" /> {member.phone}
          </p>
        </div>
      </div>

      <button
        onClick={() => onActivate(member.id)}
        disabled={member.active || loadingId !== null}
        className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition duration-200 ${
          member.active 
            ? 'bg-kts-orange/10 text-kts-orange border border-kts-orange/20 cursor-default' 
            : 'bg-neutral-800 hover:bg-neutral-700 text-white disabled:opacity-50'
        }`}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : member.active ? (
          <>
            <Check className="w-4 h-4" /> Trenutno aktiven
          </>
        ) : (
          'Začni uradne ure'
        )}
      </button>
    </div>
  );
}