import React from "react";
import logo from "../assets/images/furniforLogo.webp";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const Loading = () => {
  return (
    <div>
      <img src={logo} alt="loading" className="w-32 mb-4" />
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    </div>
  );
};

export default Loading;
