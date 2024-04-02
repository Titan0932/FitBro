'use client';
import * as React from 'react';
import type { Metadata } from 'next';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { TrainerTable } from '@/components/dashboard/trainer/Trainers';
import { headers } from 'next/headers';

const metadata = { title: `Trainers | Dashboard | ${config.site.name}` } satisfies Metadata;

const axios = require('axios');

export default function Page(): React.JSX.Element {
  const [trainers, setTrainers] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      let data = ``
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3005/trainers/getAllTrainers',
        data: data,
        headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
      };

      await axios.request(config)
        .then((response:any) => {
          console.log(JSON.stringify(response.data));
          setTrainers(response.data)
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
      <TrainerTable rows={trainers} />
    </>
  );
}
