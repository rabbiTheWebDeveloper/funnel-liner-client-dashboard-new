import HomeSlider from '../../Components/MyPage/HomeSlider/HomeSlider';
import withAuth from '../../hook/PrivateRoute';



const index = () => {


    return (


        <>
            <HomeSlider/>

        </>

    )

}


export default withAuth(index, {
    isProtectedRoute: true
});