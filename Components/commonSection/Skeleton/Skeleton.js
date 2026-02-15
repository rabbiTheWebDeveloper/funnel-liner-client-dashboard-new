import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import React from 'react';

function Skeletor() {
    return (
        <>
            <Stack spacing={1}>
                <Skeleton variant="rectangular" width={500} height={40} />
                <Skeleton variant="rounded" width={500} height={40} />
                <Skeleton variant="rectangular" width={500} height={40} />
                <Skeleton variant="rounded" width={500} height={40} />
                <Skeleton variant="rectangular" width={500} height={40} />
                <Skeleton variant="rounded" width={500} height={40} />
            </Stack>
        </>
    )
}

export default Skeletor