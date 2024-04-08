import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';


export const memberNavitems = [
  { key: 'overview', title: 'Dashboard', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'Trainers', title: 'Trainers', href: paths.dashboard.trainers, icon: 'trainers' },
  { key: 'Schedule', title: 'Schedule', href: paths.dashboard.memberSchedule, icon: 'schedule' },
  { key: 'classes', title: 'Classes', href: paths.dashboard.classes, icon: 'classes' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];

export const trainerNavitems = [
  // { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'Schedule', title: 'Schedule', href: paths.dashboard.overview, icon: 'schedule' },
  { key: 'Members', title: 'Members', href: paths.dashboard.members, icon: 'users' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];

export const adminNavitems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'Members', title: 'Members', href: paths.dashboard.members, icon: 'users' },
  { key: 'Trainers', title: 'Trainers', href: paths.dashboard.trainers, icon: 'trainers' },
  { key: 'Rooms', title: 'Rooms', href: paths.dashboard.rooms, icon: 'rooms' },
  { key: 'Equipments', title: 'Equipments', href: paths.dashboard.equipments, icon: 'equipment' },
  { key: 'classes', title: 'Classes', href: paths.dashboard.classes, icon: 'classes' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];


// export const navItems = [
//   { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
//   { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
//   { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
//   { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
//   { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
//   { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
// ] satisfies NavItemConfig[];
