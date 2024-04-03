'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { DotsThreeVertical as MenuIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import { PlusCircle as AddIcon } from '@phosphor-icons/react/dist/ssr/PlusCircle';
import { Trash  as DeleteIcon } from '@phosphor-icons/react/dist/ssr/Trash';

// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { UserContext } from '@/contexts/user-context';

const metadata = { title: `My Schedule | Dashboard | ${config.site.name}` } satisfies Metadata;

const axios = require('axios');

export default function Page(): React.JSX.Element {
  const [schedule, setSchedule] = React.useState([]);
  const [availability, setAvailability] = React.useState([]);
  const user = React.useContext(UserContext);
  const router = useRouter();

  const getSchedule = async () => {
    const apiConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:3005/schedules/getTrainerSchedule',
      params: { trainerid: user?.user?.userid },
      headers: { Authorization: 'Bearer ' + localStorage.getItem('custom-auth-token') },
    };

    await axios
      .request(apiConfig)
      .then((response: any) => {
        console.log(JSON.stringify(response.data));
        setSchedule(response.data);
        return {};
      })
      .catch((error: any) => {
        console.log('Error: ', error);
        return { error: error?.response?.data ?? error.message };
      });
  };

  const getAvailability = async () => {
    const apiConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:3005/trainers/getTrainerAvailability',
      params: { trainerid: user?.user?.userid },
      headers: { Authorization: 'Bearer ' + localStorage.getItem('custom-auth-token') },
    };

    await axios
      .request(apiConfig)
      .then((response: any) => {
        console.log(JSON.stringify(response.data));
        setAvailability(response.data);
        return {};
      })
      .catch((error: any) => {
        console.log('Error: ', error);
        return { error: error?.response?.data ?? error.message };
      });
  };

  React.useEffect(() => {
    getSchedule();
    getAvailability();
    router.refresh(); // such that if token is expired, it will redirect to login page
  }, []);

  return (
    <>
      <TrainerSchedule schedule={schedule} />
      <br />
      <br />
      <Divider />
      <TrainerAvailability availability={availability} getAvailability={getAvailability} />
    </>
  );
}

const TrainerSchedule = ({ schedule }: { schedule: never[] }) => {
  return (
    <>
      <h1>Trainer Schedule</h1>
      {schedule.length == 0 ? (
        <Typography variant="h5" component="h5" color={'gray'}>
          No classes scheduled
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {schedule?.map((item: any) => (
            <Grid item xs={6}>
              <Card key={item.scheduleid}>
                <CardHeader
                  action={
                    <IconButton aria-label="settings">
                      <MenuIcon size={32} />
                    </IconButton>
                  }
                  title={`Class Name: ${item.className}`}
                  subheader={
                    <>
                      <div>Date: {item.date}</div>
                      <div>
                        Start Time: {item.start_time} | {item.duration} hours
                      </div>
                    </>
                  }
                />
                <Divider />
                <CardContent>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Class Description: {item.classDescription}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Room Name: {item.roomName}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

const TrainerAvailability = ({ availability, getAvailability }: { availability: never[], setAvailability: () => {} }) => {
  const [open, setOpen] = React.useState(false);
  const user = React.useContext(UserContext);
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    date: '',
    start_time: '',
    end_time: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addAvailability = async () => {
    const data = `trainerid=${user?.user?.userid}&date=${formData.date}&start_time=${formData.start_time}&end_time=${formData.end_time}`
    const apiConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3005/trainers/addAvailability',
      data: data,
      headers: { Authorization: 'Bearer ' + localStorage.getItem('custom-auth-token') }
    }

    axios.request(apiConfig)
      .then((response: any) => {
        console.log(JSON.stringify(response.data));
        getAvailability();
        return {};
      })
      .catch((error: any) => {
        console.log('Error: ', error);
        alert(error?.response?.data ?? error.message);
        return { error: error?.response?.data ?? error.message };
      })
  }

  const handleSubmit = (e:any) => {
    e.preventDefault()
    console.log(formData);
    if (formData.date && formData.start_time && formData.end_time) {
      if(new Date(formData.date + 'T' + formData.start_time) >= new Date(formData.date + 'T' + formData.end_time)){
        alert("Start time should be less than end time");
        return;
      }
      else{
        addAvailability();
      }
      router.refresh();
    }
    handleClose()
  };

  const handleDelete = (id: number) => {
    const data = `availabilityid=${id}`
    const apiConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3005/trainers/removeAvailability',
      data: data,
      headers: { Authorization: 'Bearer ' + localStorage.getItem('custom-auth-token') }
    }

    axios.request(apiConfig)
      .then((response: any) => {
        console.log(JSON.stringify(response.data));
        getAvailability();
        return {};
      })
      .catch((error: any) => {
        console.log('Error: ', error);
        alert(error?.response?.data ?? error.message);
        return { error: error?.response?.data ?? error.message };
      })
  }

  return (
    <>
      <h1>Trainer Availability</h1>
      <Card style={{ padding: '0rem 1.5rem 2.5rem 1.5rem' }}>
        <CardHeader
          action={
            <IconButton aria-label="Add Availability" onClick={handleClickOpen}>
              <AddIcon style={{ fontSize: 32, color: '#007bff' }} />
            </IconButton>
          }
          title="Add Availability"
          align="end"
        />
        <Grid container justifyContent="center" spacing={3}>
          {availability.map((slot, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Paper elevation={3}>
                {/* <CardHeader action={<IconButton aria-label="Delete Availability"><DeleteIcon style={{ fontSize: 24, color: 'red' }} /></IconButton>} /> */}
                <CardContent>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <Typography variant="h6" color="primary" marginBottom={0} gutterBottom>
                    {slot.date} 
                  </Typography>
                  <IconButton aria-label="Delete Availability" onClick={ () => handleDelete(slot.availabilityid)}><DeleteIcon style={{ fontSize: 24, color: 'red' }} /></IconButton></div>
                  <Typography variant="body1">
                    {slot.start_time} - {slot.end_time}
                  </Typography>
                </CardContent>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Card>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Availability</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="date"
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleChange}
              required = {true}
            />
            <TextField
              margin="dense"
              id="start_time"
              label="Start Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.start_time}
              onChange={handleChange}
              required = {true}
            />
            <TextField
              margin="dense"
              id="end_time"
              label="End Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.end_time}
              onChange={handleChange}
              required = {true}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type='submit' color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
