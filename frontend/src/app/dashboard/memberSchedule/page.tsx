'use client'
import * as React from 'react';
import type { Metadata } from 'next';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { UserContext } from '@/contexts/user-context';
import { Card, CardContent, Typography, CardHeader, Avatar, IconButton, Divider } from '@mui/material';
import {DotsThreeVertical as MenuIcon} from '@phosphor-icons/react/dist/ssr/DotsThreeVertical'
import {Grid} from '@mui/material';
import { useRouter } from 'next/navigation';

const metadata = { title: `My Schedule | Dashboard | ${config.site.name}` } satisfies Metadata;

const axios = require('axios');

export default function Page(): React.JSX.Element {
  const [schedule, setSchedule] = React.useState([]);
  const user = React.useContext(UserContext);
  const router = useRouter();
  
  React.useEffect(() => {
    (async () => {
      const apiConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3005/schedules/getMemberSchedule',
        params: {memberid : user?.user?.userid},
        headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
      }

      await axios.request(apiConfig)
            .then((response:any) => {
              console.log(JSON.stringify(response.data));
              setSchedule(response.data)
              return {};
            })
            .catch((error:any) => {
              console.log("Error: ", error);
              return {error: error?.response?.data ?? error.message}
            });
    })();
    router.refresh();  // such that if token is expired, it will redirect to login page
  },[])

return (
  <>
    <h1>Member Schedule</h1>
    {
      schedule.length == 0 ? 
        <Typography variant="h5" component="h5" color={'gray'}>No classes scheduled</Typography> 
      : 
      <Grid container spacing={2}>
      {schedule?.map((item: any) => (
        <Grid item xs={6}>
          <Card key={item.scheduleid} >
            <CardHeader
              avatar={
                <Avatar aria-label="trainer">
                  {item.trainerFname[0]}
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MenuIcon size={32} />
                </IconButton>
              }
              title={`Class Name: ${item.className}`}
              subheader={<><div>Date: {item.date}</div><div>Start Time: {item.start_time} | {item.duration} hours</div></>}
            />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                Class Description: {item.classDescription}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Room Name: {item.roomName}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Trainer: {`${item.trainerFname} ${item.trainerLname}`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    }
  </>
);
}
