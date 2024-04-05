'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';
import { Button, CardContent, CardHeader, Chip, Grid, Modal, CardActions } from '@mui/material';
import { UserContext } from '@/contexts/user-context';
import { useRouter } from 'next/navigation';

function noop(): void {
  // do nothing
}

export interface Trainer {
  trainerid: string;
  avatar?: string;
  f_name: string;
  l_name: string;
  email: string;
  // address: { city: string; state: string; country: string; street: string };
  speciality: [string];
}

interface TrainerTableProps {
  count?: number;
  page?: number;
  rows?: Trainer[];
  rowsPerPage?: number;
  trainerAvails?: Record<string, string[]>;
  personalClasses?: Record<string, any>;
}

const axios = require("axios");


export function TrainerTable({
  rows = [],
  trainerAvails,
  personalClasses,
}: TrainerTableProps): React.JSX.Element {

  const rowIds = React.useMemo(() => {
    return rows.map((trainer) => trainer.trainerid);
  }, [rows]);

  const [selectedTrainer, setSelectedTrainer] = React.useState<Trainer | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleRowClick = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };


  return (
    <Card>
      <CardHeader title="Trainers" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Speciality</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              
              return (
                <TableRow hover key={row.trainerid} onClick= {() => handleRowClick(row)} >
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.avatar} />
                      <Typography variant="subtitle2">{`${row.f_name} ${row.l_name}`}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  
                  <TableCell >
                  <Grid container spacing={1}>
                    {row.speciality.map((speciality, index) => (
                      <Grid item xs={4} key={index} >
                        <Chip color="primary" label={speciality} size="small" />
                      </Grid>
                    ))}
                  </Grid>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      {/* <Divider /> */}
      <TrainerModal modalOpen={modalOpen} handleCloseModal={handleCloseModal} selectedTrainer={selectedTrainer} availabilities={trainerAvails && trainerAvails[selectedTrainer?.trainerid]} personalClass={personalClasses[selectedTrainer?.trainerid]} />
    </Card>
  );
}

interface TrainerModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  selectedTrainer: Trainer | null;
  availabilities: Record<string, string[]>;
  personalClass: Record<string, string>;
}

