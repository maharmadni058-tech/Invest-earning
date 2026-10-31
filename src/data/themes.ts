import { ThemeConfig, ThemeStyle } from '../types';

export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: 'sapphire-night',
    name: 'Midnight Sapphire',
    tagline: 'Deep Royal Navy, Ice Cyan & Platinum FinTech',
    primaryColor: '#38bdf8',
    accentColor: '#818cf8',
    previewBg: 'from-[#0a1532] via-[#040814] to-black'
  },
  {
    id: 'emerald-wealth',
    name: 'Emerald Sovereign',
    tagline: 'Islamic Wealth, Royal Emerald & Champagne Gold',
    primaryColor: '#10b981',
    accentColor: '#fbbf24',
    previewBg: 'from-emerald-950 via-[#04140d] to-zinc-950'
  },
  {
    id: 'obsidian-gold',
    name: 'Imperial Obsidian',
    tagline: 'Noir Velvet & 24K Brushed Gold Luxury',
    primaryColor: '#e5b842',
    accentColor: '#f59e0b',
    previewBg: 'from-[#171408] via-[#090a0d] to-black'
  },
  {
    id: 'crimson-ruby',
    name: 'Velvet Crimson',
    tagline: 'Royal Garnet, Rose Gold & High-Roller VIP',
    primaryColor: '#f43f5e',
    accentColor: '#fda4af',
    previewBg: 'from-[#240612] via-[#0f0408] to-black'
  },
  {
    id: 'royal-slate',
    name: 'Nordic Titanium',
    tagline: 'Matte Gunmetal, Titanium & Champagne Gold',
    primaryColor: '#e2e8f0',
    accentColor: '#eab308',
    previewBg: 'from-[#141923] via-[#090b10] to-black'
  }
];

export const DEFAULT_THEME: ThemeStyle = 'sapphire-night';
