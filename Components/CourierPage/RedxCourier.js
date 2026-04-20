import Switch from '@mui/material/Switch';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { activateCourier } from '../../pages/api';

const RedxCourier = ({ merchantId, showToast, setOpenRedx, openRedx, redxData, startLoading, stopLoading }) => {
  const [showToken, setShowToken] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const decodeJson = (data) => {
    if (!data) return {};
    try { return JSON.parse(data); } catch { return {}; }
  };

  const handleRedxSubmit = (data) => {
    startLoading();
    activateCourier(merchantId, 'redx', 'active', JSON.stringify({ token: data.token }))
      .then((res) => {
        stopLoading();
        if (res?.status === 200) showToast('Redx details have been successfully submitted.');
      })
      .catch(() => stopLoading());
  };

  return (
    <div className={`cb-card${openRedx ? ' cb-card--active' : ''}`}>
      {/* header */}
      <div className="cb-card__header">
        <div className="cb-card__logo">
          <img src="../images/new-redx-logo.svg" alt="Redx" />
        </div>
        <div className="cb-card__meta">
          <span className="cb-card__name">Redx Courier</span>
          {openRedx && <span className="cb-status cb-status--on">Connected</span>}
        </div>
        <div className="cb-card__toggle">
          <Switch
            checked={openRedx}
            onChange={(e) => setOpenRedx(e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#894bca' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#c59ef0' },
            }}
          />
        </div>
      </div>

      {/* form */}
      {openRedx && (
        <div className="cb-card__body">
          <div className="cb-divider" />
          <form onSubmit={handleSubmit(handleRedxSubmit)} className="cb-form">
            <div className="cb-field">
              <label className="cb-label">Bearer Token</label>
              <div className="cb-input-wrap">
                <input
                  {...register('token', { required: true })}
                  type={showToken ? 'text' : 'password'}
                  defaultValue={decodeJson(redxData?.config)?.token || ''}
                  className="cb-input"
                  placeholder="Enter bearer token"
                />
                <div className="cb-eye" onClick={() => setShowToken((v) => !v)}>
                  <i className={showToken ? 'flaticon-eye' : 'flaticon-hidden'} />
                </div>
              </div>
              {errors.token && <p className="cb-error">Token is required</p>}
            </div>
            <button type="submit" className="cb-submit-btn">
              <i className="flaticon-checked" /> Save Redx
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RedxCourier;
