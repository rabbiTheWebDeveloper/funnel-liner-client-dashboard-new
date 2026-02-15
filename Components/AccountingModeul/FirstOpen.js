import Link from 'next/link';
import React from 'react';
import { BsArrowRight } from 'react-icons/bs';
import CashIn from './CashIn';
import CashOut from './CashOut';

const FirstOpen = () => {
    return (

        <>

            <section className='AccountingFirstOpen'>

                <div className="Circle">

                    <div className="img">
                        <img src="/images/account-modeul.png" alt="" />
                    </div>

                    <div className="text">

                        <div className=""><Link href='/account-dashboard'>Hello! Let’s Make Today’s Entries <BsArrowRight/></Link></div>

                        <div className="DuelButton">

                            <CashIn data="check" />
                            <CashOut />

                        </div>

                    </div>
                </div>

            </section>

        </>

    )
}

export default FirstOpen
