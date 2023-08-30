import { getCookie } from "../../utils/tokenSetterGetter";
import { useNavigate } from "react-router-dom";

function withOutAuth(Component) {
  const msg = "You are logged in";
  return (props) => {
    const navigate = useNavigate();
    const token = getCookie("access_token");

    if (token) {
      navigate("/admin/dashboard");
      return null;
    }
    return <Component {...props} />;
  };
}

export default withOutAuth;

