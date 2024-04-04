import React from "react"

import { FitnessGoals } from "@/components/dashboard/members/FitnessGoals"
import { Divider } from "@mui/material";
import { ExcerciseRoutines } from "./ExerciseRoutines";
import { HealthMetrics } from "./HealthMetrics";

const axios = require('axios');

export const MemberDashboard = () => {
    return(
        <>
            <FitnessGoals />
            <br /><Divider /> 
            <br />
            <ExcerciseRoutines />
            <br /><Divider /> 
            <br />
            <HealthMetrics />
        </>
    )
}


