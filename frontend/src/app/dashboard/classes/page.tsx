'use client'
import { config } from '@/config';
import { UserContext } from '@/contexts/user-context';
import { Typography } from '@mui/material';
import type { Metadata } from 'next';
import React from 'react';
import { MemberClasses } from '@/components/dashboard/members/MemberClasses'; 
import { AdminClasses } from '@/components/dashboard/admin/AdminClasses';
const axios = require('axios');



const metadata = { title: `Classes | Dashboard | ${config.site.name}` } satisfies Metadata;


export default function Page(): React.JSX.Element {
    const user = React.useContext(UserContext);


    return (
        <>
            {
                user?.role?.toLowerCase() == 'member' ?
                    <MemberClasses />
                :
                user?.role?.toLowerCase() == 'admin' ?
                    <AdminClasses />
                :
                    <Typography variant="h4">Unauthorized!</Typography>
            }
        </>
    );
}



