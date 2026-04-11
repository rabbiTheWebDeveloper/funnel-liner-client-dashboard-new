import React from "react";
import TiktokPixelSetup from "../../Components/TiktokPixel/TiktokPixelSetup";
import withAuth from "../../hook/PrivateRoute";

const TiktokPixelPage = () => {
  return (
    <>
      <TiktokPixelSetup />
    </>
  );
};

export default withAuth(TiktokPixelPage, {
  isProtectedRoute: true,
});
