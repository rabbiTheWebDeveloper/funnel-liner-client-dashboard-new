import { Button, Container, Grid } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import style from "./style.module.css";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import axios from "axios";
import { useRouter } from "next/router";
import { domain, headers } from "../../../pages/api";

const FirstSetup = ({ skip, busInfo = {}, shopStep }) => {
  const { domain_status, domain_request } = busInfo;
  const router = useRouter();
  const [expanded, setExpanded] = useState();

  useEffect(() => {
    if (router?.query?.current_steap) {
      setExpanded(router?.query?.current_steap);
    } else if (router?.query?.current_steap === false) {
      setExpanded("panel1");
    }
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // const [shopStep, setShopStep] = useState({});
  // const handleFetchShopStep = async () => {
  //   try {
  //     let data = await axios({
  //       method: "get",
  //       url: `${process.env.NEXT_PUBLIC_API_URL}/client/shop-steps`,
  //       headers: headers,
  //     });
  //     setShopStep(data?.data?.data);
  //   } catch (err) { }
  // };

  // useEffect(() => {
  //   handleFetchShopStep();
  // }, []);

  const stepCount = (count) => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(<li key={i}></li>);
    }

    return items;
  };

  return (
    <>
      <div className={style.FirstSetup}>
        <Container maxWidth="sm">
          <Grid item md={12}>
            <div className={style.FirstSetupContent}>
              {/* header */}
              <div className={style.Header}>
                <div className={style.left}>
                  <h3>Let's set up your Shop</h3>
                </div>

                <div className={style.middle}>
                  <h5>{shopStep?.total_task}/6 tasks completed</h5>
                  <div className={style.complete}>
                    <ul>{stepCount(shopStep?.total_task)}</ul>
                  </div>
                </div>

                <div className={style.right}>
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
                </div>
              </div>

              {/* TabsItem */}
              <div className={style.TabsItem}>
                {/* item 1 */}
                <Accordion
                  expanded={expanded === "panel1"}
                  onChange={handleChange("panel1")}
                  className={style.TabsItemContent}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={`${style.headerH2} ${shopStep.business_info === 1 && style.done
                      }`}
                  >
                    <div className={style.headerH2Content}>
                      <div className={style.img}>
                        <img
                          src="/images/first-setup/start-header.svg"
                          alt=""
                        />
                        <h5>1</h5>
                      </div>

                      <h4>Shop Info</h4>
                    </div>
                  </AccordionSummary>

                  <AccordionDetails>
                    <div className={style.TabsItemDescription}>
                      <div className={style.left}>
                        <h3>Name your Shop</h3>
                        <p>
                          Your temporary store name is currently My Store. The
                          store name appears in your admin and your online
                          store. Learn more about store names
                        </p>

                        <Link href="/dashboard-setting?redirect_from=panel1">
                          Add Shop Info
                        </Link>
                      </div>

                      <div className={style.right}>
                        <img src="/images/first-setup/1.png" alt="" />
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>

                {/* item 2 */}
                <Accordion
                  expanded={expanded === "panel2"}
                  onChange={handleChange("panel2")}
                  className={style.TabsItemContent}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={`${style.headerH2} ${shopStep.product_info === 1 && style.done
                      }`}
                  >
                    <div className={style.headerH2Content}>
                      <div className={style.img}>
                        <img
                          src="/images/first-setup/start-header.svg"
                          alt=""
                        />
                        <h5>2</h5>
                      </div>

                      <h4>Add your first product</h4>
                    </div>
                  </AccordionSummary>

                  <AccordionDetails>
                    <div className={style.TabsItemDescription}>
                      <div className={style.left}>
                        <h3>Add first products to sell</h3>
                        <p>
                          Build your catalog by adding what you want to sell.
                          You can add products manually or import them from a
                          different store.
                        </p>

                        <Link href="/add-product?redirect_from=panel2">
                          Add products
                        </Link>
                      </div>

                      <div className={style.right}>
                        <img src="/images/first-setup/2.png" alt="" />
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>

                {/* item 3 */}
                <Accordion
                  expanded={expanded === "panel3"}
                  onChange={handleChange("panel3")}
                  className={style.TabsItemContent}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={`${style.headerH2} ${shopStep.desing_website === 1 && style.done
                      }`}
                  >
                    <div className={style.headerH2Content}>
                      <div className={style.img}>
                        <img
                          src="/images/first-setup/start-header.svg"
                          alt=""
                        />
                        <h5>3</h5>
                      </div>

                      <h4>Design your website </h4>
                    </div>
                  </AccordionSummary>

                  <AccordionDetails>
                    <div className={style.TabsItemDescription}>
                      <div className={style.left}>
                        <h3>Design website</h3>
                        <p>
                          Choose a theme and add your logo, colors, and images
                          to reflect your brand.
                        </p>

                        <Link href="/multi-page?redirect_from=panel3">
                          Customize Website
                        </Link>
                      </div>

                      <div className={style.right}>
                        <img src="/images/first-setup/3.png" alt="" />
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>

                {/* item 4 */}
                <Accordion
                  expanded={expanded === "panel4"}
                  onChange={handleChange("panel4")}
                  className={style.TabsItemContent}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={`${style.headerH2} ${shopStep.custom_domain === 1 && style.done
                      }`}
                  >
                    <div className={style.headerH2Content}>
                      <div className={style.img}>
                        <img
                          src="/images/first-setup/start-header.svg"
                          alt=""
                        />
                        <h5>4</h5>
                      </div>

                      <h4>Add your custom domain</h4>
                    </div>
                  </AccordionSummary>

                  <AccordionDetails>
                    <div className={style.TabsItemDescription}>
                      <div className={style.left}>
                        <h3>Domain Name</h3>
                        <p>
                          Your current domain is{" "}
                          <span style={{fontWeight:"500"}}>
                            {
                              domain_status === "connected"
                                ? `https://${domain_request}`
                                : `https://funnelliner.com/${domain} `
                            }                 
                          </span>
                          {
                            domain_status !== "connected" && "but you can add a custom domain to help customers find your  online store"
                          }
                           
                        </p>

                        <Link href="/website-setting?domain=3&redirect_from=panel4">
                          Add domain
                        </Link>
                      </div>

                      <div className={style.right}>
                        <img src="/images/first-setup/4.png" alt="" />
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>

                {/* item 5 */}
                <Accordion
                  expanded={expanded === "panel5"}
                  onChange={handleChange("panel5")}
                  className={style.TabsItemContent}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={`${style.headerH2} ${shopStep.courier === 1 && style.done
                      }`}
                  >
                    <div className={style.headerH2Content}>
                      <div className={style.img}>
                        <img
                          src="/images/first-setup/start-header.svg"
                          alt=""
                        />
                        <h5>5</h5>
                      </div>

                      <h4>Courier API Integration</h4>
                    </div>
                  </AccordionSummary>

                  <AccordionDetails>
                    <div className={style.TabsItemDescription}>
                      <div className={style.left}>
                        <h3>
                          Deliver your products with your preferred courier
                          service
                        </h3>
                        <p>
                          For the best delivery service, add your favourite
                          courier service API
                        </p>
                        <p>
                          For the best delivery service, add the api for your
                          favourite courier provider
                        </p>
                        <p>
                          Add your chosen courier service api for the best
                          delivery service
                        </p>

                        <Link href="/courier?redirect_from=panel5">
                          Add Courier API
                        </Link>
                      </div>

                      <div className={style.right}>
                        <img src="/images/first-setup/5.png" alt="" />
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>

                {/* item 6 */}
                <Accordion
                  expanded={expanded === "panel6"}
                  onChange={handleChange("panel6")}
                  className={style.TabsItemContent}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={`${style.headerH2} ${shopStep.landing_page === 1 && style.done
                      }`}
                  >
                    <div className={style.headerH2Content}>
                      <div className={style.img}>
                        <img
                          src="/images/first-setup/start-header.svg"
                          alt=""
                        />
                        <h5>6</h5>
                      </div>

                      <h4>Choose your Landing page</h4>
                    </div>
                  </AccordionSummary>

                  <AccordionDetails>
                    <div className={style.TabsItemDescription}>
                      <div className={style.left}>
                        <h3>
                          Add your landing page to get a quick overview of the
                          whole business scenario
                        </h3>
                        <p>
                          To see the entire business picture at a glance, add
                          your landing page
                        </p>
                        <p>
                          Add your landing page to see the entire business
                          scenario  at a look
                        </p>

                        <Link href="/landing-page?redirect_from=panel6">
                          Import Landing Page
                        </Link>
                      </div>

                      <div className={style.right}>
                        <img src="/images/first-setup/6.png" alt="" />
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>

              {/* SkipAll */}
              <div className={style.SkipAll}>
                <Button onClick={skip}>Skip All</Button>
              </div>
            </div>
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default FirstSetup;
