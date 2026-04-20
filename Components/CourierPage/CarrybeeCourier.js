import Switch from '@mui/material/Switch';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { activateCourier } from '../../pages/api';

const CarrybeeCourier = ({
  merchantId,
  showToast,
  setOpenCarrybee,
  openCarrybee,
  carrybeeData,
  startLoading,
  stopLoading,
}) => {
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [showClientContext, setShowClientContext] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const decodeJson = (data) => {
    if (!data) return {};
    try { return JSON.parse(data); } catch { return {}; }
  };

  const handleCarrybeeSubmit = (data) => {
    startLoading();
    const config = {
      client_id: data.client_id,
      client_secret: data.client_secret,
      client_context: data.client_context,
      store_id: data.store_id,
    };
    activateCourier(merchantId, 'carrybee', 'active', JSON.stringify(config))
      .then((res) => {
        stopLoading();
        if (res?.status === 200) showToast('Carrybee details have been successfully submitted.');
      })
      .catch(() => stopLoading());
  };

  const existing = decodeJson(carrybeeData?.config);

  return (
    <div className={`cb-card${openCarrybee ? ' cb-card--active' : ''}`}>
      {/* header */}
      <div className="cb-card__header">
        <div className="cb-card__logo cb-card__logo--wide">
          <img src="../images/carrybee-logo.png" alt="Carrybee" />
        </div>
        <div className="cb-card__meta">
          <span className="cb-card__name">Carrybee Courier</span>
          {openCarrybee && <span className="cb-status cb-status--on">Connected</span>}
        </div>
        <div className="cb-card__toggle">
          <Switch
            checked={openCarrybee}
            onChange={(e) => setOpenCarrybee(e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#f5a623' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#fcd683' },
            }}
          />
        </div>
      </div>

      {/* form */}
      {openCarrybee && (
        <div className="cb-card__body">
          <div className="cb-divider" />
          <form onSubmit={handleSubmit(handleCarrybeeSubmit)} className="cb-form">

            {/* Client ID */}
            <div className="cb-field">
              <label className="cb-label">Client ID</label>
              <input
                type="text"
                {...register('client_id', { required: true })}
                defaultValue={existing?.client_id || ''}
                className="cb-input"
                placeholder="e.g. c0ae1045-f5e5-4baf-..."
              />
              {errors.client_id && <p className="cb-error">Client ID is required</p>}
            </div>

            {/* Client Secret */}
            <div className="cb-field">
              <label className="cb-label">Client Secret</label>
              <div className="cb-input-wrap">
                <input
                  type={showClientSecret ? 'text' : 'password'}
                  {...register('client_secret', { required: true })}
                  defaultValue={existing?.client_secret || ''}
                  className="cb-input"
                  placeholder="e.g. 60ee141e-c995-..."
                />
                <div className="cb-eye" onClick={() => setShowClientSecret((v) => !v)}>
                  <i className={showClientSecret ? 'flaticon-eye' : 'flaticon-hidden'} />
                </div>
              </div>
              {errors.client_secret && <p className="cb-error">Client Secret is required</p>}
            </div>

            {/* Client Context */}
            <div className="cb-field">
              <label className="cb-label">Client Context</label>
              <div className="cb-input-wrap">
                <input
                  type={showClientContext ? 'text' : 'password'}
                  {...register('client_context', { required: true })}
                  defaultValue={existing?.client_context || ''}
                  className="cb-input"
                  placeholder="e.g. K8ur5Q8YFGzdsqmL..."
                />
                <div className="cb-eye" onClick={() => setShowClientContext((v) => !v)}>
                  <i className={showClientContext ? 'flaticon-eye' : 'flaticon-hidden'} />
                </div>
              </div>
              {errors.client_context && <p className="cb-error">Client Context is required</p>}
            </div>

            {/* Store ID */}
            <div className="cb-field">
              <label className="cb-label">Store ID</label>
              <input
                type="text"
                {...register('store_id', { required: true })}
                defaultValue={existing?.store_id || ''}
                className="cb-input"
                placeholder="e.g. 8671"
              />
              {errors.store_id && <p className="cb-error">Store ID is required</p>}
            </div>

            <button type="submit" className="cb-submit-btn cb-submit-btn--bee">
              <i className="flaticon-checked" /> Save Carrybee
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CarrybeeCourier;
