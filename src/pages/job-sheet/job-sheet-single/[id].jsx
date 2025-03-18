import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import asset from "../../../api/jobhelper";
import assetProfile from "../../../api/helper";
import { FetchingSingleJobsheet } from "../../../thunks/FetchingSingleJobsheet";
import { FetchingDesignerJobsheetResponse } from "../../../thunks/FetchingDesignerJobsheetResponse";
import defaultImage from "../../../assets/img/defaultphoto.jpg";

const Id = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const userImg = useSelector((state) => state.authLogin.profileUrl);
  const userName = useSelector((state) => state.authLogin.firstName);
  const navigate = useNavigate()

  const {
    data: jobSheet,
    error,
    loading,
  } = useSelector((state) => state.FetchingSingleJobsheet);

  const {
    jobsheet: sheets,
    Loading,
    Error,
  } = useSelector((state) => state.FetchingDesignerJobsheetResponse);

  useEffect(() => {
    dispatch(FetchingSingleJobsheet(id));
    dispatch(FetchingDesignerJobsheetResponse(id));
  }, [dispatch, id]);

  if (loading || Loading) {
    return <Container>Loading...</Container>;
  }

  if (error || Error) {
    return <Container>Error: {error || Error}</Container>;
  }

  if (!jobSheet || !sheets) {
    return <Container>No data available</Container>;
  }

  return (
    <>
      <Container>
        <Header>
          <UserCard>
            <ProfileUrl>
              <img
                src={assetProfile(userImg) || defaultImage}
                alt="User Profile"
              />
            </ProfileUrl>
            <UserName>{userName || "User"}</UserName>
          </UserCard>
          <DetailsCard>
            <StatusBadge status={jobSheet.status}>
              {jobSheet.status}
            </StatusBadge>
            <Title>{jobSheet.job_sheet_title}</Title>
            <Details>
              <DetailItem>
                <strong>Description:</strong> {jobSheet.job_sheet_description}
              </DetailItem>
              <DetailItem>
                <strong>From:</strong>{" "}
                {new Date(jobSheet.from_to).toLocaleDateString()}
              </DetailItem>
              <DetailItem>
                <strong>End:</strong>{" "}
                {new Date(jobSheet.end_at).toLocaleDateString()}
              </DetailItem>
              <DetailItem>
                <strong>Budget:</strong>{" "}
                {(+jobSheet.budget).toLocaleString("en-US", {
                  style: "currency",
                  currency: "INR",
                })}
              </DetailItem>
            </Details>
          </DetailsCard>
        </Header>
        <ImagesContainer>
          {jobSheet.images && jobSheet.images.length > 0 ? (
            jobSheet.images.map((image) => {
              const imageUrl = asset(image.job_sheet_urls);
              return (
                <ImageCard key={image.job_sheet_id}>
                  <img
                    src={imageUrl}
                    alt={`Job Sheet ${image.job_sheet_id}`}
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                </ImageCard>
              );
            })
          ) : (
            <p>No images available</p>
          )}
        </ImagesContainer>
      </Container>
     
      <HeadingTwo>Applied Designers</HeadingTwo>
      <JobsheetContainer>
        {sheets.map((item, index) => (
          <JobsheetItem key={index}>
            <ProfileContainer>
              <ProfileImage src={assetProfile(item.user.profileUrl)} alt="Profile" />
            </ProfileContainer>
            <JobsheetInfo>
              <JobsheetTitle>{item.user.firstName}</JobsheetTitle>
              <JobsheetDescription></JobsheetDescription>
              <JobsheetDates>
                <span>End: {new Date(item.designer_end_date).toDateString()}</span>
              </JobsheetDates>
              <JobsheetBudget>{`Budget: ${(+item.designer_budget).toLocaleString("en-US", {
                style: 'currency',
                currency: "INR",
              })}`}</JobsheetBudget>
              <JobsheetStatus status={item.status}>
                {item.status}
              </JobsheetStatus>
              <MoreDetailsButton onClick={() => navigate(`/designer-job-sheets/designer-job-sheet-single-view/${item.id}`)}>
                More Details
              </MoreDetailsButton>
            </JobsheetInfo>
          </JobsheetItem>
        ))}
      </JobsheetContainer>
    </>
  );
};

export default Id;

// Styled Components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
  max-width: 2000px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  @media (max-width: 1200px) {
    padding: 30px;
  }

  @media (max-width: 992px) {
    padding: 20px;
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 40px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }

  @media (min-width: 1200px) {
    gap: 50px;
  }
