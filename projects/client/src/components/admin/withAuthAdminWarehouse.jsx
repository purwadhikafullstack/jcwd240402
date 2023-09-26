import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import { profileAdmin } from "../../features/adminDataSlice";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Loading from "../Loading";

function withAuthAdminWarehouse(Component) {
  return (props) => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const access_token = getCookie("access_token");
    const refresh_token = getLocalStorage("refresh_token");

    const adminData = useSelector((state) => state.profilerAdmin.value);

    useEffect(() => {
      if (access_token) {
        fetchAdminData(access_token);
      } else if (refresh_token) {
        refreshAccessToken(refresh_token);
      } else {
        navigate("/admin/login");
      }
    }, []);

    const fetchAdminData = (token) => {
      axios
        .get("/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          dispatch(profileAdmin(res.data.result));
          setLoading(false);
        })
        .catch((error) => {
          if (
            error.response?.data?.message === "Invalid token" &&
            error.response?.data?.error?.name === "TokenExpiredError" &&
            refresh_token
          ) {
            refreshAccessToken(refresh_token);
          } else {
            navigate("/admin/login");
          }
        });
    };

    const refreshAccessToken = (r_token) => {
      axios
        .get("/admin/auth/keep-login", {
          headers: { Authorization: `Bearer ${r_token}` },
        })
        .then((res) => {
          const newAccessToken = res.data?.accessToken;
          setCookie("access_token", newAccessToken, 1);
          fetchAdminData(newAccessToken);
        })
        .catch(() => {
          navigate("/admin/login");
        });
    };

    if (loading) {
      return (
        <div className="w-full h-screen flex justify-center items-center">
          <Loading />
        </div>
      );
    }

    if (!adminData) {
      if (access_token) {
        navigate("/admin/login");
      } else {
        navigate("/admin/login");
      }
      return null;
    }

    if (adminData.role_id !== 1 && adminData.role_id !== 2) {
      navigate("/admin/login");
      return null;
    }

    return <Component {...props} />;
  };
}

export default withAuthAdminWarehouse;
