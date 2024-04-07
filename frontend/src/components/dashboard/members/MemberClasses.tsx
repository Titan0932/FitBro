import React from 'react'
import { Grid, Card, CardHeader, Typography, Divider, CardContent, IconButton, Chip, Modal, CardActions, Button, Box } from '@mui/material';
import { any } from 'zod';
import { PlusCircle } from '@phosphor-icons/react/dist/ssr/PlusCircle';
import { UserContext } from '@/contexts/user-context';
import { useRouter } from 'next/navigation';

const axios = require('axios');


export const MemberClasses = () => {
    const [classes, setClasses] = React.useState([]);
    const [trainers, setTrainers] = React.useState({});
    const [selectedClass, setSelectedClass] = React.useState(null);
    const [classTimes, setClassTimes] = React.useState([]);
    const [selectedTime, setSelectedTime] = React.useState(null);
    const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);


    const getTrainerDetails = async(trainerid: string) => {
        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3005/trainers/getTrainerDetails',
            params: {trainerid: trainerid},
            headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
        }
        await axios.request(apiConfig)
            .then((response:any) => {
                console.log("Trainer Details: ", response.data);
                setTrainers((prev: any) => {
                    return {...prev, [trainerid]: response.data[0]}
                })
                return response.data;
            })
            .catch((error:any) => {
                console.log("Error: ", error);
                return {error: error?.response?.data ?? error.message}
            })
    }

    const getClasses = async() => {
        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3005/classes/getAllClasses',
            headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')},
            params: {type: "group"}
        }
        await axios.request(apiConfig)
            .then((response:any) => {
                console.log("Classes: ", response.data);
                setClasses(response.data);
                response.data.map((aClass: any) => Object.hasOwnProperty(aClass.trainerid) ? null : getTrainerDetails(aClass.trainerid));
                return {};
            })
            .catch((error:any) => {
                console.log("Error: ", error);
                return {error: error?.response?.data ?? error.message}
            })
    }
    
    const onClassSelect = (aClass: any) => {
        console.log("Selected class: ", aClass);
        setSelectedClass(aClass);
    }

    const getClassSchedule = async () => {
        if(selectedClass == null) return;

        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3005/classes/getClassSchedule',
            headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')},
            params: {classid: selectedClass?.classid}
        }

        await axios.request(apiConfig)
                    .then((response:any) => {
                        console.log("Class Schedule: ", response.data);
                        setClassTimes(response.data);
                        return {};
                    })
                    .catch((error:any) => {
                        console.log("Error: ", error);
                        return {error: error?.response?.data ?? error.message}
                    })
    }

    const onSelectTime = (aTime: any) => {
        setSelectedTime(aTime);
    }

    const onClose = () => {
        setSelectedClass(null);
        setClassTimes([]);
        setSelectedTime(null);
    }

    React.useEffect(() => {
        getClasses();
    },[])

    React.useEffect(() => {
        if(selectedClass == null) {
            setClassTimes([]);
            return;
        };
        getClassSchedule();
    },[selectedClass])



    return (
        <div>
            <h1>Group Classes</h1>
            <Grid container spacing={2} >
                {
                    classes.map((aClass: any) => (
                        <ClassCard aClass={aClass} trainer={trainers[aClass?.trainerid]} onClassSelect={onClassSelect} />
                    ))
                }
            </Grid>
            <ClassModal selectedClass={selectedClass} onClose={onClose} classTimes={classTimes} selectedTime={selectedTime} onSelect={onSelectTime} setPaymentModalOpen={setPaymentModalOpen}  />
            <PaymentModal isOpen={paymentModalOpen} closePaymentModal={() => setPaymentModalOpen(false)} selectedTime={selectedTime} />
        </div>
    )

}


