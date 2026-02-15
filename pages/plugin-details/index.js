import PluginDetails from '../../Components/PluginPage/PluginDetailsPage/PluginDetails';
import withAuth from '../../hook/PrivateRoute';


const index = () => {


    return (


        <>


            <PluginDetails/>

        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});