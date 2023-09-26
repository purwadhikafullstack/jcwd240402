import React from "react";
import { Alert } from "flowbite-react";

export default function DismissableAlert({
  successMsg,
  openAlert,
  setOpenAlert,
  color = "success",
}) {
  const handleDismiss = () => {
    setOpenAlert(!openAlert);
  };

  return (
    <>
      {openAlert === true ? (
        <Alert color={color} onDismiss={handleDismiss}>
          <span>
            <p>
              <span className="font-semibold">Info alert! </span>
              {successMsg}
            </p>
          </span>
        </Alert>
      ) : null}
    </>
  );
}
