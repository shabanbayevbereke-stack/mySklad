import { Card, Col, Row, Grid } from "antd";

import "./loginPage.styles.css";

import { LoginForm } from "./components/LoginForm/LoginForm";
import { LG_COL_SPAN } from "./constants";

export default function LoginPage() {
  const { lg } = Grid.useBreakpoint();
  return (
    <Row className="auth-page">
      <Col
        xs={24}
        lg={LG_COL_SPAN}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {!lg && (
          <div className="mobile-text">
            <h1>Складские решения</h1>
            <p>- С нами надежнее</p>
          </div>
        )}
        <h1>Вход</h1>
        <Card className="auth-card">
          <LoginForm />
        </Card>
      </Col>
      <Col xs={0} lg={LG_COL_SPAN} className="partImage">
        <div
          style={{
            padding: 20,
            borderRadius: 20,
            maxWidth: 350,
            transform: "translate(30px,140px)",
            textAlign: "left",
          }}
        >
          <h1>Складские решения</h1>
          <p>- С нами надежнее</p>
        </div>
      </Col>
    </Row>
  );
}
