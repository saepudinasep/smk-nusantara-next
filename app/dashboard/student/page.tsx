'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { StudentSectionCards } from '@/components/student/student-section-cards';
import { StudentTodayScheduleTable } from '@/components/student/today-schedule-table';
import { RecentScoresTable } from '@/components/student/recent-scores-table';
import { ScoreTrendChart } from '@/components/student/score-trend-chart';
import { ProtectedRoute } from '@/components/protected-route';

export default function StudentDashboardPage() {
  return (
    <ProtectedRoute role='student'>
      {(user) => (
        <SidebarProvider
          style={
            {
              '--sidebar-width': 'calc(var(--spacing) * 72)',
              '--header-height': 'calc(var(--spacing) * 12)',
            } as React.CSSProperties
          }
        >
          <AppSidebar user={user} variant='inset' />
          <SidebarInset>
            <SiteHeader title='Dashboard Siswa' />
            <div className='flex flex-1 flex-col'>
              <div className='@container/main flex flex-1 flex-col gap-2'>
                <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
                  <StudentSectionCards />
                  <div className='px-4 lg:px-6'>
                    <ScoreTrendChart />
                  </div>
                  <div className='grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6'>
                    <StudentTodayScheduleTable />
                    <RecentScoresTable />
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      )}
    </ProtectedRoute>
  );
}
