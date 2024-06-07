import "./App.css";
import {
  BrowserRouter,
  Routes,
  Outlet,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Navigation from "./components/shared/Navigation/Navigation";
import Authenticate from "./pages/Authentication.jsx/Authenticate";
import Activate from "./pages/Activate/Activate";
import Rooms from "./pages/Rooms/Rooms";
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";
import Loader from "./components/shared/Loader/Loader";
import Room from "./pages/Room/Room";

  //  const isAuth = true   ;
  //  const user = {activated: true }

function App() {
  const { isAuth } = useSelector((state) => state.auth);
  const { loading } = useLoadingWithRefresh();

  return loading ? (
    <Loader message="Loading...please wait " />
  ) : (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route
          path="/"
          exact
          element={isAuth ? <Navigate to="/rooms" /> : <Home />}
        />
        <Route
          path="/authenticate"
          element={isAuth ? <Navigate to="/rooms" /> : <Authenticate />}
        />

        <Route element={<SemiProtectedRoutes />}>
          <Route path="/activate" element={<Activate />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/rooms" element={<Rooms />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/room/:id" element={<Room/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const SemiProtectedRoutes = () => {
  const { user, isAuth } = useSelector((state) => state.auth);

  if (!isAuth) {
    return <Navigate to="/" />;
  } else if (isAuth && !user.activated) {
    return <Outlet />;
  } else {
    return <Navigate to="/rooms" />;
  }
};

const ProtectedRoutes = () => {
  const { user, isAuth } = useSelector((state) => state.auth);

  if (!isAuth) {
    return <Navigate to="/" />;
  } else if (isAuth && !user.activated) {
    return <Navigate to="/activate" />;
  } else {
    return <Outlet />;
  }
};

export default App;
