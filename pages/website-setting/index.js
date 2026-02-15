import WebsiteSettingPage from '../../Components/WebsiteSettingPage/WebsiteSettingPage';
import withAuth from '../../hook/PrivateRoute';
const WebsiteSettingPage_2 = ({ busInfo, myAddonsList  }) => {
    return (
        <WebsiteSettingPage response={busInfo} myAddonsList={myAddonsList} />
    )

}

export default withAuth(WebsiteSettingPage_2, {
    isProtectedRoute: true
});