const TrainerModal = ({modalOpen, handleCloseModal, selectedTrainer, availabilities, personalClass}: TrainerModalProps) => {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedTime, setSelectedTime] = React.useState(null);
  const [freeTimes, setFreeTimes] = React.useState({}); // [start_time, end_time]
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);

  const handleDateClick = (date: any) => {
    (selectedDate == date)? 
      setSelectedDate('')
    :
      setSelectedDate(date);
    setSelectedTime('');
    
  };
  const onClose = () => {
    setSelectedDate('');
    setFreeTimes({});
    setSelectedTime('');
    handleCloseModal();
  }

  const generateTimeSlots = (startTime: string, endTime: string) => {
    const timeSlots = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
  
    let currentTime = dayjs().set('hour', startHour).set('minute', startMinute);
    let end = dayjs().set('hour', endHour).set('minute', endMinute)
    while (currentTime.isBefore(end)) {
      timeSlots.push(currentTime.format('HH:mm'));
      currentTime = currentTime.add(1, 'hour');
    }
    return timeSlots;
  };


  const calculateFreeTimes = (schedules: any) => {
    let curDateAvailability = availabilities.find((availability: any) => availability.date === selectedDate);
    if (!curDateAvailability) return;

    let freeTimes = generateTimeSlots(curDateAvailability.start_time, curDateAvailability.end_time);
    
    // Calculate busy time intervals
    const busyTimeIntervals = schedules.map((schedule: any) => {
        const startTime = dayjs(schedule.start_time, 'HH:mm:ss');
        const endTime = startTime.add(schedule.duration, 'hours');
        return [startTime, endTime];
    });

    // Filter out free time intervals based on busy time intervals
    const filteredFreeTimeIntervals = freeTimes.filter((freeInterval: any) => {
        const freeStartTime = dayjs(freeInterval, 'HH:mm');
        const freeEndTime = freeStartTime.add(1, 'hour');

        // Check if the free interval overlaps with any busy interval
        return !busyTimeIntervals.some((busyInterval: any) => {
            const [busyStartTime, busyEndTime] = busyInterval;
            return (
                ((freeStartTime.isSame(busyStartTime) || freeStartTime.isAfter(busyStartTime)) && freeStartTime.isBefore(busyEndTime)) ||
                (freeEndTime.isAfter(busyStartTime) && (freeEndTime.isSame(busyEndTime) || freeEndTime.isBefore(busyEndTime))) ||
                ((busyStartTime.isSame(freeStartTime) || busyStartTime.isAfter(freeStartTime)) && busyStartTime.isBefore(freeEndTime)) ||
                (busyEndTime.isAfter(freeStartTime) && (busyEndTime.isSame(freeEndTime) || busyEndTime.isBefore(freeEndTime)))
            );
        });
    });

    console.log("filteredFreeTimeIntervals: ", filteredFreeTimeIntervals);
    setFreeTimes((prev: any) => {
      return {...prev, [selectedTrainer.trainerid]: filteredFreeTimeIntervals}
    })
  };


  const getFreeTimes = async () => {
    if (selectedDate) {
      let params = {trainerid: selectedTrainer.trainerid, date: selectedDate}
      let apiConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3005/schedules/getTrainerSchedule',
        params: params,
        headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
      }
      await axios.request(apiConfig)
        .then((response:any) => {
          console.log("schedules: ", response.data);
          // setFreeTimes(response.data);
          calculateFreeTimes(response.data);
          return {};
        })
        .catch((error:any) => {
          console.log("Error: ", error);
          alert(error?.response?.data.message ?? error.message)
        })
    }
  }

  const onSelectTime = (time:any) => {
    selectedTime == time ? setSelectedTime('') : setSelectedTime(time);
  }

  const user = React.useContext(UserContext);

  const bookClass = () => {
    setPaymentModalOpen(true);
  }

  React.useEffect(() => {
    getFreeTimes();
  }, [selectedDate]);

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
  }

  return(
    <>

       <Modal open={modalOpen} onClose={onClose} >
        <Card sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 24, p: 4, maxHeight: "35rem", overflow: "scroll", scrollbarWidth: "thin" }}>
          {selectedTrainer && (
            <>
              <CardHeader 
                title={`${selectedTrainer.f_name} ${selectedTrainer.l_name}`} 
                sx={{padding: "0 0 1rem 0"}}
                avatar={<Avatar src={selectedTrainer.avatar} />}
                subheader={
                          <> 
                            Email: {selectedTrainer.email} <br />
                            Specialities: {selectedTrainer.speciality.join(', ')} <br />
                            {personalClass && `Training for: ${personalClass.description}`}<br/>
                            {personalClass && <Box component={'span'} color={'warning.main'}>Price: ${personalClass.price} </Box>}
                          </>
                        }  
              />
              <Divider />
              <CardContent mt={2} sx={{paddingBottom: 0}} >
                <Grid container gap={2} justifyContent={"center"} >
                {availabilities.length > 0 ? 
                  availabilities.map(({ date }: {date:any}) => (
                    <Button key={date} color={selectedDate == date ? "primary" : "secondary"} variant={selectedDate == date ? "contained" : "outlined"} onClick={() => handleDateClick(date)}>
                      {date}
                    </Button>
                  ))
                :
                  <Typography variant="body1" color="textSecondary">Trainer Unavailable for personal training...</Typography>
                }
                </Grid>
              </CardContent>
              {//selectedDate && (
                <AvailableHours availableHours={freeTimes[selectedTrainer?.trainerid]} display={selectedDate} selectedTime={selectedTime} onSelectTime={onSelectTime} />
               //)
              }
              <CardActions>
                {availabilities.length > 0 && <Button onClick={bookClass} variant="contained" color="primary" sx={{ mt: 2 }} disabled= {!selectedDate || !selectedTime}>Book</Button>}
                <Button onClick={onClose} variant="outlined" color="secondary" sx={{ mt: 2 }}>Close</Button>
                </CardActions>
            </>
          )}
        </Card>
      </Modal>
      <PaymentModal 
        isOpen={paymentModalOpen} 
        closePaymentModal={closePaymentModal} 
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        personalClass={personalClass}
        selectedTrainer={selectedTrainer}
      />
    </>
  )
}


