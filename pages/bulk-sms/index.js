
import BulkSms from '../../Components/BulkSmsPage/BulkSms';
import withAuth from '../../hook/PrivateRoute';


const index = ({busInfo , handelFetchBusInfo}) => {
    return (
        <>
            <BulkSms busInfo={busInfo} handelFetchBusInfo={handelFetchBusInfo}/>

        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});