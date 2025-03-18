import React from "react";
import styled from "styled-components";
import Logo from "../assets/svg/Logo";

const BlockedUser = () => {
  return (
    <Container>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
      <Content>
        <Title>Access Restricted</Title>
        <Description>
          Your account has been temporarily blocked. If you believe this is a mistake, please contact support.
        </Description>
        <Button onClick={() => alert("Contact Support")}>Contact Support</Button>
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f7f7;
  font-family: "Arial", sans-serif;
`;

const LogoWrapper = styled.div`
  margin-bottom: 20px;

  svg {
    width: 100px;
    height: 100px;
  }
`;

const Content = styled.div`
  text-align: center;
  padding: 20px;
  max-width: 500px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #f40051;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #d30045;
  }
`;

export default BlockedUser;
