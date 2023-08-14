import React from "react";

const ServiceCard = ({ services }) => {
  return (
    <>
      <h1 className="font-bold text-center lg:text-3xl">
        Service For Your Convenience
      </h1>
      <div className="mx-2 my-4 flex flex-col gap-4 md:grid md:grid-cols-3 md:grid-rows-2 lg:grid lg:grid-cols-3 lg:grid-rows-2">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-[#f5f5f5] w-full flex flex-col justify-start items-center h-24 rounded-sm p-4"
          >
            {<service.component className="w-20" />}
            <h1 className="font-semibold text-sm">{service.title}</h1>
            <h2 className="text-center text-xs">{service.text}</h2>
          </div>
        ))}
      </div>
    </>
  );
};

export default ServiceCard;
