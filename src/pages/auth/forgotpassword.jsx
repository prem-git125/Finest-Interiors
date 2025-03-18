import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { authForgotPassword } from "../../thunks/authForgotPassword";
import { authUpdatePassword } from "../../thunks/authUpdatePassword"
import { ClearForgotPassMessage } from "../../slice/authForgotPassword";
import { ClearUpdatePassMessage } from "../../slice/authUpdatePassword"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { forgotpassSchema } from "../../validation/forgotpassvalidation" 
import { updatepassSchema } from  "../../validation/updatepassvalidation"
import ContactImg1 from "../../assets/img/contact-1.png";
import ContactImg2 from "../../assets/img/contact-2.png"; 
import ContactImg3 from "../../assets/img/contact-3.png";

export default function ForgotPassword() {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [updateData,setUpdateData] = useState({
   otp: "",
   newPassword: "",
  })
  const [errors,setErrors] = useState({})
  const [PassError,setPassError] = useState({})

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ForgotPassMessage, ForgotPassError, ForgotPassLoading } = useSelector(
    (state) => state.authForgotPassword
  );

  const { UpdatePassMessage, UpdatePassError, UpdatePassLoading,isUpdated } = useSelector(
    (state) => state.authUpdatePassword
  )

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    try {
      forgotpassSchema.parse({email: forgotPasswordEmail})
      dispatch(authForgotPassword({ email: forgotPasswordEmail }));
    } catch (error) {
      const fieldErrors = {};
      error.errors.forEach((error) => {
        fieldErrors[error.path[0]] = error.message;
      });
      setErrors(fieldErrors);
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    try {
      updatepassSchema.parse({
        otp: updateData.otp,
        newPassword: updateData.newPassword,
      })
      dispatch(authUpdatePassword(updateData))
      if(isUpdated){
        navigate('/auth/login')
      }
    } catch (error) {
      const fieldErrors = {}
      error.errors.forEach((error) => {
        fieldErrors[error.path[0]] = error.message;
      })
      setPassError(fieldErrors)
    }
  }

  useEffect(() => {
    if (ForgotPassMessage) {
      setShowOtpForm(true);
    }
  }, [ForgotPassMessage]);

  return (
    <Wrapper id="contact">
      <div className="">
        <div className="container">
          <HeaderInfo>
            <h1 className="font40 extraBold">Forgot Password?</h1>
            <p className="font13">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut
              <br />
              labore et dolore magna aliquyam erat, sed diam voluptua.
            </p>
          </HeaderInfo>
          <div className="row" style={{ paddingBottom: "30px" }}>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              {!showOtpForm ? (
                <Form  onSubmit={handleForgotPasswordSubmit}>
                  <label className="font15">Enter Your Registered Email:</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="font20 extraBold"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  />
                 {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

                  <SubmitWrapper className="flex">
                    <ButtonInput
                      type="submit"
                      className="pointer animate radius8"
                    >{ForgotPassLoading ? "Sending..." : "Send OTP"}</ButtonInput>
                  </SubmitWrapper>
                </Form>
              ) : (
                <OtpForm onSubmit={handleUpdatePassword}>
                  <label className="font15">Enter New Password:</label>
                  <input
                    type="password"
                    id="newPassword"
                    onChange={handleUpdateChange}
                    name="newPassword"
                    value={updateData.newPassword}
                    className="font20 extraBold"
                  />
                  {PassError.newPassword && <ErrorMessage>{PassError.newPassword}</ErrorMessage>}

                  <label className="font15">Enter OTP:</label>
                  <input
                    type="number"
                    id="otp"
                    onChange={handleUpdateChange}
                    name="otp"
                    value={updateData.otp}
                    className="font20 extraBold"
                  />
                   {PassError.otp && <ErrorMessage>{PassError.otp}</ErrorMessage>}
                  <SubmitWrapper2 className="flex">
                    <ButtonInput2
                      type="submit"
                      className="pointer animate radius8"
                    >{UpdatePassLoading ? "Updating Password..." : "Change Password"}</ButtonInput2>
                  </SubmitWrapper2>
                </OtpForm>
              )}
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 flex">
              <div
                style={{ width: "50%" }}
                className="flexNullCenter flexColumn"
              >
                <ContactImgBox>
                  <img src={ContactImg1} alt="office" className="radius6" />
                </ContactImgBox>
                <ContactImgBox>
                  <img src={ContactImg2} alt="office" className="radius6" />
                </ContactImgBox>
              </div>
              <div style={{ width: "50%" }}>
                <div style={{ marginTop: "100px" }}>
                  <img src={ContactImg3} alt="office" className="radius6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
`;

const HeaderInfo = styled.div`
  padding: 70px 0 30px 0;
  @media (max-width: 860px) {
    text-align: center;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Form = styled.form`
  padding: 70px 0 30px 0;
  input,
  textarea {
    width: 100%;
    background-color: transparent;
    border: 0px;
    outline: none;
    box-shadow: none;
    border-bottom: 1px solid #707070;
    height: 30px;
    margin-bottom: 30px;
  }
  textarea {
    min-height: 100px;
  }
  @media (max-width: 860px) {
    padding: 30px 0;
  }
`;

const OtpForm = styled.form`
  padding: 70px 0 30px 0;
  animation: ${fadeIn} 0.5s ease-in-out;
  input,
  textarea {
    width: 100%;
    background-color: transparent;
    border: 0px;
    outline: none;
    box-shadow: none;
    border-bottom: 1px solid #707070;
    height: 30px;
    margin-bottom: 30px;
  }
  textarea {
    min-height: 100px;
  }
  @media (max-width: 860px) {
    padding: 30px 0;
  }
`;

const ButtonInput = styled.button`
  border: 1px solid #7620ff;
  background-color: #7620ff;
  color: #fff;
  width: 100%;
  margin: 1.5px;
  padding: 12px;
  outline: none;
  font-size: 14px; /* Add font size for clarity */
  font-weight: bold; /* Make text bold */
  text-align: center; /* Center text */
  cursor: pointer; /* Add pointer cursor on hover */
  type: submit;

  :hover {
    background-color: #580cd2;
    border-color: #580cd2; /* Match border color with hover background */
  }

  @media (max-width: 991px) {
    margin: 0 auto;
  }
`;

const ButtonInput2 = styled.button`
  border: 1px solid #7620ff;
  background-color: #7620ff;
  color: #fff;
  width: 100%;
  margin: 1.5px;
  padding: 12px;
  outline: none;
  font-size: 14px; /* Add font size for clarity */
  font-weight: bold; /* Make text bold */
  text-align: center; /* Center text */
  cursor: pointer; /* Add pointer cursor on hover */
  type:submit;
  
  :hover {
    background-color: #580cd2;
    border-color: #580cd2; /* Match border color with hover background */
  }

  @media (max-width: 991px) {
    margin: 0 auto;
  }
`;


const ContactImgBox = styled.div`
  max-width: 180px;
  align-self: flex-end;
  margin: -10px 30px 10px 0;
`;

const SubmitWrapper = styled.div`
  @media (max-width: 991px) {
    margin-bottom: 50px;
  }
`;

const SubmitWrapper2 = styled.div`
  @media (max-width: 991px) {
    margin-bottom: 50px;
  }
`;

const ErrorMessage = styled.span`
  display: block;
  color: #d9534f; /* Bootstrap's red color for errors */
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #d9534f;
  border-radius: 4px;
  background-color: #f9d6d5; /* Light red background */
  width: fit-content;
`;