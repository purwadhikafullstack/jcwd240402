import React from "react";
import DismissableAlert from "../DismissableAlert";

const Alert = ({ successMsg = "success", openAlert, setOpenAlert, errMsg }) => {
  return (
    <>
      {successMsg ? (
        <div className=" absolute left-0 right-0 md:top-16 flex justify-center items-start z-10">
          <DismissableAlert
            successMsg={successMsg}
            openAlert={openAlert}
            setOpenAlert={setOpenAlert}
          />
        </div>
      ) : errMsg ? (
        <div className=" absolute left-0 right-0 md:top-16 flex justify-center items-start z-10">
          <DismissableAlert
            successMsg={errMsg}
            openAlert={openAlert}
            setOpenAlert={setOpenAlert}
            color="failure"
          />
        </div>
      ) : null}
    </>
  );
};

export default Alert;
