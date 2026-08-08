import React from 'react';
import { Bookmark, Award, Smile, MapPin } from 'lucide-react';
import EditableText from './EditableText';

export default function StatsBar() {
  const statsList = [
    {
      keyNum: 'stat1_num',
      keyLabel: 'stat1_label',
      defaultNum: '106+',
      defaultLabel: 'Propiedades activas',
      Icon: Bookmark
    },
    {
      keyNum: 'stat2_num',
      keyLabel: 'stat2_label',
      defaultNum: '10 años',
      defaultLabel: 'Experiencia',
      Icon: Award
    },
    {
      keyNum: 'stat3_num',
      keyLabel: 'stat3_label',
      defaultNum: '100%',
      defaultLabel: 'Clientes satisfechos',
      Icon: Smile
    },
    {
      keyNum: 'stat4_num',
      keyLabel: 'stat4_label',
      defaultNum: 'Los Lagos & RM',
      defaultLabel: 'Cobertura Regional',
      Icon: MapPin
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 my-6">
      <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
          {statsList.map((stat, idx) => {
            const Icon = stat.Icon;
            return (
              <div
                key={stat.keyNum}
                className={`flex items-center gap-3.5 ${idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-5' : ''}`}
              >
                {/* Circular Icon Badge */}
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-teal-400 shrink-0">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                {/* Editable Text */}
                <div className="min-w-0">
                  <div className="text-lg sm:text-2xl font-extrabold text-white tracking-tight leading-tight truncate">
                    <EditableText contentKey={stat.keyNum} fallback={stat.defaultNum} />
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                    <EditableText contentKey={stat.keyLabel} fallback={stat.defaultLabel} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
