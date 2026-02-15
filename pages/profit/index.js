import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";
import { Reports } from "../../Components/DashboardV2/App/reports/reports";
const reports = () => {
  return (
    <>
      <HeaderDescription
        headerIcon={"flaticon-wallet-1"}
        title={"Profit Reports and Analytics"}
        subTitle={
          "Gain insights into your shop's profitability with detailed reports and analytics. Monitor revenue, expenses, and profit margins to make informed business decisions."
        }
        search={false}
        order={false}
        // backbutton={true}
      />
      <Reports />;
    </>
  );
};

export default reports;
