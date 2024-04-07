import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import {CalendarCheck as ScheduleIcon} from '@phosphor-icons/react/dist/ssr/CalendarCheck';
import {Barbell as EquimentIcon} from '@phosphor-icons/react/dist/ssr/Barbell';
import {Chalkboard as ClassesIcon} from '@phosphor-icons/react/dist/ssr/Chalkboard';
import {Lockers as RoomsIcon} from '@phosphor-icons/react/dist/ssr/Lockers';
import {UsersThree as TrainersIcon} from '@phosphor-icons/react/dist/ssr/UsersThree';


export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  user: UserIcon,
  users: UsersIcon,
  schedule: ScheduleIcon,
  equipment: EquimentIcon,
  classes: ClassesIcon,
  rooms: RoomsIcon,
  trainers: TrainersIcon,

} as Record<string, Icon>;
