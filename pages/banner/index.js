
import Banner from '../../Components/MyPage/Banner/Banner';
import withAuth from '../../hook/PrivateRoute';


const index = () => {


    return (


        <>

        
            <Banner/>

        </>

    )

}


export default withAuth(index, {
    isProtectedRoute: true
});