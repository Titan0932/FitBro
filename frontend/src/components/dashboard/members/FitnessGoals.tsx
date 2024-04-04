


import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField, Card, CardContent, CardHeader, Checkbox, Divider, Grid, IconButton, Typography
} from '@mui/material';
import { UserContext } from "@/contexts/user-context"

import { CheckCircle as CompletedIcon, RadioButton as ToDoIcon, PlusCircle as AddIcon } from "@phosphor-icons/react";

const axios = require('axios');


interface onAddProps {
  goalTitle: string;
  description: string;
  goalValue: string;
  targetDate: string;
}

const AddFitnessGoalModal = ({ open, onClose, onAdd } : {open: boolean, onClose: () => void, onAdd: (newGoalData:onAddProps) => void}) => {
  const [goalTitle, setGoalTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalValue, setGoalValue] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleAddGoal = () => {
    // Validate input fields
    if (goalTitle.trim() === '' || description.trim() === '' || goalValue.trim() === '' || targetDate.trim() === '') {
      alert('Please fill all fields');
      return;
    }

    // Call onAdd prop with the new goal data
    onAdd({
      goalTitle,
      description,
      goalValue,
      targetDate,
    });

    // Reset input fields
    setGoalTitle('');
    setDescription('');
    setGoalValue('');
    setTargetDate('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Fitness Goal</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter details for your new fitness goal.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Goal Title"
          fullWidth
          value={goalTitle}
          onChange={(e) => setGoalTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Target Value"
          fullWidth
          value={goalValue}
          onChange={(e) => setGoalValue(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Target Date"
          fullWidth
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleAddGoal} color="primary">
          Add Goal
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export const  FitnessGoals = () =>{
    const user = React.useContext(UserContext)
    const [goals, setGoals] = React.useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleAddGoal = async (newGoalData: onAddProps) => {
        // Logic to add the new goal data
        console.log('New Goal Data:', newGoalData);
        const apiConfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3005/members/addFitnessGoal',
            data: `memberid=${user?.user?.userid}&goal_title=${newGoalData.goalTitle}&goal_description=${newGoalData.description}&goal_value=${newGoalData.goalValue}&target_date=${newGoalData.targetDate}`,
            headers: { Authorization: 'Bearer ' + localStorage.getItem('custom-auth-token') }
        }
        await axios.request(apiConfig)
            .then((response: any) => {
                console.log(response.data)
                handleModalClose()
                getGoals()
            })
            .catch((error: any) => {
                console.log("Error: ", error)
                alert(error?.response?.data ?? error.message)
            })
    };


    const getGoals = async () => {
        const apiConfig = {
            method: "get",
            maxBodyLength: Infinity,
            url: "http://localhost:3005/members/getFitnessGoals/all",
            params: {
                memberid: user?.user?.userid
            },
            headers: { Authorization: 'Bearer ' + localStorage.getItem('custom-auth-token') }
        }
        await axios.request(apiConfig)
        .then((response: any) => {
            // console.log(response.data)
            setGoals(response.data)
        })
        .catch((error: any) => {
            console.log("Error: ", error)
            // alert(error?.response?.data ?? error.message)
        })
    } 

    React.useEffect(() => {
        getGoals()
    },[])


    const handleStatusChange = async (goalId: number, newStatus: string) => {
        // Implement logic to update the status of the goal with ID `goalId` to `newStatus`
        console.log(`Goal ${goalId} status changed to ${newStatus}`);
        const data = `goalid=${goalId}&status=${newStatus}&memberid=${user?.user?.userid}&completeDate=${newStatus === 'completed' ? `${new Date().toISOString().split('T')[0]}` : ''}`
        const apiConfig = {
            method: 'put',
            maxBodyLength: Infinity,
            url: 'http://localhost:3005/members/updateFitnessGoal',
            data: data,
            headers: { Authorization: 'Bearer ' + localStorage.getItem('custom-auth-token') }
        };
        return await axios.request(apiConfig)
            .then((response: any) => {
                console.log(response.data)
                if(response.data.length == 0){
                    return false
                }
                getGoals()
                return true
            })
            .catch((error: any) => {
                console.log("Error: ", error);
                alert(error?.response?.data ?? error.message);
                return false;
            })
    }

    return (
        <>  
            <h1 style ={{display: "flex", alignItems: "center", gap: "5px"}}>
                Fitness Goals
                <IconButton color='primary' onClick={handleModalOpen}> <AddIcon /> </IconButton>
            </h1>
            <AddFitnessGoalModal open={isModalOpen} onClose={handleModalClose} onAdd={handleAddGoal} />
            {  
              goals.length == 0 ?
                <Typography variant="h6" color="textSecondary">No fitness goals added yet. Click on the + icon to add a new goal.</Typography>
              :
              <Grid container spacing={2}>
                  {goals.map((goal) => (
                      <GoalCard key={goal.goalid} goal={goal} onStatusChange={handleStatusChange} />
                  ))}
              </Grid>
            }
        </>
    );
}

const GoalCard = ({ goal, onStatusChange, key } : {goal: any, onStatusChange: (goalId: number, newStatus: string) => boolean, key: number}) => {
    const [checked, setChecked] = React.useState(goal.status === 'completed');
  
    const handleChange = async () => {
      const newStatus = checked ? 'incomplete' : 'completed';
      let updated: boolean = await onStatusChange(goal.goalid, newStatus);
      if(updated) setChecked(!checked);
    };
  
    return (
      <Grid item xs={12} sm={6} md={4} key={key} >
        <Card variant="outlined">
            <CardHeader title={goal.goal_title} />
            <Divider />
          <CardContent>
            <Typography variant="body1">
              {goal.goal_description}
            </Typography>
            <Typography variant="body1">
              <strong>Target Goal:</strong> {goal.goal_value}
            </Typography>
            <Typography variant="body1">
              <strong>Target Date:</strong> {goal.target_date}
            </Typography>
            <Typography variant="body1">
              { goal.achieved_date && (<><strong>Achieved Date:</strong> {goal.achieved_date}</>)}
            </Typography>
            <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}>
              <strong>Status:</strong>
              <IconButton color={checked? "primary" :  "warning"} onClick={handleChange} sx={{ ml: 1}}>
                {checked ? <CompletedIcon color="green" /> : <ToDoIcon color="red" />}
              </IconButton>
              {checked ? <Typography color={"primary"}> Completed </Typography>: <Typography color={"error"}> Incomplete</Typography>}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };
