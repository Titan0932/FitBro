import * as React from 'react';
import type { Metadata } from 'next';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';

export const metadata = { title: `Trainer Schedule | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <>
    <h1>Trainer Schedule</h1>
    </>
  );
}
