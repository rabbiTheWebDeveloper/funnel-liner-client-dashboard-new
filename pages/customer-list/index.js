import {
  Box,
  Button,
  Container,
  Pagination,
  TextField,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  Stack
} from "@mui/material";
import { styled } from "@mui/material/styles";
import download from "downloadjs";
import { saveAs } from "file-saver";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import "jspdf-autotable";
import _ from "lodash";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import withAuth from "../../hook/PrivateRoute";
import { headers } from "../api";
import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";
import style from "./customerList.module.css";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import axios from "axios";

const BootstrapButton = styled(Button)({
  backgroundColor: "#fff",
  border: "1px solid #894bca",
  color: "#894bca",
  marginRight: "10px",
  "&:hover": {
    backgroundColor: "#894bca",
    borderColor: "#894bca",
    boxShadow: "none",
    color: "#fff",
  },
});

const FilterDateInput = styled(TextField)({
  "& .MuiInputBase-root": {
    height: "42px",
    marginRight: "10px",
    width: "250px",
  },
});

const Paginator = styled(Pagination)({
  "& .MuiPagination-ul": {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    marginTop: "10px",
  },
});

const menuItemHoverStyle = {
  "&:hover": {
    backgroundColor: "#894bca",
    color: "#fff",
  },
  "&.Mui-selected": {
    backgroundColor: "#894bca",
    color: "#fff",
  },
};

