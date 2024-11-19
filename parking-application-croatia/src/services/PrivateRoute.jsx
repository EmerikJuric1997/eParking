import { Navigate } from "react-router";
import { observer } from "mobx-react-lite";
import Store from "../store/Store";

const PrivateRoute = observer(({ children }) => {
    return Store.isAuthenticated ? children : <Navigate to="/signin" />;
});

export default PrivateRoute;
