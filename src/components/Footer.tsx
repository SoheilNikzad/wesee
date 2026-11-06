import React from 'react';
import { Coins, Globe2, ShieldCheck } from 'lucide-react';
import { Language, TRANSLATIONS } from '../translations';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <footer className="border-t border-neutral-800 bg-[#0A0A0A] pt-12 pb-8 text-xs text-neutral-400 font-vazir">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F7931A] text-black flex items-center justify-center font-bold shadow-md shadow-[#F7931A]/20">
                <span className="font-outfit font-black text-lg">W</span>
              </div>
              <span className="text-xl font-black font-comfortaa text-white">WeSee</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F7931A]/20 text-[#F7931A] border border-[#F7931A]/30 font-bold">
                RWA
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-vazir">
              پلتفرم مرجع توکن‌سازی دارایی‌های واقعی (RWA) روی دامنه‌ رسمی <strong>wesee.ir</strong> با اتصال به شبکه‌های Polygon و BNB Chain.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 text-sm font-outfit">دارایی‌های پشتیبانی‌شده</h5>
            <ul className="space-y-2 text-neutral-400 font-vazir">
              <li>املاک و مستغلات تجاری و مسکونی</li>
              <li>شمش طلا و ذخایر فلزات گرانبها</li>
              <li>نیروگاه‌های خورشیدی و انرژی پاک</li>
              <li>سهام خرد پروژه‌ها و شرکت‌ها</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 text-sm font-outfit">بلاکچین و استانداردها</h5>
            <ul className="space-y-2 text-neutral-400 font-mono text-[11px]">
              <li>Polygon Network (PoS & zkEVM)</li>
              <li>BNB Smart Chain (BEP-20)</li>
              <li>ERC-3643 Permissioned Token</li>
              <li>OpenZeppelin Audited Security</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 text-sm font-outfit">زیرساخت و دامنه</h5>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400 block text-[10px]">دامنه متصل شده:</span>
                <span className="text-[#F7931A] font-mono font-bold text-sm">wesee.ir</span>
              </div>
              <p className="text-[11px] text-neutral-500 font-vazir">
                پشتیبانی از ورود با اکانت گوگل و سطوح دسترسی سرمایه‌گذار، مالک دارایی، ناظر و ادمین.
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} WeSee (wesee.ir) - تمامی حقوق محفوظ است.</p>
          <div className="flex items-center gap-2 text-neutral-500 font-mono">
            <span>BITCOIN ORANGE • BLACK • WHITE • GRAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
