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
  const [trainers, setTrainers] = React.useState<any | null>([]);
  const [trainerAvails, setTrainerAvails] = React.useState<any | null>({}); // [trainerid, [avail1, avail2, ...]
  const [personalClasses, setPersonalClasses] = React.useState<any | null>({});

  
  const getPersonalClasses = async(trainerid: string) => {
    console.log("Trainerid: ", trainerid)
    const apiConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:3005/classes/getAllClasses',
      params: {trainerid: trainerid, type: "personal"},
      headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
    }
    await axios.request(apiConfig)
            .then((response:any) => {
              console.log("personal classes: ", response.data);
              setPersonalClasses((prev: any) => {
                return {...prev, [trainerid]: response.data[0]}  // assuming only one personal class per trainer
              })
              response?.data?.length > 0 ? 
              getTrainerAvails(trainerid)
            : 
              setTrainerAvails((prev: any) => {
                return { ...prev, [trainerid]: [] };
              });
            })
            .catch((error:any) => {
              console.log("Error: ", error);
              alert(error?.response?.data.message ?? error.message)
            })

  }

  const getTrainerAvails = async (trainerid: any) => {
    let params = {trainerid: trainerid}
    let apiConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:3005/trainers/getTrainerAvailability',
      params: params,
      headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
    }
    await axios.request(apiConfig)
      .then((response:any) => {
        setTrainerAvails((prev: any) => {
          return { ...prev, [trainerid]: response.data };
        });
        return {};
      })
      .catch((error:any) => {
        console.log("Error: ", error);
        alert(error?.response?.data ?? error.message)
      })
  }

  const getTrainers = async () => {
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
          response.data.map((trainer: any) => {
              getPersonalClasses(trainer.trainerid)
            
          })
          return {};
        })
        .catch((error:any) => {
          console.log("Error: ", error);
          return {error: error?.response?.data ?? error.message}
        });
  }

  console.log("trainerAvails: ", trainerAvails)

  React.useEffect(() => {
    getTrainers();
  },[])
  
  return (
    <>
      <TrainerTable rows={trainers} trainerAvails={trainerAvails} personalClasses={personalClasses} />
    </>
  );
}
