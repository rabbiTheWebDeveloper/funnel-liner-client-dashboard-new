import { Button } from "@mui/material";
import axios from "axios";
import React from 'react';
import { useForm } from "react-hook-form";
import { headers, shopId } from "../../pages/api";
import { useToast } from "../../hook/useToast";
import useLoading from "../../hook/useLoading";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";

const DomainVerification = ({ data }) => {
    const showToast = useToast()
    const [isLoading, startLoading, stopLoading] = useLoading()
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => {
        startLoading()
        const domain_verify_id = data.domain_verify.match(/content="([^"]+)"/)[1];
        const bodyData = {
            shop_id: shopId,
            domain_verify: domain_verify_id
        }
        axios.post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.WEBSITE_SETTINGS.DOMAIN_VERIFICATION}`, bodyData, {
            headers: headers,
        })
            .then(function (response) {
                showToast(response?.data?.msg)
                stopLoading()
            })
            .catch(function (error) {
                stopLoading()
                showToast("Something went wrong updating your domain", "error")
            });
    }

    const htmlString = '<meta name="facebook-domain-verification" content="test*****************************" />';
    const domainVerificationCode = (verificationCOde) => {
        if(verificationCOde){
            return `<meta name="facebook-domain-verification" content="${verificationCOde}" />`
        }
    }
    return (
        <div className='DashboardTabsItem DomainVerification'>

            <div className="customInput">
                <label>Verify Your Domain</label>
                <ul>
                    <li>1. Copy the meta-tag you see on your business settings screen.</li>
                    <li>2. Open your website’s home page HTML source.</li>
                    <li>3. Paste the meta-tag into the <head>...</head> section of the HTML code, and publish the page.</li>
                    <li>4. Go to the root domain of your website, and view the HTML source to confirm that the meta-tag is there.</li>
                </ul>
            </div>

            {/* Add Another Verification Meta Tag */}

            <div className="AddAnotherVerification">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* domain_verify */}
                    <div className="customInput">
                        <h4>Verify Your Domain</h4>
                        <pre>
                            {htmlString}
                        </pre>
                        <input defaultValue={domainVerificationCode(data?.domain_verify)} type="text" {...register("domain_verify", { required: true, pattern: /<meta\s+name="facebook-domain-verification"\s+content="([^"]+)"\s*\/>/g })} placeholder='Meta verification content' />
                        {errors.domain_verify && <p style={{ color: "red" }}>Valid meta tag required</p>}
                    </div>

                    {/* AddCancel */}
                    <div className="duelButton">
                        <Button disabled={isLoading} type="submit" >Save</Button>
                        <Button className="red">Reset</Button>
                    </div>
                </form>

            </div>


        </div>
    );
};

export default DomainVerification;