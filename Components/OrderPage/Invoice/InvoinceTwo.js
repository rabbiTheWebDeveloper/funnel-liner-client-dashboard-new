import React from 'react';

const InvoinceTwo = () => {


  return (

    <>

      <div className="InvoiceTwo">

        {/* Invoice */}
        <div className="Invoice">
          <h2>INVOICE</h2>
        </div>

        {/* header */}
        <div className="Header">

          <div className="Img">
            <img src="images/logo.png" alt="" />
          </div>

        </div>

        {/* InvoiceName */}
        <div className="InvoiceName">

          <div className="Left">

            <h5>Payment Info: </h5>

            <ul>
              <li><span>Customer Name: </span> James Smith</li>
              <li><span>Contact:</span> 1234 456 444 555</li>
              <li><span>Address:</span> SAR Bhaban, Level-5 , Ka-78, Progoti Sarani, Kuril, Vatara,
                Dhaka-1229
              </li>
            </ul>

          </div>

          <div className="Right">

            <h5> Invoice </h5>

            <h4>NO: 15643898799</h4>
            <h4>Date: 03/03/2021</h4>

          </div>

        </div>

        {/* Table */}
        <div className="Table">

          <table>

            <tr>
              <th>SL.</th>
              <th>Item Description</th>
              <th>Price</th>
            </tr>

            <tr>
              <td>1</td>
              <td>Strategic session</td>
              <td>BDT 1 000. 00</td>
            </tr>

            <tr>
              <td>1</td>
              <td>Strategic session</td>
              <td>BDT 1 000. 00</td>
            </tr>

            <tr>
              <td>1</td>
              <td>Strategic session</td>
              <td>BDT 1 000. 00</td>
            </tr>

            <tr>
              <td>1</td>
              <td>Strategic session</td>
              <td>BDT 1 000. 00</td>
            </tr>

            {/* SubTotal */}
            <tr className='SubTotal'>
              <td colSpan={2}>SubTotal:</td>
              <td>BDT 22 000. 00</td>
            </tr>

            <tr className='SubTotal'>
              <td colSpan={2}>Tax: VAT 12%</td>
              <td>BDT 2 640. 00</td>
            </tr>

            <tr className='Total'>
              <td colSpan={3}><h4><span>Total :</span> BDT 24 640. 00</h4></td>
            </tr>

          </table>

        </div>

      </div>


      <style jsx>{`

              @import url('https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400;500;600;700&display=swap');
              @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

              .InvoiceTwo {
                height: 100vh;
                position: relative;
                overflow-x: hidden;
                -webkit-print-color-adjust: exact;
                font-family: 'Roboto', sans-serif;
              }

              .InvoiceName {
                padding: 20px;
                display: flex;
                justify-content: space-between;
              }

              .InvoiceName h4 {
                font-size: 16px;
                line-height: 30px;
                font-weight: 500;
                color: #000;
                margin-top: 1px;
              }

              .InvoiceName h5 {
                font-size: 22px;
                line-height: 35px;
                font-weight: 600;
                color: #EE5100;
                margin-bottom: 10px;
              }

              .InvoiceName .Left {
                width: 50%;
                margin-right: 30px;
              }

              .InvoiceName li {
                font-size: 16px;
                line-height: 24px;
                font-weight: 400;
                color: #000;
                margin-top: 5px;
              }

              .InvoiceName li span {
                font-weight: 500;
              }

              .Header {
                padding: 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #EE5100;
              }

              .Header img {
                height: 80px;
              }

              .Header ul li {
                font-size: 16px;
                line-height: 24px;
                font-weight: 400;
                color: #fff;
                margin-bottom: 5px;
                display: flex;
                align-items: center;
              }

              .Header ul li .svg {
                margin-right: 10px;
                margin-top: 5px;
              }

              .Invoice {
                text-align: center;
              }

              .Invoice h2 {
                font-size: 50px;
                font-weight: 400;
                line-height: 60px;
                color: #000;
                border-bottom: 1px solid #EE5100;
                padding: 20px 0;
                font-family: 'Reem Kufi', sans-serif;
              }

              .Table {
                padding: 20px;
                text-align: left;
              }

              .Table table {
                width: 100%;
              }

              .Table th {
                font-weight: 500;
                font-size: 20px;
                line-height: 35px;
                color: rgba(238, 81, 0, 0.5);
                padding: 15px;
                background: #FFF;
              }

              .Table td {
                padding: 15px;
                font-size: 16px;
                line-height: 30px;
                font-weight: 400;
              }

              .Table tr:nth-child(even) {
                background: rgba(255, 162, 13, 0.1);
              }

              .Table tr:nth-child(odd) {
                background: rgba(207, 182, 146, 0.1);
              }

              .Table tr.SubTotal {
                background: #fff;
              }

              .SubTotal td:first-child {
                text-align: right;
                padding-right: 30px;
                font-weight: 600;
                font-size: 18px;
              }

              .Total {
                text-align: right;
                padding-right: 50px;
              }

              .Table tr.Total {
                background: #fff;
              }

              .Total h4 {
                background: #FFA20D;
                display: inline-block;
                color: #fff;
                padding: 10px 20px;
                font-weight: 600;
                font-size: 20px;
              }

              .Total h4 span {
                padding-right: 20px;
              }


            `}</style>

    </>

  )

}

export default InvoinceTwo