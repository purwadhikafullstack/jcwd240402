import { useDispatch, useSelector } from "react-redux";

import NotAuth from "../../pages/user/NotAuth";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { profileUser } from "../../features/userDataSlice";

function withAuthUser(Component) {
  const access_token = getCookie("access_token");
  const refresh_token = getLocalStorage("refresh_token");

  return (props) => {
    const userData = useSelector((state) => state.profiler.value);
    const [newAccessToken, setNewAccessToken] = useState("");
    const dispatch = useDispatch();
    useEffect(() => {
      if (access_token && refresh_token) {
        axios
          .get("/user/profile", {
            headers: { Authorization: `Bearer ${access_token}` },
          })
          .then((res) => dispatch(profileUser(res.data.result)))
          .catch((error) => {
            if (
              error.response?.data?.message === "Invalid token" &&
              error.response?.data?.error?.name === "TokenExpiredError"
            ) {
              axios
                .get("/user/auth/keep-login", {
                  headers: { Authorization: `Bearer ${refresh_token}` },
                })
                .then((res) => {
                  setNewAccessToken(res.data?.accessToken);
                  setCookie("access_token", newAccessToken, 1);
                });
            }
          });
      }
    }, [dispatch, newAccessToken]);

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
