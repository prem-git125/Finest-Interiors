import React, { useEffect } from "react";
import styled from "styled-components";
import defaultImg from "../../assets/img/defaultphoto.jpg";
import asset from "../../api/helper";
import { useDispatch, useSelector } from "react-redux";
import { ProfileSingleView } from "../../thunks/ProfileSingleView";
import { useParams } from "react-router";

const Id = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data, error, loading } = useSelector((state) => state.ProfileSingleView);

  useEffect(() => {
    if (id) {
      dispatch(ProfileSingleView(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }

  if (!data) {
    return <NoDataMessage>No data available.</NoDataMessage>;
  }

  return (
    <Wrapper>
      <Container>
        <ProfileHeader>
          <ProfileImage src={asset(data.profileUrl) || defaultImg} alt="" />
          <DesignerInfo>
            <DesignerName>{data.firstName}</DesignerName>
            <DesignerDetails>
              <DetailItem>
                <Label>Email:</Label> {data.email}
              </DetailItem>
              <DetailItem>
                <Label>Phone:</Label> {data.users_details.phone}
              </DetailItem>
              <DetailItem>
                <Label>Location:</Label> {data.users_details.state}, {data.users_details.city}
              </DetailItem>
            </DesignerDetails>
          </DesignerInfo>
        </ProfileHeader>
        <ProfileBody>
          <SectionTitle>Bio</SectionTitle>
          <Bio>{data.users_details.caption}.</Bio>
          <SectionTitle>Projects</SectionTitle>
          <ProjectsContainer>
            {data.projects && data.projects.length > 0 ? (
              data.projects.map((project, index) => (
                <ProjectBox key={index}>
                  <ProjectImage src={project.imageUrl || defaultImg} alt={project.title} />
                  <ProjectTitle>{project.title}</ProjectTitle>
                </ProjectBox>
              ))
            ) : (
              <NoProjectsMessage>No projects available.</NoProjectsMessage>
            )}
          </ProjectsContainer>
        </ProfileBody>
      </Container>
    </Wrapper>
  );
};

export default Id;

// Styled Components

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  background: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1000px;
  width: 90%;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #6b73ff, #000dff);
  color: white;
  border-bottom: 2px solid #d9d9d9;
`;

const ProfileImage = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-right: 30px;
`;

const DesignerInfo = styled.div`
  flex: 1;
`;

const DesignerName = styled.h1`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
  letter-spacing: 1px;
`;

const DesignerDetails = styled.div`
  margin-top: 10px;
`;

const DetailItem = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Label = styled.span`
  font-weight: 600;
  margin-right: 5px;
`;

const ProfileBody = styled.div`
  padding: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
`;

const Bio = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 40px;
  color: #666;
`;

const ProjectsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const ProjectBox = styled.div`
  background: #f8f9fb;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const ProjectTitle = styled.h3`
  font-size: 20px;
  font-weight: 500;
  color: #333;
`;

const NoProjectsMessage = styled.p`
  font-size: 18px;
  color: #888;
  text-align: center;
  width: 100%;
`;

const LoadingMessage = styled.p`
  font-size: 22px;
  text-align: center;
  color: #555;
`;

const ErrorMessage = styled.p`
  font-size: 22px;
  text-align: center;
  color: red;
`;

const NoDataMessage = styled.h2`
  text-align: center;
  font-size: 24px;
  color: #888;
`;
