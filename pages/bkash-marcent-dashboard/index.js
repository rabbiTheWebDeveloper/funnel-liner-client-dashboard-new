import { Container, Grid } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import BkashDashboard from '../../Components/BkashMarcent/BkashDashboard';
import withAuth from '../../hook/PrivateRoute';

const Plugin = () => {
    const [bkashBalance, setBkashBalance] = useState(0)
    const number = Cookies.get('m_b_k_n')
    const pass = Cookies.get('m_b_k_p')
    const [trxList, setTrxList] = useState([])
    const handleFetchMerchentBkashBalance = () => {
        axios
            .post(`https://bkash.dev.funnelliner.com/api/bks/balance`, { number: number, password: pass, access_token: '6db5fa4d34aee26b39b473cdf0a8dcfa0308779102f6e509' }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
            )
            .then(res => {
                if (res.data.status === "success") {
                    setBkashBalance(res?.data?.balance)
                
                }
            })
            .catch(error => {
               
            })
    }

    const [nextToken, setNextToken] = useState(null)
    const handleFetchMerchentTransaction = async (nextToken) => {
        try {
          const response = await axios.post(
            'https://bkash.dev.funnelliner.com/api/bks/trx_list',
            {
              number: number,
              password: pass,
              access_token: '6db5fa4d34aee26b39b473cdf0a8dcfa0308779102f6e509',
              next_token: nextToken,
            },
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          if (response.data.status === 'success') {
            setNextToken(response?.data?.next_token);
            setTrxList(...trxList, response?.data?.trx_list);
          }
        } catch (error) {
          
        }
      };
    useEffect(() => {
        handleFetchMerchentBkashBalance()
    }, [])
    //fetch all trnx list
    const [isExistNextToken, setIsExistNextToken] = useState({})
    const [alTrnxList, setAlTrnxList] = useState([])

    useEffect(()=>{
      handleFetchMerchentTransaction()
    }, [])
    return (
        <>
            <section className=''>
                <Container maxWidth="sm">
                    {/* CourierContent */}
                    <div className="AddonsContent">
                        <Grid container spacing={3}>
                            <Grid item md={12}>
                                <BkashDashboard bkashBalance={bkashBalance}/> 
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </section>
        </>
    )
}
export default withAuth(Plugin, {
  isProtectedRoute: true
});