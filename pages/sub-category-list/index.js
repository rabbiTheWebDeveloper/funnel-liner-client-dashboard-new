import SubCategoryList from "../../Components/Category/SubCategoryList/SubCategoryList";
import withAuth from "../../hook/PrivateRoute";

const index = () => {
  return (
    <>
      <SubCategoryList />
    </>
  );
};

export default withAuth(index, {
  isProtectedRoute: true,
});
