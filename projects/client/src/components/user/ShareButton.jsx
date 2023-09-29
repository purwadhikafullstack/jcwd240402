import React from "react";
import { useLocation } from "react-router-dom";
import {
  EmailShareButton,
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import {
  EmailIcon,
  FacebookIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const ShareButton = () => {
  const location = useLocation();

  return (
    <div className="flex ">
      <TelegramShareButton
        url={`${process.env.REACT_APP_FRONT_END_BASE_URL}${location.pathname}`}
      >
        <TelegramIcon className="h-7 w-7" />
      </TelegramShareButton>
      <WhatsappShareButton
        url={`${process.env.REACT_APP_FRONT_END_BASE_URL}${location.pathname}`}
        title="I wanna but this interesting product"
      >
        <WhatsappIcon className="h-7 w-7" />
      </WhatsappShareButton>
      <FacebookShareButton
        url={`${process.env.REACT_APP_FRONT_END_BASE_URL}${location.pathname}`}
        quote="I wanna buy this product"
        hashtag="#furnifor #FurnitureFortune"
      >
        <FacebookIcon className="h-7 w-7" />
      </FacebookShareButton>
      <TwitterShareButton
        url={`${process.env.REACT_APP_FRONT_END_BASE_URL}${location.pathname}`}
      >
        <TwitterIcon className="h-7 w-7" />
      </TwitterShareButton>
      <EmailShareButton
        url={`${process.env.REACT_APP_FRONT_END_BASE_URL}${location.pathname}`}
        subject="Interesting Product"
        body="I am interested with this product"
      >
        <EmailIcon className="h-7 w-7" />
      </EmailShareButton>
    </div>
  );
};

export default ShareButton;
