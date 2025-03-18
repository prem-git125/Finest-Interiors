import React from "react";
import styled from "styled-components";
import ProjectBox from "../../Components/ui/ProjectBox";
import FullButton from "../../Components/ui/FullButton";
import LogoutButton from "../../Components/ui/LogoutButton";
import ProjectImg1 from "../../assets/img/projects/1.png";
import ProjectImg2 from "../../assets/img/projects/2.png";
import ProjectImg3 from "../../assets/img/projects/3.png";
import ProjectImg4 from "../../assets/img/projects/4.png";
import ProjectImg5 from "../../assets/img/projects/5.png";
import ProjectImg6 from "../../assets/img/projects/6.png";
import { logout } from "../../slice/authLogin";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import asset from "../../api/helper";
import VerifiedIcon from "../../assets/img/verifyIcon/verify.png";

export default function Profile() {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const userImg = useSelector((state) => state.authLogin.profileUrl);
  const userName = useSelector((state) => state.authLogin.firstName);
  const roleId = useSelector((state) => state.authLogin.role_id);

  const handleLogout = () => {
    dispatch(logout());
    nav('/');
  };

  const handleNavigation = () => {
    nav('/designer/certificate');
  };

  const handleNavigationEditProfile = () => {
    nav('/edit-profile/edit');
  }

  const handleAddDetailsNavigation = () => {
    nav('/add-details/details');
  }

  return (
    <Wrapper className="container">
      <div className="CustomContainer">
        <div className="lightBg">
          <div className="CustomContainer">
            {roleId === 3 ? (
              <SpecialAdvertising className="flexSpaceCenter">
                <SpecialAddLeft>
                  <SpecialImgWrapper className="flexCenter">
                    <img className="radius8" src={asset(userImg)} alt="profile" />
                  </SpecialImgWrapper>
                </SpecialAddLeft>
                <SpecialAddRight>
                  <SpecialHeader>
                    <h2 className="font40 extraBold">Hello, {userName}</h2>
                    <VerifiedIconWrapper>
                      <img src={VerifiedIcon} alt="Verified" />
                      {/* <span className="font15 semiBold">Verified Designer</span> */}
                    </VerifiedIconWrapper>
                  </SpecialHeader>
                  <p className="font12">
                    As a verified designer, you have exclusive access to premium features and projects.
                    Continue to explore and innovate with our platform!
                  </p>
                  <ButtonsRow className="flexNullCenter" style={{ margin: "30px 0" }}>
                    <div style={{ width: "190px" }}>
                      <FullButton
                        title="Edit Profile"
                        action={handleNavigationEditProfile}
                      />
                    </div>
                   
                    <CenteredLogoutButton>
                      <FullButton
                        title="Logout"
                        style={{backgroundColor:'red'}}
                        action={handleLogout}
                      />
                    </CenteredLogoutButton>
                  </ButtonsRow>
                </SpecialAddRight>
              </SpecialAdvertising>
            ) : (
              <RegularAdvertising className="flexSpaceCenter">
                <RegularAddLeft>
                  <RegularImgWrapper className="flexCenter">
                    <img className="radius8" src={asset(userImg)} alt="profile" />
                  </RegularImgWrapper>
                </RegularAddLeft>
                <RegularAddRight>
                  <h4 className="font15 semiBold">A few words about company</h4>
                  <Header>
                    <h2 className="font40 extraBold">Hello, {userName}</h2>
                  </Header>
                  <p className="font12">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam nonumy eirmod tempor invidunt ut labore et dolore magna
                    aliquyam erat, sed diam voluptua. At vero eos et accusam et
                    justo duo dolores et ea rebum.
                  </p>
                  <ButtonsRow className="flexNullCenter" style={{ margin: "30px 0" }}>
                    <div style={{ width: "190px" }}>
                      <FullButton
                        title="Become a Designer"
                        action={handleNavigation}
                      />
                    </div>

                    <div style={{ width: "190px" }}>
                      <FullButton
                        title="Edit Profile"
                        action={handleNavigationEditProfile}
                      />
                    </div>

                    <CenteredLogoutButton>
                      <FullButton
                        title="Logout"
                        style={{backgroundColor:'red'}}
                        action={handleLogout}
                      />
                    </CenteredLogoutButton>
                  </ButtonsRow>
                </RegularAddRight>
              </RegularAdvertising>
            )}
          </div>
        </div>
        <HeaderInfo className="d-none">
          <h1 className="font40 extraBold">Our Awesome Projects</h1>
          <p className="font13">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut
            <br />
            labore et dolore magna aliquyam erat, sed diam voluptua.
          </p>
        </HeaderInfo>
        <div className="d-none row textCenter">
          <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <ProjectBox
              img={ProjectImg1}
              title="Awesome Project"
              text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor."
              action={() => alert("clicked")}
            />
          </div>
          <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <ProjectBox
              img={ProjectImg2}
              title="Awesome Project"
              text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor."
              action={() => alert("clicked")}
            />
          </div>
          <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <ProjectBox
              img={ProjectImg3}
              title="Awesome Project"
              text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor."
              action={() => alert("clicked")}
            />
          </div>
          <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <ProjectBox
              img={ProjectImg4}
              title="Awesome Project"
              text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor."
              action={() => alert("clicked")}
            />
          </div>
          <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <ProjectBox
              img={ProjectImg5}
              title="Awesome Project"
              text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor."
              action={() => alert("clicked")}
            />
          </div>
          <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <ProjectBox
              img={ProjectImg6}
              title="Awesome Project"
              text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor."
              action={() => alert("clicked")}
            />
          </div>
          <div style={{ margin: "50px 0", width: "200px" }}>
            <FullButton title="Load More" action={() => alert("clicked")} />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
`;

const CustomContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const SpecialAdvertising = styled.div`
  padding: 60px;
  margin: 60px 0;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SpecialAddLeft = styled.div`
  width: 40%;
`;

const SpecialImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #ddd;
  }
`;

const SpecialAddRight = styled.div`
  width: 60%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SpecialHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  h2 {
    font-size: 2rem;
  }
`;

const VerifiedIconWrapper = styled.div`
  display: flex;
  align-items: center;

  img {
    margin-bottom: 5px;
    width: 40px;
    height: 40px;
    margin-right: 8px;
  }

  span {
    font-size: 1rem;
    font-weight: 600;
  }
`;

const RegularAdvertising = styled.div`
  padding: 60px;
  margin: 60px 0;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 10px;
`;

const RegularAddLeft = styled.div`
  width: 40%;
`;

const RegularImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #ddd;
  }
`;

const RegularAddRight = styled.div`
  width: 60%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Header = styled.div`
  margin-bottom: 20px;

  h2 {
    font-size: 2rem;
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;

  div {
    flex: 1;
  }
`;

const CenteredLogoutButton = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
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

const ProjectGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const LoadMoreRow = styled.div`
  display: flex;
  justify-content: center;
  margin: 50px 0;
`;