import { Skeleton } from '@mui/material';
import React from 'react';

const TableSkeletor = ({ tableRowLength }) => {

    const skeletorLength = new Array(tableRowLength).fill(null);
    return (
        <>
            
           
            <tr>
                {
                    skeletorLength?.map((item, index) => <td key={index}>
                        <Skeleton animation="wave" variant="text" />
                    </td>)
                }

            </tr>
            <tr>
                {
                    skeletorLength?.map((item, index) => <td key={index}>
                        <Skeleton animation="wave" variant="text" />
                    </td>)
                }

            </tr>
            <tr>
                {
                    skeletorLength?.map((item, index) => <td key={index}>
                        <Skeleton animation="wave" variant="text" />
                    </td>)
                }

            </tr>
            <tr>
                {
                    skeletorLength?.map((item, index) => <td key={index}>
                        <Skeleton animation="wave" variant="text" />
                    </td>)
                }

            </tr>
            <tr>
                {
                    skeletorLength?.map((item, index) => <td key={index}>
                        <Skeleton animation="wave" variant="text" />
                    </td>)
                }

            </tr>
            <tr>
                {
                    skeletorLength?.map((item, index) => <td key={index}>
                        <Skeleton animation="wave" variant="text" />
                    </td>)
                }

            </tr>
            <tr>
                {
                    skeletorLength?.map((item, index) => <td key={index}>
                        <Skeleton animation="wave" variant="text" />
                    </td>)
                }

            </tr>
            <tr>
                {
                    skeletorLength?.map((item, index) => <td key={index}>
                        <Skeleton animation="wave" variant="text" />
                    </td>)
                }

            </tr>
            <tr>
                {
                    skeletorLength?.map((item, index) => <td key={index}>
                        <Skeleton animation="wave" variant="text" />
                    </td>)
                }

            </tr>
            <tr>
                {
                    skeletorLength?.map((item, index) => <td key={index}>
                        <Skeleton animation="wave" variant="text" />
                    </td>)
                }

            </tr>
            <tr>
                {
                    skeletorLength?.map((item, index) => <td key={index}>
                        <Skeleton animation="wave" variant="text" />
                    </td>)
                }

            </tr>
            <tr>
                {
                    skeletorLength?.map((item, index) => <td key={index}>
                        <Skeleton animation="wave" variant="text" />
                    </td>)
                }

            </tr>

        </>
    );
};

export default TableSkeletor;