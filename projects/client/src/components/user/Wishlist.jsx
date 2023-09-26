import React, { useEffect, useState } from "react";
import { RiBookmark3Fill } from "react-icons/ri";
import axios from "../../api/axios";
import { getCookie } from "../../utils/tokenSetterGetter";
import { useDispatch, useSelector } from "react-redux";
import { wishlistUser } from "../../features/wishlistDataSlice";

const Wishlist = ({ product, setErrMsg, setOpenAlert, setSuccessMsg }) => {
  const access_token = getCookie("access_token");
  const refresh_token = getCookie("refresh_token");
  const userData = useSelector((state) => state.profiler.value);

  const dispatch = useDispatch();

  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    axios
      .get(`/user/wishlist/${product}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        if (res.data?.result === null) {
          setIsAdded(false);
        } else {
          setIsAdded(true);
        }
      })
      .catch((error) => {
        setIsAdded(false);

        if (!error.response) {
          setErrMsg("No Server Response");
          setIsAdded(false);
        } else {
          setErrMsg(error.response?.data?.message);
          setIsAdded(false);
        }
      });
  }, [access_token, product, refresh_token, setErrMsg, userData.role_id]);

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
        setSuccessMsg(response.data?.message);
        setOpenAlert(true);

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
      setOpenAlert(true);

      setIsAdded(false);
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
        setSuccessMsg(response.data?.message);
        setOpenAlert(true);

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
      setOpenAlert(true);

      if (!error.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(error.response?.data?.message);
      }
    }
  };

  return (
    <>
      {isAdded ? (
        <button
          onClick={() => {
            setIsAdded(false);
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
            setIsAdded(true);
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
