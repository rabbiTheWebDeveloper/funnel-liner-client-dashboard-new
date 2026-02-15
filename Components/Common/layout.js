import { useEffect, useState } from "react";
import Subscribe from "../Subscribe/Subscribe";
import Menubar from "./Menubar/Menubar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { nextDueDate } from "../../pages/api";

export default function Layout({
  children,
  busInfo,
  myAddonsList,
  pendingOrderCount,
}) {
  const [isWindowExist, setIsWindowExist] = useState(false);
  const { merchant } = busInfo || {};
  const [isConditionTrue, setIsConditionTrue] = useState(false);
  const nextDueDateUpdate = new Date(nextDueDate);
  useEffect(() => {
    const currentDate = new Date();
    if (currentDate >= nextDueDateUpdate) {
      setIsConditionTrue(true);
    } else {
      setIsConditionTrue(false);
    }
    return () => {
      const timer = setInterval(() => {
        const currentDate = new Date();
        if (currentDate >= nextDueDateUpdate) {
          setIsConditionTrue(true);
        } else {
          setIsConditionTrue(false);
        }
      }, 24 * 60 * 60 * 1000); //

      return () => {
        clearInterval(timer);
      };
    };
  }, []);
  useEffect(() => {
    if (window !== "undefined") {
      setIsWindowExist(true);
    }
  });
  if (isWindowExist !== false) {
    return (
      <>
        <Menubar
          busInfo={busInfo}
          myAddonsList={myAddonsList}
          pendingOrderCount={pendingOrderCount}
        ></Menubar>
        {/* <Sidebar busInfo={busInfo} myAddonsList={myAddonsList} pendingOrderCount={pendingOrderCount} /> */}
        <div className="TopGaps"></div>
        <main>{children}</main>

        {location.pathname !== "/change-logs" && <Footer />}

        {isConditionTrue && <Subscribe setIsConditionTrue={setIsConditionTrue}/>}
      </>
    );
  }
}
