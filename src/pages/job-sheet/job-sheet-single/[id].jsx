import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import assetjob from "../../../api/jobhelper";
import assetProfile from "../../../api/helper";
import { FetchingSingleJobsheet } from "../../../thunks/FetchingSingleJobsheet";
import { FetchingDesignerJobsheetResponse } from "../../../thunks/FetchingDesignerJobsheetResponse";
import defaultImage from "../../../assets/img/defaultphoto.jpg";
// import { CardFooter } from "react-bootstrap";

const Id = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const userImg = useSelector((state) => state.authLogin.profileUrl);
  const userName = useSelector((state) => state.authLogin.firstName);
  const userEmail = useSelector((state) => state.authLogin.email);
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

  const [selectedImage, setSelectedImage] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    dispatch(FetchingSingleJobsheet(id));
    dispatch(FetchingDesignerJobsheetResponse(id));
  }, [dispatch, id]);

  if (loading || Loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>Loading job details...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error || Error) {
   return (
      <ErrorContainer>
        <ErrorIcon>❌</ErrorIcon>
        <ErrorMessage>Failed to load job details. Please try again later.</ErrorMessage>
        <RetryButton onClick={() => dispatch(FetchingDesignerJobsheet(id))}>
          Retry
        </RetryButton>
      </ErrorContainer>
    );
  }

  if (!jobSheet || !sheets) {
    return (
      <EmptyContainer>
        <EmptyIcon>📋</EmptyIcon>
        <EmptyMessage>No job details available for this ID</EmptyMessage>
        <BackButton onClick={() => navigate(-1)}>
          Go Back
        </BackButton>
      </EmptyContainer>
    );
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'rejected':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const daysRemaining = () => {
    const today = new Date();
    const endDate = new Date(jobSheet.end_at);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <>
      <PageWrapper>
        <BreadcrumbNav>
            <BreadcrumbLink onClick={() => navigate("/")}>Home</BreadcrumbLink>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbCurrent>Job Sheet</BreadcrumbCurrent>
        </BreadcrumbNav>
        
        <Header>
          <UserCard>
            <ProfileImage><img src={assetProfile(userImg)} alt="Profile Error" /></ProfileImage>
            <UserName>{userName}</UserName>
            <ContactButton onClick={() => setShowContact(!showContact)}>
              {showContact ? "Hide Contact" : "Show Contact"}
            </ContactButton>
            {showContact && (
              <ContactInfo>
                <ContactItem><ContactIcon>📧</ContactIcon>{userEmail || 'N/A'}</ContactItem>
                <ContactItem><ContactIcon>📱</ContactIcon>2236981247</ContactItem>
              </ContactInfo>
            )}
            <UserStats>
                <StatItem>
                  <StatValue>0</StatValue>
                  <StatLabel>Jobs</StatLabel>
                </StatItem>

                <StatItem>
                  <StatValue>0</StatValue>
                  <StatLabel>Jobs</StatLabel>
                </StatItem>
            </UserStats>
          </UserCard>
          
          <DetailsCard>
            <StatusBadge color={getStatusColor(jobSheet.status)}>{jobSheet.status || 'N/a'}</StatusBadge>

            <Title>{jobSheet.job_sheet_title}</Title>

            <MetaInfo>
              <MetaItem>
                <MetaIcon>📅</MetaIcon>
                  <div>
                    <MetaLabel>Timeline</MetaLabel>
                    <MetaValue>
                       {new Date(jobSheet.from_to).toLocaleDateString()} -  {new Date(jobSheet.end_at).toLocaleDateString()}
                    </MetaValue>
                  </div>
              </MetaItem>

              <MetaItem>
                <MetaIcon>⏱️</MetaIcon>
                  <div>
                    <MetaLabel>Deadline</MetaLabel>
                    <MetaValue>
                       { daysRemaining() } days remaining
                    </MetaValue>
                  </div>
              </MetaItem>

              <MetaItem>
                <MetaIcon>💰</MetaIcon>
                <div>
                  <MetaLabel>Budget</MetaLabel>
                  <MetaValue>
                    {(+jobSheet.budget).toLocaleString("en-US", {
                      style: "currency",
                      currency: "INR",
                    })} 
                  </MetaValue>
                </div>
              </MetaItem>
            </MetaInfo>

            <DetailSection>
              <SectionTitle>Job Description</SectionTitle>
              <Description>{jobSheet.job_sheet_description}</Description>
            </DetailSection>

          </DetailsCard>
        </Header>

        <ImagesSection>
          <SectionTitle>Project References</SectionTitle>
          <ImagesContainer>
            {jobSheet.images && jobSheet.images.length > 0 ? (
              jobSheet.images.map((image, index) => {
                const imageUrl = assetjob(image.job_sheet_urls);
                return (
                  <ImageCard key={index} onClick={() => openImageModal(imageUrl)}>
                    <img
                      src={imageUrl}
                      alt={`Job Sheet ${image.job_sheet_id}`}
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                    />
                    <ImageOverlay>
                      <OverlayText>View</OverlayText>
                    </ImageOverlay>
                  </ImageCard>
                );
              })
            ) : (
              <NoImagesMessage>No reference images available</NoImagesMessage>
            )}
          </ImagesContainer>

          
        {selectedImage && (
          <ImageModal onClick={closeImageModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={closeImageModal}>×</CloseButton>
              <ModalImage src={selectedImage} alt="Enlarged view" />
            </ModalContent>
          </ImageModal>
        )}
        </ImagesSection>

        <ImagesSection>
          <SectionTitle>Applied Designers</SectionTitle>
            <DesignerCardGrid>
              {sheets.map((sheet, index) => (
                <DesignerCard key={index}>
                  <Status status={sheet.status}>{sheet.status}</Status>
                  <CardHeader>
                      <CardProfile src={assetProfile(sheet.user.profileUrl)} alt="Profile Error"/>
                      <Info>
                        <Name>{sheet.user.firstName}</Name>
                        <Time>{new Date(sheet.designer_end_date).toLocaleDateString()}</Time>
                      </Info>
                  </CardHeader>
                  <CardDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit.</CardDescription>
                  <CardFooter>
                      <Budget>{(+sheet.designer_budget).toLocaleString("en-US", {style: "currency", currency: "INR"})}</Budget>
                      <ViewMore onClick={() => navigate(`/designer-job-sheets/designer-job-sheet-single-view/${sheet.id}`)}>
                        More Details
                        <ButtonArrow>→</ButtonArrow>
                      </ViewMore>
                  </CardFooter>
                  </DesignerCard>
              ))}
            </DesignerCardGrid>
        </ImagesSection>
      </PageWrapper>

    </>
  );
};

export default Id;


const DesignerCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  padding: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DesignerCard = styled.div`
  position: relative;
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.35s ease;
  cursor: pointer;
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #f0f2f5;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
    border-color: rgba(118, 32, 255, 0.2);
  }
`;

const Status = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  background-color:${({ status }) => status === "completed" ? "#0066b2" : status === "approved" ? "#039487" : status === "pending" ? "red" : "#F44336"} ;
  color: white;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  text-transform: uppercase;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
`;

const CardProfile = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
  text-transform: capitalize;
  margin-bottom: 2px;
`;

const Time = styled.div`
  font-size: 14px;
  color: #718096;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #718096;
    margin-right: 6px;
  }
`;

const CardDescription = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 20px;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #f0f2f5;
`;

const Budget = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #38a169;
  
  &::before {
    font-size: 14px;
    vertical-align: top;
    margin-right: 1px;
  }
`;

const ViewMore = styled.div`
  display: flex;
  align-items: center;
  color: #7620ff;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 6px 12px;
  border-radius: 8px;
  
  &:hover {
    background-color: rgba(118, 32, 255, 0.08);
    color: #6010e0;
  }
`;

const ButtonArrow = styled.div`
  margin-left: 6px;
`;

const PageWrapper = styled.div`
  background-color: #f7f9fc;
  min-height: 100vh;
  padding: 20px;
`;


const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  font-size: 0.9rem;
  color: #6B7280;
`;

const BreadcrumbLink = styled.span`
  cursor: pointer;
  color: #7620ff;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 8px;
  color: #D1D5DB;
`;

const BreadcrumbCurrent = styled.span`
  color: #4B5563;
  font-weight: 500;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Header = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const UserCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  flex: 0.35;
  position: relative;
  border: 1px solid #f0f0f0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    width: 100%;
  }
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #f0f0f0;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  color: #1F2937;
  text-align: center;
  margin: 0 0 6px 0;
  font-weight: 600;
