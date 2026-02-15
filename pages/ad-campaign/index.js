import AdCampaign from "../../Components/Products/AdCampaign/AdCampaign";
import withAuth from "../../hook/PrivateRoute";

const AdCampaignPage = ({ busInfo }) => {
  return (
    <>
      <AdCampaign busInfo={busInfo} />
    </>
  );
};

export default withAuth(AdCampaignPage, {
  isProtectedRoute: true,
});
