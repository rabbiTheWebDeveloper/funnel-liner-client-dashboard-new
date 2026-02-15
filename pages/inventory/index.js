import Inventory from '../../Components/Stock/InventoryPage/Inventory';
import withAuth from '../../hook/PrivateRoute';


const index = () => {


    return (


        <>

          
            <Inventory/>

        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});