const AvailableHours = ({ availableHours, display, selectedTime, onSelectTime }: {availableHours: any, display: string|null, selectedTime: string|null, onSelectTime: (time:any) => void }) => {

  

  return (
    <>
      <br />
      <Divider />
      <Box mt={display? 2 : 0} sx={{backgroundColor: "#ebe8e8", padding: display? "1rem":"", borderRadius: "1rem", maxHeight: display? '500px' : "1px", transition: "all 0.5s", overflow: "hidden", opacity: display ? 1 : 0, visibility: display ? 'visible' : 'hidden'}}>
        <Typography variant="h6">Available Hours:</Typography>
        <br />
          <Grid container gap={2} justifyContent={"center"} >
            {availableHours?.map((time: any, key:number) => (
                <Button key={key} color={selectedTime == time ? "primary" : "secondary"} variant={selectedTime == time ? "contained" : "outlined"} onClick={() => onSelectTime(time)}>
                  {time} - {dayjs(time, 'HH:mm').add(1, 'hours').format('HH:mm')}
                </Button>
            ))}
          </Grid>
      </Box>
    </>
  );
};

interface PaymentModalProps {
  isOpen: boolean, 
  closePaymentModal: () => void,
  selectedDate: string|null,
  selectedTime: string|null,
  personalClass: any,
  selectedTrainer?: Trainer|null,
}

const PaymentModal = ({ isOpen, closePaymentModal, selectedDate, selectedTime, personalClass, selectedTrainer } : PaymentModalProps) => {
  const user = React.useContext(UserContext);
  const router = useRouter();
  const bookClass = async () => {
    const data = `memberid=${user?.user?.userid}&classid=${personalClass?.classid}&roomid=${1}&date=${selectedDate}&start_time=${selectedTime}&duration=1&status=CONFIRMED&trainerid=${selectedTrainer?.trainerid}`
    let apiConfig = {
      method: 'post',
      url: 'http://localhost:3005/schedules/createPersonalSchedule',
      data: data,
      headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
    }
    await axios.request(apiConfig)
      .then((response:any) => {
        console.log("Booked class: ", response.data);
        const newSchedule = response.data.scheduleid;
        handleConfirmPayment(newSchedule)
        return {};
      })
      .catch((error:any) => {
        console.log("Error: ", error);
        alert(error?.response?.data.message ?? error.message)
      })
  }
  const handleConfirmPayment = async(scheduleid: any) => {
    // Here you can add logic to handle the payment confirmation
    if(scheduleid) {
      const data = `scheduleid=${scheduleid}&memberid=${user?.user?.userid}&paidAmount=${personalClass?.price}`
      const apiConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:3005/members/paybill',
        data: data,
        headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
      }

      await axios.request(apiConfig)
            .then((response:any) => {
              console.log("Payment confirmed: ", response.data);
              alert("Payment confirmed successfully!")
              router.replace('/dashboard/memberSchedule');
              return {};
            })
            .catch((error:any) => {
              console.log("Error: ", error);
              alert(error?.response?.data.message ?? error.message)
            })
      //api call to /paybill
    }else{
      alert("Please select all values to confirm payment");
      closePaymentModal();
    }
  };


  return (
    <Modal
      open={isOpen}
      onClose={closePaymentModal}
      aria-labelledby="payment-modal-title"
      aria-describedby="payment-modal-description"
    >
     <Card sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 24, p: 4, maxHeight: "35rem"}}>
        <Typography id="payment-modal-title" variant="h5" component="h2" gutterBottom>
          Confirm Payment <Box component='span' color={'warning.main'}>${personalClass?.price}</Box>
        </Typography>
        <CardContent>
          <Typography id="payment-modal-description" variant="body1" gutterBottom>
            Are you sure you want to confirm the payment for this class?
          </Typography>
        </CardContent>
        <CardActions >
          <Button variant="contained" color="primary" onClick={bookClass} >
            Confirm Payment
          </Button>
          <Button variant="outlined" color="error" onClick={closePaymentModal}>
            Cancel
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
};
