import { useEffect, useState } from 'react';

import withAuth from '../../hook/PrivateRoute';
import { getWebsiteSettings } from '../api';
import PrivacyPolicy from '../../Components/MyPage/privacyPolicy/PrivacyPolicy';


const PrivacyPolicyPage = () => {
    const [websiteSettingData, setWebsiteSettingData]=useState({})
    useEffect(() => {
        getWebsiteSettings()
            .then((result) => {
                setWebsiteSettingData(result?.data?.data);
            })
            .catch(function (error) {
                return;
            });
    }, []);
    return (
        <>
           <PrivacyPolicy websiteSettingData={websiteSettingData}/>
        </>
    )
}
export default withAuth(PrivacyPolicyPage, {
    isProtectedRoute: true
});