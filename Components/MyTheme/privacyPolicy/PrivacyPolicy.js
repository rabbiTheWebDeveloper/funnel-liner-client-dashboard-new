
import React, { useState, } from 'react'
import { Button, Container, } from "@mui/material";
import dynamic from 'next/dynamic'
import axios from 'axios';
import {  headers} from "../../../pages/api";
import { useToast } from '../../../hook/useToast';
import "react-quill-new/dist/quill.snow.css";
const QuillNoSSRWrapper = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});
function PrivacyPolicy({ websiteSettingData }) {
    const showToast = useToast()
    const [privacy_policy, setPrivacy_policy] = useState(websiteSettingData?.privacy_policy)

    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image', 'video'],
            ['clean'],
        ],
        clipboard: {

            matchVisual: false,
        },
    }

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
    ]

    const handleChangeEditor = (editor) => {
        setPrivacy_policy(editor)
    }
    const handleSubmitPrivacyPolicyData = () => {
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/client/settings/business-info/update`, { privacy_policy: privacy_policy, shop_name: websiteSettingData?.domain }, {
                headers: headers,
            })
            .then(function (response) {
               if(response.status === 200){
                showToast("Success", "success")
               }
               else{
                showToast("Something went wrong", "error")
               }
            })
            .catch(function (error) {
                showToast("Something went wrong", "error")
            });
    }
    return (
        <div className="WebsiteLink DashboardSetting">
            <Container maxWidth="sm">
                <div className="text_edit_formater boxShadow">
                    <QuillNoSSRWrapper  value={privacy_policy ?? websiteSettingData.privacy_policy} modules={modules} formats={formats} onChange={handleChangeEditor} placeholder="Privacy policy"  />
                    <div className="submitButtonForPages">
                        <Button onClick={handleSubmitPrivacyPolicyData} variant="contained">Submit</Button>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default PrivacyPolicy