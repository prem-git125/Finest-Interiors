import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import defaultImg from "../../assets/img/defaultphoto.jpg";
import { useDispatch, useSelector } from "react-redux";
import { FetchingDesignerJobsheet } from "../../thunks/FetchingDesignerJobsheet";
import assetjob from "../../api/jobhelper";
import asset from "../../api/helper";

const Id = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobsheet, error, loading } = useSelector(
    (state) => state.FetchingDesignerJobsheet
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    dispatch(FetchingDesignerJobsheet(id));
  }, [dispatch, id]);

  const handleApply = () => {
    navigate(`/designer-apply-form/${id}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>Loading job details...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
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

  if (!jobsheet) {
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

  const daysRemaining = () => {
    const today = new Date();
    const endDate = new Date(jobsheet.end_at);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <PageWrapper>
      {/* <Container> */}
        <BreadcrumbNav>
          <BreadcrumbLink onClick={() => navigate("/")}>Home</BreadcrumbLink>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbCurrent>{jobsheet.job_sheet_title || "Job Details"}</BreadcrumbCurrent>
        </BreadcrumbNav>

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
            <UserEmail>{jobsheet.user?.email}</UserEmail>
            <ContactButton onClick={() => setShowContact(!showContact)}>
              {showContact ? "Hide Contact" : "Show Contact"}
            </ContactButton>
            {showContact && (
              <ContactInfo>
                <ContactItem><ContactIcon>📧</ContactIcon> {jobsheet.user?.email}</ContactItem>
                <ContactItem><ContactIcon>📱</ContactIcon> {jobsheet.user?.phone || "Not available"}</ContactItem>
              </ContactInfo>
            )}
            <UserStats>
              <StatItem>
                <StatValue>
                  {jobsheet.user?.completedJobs || 0}
                </StatValue>
                <StatLabel>Jobs</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>
                  {jobsheet.user?.rating || 0}
                </StatValue>
                <StatLabel>Rating</StatLabel>
              </StatItem>
            </UserStats>
          </UserCard>

          <DetailsCard>
            <StatusBadge color={getStatusColor(jobsheet.status)}>
              {jobsheet.status || "N/A"}
            </StatusBadge>
            
            <Title>{jobsheet.job_sheet_title || "Untitled Job"}</Title>
            
            <MetaInfo>
              <MetaItem>
                <MetaIcon>📅</MetaIcon>
                <div>
                  <MetaLabel>Timeline</MetaLabel>
                  <MetaValue>
                    {formatDate(jobsheet.from_to)} — {formatDate(jobsheet.end_at)}
                  </MetaValue>
                </div>
              </MetaItem>
              
              <MetaItem>
                <MetaIcon>⏱️</MetaIcon>
                <div>
                  <MetaLabel>Deadline</MetaLabel>
                  <MetaValue>{daysRemaining()} days remaining</MetaValue>
                </div>
              </MetaItem>
              
              <MetaItem>
                <MetaIcon>💰</MetaIcon>
                <div>
                  <MetaLabel>Budget</MetaLabel>
                  <MetaValue>
                    {(+jobsheet.budget).toLocaleString("en-US", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </MetaValue>
                </div>
              </MetaItem>
            </MetaInfo>
            
            <DetailSection>
              <SectionTitle>Description</SectionTitle>
              <Description>{jobsheet.job_sheet_description || "No description available."}</Description>
            </DetailSection>

            {jobsheet.requirements && (
              <DetailSection>
                <SectionTitle>Requirements</SectionTitle>
                <RequirementsList>
                  {jobsheet.requirements.split('\n').map((req, index) => (
                    <RequirementItem key={index}>{req}</RequirementItem>
                  ))}
                </RequirementsList>
              </DetailSection>
            )}
            
            <ActionButtons>
              {jobsheet.status?.toLowerCase() === "pending" && (
                <PrimaryButton onClick={handleApply}>
                  Apply Now
                </PrimaryButton>
              )}
              <SecondaryButton onClick={() => navigate("/jobs")}>
                View Similar Jobs
              </SecondaryButton>
              <SaveButton>
                <SaveIcon>🔖</SaveIcon> Save
              </SaveButton>
            </ActionButtons>
          </DetailsCard>
        </Header>

        <ImagesSection>
          <SectionTitle>Project References</SectionTitle>
          <ImagesContainer>
            {jobsheet.images && jobsheet.images.length > 0 ? (
              jobsheet.images.map((image, index) => {
                const imageUrl = assetjob(image.job_sheet_urls);
                return (
                  <ImageCard key={index} onClick={() => openImageModal(imageUrl)}>
                    <img
                      src={imageUrl}
                      alt={`Job Sheet ${image.job_sheet_id}`}
                      onError={(e) => {
                        e.target.src = defaultImg;
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
        </ImagesSection>

        {selectedImage && (
          <ImageModal onClick={closeImageModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={closeImageModal}>×</CloseButton>
              <ModalImage src={selectedImage} alt="Enlarged view" />
            </ModalContent>
          </ImageModal>
        )}
      {/* </Container> */}
    </PageWrapper>
  );
};

export default Id;

// Styled Components
const PageWrapper = styled.div`
  background-color: #f7f9fc;
  min-height: 100vh;
  padding: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 30px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
  }
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