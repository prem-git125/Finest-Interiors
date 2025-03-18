import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import ImgOne from "../../assets/img/interior/reg1.jpg";
import ImgTwo from "../../assets/img/interior/reg2.jpg";
import ImgThree from "../../assets/img/interior/reg3.jpg";
import defaultImg from "../../assets/img/interior/default2.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { authRegister } from "../../thunks/authRegister";
import { authOtp, authResendOtp } from "../../thunks/authOtp";
import { clearMessages } from "../../slice/authOtp";
import { clearMessage } from "../../slice/authRegister";
import { useNavigate } from "react-router-dom";
import { registerSchema } from "../../validation/validation";
import { otpSchema } from "../../validation/otpvalidation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

export default function Register() {
  const [avatarPreview, setAvatarPreview] = useState(defaultImg);
  const [showOtpField, setShowOtpField] = useState(false);
  const [email, setEmail] = useState(""); // State to store email

  const {
    register: registerUser,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const {
    register: otpRegister,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: email, // Set default value for email
    },
  });

  const [file, setFile] = useState(null)

  const dispatch = useDispatch();
  const navigate = useNavigate();

// Image Storing method :

  const fileInput = useRef(null);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFile(file); 
    }
  };
  

  const handleAvatarClick = () => {
    console.log("File Input ref : ",fileInput.current)
    if (fileInput.current) {
      fileInput.current.click();
    } else {
      console.error("File input reference is null");
    }
  };

  const { message, isRegister, loading, error } = useSelector(
    (state) => state.authRegister
  );

  const { Otploading, successMsg, Otperror, isOtp } = useSelector(
    (state) => state.authOtp
  );

  const onSubmit = (data) => {
    const formDataObj = new FormData();
    console.log('data -->', data)
    for (const key in data) {
      if (key !== "otp") {
        formDataObj.append(key, data[key]);
      }
    }

    if (file && file instanceof File) {
      formDataObj.append('profileUrl', file)
    }
  
    dispatch(authRegister(formDataObj)).then(() => {
      setEmail(data.email); // Save email to state
    });
  };

  const handleOtp = (data) => {
    const { otp } = data;
    dispatch(authOtp({ email, otp }));
    if (isOtp) {
      navigate("/auth/login");
    } else {
      navigate("/auth/register");
    }
  };

  const handleResendOtp = (e) => {
    e.preventDefault();
    dispatch(authResendOtp(email)); // Use email from state
  };

  const handleClearMessage = (e) => {
    dispatch(clearMessages());
  };

  useEffect(() => {
    if (isRegister) {
      setShowOtpField(true);
    }
  }, [isRegister]);

  useEffect(() => {
    registerUser('profileUrl')
  },[registerUser])

  useEffect(() => {
    return () => {
      dispatch(clearMessage());
    };
  }, [dispatch]);

  return (
    <Wrapper id="contact">
      <div className="">
        <div className="container">
          <HeaderInfo>
            <h1 className="font40 extraBold">Register Here</h1>
            <p className="font13">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut
              <br />
              labore et dolore magna aliquyam erat, sed diam voluptua.
            </p>
          </HeaderInfo>
          <div className="row" style={{ paddingBottom: "20px" }}>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              {!showOtpField && (
                <Form onSubmit={handleRegisterSubmit(onSubmit)}>

                  <AvatarWrapper onClick={handleAvatarClick} >
                    <Avatar  src={avatarPreview} alt="Avatar" className="avatar" />
                  </AvatarWrapper>

                  <input
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInput}
                    name="profileUrl"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
              
                  <InputWrapper>
                    <label className="font13" style={{ fontSize: "13px" }}>
                      First-Name:
                    </label>
                    <input
                      type="text"
                      {...registerUser("firstName")}
                      className={`font20 extrabold ${
                        registerErrors.firstName ? "input-error" : ""
                      }`}
                    />

                    {registerErrors.firstName && (
                      <ErrorMessage>
                        {registerErrors.firstName.message}
                      </ErrorMessage>
                    )}

                    <label className="font13" style={{ fontSize: "13px" }}>
                      Last-Name:
                    </label>
                    <input
                      type="text"
                      {...registerUser("lastName")}
                      className={`font20 extrabold ${
                        registerErrors.lastName ? "input-error" : ""
                      }`}
                    />

                    {registerErrors.lastName && (
                      <ErrorMessage>
                        {registerErrors.lastName.message}
                      </ErrorMessage>
                    )}

                    <label className="font13" style={{ fontSize: "13px" }}>
                      Email:
                    </label>
                    <input
                      type="text"
                      {...registerUser("email")}
                      className={`font20 extrabold ${
                        registerErrors.email ? "input-error" : ""
                      }`}
                    />

                    {registerErrors.email && (
                      <ErrorMessage>
                        {registerErrors.email.message}
                      </ErrorMessage>
                    )}

                    <label className="font13" style={{ fontSize: "13px" }}>
                      Password:
                    </label>
                    <input
                      type="password"
                      {...registerUser("password")}
                      className={`font20 extrabold ${
                        registerErrors.password ? "input-error" : ""
                      }`}
                    />

                    {registerErrors.password && (
                      <ErrorMessage>
                        {registerErrors.password.message}
                      </ErrorMessage>
                    )}
                  </InputWrapper>
                  <SumbitWrapper className="flex">
                    <ButtonInput
                      type="submit"
                      value={loading ? "Registering..." : "Register"}
                      disabled={loading || isRegister}
                      className="pointer animate radius8"
                      style={{
                        maxWidth: "130px",
                        fontSize: "14px",
                        margin: "5px",
                      }}
                    />
                  </SumbitWrapper>
                </Form>
              )}
              {showOtpField && (
                <OtpForm onSubmit={handleOtpSubmit(handleOtp)}>
                  <InputWrapper>
                    <label className="font13" style={{ fontSize: "13px" }}>
                      Email:
                    </label>
                    <input
                      type="text"
                      {...otpRegister("email")}
                      className={`font20 extraBold ${
                        otpErrors.email ? "input-error" : ""
                      }`}
                      // disabled={true} // Disable input to prevent changes
                    />
                    {otpErrors.email && (
                      <ErrorMessage>{otpErrors.email.message}</ErrorMessage>
                    )}
                    <label className="font13" style={{ fontSize: "13px" }}>
                      OTP:
                    </label>
                    <input
                      type="text"
                      {...otpRegister("otp")}
                      className={`font20 extraBold ${
                        otpErrors.otp ? "input-error" : ""
                      }`}
                    />
                    {otpErrors.otp && (
                      <ErrorMessage>{otpErrors.otp.message}</ErrorMessage>
                    )}
                  </InputWrapper>
                  <SumbitWrapper className="flex">
                    <ButtonInput
                      type="submit"
                      value="Verify"
                      className="pointer animate radius8"
                      style={{ maxWidth: "130px", fontSize: "14px" }}
                    />
                    <ButtonInput
                      type="button"
                      onClick={handleResendOtp}
                      value="Resend OTP"
                      className="pointer animate radius8"
                      style={{ maxWidth: "130px", fontSize: "14px" }}
                    />
                  </SumbitWrapper>

                  {/* {successMsg && (
                    <Message>
                      <p>{successMsg}</p>
                      <button onClick={handleClearMessage}>
                        Clear Message  
                      </button>
                    </Message>
                  )}
                  {Otperror && (
                    <Message>
                      <p>{Otperror}</p>
                      <button onClick={handleClearMessage}>
                        Clear Message
                      </button>
                    </Message>
                  )} */}
                </OtpForm>
              )}
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 flex">
              <div
                style={{ width: "50%" }}
                className="flexNullCenter flexColumn"
              >
                <ContactImgBox>
                  <img src={ImgOne} alt="office" className="radius6" style={{objectFit:"cover"}} />
                </ContactImgBox>
                <ContactImgBox>
                  <img src={ImgTwo} alt="office" className="radius6"  style={{objectFit:"cover"}} />
                </ContactImgBox>
              </div>
              <div style={{ width: "50%" }}>
                <div style={{ marginTop: "100px" }}>
                  <img src={ImgThree} alt="office" className="radius6"  style={{objectFit:"cover"}} />
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
  padding: 50px 0 10px 0;
  @media (max-width: 860px) {
    text-align: center;
  }
`;

const Form = styled.form`
  padding: 20px 0;
`;

const OtpForm = styled.form`
  padding: 20px 0;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    margin-bottom: 5px;
  }

  input {
    background-color: transparent;
    border: 0px;
    outline: none;
    box-shadow: none;
    border-bottom: 1px solid #707070;
    height: 30px;
  }
`;

const AvatarWrapper = styled.div`
  display: flex;
  justify-content: start;
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #707070;
  cursor: pointer;
`;

const ButtonInput = styled.input`
  border: 1px solid #7620ff;
  background-color: #7620ff;
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  margin-left: 5px;
  outline: none;
  color: #fff;
  :hover {
    background-color: #580cd2;
    border: 1px solid #7620ff;
    color: #fff;
  }
  @media (max-width: 991px) {
    margin: 0 auto;
  }
`;

const ContactImgBox = styled.div`
  max-width: 180px;
  align-self: flex-end;
  margin: 10px 30px 10px 0;
`;

const SumbitWrapper = styled.div`
  @media (max-width: 991px) {
    width: 100%;
    margin-bottom: 50px;
  }
`;

const Message = styled.div`
  margin-top: 10px;
  p {
    margin: 0;
  }
  button {
    margin-top: 5px;
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
