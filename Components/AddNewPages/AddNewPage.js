import { Button, Container, Grid, TextField } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdProductionQuantityLimits } from "react-icons/md";
import Swal from "sweetalert2";
import { domain, headers, shopId, userId } from "../../pages/api";

const AddNewPage = () => {
    // Tabs
    const [value, setValue] = useState("1");
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const addPageSubmit = (data) => {
        data.user_id = userId;
        data.shop_id = shopId;
        data.status = "1";
        axios.post(process.env.NEXT_PUBLIC_API_URL + "/client/pages", data, {
            headers: headers,
        })
            .then(function (response) {
                Swal.fire("Own Info Add!", response.data.msg, "success");
            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    footer: '<a href="">Why do I have this issue?</a>',
                });
            });
        reset();
    };
    return (
        <>
            <section className='TopSellingProducts DashboardSetting'>
                <Container maxWidth='sm'>
                    <Grid Container spacing={3}>
                        <Grid item xs={12}>
                            <div className='Header d_flex d_justify'>
                                {/* Left */}
                                <div className='Left d_flex'>
                                    <div className='svg'>
                                        <MdProductionQuantityLimits />
                                    </div>

                                    <div className='text'>
                                        <h4>Add New Page</h4>
                                        <p>Add new pages to your website</p>
                                    </div>
                                </div>
                            </div>
                        </Grid>

                        <Grid item xs={12}>
                            <div className='AddNewPages'>
                                <div className='DashboardForm'>
                                    <form onSubmit={handleSubmit(addPageSubmit)}>
                                        <div className='CustomeInput'>
                                            <div className='Item'>
                                                <label>Page Title</label>

                                                <TextField
                                                    id='outlined-basic'
                                                    label='Enter name here'
                                                    variant='outlined'
                                                    {...register("title")}
                                                />
                                            </div>

                                            <div className='Item'>
                                                <p>
                                                    Page Link:{" "}
                                                    <Link href='MyShopName/domain'>
                                                        www.funnelliner.com/{domain}/domain
                                                    </Link>
                                                </p>
                                            </div>

                                            <div className='Item Multiline'>
                                                <label>Page Content</label>

                                                <TextField id="outlined-multiline-static" label="Enter name here"
                                                    multiline rows={4} {...register("page_content")} />

                                            </div>

                                            <div className='Item'>
                                                <div className='SelectTheme'>
                                                    <h5>Select Theme :</h5>

                                                    <Grid container spacing={2}>
                                                        {/* item */}
                                                        <Grid item xs={4}>
                                                            <label class='card'>
                                                                <input
                                                                    name='plan'
                                                                    className='radio'
                                                                    type='radio'
                                                                    {...register("theme")}
                                                                    value='1'
                                                                />

                                                                <span class='plan-details'>
                                                                    <img src='images/landing3.png' alt='' />
                                                                </span>
                                                            </label>
                                                        </Grid>

                                                        {/* item */}
                                                        <Grid item xs={4}>
                                                            <label class='card'>
                                                                <input
                                                                    name='plan'
                                                                    className='radio'
                                                                    type='radio'
                                                                    {...register("theme")}
                                                                    value='2'
                                                                />

                                                                <span class='plan-details'>
                                                                    <img src='images/landing2.png' alt='' />
                                                                </span>
                                                            </label>
                                                        </Grid>

                                                        {/* item */}
                                                        <Grid item xs={4}>
                                                            <label class='card'>
                                                                <input
                                                                    name='plan'
                                                                    className='radio'
                                                                    type='radio'
                                                                    {...register("theme")}
                                                                    value='3'
                                                                />

                                                                <span class='plan-details'>
                                                                    <img src='images/landing1.png' alt='' />
                                                                </span>
                                                            </label>
                                                        </Grid>

                                                        {/* item */}
                                                        <Grid item xs={4}>
                                                            <label class='card'>
                                                                <input
                                                                    name='plan'
                                                                    className='radio'
                                                                    type='radio'
                                                                    {...register("theme")}
                                                                    value='4'
                                                                />

                                                                <span class='plan-details'>
                                                                    <img src='images/landing3.png' alt='' />
                                                                </span>
                                                            </label>
                                                        </Grid>

                                                        {/* item */}
                                                        <Grid item xs={4}>
                                                            <label class='card'>
                                                                <input
                                                                    name='plan'
                                                                    className='radio'
                                                                    type='radio'
                                                                    {...register("theme")}
                                                                    value='5'
                                                                />

                                                                <span class='plan-details'>
                                                                    <img src='images/landing2.png' alt='' />
                                                                </span>
                                                            </label>
                                                        </Grid>

                                                        {/* item */}
                                                        <Grid item xs={4}>
                                                            <label class='card'>
                                                                <input
                                                                    name='plan'
                                                                    className='radio'
                                                                    type='radio'
                                                                    {...register("theme")}
                                                                    value='6'
                                                                />

                                                                <span class='plan-details'>
                                                                    <img src='images/landing1.png' alt='' />
                                                                </span>
                                                            </label>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </div>

                                            <div className='Item'>
                                                <Button type='submit' className='Update'>
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </section>
        </>
    );
};

export default AddNewPage;
