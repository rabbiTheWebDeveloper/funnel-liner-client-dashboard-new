import React from 'react';
import HeaderDescription from '../../Components/Common/HeaderDescription/HeaderDescription';
import { Button, Container, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { headers, userId } from '../api';
import { useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../hook/useToast';
import { useState } from 'react';
import withAuth from '../../hook/PrivateRoute';

const Ticket_id = () => {
    const router = useRouter()
    const showToast = useToast()
    const ticket_ID = router?.query?.ticket_id;
    const [ticket_details, setTicketDetails] = useState({})

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const handleCreateReply = (data) => {
        const postBody = {
            merchant_id: userId,
            content: data.replyContent,
        };
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/client/support-ticket/${ticket_ID}/reply`, postBody, {
                headers: headers,
            })
            .then(function (response) {
                if (response.status === 200) {
                    showToast("Reply Send Success", "success")
                } else {
                    showToast("Something went wrong!", "error")
                }
            })
            .catch(function (error) {
                showToast("Something went wrong!", "error")
            });
        reset()
    };

    const fetchTIcketDetails = () => {
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/client/support-ticket/${userId}/details/${ticket_ID}`, {
                headers: headers,
            })
            .then((res) => {
                setTicketDetails(res?.data?.data[0])
            }).catch((err) => {
               
            })
    }
    useEffect(() => {
        if (ticket_ID) {
            fetchTIcketDetails()
        }
    }, [ticket_ID])
    return (
        // <div>
        //     <section className='SupportTicket'>

        //         {/* header */}
        //         <HeaderDescription headerIcon={'flaticon-customer-service'} title={'Ticket Conversation'} subTitle={'Conversation of ticket opended by clients'} search={false}   order={false}/>

        //         <Container maxWidth='sm'>
        //             <Grid Container spacing={3}>
        //                 <Grid item xs={12}>
        //                     <form onSubmit={handleSubmit(handleCreateReply)}>
        //                         <div className='SupportTicketItem boxShadow'>
        //                             <div className='customInput'>
        //                                 <label>Write Message<span>*</span></label>
        //                                 <textarea name="" rows="5" {...register("replyContent", { required: true })} placeholder="Write message here">

        //                                 </textarea>
        //                                 {errors.msgContent && (
        //                                     <p className="error">
        //                                         Message content required for reply
        //                                         {/* SMS Content must be at least 10 characters */}
        //                                     </p>
        //                                 )}
        //                             </div>
        //                             <div className="duelButton">
        //                                 <Button type="submit">Submit</Button>
        //                                 <Button type="reset" className="red">Reset</Button>
        //                             </div>
        //                         </div>
        //                     </form>
        //                 </Grid>
        //             </Grid>

        //             <Grid Container spacing={3} my={5}>
        //                 <Grid item xs={12}>
        //                     <div className='SupportTicketItem boxShadow'>
        //                         <div>
        //                             <h3>Ticket Id: {ticket_details?.ticket_id}</h3>
        //                             <h4>{ticket_details?.subject}</h4>
        //                             <p>{ticket_details?.content}</p>
        //                         </div>
        //                         <br></br>
        //                         <br></br>


        //                         {
        //                             ticket_details?.comments?.map((comment, index) => <div key={index} className={`conversation_comments  ${comment?.shop_id?"conversation_comments_shop_owner": "conversation_comments_staf"}`}>
                                       
        //                                 <div className='d_flex d_justify '>
        //                                     <h4>{comment?.shop_name?comment?.shop_name:"Support Team"}</h4>
        //                                     <h6>{comment?.created_at}</h6>
        //                                 </div>

        //                                 <div>
        //                                     <p>{comment?.content} </p>
        //                                 </div>

        //                             </div>)
        //                         }


                                

        //                     </div>
        //                 </Grid>
        //             </Grid>
        //         </Container>
        //     </section>
        // </div>
        <>
        </>
    );
};

export default withAuth(Ticket_id, {
    isProtectedRoute: true
});