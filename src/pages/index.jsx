// components/Home.js
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { FetchingDesigners } from "../thunks/FetchingDesigners"; // Adjust path as needed
import FullButton from "../Components/ui/FullButton";
import ProjectBox from "../Components/ui/ProjectBox";
import HomeImg from "../assets/img/interior/home.jpg";
import QuotesIcon from "../assets/svg/Quotes";
import Dots from "../assets/svg/Dots";
import { useNavigate, useParams } from "react-router";
// import { Link } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, error, status } = useSelector((state) => {
    console.log(state.FetchDesigners);
    return state.FetchDesigners;
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(FetchingDesigners());
    }
  }, [status, dispatch]);

  const handleSearchNavigation = () => {
    navigate("/search-designer/search");
  };

  const handleProfileNavigation = (id) => {
    navigate(`/designer/${id}`);
  };

  return (
    <>
      <Wrapper className="container flexSpaceCenter">
        <LeftSide className="flexCenter">
          <div>
            <h1 className="extraBold font60">We are Digital Artists.</h1>
            <HeaderP className="font13 semiBold">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum.
            </HeaderP>
            <BtnWrapper>
              <FullButton title="Get Started" />
            </BtnWrapper>
          </div>
        </LeftSide>
        <RightSide>
          <ImageWrapper>
            <Img
              className="radius8"
              src={HomeImg}
              alt="office"
              style={{ zIndex: 9 }}
            />
            <QuoteWrapper className="flexCenter darkBg radius8">
              <QuotesWrapper>
                <QuotesIcon />
              </QuotesWrapper>
              <div>
                <p className="font15 whiteColor">
                  <em>
                    Friends, such as we desire, are dreams and fables.
                    Friendship demands the ability to do without it.
                  </em>
                </p>
                <p
                  className="font13 orangeColor textRight"
                  style={{ marginTop: "10px" }}
                >
                  Ralph Waldo Emerson
                </p>
              </div>
            </QuoteWrapper>
            <DotsWrapper>
              <Dots />
            </DotsWrapper>
          </ImageWrapper>
          <GreyDiv className="lightBg"></GreyDiv>
        </RightSide>
      </Wrapper>
      <Wrapper className="container">
        <HeaderInfo>
          <h1 className="font40 extraBold">Our Awesome Designers</h1>
          <p className="font13">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut
            <br />
            labore et dolore magna aliquyam erat, sed diam voluptua.
          </p>
        </HeaderInfo>
        <div className="row textCenter">
          {status === "loading" && <p>Loading...</p>}
          {users.map((user) => (
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
              {/* <Link> */}
              <ProjectBox
                key={user.id}
                img={user.profileUrl}
                title={user.firstName}
                text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor."
                action={() => handleProfileNavigation(user.id)}
              />
              {/* </Link> */}
            </div>
          ))}
          {status === "succeeded" && users.length === 0 && (
            <p>No designers found</p>
          )}
        </div>
        <div className="row flexCenter">
          <div style={{ margin: "50px 0", width: "200px" }}>
            <FullButton
              title="Search For More Designers"
              action={() => handleSearchNavigation()}
            />
          </div>
        </div>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.section`
  width: 100%;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const LeftSide = styled.div`
  width: 50%;
  height: 100%;
  @media (max-width: 960px) {
    width: 100%;
    order: 2;
    margin: 50px 0;
    text-align: center;
  }
  @media (max-width: 560px) {
    margin: 80px 0 50px 0;
  }
`;

const HeaderInfo = styled.div`
  text-align: center;
  margin: 40px 0;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }
`;

const RightSide = styled.div`
  width: 50%;
  height: 100%;
  @media (max-width: 960px) {
    width: 100%;
    order: 1;
    margin-top: 30px;
  }
`;
const HeaderP = styled.div`
  max-width: 470px;
  padding: 15px 0 50px 0;
  line-height: 1.5rem;
  @media (max-width: 960px) {
    padding: 15px 0 50px 0;
    text-align: center;
    max-width: 100%;
  }
`;
const BtnWrapper = styled.div`
  max-width: 190px;
  @media (max-width: 960px) {
    margin: 0 auto;
  }
`;
const GreyDiv = styled.div`
  width: 30%;
  height: 700px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 0;
  @media (max-width: 960px) {
    display: none;
  }
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  position: relative;
  z-index: 9;
  @media (max-width: 960px) {
    width: 100%;
    justify-content: center;
  }
`;
const Img = styled.img`
  @media (max-width: 560px) {
    width: 80%;
    height: auto;
  }
`;
const QuoteWrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 50px;
  max-width: 330px;
  padding: 30px;
  z-index: 99;
  @media (max-width: 960px) {
    left: 20px;
  }
  @media (max-width: 560px) {
    bottom: -50px;
  }
`;
const QuotesWrapper = styled.div`
  position: absolute;
  left: -20px;
  top: -10px;
`;
const DotsWrapper = styled.div`
  position: absolute;
  right: -100px;
  bottom: 100px;
  z-index: 2;
  @media (max-width: 960px) {
    right: 100px;
  }
  @media (max-width: 560px) {
    display: none;
  }
`;
