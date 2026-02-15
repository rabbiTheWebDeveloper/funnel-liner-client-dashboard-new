import { Container, Grid } from '@mui/material';
import React from 'react';
import { BsPlug } from 'react-icons/bs';
import SignIn from '../../Components/BkashMarcent/SignIn';
import withAuth from '../../hook/PrivateRoute';


const Plugin = () => {

    




    return (

        <>

            <section className='TopSellingProducts DashboardSetting'>

                <Container maxWidth="sm">


                    <div className="AddonsContent">

                        <Grid container spacing={3}>

                            <Grid item md={12}>

                               <SignIn></SignIn>

                            </Grid>

                        </Grid>

                    </div>

                </Container>

            </section>

        </>

    )

}

export default withAuth(Plugin, {
    isProtectedRoute: true
});