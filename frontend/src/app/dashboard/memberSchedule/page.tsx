'use client'
import * as React from 'react';
import type { Metadata } from 'next';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { UserContext } from '@/contexts/user-context';
import { Card, CardContent, Typography, CardHeader, Avatar, IconButton, Divider, Chip, Badge, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Box  } from '@mui/material';
import {Trash as DeleteIcon} from '@phosphor-icons/react/dist/ssr/Trash'
import {Grid} from '@mui/material';
import { useRouter } from 'next/navigation';

const metadata = { title: `My Schedule | Dashboard | ${config.site.name}` } satisfies Metadata;

const axios = require('axios');

export default function Page(): React.JSX.Element {
  const [schedule, setSchedule] = React.useState([]);
  const user = React.useContext(UserContext);
  const [toDelete, setToDelete] = React.useState(-1);
  const router = useRouter();
  
  const deleteSchedule = async () => {
    console.log("deleting schedule: ", toDelete)
    const apiConfig = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: 'http://localhost:3005/schedules/deletePersonalClass',
      params: {scheduleid : toDelete, memberid: user?.user?.userid},
      headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
    }

    await axios.request(apiConfig)
            .then((response:any) => {
              console.log(JSON.stringify(response.data));
              setToDelete(-1);
              return {};
            })
            .catch((error:any) => {
              console.log("Error: ", error);
              return {error: error?.response?.data ?? error.message}
            })
  }

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
  },[toDelete])

  return (
    <>
      <h1>Member Schedule</h1>
      {
        schedule.length == 0 ? 
          <Typography variant="h5" component="h5" color={'gray'}>No classes scheduled</Typography> 
        : 
        <Grid container spacing={2} >
        {schedule?.map((item: any) => (
          <Grid item xs={12} md={6}>
            <Card key={item.scheduleid} >
              <CardHeader
                avatar={
                  <Avatar aria-label="trainer">
                    {item.trainerFname[0]}
                  </Avatar>
                }
                action={
                  <>
                    <IconButton color='error' aria-label="delete" onClick={() => setToDelete(item.scheduleid)}>
                      <DeleteIcon size={32} />
                    </IconButton>
                  </>
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
                <Typography variant="body2" color="textSecondary" component="p">
                  Payment: <Chip label={item.paid} color={item.paid == 'paid' ? 'success' : 'error'} size='small' />
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" mt={1}>
                  Status: <Chip label={item.status} color={item.status == 'CONFIRMED' ? 'success' : 'error'} size='small'/>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      }
      <DeleteConfirmationModal deleteId={toDelete} onClose={() => setToDelete(-1)} onConfirm={deleteSchedule} />
    </>
  );
}

const DeleteConfirmationModal = ({ deleteId, onClose, onConfirm } : { deleteId: number, onClose: () => void, onConfirm: () => void }) => {
  return (
    <Dialog open={deleteId != -1} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to cancel this booking? <br />
          <Box component="span" color="error.main" > Bookings cannot be cancelled less than 48 hours of start date!! </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
