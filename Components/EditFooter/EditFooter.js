import { Box } from "@mui/material";
import style from "./style.module.css";
import { id } from "date-fns/locale";
import { useCallback, useEffect, useState } from "react";
import { Colors } from "../ColorPicker/Colors";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import axios from "axios";
import { headers } from "../../pages/api";

const EditFooter = ({ selected, setSelected }) => {
  const [footerData, seFooterData] = useState([]);
  const handleSelect = id => {
    setSelected(id);
  };


  const handleFetchFooterAndColor = useCallback(async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PAGE.GET_FOOTER_LIST}`, { headers: headers });
      seFooterData(response.data);
    } catch (error) {  
      // Handle errors if needed
      console.error("Error fetching data:", error);
    }
  }, []);
  
  useEffect(() => {
    handleFetchFooterAndColor();
  }, [handleFetchFooterAndColor]);
  return (
    <section className={style.HomeSlider}>
      {/* <Container maxWidth="sm"> */}
      <div
        className={`boxShadow ${style["padding-x-0"]} ${style.footerSection}`}
      >
        <Box>
          <div>
            <h1 className={style.header}>Footer Section Design</h1>
            <div className={style.inner}>
              {[
                { id: 1, image: "/footer1.png" },
                { id: 2, image: "/footer2.png" },
                { id: 3, image: "/footer3.png" },
                { id: 4, image: "/footer4.png" },
                { id: 5, image: "/footer5.png" },
                { id: 6, image: "/footer6.png" },
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`${style.item} ${selected === item.id ? style.ticked : ""
                    }`}
                >
                  {selected === item.id && <div className={style.tick}></div>}
                  <figure>
                    <img src={item.image} alt="" />
                  </figure>
                </div>
              ))}
            </div>
          </div>
        </Box>
      </div>
    </section>
  );
};

export default EditFooter;
