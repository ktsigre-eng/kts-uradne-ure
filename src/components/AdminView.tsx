"use client";
import React, { useEffect, useState } from 'react';
import { supabase, Member } from '@/lib/supabase';
import { useToast } from './ui/toast';
import MemberCard from './MemberCard';
import { LogOut, Plus, User, Phone as PhoneIcon, X } from 'lucide-react';

export default function AdminView() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [endHoursLoading, setEndHoursLoading] = useState(false);
  
  // Stanje za novega člana
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const { showToast } = useToast();

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data) setMembers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();

    const channel = supabase
      .channel('admin:members')
      .on('postgres_changes', { event: '*', pattern: 'public:members' }, () => {
        fetchMembers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStartHours = async (id: string) => {
    setActionLoadingId(id);
    const { error } = await supabase
      .from('members')
      .update({ active: true, login_time: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      showToast('Napaka pri aktivaciji člana.', 'error');
    } else {
      showToast('Uradne ure uspešno začete.');
    }
    setActionLoadingId(null);
  };

  const handleEndHours = async () => {
    setEndHoursLoading(true);
    const { error } = await supabase
      .from('members')
      .update({ active: false, login_time: null })
      .eq('active', true);

    if (error) {
      showToast('Napaka pri zaključevanju uradnih ur.', 'error');
    } else {
      showToast('Uradne ure so zaključene.');
    }
    setEndHoursLoading(false);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      showToast('Prosimo, izpolnite vsa polja.', 'error');
      return;
    }

    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(newName.trim())}`;

    const { error } = await supabase
      .from('members')
      .insert([{ name: newName.trim(), phone: newPhone.trim(), active: false, avatar_url: avatarUrl }]);

    if (error) {
      showToast('Napaka pri dodajanju člana.', 'error');
    } else {
      showToast('Član uspešno dodan.');
      setNewName('');
      setNewPhone('');
      setShowAddForm(false);
    }
  };

  const hasActiveMember = members.some(m => m.active);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-kts-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in p-4">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <span className="text-kts-orange">KTŠ</span> Admin Nadzorna Plošča
          </h1>
          <p className="text-neutral-400 text-sm">Upravljanje prisotnosti na uradnih urah</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm flex items-center gap-1.5 transition"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {showAddForm ? 'Prekliči' : 'Dodaj člana'}
          </button>

          {hasActiveMember && (
            <button
              onClick={handleEndHours}
              disabled={endHoursLoading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center gap-1.5 transition shadow-lg shadow-red-600/10 disabled:opacity-50"
            >
              {endHoursLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogOut className="w-4 h-4" /> Končaj uradne ure
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Add Member Form Modal-ish Card */}
      {showAddForm && (
        <form onSubmit={handleAddMember} className="bg-kts-gray border border-kts-orange/30 rounded-2xl p-6 mb-8 animate-fade-in grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Ime člana</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Npr. Luka" 
                value={newName} 
                onChange={e => setNewName(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-kts-orange transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Telefonska številka</label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Npr. 040 123 456" 
                value={newPhone} 
                onChange={e => setNewPhone(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-kts-orange transition"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-kts-orange hover:bg-kts-orange/90 text-black font-bold py-2.5 px-4 rounded-xl text-sm transition h-[42px]"
          >
            Shrani člana
          </button>
        </form>
      )}

      {/* Grid of Members */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {members.map(member => (
          <MemberCard 
            key={member.id} 
            member={member} 
            onActivate={handleStartHours} 
            loadingId={actionLoadingId} 
          />
        ))}
      </div>
    </div>
  );
}