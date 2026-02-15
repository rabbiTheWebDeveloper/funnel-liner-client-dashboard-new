import { Box, Button } from "@mui/material";
import Clipboard from "clipboard";
import Link from "next/link";
import React, { useState } from "react";
import { domain } from "../../pages/api";

const WebsiteLink = ({ busInfo = {}, currentDashboard = "new" }) => {
  const [mas, setMas] = useState("");
  const { domain_status, domain_request } = busInfo;

  const textToCopy =
    domain_status === "connected"
      ? `https://${domain_request}`
      : `https://funnelliner.com/${domain}`;

  const handleClick = () => {
    const clipboard = new Clipboard(".SocialLink", {
      text: () => textToCopy,
    });
    clipboard.on("success", (e) => {
      setMas("Copied to Link!");
      e.clearSelection();
      setTimeout(() => setMas(""), 1000);
    });
    clipboard.on("error", () => {});
  };

  return (
    <div className="WebsiteLinkContent d_flex d_justify" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div className="left">
        <ul>
          <li>
            <h5>
              Visit the following link to view your website{" "}
              {domain_status === "connected" ? (
                <Link
                  target="_blank"
                  href={`https://${domain_request}`}
                  rel="noopener noreferrer"
                >
                  {domain_request}
                </Link>
              ) : (
                <Link
                  target="_blank"
                  href={`https://funnelliner.com/${domain}`}
                  rel="noopener noreferrer"
                >
                  https://funnelliner.com/{domain}
                </Link>
              )}
            </h5>
          </li>

          <li>
            <Link
              href={
                domain_status === "connected"
                  ? `https://${domain_request}`
                  : `https://funnelliner.com/${domain}`
              }
              target="_blank"
            >
              Visit Store <i className="flaticon-browser-1"></i>
            </Link>
          </li>

          <li>
            <Button
              onClick={handleClick}
              className="SocialLink"
              alt="Copy to clipboard"
              variant="outlined"
            >
              Copy Link <i className="flaticon-link-2"></i>
            </Button>
            {mas && <span style={{ marginLeft: "10px" }}>{mas}</span>}
          </li>

          {domain_status !== "connected" && (
            <li>
              <Link href="/website-setting?domain=3">
                Add Your Custom Domain Name <i className="flaticon-browser-1"></i>
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Dashboard Switcher Button - Right Side */}
      <Box>
        {currentDashboard === "new" ? (
          <Link href="/dashboard/classic" passHref>
            <Button variant="contained" color="secondary">
              Switch to Classic Dashboard
            </Button>
          </Link>
        ) : (
          <Link href="/" passHref>
            <Button variant="contained" color="primary">
              Switch to New Dashboard
            </Button>
          </Link>
        )}
      </Box>
    </div>
  );
};

export default WebsiteLink;
