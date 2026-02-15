import { Box, Button, Container, Grid, } from "@mui/material";
import Modal from "@mui/material/Modal";
import Cookies from "js-cookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import HeaderDescription from "../../../../Components/Common/HeaderDescription/HeaderDescription";
import { domain, merchantThemeList } from "../../../../pages/api";

const MyMultiWebsite = () => {
    const [openPreview, setOpenPreview] = useState(false);
    const handlePreview = () => setOpenPreview(true);
    const previewClose = () => setOpenPreview(false);
    const [isImportedTheme, setIsImportedTheme] = useState(false);


    const [multiPageTemplate, setMultiPageTemplate] = useState([]);
    useEffect(() => {
        merchantThemeList("multiple").then((result) => {
            setMultiPageTemplate(result?.data?.data);
            if (result?.data?.data.length === 0) {
                setIsImportedTheme(true);
            }
        });
    }, []);
    const domain_request = Cookies.get('domain_request')
    return (
        <>
            <section className='TopSellingProducts DashboardSetting LandingWebsite'>

                {/* header */}
                <HeaderDescription headerIcon={'flaticon-website-design'} title={'My Multipage Template'} subTitle={'choose your theme here and customize as you want'} search={false}  order={false} />

                <Container maxWidth='sm'>
                    <Grid Container spacing={3}>

                        {/* LandingWebsite */}
                        <div className='LandingWebsiteContent'>

                            {
                                isImportedTheme === true && <div style={{textAlign: "center", marginTop: "100px"}}>
                                    <p style={{marginBottom: "20px"}}>You Didn’t Import Any Multipage website Right Now.
                                        Please Choice Your Multipage Theme & Import It.</p>
                                    <Link href='/multi-page'>
                                        {" "}
                                        {/* <Button>Primary</Button> */}
                                        <Button style={{background: "#1565C0", color: "white"}} variant='contained'>Import
                                            Theme</Button>
                                    </Link>
                                </div>
                            }

                            <div className='InvoiceFormate'>
                                <Grid container spacing={3}>
                                    {Array.isArray(multiPageTemplate)
                                        ? multiPageTemplate?.map((item, index) => {
                                            return (
                                                <Grid key={index} item xs={4}>
                                                    <div className='InvoiceFormateItem'>
                                                        <div className='img'>
                                                            <img src={item.media.name} alt=''/>
                                                        </div>

                                                        <div className='DuelButton d_flex d_justify'>
                                                            <div className='left'>
                                                                <Button>
                                                                    <Link
                                                                        target='_blank'
                                                                        href={domain_request != 'null'? `https://${domain_request}`: `https://funnelliner.com/${domain}`}

                                                                        rel='noopener noreferrer'
                                                                    >
                                                                       View Preview
                                                                    </Link>
                                                                </Button>
                                                                <Modal
                                                                    open={openPreview}
                                                                    onClose={previewClose}
                                                                    aria-labelledby='modal-modal-title'
                                                                    aria-describedby='modal-modal-description'
                                                                >
                                                                    <Box>
                                                                        <div className='InvoiceModal'>
                                                                            <img src={item.media.name} alt=''/>
                                                                        </div>
                                                                    </Box>
                                                                </Modal>
                                                            </div>

                                                            <div className='right'>
                                                                <Button Id={item.id}>
                                                                    <Link
                                                                        target='_blank'
                                                                        href={domain_request != 'null'? `https://${domain_request}`: `https://funnelliner.com/${domain}`}
                                                                        rel='noopener noreferrer'
                                                                    >
                                                                        edit
                                                                    </Link>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Grid>
                                            );
                                        })
                                        : null}
                                </Grid>
                            </div>
                        </div>
                    </Grid>
                </Container>
            </section>
        </>
    );
};

export default MyMultiWebsite;
