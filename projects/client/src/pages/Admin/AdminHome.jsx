import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarAdmin from "../../components/SidebarAdminDesktop";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import {profileAdmin} from "../../features/adminDataSlice"
import axios from "../../api/axios";

const AdminHome = () => {
  const [newAccessToken, setNewAccessToken] = useState("");
  const refresh_token = getLocalStorage("refresh_token");
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();

  useEffect(() => {
    if (access_token && refresh_token) {
      axios
        .get("/admin/profile", {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => dispatch(profileAdmin(res.data.result)))
        .catch((error) => {
          if (
            error.response?.data?.message === "Invalid token" &&
            error.response?.data?.error?.name === "TokenExpiredError"
          ) {
            axios
              .get("/admin/auth/keep-login", {
                headers: { Authorization: `Bearer ${refresh_token}` },
              })
              .then((res) => {
                const token = res.data?.accessToken;
                setNewAccessToken(token);
                setCookie("access_token", token, 1);
              });
          }
        });
    }
  }, [access_token, dispatch, newAccessToken, refresh_token])



  
  return (
    <div className="bg-blue1 h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <SidebarAdmin />
      </div>
    </div>
  );
};

export default AdminHome;
