'use client';
import * as React from 'react';
import type { Metadata } from 'next';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { EquipmentTable } from '@/components/dashboard/equipments/Equipments';


const metadata = { title: `Equipments | Dashboard | ${config.site.name}` } satisfies Metadata;

const axios = require('axios');

export default function Page(): React.JSX.Element {
  const [rooms, setRooms] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      let data = ``
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3005/admin/getAllEquipments',
        data: data,
        headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
      };

      await axios.request(config)
        .then((response:any) => {
          console.log(JSON.stringify(response.data));
          setRooms(response.data)
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
      <EquipmentTable rows={rooms} />
    </>
  );
}