const CustomerListPage = () => {
  const [search, setSearch] = useState("");
  const [active, setDefault] = useState("all");
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [callCount, setCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [perPage, setPerPage] = useState(10);
  const handleFetchCustomer = useCallback(async () => {
    try {
      const params = {
        order_status: active,
        page: currentPage,
        limit: perPage
      }
      let data = await axios({
        method: "get",
        url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMERS}`,
        headers: headers,
        params
      });
      if (data?.data?.success) {
        setCustomers(data.data?.data);
        setTotalPage(data?.data?.last_page);
      }
    } catch (err) { }
  }, [active, currentPage , perPage]);


  const selectedData = customers?.map((obj) =>
    _.pick(obj, ["name", "phone", "address", "type", "order_count", "created_at"])
  );
  const generateExcelFile = (data) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "CCCCCC" } },
    };
    const dataStyle = { fill: { fgColor: { rgb: "FFFFFF" } } };
    const headerRange = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const headerCell = XLSX.utils.encode_cell({ r: headerRange.s.r, c: col });
      worksheet[headerCell].s = headerStyle;
    }
    const dataRange = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let row = dataRange.s.r + 1; row <= dataRange.e.r; row++) {
      for (let col = dataRange.s.c; col <= dataRange.e.c; col++) {
        const cell = XLSX.utils.encode_cell({ r: row, c: col });
        worksheet[cell].s = dataStyle;
      }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    return file;
  };

  const downloadExcelFile = async () => {
    const file = generateExcelFile(selectedData);
    saveAs(file, `${active}_list.xlsx`);
  };

  const downlodeImage = () => {
    htmlToImage
      .toPng(document.getElementById("downlode_customer_list"))
      .then(function (dataUrl) {
        download(dataUrl, `${active}_list.jpg`);
      });
  };
  const generateCustomerPDF = (customers, fileName) => {
    const doc = new jsPDF();

    doc.autoTable({
      theme: "grid",
      head: [["SL.", "Customer Name", "Contact No.", "Address", "Purchase Date"]],
      body: customers.map((customer, index) => [
        index + 1,
        customer.name,
        customer.phone,
        customer.address,
        moment(customer.created_at).format("DD-MM-YYYY"),
      ]),
      beforePageContent: function (data) {
        const title = "";
        const pageWidth = doc.internal.pageSize.width;
        const titleWidth = (doc.getStringUnitWidth(title) * 14) / doc.internal.scaleFactor;
        const titlePosition = (pageWidth - titleWidth) / 2;

        doc.text(title, titlePosition, 8, { align: "center" });
      },
    });

    try {
      doc.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };


  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    // Perform corresponding action based on the selected option
    switch (event.target.value) {
      case "pdf":
        // handelPdf();
        generateCustomerPDF(customers, active);
        break;
      case "image":
        downlodeImage();
        break;
      case "excel":
        downloadExcelFile();
        break;
      default:
        break;
    }
  };

  const handleFetchSearch = useCallback(async () => {
    const params = {
      search: search
    }
    try {
      if (search.length > 0) {
        const searchResponse = await axios.get(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CUSTOMERS.CUSTOMERS_SEARCH}`, {
          headers: headers,
          params
        });
        if (searchResponse?.data?.success) {
          setCustomers(searchResponse.data?.data);
        }
      }
    } catch (error) { }
  }, [search]);



  useEffect(() => {
    handleFetchCustomer();
  }, [handleFetchCustomer]);

  useEffect(() => {
    handleFetchSearch();
  }, [handleFetchSearch]);
  const handlePerPageChange = event => {
    const perPageValue = parseInt(event.target.value);
    setPerPage(perPageValue);
    setCurrentPage(1);
  };
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <div>
      <section className={style.CustomerList}>
        {/* header */}
        <HeaderDescription
          headerIcon={"flaticon-people"}
          title={"Customer List"}
          subTitle={"List  Of  Customers"}
          search={true}
          setSearch={setSearch}
          order={false}
        />

        <Container maxWidth="sm">
          <div className="">
            <div className={style.CustomerListContent}>
              <div className="CommonTab">
                <Box sx={{ width: "100%", typography: "body1" }}>
                  <BootstrapButton
                    className={active === "all" ? "filterActive" : ""}
                    onClick={() => {
                      setDefault("all"); setSelectedOption("");
                      setCurrentPage(1)
                    }}
                  >
                    Pending Order{" "}
                  </BootstrapButton>
                  <BootstrapButton
                    className={active === "follow_up" ? "filterActive" : ""}
                    onClick={() => {
                      setDefault("follow_up"); setSelectedOption("");
                      setCurrentPage(1)
                    }}
                  >
                    Follow Up Order{" "}
                  </BootstrapButton>
                  <BootstrapButton
                    className={active === "confirmed" ? "filterActive" : ""}
                    onClick={() => {
                      setDefault("confirmed"); setSelectedOption("");
                      setCurrentPage(1)
                    }}
                  >
                    Confirm Order{" "}
                  </BootstrapButton>

                  <BootstrapButton
                    className={active === "delivered" ? "filterActive" : ""}
                    onClick={() => {
                      setDefault("delivered"); setSelectedOption("");
                      setCurrentPage(1)
                    }}
                  >
                    Delivered  Order{" "}
                  </BootstrapButton>
                  <BootstrapButton
                    className={active === "cancelled" ? "filterActive" : ""}
                    onClick={() => {
                      setDefault("cancelled"); setSelectedOption("");
                      setCurrentPage(1)
                    }}
                  >
                    Cancel Order{" "}
                  </BootstrapButton>

                  <BootstrapButton
                    className={active === "returned" ? "filterActive" : ""}
                    onClick={() => {
                      setDefault("returned"); setSelectedOption("");
                      setCurrentPage(1)
                    }}
                  >
                    Order Return{" "}
                  </BootstrapButton>
                </Box>
              </div>
            </div>

            <div className={style.select}>
              <select
                name="downloadReport"
                value={selectedOption}
                onChange={handleOptionChange}
              >
                <option value="" disabled>
                  Download Report
                </option>
                <option value="pdf">As PDF</option>
                <option value="image">As Image</option>
                <option value="excel">As Excel</option>
              </select>
            </div>
          </div>

          <div className="DataTableContent" id="downlode_customer_list">
            <div className="DataTable">
              {/* DataTableRow */}
              <div className="DataTableRow">
                <div className="DataTableColum">
                  <h3>SL</h3>
                </div>
                <div className="DataTableColum">
                  <h3>OnBoarding Date</h3>
                </div>

                <div className="DataTableColum Address">
                  <h3>Customer Name</h3>
                </div>

                <div className="DataTableColum Address">
                  <h3>Contact No.</h3>
                </div>

                <div className="DataTableColum">
                  <h3>Address</h3>
                </div>


                <div className="DataTableColum">
                  <h3>Total Order</h3>
                </div>
              </div>

              {/* DataTableRow */}
              {/* item */}

              {customers.length > 0 ? (
                customers.map((order, index) => {
                  return (
                    <div className="DataTableRow" key={index}>
                      <div className="DataTableColum">
                        <div className="number">
                          {index + 1 + currentPage * perPage - perPage}
                        </div>
                      </div>
                      <div className="DataTableColum">
                        <p>{moment(order?.created_at).format("h:mm a")}</p>
                        <p>
                          {moment(order?.created_at).format('DD.MM.YY')}
                        </p>
                      </div>

                      <div className="DataTableColum Address">
                        <div className="Name">
                          <Tooltip title={order?.name} placement="top-start">
                            <>
                              {order?.name.length < 15 ? (
                                <span>{order?.name}</span>
                              ) : (
                                <>
                                  {order?.name.slice(0, 13)}
                                  ...
                                </>
                              )}
                            </>
                          </Tooltip>
                        </div>
                      </div>

                      <div className="DataTableColum Address">
                        <div className="TotalPrice">{order?.phone}</div>
                      </div>

                      <div className="DataTableColum">
                        <div className="TotalPrice">{order?.address}</div>
                      </div>

                      <div className="DataTableColum">
                        <div className="TotalPrice">{order?.order_count}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <table>
                  <tr>
                    <td colSpan={14}>
                      <section className="MiddleSection">
                        <div className="MiddleSectionContent">
                          <div className="img">
                            <img src="/images/empty.png" alt="" />
                          </div>

                          <div className="text">
                            <p>Not Found</p>
                          </div>
                        </div>
                      </section>
                    </td>
                  </tr>
                </table>
              )}
            </div>
          </div>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div className="DropDown Download " style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px" }}>Rows per page</span>

              <div id="per-page-select_order">
                <FormControl variant="outlined" style={{ width: "100px", marginLeft: "10px" }} >

                  {/* <InputLabel id="per-page-label">Items per page</InputLabel> */}
                  <Select
                    // labelId="per-page-label"
                    id="per-page-select"
                    value={perPage}
                    onChange={handlePerPageChange}
                  // label="Items per page"
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
              </div>

            </div>

            <Stack spacing={2}>
              <Pagination
                count={totalPage}
                page={currentPage}
                onChange={handleChange}
                variant="outlined"
              />
            </Stack>
            <div></div>

          </Box>
        </Container>
      </section>
    </div>
  );
};

export default withAuth(CustomerListPage, {
  isProtectedRoute: true,
});
