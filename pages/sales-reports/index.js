import { SalesReportTabs } from "../../Components/DashboardV2/App/sales-reports/sales-reports";
import { DashboardLayout } from "../../Components/DashboardV2/DashboardLayout";

const SalesReports = () => {
  return <SalesReportTabs />;
};

SalesReports.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SalesReports;