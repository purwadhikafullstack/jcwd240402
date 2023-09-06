import { getCookie } from "../../utils/tokenSetterGetter";
import NotifRedirect from "./notif/NotifRedirect";
import noAuth from "../../assets/images/withOutAuth.png";
import NavbarDesktop from "./navbar/NavbarDesktop";
import NavbarMobile from "./navbar/NavbarMobile";
import FooterDesktop from "./footer/FooterDesktop";
import NavigatorMobile from "./footer/NavigatorMobile";

function withOutAuth(Component) {
  const msg = "You are logged in";
  return (props) => {
    const token = getCookie("access_token");

    if (token) {
      return (
        <>
          <div className="w-screen lg:w-full h-screen">
            <NavbarDesktop />
            <NavbarMobile />
            <div>
              <NotifRedirect
                imgSrc={noAuth}
                to="/"
                msg={msg}
                buttonText="Go Home"
                toPage="Go Home"
              />
            </div>
            <FooterDesktop />
            <NavigatorMobile />
          </div>
        </>
      );
    }
    return <Component {...props} />;
  };
}

export default withOutAuth;
