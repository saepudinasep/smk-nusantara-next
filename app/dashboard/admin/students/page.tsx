'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ProtectedRoute } from '@/components/protected-route';
import { StudentTable } from '@/components/admin/students/student-table';

export default function ManageStudentPage() {
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
            <SiteHeader title='Data Mahasiswa' />
            <div className='flex flex-1 flex-col'>
              <div className='@container/main flex flex-1 flex-col gap-2'>
                <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
                  <div className='px-4 lg:px-6'>
                    <StudentTable />
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
