import React from "react";
import DismissableAlert from "../DismissableAlert";

const Alert = ({ successMsg = "success", openAlert, setOpenAlert, errMsg }) => {
  return (
    <>
      <div className=" absolute left-0 right-0 md:top-16 flex justify-center items-start z-10">
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

export default Alert;
