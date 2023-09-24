import React, { useEffect, useState } from "react";
import { Footer } from "flowbite-react";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

import logo from "../../../assets/images/furnifor.png";
import { Link } from "react-router-dom";
import axios from "../../../api/axios";

const FooterDesktop = () => {
  const [warehouseList, setWarehouseList] = useState([]);
  useEffect(() => {
    axios
      .get(`/warehouse/warehouse-list`)
      .then((res) => setWarehouseList(res.data?.warehouses));
  }, []);

  return (
    <Footer container className="bg-[#F5F5F5] w-full">
      <div className="w-full lg:px-16 md:px-16">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div className="w-20 lg:w-96 md:w-96 lg:mr-4 md:mr-4 m-auto ">
            <img src={logo} alt="logo" />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="WEBSITE WAREHOUSE" />
              <Footer.LinkGroup col>
                <p className="text-justify">
                  Furnifor Warehouse is your premier destination for
                  high-quality products at the most competitive prices in the
                  market. Our commitment to excellence and customer satisfaction
                  drives us to curate a selection of the finest merchandise,
                  ensuring that you receive the best value for your money.
                </p>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Warehouse Branch" />
              {warehouseList ? (
                <>
                  {warehouseList.slice(0, 5).map((item) => (
                    <Footer.LinkGroup col key={item.id}>
                      {item.warehouse_name}
                    </Footer.LinkGroup>
                  ))}
                  <Footer.LinkGroup col>
                    <Link to="/all-warehouse">See More Warehouse</Link>
                  </Footer.LinkGroup>
                </>
              ) : (
                <p>we will be there in your city soon</p>
              )}
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Link to="/this-is-fornifor">This Is ForniFor</Link>
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/term-and-condition">Terms & Conditions</Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright by="WareHouse" href="#" year={2022} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterDesktop;
