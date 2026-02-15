import MarketingTools from '../../Components/MarketingTools/MarketingTools';
import withAuth from '../../hook/PrivateRoute';
const index = ({ busInfo }) => {  
    return (
        <MarketingTools response={busInfo} />
    )

}

export default withAuth(index, {
    isProtectedRoute: true
});