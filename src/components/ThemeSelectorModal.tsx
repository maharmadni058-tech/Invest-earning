import React from 'react';
import { useApp } from '../context/AppContext';
import { THEME_PRESETS } from '../data/themes';
import { ThemeStyle } from '../types';
import { Palette, Check, X, Sparkles } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme, setCurrentTheme, showToast } = useApp();

  if (!isOpen) return null;

  const handleSelectTheme = (themeId: ThemeStyle, themeName: string) => {
    setCurrentTheme(themeId);
    showToast('info', 'Theme Style Updated', `Active theme changed to ${themeName}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0c0f17] border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-[#080a10]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-[#080a10] rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display tracking-wider">
                CHOOSE THEME STYLE
              </h3>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
                Transform Entire Portal Aesthetic &amp; Colors
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Themes List */}
        <div className="p-4 sm:p-6 space-y-3 max-h-[75vh] overflow-y-auto">
          {THEME_PRESETS.map((preset) => {
            const isSelected = currentTheme === preset.id;

            return (
              <div
                key={preset.id}
                onClick={() => handleSelectTheme(preset.id, preset.name)}
                className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-gradient-to-r from-zinc-900 to-[#121622] border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50'
                    : 'bg-[#10131d]/80 hover:bg-[#151926] border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Theme Color Palette Preview Swatch */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${preset.previewBg} p-[1.5px] border border-white/10 shrink-0 shadow-md flex items-center justify-center relative overflow-hidden`}>
                    <div className="flex items-center -space-x-1">
                      <span
                        className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: preset.primaryColor }}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: preset.accentColor }}
                      />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                        {preset.name}
                      </h4>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono uppercase border border-emerald-500/30">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-snug">
                      {preset.tagline}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isSelected ? (
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-md shadow-amber-500/30">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 group-hover:text-white text-xs font-mono font-medium transition-colors"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#080a10] flex items-center justify-between text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Theme auto-saves to your device</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
