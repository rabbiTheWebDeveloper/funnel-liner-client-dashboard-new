import { Container } from "@mui/material";
import { CourierDashboard } from "../../../Components/CourierDashboard/CourierDashboard";
import withAuth from "../../../hook/PrivateRoute";

const index = () => {
  return (
    <Container>
      <CourierDashboard />
    </Container>
  );
};

export default withAuth(index, {
  isProtectedRoute: true,
});
