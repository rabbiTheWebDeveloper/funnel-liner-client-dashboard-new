import { Box, Button, Container, Grid, Pagination } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../../hook/useToast";
import { handleGetSupportTicketList, headers, userId } from "../../pages/api";
import { styled } from "@mui/material/styles";

import useLoading from '../../hook/useLoading';
import HeaderDescription from "../Common/HeaderDescription/HeaderDescription";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";


const Paginator = styled(Pagination)({
    "& .MuiPagination-ul": {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        marginTop: "10px",
    },
});

const SupportTicket = () => {
    const showToast = useToast()
    const [isLoading, startLoading, stopLoading] = useLoading();
    // Filter
    const [update, setUpdate] = useState({});
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [merchant, setMerchant] = useState({});
    const [previewPicture, setPreviewPicture] = useState('');
    const [attachFile, setAttachFile] = useState();
    const [ticketList, setTicketList] = useState([]);
    // Dropdown
    useEffect(() => {
        const parseData = JSON.parse(localStorage.getItem("user"));
        setMerchant(parseData);
    }, []);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const onChangePicture = e => {
        setAttachFile(e.target.files[0])
        setPreviewPicture(URL.createObjectURL(e.target.files[0]));
    };
    const handleCreateSupportTicket = (data) => {
        startLoading()
        const formData = new FormData();
        formData.append("merchant_id", userId);
        formData.append("subject", data.ticketSubject);
        formData.append("content", data.msgContent);
        if (attachFile) {
            formData.append("attachment", selectedImage);
        }
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/client/support-ticket/store`, formData, {
                headers: headers,
            })
            .then(function (response) {
                stopLoading()
                if (response.status === 200) {
                    setUpdate(response);
                    showToast("Ticket send success", "success")
                    reset();
                    setImageUrl(null)
                }
                else {
                    showToast("Something went wrong", "error")
                }
            })
            .catch(function (error) {
                stopLoading()
                showToast("Something went wrong", "error")
            });
    };


    //all supports ticket

    const hanldeGetData = () => {
        handleGetSupportTicketList(userId).then((result) => {
            setTicketList(result?.data?.data);
            setTotalPage(result.data?.last_page);
        });
    };

    const handleFetchOrderGlobalSearch = useCallback(async () => {
        try {
            const params = {
                page: currentPage,
              }
            const result = await axios.post(`${API_ENDPOINTS.BASE_URL}/client/support-ticket/list`,{merchant_id: userId}, {
                headers: headers,
                params
            });
            // setOrders(OrderGlobalSearchResponse?.data?.data);
            setTicketList(result?.data?.data);
            setTotalPage(result.data?.last_page);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            // setApiResponse(true);
        }
    }, [currentPage]);

    useEffect(() => {
        handleFetchOrderGlobalSearch();
    }, [handleFetchOrderGlobalSearch]);
    const handleChange = (event, value) => {
        setCurrentPage(value);
        // setCount(1);
    };


    useEffect(() => {
        if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
        }
    }, [selectedImage]);
    return (
        <>

            {/* Select Sender ID */}
            <section className='SupportTicket'>

                {/* header */}
                <HeaderDescription videoLink={
                    {
                        video: "https://www.youtube.com/embed/ySt85XtjlOc?si=lNTaxG1xWgpryNhJ",
                        title: "An in depth guideline of our online support ticketing system । Funnel Liner"
                    }} order={false} headerIcon={'flaticon-customer-support'} title={'Support Ticket'} subTitle={'Support tickets for instant help'} search={false} />

                <Container maxWidth='sm'>
                    <Grid Container spacing={3}>
                        <Grid item xs={12}>
                            <form onSubmit={handleSubmit(handleCreateSupportTicket)}>

                                <div className='SupportTicketItem boxShadow'>

                                    <div className='customInput'>
                                        <label>Ticket Subject  <span>*</span></label>
                                        <input type="text" {...register("ticketSubject", { required: true, minLength: 6, })} />
                                        {errors.ticketSubject && (
                                            <p className="error">
                                                The subject must be at least 6 characters
                                            </p>
                                        )}
                                    </div>

                                    <div className='customInput'>
                                        <label>Ticket Details <span>*</span></label>
                                        <textarea name="" rows="5" {...register("msgContent", { required: true, minLength: 10, })} placeholder="Enter your SMS body here">

                                        </textarea>
                                        {errors.msgContent && (
                                            <p className="error">
                                                SMS Content must be at least 10 characters
                                            </p>
                                        )}
                                    </div>

                                    <div className='customInput'>
                                        <label>Attach File (Optional)</label>
                                        <p>Image must be a file of type: png, jpg, jpeg</p>
                                        <div className="imgUploader">
                                            <input
                                                accept="image/*"
                                                type="file"
                                                id="select-image"
                                                style={{ display: "none" }}
                                                onChange={(e) => setSelectedImage(e.target.files[0])}
                                            />

                                            <label htmlFor="select-image">
                                                <Button className="SelectImgButton" variant="contained" color="primary" component="span">
                                                    Upload Image
                                                </Button>
                                            </label>
                                            {imageUrl && selectedImage && (
                                                <Box mt={2} textAlign="center">
                                                    <img src={imageUrl} alt={selectedImage.name} height="100px" />
                                                </Box>
                                            )}
                                        </div>

                                    </div>

                                    <div className="duelButton">
                                        <Button disabled={isLoading} type="submit">Submit</Button>
                                        <Button type="reset" className="red">Reset</Button>
                                    </div>
                                </div>
                            </form>
                        </Grid>
                    </Grid>
                </Container>
            </section>


            <section className='TopSellingProducts DashboardSetting Order SupportTicketSection'>

                {/* header */}
                <HeaderDescription videoLink={
                    {
                        video: "https://www.youtube.com/embed/ySt85XtjlOc?si=lNTaxG1xWgpryNhJ",
                        title: "An in depth guideline of our online support ticketing system । Funnel Liner"
                    }} order={false} headerIcon={'flaticon-customer-service'} title={'Your All Support Tickets'} subTitle={'List of tickets opened by you'} search={false} />

                <Container maxWidth='sm'>

                    {/* Table */}

                    <div className='DashboardSettingTabs WebsiteSettingPage'>
                        <div className='Pending'>
                            <div className='Table'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>SL</th>
                                            <th>Ticket No.</th>
                                            <th>Subject For Ticket</th>
                                            <th>Submission Time</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {/* item */}
                                        {ticketList && ticketList?.reverse()?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>     {index + 1 + currentPage * 10 - 10}</td>
                                                    <td>{item?.ticket_id}</td>
                                                    <td

                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <Link
                                                            href={`support-ticket/${item?.id}`}
                                                            style={{ color: "#894bca", fontWeight: "bold" }}
                                                        >
                                                            {" "}
                                                            {item?.subject}
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        {item?.created_at}
                                                    </td>
                                                    <td >{item?.status}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                <Paginator
                                    count={totalPage}
                                    page={currentPage}
                                    onChange={handleChange}
                                    showFirstButton
                                    showLastButton
                                    variant="outlined"
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
};

export default SupportTicket;
