import React, { useEffect, useState } from "react";
import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import BreadCrumb from "../../components/user/navbar/BreadCrumb";
import emptyImage from "../../assets/images/emptyImage.jpg";

const AllCategories = () => {
  const [loading, setLoading] = useState(true);
  const [categoryProducts, setCategoryProducts] = useState([]);

  useEffect(() => {
    axios.get("/user/products-per-category").then((res) => {
      setLoading(false);
      setCategoryProducts(res.data.result);
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <BreadCrumb
        crumbs={[
          { title: ["Category"], link: "/product-category" },
          {
            title: ["All Categories"],
            link: "/all-categories",
          },
        ]}
      />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {categoryProducts.map((categoryProduct) => (
            <div key={categoryProduct.id} className="col-span-1 space-y-2">
              <div className="h-40 mb-2">
                <Link
                  to={`/product/product-category/${categoryProduct.category}`}
                >
                  <img
                    src={
                      categoryProduct.category_img
                        ? `${process.env.REACT_APP_API_BASE_URL}${categoryProduct.category_img}`
                        : emptyImage
                    }
                    alt="category"
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
              <Link
                className="font-bold text-xl md:text-lg lg:text-lg"
                to={`/product/product-category/${categoryProduct.category}`}
              >
                {categoryProduct.category}
              </Link>
              <ul>
                {categoryProduct.products ? (
                  <div>
                    {categoryProduct.products
                      .slice(0, 8)
                      .map((product, idx) => (
                        <div key={idx}>
                          <li className="text-xs mb-1 text-grayText">
                            <Link
                              to={`/product/${product.name}`}
                              className="underline hover:no-underline"
                            >
                              {product.name}
                            </Link>
                          </li>
                        </div>
                      ))}
                    <li className="text-xs mb-1 text-grayText">
                      <Link
                        to={`/product/product-category/${categoryProduct.category}`}
                        className="underline hover:no-underline"
                      >
                        See all products
                      </Link>
                    </li>
                  </div>
                ) : (
                  <p className="underline hover:no-underline">
                    This category do not have any products yet
                  </p>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default AllCategories;
