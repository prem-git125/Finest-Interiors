import React, { useEffect, useState } from "react";
import styled from "styled-components";
import defaultImage from "../../../assets/img/defaultphoto.jpg";
import { useDispatch, useSelector } from "react-redux";
import { FetchingSingleDesignerJobsheetResponse } from "../../../thunks/FetchingSingleDesignerJobsheetResponse";
import { useNavigate, useParams } from "react-router";
import asset from "../../../api/helper";
import { clearMessage } from "../../../slice/DesignerRejected";
import { DesignerRejected } from "../../../thunks/DesignerRejected";
import { DesignerShortlisting } from "../../../thunks/DesignerShortlisting";
import { FinishWorkApproval, FinishWorkReject } from "../../../thunks/FinishWorkApprovalRejectStatus";
import { CreatePayment, PaymentStatus } from "../../../thunks/CreatePayment";
import designerAsset from "../../../api/designerhelper";
import useRazorpay from "react-razorpay";
import Swal from "sweetalert2";

const Id = () => {
  const [Razorpay] = useRazorpay();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [openRejectTextarea, setOpenRejectTextarea] = useState(false);
  const [formData, setFormData] = useState({
    rejected_reason: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const dataState = useSelector((state) => state.FetchingSingleDesignerJobsheetResponse);
  const rejectState = useSelector((state) => state.DesignerRejected);
  const paymentState = useSelector((state) => state.CreatePayment);
  const shortlistState = useSelector((state) => state.DesignerShortlisting);
  const { data, loading, error } = dataState;
  const { success } = rejectState;

  useEffect(() => {
    dispatch(FetchingSingleDesignerJobsheetResponse(id));

    if (success) {
      navigate("/");
      dispatch(clearMessage());
    }
  }, [dispatch, id, success, navigate]);

  const handleOpenTextArea = () => setOpenRejectTextarea(true);
  const handleCloseTextArea = () => setOpenRejectTextarea(false);

  const handleSubmit = () => {
    if (!formData.rejected_reason.trim()) {
      Swal.fire({
        title: "Warning!",
        text: "Please provide a reason for rejection.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    
    dispatch(
      DesignerRejected({ id, rejected_reason: formData.rejected_reason })
    );
  };

  const handleShortlistUser = () => dispatch(DesignerShortlisting(id));

  const handleHirePayments = async () => {
    try {
      Swal.fire({
        title: "Processing",
        text: "Preparing payment...",
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      const createPayment = await dispatch(
        CreatePayment({
          userId: data.designer_id,
          job_sheet_apply_id: id,
          amount: data.designer_budget,
        })
      );

      if (createPayment.payload.orderID) {
        Swal.close();
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount: createPayment.payload.amount,
          currency: "INR",
          name: `${data.user.firstName} ${data.user.lastName}`,
          image: asset(data.user.profileUrl),
          order_id: createPayment.payload.orderID,
          handler: async (response) => {
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              job_sheet_apply_id: id,
              razorpay_payment_mode: response.razorpay_payment_mode,
              razorpay_signature: response.razorpay_signature,
            };
            dispatch(PaymentStatus(paymentData));
            
            Swal.fire({
              title: "Success!",
              text: "Payment processed successfully. Designer has been hired!",
              icon: "success",
              confirmButtonText: "OK",
            });
          },
          prefill: {
            name: data.user.firstName,
            email: data.user.email,
          },
          theme: {
            color: "#6a216a",
          },
        };
        const razorpay = new Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred during payment. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleAcceptRequest = () => {
    Swal.fire({
      title: "Confirm Acceptance",
      text: "Are you sure you want to accept this work?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Accept",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(FinishWorkApproval(id));
        Swal.fire({
          title: "Success!",
          text: "The work has been accepted.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  const handleRejectRequest = () => {
    Swal.fire({
      title: "Confirm Rejection",
      text: "Are you sure you want to reject this work?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(FinishWorkReject(id));
        Swal.fire({
          title: "Success!",
          text: "The work has been rejected.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  // Loading state
  if (loading || rejectState.loading || shortlistState.loading || paymentState.loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>Loading designer details...</LoadingText>
      </LoadingContainer>
    );
  }

  // Error state
  if (error || rejectState.error || shortlistState.error || paymentState.error) {
    return (
      <ErrorContainer>
        <ErrorIcon>⚠️</ErrorIcon>
        <ErrorText>
          Error: {error || rejectState.error || shortlistState.error || paymentState.error}
        </ErrorText>
        <RetryButton onClick={() => dispatch(FetchingSingleDesignerJobsheetResponse(id))}>
          Retry
        </RetryButton>
      </ErrorContainer>
    );
  }

  // No data state
  if (!data) {
    return (
      <NoDataContainer>
        <NoDataIcon>📂</NoDataIcon>
        <NoDataText>No information available for this designer</NoDataText>
        <BackButton onClick={() => navigate("/")}>
          Return to Dashboard
        </BackButton>
      </NoDataContainer>
    );
  }

  // Format date for better display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openImageModel = (imageUrl) => {
    setSelectedImage(imageUrl);
  }

  const closeImageModel = () => {
    setSelectedImage(null);
  }

  return (
    <PageContainer>
      <BreadcrumbNav>
        <BreadcrumbLink onClick={() => navigate("/")}>Dashboard</BreadcrumbLink>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbLink onClick={() => navigate("/designers")}>Designers</BreadcrumbLink>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>{data.user.firstName}'s Proposal</BreadcrumbCurrent>
      </BreadcrumbNav>

        <Header>
          <UserCard>
            <ProfileContainer>
              <ProfileUrlWrapper>
                <img src={asset(data.user.profileUrl)} alt="User Profile" />
              </ProfileUrlWrapper>
              <StatusBadge status={data.status}>{data.status}</StatusBadge>
            </ProfileContainer>
            <UserInfo>
              <UserName>
                {data.user.firstName} {data.user.lastName}
              </UserName>
              <UserEmail>{data.user.email}</UserEmail>
            </UserInfo>
            
            <ContactSection>
              <SectionTitle>Contact</SectionTitle>
              <ContactButton>
                <EmailIcon>✉️</EmailIcon>
                Message
              </ContactButton>
            </ContactSection>
          </UserCard>
          
          <DetailsCard>
            <DetailHeader>
              <DetailTitle>Design Proposal</DetailTitle>
              <CompletionDate>
                Complete by: <strong>{formatDate(data.designer_end_date)}</strong>
              </CompletionDate>
            </DetailHeader>
            
            <ProposalSection>
              <SectionTitle>Proposal</SectionTitle>
              <ProposalText>{data.proposal}</ProposalText>
            </ProposalSection>
            
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Budget</InfoLabel>
                <InfoValue>
                  {(+data.designer_budget).toLocaleString("en-US", {
                    style: "currency",
                    currency: "INR",
                  })}
                </InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>Delivery Date</InfoLabel>
                <InfoValue>{formatDate(data.designer_end_date)}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>Status</InfoLabel>
                <InfoValue>{data.status}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>Work Status</InfoLabel>
                <InfoValue>{data.finish_work_status || "Not submitted"}</InfoValue>
              </InfoItem>
            </InfoGrid>

            {data.status !== 'hired' && (
              <ActionSection>
                <SectionTitle>Actions</SectionTitle>
                <ButtonGroup>
                  <ShortlistButton onClick={handleShortlistUser} disabled={shortlistState.loading}>
                    {shortlistState.loading ? 
                      <ButtonSpinner /> : 
                      <>
                        <StarIcon>⭐</StarIcon>
                        Shortlist
                      </>
                    }
                  </ShortlistButton>
                  
                  <HireButton onClick={handleHirePayments} disabled={paymentState.loading}>
                    {paymentState.loading ? 
                      <ButtonSpinner /> : 
                      <>
                        <HireIcon>🤝</HireIcon>
                        Hire Now
                      </>
                    }
                  </HireButton>
                  
                  <RejectButton onClick={handleOpenTextArea}>
                    <RejectIcon>✕</RejectIcon>
                    Reject
                  </RejectButton>
                </ButtonGroup>
              </ActionSection>
            )}

            {data.finish_work_status === 'requested' && (
              <ActionSection>
                <SectionTitle>Work Review</SectionTitle>
                <ReviewMessage>
                  The designer has completed the work and is requesting your approval.
                </ReviewMessage>
                <ButtonGroup>
                  <AcceptButton onClick={handleAcceptRequest}>
                    <AcceptIcon>✓</AcceptIcon>
                    Accept Work
                  </AcceptButton>
                  
                  <RejectButton onClick={handleRejectRequest}>
                    <RejectIcon>✕</RejectIcon>
                    Request Revisions
                  </RejectButton>
                </ButtonGroup>
              </ActionSection>
            )}

            {openRejectTextarea && (
              <RejectFormContainer>
                <FormHeader>
                  <FormTitle>Rejection Reason</FormTitle>
                  <CloseButton onClick={handleCloseTextArea}>✕</CloseButton>
                </FormHeader>
                
                <RejectTextArea
                  onChange={handleChange}
                  value={formData.rejected_reason}
                  placeholder="Please provide a detailed reason for rejection to help the designer understand..."
                  id="rejected_reason"
                  name="rejected_reason"
                ></RejectTextArea>
                
                <FormFooter>
                  <SubmitButton onClick={handleSubmit} disabled={rejectState.loading}>
                    {rejectState.loading ? <ButtonSpinner /> : "Submit Rejection"}
                  </SubmitButton>
                  <CancelButton onClick={handleCloseTextArea}>
                    Cancel
                  </CancelButton>
                </FormFooter>
              </RejectFormContainer>
            )}
          </DetailsCard>
        </Header>
        
        <ProposalGallery>
          <GalleryTitle>Portfolio Samples</GalleryTitle>
          <ImagesContainer>
            {data.images && data.images.length > 0 ? (
              data.images.map((image, index) => {
                const imageUrl = designerAsset(image.designer_proposal_images);
                return (
                  <ImageCard key={image.id || index} onClick={() => openImageModel(imageUrl)}>
                    <ImageOverlay>
                      <ViewButton>
                        <ViewIcon>👁️</ViewIcon>
                        View
                      </ViewButton>
                    </ImageOverlay>
                    <StyledImage
                      src={imageUrl}
                      alt={`Design Sample ${index + 1}`}
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                    />
                  </ImageCard>
                );
              })
            ) : (
              <NoImagesMessage>No portfolio samples available</NoImagesMessage>
            )}
          </ImagesContainer>

         {selectedImage && (
           <ImageModal onClick={closeImageModel}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModelCloseButton onClick={closeImageModel}>×</ModelCloseButton>
              <ModalImage src={selectedImage} alt="Enlarged view" />
            </ModalContent>
          </ImageModal>
         )}

        </ProposalGallery>
    </PageContainer>
  );
};

export default Id;

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

const ModelCloseButton = styled.button`
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

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 20px;
`;

const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
  font-size: 0.9rem;
  color: #6b7280;
`;

const BreadcrumbLink = styled.span`
  cursor: pointer;
  color: #6a216a;
  transition: color 0.2s;
  &:hover {
    color: #8e2d8e;
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 8px;
  color: #9ca3af;
`;

const BreadcrumbCurrent = styled.span`
  font-weight: 500;
  color: #111827;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  height: fit-content;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const ProfileContainer = styled.div`
  position: relative;
  background: linear-gradient(135deg, #6a216a 0%, #9b4dca 100%);
  padding: 32px 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileUrlWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #f3f4f6;
  position: relative;
  z-index: 1;

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

const StatusBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 12px;
  background-color: ${({ status }) => {
    switch (status) {
      case 'hired':
        return '#10B981';
      case 'shortlist':
        return '#F59E0B';
      case 'ongoing':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  }};
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
  border-radius: 9999px;
  text-transform: capitalize;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
`;

const UserInfo = styled.div`
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px;
`;

const UserEmail = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const ContactSection = styled.div`
  padding: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 12px;
`;

const ContactButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8px 0;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const EmailIcon = styled.span`
  margin-right: 6px;
`;

const DetailsCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const DetailHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const DetailTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const CompletionDate = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 4px 12px;
  border-radius: 9999px;
`;

const ProposalSection = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const ProposalText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: #374151;
  margin: 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
`;

const ActionSection = styled.div`
  padding: 24px;
`;

const ReviewMessage = styled.p`
  background-color: #EFF6FF;
  border-left: 4px solid #3B82F6;
  padding: 12px 16px;
  margin-bottom: 16px;
  color: #1E40AF;
  font-size: 0.875rem;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const BaseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  min-width: 110px;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ShortlistButton = styled(BaseButton)`
  background-color: #FEF3C7;
  color: #B45309;
  
  &:hover:not(:disabled) {
    background-color: #FDE68A;
  }
`;

const HireButton = styled(BaseButton)`
  background-color: #34c759; // green background color
  color: #fff; // white text color

  &:hover:not(:disabled) {
    background-color: #2ecc40; // darker green hover background color
  }
`;

const RejectButton = styled(BaseButton)`
  background-color: #FEE2E2;
  color: #DC2626;
  
  &:hover:not(:disabled) {
    background-color: #FECACA;
  }
`;

const AcceptButton = styled(BaseButton)`
  background-color: #D1FAE5;
  color: #065F46;
  
  &:hover:not(:disabled) {
    background-color: #A7F3D0;
  }
`;

const StarIcon = styled.span`
  margin-right: 6px;
`;

const HireIcon = styled.span`
  margin-right: 6px;
`;

const RejectIcon = styled.span`
  margin-right: 6px;
`;

const AcceptIcon = styled.span`
  margin-right: 6px;
`;

const ButtonSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const RejectFormContainer = styled.div`
  padding: 24px;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const FormTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #111827;
  }
`;

const RejectTextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  resize: vertical;
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #6a216a;
    box-shadow: 0 0 0 3px rgba(106, 33, 106, 0.1);
  }
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
`;

const SubmitButton = styled(BaseButton)`
  background-color: #6a216a;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #8e2d8e;
  }
`;

const CancelButton = styled(BaseButton)`
  background-color: #f3f4f6;
  color: #4b5563;
  
  &:hover {
    background-color: #e5e7eb;
  }
`;

const ProposalGallery = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 24px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const GalleryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px;
`;

const ImagesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;

  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
`;

const ImageCard = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  aspect-ratio: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  &:hover > div {
    opacity: 1;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  background-color: white;
  color: #111827;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const ViewIcon = styled.span`
  margin-right: 4px;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const NoImagesMessage = styled.p`
  grid-column: 1 / -1;
  text-align: center;
  color: #6b7280;
  padding: 32px;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px dashed #d1d5db;
`;

// Loading, error and no data states
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
  border-radius: 50%;
  border-top: 5px solid #7620ff;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #6B7280;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
`;

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
`;

const NoDataIcon = styled.span`
  font-size: 2rem;
  color: #6B7280;
  margin-bottom: 16px;
`;

const NoDataText = styled.p`
  font-size: 1.2rem;
  color: #6B7280;
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