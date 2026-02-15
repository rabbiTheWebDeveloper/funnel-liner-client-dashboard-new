import { Box, Container } from "@mui/material";
import { Button } from "../components/ui/button/button";
import { Tooltip } from "../components/ui/tooltip/tooltip";
import { Check, Copy, Globe, XIcon } from "lucide-react";
import Link from "next/link";
import styles from "../global.module.css";
import { cls } from "../lib/utils";

export const WebsiteSection = ({ data, isCopiedWebLink, copyWebLink }) => {
  return (
    <div
      className={cls(styles.domain, styles.mobile, styles["flex-center"])}
      style={{ display: "none" }}
    >
      <Tooltip
        className={
          data.domain_status !== "connecteds" &&
          styles["unverified-domain-tooltip"]
        }
        content={
          data.domain_status === "connecteds" ? (
            <div className={styles.domain_tooltip_content}>
              <Check /> Domain Verified
            </div>
          ) : (
            <div className={styles.domain_tooltip_content}>
              <XIcon />
              <span>
                Domain isn't verified. Please head to the{" "}
                <Link href="/website-setting">Website Settings</Link> to
                configure your domain.
              </span>
            </div>
          )
        }
        placement="top"
      >
        <a
          href={"//" + data.domain_request}
          target="_blank"
          className={cls(
            styles["flex-center"],
            data.domain_status !== "connecteds" &&
              styles["unverified-domain"]
          )}
        >
          {data.domain_status === "connecteds" ? <Globe /> : <XIcon />}
          {data.domain_request}
        </a>
      </Tooltip>
      <Tooltip
        content={isCopiedWebLink ? "Copied" : "Copy"}
        arrow
        placement="top"
      >
        <Button
          variant="outline"
          size="icon"
          className={cls(styles.web_copy, "box-shadow-none")}
          onClick={copyWebLink}
        >
          {isCopiedWebLink || isNaN(isCopiedWebLink) ? <Check /> : <Copy />}
        </Button>
      </Tooltip>
    </div>
  );
}; 