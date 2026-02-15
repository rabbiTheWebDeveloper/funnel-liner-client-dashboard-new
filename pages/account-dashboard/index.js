import React from 'react';
import { Container, Grid } from '@mui/material';
import AccountDashboard from '../../Components/AccountingModeul/AccountDashboard';
import { headers } from '../api';

const AccountDashboardPage = ({ myAddonsList, isApiResponse }) => {
  const [fetchApi, setFetch] = React.useState(false);
  const [payment, setPayment] = React.useState([]);

  const handleFetch = () => {
    setFetch(true);
  };

  // Check if any addon in the list satisfies the condition
  const isAccessDenied = myAddonsList.some(
    (addon) => addon.addons_id === 16 && addon.status === 1
  );

  return (
    <>
      {myAddonsList.map((addon) =>
        addon.addons_id === 16 && addon.status === 1 ? (
          <section key={addon.id}>
            <Container maxWidth="sm">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <AccountDashboard
                    fetchApi={fetchApi}
                    payment={payment}
                    setPayment={setPayment}
                    handleFetch={handleFetch}
                    addon={addon}
                  />
                </Grid>
              </Grid>
            </Container>
          </section>
        ) : null
      )}

      {/* Display "Access Denied" message only once if any addon satisfies the condition */}
      {isApiResponse && !isAccessDenied && (
        <section key="no-payment">
          <Container maxWidth="sm">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <div className="NoPayment boxShadow commonCart cart-1">
                  <h3>Access Denied. Please make a payment or activate to access.</h3>
                </div>
              </Grid>
            </Grid>
          </Container>
        </section>
      )}
    </>
  );
};

export default AccountDashboardPage;
