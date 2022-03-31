import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import Home from "./Pages/Home"
import Navigation from "./Components/Shared/Navigation"
import "./App.css"
import { ChakraProvider } from "@chakra-ui/react"
import Authenticate from "./Pages/Athenticate"
import Activate from "./Pages/Activate"
import Rooms from "./Pages/Rooms"
import { useSelector } from "react-redux"

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Navigation />
        <Switch>
          <GuestRoute path="/" exact>
            <Home />
          </GuestRoute>
          <GuestRoute path="/authenticate" exact>
            <Authenticate />
          </GuestRoute>
          <SemiProtectedRoute path="/activate" exact>
            <Activate />
          </SemiProtectedRoute>
          <ProtectedRoute path="/rooms" exact>
            <Rooms />
          </ProtectedRoute>
        </Switch>
      </Router>
    </ChakraProvider>
  )
}

const GuestRoute = ({ children, ...rest }) => {
  const { user, isAuth } = useSelector((state) => state.auth)

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth ? (
          <Redirect to={{ pathname: "/rooms", state: { from: location } }} />
        ) : (
          children
        )
      }
    ></Route>
  )
}
const SemiProtectedRoute = ({ children, ...rest }) => {
  const { user, isAuth } = useSelector((state) => state.auth)

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isAuth ? (
          <Redirect to={{ pathname: "/", state: { from: location } }} />
        ) : isAuth && !user.activated ? (
          children
        ) : (
          <Redirect to={{ pathname: "/rooms", state: { from: location } }} />
        )
      }
    ></Route>
  )
}

const ProtectedRoute = ({ children, ...rest }) => {
  const { user, isAuth } = useSelector((state) => state.auth)

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isAuth ? (
          <Redirect to={{ pathname: "/", state: { from: location } }} />
        ) : isAuth && !user.activated ? (
          <Redirect to={{ pathname: "/activate", state: { from: location } }} />
        ) : (
          children
        )
      }
    ></Route>
  )
}

export default App