`;

const UserCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (min-width: 1200px) {
    padding: 30px;
  }

  @media (min-width: 768px) {
    flex: 0.3;
  }
`;

const ProfileUrl = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #eee;
  margin-bottom: 15px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (min-width: 1200px) {
    width: 150px;
    height: 150px;
  }
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin: 0;

  @media (min-width: 1200px) {
    font-size: 2rem;
  }
`;

const DetailsCard = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  position: relative;
  flex: 0.7;
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 1200px) {
    padding: 40px;
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 5px 15px;
  background-color: ${({ status }) => status === "completed" ? "#0066b2" : status === "approved" ? "#039487" : status === "pending" ? "red" : "#F44336"};
  color: #fff;
  font-weight: bold;
  border-radius: 20px;
  font-size: 0.9rem;
  text-transform: capitalize;

  @media (min-width: 1200px) {
    font-size: 1.1rem;
    padding: 8px 20px;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  color: #ff7e67;
  margin: 0 0 20px 0;
  text-transform: capitalize;
  transition: color 0.3s ease;

  &:hover {
    color: #ffba93;
  }

  @media (min-width: 1200px) {
    font-size: 2.5rem;
  }
`;

const Details = styled.div`
  margin-top: 15px;
  font-size: 1rem; /* Reduced font size */

  p {
    margin: 8px 0;
  }

  @media (min-width: 1200px) {
    font-size: 1.3rem;
  }
`;

const DetailItem = styled.p`
  margin: 0;
  line-height: 1.4;
  font-size: 0.9rem;

  @media (min-width: 1200px) {
    line-height: 1.8;
  }
`;

const ImagesContainer = styled.div`
  margin-top: 40px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;

  @media (min-width: 1200px) {
    gap: 20px;
  }
`;

const ImageCard = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 10px;
  overflow: hidden;
  border: 3px solid #eee;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (min-width: 1200px) {
    width: 200px;
    height: 200px;
  }
`;

const Heading = styled.h1`
  font-size: 2rem;
  text-align: center;
  color: #ff7e67;
  margin-top: 40px;
`;

// --------------------------------------------------- Jobsheet Card Css ------------------------------------------------

const JobsheetContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
  max-width: 1500px;
  margin: 0 auto;

  @media (max-width: 992px) {
    /* md devices */
    grid-template-columns: repeat(2, 1fr);
    padding: 15px;
  }

  @media (max-width: 768px) {
    /* sm devices */
    grid-template-columns: 1fr;
    padding: 10px;
  }
`;

const HeadingTwo = styled.h1`
  font-size: 32px;
  margin-bottom: 20px;
  text-align: center;
  margin-top: 10px;
  color: #2c3e50;
  font-weight: 700;
`;

const JobsheetItem = styled.div`
  display: flex;
  align-items: flex-start;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: transform 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProfileContainer = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 20px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const JobsheetInfo = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
`;

const JobsheetTitle = styled.h2`
  font-size: 20px;
  color: #7620ff;
  margin-bottom: 10px;
  text-transform: capitalize;
`;

const JobsheetDescription = styled.p`
  font-size: 16px;
  color: #7f8c8d;
  line-height: 1.6;
`;

const JobsheetDates = styled.div`
  font-size: 14px;
  color: #95a5a6;
  display: flex;
  justify-content: space-between;
`;

const JobsheetBudget = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #27ae60;
  margin-top: 10px;
`;

const JobsheetStatus = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  text-align: center;
  text-transform: capitalize;
  border-radius: 12px;
  color: #fff;
  background-color: ${({ status }) =>
    status === "ongoing"
      ? "#2ecc71"
      : status === "rejected"
        ? "#e74c3c"
        : status === "shortlist"
          ? "#f39c12"
          : status === "hired"
            ? "#4CAF50"
            : "#95a5a6"}; 
  font-weight: 700;
  font-size: 14px;
  
  white-space: nowrap;
  border: 1px solid ${({ status }) =>
    status === "ongoing"
      ? "#27ae60"
      : status === "rejected"
        ? "#c0392b"
        : status === "shortlist"
          ? "#e67e22"
          : status === "hired"
            ? "#2ecc71"
            : "#7f8c8d"}; 
`;


const MoreDetailsButton = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  background-color: transparent; 
  color: #7620ff; 
  border: 2px solid #7620ff; 
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #7620ff;
    color: #fff;
    border: 2px solid transparent; 
  }
`;
