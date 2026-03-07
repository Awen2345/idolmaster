import React from 'react';
import { Sparkles } from 'lucide-react';

export function NavBtn({ icon, label, color, rounded = false }: { icon: React.ReactNode, label: string, color: string, rounded?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center w-14 h-14 bg-gradient-to-b ${color} border border-white/30 shadow-inner cursor-pointer hover:brightness-110 transition-all ${rounded ? 'rounded-full w-16 h-16 -mt-2 border-2 border-white' : 'rounded-md'}`}>
      <div className="text-white drop-shadow-md mb-1">{icon}</div>
      <span className="text-[8px] text-white font-bold drop-shadow-md leading-none text-center w-full px-1">{label}</span>
    </div>
  );
}

export function StatusBox({ icon, text, value, color, rounded = false, flex = false }: { icon?: React.ReactNode, text?: string, value?: string, color: string, rounded?: boolean, flex?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center ${color} border-2 border-white shadow-md cursor-pointer hover:brightness-110 transition-all ${rounded ? 'rounded-full w-14 h-14' : 'rounded-lg px-2 py-1'} ${flex ? 'flex-1' : ''}`}>
      {text && <span className="text-[10px] text-white font-bold drop-shadow-md text-center leading-tight">{text}</span>}
      {icon && <div className="text-white drop-shadow-md my-0.5">{icon}</div>}
      {value && <span className="text-xs text-white font-black drop-shadow-md">{value}</span>}
    </div>
  );
}

export function StatusBar({ label, subLabel, value, color }: { label: string, subLabel: string, value: string, color: string }) {
  return (
    <div className="flex flex-col items-center justify-between bg-white border-2 border-gray-300 rounded-lg overflow-hidden flex-1 cursor-pointer hover:brightness-95 transition-all">
      <div className="w-full text-center py-0.5 border-b border-gray-200">
        <span className="text-[10px] font-black text-gray-800">{label}</span>
      </div>
      <div className="w-full px-1 py-0.5">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-0.5">
          <div className={`h-full ${color} w-3/4`}></div>
        </div>
        <div className="flex justify-between items-center w-full bg-black text-white px-1 rounded text-[9px] font-bold">
          <span className="text-yellow-400">{subLabel}</span>
          <span>{value}</span>
        </div>
      </div>
    </div>
  );
}

export function ActionBtn({ icon, label, color, borderColor, textColor, small = false }: { icon: React.ReactNode, label: string, color: string, borderColor: string, textColor: string, small?: boolean }) {
  return (
    <div className={`flex-1 flex flex-col items-center justify-center bg-gradient-to-b ${color} border-2 ${borderColor} rounded-lg shadow-md cursor-pointer hover:brightness-105 transition-all ${small ? 'py-1' : 'py-2'}`}>
      <div className="drop-shadow-sm mb-1">{icon}</div>
      <span className={`font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] ${textColor} ${small ? 'text-[10px]' : 'text-xs'}`}>{label}</span>
    </div>
  );
}

export function BottomNavBtn({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-16 h-12 cursor-pointer hover:bg-blue-200/50 rounded transition-colors">
      {icon}
      <span className="text-[9px] font-bold text-blue-600 mt-0.5">{label}</span>
    </div>
  );
}

export function MenuCircleBtn({ icon, label, borderColor, dark = false }: { icon: React.ReactNode, label: string, borderColor: string, dark?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
      <div className={`w-16 h-16 rounded-full border-2 ${borderColor} ${dark ? 'bg-slate-800' : 'bg-white'} flex items-center justify-center shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2),0_4px_4px_rgba(0,0,0,0.5)] relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="relative z-10 drop-shadow-md">{icon}</div>
      </div>
      <span className="text-[10px] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,1)] text-center leading-tight whitespace-pre-line">
        {label.replace('&', '&\n')}
      </span>
    </div>
  );
}

export function MenuSquareBtn({ icon, label, borderColor, small = false }: { icon: React.ReactNode, label: string, borderColor: string, small?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
      <div className={`rounded-xl border-2 ${borderColor} bg-white flex items-center justify-center shadow-[inset_0_-4px_8px_rgba(0,0,0,0.1),0_4px_4px_rgba(0,0,0,0.5)] relative overflow-hidden ${small ? 'w-12 h-12' : 'w-14 h-14'}`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="relative z-10 drop-shadow-md">{icon}</div>
      </div>
      <span className={`font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,1)] text-center leading-tight whitespace-pre-line ${small ? 'text-[8px]' : 'text-[10px]'}`}>
        {label.replace('List', 'List\n').replace('Dorm', 'Dorm\n')}
      </span>
    </div>
  );
}

export function MenuSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="h-px bg-blue-400/50 flex-1 border-dotted border-b-2 border-blue-400/50"></div>
        <Sparkles size={12} className="text-blue-300" />
        <h4 className="text-white font-bold text-sm tracking-widest drop-shadow-md">{title}</h4>
        <Sparkles size={12} className="text-blue-300" />
        <div className="h-px bg-blue-400/50 flex-1 border-dotted border-b-2 border-blue-400/50"></div>
      </div>
      {children}
    </div>
  );
}
