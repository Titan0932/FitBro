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
import { CardHeader, Chip, Grid } from '@mui/material';

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
}

export function TrainerTable({
  rows = [],
}: TrainerTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((trainer) => trainer.trainerid);
  }, [rows]);

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
                <TableRow hover key={row.trainerid} >
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
                      <Grid item xs={4} key={index}>
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
      
    </Card>
  );
}

