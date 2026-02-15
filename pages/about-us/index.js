
import { useEffect, useState } from 'react';
import AboutUs from '../../Components/MyPage/AboutUs/AboutUs';
import withAuth from '../../hook/PrivateRoute';
import { getWebsiteSettings } from '../api';
import useOrderLiveData from '../../hook/useOrderLiveData';


const AboutUsPage = () => {
    const [websiteSettingData, setWebsiteSettingData]=useState({})
    useEffect(() => {
        getWebsiteSettings()
            .then((result) => {
                setWebsiteSettingData(result?.data?.data);
            })
            .catch(function () {
                return;
            });
    }, []);
    return (
        <>
           <AboutUs websiteSettingData={websiteSettingData}/>
        </>
    )
}
export default withAuth(AboutUsPage, {
    isProtectedRoute: true
});