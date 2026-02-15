import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useToast } from "../../hook/useToast";
import { headers } from "../../pages/api";

const OrderUpdate = ({ id, products, handleFetch }) => {
    const showToast = useToast();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [order, setOrder] = useState({});
    const [openSales, setOpenSales] = useState(false)
    const handleOpenSales = () => setOpenSales(true);
    const handleCloseSales = () => setOpenSales(false);
    const [update, setUpdate] = useState(false);
    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_API_URL + "/client/orders/" + id, { headers: headers })
            .then(function (response) {
                // handle success
                setOrder(response.data.data);
            }).catch((err) => {
                return err
            })
            ;
    }, [id, update]);



    const formData = new FormData()



    const onSubmit = (data) => {

        formData.append("_method", "patch");
        formData.append("customer_name", data.customerName);
        formData.append("customer_address", data.address);
        formData.append("customer_phone", data.phone);
        formData.append("shipping_cost", data.shipping_cost);

        //    debugger
        axios.post(process.env.NEXT_PUBLIC_API_URL + "/client/orders/" + id, formData, {
            headers: headers,
        })
            .then(function (response) {
                showToast('Order Update   Successfully !', 'success');
                handleFetch()
                setUpdate(true)
            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    text: "Something went wrong",
                });
            });
        setOpenSales(false);
    }
    return (
        <div>
            <i className="flaticon-edit" onClick={handleOpenSales}></i>

            <Modal
                open={openSales}
                onClose={handleCloseSales}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className='updateModal'
            >
                <Box className='modalBox'>

                    <div className='modalContent'>

                        <div className='header'>
                            <div className='left'>
                                <i className="flaticon-edit"></i>
                                <h4>Update Order Details</h4>
                            </div>

                            <div className='right' onClick={handleCloseSales}>
                                <i className="flaticon-close-1"></i>
                            </div>

                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className='updateModalForm'>

                                <div className='customInput'>
                                    <label>Customer Name</label>
                                    <input type="text" placeholder="Name" defaultValue={order?.customer_name}
                                        {...register("customerName")} />
                                </div>

                                <div className='customInput'>
                                    <label>Contact No</label>
                                    <input type="text" placeholder="Name" defaultValue={order?.phone}
                                        {...register("phone")} />
                                </div>

                                <div className='customInput'>
                                    <label>Address</label>
                                    <input type="text" placeholder="Name"  defaultValue={order?.address}
                                        {...register("address")} />
                                </div>

                                <div className='customInput'>
                                    <label>Shipping Cost</label>
                                    <input type="text" placeholder="Name" defaultValue={order?.shipping_cost}
                                        {...register("shipping_cost")} />
                                </div>

                            </div>

                            <div className="duelButton">
                                <Button type="submit">Update</Button>
                                {/* <Button className="red">Reset</Button> */}
                            </div>

                        </form>

                    </div>

                    

                </Box>
            </Modal>
        </div>
    );
};

export default OrderUpdate;