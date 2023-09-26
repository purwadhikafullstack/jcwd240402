import React from "react";
import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import wh1 from "../../assets/images/wh1.webp";
import wh2 from "../../assets/images/wh2.webp";
import wh3 from "../../assets/images/wh3.webp";
import wh4 from "../../assets/images/wh4.webp";
import whfooter1 from "../../assets/images/whfooter1.webp";

const ThisIsFurniFor = () => {
  const imgData = [
    {
      img: wh3,
    },
    {
      img: wh4,
    },
  ];

  const textProfile = [
    {
      title: "The Best Quality at Affordable Prices",
      text: "We take pride in providing furniture of the highest quality without breaking your budget. FurniFor is the perfect choice for those seeking high-quality furniture without worrying about their finances.",
    },
    {
      title: "Suitable for Every Style",
      text: "Whatever your home style, FurniFor offers a wide range of options to suit your needs. From elegant minimalist furnishings to luxurious pieces that bring exceptional aesthetic appeal",
    },
    {
      title: "Pleasant Colors",
      text: "Colors play a vital role in interior design. We carefully select comfortable and soothing colors for our products, allowing you to create captivating and delightful spaces.",
    },
    {
      title: "Easy Delivery",
      text: "We understand the value of your time. Therefore, FurniFor is ready to deliver your ordered products quickly and securely, so you can enjoy the beauty of our furniture without delay.",
    },
    {
      title: "Environmentally Conscious",
      text: "We care about the environment. FurniFor is committed to selecting eco-friendly raw materials without compromising on quality. We prioritize sustainability in every step of our production.",
    },
    {
      title: "Nationwide Presence",
      text: "With warehouses scattered across various regions in Indonesia, FurniFor is closer to you than ever. This makes it easier for you to find the products you need without traveling far.",
    },
  ];
  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32 mb-4">
        <div className="">
          <h1 className="text-justify font-bold text-md">
            FurniFor: Bringing Fortune Through Quality Furniture
          </h1>
          <div className="">
            <h3 className="text-justify text-xs  mb-4 text-grayText">
              Welcome to FurniFor, your ultimate destination to discover
              high-quality furniture at affordable prices. FurniFor is a
              combination of the words "furniture" and "fortune," reflecting our
              commitment to bringing luck to every visitor through our top-notch
              products. FurniFor, established as the premier destination for
              quality furniture, encapsulates a world where artistry meets
              functionality, where each piece of furniture becomes a testament
              to your unique style and the pursuit of an enriched lifestyle. Our
              name, a fusion of "furniture" and "fortune," underscores our
              unwavering commitment to bringing you prosperity and comfort
              through our meticulously curated selection of top-tier
              furnishings. At FurniFor, quality is our unwavering creed. We
              tirelessly source and craft our furniture to meet the highest
              standards, ensuring that every item you bring into your home is a
              symbol of longevity and sophistication. Our dedication to
              affordability goes hand in hand with quality, making premium
              furniture accessible to all. Your home is your canvas, and
              FurniFor offers the palette to paint your dreams. Whether you lean
              towards the sleek minimalism of modern design, the timeless
              elegance of classic pieces, or the opulent allure of luxury, we
              have an extensive range that caters to your unique tastes. Colors
              play a pivotal role in interior design, and we have meticulously
              selected soothing, inviting hues that transform your living spaces
              into havens of relaxation and style.
            </h3>
            <img src={wh1} alt="banner warehouse" className="float-left" />
            <img src={wh2} alt="banner warehouse" className=" float-left" />
          </div>
          <div className="grid grid-cols-2 w-full h-full">
            {imgData.map((item, idx) => (
              <img
                src={item.img}
                key={idx}
                alt="banner warehouse"
                className="object-cover h-full"
              />
            ))}
          </div>
          {textProfile.map((item, idx) => (
            <div key={idx} className="mb-4 mt-4">
              <h2 className="font-semibold lg:text-sm">{item.title}</h2>
              <h3 className="text-justify text-xs lg:text-sm text-grayText">
                {item.text}
              </h3>
            </div>
          ))}
        </div>
        <img src={whfooter1} alt="banner warehouse" />
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default ThisIsFurniFor;
