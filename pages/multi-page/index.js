import MultiWebsite from "../../Components/Templates/MultiWebsitePage/MultiWebsite";
import withAuth from "../../hook/PrivateRoute";

const index = () => {
  return (
    <>
      <MultiWebsite />
    </>
  );
};

export default withAuth(index, {
  isProtectedRoute: true,
});
