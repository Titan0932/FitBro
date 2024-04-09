'use client';
import * as React from 'react';
import type { Metadata } from 'next';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { MemberTable } from '@/components/dashboard/members/Members';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';

const metadata = { title: `Trainers | Dashboard | ${config.site.name}` } satisfies Metadata;

const axios = require('axios');

export default function Page(): React.JSX.Element {
  const [members, setMembers] = React.useState<any | null>([]);
  const [filteredMembers, setFileredMembers] = React.useState<any | null>([]);

  const filterMembers = (queryName: string) => {
    const filteredMembers = members.filter((member: any) => {
      return member.user_fname.toLowerCase().includes(queryName.toLowerCase()) || member.user_lname.toLowerCase().includes(queryName.toLowerCase());
    });
    setFileredMembers(filteredMembers);
  }

  React.useEffect(() => {
    (async () => {
      let data = ``
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3005/members/getAllMembersByName',
        data: data,
        headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
      };

      await axios.request(config)
        .then((response:any) => {
          // console.log(JSON.stringify(response.data));
          setMembers(response.data)
          setFileredMembers(response.data);
          return {};
        })
        .catch((error:any) => {
          console.log("Error: ", error);
          return {error: error?.response?.data ?? error.message}
        });
      })();
  },[])
  
  return (
    <>
      <CustomersFilters filterMembers={filterMembers} />
      <MemberTable rows={filteredMembers} />
    </>
  );
}
