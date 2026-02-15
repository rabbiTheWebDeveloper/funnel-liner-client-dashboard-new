import axios from 'axios';
import { useEffect, useState } from 'react';
// import Product from '../../Components/ProductPage/Product';
import Product from '../../Components/Products/ProductPage/Product';
import withAuth from '../../hook/PrivateRoute';
import { headers } from '../api';


const ProductPage = ({busInfo}) => {
   
    return (
        <Product  busInfo={busInfo} />
    )

}

export default withAuth(ProductPage, {
    isProtectedRoute: true
});