import { getCookie } from "../../utils/tokenSetterGetter";
import NotifRedirect from "../user/notif/NotifRedirect";
import noAuth from "../../assets/images/withOutAuth.png";
import NavbarDesktop from "../user/navbar/NavbarDesktop";
import NavbarMobile from "../user/navbar/NavbarMobile";
import FooterDesktop from "../user/footer/FooterDesktop";
import NavigatorMobile from "../user/footer/NavigatorMobile";

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
