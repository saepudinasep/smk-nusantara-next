import { CalendarCheckIcon, GraduationCapIcon, SchoolIcon, UserRoundCheckIcon } from 'lucide-react';

import { StatCards } from '@/components/stat-cards';
import type { DashboardStats } from '@/lib/report-types';

export function SectionCards({ stats: s }: { stats: DashboardStats }) {
  const pct = s.schedules ? Math.round((s.finalized / s.schedules) * 100) : 0;

  return (
    <div className='px-4 lg:px-6'>
      <StatCards
        items={[
          {
            label: 'Total Students',
            value: s.students,
            icon: GraduationCapIcon,
            badge: `${s.male} M / ${s.female} F`,
            title: 'Active students enrolled',
            note: `Distributed across ${s.classes} classes`,
          },
          {
            label: 'Total Teachers',
            value: s.teachers,
            icon: UserRoundCheckIcon,
            badge: `${s.subjects} subjects`,
            title: 'Teachers with registered expertise',
            note: 'Grade X, XI and XII',
          },
          {
            label: 'Total Classes',
            value: s.classes,
            icon: SchoolIcon,
            badge: `${s.grades} grades`,
            title: 'Classes across all grades',
            note: `Average final score ${s.avgFinal ?? '-'}`,
          },
          {
            label: 'Finalized Schedules',
            value: `${s.finalized}/${s.schedules}`,
            icon: CalendarCheckIcon,
            badge: `${pct}%`,
            title: `${s.schedules - s.finalized} schedules still in draft`,
            note:
              s.passRate === null
                ? 'No completed scores yet'
                : `Pass rate ${s.passRate}% across all subjects`,
          },
        ]}
      />
    </div>
  );
}
