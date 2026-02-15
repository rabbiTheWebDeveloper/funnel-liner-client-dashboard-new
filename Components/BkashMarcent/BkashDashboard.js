import { Button } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { MdOutlineRefresh } from 'react-icons/md';

const BkashDashboard = ({ bkashBalance }) => {
    const number = Cookies.get('m_b_k_n')
    const pass = Cookies.get('m_b_k_p')
    const [TrxsSearchString, setTrxsSearchString] = useState("")
    const [searchedData, setSearchedData] = useState([])

    const [trxList, setTrxList] = useState([])
    const [nextToken, setNextToken] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleFetchMerchentTransaction = (nextToken) => {
        setIsLoading(true)
        axios.post(process.env.Bkash_URL, {
            number: number,
            password: pass,
            access_token: '6db5fa4d34aee26b39b473cdf0a8dcfa0308779102f6e509',
            next_token: nextToken
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }
        )
            .then(res => {
                setIsLoading(false)
                if (res.data.status === "success") {

                    setTrxList(res?.data?.trx_list)
                    setNextToken(res?.data?.next_token)
                }
            })
            .catch(error => {

            })
    }
    useEffect(() => {
        handleFetchMerchentTransaction()
    }, [])



    const handleSearchTransication = () => {
        const filtered = trxList.filter(item => item?.trxId?.toLowerCase().toString().includes(TrxsSearchString.toLowerCase()));
        setSearchedData(filtered)
    }
    useEffect(() => {
        if (TrxsSearchString.length > 0) {
            handleSearchTransication()
        }
    }, [TrxsSearchString])




    // const handleFilterTransaction = (e) => {
    //     if (e.target.value === "This Month") {
    //         axios.post(`https://bkash.dev.funnelliner.com/api/trx_amr`, { number: number, password: pass, access_token: '6db5fa4d34aee26b39b473cdf0a8dcfa0308779102f6e509' }, {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                 }
    //             }
    //             )
    //             .then(res => {
    //                 if (res.data.status === "success") {

    //                 }
    //             })
    //             .catch(error => {

    //             })
    //     }
    // }

    if (isLoading) {
        return (
            <div style={{ marginTop: '50px' }}>
                <Stack spacing={1} >
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </Stack >
            </div>
        )
    }


    const handleRefresh = () => {
        window.location.reload()
    }

    return (

        <>

            <section className='BkashDashboard'>

                <div className="Header d_flex d_justify">

                    {/* HeaderLeft */}
                    <div className="HeaderLeft">

                        <h4>Hi, welcome back!</h4>

                        <div className="ButtonWithSearch AddonsTabsHeader d_flex">

                            <Button onClick={handleRefresh}>
                                Refresh Now
                                <MdOutlineRefresh />
                            </Button>

                            <div className="Search">
                                <input onChange={(e) => setTrxsSearchString(e.target.value)} type="text" placeholder='Search Transaction...' />
                                <div className="searchIcon">
                                    <BsSearch />
                                </div>
                            </div>


                        </div>

                    </div>

                    {/* HeaderRight */}
                    <div className="HeaderRight d_flex">

                        {/* item */}
                        <div className="HeaderRightItem d_flex d_justify">

                            <div className="text">

                                <h5> <img src="/images/tk.png" alt="" />{bkashBalance}</h5>
                                <p>Account Balance</p>

                            </div>

                            <div className="img">
                                <img src="/images/money-bag.png" alt="" />
                            </div>

                        </div>

                        {/* item */}
                        {/* <div className="HeaderRightItem bg2 d_flex d_justify">

                            <div className="text">

                                <h5><img src="/images/tk.png" alt="" />{totalTransaction}</h5>
                                <p>Total Transactions</p>

                            </div>

                            <div className="img">
                                <select onChange={handleFilterTransaction} name="">
                                    <option value="">Select</option>
                                    <option value="Today">Today</option>
                                    <option value="Yesterday">Yesterday</option>
                                    <option value="This Weak">This Weak</option>
                                    <option value="This Month">This Month</option>
                                    <option value="This Year">This Year</option>
                                </select>
                                <img src="/images/return-policy.png" alt="" />
                            </div>

                        </div> */}

                    </div>

                </div>


                {/* BkashDashboardTable */}
                <div className="BkashDashboardTable">

                    <div className="ProductTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date & Time</th>
                                    <th>Wallet</th>
                                    <th>Transaction ID</th>
                                    <th>Transaction Type</th>
                                    <th>Transaction Amount</th>
                                    <th>Reference</th>
                                    <th>Other Info</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    TrxsSearchString.length > 0 && searchedData.map((item, index) => <tr key={index}>
                                        
                                        <td>{item?.dateTime}</td>
                                        <td>{item?.wallet}</td>
                                        <td>{item?.trxId}</td>
                                        <td>{item?.trxType}</td>
                                        <td>{item?.amount}</td>
                                        <td>{item?.reference}</td>
                                        <td>{item?.otherInfo}</td>
                                    </tr>)
                                }
                                {
                                    TrxsSearchString.length === 0 && trxList.map((item, index) => <tr key={index}>
                                        <td>{item?.dateTime}</td>
                                        <td>{item?.wallet}</td>
                                        <td>{item?.trxId}</td>
                                        <td>{item?.trxType}</td>
                                        <td>{item?.amount}</td>
                                        <td>{item?.reference}</td>
                                        <td>{item?.otherInfo}</td>
                                    </tr>)
                                }
                            </tbody>

                        </table>

                    </div>

                    <div className="BkashDashboardNextBtn">
                        {
                            nextToken && <Button onClick={() => handleFetchMerchentTransaction(nextToken)}>Next</Button>
                        }
                    </div>
                </div>
            </section>

        </>

    )
}

export default BkashDashboard
