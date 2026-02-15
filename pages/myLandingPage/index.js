
import MyLandingPage from "../../Components/MyPage/MyLandingPage/MyLandingPage";
import withAuth from "../../hook/PrivateRoute";




const index = () => {
    return (
        <>
           
            <MyLandingPage/>

        </>
    );
};

export default withAuth(index, {
    isProtectedRoute: true,
    show: false,
});