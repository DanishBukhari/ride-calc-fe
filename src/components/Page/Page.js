import Footer from "../Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import "./Page.css";

const Page = (props) => {
  return (
    <div className="d-flex h-100">
      <Sidebar />
      <div className="page d-flex align-items-start flex-column w-100">
        <div className="mb-auto w-100">
          <Topbar />
          <div className="welcome">Welcome</div>
          <div className="navigations d-flex px-4 py-3">
            {props.navigations?.map((navigation, index) => {
              return (
                <div key={index}>
                  <span
                    className={`${
                      index === 0
                        ? "main-navigation pe-2"
                        : "sub-navigation px-2"
                    }`}
                  >
                    {navigation}
                  </span>
                  {props.navigations?.length - 1 !== index && <span>/</span>}
                </div>
              );
            })}
          </div>
          <div className="p-5">{props.content}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
};
export default Page;
