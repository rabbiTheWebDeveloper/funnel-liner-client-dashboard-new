import AddSubCategoryPage from "../../Components/Category/SubCategoryList/AddSubCategoryPage";
import withAuth from "../../hook/PrivateRoute";

const index = () => {
  return (
    <>
      <AddSubCategoryPage />
    </>
  );
};

export default withAuth(index, {
  isProtectedRoute: true,
});
