import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Accounts from "./components/Accounts/Accounts";
import OrderHistory from "./components/OrderHistory/OrderHistory";
import AddAccount from "./components/AddAccount/AddAccount";
import EditAccount from "./components/EditAccount/EditAccount";
import Login from "./components/Login/Login";
import Order from "./components/Order/Order";
import RideHistory from "./components/RideHistory/RideHistory";
import DriverListing from "./components/Drivers/listing";
import AddDriver from "./components/Drivers/Add";
import ApproveOrder from './components/OrderHistory/ApproveRejectOrder'
import TarrifListing from "./components/Tarrif/listing";
import AddTarrif from "./components/Tarrif/Add";



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/order" element={<Order/>} />
        <Route path="/edit-order/:orderId" element={<Order />} />
        <Route path="/ride-history" element={<RideHistory />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/create-account" element={<AddAccount />} />
        <Route path="/edit-account" element={<EditAccount />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/order-history/:orderId" element={<Order viewOnly />} />
        <Route path="/drivers-listing" element={<DriverListing viewOnly />} />
        <Route path="/drivers-Add" element={<AddDriver/>} />
        <Route path="/approve-order/:orderId" element={<ApproveOrder/>} />
        <Route path="/Tarrif-listing" element={<TarrifListing viewOnly />} />
        <Route path="/Tarrif-Add" element={<AddTarrif />} />


        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
