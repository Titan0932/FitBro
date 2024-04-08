import React from 'react'
import { Grid, Card, CardHeader, Typography, Divider, CardContent, IconButton, Chip, Modal, CardActions, Button, Box, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, MenuItem, FormControl, Avatar } from '@mui/material';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { UserContext } from '@/contexts/user-context';
import { useRouter } from 'next/navigation';
import { PlusCircle as AddIcon } from '@phosphor-icons/react/dist/ssr/PlusCircle';
import { PencilSimple as EditIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import dayjs from 'dayjs';

const axios = require('axios');
const moment = require('moment');

interface NewClass {
    name: string,
    description: string,
    price: number,
    trainer: Record<string, string>,
    type: string
}

export const AdminClasses = () => {
    const [classes, setClasses] = React.useState([]);
    const [trainers, setTrainers] = React.useState({});
    const [classToDelete, setClassToDelete] = React.useState(null);
    const [classTimes, setClassTimes] = React.useState([]);
    const [createClassOpen, setCreateClassOpen] = React.useState(false);
    const [selectedSlot, setSelectedSlot] = React.useState(null);
    const [openEditModal, setOpenEditModal] = React.useState(false);
    const [classScheduleToAdd, setClassScheduleToAdd] = React.useState(null);
    const [availableRooms, setAvailableRooms] = React.useState([]);

    const closeEditModal = () => {
        setOpenEditModal(false);
    }


    const getTrainerDetails = async() => {
        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3005/trainers/getAllTrainers',
            headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
        }
        await axios.request(apiConfig)
            .then((response:any) => {
                response.data.map((trainer: any) => {
                    setTrainers((prev: any) => {
                        return {...prev, [trainer.trainerid]: trainer}
                    })
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
        }
        await axios.request(apiConfig)
            .then((response:any) => {
                setClasses(response.data);
                return {};
            })
            .catch((error:any) => {
                console.log("Error: ", error);
                return {error: error?.response?.data ?? error.message}
            })
    }
    
    const onDeleteClassSelect = (aClass: any) => {
        setClassToDelete(aClass);
    }

    const getClassSchedule = async () => {
        if(classToDelete == null) return;

        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3005/classes/getClassSchedule',
            headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')},
            params: {classid: classToDelete?.classid}
        }

        await axios.request(apiConfig)
                    .then((response:any) => {
                        setClassTimes(response.data);
                        return {};
                    })
                    .catch((error:any) => {
                        console.log("Error: ", error);
                        return {error: error?.response?.data ?? error.message}
                    })
    }

    const deleteClass = async() => {
        console.log("Deleting class: ", classToDelete);
        const apiConfig = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: 'http://localhost:3005/classes/deleteClass',
            headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')},
            params: {classid: classToDelete?.classid}
        }

        await axios.request(apiConfig)
                    .then((response:any) => {
                        console.log("Class Deleted: ", response.data);
                        classModalClose();
                        getClasses();
                        return {};
                    })
                    .catch((error:any) => {
                        console.log("Error: ", error);
                        alert(error?.response?.data ?? error.message)
                    })
    }

    const classModalClose = () => {
        setClassToDelete(null);
        setClassTimes([]);
        setSelectedSlot(null);
    }

    const getAvailableRooms = async() => {
        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3005/admin/getAllRooms',
            headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')},
            params: {status: "AVAILABLE"}
        }
        await axios.request(apiConfig)
            .then((response:any) => {
                setAvailableRooms(response.data);
                return response.data;
            })
            .catch((error:any) => {
                console.log("Error: ", error);
                return {error: error?.response?.data ?? error.message}
            })
    }

    React.useEffect(() => {
        getTrainerDetails();
        getClasses();
        getAvailableRooms();
    },[])

    React.useEffect(() => {
        if(classToDelete == null) {
            setClassTimes([]);
            return;
        };
        getClassSchedule();
    },[classToDelete])


    const closeCreateClass = () => {
        setCreateClassOpen(false);
    }

    const createClass = async(newClass: NewClass) => {
        event?.preventDefault();
        console.log("Creating new class: ", newClass);
        const apiConfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3005/classes/addClass',
            headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')},
            data: `name=${newClass.name}&description=${newClass.description}&price=${newClass.price}&trainerid=${newClass.trainer.trainerid}&type=${newClass.type}`
        }
        await axios.request(apiConfig)
                    .then((response:any) => {
                        console.log("Class Created: ", response.data);
                        getClasses();
                        alert("Class created successfully!")
                        closeCreateClass();
                        return {};
                    })
                    .catch((error:any) => {
                        console.log("Error: ", error);
                        alert(error?.response?.data ?? error.message)
                    })
    }

    const onSelectTime = (aTime: any) => {
        let newTime = aTime;
        selectedSlot == newTime ? 
            setSelectedSlot(null) 
        :
            setSelectedSlot(newTime);
    }

    // This validation is not done in backend! Need to do! For later!!
    const validateNewSchedule = async (newStartDate:any, newStartTime:any, newDuration:any) => {
        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3005/schedules/getSchedule',
            headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')},
            params: {date: newStartDate}
        }
        let existingSchedules;
        try{
            let response = await axios.request(apiConfig)
            existingSchedules =  response.data;
            if(existingSchedules.length == 0) return true;
            const newStartTimeMoment = moment(newStartTime, 'HH:mm');
            const newEndTimeMoment = moment(newStartTimeMoment).add(newDuration, 'hours');
            for (const schedule of existingSchedules) {
                const existingStartTimeMoment = moment(schedule.start_time, 'HH:mm');
                const existingEndTimeMoment = moment(existingStartTimeMoment).add(schedule.duration, 'hours');
    
                // Check for overlap
                if (
                    ((newStartTimeMoment.isSame(existingStartTimeMoment) || newStartTimeMoment.isAfter(existingStartTimeMoment)) && newStartTimeMoment.isBefore(existingEndTimeMoment)) ||
                    (newEndTimeMoment.isAfter(existingStartTimeMoment) && (newEndTimeMoment.isSame(existingEndTimeMoment) || newEndTimeMoment.isBefore(existingEndTimeMoment))) ||
                    ((existingStartTimeMoment.isSame(newStartTimeMoment) || existingStartTimeMoment.isAfter(newStartTimeMoment)) && existingStartTimeMoment.isBefore(newEndTimeMoment)) ||
                    (existingEndTimeMoment.isAfter(newStartTimeMoment) && (existingEndTimeMoment.isSame(newEndTimeMoment) || existingEndTimeMoment.isBefore(newEndTimeMoment)))
                ) {
                    // If there's overlap, return false indicating slot is already booked
                    return false;
                }
            }
            return true;
        }catch(error){
            console.log("Error: ", error);
            alert( "Error validating new schedule: " + (error?.response?.data ?? error.message))
            return false
        }
    }

    const updateClass = async (newStartDate:any, newStartTime:any, newDuration:any) => {
        event.preventDefault();
        if(newDuration > 3 || newDuration < 1) {
            return alert("Duration should be between 1 and 3 hours!");
        }

        if(await validateNewSchedule(newStartDate, newStartTime, newDuration)) {

            const apiConfig = {
                method: 'put',
                maxBodyLength: Infinity,
                url: 'http://localhost:3005/schedules/updateSchedule',
                headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')},
                data: `scheduleid=${selectedSlot?.scheduleid}&date=${newStartDate}&start_time=${newStartTime}&duration=${newDuration}`
            }
            await axios.request(apiConfig)
                        .then((response:any) => {
                            console.log("Class Updated: ", response.data);
                            getClassSchedule();
                            alert("Class timings updated successfully!")
                            setSelectedSlot(null);
                            closeEditModal();
                            return {};
                        })
                        .catch((error:any) => {
                            console.log("Error: ", error);
                            alert(error?.response?.data ?? error.message)
                        })
        }else{
            alert("Slot already booked! Please select a different slot.")
            return;
        }
    }

    const addGroupSchedule = async(newStartDate:any, newStartTime:any, newDuration:any, room: any) => {
        event.preventDefault();
        if(newDuration > 3 || newDuration < 1) {
            return alert("Duration should be between 1 and 3 hours!");
        }

        if(await validateNewSchedule(newStartDate, newStartTime, newDuration)) {

            const apiConfig = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:3005/schedules/createGroupSchedule',
                headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')},
                data: `&date=${newStartDate}&start_time=${newStartTime}&duration=${newDuration}&status=CONFIRMED&classid=${classScheduleToAdd?.classid}&roomid=${room ?? 1}&type=group&trainerid=${classScheduleToAdd?.trainerid}`
            }
            await axios.request(apiConfig)
                        .then((response:any) => {
                            console.log("Class Updated: ", response.data);
                            getClassSchedule();
                            alert("Class timings updated successfully!")
                            setSelectedSlot(null);
                            closeEditModal();
                            return {};
                        })
                        .catch((error:any) => {
                            console.log("Error: ", error);
                            alert(error?.response?.data ?? error.message)
                        })
        }else{
            alert("Slot already booked! Please select a different slot.")
            return;
        }
    }

    const closeGroupScheduleModal = () => {
        setClassScheduleToAdd(null);
    }

    const onAddScheduleClassSelect = (aClass: any) => {
        setClassScheduleToAdd(aClass);
    }


    return (
        <div>
            <h1 style={{display: "flex", alignItems: "center", gap: "5px"}}>Classes <IconButton color='primary' aria-label="addClass" onClick={() => setCreateClassOpen(true)} ><AddIcon /></IconButton></h1> 
            <Grid container spacing={2} >
                {
                    classes.map((aClass: any) => (
                        <ClassCard aClass={aClass} trainer={trainers[aClass?.trainerid]} onDeleteClassSelect={onDeleteClassSelect} onAddScheduleClassSelect={onAddScheduleClassSelect} />
                    ))
                }
            </Grid>
            <ClassModal classToDelete={classToDelete} onClose={classModalClose} classTimes={classTimes} deleteClass={deleteClass} updateClass={updateClass} selectedSlot={selectedSlot} onSelectTime={onSelectTime} openEditModal={openEditModal} closeEditModal={closeEditModal} setOpenEditModal={setOpenEditModal} /> {/* trainer={trainers[classToDelete?.trainerid]} */}
            <AddClass open={createClassOpen} trainers={trainers} createClass={createClass} onClose={closeCreateClass} />
            <AddGroupScheduleModal modalOpen={classScheduleToAdd!=null} onClose={closeGroupScheduleModal} addGroupSchedule={addGroupSchedule} availableRooms={availableRooms} />
        </div>
    )

}


