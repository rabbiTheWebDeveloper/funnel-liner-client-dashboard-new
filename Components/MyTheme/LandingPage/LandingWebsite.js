import { Box, Button, Container, Grid, Pagination, Stack, TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import Clipboard from "clipboard";
import Cookies from 'js-cookie';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import { BiLinkAlt } from "react-icons/bi";
import { BsCodeSlash } from "react-icons/bs";
import Select from 'react-select';
import Swal from "sweetalert2";
import { themeUrl } from "../../../constant/constant";
import { useToast } from "../../../hook/useToast";
import { allThemeList, domain, getWebsiteSettings, headers, importLandingPage, importTheme } from "../../../pages/api";

import HeaderDescription from "../../../Components/Common/HeaderDescription/HeaderDescription";

const axios = require("axios");

const LandingWebsite = () => {
    const showToast = useToast()
    const domain_request = Cookies.get('domain_request')
    // ViewPreviewModel
    const [products, setProducts] = useState([]);

    const [product_id, setProductID] = useState()
  
    const handleChangeItem = (e) => {
        setProductID(e.value)
    }

    const [openPreview, setOpenPreview] = useState(false);
    const [landingId, setLandingId] = useState(null);

    const handlePreview = () => setOpenPreview(true);
    const previewClose = () => setOpenPreview(false);

    // OpenSales Modal
    const [openSales, setOpenSales] = useState(false);
    const handleOpenSales = (e) => {
        setLandingId(e.target.id);
        setOpenSales(true);
    };
    const handleCloseSales = () => setOpenSales(false);
    const [landingPageTemplate, setLandingPageTemplate] = useState([]);
    const [websiteSettingData, setWebsiteSettingData] = useState({});

    //This id add for custom 
    const idsToSkip = Array.from({ length: 200 }, (_, i) => (i + 206).toString());
    useEffect(() => {
        allThemeList("landing").then((result) => {
            const filteredItems = result?.data?.data.filter(item => !idsToSkip.includes(item.name));
            setLandingPageTemplate(filteredItems);
        });
        getWebsiteSettings().then((res) => {
            setWebsiteSettingData(res?.data?.data);
        });
    }, []);

    const shopName = websiteSettingData?.shop_name;
    const [pageTittle, setPageTittle] = useState();
    const [videoLink, setVideoLink] = useState("");


    const handlePageTitleChange = (e) => {
        const pageName = e.target.value;
        const page = pageName.replace(/\s/g, "-");
        setPageTittle(page.toLowerCase());
    };

    const handleVideoLink = (e) => {
        const videoLink = e.target.value;
        setVideoLink(videoLink)
    }

    const handleImportTheme = (event) => {
        if(pageTittle === undefined){
            showToast("Page title required", "error")
            return;
        }
        else if (product_id === undefined) {
            showToast("Product required", "error")
            return;
        }
        importLandingPage(pageTittle, landingId, 1, product_id, videoLink).then((res) => {
            setOpenSales(false);
            if (res.status === 200) {
                showToast('The page has been created successfully')
                importTheme("landing", landingId).then((res) => {
                });
            } else {
                Swal.fire({
                    title: "Sorry",
                    html: "The page title is already taken,<br/> Change page title and try again",
                    icon: "error",
                    confirmButtonText: "ok",
                });
            }
        });
    };
    const [mas, setMas] = useState("");

    const textToCopy = domain_request !== null ? `${themeUrl}/${domain}/p/` : `https://funnelliner.com/${domain}/p/${pageTittle}`;
    const handleCopyToClick = () => {
        const clipboard = new Clipboard(".SocialLink", {
            text: () => textToCopy,
        });

        clipboard.on("success", (e) => {
            setMas("Copied to Link!");
            e.clearSelection();
        });
        clipboard.on("error", (e) => {
        });
    };
    //product fetching and add with theme
    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/client/products-for-search", { headers: headers })
            .then(function (response) {
                if (response?.status === 200) {
                    setProducts(response.data.data);
                }
            })
            .catch(error => {
              
            })
    }, []);
    let options = products.length === 0 ? [] : products?.map(function (item) {
        return { value: item.id, label: item.product_name, };
    })
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(6);
    const indexOfLastProducts = currentPage * perPage;
    const indexOfFirstProducts = indexOfLastProducts - perPage;
    const currentProduct = landingPageTemplate.slice(
        indexOfFirstProducts,
        indexOfLastProducts
    );

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(landingPageTemplate.length / perPage); i++) {
        pageNumbers.push(i);
    }
    const paginate = (pageNumber, value) => setCurrentPage(value);
    return (
        <>
            <section className="TopSellingProducts DashboardSetting LandingWebsite">

                {/* header */}
                <HeaderDescription headerIcon={'flaticon-website-design'} title={'Landing Page Template'} subTitle={'choose your theme here and customize as you want'} search={false}  order={false} />

                <Container maxWidth="sm">

                    <Grid Container spacing={3}>

                        {/* LandingWebsite */}
                        <div className="LandingWebsiteContent">

                            <div className="InvoiceFormate">

                                <Grid container spacing={3}>
                                    {/* item */}
                                    {currentProduct?.map((item, index) => {
                                        return (
                                            <Grid item xs={4} key={index}>
                                                <div className="InvoiceFormateItem">
                                                    <div className="img">
                                                        <img src={item?.media?.name} alt="" />
                                                    </div>
                                                    <div className="img">
                                                        <h4>{item?.theme_name +"-" +  item.name}</h4>
                                                    </div>

                                                    <div className="DuelButton d_flex d_justify">

                                                        <div className='left'>
                                                            <Button>
                                                                <a target="_blank" href={item?.url}
                                                                    rel="noopener noreferrer"> View Preview</a>
                                                            </Button>
                                                            <Modal
                                                                open={openPreview}
                                                                onClose={previewClose}
                                                                aria-labelledby='modal-modal-title'
                                                                aria-describedby='modal-modal-description'
                                                            >
                                                                <Box>
                                                                    <div className='InvoiceModal'>
                                                                        <img src={item?.media?.name} alt='' />
                                                                    </div>
                                                                </Box>
                                                            </Modal>
                                                        </div>

                                                        <div className="right">
                                                            <Button
                                                                id={item.id}
                                                                className="ModalBtn"
                                                                onClick={handleOpenSales}
                                                            >
                                                                Import
                                                            </Button>

                                                            {/* modal */}
                                                            <Modal
                                                                open={openSales}
                                                                onClose={handleCloseSales}
                                                                aria-labelledby="modal-modal-title"
                                                                aria-describedby="modal-modal-description"
                                                            >
                                                                <Box>
                                                                    <div className="SalesTargetModal">
                                                                        <div className="Header d_flex">
                                                                            <div className="svg">
                                                                                <BiLinkAlt />
                                                                            </div>

                                                                            <div className="text">
                                                                                <h5>Add Page</h5>
                                                                                <p>Add pages for your website</p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="Form">
                                                                            <div className="CustomeInput">
                                                                                <label>Page Title</label>
                                                                                <TextField
                                                                                    onChange={handlePageTitleChange}
                                                                                    id="outlined-basic"
                                                                                    label="Enter page title here"
                                                                                    variant="outlined"
                                                                                />
                                                                            </div>

                                                                            <div className="CustomeInput">
                                                                                <p className="PageLink">
                                                                                    Page Link:{" "}
                                                                                    <Link
                                                                                        href=""

                                                                                        className="SocialLink"
                                                                                        alt="Copy to clipboard"
                                                                                    >
                                                                                        {textToCopy}

                                                                                        {pageTittle}
                                                                                        <AiOutlineLink
                                                                                            onClick={handleCopyToClick}
                                                                                        />{" "}
                                                                                    </Link>
                                                                                    <p>{mas}</p>
                                                                                </p>
                                                                                <div className="CustomeInput">
                                                                                    <label>
                                                                                        Product Name <span>*</span>
                                                                                    </label>
                                                                                    <div className="Dropdown">
                                                                                        {

                                                                                            products.length > 0 ?
                                                                                                <Select
                                                                                                    options={options}
                                                                                                    onChange={handleChangeItem} /> :
                                                                                                <div className="text">
                                                                                                    <Button>
                                                                                                        <Link
                                                                                                            href='/add-product'>Add
                                                                                                            Products</Link>
                                                                                                    </Button>
                                                                                                </div>
                                                                                        }
                                                                                    </div>
                                                                                </div>



                                                                                <div className="DuelButton">
                                                                                    <Button
                                                                                       
                                                                                        onClick={handleImportTheme}
                                                                                        id={item.id}
                                                                                    >
                                                                                        Publish
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Box>
                                                            </Modal>
                                                        </div>

                                                    </div>

                                                </div>

                                            </Grid>
                                        );
                                    })}
                                </Grid>

                                <div>
                                    <Box
                                        sx={{
                                            margin: "auto",
                                            width: "fit-content",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Stack spacing={2}>

                                            <Pagination
                                                count={pageNumbers.length}
                                                variant="outlined"
                                                page={currentPage}
                                                onChange={paginate}
                                            />
                                        </Stack>
                                    </Box>
                                </div>
                            </div>

                        </div>

                    </Grid>

                </Container>
            </section>
        </>
    );
};

export default LandingWebsite;
