import { getCookie } from "../utils/tokenSetterGetter";
import NotifRedirect from "./NotifRedirect";
import noAuth from "../assets/images/withOutAuth.png";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import FooterDesktop from "./FooterDesktop";
import NavigatorMobile from "./NavigatorMobile";

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
