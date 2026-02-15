import { Switch, Box, Typography, Card, CardContent, useTheme } from '@mui/material';
import { Warehouse as WarehouseIcon } from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { headers, shopId } from '../../../pages/api';
import { API_ENDPOINTS } from '../../../config/ApiEndpoints';

const InCompletePermission = ({ response, showToast }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  // Memoize the API call function
  const updateIncompleteOrderPermission = useCallback(async (checked) => {
    setIsLoading(true);
    try {
      // This should be a PUT/PATCH request to update the setting, not GET
      const response = await axios.get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.WEBSITE_SETTINGS.ORDERS_INCOMPLETE_PERMISSION}/${shopId}`,
        { headers }
      );
      if (response.data.success) {
        setIsEnabled(checked);
        showToast(
          checked
            ? "Incomplete orders option has been successfully enabled."
            : "Incomplete orders option has been successfully disabled.",
          "success"
        );
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Failed to update incomplete order permission:", error);
      // Revert the switch on error
      setIsEnabled(!checked);
      showToast(
        error.response?.data?.message || "Something went wrong while updating the setting.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // Handle switch change with debouncing protection
  const handleSwitchChange = async (event) => {
    const { checked } = event.target;
    
    // Immediately update UI for better responsiveness
    setIsEnabled(checked);
    
    // Make API call to update the setting
    await updateIncompleteOrderPermission(checked);
  };

  // Initialize state from props
  useEffect(() => {
    if (response?.incompleted_order !== undefined) {
      setIsEnabled(response.incompleted_order === 1);
    }
  }, [response?.incompleted_order]);

  return (
    <Card 
      elevation={2}
      sx={{
        marginTop: 3,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <WarehouseIcon 
              color="primary" 
              sx={{ 
                fontSize: 40,
                [theme.breakpoints.down('sm')]: {
                  fontSize: 32
                }
              }} 
            />
            <Box>
              <Typography variant="h6" component="h4" fontWeight="medium">
                Enable Incomplete Orders
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Allow customers to complete orders at a later time
              </Typography>
            </Box>
          </Box>
          
          <Box>
            <Switch
              checked={isEnabled}
              onChange={handleSwitchChange}
              disabled={isLoading}
              color="primary"
              inputProps={{ 
                'aria-label': 'Toggle incomplete orders option',
                'role': 'switch'
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InCompletePermission;