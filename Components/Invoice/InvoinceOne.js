import React from 'react';
import { BiPhoneCall } from 'react-icons/bi';
import { FaRegEnvelope } from 'react-icons/fa';
import { MdLocationPin } from 'react-icons/md';

const InvoinceOne = () => {


    return (

        <>

            <div className="InvoiceOne">


                <div className="InvoiceOneContent">

                    <div className="Thankyou">
                        <p>Thank you for your being with us !</p>

                        <div className="FooterAddress">

                            <div className="Header">

                                {/* text */}
                                <div className="Text">
                                    <ul>
                                        <li><BiPhoneCall /> (+7 123) 123‒45‒67</li>
                                        <li><FaRegEnvelope /> contact@email.com</li>
                                        <li><MdLocationPin /> location</li>
                                    </ul>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Header */}
                    <div className="Header d_flex d_justify">

                        <div className="Logo">
                            <img src="images/logo.png" alt="" />
                        </div>

                        <div className="Title">
                            <h3>INVOICE</h3>
                            <h4>Invoice No: <span>123</span></h4>
                            <h4>Invoice date: <strong>07.03.2022</strong></h4>
                        </div>

                    </div>

                    {/* Title */}

                    {/* Table */}
                    <div className="Table">

                        <table>

                            <thead>
                                <tr>
                                    <th>PRODUCT DESCRIPTION</th>
                                    <th>PRICE</th>
                                    <th>QTY</th>
                                    <th>AMOUNT</th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr>
                                    <td>
                                        <h5>Landing page</h5>
                                        <p>Additional Information</p>
                                    </td>
                                    <td>BDT 500.00</td>
                                    <td>1</td>
                                    <td>BDT 500.00</td>
                                </tr>

                                <tr>
                                    <td>
                                        <h5>Landing page</h5>
                                        <p>Additional Information</p>
                                    </td>
                                    <td>BDT 500.00</td>
                                    <td>1</td>
                                    <td>BDT 500.00</td>
                                </tr>

                                <tr>
                                    <td>
                                        <h5>Landing page</h5>
                                        <p>Additional Information</p>
                                    </td>
                                    <td>BDT 500.00</td>
                                    <td>1</td>
                                    <td>BDT 500.00</td>
                                </tr>

                                <tr>
                                    <td>
                                        <h5>Landing page</h5>
                                        <p>Additional Information</p>
                                    </td>
                                    <td>BDT 500.00</td>
                                    <td>1</td>
                                    <td>BDT 500.00</td>
                                </tr>

                                <tr>
                                    <td>
                                        <h5>Landing page</h5>
                                        <p>Additional Information</p>
                                    </td>
                                    <td>BDT 500.00</td>
                                    <td>1</td>
                                    <td>BDT 500.00</td>
                                </tr>

                                <tr>
                                    <td>
                                        <h5>Landing page</h5>
                                        <p>Additional Information</p>
                                    </td>
                                    <td>BDT 500.00</td>
                                    <td>1</td>
                                    <td>BDT 500.00</td>
                                </tr>


                            </tbody>

                        </table>

                    </div>

                    {/* Total */}
                    <div className="Total d_flex d_justify">

                        <div className="Left">
                            <h4>Invoice to: </h4>
                            <p>Susana Rose Address: SAR Bhaban, Level-5 , Ka-78, Progoti Sarani, Kuril, Vatara,
                                Dhaka-1229, Contact: 1234 456 444 555 </p>
                        </div>

                        <div className="Right">

                            <ul>
                                <li>SubTotal: BDT 3 420.00</li>
                                <li>Discount: BDT 100</li>
                                <li>Advance: BDT 100.00</li>
                                <li>Shipping : BDT 100.00</li>
                            </ul>

                            <h3>Total Bill: BDT 4500.00</h3>

                        </div>

                    </div>


                </div>


            </div>


            {/* <style jsx>{`

                @import url('https://fonts.googleapis.com/css2?family=Asap:wght@100;200;300;400;500;600;700;800;900&display=swap');

                .InvoiceOne{
                    height:100vh;
                    position: relative;
                    overflow-x: hidden;
                    -webkit-print-color-adjust: exact;
                    font-family: 'Asap', sans-serif !important;
                }

                .InvoiceOne img{
                    width: 100%;
                }

                .PrintBottom{
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                }

                .PrintBottom h6{
                    position: absolute;
                    right:20px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 18px;
                    line-height: 35px;
                    font-weight: 600;
                    color: #fff;
                }

                .InvoiceName{
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                }

                .InvoiceName h4{
                    font-size: 25px;
                    line-height: 35px;
                    font-weight: 600;
                    color: #894BCA;
                    margin-top: 20px;
                }

                .InvoiceName h5{
                    font-size: 22px;
                    line-height: 30px;
                    font-weight: 600;
                    color: #000;
                    margin-bottom: 10px;
                }

                .InvoiceName h5 span{
                    margin-left: 20px;
                }

                .InvoiceName .Left{
                    width:50%;
                    margin-right:30px;
                }

                .InvoiceName li{
                    font-size: 16px;
                    line-height: 24px;
                    font-weight: 400;
                    color: #000;
                    margin-top:5px;
                }

                .Header{
                    padding: 20px;
                    background-color:#894BCA;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    -webkit-print-color-adjust: exact;
                }

                .Header img{
                    height: 80px;
                }

                .Header ul li{
                    font-size: 16px;
                    line-height: 24px;
                    font-weight: 400;
                    color: #fff;
                    margin-bottom: 5px;
                    display: flex;
                    align-items: center;
                }

                .Header ul li .svg{
                    margin-right: 10px;
                    margin-top: 5px;
                }

                .Invoice{
                    text-align: center;
                    margin: 20px 0;
                }

                .Invoice h2{
                    font-size: 50px;
                    font-weight: 500;
                    line-height: 60px;
                    color: #000;
                }

                .Invoice p{
                    font-size: 18px;
                    font-weight: 400;
                    line-height: 28px;
                    color: #000;
                }

                .Table{
                    padding: 20px;
                    text-align: left;
                }

                .Table table{
                    width: 100%;
                }

                .Table th{
                    font-weight: 600;
                    font-size: 20px;
                    line-height: 35px;
                    color:#000;
                    padding-bottom: 20px;
                }

                .Table td{
                    padding: 10px 0;
                }

                .Table td h4{
                    font-weight: 500;
                    font-size: 20px;
                    line-height: 30px;
                    color:#000;
                }

                .Table td h5{
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 28px;
                    color:#000;
                    margin-top: 5px;
                }



            `}</style> */}

        </>

    )

}

export default InvoinceOne