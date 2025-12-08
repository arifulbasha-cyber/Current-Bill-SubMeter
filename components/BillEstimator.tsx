import React, { useState } from 'react';
import { Calculator, Zap, Info } from 'lucide-react';

const BillEstimator: React.FC = () => {
  const [units, setUnits] = useState<number | string>('');

  // Constants
  const DEMAND_CHARGE = 84;
  const METER_RENT = 10;
  const VAT_RATE = 0.05; // 5%

  const calculateBill = (u: number) => {
    // Exact formula provided:
    // (MIN(A1, 75) * 5.26) + (MAX(0, MIN(A1, 200) - 75) * 7.20) + (MAX(0, MIN(A1, 300) - 200) * 7.59) + (MAX(0, MIN(A1, 400) - 300) * 8.02)
    
    const slab1 = Math.min(u, 75) * 5.26;
    const slab2 = Math.max(0, Math.min(u, 200) - 75) * 7.20;
    const slab3 = Math.max(0, Math.min(u, 300) - 200) * 7.59;
    const slab4 = Math.max(0, Math.min(u, 400) - 300) * 8.02;
    
    // Note: The formula provided stops at 400. 
    // If usage is > 400, this calculation only accounts for the first 400 units based on the prompt.
    
    const energyCost = slab1 + slab2 + slab3 + slab4;
    const totalSubjectToVat = energyCost + DEMAND_CHARGE + METER_RENT;
    const vatAmount = totalSubjectToVat * VAT_RATE;
    const totalPayable = totalSubjectToVat + vatAmount;

    return {
      energyCost,
      totalSubjectToVat,
      vatAmount,
      totalPayable
    };
  };

  const currentUnits = typeof units === 'number' ? units : 0;
  const result = calculateBill(currentUnits);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 print-break-inside-avoid no-print">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
        <Calculator className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-800">Bill Estimator</h2>
      </div>

      <div className="space-y-6">
        {/* Input */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
            Enter Units Used <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              value={units}
              onChange={(e) => setUnits(e.target.value === '' ? '' : parseFloat(e.target.value))}
              onFocus={handleFocus}
              placeholder="e.g. 205"
              className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-lg font-bold text-slate-900 pr-12"
            />
            <span className="absolute right-4 top-3 text-sm text-slate-400 font-medium pointer-events-none">kWh</span>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Energy Cost (Slab Rate)</span>
            <span className="font-medium text-slate-900">{result.energyCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Demand Charge</span>
            <span className="font-medium text-slate-900">{DEMAND_CHARGE}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Meter Rent</span>
            <span className="font-medium text-slate-900">{METER_RENT}</span>
          </div>
          
          <div className="border-t border-slate-200 my-2"></div>

          <div className="flex justify-between items-center text-sm">
             <div className="flex items-center gap-1">
                <span className="text-slate-600">Total Base</span>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded border border-slate-200">Subject to VAT</span>
             </div>
            <span className="font-medium text-slate-900">{result.totalSubjectToVat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-600">
            <span>VAT (5%)</span>
            <span>{result.vatAmount.toFixed(2)}</span>
          </div>

          <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
            <span className="font-bold text-indigo-900 uppercase text-xs tracking-wider">Est. Total Payable</span>
            <span className="font-bold text-indigo-700 text-xl">৳{Math.round(result.totalPayable)}</span>
          </div>
        </div>

        {/* Explainer */}
        <div className="flex gap-2 items-start bg-indigo-50 text-indigo-800 p-3 rounded-md text-xs">
           <Info className="w-4 h-4 mt-0.5 shrink-0" />
           <p className="opacity-90 leading-relaxed">
             This calculation uses the LT-A residential slab rates: 
             0-75 units @ 5.26, 76-200 @ 7.20, 201-300 @ 7.59, 301-400 @ 8.02. 
             Includes 5% VAT on the total base amount.
           </p>
        </div>
      </div>
    </div>
  );
};

export default BillEstimator;