'use client';

import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ROLE_HOME_PATH, type UserRole } from '@/lib/dummy-users';
import type { SessionUser } from '@/contexts/auth-context';
import {
  LayoutDashboardIcon,
  ChartBarIcon,
  CommandIcon,
  CalendarCheckIcon,
  CalendarCogIcon,
  BookOpenIcon,
  UserCogIcon,
  GraduationCapIcon,
  ClipboardListIcon,
  CalendarDaysIcon,
  CalendarClockIcon,
  FileChartColumnIcon,
} from 'lucide-react';

type NavItem = {
  title: string;
  url: string;
  icon?: React.ReactNode;
};

const NAV_ITEMS_BY_ROLE: Record<UserRole, NavItem[]> = {
  admin: [
    { title: 'Dashboard', url: ROLE_HOME_PATH.admin, icon: <LayoutDashboardIcon /> },
    { title: 'Manage Student', url: '/dashboard/admin/students', icon: <GraduationCapIcon /> },
    { title: 'Manage Teacher', url: '#', icon: <UserCogIcon /> },
    { title: 'Manage Class', url: '#', icon: <BookOpenIcon /> },
    { title: 'Manage Schedule', url: '#', icon: <CalendarCogIcon /> },
    { title: 'Finalize Schedule', url: '#', icon: <CalendarCheckIcon /> },
    { title: 'View Report', url: '#', icon: <FileChartColumnIcon /> },
  ],
  teacher: [
    { title: 'Dashboard', url: ROLE_HOME_PATH.teacher, icon: <LayoutDashboardIcon /> },
    { title: 'Teaching Schedule', url: '#', icon: <CalendarClockIcon /> },
    { title: 'Input Score', url: '#', icon: <ChartBarIcon /> },
  ],
  student: [
    { title: 'Dashboard', url: ROLE_HOME_PATH.student, icon: <LayoutDashboardIcon /> },
    { title: 'Class Schedule', url: '#', icon: <CalendarDaysIcon /> },
    { title: 'View Score', url: '#', icon: <ClipboardListIcon /> },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: SessionUser }) {
  const navItems = NAV_ITEMS_BY_ROLE[user.role];

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className='data-[slot=sidebar-menu-button]:p-1.5! cursor-default hover:bg-transparent'
              render={<span />}
            >
              <CommandIcon className='size-5!' />
              <span className='text-base font-semibold'>SMK Nusantara</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
