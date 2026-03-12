import MultiWebsite from "../../Components/Templates/MultiWebsitePage/MultiWebsite";
import withAuth from "../../hook/PrivateRoute";

const index = ({busInfo}) => {
  return (
    <>
      <MultiWebsite busInfo={busInfo} />
    </>
  );
};

export default withAuth(index, {
  isProtectedRoute: true,
});
