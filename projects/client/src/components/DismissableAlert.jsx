"use client";

import { Alert } from "flowbite-react";
import { useState } from "react";

export default function DismissableAlert({ color, message }) {
  return (
    <>
      <Alert color={color}>
        <span>
          <p>{message}.</p>
        </span>
      </Alert>
    </>
  );
}
