import React from "react";
import styled from "styled-components";
import { Link } from "react-scroll";
import LogoImg from "../../assets/svg/Logo";

export default function Footer() {
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Wrapper>
      <div className="darkBg">
        <Container>
          <InnerWrapper className="flexSpaceCenter" style={{ padding: "30px 0" }}>
            <Link className="flexCenter animate pointer" to="home" smooth={true} offset={-80}>
              <LogoImg />
              <h1 className="font15 extraBold whiteColor" style={{ marginLeft: "15px" }}>
                Finest Interiors
              </h1>
            </Link>
            <StyleP className="whiteColor font13">
              © {getCurrentYear()} - <span className="purpleColor font13">Finest Interiors</span> All Rights Reserved
            </StyleP>

            <Link
              className="whiteColor animate pointer font13"
              onClick={handleScroll}         
              smooth={true}      
              duration={500}   
            >
              Back to top
            </Link>
          </InnerWrapper>
        </Container>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-top: auto;
  width: 100%;
  background-color: #000;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
`;

const InnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 550px) {
    flex-direction: column;
    text-align: center;
  }
`;

const StyleP = styled.p`
  margin: 0;

  @media (max-width: 550px) {
    margin: 20px 0;
  }
`;
