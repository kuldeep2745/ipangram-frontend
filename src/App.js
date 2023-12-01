import { Switch, Route, Link } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import Account from "./Account";
import ManagerComponent from "./ManagerComponent";
import AuthComponent from "./AuthComponent";
import ProtectedRoutes from "./ProtectedRoutes";

function App() {
  return (
    <Container>
      <Row>
        <Col className="text-center">
          <h1>I-pangram App</h1>

          <section id="navigation">
  <Link to="/">User Login</Link>
  <Link to="/manager">Manager Login</Link>
  {/* <Link to="/auth">Auth Component</Link> */}
</section>
        </Col>
      </Row>

      {/* create routes here */}
      <Switch>
        <Route exact path="/" component={Account} />
        <Route exact path="/manager" component={ManagerComponent} />
        <ProtectedRoutes path="/auth" component={AuthComponent} />
      </Switch>
    </Container>
  );
}

export default App;
