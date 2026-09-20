'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TeacherSectionCards } from '@/components/teacher/teacher-section-cards';
import { TodayScheduleTable } from '@/components/teacher/today-schedule-table';
import { MyClassesTable } from '@/components/teacher/my-classes-table';
import { ProtectedRoute } from '@/components/protected-route';

export default function TeacherDashboardPage() {
  return (
    <ProtectedRoute role='teacher'>
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
            <SiteHeader title='Dashboard Guru' />
            <div className='flex flex-1 flex-col'>
              <div className='@container/main flex flex-1 flex-col gap-2'>
                <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
                  <TeacherSectionCards />
                  <div className='grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6'>
                    <TodayScheduleTable />
                    <MyClassesTable />
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
