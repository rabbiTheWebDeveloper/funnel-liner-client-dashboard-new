import { ChangeLogs } from "../../Components/ChangeLogs/ChangeLogs";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import withAuth from "../../hook/PrivateRoute";

const ChangelogsPage = ({releaseNotes}) => {
  return <ChangeLogs releaseNotes={releaseNotes}></ChangeLogs>;
};
export default withAuth(ChangelogsPage, {
  isProtectedRoute: true,
});

export const getStaticProps = async () => {
  try {
    const res = await fetch(`${API_ENDPOINTS.LEAD_BASE_URL}/releaseNote/`);
    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.status}`);
    }
    const data = await res.json();
    return {
      props: {
        releaseNotes: data?.data || [], // Use null if data is undefined
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return {
      props: {
        releaseNotes: [], // Handle the error by setting productListInfo to null
      },
      revalidate: 10,
    };
  }
}
