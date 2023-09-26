import React from "react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

const BreadCrumb = ({ crumbs }) => {
  const location = useLocation();
  return (
    <div className="w-fit bg-white z-20 top-16 mx-6 my-2  lg:mx-32">
      <Breadcrumb aria-label="Default breadcrumb example">
        {location.pathname !== "/" ? (
          <Breadcrumb.Item icon={HiHome}>
            <Link to="/" className="text-xs">
              Home
            </Link>
          </Breadcrumb.Item>
        ) : null}
        {crumbs
          ? crumbs.map((item, idx) => (
              <Breadcrumb.Item key={idx}>
                <Link to={item.link} className="text-xs">
                  {item.title}
                </Link>
              </Breadcrumb.Item>
            ))
          : null}
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
