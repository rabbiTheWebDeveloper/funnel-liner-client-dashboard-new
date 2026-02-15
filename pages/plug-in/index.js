import Plugin from "../../Components/PluginPage/Plugin";
import withAuth from "../../hook/PrivateRoute";

const index = ({ setFetch }) => {
  return (
    <>
      <Plugin setFetch={setFetch} />
    </>
  );
};

export default withAuth(index, {
  isProtectedRoute: true,
});
