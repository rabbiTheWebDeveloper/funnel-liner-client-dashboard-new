import Courier from '../../Components/CourierPage/Courier';
import withAuth from '../../hook/PrivateRoute';


const index = () => {

    return (
        <>
            <Courier/>
        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});