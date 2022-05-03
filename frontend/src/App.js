import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import Home from "./Pages/Home"
import Navigation from "./Components/Shared/Navigation"
import "./App.css"
import Authenticate from "./Pages/Athenticate"
import Activate from "./Pages/Activate"
import Rooms from "./Pages/Rooms"
import { useSelector } from "react-redux"
import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh"
import Loader from "./Components/Shared/Loader"
import Room from "./Pages/Room"
import { ChakraProvider } from "@chakra-ui/react"

function App() {
  const loading = useLoadingWithRefresh()

  return (
    <ChakraProvider>
      {loading ? (
        <Loader message={"Refreshing"} />
      ) : (
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
            <ProtectedRoute path="/room/:id" exact>
              <Room />
            </ProtectedRoute>
          </Switch>
        </Router>
      )}
    </ChakraProvider>
  )
}

const GuestRoute = ({ children, ...rest }) => {
  const { isAuth } = useSelector((state) => state.auth)

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
