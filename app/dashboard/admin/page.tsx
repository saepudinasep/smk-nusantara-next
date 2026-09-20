'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AdminSectionCards } from '@/components/admin/admin-section-cards';
import { EnrollmentChart } from '@/components/admin/enrollment-chart';
import { RecentActivityTable } from '@/components/admin/recent-activity-table';
import { ProtectedRoute } from '@/components/protected-route';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute role='admin'>
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
            <SiteHeader title='Dashboard Admin' />
            <div className='flex flex-1 flex-col'>
              <div className='@container/main flex flex-1 flex-col gap-2'>
                <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
                  <AdminSectionCards />
                  <div className='px-4 lg:px-6'>
                    <EnrollmentChart />
                  </div>
                  <div className='px-4 lg:px-6'>
                    <RecentActivityTable />
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
