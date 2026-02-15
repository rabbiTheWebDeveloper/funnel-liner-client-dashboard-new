import React from "react";
import { TbCurrencyTaka } from "react-icons/tb";

const AccountBalance = ({balance}) => {
  return (
    <React.Fragment>
      <div className="HeaderItemContent">
        <div className="HeaderItem d_flex">
          <div className="img">
            <img src="/images/account-plus.png" alt="" />
          </div>

          <div className="text">
            <h5>Cash In</h5>
            <h3>
              <TbCurrencyTaka />
              {balance?.cashIn
                ? balance?.cashIn
                  ?.toFixed(0)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : "00"}
            </h3>
          </div>

          <div className="overlay">
            <img src="/images/account-plus-overlay.png" alt="" />
          </div>
        </div>
      </div>

      <div className="HeaderItemContent">
        <div className="HeaderItem Minus d_flex">
          <div className="img">
            <img src="/images/account-minus.png" alt="" />
          </div>

          <div className="text">
            <h5>Cash Out</h5>
            <h3>
              <TbCurrencyTaka />
              {balance?.cashOut
                ? balance?.cashOut
                  ?.toFixed(0)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : "00"}
            </h3>
          </div>

          <div className="overlay">
            <img src="/images/account-minus-overlay.png" alt="" />
          </div>
        </div>
      </div>

      <div className="HeaderItemContent">
        <div className="HeaderItem Equal d_flex">
          <div className="img">
            <img src="/images/account-equal.png" alt="" />
          </div>

          <div className="text">
            <h5>Balance</h5>
            <h3>
              <TbCurrencyTaka />

              {balance?.balance
                ? balance?.balance
                  ?.toFixed(0)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : "00"}
            </h3>
          </div>

          <div className="overlay">
            <img src="/images/account-equal-overlay.png" alt="" />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default AccountBalance;