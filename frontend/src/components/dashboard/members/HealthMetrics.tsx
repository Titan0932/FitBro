import { UserContext } from '@/contexts/user-context';
import { Button, Grid, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, {useState, useEffect, useContext} from 'react'


const axios = require('axios');

export const HealthMetrics = () => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const user = useContext(UserContext);
    const router = useRouter();
    
    const getHealthMetrics = async () => {
        const config = {
            method: 'get',
            url: 'http://localhost:3005/members/getHealthMetrics',
            headers: {Authorization: 'Bearer ' + localStorage.getItem('custom-auth-token')},
            params: {memberid: user?.user?.userid}
        }
        await axios.request(config)
            .then((response: any) => {
                // console.log("Health Metrics: ", JSON.stringify(response.data));
                setWeight(response.data[0].weight);
                setHeight(response.data[0].height);
            })
            .catch((error: any) => {
                console.log("Error: ", error);
                alert("Error: " + error?.response?.data?.message ?? error.message)
            });
        router.refresh();
    }

    useEffect(() => {
        getHealthMetrics();
    }, []);


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // Update health metrics string with new weight and height values
        const newHealthMetrics = `weight= ${weight}&height=${height}&memberid=${user?.user?.userid}`;
        console.log("New Health Metrics: ", newHealthMetrics);
        const config = {
            method: 'put',
            url: 'http://localhost:3005/members/updateHealthMetrics',
            headers: {Authorization: 'Bearer ' + localStorage.getItem('custom-auth-token')},
            data: newHealthMetrics
        }
        await axios.request(config)
                .then((response: any) => {
                    console.log("Health Metrics updated: ", JSON.stringify(response.data));
                })
                .catch((error: any) => {
                    console.log("Error: ", error);
                    alert("Error: " + error?.response?.data?.message ?? error.message)
                })
      };

    return(
        <div>
            <h1>My Health Metrics</h1>
            <form onSubmit={handleSubmit} >
                <Grid container gap={3}>
                    <TextField
                        label="Weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        defaultValue={weight}
                        fullWidth
                    />
                    <TextField
                        label="Height"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        defaultValue={height}
                        fullWidth
                    />
                    <Button type="submit" variant="contained" color="primary">Update</Button>
                </Grid>
            </form>
        </div>
    )

}