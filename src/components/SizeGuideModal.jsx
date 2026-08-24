import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Ruler, X } from 'lucide-react';

export function SizeGuideModal() {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [unit, setUnit] = useState('IN');
  const [heightVal, setHeightVal] = useState(178);
  const [weightVal, setWeightVal] = useState(72);

  if (!isSizeGuideOpen) return null;

  const recommendedSize = weightVal < 65 ? 'S' : weightVal < 78 ? 'M' : weightVal < 90 ? 'L' : 'XL';

  const chartData = [
    { size: 'XS', chestIN: '36–38', chestCM: '91–96', lengthIN: '27.5', lengthCM: '70', sleeveIN: '24.0', sleeveCM: '61' },
    { size: 'S', chestIN: '38–40', chestCM: '96–101', lengthIN: '28.5', lengthCM: '72', sleeveIN: '24.5', sleeveCM: '62' },
    { size: 'M', chestIN: '41–43', chestCM: '104–109', lengthIN: '29.5', lengthCM: '75', sleeveIN: '25.0', sleeveCM: '63.5' },
    { size: 'L', chestIN: '44–46', chestCM: '112–117', lengthIN: '30.5', lengthCM: '77', sleeveIN: '25.5', sleeveCM: '65' },
    { size: 'XL', chestIN: '47–49', chestCM: '119–124', lengthIN: '31.5', lengthCM: '80', sleeveIN: '26.0', sleeveCM: '66' },
    { size: 'XXL', chestIN: '50–52', chestCM: '127–132', lengthIN: '32.0', lengthCM: '81', sleeveIN: '26.5', sleeveCM: '67' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/85 backdrop-blur-xl animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-brand-dark border border-brand-border rounded-lg shadow-2xl p-6 sm:p-8 text-brand-light relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => setIsSizeGuideOpen(false)}
          className="absolute top-4 right-4 text-brand-muted hover:text-brand-light p-1"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-accent mb-1">
          <Ruler size={14} />
          <span>Universal Fit Guide</span>
        </div>
        <h3 className="font-editorial text-2xl font-bold tracking-widest uppercase mb-4">
          ARCHIVE SIZING SPECIFICATIONS
        </h3>

        {/* Smart Fit Predictor */}
        <div className="bg-brand-surface p-4 rounded border border-brand-border mb-6">
          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-muted block mb-3">
            Smart Size Advisor (Based on Boxy Streetwear Cut)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-brand-muted mb-1">Your Height: {heightVal} cm</label>
              <input 
                type="range" min="150" max="210" value={heightVal} 
                onChange={(e) => setHeightVal(Number(e.target.value))}
                className="w-full accent-brand-accent cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-brand-muted mb-1">Your Weight: {weightVal} kg</label>
              <input 
                type="range" min="50" max="120" value={weightVal} 
                onChange={(e) => setWeightVal(Number(e.target.value))}
                className="w-full accent-brand-accent cursor-pointer"
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-xs font-mono">
            <span className="text-brand-muted">Recommended Standard Size:</span>
            <span className="text-sm font-bold text-brand-accent bg-brand-dark px-3 py-1 rounded border border-brand-accent/30">
              SIZE {recommendedSize} (Oversized Boxy Fit)
            </span>
          </div>
        </div>

        {/* Unit Switcher */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-muted">Garment Measurements</span>
          <div className="flex border border-brand-border rounded overflow-hidden text-xs font-mono">
            <button 
              onClick={() => setUnit('IN')}
              className={`px-3 py-1 ${unit === 'IN' ? 'bg-brand-light text-brand-black font-bold' : 'text-brand-muted hover:text-brand-light'}`}
            >
              Inches
            </button>
            <button 
              onClick={() => setUnit('CM')}
              className={`px-3 py-1 ${unit === 'CM' ? 'bg-brand-light text-brand-black font-bold' : 'text-brand-muted hover:text-brand-light'}`}
            >
              Centimeters
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto border border-brand-border rounded">
          <table className="w-full text-xs font-mono text-left">
            <thead className="bg-brand-surface text-brand-muted uppercase text-[10px] tracking-wider border-b border-brand-border">
              <tr>
                <th className="py-2.5 px-4">Size</th>
                <th className="py-2.5 px-4">Chest Width</th>
                <th className="py-2.5 px-4">Body Length</th>
                <th className="py-2.5 px-4">Sleeve Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {chartData.map((row, idx) => (
                <tr key={idx} className="hover:bg-brand-surface/50">
                  <td className="py-2.5 px-4 font-bold text-brand-light">{row.size}</td>
                  <td className="py-2.5 px-4 text-brand-bone">{unit === 'IN' ? `${row.chestIN}"` : `${row.chestCM} cm`}</td>
                  <td className="py-2.5 px-4 text-brand-bone">{unit === 'IN' ? `${row.lengthIN}"` : `${row.lengthCM} cm`}</td>
                  <td className="py-2.5 px-4 text-brand-bone">{unit === 'IN' ? `${row.sleeveIN}"` : `${row.sleeveCM} cm`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] font-mono text-brand-muted mt-4">
          *All measurements refer to garment dimensions laid flat. For standard drape, take your normal size. For an exaggerated silhouette, size up one tier.
        </p>
      </div>
    </div>
  );
}
