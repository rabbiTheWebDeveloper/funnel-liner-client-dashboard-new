
import withAuth from "../../hook/PrivateRoute";
import dynamic from "next/dynamic";
const Woocommerce = dynamic(() => import("../../Components/WoocommercePage/Woocommerce"), {
  ssr: false,
});

const index = ({busInfo}) => {
  
  return (
    <>
      <Woocommerce />
    </>
  );
};

export default withAuth(index, {
  isProtectedRoute: true,
});
