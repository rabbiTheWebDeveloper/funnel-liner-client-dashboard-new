import WebPages from '../../Components/WebPages/WebPages';
import withAuth from '../../hook/PrivateRoute';


const index = ({ busInfo }) => {


    return (


        <>
            <WebPages busInfo={busInfo} />

        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});