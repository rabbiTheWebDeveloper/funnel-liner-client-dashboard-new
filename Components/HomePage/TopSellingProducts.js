
import React, { useEffect, useState } from "react";
import { topSellingProducts } from "../../pages/api";




const TopSellingProducts = () => {
    const [TopSellingProducts, setTopSellingProduct] = useState([]);
    useEffect(() => {
        topSellingProducts().then((result) => {
            setTopSellingProduct(result?.data?.data);
        });
    }, []);

    return (

        <>
 

            <div className="TopSelling boxShadow">

                {/* header */}
                <div className="Header d_flex d_justify">

                    <div className="left">
                        <h4>Top Selling Products </h4>
                    </div>

                </div>

                <div className="TopSellingBox">

                    {TopSellingProducts?.map((item, index) => {
                        return (
                            <div className="TopSellingContent">

                                {/* item */}
                                <div className="item">

                                    <div className="img d_flex">
                                        <img src={item?.product_main_image ?? '/images/placeholder.png'} alt="" />
                                        <p>{item?.product_name}</p>
                                    </div>

                                </div>

                                {/* item */}
                                {/* <div className="item">
                                    <h4> <i className="flaticon-taka"></i> 34,35465.00</h4>
                                </div> */}

                                {/* item */}
                                <div className="item">
                                    <h6>Total Sold</h6>
                                    <span>{item?.total}</span>
                                </div>

                                {/* item */}
                                <div className="item">
                                    <h6>Available Stock</h6>
                                    <span>{item?.product_qty < 0 ? <span style={{ color: 'red' }}>stock out</span>: item?.product_qty}</span>
                                </div>

                            </div>

                        )
                    })}

                


               

                </div>

            </div>

        </>
    );
};

export default TopSellingProducts;
