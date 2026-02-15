import { Button, Grid } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const EditUpdate = () => {
    return (
        <Grid item xs={12} sm={12} md={12}>
        <div className="CustomeInput">
            <div className="Overlay">
                <div className="Success">
                    <div className="">
                        <FiCheckCircle />
                        <h4>Your Landing page data successfully updated.</h4>
                        <p>You will receive a confirmation notification in notice board within short time </p>
                        <h4 style={{color:"red"}}>Any change please contact our customer service</h4>
                        <Button className='Edit'> <Link href='https://www.messenger.com/login.php?next=https%3A%2F%2Fwww.messenger.com%2Ft%2F101848996132146%2F%3Fmessaging_source%3Dsource%253Apages%253Amessage_shortlink%26source_id%3D1441792%26recurring_notification%3D0'>contact us</Link> </Button>
                    </div>

                </div>

            </div>
        </div>
    </Grid>
    );
};

export default EditUpdate;