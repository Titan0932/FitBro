'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { UserContext } from '@/contexts/user-context';
import { FormHelperText } from '@mui/material';
import { useRouter } from 'next/navigation';

const schema = zod.object({
  f_name: zod.string().min(1, { message: 'First name is required' }),
  l_name: zod.string().min(1, { message: 'Last name is required' }),
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  
  phoneno: zod.string().optional(), // zod.string().optional().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  city: zod.string().optional(),
  state: zod.string().optional(),
  country: zod.string().optional(),
});

type Values = zod.infer<typeof schema>;

const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
] as const;

const axios = require('axios');

export function AccountDetailsForm(): React.JSX.Element {
  const user = React.useContext(UserContext);
  console.log(user)
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ defaultValues: user?.user ?? {}, resolver: zodResolver(schema) });

  const onSubmit = async (values:Values) => {
    setIsPending(true);
    console.log("submittinggg -> ", values)
    if(
      values.f_name === user?.user?.f_name &&
      values.l_name === user?.user?.l_name &&
      values.phoneno === user?.user?.phoneno &&
      values.city === user?.user?.city &&
      values.state === user?.user?.state &&
      values.country === user?.user?.country
    ){
      setIsPending(false);
      alert("No changes made");
      return;
    }else{
      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: 'http://localhost:3005/users/updateUserInfo',
        data: `f_name=${values.f_name}&l_name=${values.l_name}&email=${values.email}&phoneno=${values.phoneno}&city=${values.city}&state=${values.state}&country=${values.country}`,
        headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
      };
      await axios.request(config)
      .then(async (response:any) => {
        if(response){
          console.log("Updated user info: ", response.data);
          user?.setState((prev) => ({ ...prev, user: values }));
          alert("User info updated successfully");
        }
      })
      .catch((error:any) => {
        console.log("Error: ", error);
        alert(error?.response?.data ?? error.message)
      })
      setIsPending(false);
      router.refresh();
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name="f_name"
                render={({ field }) => (
                  <FormControl fullWidth required error={Boolean(errors.f_name)}>
                    <InputLabel>First name</InputLabel>
                    <OutlinedInput {...field} defaultValue={user?.user?.f_name} label="First name" name="firstName" />
                    {errors.f_name ? <FormHelperText>{errors.f_name.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name="l_name"
                render={({ field }) => (
                  <FormControl fullWidth required error={Boolean(errors.l_name)}>
                    <InputLabel>Last name</InputLabel>
                    <OutlinedInput {...field} defaultValue={user?.user?.l_name} label="Last name" name="lastName" />
                    {errors.l_name ? <FormHelperText>{errors.l_name.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name="phoneno"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Phone number</InputLabel>
                    <OutlinedInput {...field} defaultValue={user?.user?.phoneno ?? ''} label="Phone number" name="phone" type="tel" />
                    {errors.phoneno ? <FormHelperText>{errors.phoneno.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>State</InputLabel>
                    <Select {...field} defaultValue={user?.user?.state ?? ''} label="State" name="state" variant="outlined">
                      {states.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.state ? <FormHelperText>{errors.state.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>City</InputLabel>
                    <OutlinedInput {...field} defaultValue={user?.user?.city?? ''} label="City" />
                    {errors.city ? <FormHelperText>{errors.city.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <OutlinedInput {...field} defaultValue={user?.user?.country ?? ''} label="Country" />
                    {errors.country ? <FormHelperText>{errors.country.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button disabled={isPending} type="submit" variant="contained">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
