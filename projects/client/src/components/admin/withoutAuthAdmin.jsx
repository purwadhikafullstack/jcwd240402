import { useEffect } from "react";
import { getCookie } from "../../utils/tokenSetterGetter";
import { useNavigate } from "react-router-dom";

function withOutAuth(Component) {

  return (props) => {
    const navigate = useNavigate();
    const token = getCookie("access_token");

    if (token) {
      useEffect(() => {
        navigate("/admin/admin-dashboard");
      }, [navigate]);
    }
    return <Component {...props} />;
  };
}

export default withOutAuth;
