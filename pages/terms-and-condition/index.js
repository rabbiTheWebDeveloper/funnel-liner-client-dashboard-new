import { useEffect, useState } from 'react';

import withAuth from '../../hook/PrivateRoute';
import { getWebsiteSettings } from '../api';
import TermsAndCondition from '../../Components/MyPage/TermsAndCondition/TermsAndCondition';


const TermsAndConditionPage = () => {
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
           <TermsAndCondition websiteSettingData={websiteSettingData}/>
        </>
    )
}
export default withAuth(TermsAndConditionPage, {
    isProtectedRoute: true
});