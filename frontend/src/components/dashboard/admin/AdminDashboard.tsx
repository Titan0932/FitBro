import { Grid, Card, CardContent, CardHeader, Typography, Chip, Divider, Box, Switch, Tooltip, IconButton, Button } from '@mui/material';
import React from 'react';
import { Person as PersonIcon, ChalkboardSimple as ClassIcon, CalendarCheck as ScheduleIcon, CreditCard as PaymentIcon, CalendarX as EventIcon, HandCoins as RefundIcon } from '@phosphor-icons/react';

const axios = require('axios');


export const AdminDashboard = () => {
    const [invoices, setInvoices] = React.useState<any | null>([]);

    const getInvoiceHistory = async () => {
        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            url: 'http://localhost:3005/admin/getAllInvoices',
            headers: {Authorization: 'Bearer ' + localStorage.getItem('custom-auth-token')}
        }

        await axios.request(apiConfig)
                    .then((response: any) => {
                        console.log(response.data)
                        setInvoices(response.data)
                    })
    }

    React.useEffect(() => {
        getInvoiceHistory();
    },[])

    const handleRefund = async (invoice: any) => {
        console.log('Refund issued: ', invoice);
        if(invoice.paymentStatus == 'paid'){
            const apiConfig = {
                method: 'post',
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
                url: 'http://localhost:3005/admin/refundInvoice',
                headers: {Authorization: 'Bearer ' + localStorage.getItem('custom-auth-token')},
                data: `invoiceid=${invoice?.invoiceid}`
            }
    
            await axios.request(apiConfig)
                        .then((response: any) => {
                            console.log(response.data)
                            alert('Refund issued successfully');
                            getInvoiceHistory();
                        })
                        .catch((error: any) => {
                            console.log(error)
                            alert(error?.response?.data || error?.message || 'An error occurred')
                            return;
                        })
        }
    }


    return(
        <>
            <h1>Invoice History</h1>

            <Grid container spacing={3}>
                {invoices?.map((invoice:any) => (
                    <Grid item xs={12} sm={6} md={4} key={invoice?.invoiceid}>
                        <Card>
        <CardHeader
          title={`Invoice #${invoice?.invoiceid}`}
          subheader={<>Amount: <Box component='span' color='info.main'>${invoice?.amount} </Box> | Date Paid: {invoice?.paymentDate}</>}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <PersonIcon /> {invoice?.member_fname} {invoice?.member_lname}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <ClassIcon /> {invoice?.className}
              </Typography>
            </Grid>
            <Grid container item xs={12} width={"100%"} >
                <Grid item sx={{display: "flex", borderRight: "1px solid gray", paddingX: "0.5rem"}}>
                    <Typography variant="subtitle1">
                        <ScheduleIcon /> {invoice?.scheduleDate}
                    </Typography>
                </Grid>
                <Grid item sx={{display: "flex", borderRight: "1px solid gray", paddingX: "0.5rem"}}>
                    <Typography variant="subtitle1">
                        {invoice?.start_time}
                    </Typography>
                </Grid>
                <Grid item sx={{display: "flex", paddingX: "0.5rem"}}>
                    <Typography variant="subtitle1">
                        {invoice?.duration} hours
                    </Typography>
                </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <PaymentIcon /> Payment: 
                <Chip
                    label={invoice.paymentStatus}
                    color={invoice.paymentStatus === 'paid' ? 'success' : 'error'}
                    variant="outlined"
                    size="small"
                    style={{ marginLeft: '8px' }}
                /> &nbsp; 

                {invoice.paymentStatus === 'paid' && (
                    <Tooltip title="Issue Refund">
                        <IconButton
                            color="primary"
                            aria-label="issue refund"
                            onClick={() => handleRefund(invoice)}
                        >
                            <RefundIcon  />
                        </IconButton>
                    </Tooltip>
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <EventIcon /> Schedule Status: <Chip label={invoice?.scheduleStatus} color={invoice?.scheduleStatus === "CONFIRMED" ? 'success' : 'error'} />
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}