const ClassCard = ({ aClass, trainer, onDeleteClassSelect, onAddScheduleClassSelect } : {aClass: any, trainer: any, onDeleteClassSelect: (aClass: any) => void, onAddScheduleClassSelect: (aClass: any) => void }) => {
  
    return (
        <>
            <Grid item xs={12} sm={6} md={4} key={aClass?.classid} >
                <Card key={aClass?.classid} >
                    <CardHeader
                        action={
                        <>
                            <IconButton color='info' aria-label="deleteClass" onClick={() => onDeleteClassSelect(aClass)}>
                                <EditIcon  size={32} />
                            </IconButton>
                            {
                                aClass?.type == "group" && 
                                    <IconButton color='info' aria-label="deleteClass" onClick={() => onAddScheduleClassSelect(aClass)}>
                                        <AddIcon  size={32} />
                                    </IconButton>
                            }
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


interface ClassModalProps {
    classToDelete: any;
    onClose: () => void;
    classTimes: any;
    deleteClass: () => void;
    updateClass: (newDate: any, newTime: any, newDuration:any) => void;
    trainer?: any;
    selectedSlot: any;
    onSelectTime: (aTime: any) => void;
    openEditModal: boolean;
    closeEditModal: () => void;
    setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClassModal = ({classToDelete, onClose, classTimes, deleteClass, updateClass, selectedSlot, onSelectTime, openEditModal, closeEditModal, setOpenEditModal} : ClassModalProps) => {
    
    return(
        <>
            <Modal open={classToDelete != null} onClose={onClose} >
                <Card sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 24, p: 4, maxHeight: "35rem", overflow: "scroll", scrollbarWidth: "thin" }}>
                    <>
                        <CardHeader 
                            title='Are you sure you want to delete this class?'
                            sx={{padding: "0 0 1rem 0"}}
                            subheader={<Box component='span' color={`error.main`}>Can only delete classes with no scheduled dates! </Box>}
                        />
                        <Divider />
                        <CardContent sx={{paddingBottom: 0}} >
                            <Grid container gap={2} justifyContent={"center"} >
                            {classTimes.length > 0 ? 
                                classTimes.map((slot:any) => (
                                    <Button 
                                        key={slot?.scheduleid} 
                                        color={slot?.date== selectedSlot?.date && slot?.start_time == selectedSlot?.start_time? "primary" :  "secondary"} 
                                        variant={slot?.date== selectedSlot?.date && slot?.start_time == selectedSlot?.start_time? "contained" : "outlined"} 
                                        style={{ marginBottom: "8px" }} // Add some vertical spacing between buttons
                                        onClick={() => onSelectTime(slot)}
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
                                <Typography variant="body1" color="textSecondary">No scheduled dates!</Typography>
                            }
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Button onClick={deleteClass} variant="contained" color="error" sx={{ mt: 2 }} disabled={classTimes.length > 0} >Delete</Button>
                            <Button onClick={() => setOpenEditModal(true)} variant="contained" color="info" sx={{ mt: 2 }} disabled={selectedSlot == null} >Edit Timings</Button>
                            <Button onClick={onClose} variant="outlined" color="secondary" sx={{ mt: 2 }}>Close</Button>
                        </CardActions>
                    </>
                </Card>
            </Modal>
            <EditClassModal modalOpen={openEditModal} onClose={closeEditModal}  updateClass={updateClass} />

        </>
    )
}


const AddClass = ({open, trainers, createClass, onClose} : {open: boolean, trainers: Record<number, Record<string, string>>, createClass: (newClass: NewClass) => void, onClose: () => void}) => {
    
    const [newClass, setNewClass] = React.useState<NewClass>({name: "", description: "", price: 0, trainer: {}, type: ""});

    const setClassName = (title: string) => {
        setNewClass((prev) => {
            return {...prev, name: title}
        })
    }

    const setDescription = (desc: string) => {
        setNewClass((prev) => {
            return {...prev, description: desc}
        })
    }

    const setPrice = (price: string) => {
        setNewClass((prev) => {
            return {...prev, price: parseInt(price)}
        })
    }

    const setType = (type: string) => {
        setNewClass((prev) => {
            return {...prev, type: type}
        })
    }

    const setTrainer = (trainer: Record<string,string>) => {
        setNewClass((prev) => {
            return {...prev, trainer: trainer}
        })
    }

    return(
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Class</DialogTitle>
                <form onSubmit={() => createClass(newClass)}>
                    <DialogContent>
                        <DialogContentText>
                            Please fill in the details for the new class.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Class Name"
                            fullWidth
                            value={newClass?.name}
                            onChange={(e) => setClassName(e.target.value)}
                            required={true}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            value={newClass?.description}
                            onChange={(e) => setDescription(e.target.value)}
                            required={true}
                        />
                        <TextField
                            margin="dense"
                            label="Price $"
                            fullWidth
                            value={newClass?.price}
                            type='number'
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Type"
                            fullWidth
                            select // Use 'select' to indicate it's a dropdown
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={newClass?.type}
                            onChange={(e) => setType(e.target.value)}
                            required={true}
                        >
                            <MenuItem value="personal">personal</MenuItem>
                            <MenuItem value="group">group</MenuItem>
                        </TextField>
                        <TextField
                            margin="dense"
                            label="Trainer"
                            fullWidth
                            select
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e) => setTrainer(e.target.value)}
                            required={true}
                        >
                            {Object.keys(trainers).map((trainerid: string) => (
                                <MenuItem key={trainerid} value={trainers[trainerid]}>
                                    {`${trainers[trainerid].f_name} ${trainers[trainerid].l_name}`}
                                </MenuItem>
                            ))}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} color="secondary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Add Class
                        </Button>
                    </DialogActions>
                </form>
        </Dialog>
    )
}


interface Trainer {
    trainerid: string;
    avatar?: string;
    f_name: string;
    l_name: string;
    email: string;
    // address: { city: string; state: string; country: string; street: string };
    speciality: [string];
  }

const EditClassModal = ({modalOpen, onClose, updateClass}: {modalOpen: boolean, onClose: () => void, updateClass: (newDate: any, newTime: any, newDuration:any) => void}) => {
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [updatedStartTime, setUpdatedStartTime] = React.useState(null);
    const [updatedDuration, setUpdatedDuration] = React.useState(null);
    const user = React.useContext(UserContext);

    return(
        <>
             <Modal open={modalOpen} onClose={onClose} >
                <Card sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 24, p: 4, maxHeight: "35rem", overflow: "scroll", scrollbarWidth: "thin" }}>
                    <CardHeader 
                        title={`Reschedule Class`} 
                        sx={{padding: "0 0 1rem 0"}}
                    />
                    <Divider />
                    <form onSubmit={() => updateClass(selectedDate, updatedStartTime, updatedDuration)}>
                        <CardContent sx={{paddingBottom: 0}} >
                        <Grid container gap={2} justifyContent={"center"} >
                            <TextField
                                margin="dense"
                                label="Select Date"
                                type="date"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                required={true}
                            />
                            <TextField
                                margin="dense"
                                label="Start Time"
                                type="time"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => setUpdatedStartTime(e.target.value)}
                                required={true}
                            />
                            <TextField
                                margin="dense"
                                label="Duration"
                                type="number"
                                min={1}
                                max={3}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => setUpdatedDuration(e.target.value)}
                                required={true}
                            />
                        </Grid>
                        </CardContent>
                        <CardActions>
                        {user?.role != "admin" && <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled= {!selectedDate || !updatedStartTime || !updatedDuration}>Update</Button>}
                        <Button onClick={onClose} variant="outlined" color="secondary" sx={{ mt: 2 }}>Close</Button>
                        </CardActions>
                    </form>
                </Card>
                </Modal>
        
        
        </>
    )
}


