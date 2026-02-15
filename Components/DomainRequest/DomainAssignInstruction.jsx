import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import style from "./style.module.css";
import axios from "axios";
import { headers } from "../../pages/api";

const Instrunction = ({ children, value, index, ...rest }) => {
  return (
    <div className={style.instrunction} hidden={value !== index} {...rest}>
      {children}
      <Instrunctions>
      <div className={style.instrunctionTitle}>
        <h1>Depending on your provider, it might take some time for the DNS records to apply.</h1>
      </div>
      </Instrunctions>
    </div>
  );
};

const Instrunctions = ({ children }) => {
  return <ul className={style.instrunctions}>{children}</ul>;
};

const Item = ({ children }) => {
  return <li className={style.item}>{children}</li>;
};

export const DomainAssignInstruction = () => {
  const [value, setValue] = React.useState(0);

  const [websiteSettingsData, setWebsiteSettingData] = useState({});

  const [domainRecords, setDomainRecords] = useState({
    cnameRecords: ["No CNAME Found"],
    aRecords: ["No A Record Found"],
    nsRecords: ["No Nameservers Found"]
  });
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const websiteSettingsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/client/settings/business-info`,
          { headers }
        );
        setWebsiteSettingData(websiteSettingsResponse?.data?.data);

        const domainRecordsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/client/settings/dns-records`,
          { headers }
        );
        setDomainRecords(domainRecordsResponse?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={style.domainAssignInstruction}>
      <div className={style.tabs}>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          aria-label="disabled tabs example"
          classes={{
            indicator: style.tabsIndicator,
            flexContainer: style.tabsFlex,
          }}
          onChange={handleChange}
        >
          <Tab
            label="A & CNAME Record"
            className={style.tabButton}
            classes={{ selected: style.tabSelected }}
          />
          <Tab
            label="Nameservers"
            className={style.tabButton}
            classes={{ selected: style.tabSelected }}
          />
        </Tabs>
      </div>

      <Instrunction value={value} index={0}>
          <div className={style.instrunctionTitle}>
            <h1>Depending on your provider, it might take some time for the DNS records to apply.</h1>
          </div>
        <Instrunctions>
          <Item>
            <h1>Type</h1>
            <pre>A</pre>
            <pre>CNAME</pre>
          </Item>
          <Item>
            <h1>Name</h1>
            <pre>@</pre>
            <pre>www</pre>
          </Item>
          <Item>
            <h1>TTL</h1>
            <pre>3600</pre>
            <pre>3600</pre>
          </Item>
          <Item>
            <h1>Value</h1>
            <pre>163.61.156.64</pre>
            <pre>secure.funnelliner.com</pre>
          </Item>
        </Instrunctions>
          <div className={style.instrunctionTitle} style={{ "padding-top": "20px" }}>
            <h1>Current A & CNAME Record:</h1>
          </div>
        <Instrunctions>
        <Item>
            <h1>Current CNAME Records</h1>
            {domainRecords.cnameRecords.map((record, index) => (
              <pre key={index}>{record}</pre>
            ))}
          </Item>
          <Item>
            <h1>Current A Records</h1>
            {domainRecords.aRecords.map((record, index) => (
              <pre key={index}>{record}</pre>
            ))}
          </Item>
          </Instrunctions>
      </Instrunction>
      <Instrunction value={value} index={1}>
          {/* <div className={style.instrunctionTitle}>
            <h1>Set the nameservers of <b> {websiteSettingsData?.domain_request ? `${websiteSettingsData?.domain_request}` : "yourwebsite.com"} </b> (apex domain) to:</h1>
          </div>
        <Instrunctions>
          <Item>
            <pre>ns1.funnelliner.com</pre>
            <pre>ns2.funnelliner.com</pre>
          </Item>
        </Instrunctions> */}
          <div className={style.instrunctionTitle}>
            <h1>Current nameservers:</h1>
          </div>
        <Instrunctions>
          <Item>
            {domainRecords.nsRecords.map((record, index) => (
              <pre key={index}>{record}</pre>
            ))}
          </Item>
          </Instrunctions>
      </Instrunction>
    </div>
  );
};
