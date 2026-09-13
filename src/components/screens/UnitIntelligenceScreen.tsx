import React, { useEffect, useState } from 'react';
import { UnitHeatmapItem, ScreenId } from '../../types.js';
import { api } from '../../api/client.js';
import {
  Activity,
  ShieldCheck,
  Clock,
  Moon,
  Calendar,
  Lock,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Info
} from 'lucide-react';

interface UnitIntelligenceScreenProps {
  onNavigateScreen: (screen: ScreenId) => void;
  onSelectUnit?: (unitId: string) => void;
}

export const UnitIntelligenceScreen: React.FC<UnitIntelligenceScreenProps> = ({
  onNavigateScreen,
  onSelectUnit
}) => {
  const [units, setUnits] = useState<UnitHeatmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('unit-102');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getUnitIntelligence();
      if (res.success) {
        setUnits(res.units);
      }
    } catch (err) {
      console.error('Failed to load unit heatmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedUnit = units.find((u) => u.id === selectedUnitId) || units[0];

  if (loading && units.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-500">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-sm font-medium">Loading Unit Welfare Heatmaps...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="screen-unit-intelligence">
      {/* Screen Header */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-slate-700 border border-stone-200">
              SCREEN 02 &bull; UNIT INTELLIGENCE
            </span>
            <span className="text-xs font-mono text-slate-500">Cross-Battalion Heatmap &amp; Workload Matrix</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Unit Welfare &amp; Workload Heatmap</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Detects organizational and structural fatigue drivers across active brigades, surveillance outposts, and strike regiments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateScreen('personnel_view')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold cursor-pointer shadow-xs transition-all"
          >
            <span>Personnel Deep-Dive (P-014)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Heatmap Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map((unit) => {
          const isSelected = unit.id === selectedUnitId;
          const isSuppressed = unit.isSuppressed;

          let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          if (unit.band === 'review') badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
          else if (unit.band === 'watch') badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';

          return (
            <div
              key={unit.id}
              id={`unit-card-${unit.id}`}
              onClick={() => {
                setSelectedUnitId(unit.id);
                if (onSelectUnit) onSelectUnit(unit.id);
              }}
              className={`rounded-3xl border p-5 transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'border-slate-900 bg-white shadow-md ring-2 ring-slate-900/10'
                  : 'border-stone-200/80 bg-white hover:border-stone-300 hover:shadow-xs'
              }`}
            >
              {/* Privacy Suppression Overlay for Detachment Alpha */}
              {isSuppressed && (
                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xs flex flex-col items-center justify-center p-5 text-center z-10 text-white">
                  <div className="w-9 h-9 rounded-2xl bg-slate-800 flex items-center justify-center mb-2 text-amber-400 border border-slate-700">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-100">k-Anonymity Suppressed</div>
                  <div className="text-[11px] text-slate-400 mt-1 max-w-[220px] leading-relaxed">
                    Cohort size ({unit.personnelCount} personnel) is below threshold k &ge; 10. Individual metrics masked by Section 14 privacy mandate.
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{unit.unitName}</h3>
                  <div className="text-[11px] text-slate-500 font-mono">{unit.sector}</div>
                </div>
                {!isSuppressed && (
                  <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                    Risk {unit.riskScore}
                  </span>
                )}
              </div>

              {!isSuppressed && (
                <>
                  <div className="grid grid-cols-3 gap-2 my-3 pt-2 border-t border-stone-100 text-center font-mono">
                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
                      <div className="text-[10px] text-slate-500 font-sans">Avg Shift</div>
                      <div className="text-xs font-bold text-slate-800">{unit.avgShiftHours}h</div>
                    </div>
                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
                      <div className="text-[10px] text-slate-500 font-sans">Night Duty</div>
                      <div className="text-xs font-bold text-slate-800">{unit.nightShiftRatio}%</div>
                    </div>
                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
                      <div className="text-[10px] text-slate-500 font-sans">Deployment</div>
                      <div className="text-xs font-bold text-slate-800">{unit.deploymentDurationDays}d</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-stone-100">
                    <span className="flex items-center gap-1 font-mono">
                      {unit.trendDirection === 'rising' && (
                        <span className="text-rose-600 flex items-center gap-0.5 font-bold">
                          <TrendingUp className="w-3.5 h-3.5" />
                          Rising (+6pt)
                        </span>
                      )}
                      {unit.trendDirection === 'declining' && (
                        <span className="text-emerald-600 flex items-center gap-0.5 font-bold">
                          <TrendingDown className="w-3.5 h-3.5" />
                          Declining (-4pt)
                        </span>
                      )}
                      {unit.trendDirection === 'stable' && (
                        <span className="text-slate-600 flex items-center gap-0.5">
                          <Minus className="w-3.5 h-3.5" />
                          Stable
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-slate-700">{unit.personnelCount} Personnel</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Unit Deep-Dive Panel */}
      {selectedUnit && !selectedUnit.isSuppressed && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Focused Battalion Analysis</div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>{selectedUnit.unitName}</span>
                <span className="text-xs font-normal text-slate-500 font-mono">({selectedUnit.sector})</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] text-slate-500">Composite Risk Index</div>
                <div className="text-xl font-black text-slate-900 font-mono">
                  {selectedUnit.riskScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                </div>
              </div>
              <button
                onClick={() => onNavigateScreen('personnel_view')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5 transition-all"
              >
                <span>Inspect Personnel in this Unit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Workload Metric 1 */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50">
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold">Duty Shift Duration</span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono mb-1">
                {selectedUnit.avgShiftHours} <span className="text-sm font-normal text-slate-500">hours/day</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {selectedUnit.avgShiftHours > 11
                  ? 'Exceeds standard 8h operational cap. Triggers SOP-WEL-05 Level-2 Rebalancing threshold.'
                  : 'Within standard baseline parameters.'}
              </p>
            </div>

            {/* Workload Metric 2 */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50">
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <Moon className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold">Night Duty Exposure</span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono mb-1">
                {selectedUnit.nightShiftRatio}% <span className="text-sm font-normal text-slate-500">of rotas</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {selectedUnit.nightShiftRatio > 35
                  ? 'High circadian disruption risk. Rest cycle intervention recommended to prevent sleep debt.'
                  : 'Balanced diurnal rotation schedule.'}
              </p>
            </div>

            {/* Workload Metric 3 */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50">
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold">Continuous Field Deployment</span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono mb-1">
                {selectedUnit.deploymentDurationDays} <span className="text-sm font-normal text-slate-500">days</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {selectedUnit.deploymentDurationDays > 45
                  ? 'Mandatory 72-hour de-escalation rest cycle active per SOP-WEL-01 §1.4.'
                  : 'Under 45-day rotation limit.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
