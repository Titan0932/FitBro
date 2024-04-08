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
import { CardHeader, Chip, FormControlLabel, Grid, Switch } from '@mui/material';

export interface Room {
  roomid: string;
  name: string;
  status: string;
}

interface RoomTableProps {
  rows?: Room[];
  onUpdateStatus: (roomid: string, newStatus: string) => void;
}

const StatusToggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={onChange} color={checked? 'success' : 'error'} />}
      label={<Typography variant="body2">{checked ? 'AVAILABLE' : 'UNAVAILABLE'}</Typography>}
    />
  );
};

export function RoomTable({
  rows = [],
  onUpdateStatus,
}: RoomTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((room) => room.roomid);
  }, [rows]);

  const handleToggle = (roomid: string, currentStatus: string) => {
    const newStatus = currentStatus === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
    onUpdateStatus(roomid, newStatus);
  };

  return (
    <Card>
      <CardHeader title="Rooms" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Room Name</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              
              return (
                <TableRow hover key={row.roomid} >
                    <TableCell>
                      <Typography variant="subtitle2">{row.roomid}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </TableCell>
                    <TableCell>
                    <StatusToggle
                      checked={row.status == 'AVAILABLE'}
                      onChange={() => handleToggle(row.roomid, row.status)}
                    />
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