`;

const UserEmail = styled.h3`
  font-size: 0.95rem;
  color: #6B7280;
  text-align: center;
  margin: 0 0 20px 0;
  font-weight: 400;
`;

const ContactButton = styled.button`
  background-color: transparent;
  color: #7620ff;
  border: 1px solid #7620ff;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #7620ff;
    color: white;
  }
`;

const ContactInfo = styled.div`
  width: 100%;
  margin-top: 15px;
  padding: 12px;
  background-color: #F9FAFB;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #4B5563;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ContactIcon = styled.span`
  margin-right: 8px;
`;

const UserStats = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #E5E7EB;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1F2937;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #6B7280;
  margin-top: 4px;
`;

const DetailsCard = styled.div`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  flex: 0.65;
  border: 1px solid #f0f0f0;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    width: 100%;
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 6px 15px;
  background-color: ${props => props.color || '#6B7280'};
  color: white;
  font-weight: 600;
  border-radius: 30px;
  font-size: 0.85rem;
  text-transform: capitalize;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.2rem;
  color: #1F2937;
  margin: 0 0 25px 0;
  font-weight: 700;
  border-bottom: 3px solid #7620ff;
  padding-bottom: 10px;
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-right: 80px;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #F9FAFB;
  padding: 12px 15px;
  border-radius: 10px;
  flex: 1;
  min-width: 150px;
  border: 1px solid #E5E7EB;
`;

const MetaIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 15px;
`;

const MetaLabel = styled.div`
  font-size: 0.8rem;
  color: #6B7280;
  margin-bottom: 2px;
`;

const MetaValue = styled.div`
  font-size: 1rem;
  color: #1F2937;
  font-weight: 500;
`;

const DetailSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #1F2937;
  margin-bottom: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  
  &:after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #E5E7EB;
    margin-left: 15px;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #4B5563;
  white-space: pre-line;
`;

const RequirementsList = styled.ul`
  margin: 0;
  padding-left: 20px;
`;

const RequirementItem = styled.li`
  font-size: 1rem;
  color: #4B5563;
  margin-bottom: 8px;
  line-height: 1.5;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  padding: 12px 30px;
  background-color: #7620ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(118, 32, 255, 0.25);
  
  &:hover {
    background-color: #6010e0;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(118, 32, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled.button`
  padding: 12px 20px;
  background-color: transparent;
  color: #374151;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #F3F4F6;
    border-color: #9CA3AF;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background-color: transparent;
  color: #374151;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-left: auto;
  
  &:hover {
    background-color: #F3F4F6;
    border-color: #9CA3AF;
    color: #7620ff;
  }
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const SaveIcon = styled.span`
  margin-right: 8px;
`;

const ImagesSection = styled.div`
  margin-top: 20px;
`;

const ImagesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
`;

const ImageCard = styled.div`
  position: relative;
  height: 240px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ImageCard}:hover & {
    opacity: 1;
  }
`;

const OverlayText = styled.div`
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 500;
`;

const NoImagesMessage = styled.p`
  grid-column: 1 / -1;
  text-align: center;
  color: #6B7280;
  font-style: italic;
  padding: 40px 0;
  background-color: #F9FAFB;
  border-radius: 8px;
  border: 1px dashed #D1D5DB;
`;

const ImageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
`;

const ModalImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  color: #1F2937;
  border: none;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: #F3F4F6;
  }
`;

const SimilarJobsSection = styled.div`
  max-width: 1200px;
  margin: 40px auto 0;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 30px;
  
  @media (max-width: 768px) {
    padding: 20px;
    margin-top: 20px;
  }
`;

const SimilarJobsNotice = styled.p`
  text-align: center;
  color: #6B7280;
  padding: 40px;
  border: 1px dashed #D1D5DB;
  border-radius: 8px;
  background-color: #F9FAFB;
`;

// Loading components
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #7620ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #6B7280;
`;

// Error components
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  color: #EF4444;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  color: #4B5563;
  margin-bottom: 30px;
`;

const RetryButton = styled.button`
  padding: 10px 20px;
  background-color: #7620ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #6010e0;
  }
`;

// Empty state components
const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  color: #9CA3AF;
  margin-bottom: 20px;
`;

const EmptyMessage = styled.p`
  font-size: 1.2rem;
  color: #4B5563;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background-color: #7620ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #6010e0;
  }
`;

