import { Card, Col, Grid, Row } from "antd";
// import RegisterForm from "@/components/giestsComponents/RegisterForm";
import "./RegisterPage.styles.css"
import { RegisterForm } from "./components/RegisterForm/RegisterForm";

export default function RegisterPage() {
  const { lg } = Grid.useBreakpoint();
  return (
    <Row className="auth-page">
      <Col xs={24} lg={12} style={{ display: "flex", flexDirection: "column" }}>
        {!lg && (
          <div className="mobile-text">
            <h1>Складские решения</h1>
            <p>- С нами надежнее</p>
          </div>
        )}
        <h1>Регистрация</h1>
        <Card className="auth-card">
          <RegisterForm />
        </Card>
      </Col>
      <Col xs={0} lg={12} className="partImage">
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
