import React from "react";
import MicrosoftClaritySetup from "../../Components/MicrosoftClarity/MicrosoftClaritySetup";
import withAuth from "../../hook/PrivateRoute";

const MicrosoftClarityPage = () => {
  return (
    <>
      <MicrosoftClaritySetup />
    </>
  );
};

export default withAuth(MicrosoftClarityPage, {
  isProtectedRoute: true,
});
