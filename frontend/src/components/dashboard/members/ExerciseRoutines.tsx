


import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField, Card, CardContent, CardHeader, Checkbox, Divider, Grid, IconButton, Typography,
  Table, TableHead, TableBody, TableRow, TableCell, Paper, 
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { UserContext } from "@/contexts/user-context"
import { CheckCircle as CompletedIcon, RadioButton as ToDoIcon, PlusCircle as AddIcon } from "@phosphor-icons/react";
import { set } from 'react-hook-form';

const axios = require('axios');




export const ExcerciseRoutines = () => {
    const [myRoutine, setMyRoutine] = useState([]);
    const [exerciseList, setExerciseList] = useState([]);
    const user = React.useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getExcerciseList = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3005/members/getExcersises',
            headers: {Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`},
        };

        await axios(config)
        .then((response: any) => {
            console.log(response.data);
            setExerciseList(response.data)
        })
        .catch((error: any) => {
            console.log(error);
        });
    }

    const getMyRoutine = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3005/members/getWeeklyRoutines',
            params: {
                memberid: user?.user?.userid
            },
            headers: {Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`},
        };

        await axios(config)
        .then((response: any) => {
            console.log(response.data);
            setMyRoutine(response.data)
        })
        .catch((error: any) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getExcerciseList();
        getMyRoutine();
    }, [])

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleAddExercise = async (exerciseData: any) => {
        console.log(exerciseData);
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3005/members/selectExercise',
            headers: {Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`},
            data: `memberid=${user?.user?.userid}&exerciseid=${exerciseData.exerciseId}&reps=${exerciseData.reps}&weight=${exerciseData.weight}&start_week=${exerciseData.startWeek}`
        }
        await axios.request(config)
        .then((response: any) => {
            console.log("response: ", response.data);
            getMyRoutine();
        })
        .catch((error: any) => {
            console.log(error);
            alert("Error: " + error?.response?.data?.message ?? error.message)
        })
        handleCloseModal()
        // getMyRoutine();
    }


    
    return(
        <>
            <h1 style ={{display: "flex", alignItems: "center", gap: "5px"}}>
                My Exercise Routine
                <IconButton color='primary' onClick={() => handleOpenModal()}> <AddIcon /> </IconButton>
            </h1>
            {
                myRoutine.length == 0 ?
                    <Typography variant="body2" color="textSecondary">No exercises added to your routine. Click on the + icon to add a new goal.</Typography>
                :
                    <ExerciseRoutineTable routineData={myRoutine} />
            }

            <AddExerciseModal
                open={isModalOpen}
                onClose={handleCloseModal}
                exerciseList={exerciseList}
                onAdd={handleAddExercise}
            />
        </>
    )
}


const ExerciseRoutineTable = ({ routineData }: {routineData: any}) => {
    return (
        <Grid container spacing={2}>
            {routineData.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>{item.exercises.name}</Typography>
                            <Typography variant="body2" color="textSecondary">{item.exercises.description}</Typography>
                            <Typography variant="body2">Reps: {item.member_exercises.reps}</Typography>
                            <Typography variant="body2">Weight: {item.member_exercises.weight}</Typography>
                            <Typography variant="body2">Start Week: {item.member_exercises.start_week}</Typography>
                            <Typography variant="body2">Type: {item.exercises.type}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};



const ExerciseOptionCard = ({ exercise, onClick, selectedExercise } : {exercise: any, onClick: () => void, selectedExercise: string}) => {
    return (
      <Card variant="outlined" sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h6">{exercise.name}</Typography>
          <Typography variant="body2" color="textSecondary">{exercise.description}</Typography>
          <Typography variant="body2">Type: {exercise.type}</Typography>
        </CardContent>
        <DialogActions>
           { selectedExercise != exercise.exerciseid ?
                <Button onClick={onClick} color="primary" variant='contained'>
                    Add Exercise
                </Button>
                :
                <Button onClick={onClick} color="secondary">
                    Selected
                </Button>
            }
        </DialogActions>
      </Card>
    );
  };



const AddExerciseModal = ({ open, onClose, exerciseList, onAdd }: {open:boolean, onClose: () => void, exerciseList: any, onAdd: (exerciseData: any) => void}) => {
    const [selectedExercise, setSelectedExercise] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [startWeek, setStartWeek] = useState('1');
  
    const handleAddExercise = () => {
      // Validate input fields
      if (selectedExercise === '' || reps === '' || weight === '' || startWeek === '') {
        alert('Please fill all fields');
        return;
      }
  
      // Call onAdd prop with the new exercise data
      onAdd({
        exerciseId: selectedExercise,
        reps,
        weight,
        startWeek,
      });
  
      // Reset input fields
      setSelectedExercise('');
      setReps('');
      setWeight('');
      setStartWeek('');
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Exercise</DialogTitle>
        <DialogContent>
            <Grid container spacing={2}>
            {exerciseList.map((exercise) => (
                <Grid item xs={12} sm={6} key={exercise.exerciseid}>
                <ExerciseOptionCard onClick={() => setSelectedExercise(exercise.exerciseid)} exercise={exercise} selectedExercise={selectedExercise} />
                </Grid>
            ))}
            </Grid>
          <TextField
            margin="normal"
            label="Reps"
            fullWidth
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Weight (lbs)"
            fullWidth
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <TextField
              margin="dense"
              id="startWeek"
              label="Start Week"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startWeek}
              onChange={(e) => setStartWeek(e.target.value)}
              required = {true}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddExercise} color="primary">
            Add Exercise
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  