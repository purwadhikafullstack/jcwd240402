import React, { useEffect, useState } from "react";
import { RiBookmark3Fill } from "react-icons/ri";
import axios from "../../api/axios";
import { getCookie } from "../../utils/tokenSetterGetter";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import { wishlistUser } from "../../features/wishlistDataSlice";

const Wishlist = ({ product, setErrMsg, setOpenAlert, setSuccessMsg }) => {
  const access_token = getCookie("access_token");
  const refresh_token = getCookie("refresh_token");
  const userData = useSelector((state) => state.profiler.value);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    axios
      .get(`/user/wishlist/${product}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setIsAdded(true);
        setLoading(false);
      })
      .catch((error) => {
        setIsAdded(false);
        setLoading(false);
        if (!error.response) {
          setErrMsg("No Server Response");
        } else {
          setErrMsg(error.response?.data?.message);
        }
      });
  }, [access_token, product, setErrMsg]);

  const handleAddWishlist = async () => {
    try {
      const response = await axios.post(
        `/user/wishlist/${product}`,
        {},
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (response.data.ok) {
        setIsAdded(response.data?.ok);
        setSuccessMsg(response.data?.message);
        setOpenAlert(true);
        setLoading(false);

        axios
          .get("/user/wishlist", {
            headers: { Authorization: `Bearer ${access_token}` },
          })
          .then((res) => {
            dispatch(wishlistUser(res.data?.result));
          })
          .catch((error) => {
            setErrMsg(error.response?.data?.message);
          });
      }
    } catch (error) {
      setIsAdded(error.response?.data?.ok);
      setOpenAlert(true);
      setLoading(false);
      if (!error.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(error.response?.data?.message);
      }
    }
  };

  const handleDeleteWishlist = async () => {
    try {
      const response = await axios.delete(`/user/wishlist/${product}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (response.data.ok) {
        setIsAdded(false);
        setSuccessMsg(response.data?.message);
        setOpenAlert(true);
        setLoading(false);
        axios
          .get("/user/wishlist", {
            headers: { Authorization: `Bearer ${access_token}` },
          })
          .then((res) => {
            dispatch(wishlistUser(res.data?.result));
          })
          .catch((error) => {
            setErrMsg(error.response?.data?.message);
          });
      }
    } catch (error) {
      setIsAdded(true);
      setOpenAlert(true);
      setLoading(false);
      if (!error.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(error.response?.data?.message);
      }
    }
  };

  if (loading) {
    return (
      <div className=" w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  return (
    <>
      {isAdded ? (
        <button
          onClick={() => {
            setIsAdded(!isAdded);
            handleDeleteWishlist();
          }}
          disabled={!access_token && !refresh_token && userData.role_id !== 3}
          className={
            !access_token && !refresh_token && userData.role_id !== 3
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }
        >
          <RiBookmark3Fill className="text-3xl text-yellow1" />
        </button>
      ) : (
        <button
          onClick={() => {
            setIsAdded(!isAdded);
            handleAddWishlist();
          }}
          disabled={!access_token && !refresh_token && userData.role_id !== 3}
          className={
            !access_token && !refresh_token && userData.role_id !== 3
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }
        >
          <RiBookmark3Fill className="text-3xl text-grayText" />
        </button>
      )}
    </>
  );
};

export default Wishlist;
