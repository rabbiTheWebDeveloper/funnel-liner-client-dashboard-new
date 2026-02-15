
import { Box, Button, Modal } from '@mui/material';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useToast } from '../../../hook/useToast';
import { headers } from '../../../pages/api';

const SalesTargetModal = ({salesTarget , openSales ,handleOpenSales ,handleCloseSales , salesTargetRfatch , setOpenSales}) => {
    const showToast = useToast();

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const onSubmit = (data) => {

        data.daily= parseInt(data.daily) > 0 ? data.daily : 0
        data.monthly=parseInt(data.monthly) > 0 ? data.monthly : 0
        data.custom = data.custom > 0 ? data.custom : 0




        axios.post(process.env.NEXT_PUBLIC_API_URL + "/client/sales-target/update", data, {
            headers: headers,
        })
            .then(function (response) {
                salesTargetRfatch()
                showToast('Sales Target update successfully!', 'success');
            })
            .catch(function (error) {
           ;
            });
        reset();
        setOpenSales(false);
    };
    return (

        <Modal
            open={openSales}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className='updateModal'
        >
            <Box className='modalBox'>
                <div className="modalContent">

                    <div className='header'>
                        <div className='left'>
                            <i className="flaticon-edit"></i>
                            <h4>Update Sales Target in BDT</h4>
                        </div>

                        <div className='right' onClick={handleCloseSales}>
                            <i className="flaticon-close-1"></i>
                        </div>

                    </div>

                    <div className="Form">
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="customInput">
                                <label>Enter Daily Sales Target <span>*</span></label>
                                <input type="number" defaultValue={salesTarget?.daily} {...register("daily")} />
                                {errors.daily && (
                                    <p className="error">This field is required</p>
                                )}
                            </div>

                            <div className="customInput">
                                <label>Enter Monthly Sales Target <span>*</span></label>
                                <input type="number" defaultValue={salesTarget?.monthly} {...register("monthly")} />
                                {errors.weekly && (
                                    <p className="error">This field is required</p>
                                )}
                            </div>

                            <div className="customInput">
                                <label>Enter Custom Sales Target <span>*</span></label>
                                <input type="number" defaultValue={salesTarget?.custom} {...register("custom")} />
                                {errors.custom && (
                                    <p className="error">This field is required</p>
                                )}
                            </div>

                            <div className="customInput">
                                <label>
                                    Choose Your Custom Targeting Date Range
                                </label>

                                <div className="d_flex">
                                    <div className="customInput">
                                        <label>From</label>
                                        <input
                                            defaultValue={salesTarget?.from_date?.slice(0, 10)}  {...register("from_date")}
                                            type="date"
                                        />
                                    </div>
                                    {/* <h1>{salesTarget?.from_date?.slice(0, 10)}</h1> */}

                                    <div className="customInput">
                                        <label>To</label>
                                        <input defaultValue={salesTarget?.to_date?.slice(0, 10)} {...register("to_date")}
                                            type="date" />
                                    </div>

                                </div>

                            </div>

                            <div className="duelButton">

                                <Button type="submit" className='One'>Save Changes</Button>
                                {/* <Button type="reset" className="red">Reset</Button> */}

                            </div>
                        </form>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default SalesTargetModal;