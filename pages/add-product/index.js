import AddProduct from "../../Components/Products/AddProduct/AddProduct";
import withAuth from "../../hook/PrivateRoute";
const index = ({busInfo}) => {
  return (
    <>
      <AddProduct busInfo={busInfo} />
    </>
  );
};

export default withAuth(index, {
  isProtectedRoute: true,
});
