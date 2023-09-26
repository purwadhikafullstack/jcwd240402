import React from "react";
import DismissableAlert from "../DismissableAlert";

const AlertDisable = ({
  successMsg = "success",
  openAlert,
  setOpenAlert,
  errMsg,
}) => {
  return (
    <>
      <div>
        {successMsg ? (
          <DismissableAlert
            successMsg={successMsg}
            openAlert={openAlert}
            setOpenAlert={setOpenAlert}
          />
        ) : errMsg ? (
          <DismissableAlert
            successMsg={errMsg}
            openAlert={openAlert}
            setOpenAlert={setOpenAlert}
            color="failure"
          />
        ) : null}
      </div>
    </>
  );
};

export default AlertDisable;
