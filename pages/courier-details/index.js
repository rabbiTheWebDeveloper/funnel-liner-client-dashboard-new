
import CourierDetails from '../../Components/CourierPage/CourierDetails';
import withAuth from '../../hook/PrivateRoute';


const index = () => {


    return (


        <>

         
            <CourierDetails/>

        </>

    )

}
export default withAuth(index, {
  isProtectedRoute: true
});