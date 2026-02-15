import {Box, Button, Modal} from "@mui/material";
import SuperFetch from "../../hook/Axios";
import {headers} from "../../pages/api";
import {useState} from "react";
import {useToast} from "../../hook/useToast";
import {error} from "next/dist/build/output/log";

const CourierModal = ({handleCourierModalOpen, handleCourierModalClose, city, order_id, ...props}) => {
    const [zones, setZones] = useState();
    const [areas, setAreas] = useState();
    const [singleCity, setCityId] = useState();
    const [singleZone, setZoneId] = useState();
    const [singleArea, setAreaId] = useState();
    const showToast = useToast()

    const handleZone = async (city_id) => {
        setCityId(city_id)
        SuperFetch.get('/client/courier/pathao/zone-list',{
            params: {city_id: city_id},
            headers: headers,
        }).then((res) => {
            setZones(res.data?.data)
        })
    }

    const handleArea = async (zone_id) => {
        setZoneId(zone_id)
        SuperFetch.get('/client/courier/pathao/area-list',{
            params: {zone_id: zone_id},
            headers: headers,
        }).then((res) => {
            setAreas(res.data?.data)
        })
    }

    const handleSelect = async (area_id) => {
        setAreaId(area_id)

    }
    const handleSubmitPathaoLocation = async () => {
        SuperFetch.post('/client/courier/send-order',{
            zone_id: singleZone,
            city_id: singleCity,
            area_id: singleArea,
            provider: 'pathao',
            order_id: order_id
        }, {headers: headers}).then((res) => {
            handleCourierModalClose()
            if(res.data.type  === true) {
                showToast("res.data?.message")
            } else {
                showToast("Success")
                
            }

        }).catch((err)=>{
            showToast("Something went wrong")
            return err
        })
    }   

    return (
        <Modal
            open={handleCourierModalOpen}
            onClose={handleCourierModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className='viewModal'
        >
            <Box className='modalBox'>
                <div className='modalContent'>

                    <div className='header'>
                        <div className='left'>
                            <i className="flaticon-edit" />
                            <h4>Select Address</h4>
                        </div>

                        <div className='right' onClick={handleCourierModalClose}>
                            <i className="flaticon-close-1"/>
                        </div>

                    </div>

                    <div className='customInput'>
                        <label>Select City<span>*</span></label>
                        <select onChange={(e) => handleZone(e.target.value)}>
                            {city?.map((item) => {
                                return (
                                    <option value={item.city_id}>{item.city_name}</option>
                                )
                            })}

                        </select>
                    </div>
                    <div className='customInput'>
                        <label>Select Zone<span>*</span></label>
                        <select name="" id="" onChange={(e) => handleArea(e.target.value)}>
                            <option value={null} selected={true}>Select Zone</option>
                            {zones?.map((item) => {
                                return (
                                    <option value={item.zone_id}>{item.zone_name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='customInput'>
                        <label>Select Area<span>*</span></label>
                        <select name="" id="" onChange={(e) => handleSelect(e.target.value)}>
                            <option value={null} selected={true}>Select Area</option>
                            {areas?.map((item) => {
                                return (
                                    <option value={item.area_id}>{item.area_name}</option>
                                )
                            })}
                        </select>
                    </div>
                  <Button className="small_main_button"  onClick={handleSubmitPathaoLocation}>Confirm</Button>
                </div>
            </Box>
        </Modal>
    )
}

export default CourierModal