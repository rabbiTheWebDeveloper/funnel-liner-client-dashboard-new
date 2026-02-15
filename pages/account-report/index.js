import React from 'react';
import { Container, Grid } from '@mui/material';
import AccountReport from '../../Components/AccountingModeul/AccountReport';

const Index = ({ myAddonsList, isApiResponse }) => {
  const isFirstAddonActive = myAddonsList[0]?.addons_id === 16 && myAddonsList[0]?.status === 1;
  const shouldShowAccessDeniedMessage = isApiResponse && !myAddonsList.some((addon) => addon.addons_id === 16 && addon.status === 1);

  const renderAccountReport = () => (
    <section>
      <Container maxWidth="sm">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AccountReport />
          </Grid>
        </Grid>
      </Container>
    </section>
  );

  const renderAccessDeniedMessage = () => (
    <section>
      <Container maxWidth="sm">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {shouldShowAccessDeniedMessage && (
              <div className="NoPayment boxShadow commonCart cart-1">
                <h3>Access Denied. Please make a payment or activate to access.</h3>
              </div>
            )}
          </Grid>
        </Grid>
      </Container>
    </section>
  );

  return (
    <>
      {isFirstAddonActive && renderAccountReport()}
      {renderAccessDeniedMessage()}
    </>
  );
};

export default Index;
