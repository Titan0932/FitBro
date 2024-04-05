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

export interface Member {
  memberid: string;
  avatar?: string;
  user_fname: string;
  user_lname: string;
  email: string;
  // address: { city: string; state: string; country: string; street: string };
  weight?: string;
  height?: string;
  dob: string;
}

interface MemberTableProps {
  rows?: Member[];
}

export function MemberTable({
  rows = [],
}: MemberTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((member) => member.memberid);
  }, [rows]);

  return (
    <Card>
      <CardHeader title="Members" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Health Metrics</TableCell>
              <TableCell>Date of Birth</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              
              return (
                <TableRow hover key={row.memberid} >
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.avatar} />
                      <Typography variant="subtitle2">{`${row.user_fname} ${row.user_lname}`}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  
                  <TableCell >
                    <Grid container spacing={1}>
                        <Grid item xs={6} md={12} gap={1} container>
                            <Chip color="primary" label={<>weight: {row.weight}kg</>} size="medium" sx={{ width: 'auto', minWidth: '110px' }} />
                            <Chip color="primary" label={<>height: {row.height}ft</>} size="medium" sx={{ width: 'auto', minWidth: '110px' }} />
                        </Grid>
                    </Grid>
                  </TableCell>
                    <TableCell>
                        {dayjs(row.dob).format('DD/MM/YYYY')}
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

