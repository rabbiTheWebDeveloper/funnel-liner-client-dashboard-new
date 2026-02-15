import { Button } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { headers, shopId } from "../../pages/api";

const CustomDomainRequest = ({ shopName }) => {
  const router = useRouter();
  const [websiteSettingsData, setWebsiteSettingData] = useState({});
  const [openSales, setOpenSales] = useState(false);

  // ViewPreview
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [customDomain, setCustomDomain] = useState("");

  const onSubmit = (data) => {
    data.shop_name = shopName;
    data.shop_id = shopId;
    data.domain_status = "pending";
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/client/settings/domain/update`, data, {
        headers: headers,
      })
      .then(function (response) {
        setCustomDomain(response.data.msg);
        router.push("/?current_steap=panel5");
        Swal.fire(response?.data?.msg);
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.msg,
          footer: '<a href="">Why do I have this issue?</a>',
        });
      });

    setOpenSales(false);
    reset();
  };

  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/client/settings/business-info", {
        headers: headers,
      })
      .then(function (response) {
        // handle success
        setWebsiteSettingData(response?.data?.data);
      });
  }, [customDomain]);

  return (
    <div className="DomainRequest">
      <div className="Header">
        <h4>CUSTOMER CUSTOM DOMAIN REQUEST OPTION</h4>
        <h5>Read Before Sending Domain Request</h5>
      </div>

      <p>
        Before sending request for your custom domain, You need to add CNAME
        records (given In below table) In your custom domain From your domain
        registrar account (like namecheap, godaddy, FOR etc..). CNAME records
        are needed to point your custom domain to our domain ( fonnellIner.com
        ), so that our website can show your webs'. on your custom domain
        Different domain registrar (like godaddy, namecheap, POR etc..) has
        different interface for adding CNAME records. If you cannot find the
        place to add NAME record in your domain registrar account., then please
        contact your domain registrar support, they will show you the place to
        add CNAME record for your custom domain. They can also help you with
        adding CNAME record for you.{" "}
      </p>

      <div className="Table">
        <h5>
          Add CNAME records (take data from below table) in your custom domain
          from your domain registration panel:
        </h5>

        <table>
          <thead>
            <tr>
              <th>TYPE</th>
              <th>HOST</th>
              <th>VALUE</th>
              <th>TTL</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>CNAME Record</td>
              <td>www</td>
              <td> {websiteSettingsData?.domain_request ? `${websiteSettingsData?.domain_request}` : "your-custom-domain.com"}</td>
              <td>Automatic</td>
            </tr>

            <tr>
              <td>CNAME Record</td>
              <td>@</td>
              <td>secure.funnelliner.com</td>
              <td>Automatic</td>
            </tr>
          </tbody>
        </table>

        <h4 style={{ margin: "20px 0" }}>
          Use this if you are using cloudflare
        </h4>

        <table>
          <thead>
            <tr>
              <th>TYPE</th>
              <th>HOST</th>
              <th>VALUE</th>
              <th>TTL</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>A Record</td>
              <td>@</td>
              <td>104.16.243.78</td>
              <td>Automatic</td>
            </tr>
            <tr>
              <td>A Record</td>
              <td>@</td>
              <td>104.16.244.78</td>
              <td>Automatic</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Custom Domain Request */}
      <div className="ProductTable">
        <div className="customDomainRequest">
          <h5>Custom Domain Request</h5>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="customInput">
              <p>
                You already have a custom domain (funnelliner.com) connected
                with your portfolio website. if you request another domain now &
                if it gets connected with our server, then your current domain
                (funnelliner.com) will be removed{" "}
              </p>

              <label>
                Enter Your Custom Domain<span>*</span>
              </label>
              <input
                type="text"
                {...register("domain_request", { required: true })}
                placeholder="Enter domain name here"
              />

              {errors.domain_request && (
                <p className="error"> Your Custom Domain Name required</p>
              )}
            </div>

            <h6 style={{color: "red"}}>
              Do not use http:// or https:// The valid format will be exactly
              like this one - domain.tld or
              subdomain.domain.t1d 
            </h6>

            <div className="duelButton">
              <Button type="submit">Send Request</Button>
            </div>
          </form>
        </div>

        <div className="Table">
          <table>
            <thead>
              <tr>
                <th>Request Custom Domain</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{websiteSettingsData?.domain_request}</td>
                <td>{websiteSettingsData?.domain_status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomDomainRequest;
