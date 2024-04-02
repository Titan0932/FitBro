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

export interface Equipment {
  equipmentid: string;
  name: string;
  status: string;
}

interface EquipmentTableProps {
  rows?: Equipment[];
}

export function EquipmentTable({
  rows = [],
}: EquipmentTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((equipment) => equipment.equipmentid);
  }, [rows]);

  return (
    <Card>
      <CardHeader title="Equipments" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Equipment Name</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              
              return (
                <TableRow hover key={row.equipmentid} >
                    <TableCell>
                      <Typography variant="subtitle2">{row.equipmentid}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={row.status} color={row.status == 'working' ? 'success' : 'error'} />
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

