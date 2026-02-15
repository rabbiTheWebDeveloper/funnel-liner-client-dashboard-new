import { Button, Grid, Switch } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { activateCourier } from '../../pages/api';

const RedxCourier = ({ merchantId, showToast, setOpenRedx, openRedx, redxData, startLoading, stopLoading }) => {
  const [showApi, setShowApi] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const decodeJson = (data) => data ? JSON.parse(data) : '';

  const handleApiKey = (key) => {
    if (key === "token") {
      setShowApi(!showApi);
    }
  }

  const handleRedxSubmit = (data) => {
    startLoading();
    const configData = JSON.stringify({ token: data.token });
    activateCourier(merchantId, "redx", "active", configData)
      .then((res) => {
        if (res?.status === 200) {
          stopLoading();
          showToast("Steadfast details have been successfully submitted.");
        }
      });
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
    
        <div className='CourierItem boxShadow'>
          <div className='img'>
            <img src='../images/new-redx-logo.svg' alt='' />
          </div>
          <div className='text'>
            <h4>Select Redx</h4>
            <div className='Toggle'>
              <Switch
                onChange={(event) => setOpenRedx(event.target.checked)}
                checked={openRedx}
              />
            </div>
          </div>
          {openRedx &&
          <div className='InputField'>
            <form onSubmit={handleSubmit(handleRedxSubmit)}>
              <div className='customInput'>
                <label>Token </label>
                <input
                  {...register("token", { required: true })}
                  type={showApi ? 'text' : 'password'}
                  defaultValue={decodeJson(redxData?.config)?.token || ''}
                />
                <div className="eye" onClick={() => handleApiKey("token")}>
                  {showApi ? <i className="flaticon-eye"></i> : <i className="flaticon-hidden"></i>}
                </div>
                {errors.token && <p className="error">Api Key is required</p>}
              </div>
              <div className="duelButton">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
            }
        </div>
    
    </Grid>
  );
};

export default RedxCourier;
