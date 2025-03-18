import React, { useEffect, useState, useCallback } from "react";
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
  const [OpenRejectTextarea, setOpenRejectTextarea] = useState(false);
  const [formData, setFormData] = useState({
    rejected_reason: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Selector hooks must always be invoked unconditionally
  const dataState = useSelector((state) => state.FetchingSingleDesignerJobsheetResponse);
  const rejectState = useSelector((state) => state.DesignerRejected);
  const paymentState = useSelector((state) => state.CreatePayment);
  const shortlistState = useSelector((state) => state.DesignerShortlisting);
  const approvalState = useSelector((state) => state.FinishWorkApproval);
  const rejectionState = useSelector((state) => state.FinishWorkReject);

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
    dispatch(
      DesignerRejected({ id, rejected_reason: formData.rejected_reason })
    );
  };

  const handleShortlistUser = () => dispatch(DesignerShortlisting(id));

  const handleHirePayments = async () => {
    try {
      const createPayment = await dispatch(
        CreatePayment({
          userId: data.designer_id,
          job_sheet_apply_id: id,
          amount: data.designer_budget,
        })
      );

      if (createPayment.payload.orderID) {
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
          },
          prefill: {
            name: data.user.firstName,
            email: data.user.email,
          },
          theme: {
            // color: "#F37254",
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
    dispatch(FinishWorkApproval(id));
    Swal.fire({
      title: "Success!",
      text: "Your request has been accepted.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      navigate("/");
    });
  };

  const handleRejectRequest = () => {
    dispatch(FinishWorkReject(id));
    Swal.fire({
      title: "Success!",
      text: "Your request has been rejected.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      navigate("/");
    });
  };

  if (loading || rejectState.loading || shortlistState.loading || paymentState.loading) {
    return <Container>Loading...</Container>;
  }

  if (error || rejectState.error || shortlistState.error || paymentState.error) {
    return (
      <Container>
        Error: {error || rejectState.error || shortlistState.error || paymentState.error}
      </Container>
    );
  }

  if (!data) {
    return <Container>No data available</Container>;
  }

  return (
    <Container>
      <Header>
        <UserCard>
          <ProfileUrl>
            <img src={asset(data.user.profileUrl)} alt="User Profile" />
          </ProfileUrl>
          <UserName>{data.user.firstName}</UserName>
          <UserName>{data.user.email}</UserName>
        </UserCard>
        <DetailsCard>
          <StatusBadge status={data.status}>{data.status}</StatusBadge>
          <Title>
            {data.user.firstName} {data.user.lastName}
          </Title>
          <Details>
            <DetailItem>
              <strong>Description:</strong> {data.proposal}
            </DetailItem>
            <DetailItem>
              <strong>End:</strong>{" "}
              {new Date(data.designer_end_date).toLocaleDateString()}
            </DetailItem>
            <DetailItem>
              <strong>Budget:</strong>{" "}
              {(+data.designer_budget).toLocaleString("en-US", {
                style: "currency",
                currency: "INR",
              })}
            </DetailItem>
          </Details>

          {data.status !== 'hired' && (
            <ButtonGroup>
              <ShortlistButton onClick={handleShortlistUser}>
                {shortlistState.loading ? "Loading..." : "Shortlist"}
              </ShortlistButton>
              <HiredButton onClick={handleHirePayments}>Hired</HiredButton>
              <RejectButton onClick={handleOpenTextArea}>Reject</RejectButton>
            </ButtonGroup>
          )}

          {data.finish_work_status === 'requested' && (
            <ButtonGroup>
              <AcceptedButton onClick={handleAcceptRequest}>Accept</AcceptedButton>
              <RejectButton onClick={handleRejectRequest}>Reject</RejectButton>
            </ButtonGroup>
          )}

          {OpenRejectTextarea && (
            <RejectForm>
              <RejectTextArea
                onChange={handleChange}
                value={formData.rejected_reason}
                placeholder="Write your rejection reason"
                id="rejected_reason"
                name="rejected_reason"
              ></RejectTextArea>
              <ButtonGroup>
                <RejectedButton onClick={handleSubmit}>Submit</RejectedButton>
                <CloseTextArea onClick={handleCloseTextArea}>
                  Close
                </CloseTextArea>
              </ButtonGroup>
            </RejectForm>
          )}
        </DetailsCard>
      </Header>
      <ImagesContainer>
        {data.images && data.images.length > 0 ? (
          data.images.map((image) => {
            const imageUrl = designerAsset(image.designer_proposal_images);
            return (
              <ImageCard key={image.id}>
                <img
                  src={imageUrl}
                  alt={`Job Sheet ${image.job_sheet_apply_id}`}
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
  background-color: ${({ status }) => {
    switch (status) {
      case 'hired':
        return '#4CAF50';
      case 'shortlist':
        return '#FFC107';
      case 'ongoing':
        return '#F44336';
      default:
        return '#ccc';
    }
  }};
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const ShortlistButton = styled.button`
  margin-top: 10px;
  padding: 8px 20px;
  background-color: transparent;
  color: #e6a23d;
  border: 2px solid #e6a23d;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e6a23d;
    color: #fff;
    border: 2px solid transparent;
  }
`;

const RejectButton = styled.button`
  margin-top: 10px;
  padding: 8px 20px;
  background-color: transparent;
  color: #ed0800;
  border: 2px solid #ed0800;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ed0800;
    color: #fff;
    border: 2px solid transparent;
  }
`;

const HiredButton = styled.button`
  margin-top: 10px;
  padding: 8px 20px;
  background-color: transparent;
  color: #33b249;
  border: 2px solid #33b249;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #33b249;
    color: #fff;
    border: 2px solid transparent;
  }
`;

const AcceptedButton = styled.button`
  margin-top: 10px;
  padding: 8px 20px;
  background-color: transparent;
  color: #316FF6;
  border: 2px solid #316FF6;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #316FF6;
    color: #fff;
    border: 2px solid transparent;
  }
`;

const RejectForm = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RejectedButton = styled.button`
  padding: 8px 20px;
  background-color: transparent;
  color: green;
  border: 2px solid green;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  width: fit-content;
  align-self: flex-start;
  transition: all 0.3s ease;

  &:hover {
    background-color: green;
    color: #fff;
    border: 2px solid transparent;
  }
`;

const CloseTextArea = styled.button`
  padding: 8px 20px;
  background-color: transparent;
  color: grey;
  border: 2px solid grey;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  width: fit-content;
  align-self: flex-start;
  transition: all 0.3s ease;

  &:hover {
    background-color: grey;
    color: #fff;
    border: 2px solid transparent;
  }
`;

const RejectTextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
`;
