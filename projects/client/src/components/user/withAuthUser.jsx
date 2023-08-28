import { useSelector } from "react-redux";

import NotAuth from "../../pages/user/NotAuth";
import { getCookie } from "../../utils/tokenSetterGetter";

function withAuthUser(Component) {
  const access_token = getCookie("access_token");
  return (props) => {
    const userData = useSelector((state) => state.profiler.value);
    console.log(userData);

    if (access_token && userData?.role_id === 3) {
      return <Component {...props} />;
    }
    return (
      <>
        <NotAuth />
      </>
    );
  };
}

export default withAuthUser;
