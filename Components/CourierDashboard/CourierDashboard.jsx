import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import {
  Card,
  CardCell,
  CardCellBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "./_card/Card";
import style from "./style.module.css";
import { Button, Fade, Grid, Menu, MenuItem } from "@mui/material";
import { filterOrder } from "../HomePage/HomeUtlis";
import { useState } from "react";
import CustomDate from "../HomePage/HomePageCart/CustomDate";
import PieChartPage from "../HomePage/PainChart";
import { Badge } from "./_badge/Badge";
import {
  Table,
  TableBody,
  TableButton,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableTitle,
  TableTop,
} from "./_table/Table";

function Wallet({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="27"
      viewBox="0 0 30 27"
      fill="none"
      className={className}
    >
      <path
        d="M23.3027 7.54447V6.41114C23.3027 4.82433 23.3027 4.03091 22.9939 3.42484C22.7223 2.8917 22.2888 2.45826 21.7557 2.18663C21.1497 1.87781 20.3562 1.87781 18.7694 1.87781H6.58607C4.99924 1.87781 4.20584 1.87781 3.59976 2.18663C3.06663 2.45826 2.63319 2.8917 2.36155 3.42484C2.05273 4.03091 2.05273 4.82433 2.05273 6.41114V7.54447M2.05273 7.54447V20.0111C2.05273 21.5979 2.05273 22.3914 2.36155 22.9975C2.63319 23.5306 3.06663 23.9641 3.59976 24.2356C4.20584 24.5445 4.99924 24.5445 6.58607 24.5445H23.0194C24.6062 24.5445 25.3997 24.5445 26.0057 24.2356C26.5388 23.9641 26.9723 23.5306 27.2439 22.9975C27.5527 22.3914 27.5527 21.5979 27.5527 20.0111V12.0778C27.5527 10.491 27.5527 9.69758 27.2439 9.0915C26.9723 8.55837 26.5388 8.12492 26.0057 7.85329C25.3997 7.54447 24.6062 7.54447 23.0194 7.54447H2.05273ZM27.5527 13.2111H24.7194C23.1546 13.2111 21.8861 14.4796 21.8861 16.0445C21.8861 17.6093 23.1546 18.8778 24.7194 18.8778H27.5527"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight({ className, strokeWidth = 2 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 8L22 12L18 16" stroke="currentColor" />
      <path d="M2 12H22" stroke="currentColor" />
    </svg>
  );
}

function ExternalIcon({ className, strokeWidth = 2 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

const BgGlobe = `data:image/png;base64,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`;

export const CourierDashboard = () => {
  const [date, setTotalOrderDate] = useState("today");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const data = [
    {
      name: "Total Order",
      value: 100,
    },
  ];
  return (
    <main className={style.main}>
      <section className={style.section}>
        <div className={style.heading}>
          <h1>Payment Dashboard</h1>
        </div>

        <div className={style.tContainer}>
          <div className={style.walletContainer}>
            <div className={style.info}>
              <Card
                style={{
                  backgroundColor: "#9A3AFF",
                }}
                className={style.card}
              >
                <CardContent className={style.cardContent}>
                  <div className={style.icon}>
                    <Wallet className={style.wallet} />
                  </div>
                  <p className={style.balance}>৳*****</p>
                  <div className={style.checkBalanceBtn}>
                    <Button>
                      Check Balance
                      <ArrowRight className={style.arrow} />
                    </Button>
                  </div>

                  <p className={style.currentText}>Current Balance</p>
                  <div className={style.checkout}>
                    <Button>
                      Payment Request
                      <ExternalIcon className={style.externalIcon} />
                    </Button>
                  </div>

                  <div
                    className={style.bgGlobe}
                    style={{
                      backgroundColor: "#9A3AFF",
                      backgroundImage: `url(${BgGlobe})`,
                    }}
                  ></div>
                </CardContent>
              </Card>
            </div>
            <div className={style.pickup}>
              <Card>
                <CardContent>
                  <Button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="33"
                      height="28"
                      viewBox="0 0 33 28"
                      fill="none"
                      className={style.truckIcon}
                    >
                      <path
                        d="M31.7882 12.6327L27.177 7.44774C26.9265 7.16566 26.6188 6.94017 26.2744 6.78628C25.93 6.63239 25.5567 6.55363 25.1795 6.55524H20.9295V2.83649C20.9295 2.13567 20.6526 1.46324 20.159 0.965708C19.6655 0.46817 18.9953 0.185843 18.2945 0.180237H3.29199C2.58751 0.180237 1.91188 0.460091 1.41374 0.958234C0.915596 1.45638 0.635742 2.13201 0.635742 2.83649V20.899C0.635742 21.6035 0.915596 22.2791 1.41374 22.7772C1.91188 23.2754 2.58751 23.5552 3.29199 23.5552H3.99324C4.03209 24.7183 4.53021 25.8185 5.37855 26.6151C6.22689 27.4117 7.3563 27.8396 8.51949 27.8052C9.68476 27.8397 10.8165 27.4124 11.6682 26.6164C12.5199 25.8204 13.0227 24.7202 13.067 23.5552H20.802C20.8408 24.7183 21.339 25.8185 22.1873 26.6151C23.0356 27.4117 24.1651 27.8396 25.3282 27.8052C26.4935 27.8397 27.6252 27.4124 28.4769 26.6164C29.3287 25.8204 29.8314 24.7202 29.8757 23.5552C30.5599 23.5226 31.2055 23.2291 31.6798 22.735C32.1541 22.2409 32.4211 21.5839 32.4257 20.899V14.3965C32.4408 13.7496 32.2134 13.1205 31.7882 12.6327ZM8.51949 25.149C8.06048 25.1842 7.60616 25.0364 7.25579 24.7378C6.90541 24.4392 6.68744 24.014 6.64949 23.5552C6.68744 23.0964 6.90541 22.6713 7.25579 22.3727C7.60616 22.0741 8.06048 21.9262 8.51949 21.9615C8.98076 21.926 9.4375 22.0732 9.79127 22.3713C10.145 22.6694 10.3675 23.0946 10.4107 23.5552C10.3675 24.0158 10.145 24.441 9.79127 24.7391C9.4375 25.0373 8.98076 25.1845 8.51949 25.149ZM18.2945 9.04149V20.899H12.0682C11.6286 20.3908 11.0832 19.9849 10.4702 19.7096C9.85716 19.4343 9.19141 19.2963 8.51949 19.3052C7.85114 19.2994 7.18951 19.4389 6.58042 19.7141C5.97132 19.9893 5.42934 20.3936 4.99199 20.899H3.29199V2.83649H18.2945V9.04149ZM20.9507 9.21149H25.2007L28.2607 12.6752H20.9507V9.21149ZM25.3707 25.149C24.9117 25.1842 24.4574 25.0364 24.107 24.7378C23.7567 24.4392 23.5387 24.014 23.5007 23.5552C23.5387 23.0964 23.7567 22.6713 24.107 22.3727C24.4574 22.0741 24.9117 21.9262 25.3707 21.9615C25.832 21.926 26.2887 22.0732 26.6425 22.3713C26.9963 22.6694 27.2188 23.0946 27.262 23.5552C27.2188 24.0158 26.9963 24.441 26.6425 24.7391C26.2887 25.0373 25.832 25.1845 25.3707 25.149ZM25.3707 19.3052C24.7024 19.2994 24.0408 19.4389 23.4317 19.7141C22.8226 19.9893 22.2806 20.3936 21.8432 20.899H20.9507V15.3102H29.812V20.899H28.9195C28.4798 20.3908 27.9344 19.9849 27.3214 19.7096C26.7084 19.4343 26.0427 19.2963 25.3707 19.3052Z"
                        fill="currentColor"
                      />
                    </svg>
                    Pickup Request
                    <ExternalIcon className={style.externalIcon} />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className={style.cards}>
            <Card>
              <CardHeader>
                <CardTitle>Statistic</CardTitle>
                <div
                  className={`commonDropdown DropDown custom-dropdown flex-center ${style.dropdown}`}
                >
                  <div>
                    {date === "custom" && (
                      <CustomDate
                        setEndDate={setEndDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        startDate={startDate}
                      ></CustomDate>
                    )}
                  </div>
                  <PopupState variant="popover" popupId="DropDown">
                    {popupState => (
                      <>
                        <Button {...bindTrigger(popupState)}>
                          {filterOrder(date)}{" "}
                          <i className="flaticon-arrow-down-sign-to-navigate"></i>
                        </Button>

                        <Menu
                          id="fade-menu"
                          className="commonDropdownUl"
                          MenuListProps={{
                            "aria-labelledby": "fade-button",
                          }}
                          open={open}
                          TransitionComponent={Fade}
                          {...bindMenu(popupState)}
                        >
                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("today");
                              popupState.close();
                            }}
                          >
                            Today
                          </MenuItem>

                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("yesterday");
                              popupState.close();
                            }}
                          >
                            Yesterday
                          </MenuItem>
                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("weekly");
                              popupState.close();
                            }}
                          >
                            Weekly
                          </MenuItem>
                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("monthly");
                              popupState.close();
                            }}
                          >
                            Monthly
                          </MenuItem>
                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("all");
                              popupState.close();
                            }}
                          >
                            Life Time
                          </MenuItem>
                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("custom");
                              popupState.close();
                            }}
                          >
                            Custom
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </PopupState>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={style.content}
                  style={{ height: 120, width: 120, margin: "auto" }}
                >
                  <PieChartPage
                    height={120}
                    width={120}
                    innerRadius={25}
                    outerRadius={50}
                    newCannelList={data}
                  ></PieChartPage>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  In Transit
                  <Badge>25000</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={style.content}>
                  <CardCellBody>
                    <CardCell>
                      <h1>COD Amount</h1>
                      <h2>360</h2>
                    </CardCell>
                    <CardCell>
                      <h1>Delivery Charge</h1>
                      <h2>৳360</h2>
                    </CardCell>
                  </CardCellBody>
                  <CardCellBody>
                    <CardCell>
                      <h1>Received Amount</h1>
                      <h2>৳320</h2>
                    </CardCell>
                    <CardCell>
                      <h1>COD Charge</h1>
                      <h2>৳30</h2>
                    </CardCell>
                  </CardCellBody>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Delivery
                  <Badge color="#17A600">25000</Badge>
                </CardTitle>
                <div
                  className={`commonDropdown DropDown custom-dropdown flex-center ${style.dropdown}`}
                >
                  <div>
                    {date === "custom" && (
                      <CustomDate
                        setEndDate={setEndDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        startDate={startDate}
                      ></CustomDate>
                    )}
                  </div>
                  <PopupState variant="popover" popupId="DropDown">
                    {popupState => (
                      <>
                        <Button {...bindTrigger(popupState)}>
                          {filterOrder(date)}{" "}
                          <i className="flaticon-arrow-down-sign-to-navigate"></i>
                        </Button>

                        <Menu
                          id="fade-menu"
                          className="commonDropdownUl"
                          MenuListProps={{
                            "aria-labelledby": "fade-button",
                          }}
                          open={open}
                          TransitionComponent={Fade}
                          {...bindMenu(popupState)}
                        >
                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("today");
                              popupState.close();
                            }}
                          >
                            Today
                          </MenuItem>

                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("yesterday");
                              popupState.close();
                            }}
                          >
                            Yesterday
                          </MenuItem>
                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("weekly");
                              popupState.close();
                            }}
                          >
                            Weekly
                          </MenuItem>
                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("monthly");
                              popupState.close();
                            }}
                          >
                            Monthly
                          </MenuItem>
                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("all");
                              popupState.close();
                            }}
                          >
                            Life Time
                          </MenuItem>
                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("custom");
                              popupState.close();
                            }}
                          >
                            Custom
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </PopupState>
                </div>
              </CardHeader>
              <CardContent color="#17A600">
                <div className={style.content}>
                  <CardCellBody>
                    <CardCell>
                      <h1>COD Amount</h1>
                      <h2>360</h2>
                    </CardCell>
                    <CardCell>
                      <h1>Delivery Charge</h1>
                      <h2>৳360</h2>
                    </CardCell>
                  </CardCellBody>
                  <CardCellBody>
                    <CardCell>
                      <h1>Received Amount</h1>
                      <h2>৳320</h2>
                    </CardCell>
                    <CardCell>
                      <h1>COD Charge</h1>
                      <h2>৳30</h2>
                    </CardCell>
                  </CardCellBody>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Return
                  <Badge color="#FF1212">25000</Badge>
                </CardTitle>
                <div
                  className={`commonDropdown DropDown custom-dropdown flex-center ${style.dropdown}`}
                >
                  <div>
                    {date === "custom" && (
                      <CustomDate
                        setEndDate={setEndDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        startDate={startDate}
                      ></CustomDate>
                    )}
                  </div>
                  <PopupState variant="popover" popupId="DropDown">
                    {popupState => (
                      <>
                        <Button {...bindTrigger(popupState)}>
                          {filterOrder(date)}{" "}
                          <i className="flaticon-arrow-down-sign-to-navigate"></i>
                        </Button>

                        <Menu
                          id="fade-menu"
                          className="commonDropdownUl"
                          MenuListProps={{
                            "aria-labelledby": "fade-button",
                          }}
                          open={open}
                          TransitionComponent={Fade}
                          {...bindMenu(popupState)}
                        >
                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("today");
                              popupState.close();
                            }}
                          >
                            Today
                          </MenuItem>

                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("yesterday");
                              popupState.close();
                            }}
                          >
                            Yesterday
                          </MenuItem>
                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("weekly");
                              popupState.close();
                            }}
                          >
                            Weekly
                          </MenuItem>
                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("monthly");
                              popupState.close();
                            }}
                          >
                            Monthly
                          </MenuItem>
                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("all");
                              popupState.close();
                            }}
                          >
                            Life Time
                          </MenuItem>
                          <MenuItem
                            onClick={e => {
                              setTotalOrderDate("custom");
                              popupState.close();
                            }}
                          >
                            Custom
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </PopupState>
                </div>
              </CardHeader>
              <CardContent color="#FF1212">
                <div className={style.content}>
                  <CardCellBody>
                    <CardCell>
                      <h1>Delivery Charge</h1>
                      <h2>৳360</h2>
                    </CardCell>
                  </CardCellBody>
                  <CardCellBody>
                    <CardCell>
                      <h1>COD Amount</h1>
                      <h2>360</h2>
                    </CardCell>
                  </CardCellBody>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>In Transit</CardTitle>
            </CardHeader>
            <CardContent className="ghost">
              <Grid container>
                <Grid item xs={12} md={6} lg={3}>
                  <Card>
                    <CardHeader color="#F8F4F8">
                      <CardTitle>
                        Pending
                        <Badge color="#F28F1A">25000</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent color="#F28F1A">
                      <div className={style.content}>
                        <CardCellBody>
                          <CardCell>
                            <h1>COD Amount</h1>
                            <h2>360</h2>
                          </CardCell>
                          <CardCell>
                            <h1>Delivery Charge</h1>
                            <h2>৳360</h2>
                          </CardCell>
                        </CardCellBody>
                        <CardCellBody>
                          <CardCell>
                            <h1>Received Amount</h1>
                            <h2>৳320</h2>
                          </CardCell>
                          <CardCell>
                            <h1>COD Charge</h1>
                            <h2>৳30</h2>
                          </CardCell>
                        </CardCellBody>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                  <Card>
                    <CardHeader color="#F8F4F8">
                      <CardTitle>
                        Assigned
                        <Badge color="#0052F2">25000</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent color="#0052F2">
                      <div className={style.content}>
                        <CardCellBody>
                          <CardCell>
                            <h1>COD Amount</h1>
                            <h2>360</h2>
                          </CardCell>
                          <CardCell>
                            <h1>Delivery Charge</h1>
                            <h2>৳360</h2>
                          </CardCell>
                        </CardCellBody>
                        <CardCellBody>
                          <CardCell>
                            <h1>Received Amount</h1>
                            <h2>৳320</h2>
                          </CardCell>
                          <CardCell>
                            <h1>COD Charge</h1>
                            <h2>৳30</h2>
                          </CardCell>
                        </CardCellBody>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                  <Card>
                    <CardHeader color="#F8F4F8">
                      <CardTitle>
                        Delivery Approval Pending
                        <Badge color="#17A600">25000</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent color="#17A600">
                      <div className={style.content}>
                        <CardCellBody>
                          <CardCell>
                            <h1>COD Amount</h1>
                            <h2>360</h2>
                          </CardCell>
                          <CardCell>
                            <h1>Delivery Charge</h1>
                            <h2>৳360</h2>
                          </CardCell>
                        </CardCellBody>
                        <CardCellBody>
                          <CardCell>
                            <h1>Received Amount</h1>
                            <h2>৳320</h2>
                          </CardCell>
                          <CardCell>
                            <h1>COD Charge</h1>
                            <h2>৳30</h2>
                          </CardCell>
                        </CardCellBody>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                  <Card>
                    <CardHeader color="#F8F4F8">
                      <CardTitle>
                        Return Approval Pending
                        <Badge color="#FF1212">25000</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent color="#FF1212">
                      <div className={style.content}>
                        <CardCellBody>
                          <CardCell>
                            <h1>Delivery Charge</h1>
                            <h2>৳360</h2>
                          </CardCell>
                        </CardCellBody>
                        <CardCellBody>
                          <CardCell>
                            <h1>COD Amount</h1>
                            <h2>360</h2>
                          </CardCell>
                        </CardCellBody>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className={style.section}>
        <div className={style.table}>
          <TableTop>
            <TableTitle>Payment History</TableTitle>
            <TableButton>
              View All
              <ArrowRight className={style.arrow} />
            </TableButton>
          </TableTop>
          <Table>
            <TableHeader className={style.tableHeader}>
              <TableRow>
                <TableHead className={style.first}>Date</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Cash Collection</TableHead>
                <TableHead>Delivery Charge</TableHead>
                <TableHead>Sub Total</TableHead>
                <TableHead>COD Charge</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className={style.last1}>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>11-02-2024</TableCell>
                  <TableCell>SFC-20516092</TableCell>
                  <TableCell>6500</TableCell>
                  <TableCell>1090</TableCell>
                  <TableCell>5410</TableCell>
                  <TableCell>54</TableCell>
                  <TableCell>5356</TableCell>
                  <TableCell>
                    <p className="text-custom-green">Paid</p>
                  </TableCell>
                  <TableCell className={style.last}>
                    <Button className={style.underline_button}>
                      View <ArrowRight className={style.arrow} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className={style.table}>
          <TableTop>
            <TableTitle>Latest Returned Parcel</TableTitle>
            <TableButton>
              View All
              <ArrowRight className={style.arrow} />
            </TableButton>
          </TableTop>
          <Table>
            <TableHeader className={style.tableHeader}>
              <TableRow>
                <TableHead className={style.first}>Date</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Total Returned Parcels</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className={style.last1}>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>15/02/2024, 02:56 pm</TableCell>
                  <TableCell>325064</TableCell>
                  <TableCell>18</TableCell>
                  <TableCell>
                    <p className="text-custom-green">Received</p>
                  </TableCell>
                  <TableCell className={style.last}>
                    <Button className={style.underline_button}>
                      View <ArrowRight className={style.arrow} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
};
