import React, { useState } from 'react';
import {
  IndianRupee,
  Calculator,
  X,
  TrendingUp,
  Sparkles,
  Building2,
  PieChart,
  Coins,
  MapPin
} from 'lucide-react';

interface StipendCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StipendCalculatorModal: React.FC<StipendCalculatorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [durationMonths, setDurationMonths] = useState<number>(12);
  const [cityTier, setCityTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier2');
  const [rentCost, setRentCost] = useState<number>(2000);
  const [foodCost, setFoodCost] = useState<number>(1500);
  const [commuteCost, setCommuteCost] = useState<number>(500);

  if (!isOpen) return null;

  // PM Scheme Official Figures
  const govtMonthly = 4500;
  const companyMonthly = 500;
  const totalMonthlyStipend = govtMonthly + companyMonthly; // ₹5,000 / month
  const oneTimeGrant = 6000; // One-time incidental assistance

  const totalStipendEarned = totalMonthlyStipend * durationMonths;
  const grandTotalSupport = totalStipendEarned + oneTimeGrant;

  const totalMonthlyExpense = rentCost + foodCost + commuteCost;
  const monthlySavings = totalMonthlyStipend - totalMonthlyExpense;
  const totalAnnualSavings = (monthlySavings * durationMonths) + oneTimeGrant;

  const handleCityTierChange = (tier: 'tier1' | 'tier2' | 'tier3') => {
    setCityTier(tier);
    if (tier === 'tier1') {
      setRentCost(3200);
      setFoodCost(2000);
      setCommuteCost(800);
    } else if (tier === 'tier2') {
      setRentCost(2000);
      setFoodCost(1500);
      setCommuteCost(500);
    } else {
      setRentCost(1200);
      setFoodCost(1000);
      setCommuteCost(300);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-amber-500 via-emerald-600 to-indigo-600 h-2 w-full" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-800 flex items-center justify-center shrink-0">
              <Calculator className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                PM Scheme Stipend & Allowance Calculator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculate total monthly stipend, govt grants & city living savings
              </p>
            </div>
          </div>

          {/* Scheme Standard Benefits Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                Govt Contribution
              </span>
              <span className="text-xl font-black text-amber-900 dark:text-amber-200">
                ₹{govtMonthly.toLocaleString('en-IN')}/mo
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-medium">
                Direct Benefit Transfer (DBT)
              </span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                Corporate Partner
              </span>
              <span className="text-xl font-black text-emerald-900 dark:text-emerald-200">
                ₹{companyMonthly.toLocaleString('en-IN')}/mo
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
                Company CSR Grant
              </span>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">
                One-Time Incidental
              </span>
              <span className="text-xl font-black text-indigo-900 dark:text-indigo-200">
                + ₹{oneTimeGrant.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-medium">
                Paid upon joining
              </span>
            </div>
          </div>

          {/* Calculator Controls */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>Interactive Budget & City Location Estimator</span>
            </h3>

            {/* City Tier Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Select Placement City Category:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleCityTierChange('tier1')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                    cityTier === 'tier1'
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Tier 1 (Bengaluru/Delhi)
                </button>
                <button
                  type="button"
                  onClick={() => handleCityTierChange('tier2')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                    cityTier === 'tier2'
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Tier 2 (Pune/Jaipur/Indore)
                </button>
                <button
                  type="button"
                  onClick={() => handleCityTierChange('tier3')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                    cityTier === 'tier3'
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Tier 3 & Industrial Hubs
                </button>
              </div>
            </div>

            {/* Expense Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-1 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">Hostel/Rent Share</span>
                <input
                  type="range"
                  min={500}
                  max={5000}
                  step={100}
                  value={rentCost}
                  onChange={(e) => setRentCost(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-900 dark:text-white block text-right">₹{rentCost}/mo</span>
              </div>

              <div className="space-y-1 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">Mess/Food Expenses</span>
                <input
                  type="range"
                  min={500}
                  max={4000}
                  step={100}
                  value={foodCost}
                  onChange={(e) => setFoodCost(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-900 dark:text-white block text-right">₹{foodCost}/mo</span>
              </div>

              <div className="space-y-1 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">Transport/Local Commute</span>
                <input
                  type="range"
                  min={200}
                  max={2000}
                  step={100}
                  value={commuteCost}
                  onChange={(e) => setCommuteCost(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-900 dark:text-white block text-right">₹{commuteCost}/mo</span>
              </div>
            </div>
          </div>

          {/* Grand Calculation Summary Box */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-indigo-800/80 pb-3 gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-300 block">Total Financial Support (12 Months)</span>
                <span className="text-3xl font-black text-amber-400">₹{grandTotalSupport.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-indigo-300 block">Estimated Annual Net Savings</span>
                <span className={`text-2xl font-black ${monthlySavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ₹{totalAnnualSavings.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="text-xs text-indigo-200/90 leading-relaxed">
              💡 <span className="font-bold text-white">Govt Direct Benefit Transfer (DBT):</span> Monthly stipends are directly transferred to your Aadhaar-seeded bank account on the 1st of every month without middleman delays.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
