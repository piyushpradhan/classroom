import "./App.css";
import "./public/css/dashboard.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginForm from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import { DashboardProvider } from "./context/DashboardContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <DashboardProvider>
            <Switch>
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <Route exact path="/" component={LoginForm} />
            </Switch>
          </DashboardProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
