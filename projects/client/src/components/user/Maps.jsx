import React from "react";

const Maps = ({ address }) => {
  return (
    <>
      <iframe
        src={`https://maps.google.com/maps?q=${address}&t=&zoom=16&maptype=roadmap&ie=UTF8&iwloc=&output=embed`}
        allowfullscreen={true}
        className="w-full h-full"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="map"
      ></iframe>
    </>
  );
};

export default Maps;
