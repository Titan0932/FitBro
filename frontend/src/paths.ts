export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    trainers: '/dashboard/trainers',
    overview: '/dashboard',
    account: '/dashboard/account',
    members: '/dashboard/members',
    memberSchedule: '/dashboard/memberSchedule',
    trainerSchedule: '/dashboard/trainerSchedule',
    rooms: '/dashboard/rooms',
    equipments: '/dashboard/equipments',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    classes: '/dashboard/classes',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
