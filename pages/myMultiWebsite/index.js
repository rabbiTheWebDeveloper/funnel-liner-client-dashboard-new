
import MyMultiWebsite from "../../Components/MyPage/MyMultiWebsite/MyMultiWebsite";
import withAuth from "../../hook/PrivateRoute";

;


const index = () => {
    return (
        <>
            <MyMultiWebsite/>

        </>
    );
};

export default withAuth(index, {
    isProtectedRoute: true,
    show: false,
});