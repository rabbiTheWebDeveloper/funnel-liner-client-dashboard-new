import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Container, Grid, Tab } from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react';

import { domain } from '../../pages/api';


const NoticeBoard = ({ busInfo }) => {
    // Tabs
    const [value, setValue] = useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    // doment notice 
    const { domain_status, domain_request } = busInfo;
    return (
        <>
            <section className='NoticeBoard'>

                <Container maxWidth="sm">

                    <Grid container spacing={3}>

                        <Grid item xs={12} sm={8} md={8}>

                            <div className="NoticeBoardImg">
                                <Link href=''><img src="/images/NoticeBoard.jpg" alt="" /> </Link>
                            </div>

                        </Grid>

                        <Grid item xs={12} sm={4} md={4}>

                            <div className="NoticeBoardContent bosShadow commonCart cart-1">

                                <h4 className='d_flex'> <i className='flaticon-product-promotion'></i> Notice Board</h4>

                                {/* NoticeBoardTabs */}
                                <div className="NoticeBoardTabs">

                                    <Box sx={{ width: '100%', typography: 'body1' }}>

                                        <TabContext value={value}>

                                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                                    <Tab label="New" value="1" />
                                                    <Tab label="All" value="2" />
                                                </TabList>
                                            </Box>

                                            <TabPanel value="1">

                                                {/* item */}
                                                <div className="TabsItem bg">

                                                    {
                                                        domain_status === "connected" &&
                                                        <>
                                                            <h5>  Your Custom domain add successfully .Now Link Is Ready!
                                                                <a target="_blank"
                                                                    href={`https://${domain_request}`}
                                                                    rel="noopener noreferrer">
                                                                    {domain_request}
                                                                </a>
                                                            </h5>
                                                        </>
                                                    }

                                                    <h5> Your Website Link Is Ready!
                                                        <a target="_blank"
                                                            href={`https://funnelliner.com/${domain}`}
                                                            rel="noopener noreferrer">
                                                            https://funnelliner.com/{domain}
                                                        </a>
                                                    </h5>

                                                </div>



                                            </TabPanel>

                                            <TabPanel value="2">

                                                {/* item */}
                                                <div className="TabsItem bg">
                                                    {
                                                        domain_status === "connected" &&
                                                        <>
                                                            <h5>  Your Custom domain add successfully .Now Link Is Ready!
                                                                <a target="_blank"
                                                                    href={`https://${domain_request}`}
                                                                    rel="noopener noreferrer">
                                                                    {domain_request}
                                                                </a>
                                                            </h5>
                                                        </>
                                                    }
                                                    <h5> Your Website Link Is Ready !
                                                        <a target="_blank" href={`https://funnelliner.com/${domain}`}
                                                            rel="noopener noreferrer">
                                                            https://funnelliner.com/{domain}
                                                        </a>

                                                    </h5>

                                                </div>
                                            </TabPanel>

                                        </TabContext>

                                    </Box>

                                </div>


                            </div>

                        </Grid>

                    </Grid>

                </Container>

            </section>

        </>

    )

}

export default NoticeBoard