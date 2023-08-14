import NotAuth from "../pages/user/NotAuth";
import { getCookie } from "../utils";

function withAuth(Component) {
  const access_token = getCookie("access_token");

  return (props) => {
    if (access_token) {
      return <Component {...props} />;
    }
    return (
      <>
        <NotAuth />
      </>
    );
  };
}

export default withAuth;
