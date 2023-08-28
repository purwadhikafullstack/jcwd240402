"use client";

import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

export default function AlertWithIcon({ errMsg }) {
  return (
    <Alert
      color="failure"
      icon={HiInformationCircle}
      className="mx-4 h-10 flex justify-center mt-3"
    >
      <span>
        <p>
          <span className="font-medium">Info alert!</span> {errMsg}
        </p>
      </span>
    </Alert>
  );
}
