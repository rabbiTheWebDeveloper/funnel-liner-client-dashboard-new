import React, { useCallback, useEffect, useState } from 'react';
import EditFooter from '../../EditFooter/EditFooter';
import ColorCustomize from '../../ColorCustomize/ColorCustomize';
import style from "./style.module.css";
import { Button } from '@mui/material';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../config/ApiEndpoints';
import { headers } from '../../../pages/api';

const FooterAndColor = () => {
  const [dara , setData] = useState([]);
  const [selected, setSelected] = useState(1);
  const [background, setBackground] = useState("#fff");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdateSlider = async () => {
    setIsLoading(true);
    setError(null);
    const data ={
      theme_id: 1,
      footer_id: selected,
      multipage_color: background
    }

    try {
      const response = await axios.post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PAGE.FOOTER_COLOR}`, data, {
        headers:headers
      });

      console.log('Slider updated successfully:', response.data);
      // Additional actions after successful API call
    } catch (error) {
      console.error('Error updating slider:', error);
      setError('Failed to update slider. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleFetchFooterAndColor = useCallback(async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PAGE.FOOTER_COLOR}`, { headers });
      setData(response.data);
    } catch (error) {
      // Handle errors if needed
      console.error("Error fetching data:", error);
    }
  }, []);
  
  useEffect(() => {
    handleFetchFooterAndColor();
  }, [handleFetchFooterAndColor]);

  return (
    <>
      <EditFooter selected={selected} setSelected={setSelected}/>
      <ColorCustomize background={background} setBackground={setBackground}/>
      <div className={style.Submit}>
        <Button
          disabled={isLoading}
          onClick={handleUpdateSlider}
          className="theme_edit_submit_btn"
          sx={{ mb: 2 }}
        >
          <i className="flaticon-install"></i>{isLoading ? 'Updating...' : 'Update Slider'}
        </Button>
        {error && <p className={style.error}>{error}</p>}
      </div>
    </>
  );
};

export default FooterAndColor;
