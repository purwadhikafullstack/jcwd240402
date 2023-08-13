import React from "react";

const SelectionCategory = () => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      name: "Bed",
    },
    {
      src: "https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      name: "Sofa/Couch",
    },
    {
      src: "https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      name: "Desk",
    },
    {
      src: "https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      name: "Shoe Rack",
    },
    {
      src: "https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      name: "Chairs",
    },
    {
      src: "https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      name: "Wardrobe",
    },
  ];
  return (
    <div>
      <div className="flex gap-x-4 justify-center items-center ">
        {images.map((item, idx) => (
          <div key={idx} className="hover:shadow-3xl rounded-lg ">
            <img
              src={item.src}
              alt=""
              className="object-cover w-40 h-28 rounded-lg hover:scale-150 transition-all duration-500 ease-in"
            />
            <div>
              <h1 className="text-center">{item.name}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectionCategory;