const ClassCard = ({ aClass, trainer, onClassSelect } : {aClass: any, trainer: any, onClassSelect: (aClass: any) => void}) => {
  
    return (
        <>
            <Grid item xs={12} sm={6} md={4} key={aClass?.classid} >
                <Card key={aClass?.classid} >
                <CardHeader
                    action={
                    <>
                        <IconButton color='primary' aria-label="addClass" onClick={() => onClassSelect(aClass)}>
                        <PlusCircle  size={32} />
                        </IconButton>
                    </>
                    }
                    title={`Class Name: ${aClass?.name}`}
                    subheader={<><div>Trainer: {`${trainer?.f_name} ${trainer?.l_name}`}</div><div>Email: {trainer?.email}</div></>}
                />
                <Divider />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                    Class Description: {aClass?.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                    Price: <Chip label={`\$${aClass?.price}`} color={'warning'} size='small' />
                    </Typography>
                </CardContent>
                </Card>
            </Grid>
        </>
    );
  };


const ClassModal = ({selectedClass, onClose, classTimes, selectedTime, onSelect, setPaymentModalOpen} : {selectedClass: any, onClose: () => void, classTimes: any, selectedTime: any, onSelect: (aTime: any) => void, setPaymentModalOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {

    const bookClass = () => {
        setPaymentModalOpen(true);
    }

    return(
        <>
            <Modal open={selectedClass != null} onClose={onClose} >
                <Card sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 24, p: 4, maxHeight: "35rem", overflow: "scroll", scrollbarWidth: "thin" }}>
                    <>
                        <CardHeader 
                            title='Book a slot!'
                            sx={{padding: "0 0 1rem 0"}}
                        />
                        <Divider />
                        <CardContent sx={{paddingBottom: 0}} >
                            <Grid container gap={2} justifyContent={"center"} >
                            {classTimes.length > 0 ? 
                                classTimes.map((slot:any) => (
                                    <Button 
                                        key={slot?.scheduleid} 
                                        color={selectedTime?.scheduleid === slot?.scheduleid ? "primary" : "secondary"} 
                                        variant={selectedTime?.scheduleid === slot?.scheduleid ? "contained" : "outlined"} 
                                        onClick={() => onSelect(slot)}
                                        style={{ marginBottom: "8px" }} // Add some vertical spacing between buttons
                                    >
                                        <div>
                                            <strong>Date:</strong> {slot?.date}
                                        </div>
                                        <div>
                                            <strong>Start Time:</strong> {slot?.start_time}
                                        </div>
                                        <div>
                                            <strong>Duration:</strong> {slot?.duration} hours
                                        </div>
                                    </Button>
                                ))
                            :
                                <Typography variant="body1" color="textSecondary">Class is not available currently!</Typography>
                            }
                            </Grid>
                        </CardContent>
                    
                        <CardActions>
                            <Button onClick={bookClass} variant="contained" color="primary" disabled={selectedTime==null} sx={{ mt: 2 }} >Book</Button>
                            <Button onClick={onClose} variant="outlined" color="secondary" sx={{ mt: 2 }}>Close</Button>
                        </CardActions>
                    </>
                </Card>
            </Modal>
        </>
    )
}



const PaymentModal = ({ isOpen, closePaymentModal, selectedTime } : {isOpen: boolean, closePaymentModal: () => void, selectedTime: any}) => {
    const user = React.useContext(UserContext);
    const router = useRouter();
    
    const bookClass = async () => {
      const data = `memberid=${user?.user?.userid}&scheduleid=${selectedTime?.scheduleid}`
      let apiConfig = {
        method: 'post',
        url: 'http://localhost:3005/members/bookGroupClass',
        data: data,
        headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
      }
      await axios.request(apiConfig)
        .then((response:any) => {
          console.log("Booked class: ", response.data);
          handleConfirmPayment();
          return {};
        })
        .catch((error:any) => {
          console.log("Error: ", error);
          alert(error?.response?.data ?? error.message)
        })
    }

    const handleConfirmPayment = async() => {
      // Here you can add logic to handle the payment confirmation
      if(selectedTime?.scheduleid) {
        const data = `scheduleid=${selectedTime?.scheduleid}&memberid=${user?.user?.userid}&paidAmount=${selectedTime?.price}`
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
                alert(error?.response?.data ?? error.message)
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
            Confirm Payment <Box component='span' color={'warning.main'}>${selectedTime?.price}</Box>
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