const AddGroupScheduleModal = ({modalOpen, onClose, addGroupSchedule, availableRooms}: {modalOpen: boolean, onClose: () => void, addGroupSchedule: (newDate: any, newTime: any, newDuration:any, room:any) => void, availableRooms: any}) => {
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [startTime, setStartTime] = React.useState(null);
    const [duration, setDuration] = React.useState(null);
    const [room, setRoom] = React.useState(null);
    const user = React.useContext(UserContext);

    return(
        <>
             <Modal open={modalOpen} onClose={onClose} >
                <Card sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 24, p: 4, maxHeight: "35rem", overflow: "scroll", scrollbarWidth: "thin" }}>
                    <CardHeader 
                        title={`Create a Schedule!`} 
                        sx={{padding: "0 0 1rem 0"}}
                    />
                    <Divider />
                    <form onSubmit={() => addGroupSchedule(selectedDate, startTime, duration, room)}>
                        <CardContent sx={{paddingBottom: 0}} >
                        <Grid container gap={2} justifyContent={"center"} >
                            <TextField
                                margin="dense"
                                label="Select Date"
                                type="date"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                required={true}
                            />
                            <TextField
                                margin="dense"
                                label="Start Time"
                                type="time"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => setStartTime(e.target.value)}
                                required={true}
                            />
                            <TextField
                                margin="dense"
                                label="Duration"
                                type="number"
                                min={1}
                                max={3}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => setDuration(e.target.value)}
                                required={true}
                            />
                            <TextField
                                margin="dense"
                                label="Select Room"
                                fullWidth
                                select
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => setRoom(e.target.value)}
                            >
                                {
                                    availableRooms.map((room: any) => (
                                        <MenuItem value={room.roomid}>{room.name}</MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        </CardContent>
                        <CardActions>
                        {user?.role != "admin" && <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled= {!selectedDate || !startTime || !duration }>Add</Button>}
                        <Button onClick={onClose} variant="outlined" color="secondary" sx={{ mt: 2 }}>Close</Button>
                        </CardActions>
                    </form>
                </Card>
                </Modal>
        
        
        </>
    )
}
