import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCookie, getLocalStorage } from "../../utils/tokenSetterGetter";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";
import ModalConfirmationDelete from "./modal/ModalConfirmationDelete";

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
          setSuccessMsg("process successful");
          setTimeout(() => {
            navigate("/user/setting/order");
          }, 2000);
        })
        .catch((error) => {
          setErrMsg(error.response?.data?.message);
        });
    } catch (error) {
      setErrMsg(error.response?.data?.message);
    }
  };

  const handleDeleteReserved = (orderId) => {
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
      <>
        <ModalConfirmationDelete
          handleDelete={() => {
            handleClickStatus(orderId, 3);
          }}
          errMsg={errMsg}
          topic="order"
          deleteFor="Confirmation Received Order"
          purpose="Confirmation Received Order"
          styling="w-full bg-blue3 p-2 font-semibold text-white rounded-md text-xs"
          successMsg={successMsg}
          setSuccessMsg
          setErrMsg
        />
      </>
    );
  } else {
    return (
      <>
        <ModalConfirmationDelete
          handleDelete={() => {
            handleDeleteReserved(orderId);
            handleClickStatus(orderId, 5);
          }}
          errMsg={errMsg}
          setErrMsg={setErrMsg}
          topic="order"
          deleteFor="Cancel Order"
          purpose="Cancel Order"
          styling="w-full bg-danger1 p-2 font-semibold text-white rounded-md text-xs"
          successMsg={successMsg}
          setSuccessMsg={setSuccessMsg}
        />
      </>
    );
  }
};
