'use client'

import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { UserContext } from '@/contexts/user-context';
import {TrainerDashboard} from '@/components/dashboard/trainer/TrainerDashboard';
import { MemberDashboard } from '@/components/dashboard/members/MemberDashboard';
import { AdminDashboard } from '@/components/dashboard/admin/AdminDashboard';

const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;


export default function Page(): React.JSX.Element {
    const user = React.useContext(UserContext)
    if(user?.role?.toLowerCase() == "member"){
        return <MemberDashboard />
    }
    else if(user?.role?.toLowerCase() == "admin"){
        return <AdminDashboard />
    }
    else if(user?.role?.toLowerCase() == "trainer"){
        return <TrainerDashboard />
    }else{
        return <></>
    }
}