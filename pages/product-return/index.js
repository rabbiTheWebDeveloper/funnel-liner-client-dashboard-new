
import ProductReturn from '../../Components/Stock/ProductReturnPage/ProductReturn';
import withAuth from '../../hook/PrivateRoute';


const index = () => {


    return (


        <>

            <ProductReturn/>

        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});