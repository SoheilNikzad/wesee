import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  TrendingUp, 
  MapPin, 
  ExternalLink, 
  Coins, 
  ShieldCheck 
} from 'lucide-react';
import { RWAAsset } from '../types';
import { Language, TRANSLATIONS } from '../translations';

interface AssetCatalogProps {
  assets: RWAAsset[];
  lang: Language;
  onSelectAsset: (asset: RWAAsset) => void;
  onOpenWizard: () => void;
  canTokenize: boolean;
  isDarkMode: boolean;
}

export const AssetCatalog: React.FC<AssetCatalogProps> = ({
  assets,
  lang,
  onSelectAsset,
  onOpenWizard,
  canTokenize,
  isDarkMode
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: t.allAssets },
    { id: 'real-estate', label: t.realEstate },
    { id: 'gold', label: t.goldCommodities },
    { id: 'energy', label: t.cleanEnergy },
    { id: 'agriculture', label: t.agriculture },
  ];

  const filteredAssets = assets.filter((asset) => {
    const matchesCat = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.tokenSymbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="catalog" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7931A]/10 text-[#F7931A] text-xs font-semibold mb-3">
            <Coins className="w-3.5 h-3.5" />
            <span className="font-vazir">{t.catalogTitle}</span>
          </div>
          <h2 className={`text-3xl font-black tracking-tight font-vazir ${
            isDarkMode ? 'text-white' : 'text-neutral-900'
          }`}>
            {t.catalogSubtitle}
          </h2>
          <p className={`text-xs sm:text-sm mt-2 max-w-2xl font-vazir ${
            isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            فرصت‌های سرمایه‌گذاری با پشتوانه رسمی دادگستری و قابلیت نقدشوندگی آنی روی شبکه‌های کم‌کارمزد.
          </p>
        </div>

        {canTokenize && (
          <button
            onClick={onOpenWizard}
            className="self-start md:self-auto px-5 py-2.5 rounded-2xl bg-[#F7931A] hover:bg-[#E07E05] text-black font-black text-xs transition-all shadow-lg shadow-[#F7931A]/20 font-vazir"
          >
            + {t.tokenizeNewAsset}
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-3 rounded-2xl border transition-colors ${
        isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
      }`}>
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none font-vazir">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#F7931A] text-black shadow-md shadow-[#F7931A]/20'
                  : isDarkMode ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full pl-4 pr-10 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#F7931A] font-vazir ${
              isDarkMode 
                ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500' 
                : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
            }`}
          />
          <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-2.5" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => {
          const progressPercent = Math.min(100, Math.round((asset.tokensSold / asset.totalSupply) * 100));

          return (
            <div
              key={asset.id}
              className={`rounded-3xl overflow-hidden border flex flex-col justify-between group transition-all duration-300 font-vazir ${
                isDarkMode 
                  ? 'bg-[#121212] border-neutral-800 hover:border-[#F7931A]/40 hover:shadow-xl hover:shadow-[#F7931A]/5' 
                  : 'bg-white border-neutral-200 hover:border-[#F7931A]/60 shadow-xs hover:shadow-lg'
              }`}
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={asset.imageUrl}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 opacity-80 ${
                    isDarkMode ? 'bg-gradient-to-t from-[#121212] via-transparent to-transparent' : 'bg-gradient-to-t from-white via-transparent to-transparent'
                  }`} />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white font-vazir">
                    {asset.categoryLabel}
                  </div>

                  {/* Network Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[11px] font-mono font-medium flex items-center gap-1.5 text-white">
                    <span className={`w-2 h-2 rounded-full ${asset.network === 'polygon' ? 'bg-purple-400' : 'bg-yellow-400'}`} />
                    <span className="uppercase">{asset.network}</span>
                  </div>

                  {/* APY Floating Badge */}
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-[#F7931A] text-black font-black text-xs flex items-center gap-1 shadow-lg font-vazir">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{t.annualAPY}: {asset.expectedAPY}٪</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1.5 font-vazir">
                    <MapPin className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
                    <span>{asset.location}</span>
                  </div>

                  <h3 className={`text-base font-bold line-clamp-1 mb-2 group-hover:text-[#F7931A] transition-colors font-vazir ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}>
                    {asset.title}
                  </h3>

                  <div className={`flex items-center justify-between text-xs py-2 px-3 rounded-xl border mb-4 ${
                    isDarkMode ? 'bg-black/40 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <span className={`font-vazir ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>{t.tokenSymbol}:</span>
                    <span className="font-mono font-bold text-[#F7931A]">{asset.tokenSymbol}</span>
                  </div>

                  {/* Financial Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className={`p-2.5 rounded-xl border ${
                      isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                    }`}>
                      <p className={`text-[10px] font-vazir ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>{t.totalValuation}</p>
                      <p className={`text-sm font-bold font-mono mt-0.5 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                        ${asset.totalValuationUSD.toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${
                      isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                    }`}>
                      <p className={`text-[10px] font-vazir ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>{t.tokenPrice}</p>
                      <p className="text-sm font-bold text-[#F7931A] font-mono mt-0.5">${asset.tokenPriceUSD}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 mb-2 font-vazir">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}>{t.funded}:</span>
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{progressPercent}٪</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${
                      isDarkMode ? 'bg-neutral-800' : 'bg-neutral-200'
                    }`}>
                      <div 
                        className="h-full bg-gradient-to-r from-[#F7931A] to-[#FFB84D] rounded-full transition-all duration-500" 
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onSelectAsset(asset)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-2 group-hover:shadow-lg font-vazir ${
                    isDarkMode 
                      ? 'bg-neutral-800 hover:bg-[#F7931A] hover:text-black text-neutral-200 border-neutral-700' 
                      : 'bg-neutral-100 hover:bg-[#F7931A] hover:text-black text-neutral-800 border-neutral-200'
                  }`}
                >
                  <span>{t.viewDetails}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
