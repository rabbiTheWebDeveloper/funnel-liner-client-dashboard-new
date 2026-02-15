import { Button, Container } from "@mui/material";
import axios from 'axios';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useToast } from "../../../hook/useToast";
import { headers } from "../../../pages/api";
import useLoading from "../../../hook/useLoading";
import Spinner from "../../commonSection/Spinner/Spinner";

import "react-quill-new/dist/quill.snow.css";
const QuillNoSSRWrapper = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});
function TermsAndCondition({websiteSettingData}) {
    const [isLoading, startLoading, stopLoading] = useLoading()

    const [termsContent, setTermsContent] = useState(websiteSettingData?.tos)

    const showToast = useToast()
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
        setTermsContent(editor)
    }
    const handleSubmitTermsANdCOnditionData = () => {
        startLoading()
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/client/settings/business-info/update`, { tos: termsContent, shop_name: websiteSettingData?.domain }, {
                headers: headers,
            })
            .then(function (response) {
               if(response.status === 200){
                showToast("Success", "success")
               }
               else{
                showToast("Something went wrong!", "error")
               }
            })
            .catch(function (error) {
                showToast("Something went wrong!", "error")
            });
            stopLoading()
    }


    return (
        <div className="WebsiteLink DashboardSetting">
            <Container maxWidth="sm">
                <div className="text_edit_formater boxShadow">
                    <QuillNoSSRWrapper value={termsContent ?? websiteSettingData?.tos} modules={modules} formats={formats} onChange={handleChangeEditor}  placeholder="Term and Condition"  />
                    <div className="submitButtonForPages">
                        {/* <Button  variant="contained">Submit</Button> */}
                        {
                            isLoading ?  <Button disabled variant="contained">  <><Spinner /></>Submit</Button>: <Button onClick={handleSubmitTermsANdCOnditionData} variant="contained"> Submit</Button>
                        } 
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default TermsAndCondition