import SubProduct from "../../Components/Category/SubProductPage/SubProduct";
import withAuth from "../../hook/PrivateRoute";

const index = () => {
  return (
    <>
      <SubProduct />
    </>
  );
};

export default withAuth(index, {
  isProtectedRoute: true,
});
