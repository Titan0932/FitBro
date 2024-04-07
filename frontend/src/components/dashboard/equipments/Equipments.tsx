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
import { CardHeader, Grid, FormControlLabel, Switch } from '@mui/material';

export interface Equipment {
  equipmentid: string;
  name: string;
  status: string;
}

interface EquipmentTableProps {
  rows?: Equipment[];
  onUpdateStatus: (equipmentId: string, newStatus: string) => void;
}

const StatusToggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={onChange} color={checked? 'success' : 'error'} />}
      label={<Typography variant="body2">{checked ? 'Working' : 'Broken'}</Typography>}
    />
  );
};

export function EquipmentTable({
  rows = [],
  onUpdateStatus,
}: EquipmentTableProps): React.JSX.Element {

  const handleToggle = (equipmentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'working' ? 'broken' : 'working';
    onUpdateStatus(equipmentId, newStatus);
  };

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
            {rows.map((row) => (
              <TableRow hover key={row.equipmentid}>
                <TableCell>
                  <Typography variant="subtitle2">{row.equipmentid}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">{row.name}</Typography>
                </TableCell>
                <TableCell>
                  <StatusToggle
                    checked={row.status == 'working'}
                    onChange={() => handleToggle(row.equipmentid, row.status)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}
