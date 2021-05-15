import "./App.css";
import "./public/css/dashboard.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginForm from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import { DashboardProvider } from "./context/DashboardContext";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <DashboardProvider>
            <Switch>
              <Route  path="/dashboard" component={Dashboard} />
              <Route exact path="/" component={LoginForm} />
            </Switch>
          </DashboardProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
