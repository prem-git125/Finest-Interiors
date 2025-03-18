import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import defaultImg from "../../assets/img/defaultphoto.jpg";
import { useDispatch, useSelector } from "react-redux";
import { FetchingDesignerJobsheet } from "../../thunks/FetchingDesignerJobsheet";
import assetjob from "../../api/jobhelper";
import asset from "../../api/helper";

const Id = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { jobsheet, error, loading } = useSelector(
    (state) => state.FetchingDesignerJobsheet
  );

  useEffect(() => {
    dispatch(FetchingDesignerJobsheet(id));
  }, [dispatch, id]);

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return <Container>Error...</Container>;
  }

  if (!jobsheet) {
    return <Container>No data available</Container>;
  }

  return (
    <Container>
      <Header>
        <UserCard>
          <ProfileImage>
            <img
              src={asset(jobsheet.user?.profileUrl) || defaultImg}
              alt="User Profile"
            />
          </ProfileImage>
          <UserName>
            {jobsheet.user?.firstName} {jobsheet.user?.lastName}
          </UserName>
          <UserName>{jobsheet.user?.email}</UserName>
        </UserCard>
        <DetailsCard>
          <StatusBadge status={jobsheet.status}>{jobsheet.status}</StatusBadge>
          <Title>{jobsheet.job_sheet_title}</Title>
          <Details>
            <DetailItem>
              <strong>Description:</strong> {jobsheet.job_sheet_description}
            </DetailItem>

            <DetailItem>
              <strong>From:</strong>{" "}
              {new Date(jobsheet.from_to).toLocaleDateString()}
            </DetailItem>
            <DetailItem>
              <strong>End:</strong>{" "}
              {new Date(jobsheet.end_at).toLocaleDateString()}
            </DetailItem>
            <DetailItem>
              <strong>Budget:</strong>{" "} 
              {(+jobsheet.budget).toLocaleString("en-US", {
                style: "currency",
                currency: "INR",
              })}
            </DetailItem>
            {/* if status is Approved then hide Approval button */}
            {jobsheet.status === "pending" && (
               <ApprovalButton onClick={() => navigate(`/designer-apply-form/${id}`)}>Apply Now</ApprovalButton>
            )}
          </Details>
        </DetailsCard>
      </Header>
      <ImagesContainer>
        {jobsheet.images && jobsheet.images.length > 0 ? (
          jobsheet.images.map((image) => {
            const imageUrl = assetjob(image.job_sheet_urls);
            return (
              <ImageCard key={image.job_sheet_id}>
                <img
                  src={imageUrl}
                  alt={`Job Sheet ${image.job_sheet_id}`}
                  onError={(e) => {
                    e.target.src = defaultImg;
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
  );
};

export default Id;

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

  @media (min-width: 768px) {
    flex: 0.3;
  }
`;

const ProfileImage = styled.div`
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
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin: 0;
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

  @media (min-width: 768px) {
    padding: 40px;
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 5px 15px;
  background-color: ${({ status }) =>
    status === "approved" || status === "completed"
      ? "#039487"
      : status === "pending" || status === "rejected"
      ? "red"
      : "#F44336"};
  color: #fff;
  font-weight: bold;
  border-radius: 20px;
  font-size: 0.9rem;
  text-transform: capitalize;
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
`;

const Details = styled.div`
  margin-top: 20px;
  font-size: 1.1rem;

  p {
    margin: 10px 0;
  }
`;

const DetailItem = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const ImagesContainer = styled.div`
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const ImageCard = styled.div`
  width: 300px;
  height: 300px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    transform: translateY(-5px);
  }
`;

const ApprovalButton = styled.button`
  margin-top: 1px;
  padding: 10px 50px;
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
