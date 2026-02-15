import { Container, Grid } from '@mui/material'
import React from 'react'

const Footer = () => {

    return (

        <>

            <footer className='Footer boxShadow'>

                <Container>

                    <Grid container spacing={2}>

                        <Grid item xs={12}>

                            <p> <img src="/images/light-logo.png" alt="" /> Version-1.3 </p>

                        </Grid>

                    </Grid>

                </Container>

            </footer>

            

        </>

    )
}

export default Footer
