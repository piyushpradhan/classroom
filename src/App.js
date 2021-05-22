import "./App.css";
import "./public/css/dashboard.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginForm from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import { DashboardProvider } from "./context/DashboardContext";
import { ClassroomProvider } from "./context/ClassroomContext";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <DashboardProvider>
            <ClassroomProvider>
              <Switch>
                <Route path="/dashboard" component={Dashboard} />
                <Route exact path="/" component={LoginForm} />
              </Switch>
            </ClassroomProvider>
          </DashboardProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
