import React from "react";

const SelectionCategory = () => {
  const images = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      name: "Bed",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      name: "Sofa/Couch",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      name: "Desk",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      name: "Shoe Rack",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      name: "Chairs",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      name: "Wardrobe",
    },
  ];
  return (
    <div>
      <h1 className="font-bold text-center lg:text-3xl mb-3">
        Selected Preferences
      </h1>
      <div className="flex gap-4 lg:gap-x-4 justify-center items-center flex-wrap ">
        {images.map((item) => (
          <div
            key={item.id}
            className="hover:shadow-3xl shadow-3xl lg:shadow-none rounded-lg flex justify-center items-center flex-col"
          >
            <div className="w-32 md:w-40 lg:w-40 md:h-28 lg:h-28 rounded-lg truncate">
              <img
                src={item.src}
                alt=""
                className="object-cover w-40 h-28 rounded-lg hover:scale-[1.2] transition-all duration-500 ease-in "
              />
            </div>
            <div className="flex text-xs lg:text-base justify-center items-center py-2">
              <h1>{item.name}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectionCategory;
