import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCookie, getLocalStorage } from "../../utils/tokenSetterGetter";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";

export const OrderButton = ({ statusBefore, orderId }) => {
  const [yourOrder, setYourOrder] = useState([]);

  const access_token = getCookie("access_token");

  const navigate = useNavigate();

  const [orderStatus, setOrderStatus] = useState([]);

  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleClickStatus = async (id, status) => {
    try {
      const res = await axios.post(
        "/user/order-status",
        {
          id: id,
          statusId: status,
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      setOrderStatus(res.data?.order);
      axios
        .get(`/user/order/${id}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          setYourOrder(res.data?.order);
        })
        .catch((error) => {});
    } catch (error) {
      setErrMsg(error.response?.data?.message);
    }
  };

  const handleDeleteReserved = (orderId) => {
    console.log(orderId);
    axios
      .delete(`/user/reserved-order/${orderId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setSuccessMsg(res.data?.message);
      })
      .catch((error) => setErrMsg(error.response?.data?.message));
  };

  if (statusBefore === 6) {
    return (
      <button
        className="w-full bg-blue3 p-2 font-semibold text-white rounded-md text-xs"
        onClick={() => {
          handleClickStatus(orderId, 3);
          navigate("/user/setting/order");
        }}
      >
        Confirm
      </button>
    );
  } else if (statusBefore === 5) {
    return (
      <button
        className="w-full bg-danger3 p-2 font-semibold text-white rounded-md text-xs"
        disabled={true}
      >
        Order Canceled
      </button>
    );
  } else {
    return (
      <button
        className="w-full bg-danger1 p-2 font-semibold text-white rounded-md text-xs"
        onClick={() => {
          handleDeleteReserved(orderId);
          handleClickStatus(orderId, 5);
          navigate("/user/setting/order");
        }}
      >
        Cancel
      </button>
    );
  }
};
