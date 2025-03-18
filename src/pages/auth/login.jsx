import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ContactImg1 from "../../assets/img/contact-1.png";
import ContactImg2 from "../../assets/img/contact-2.png";
import ContactImg3 from "../../assets/img/contact-3.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authLogin } from "../../thunks/authLogin";
import { loginSchema } from "../../validation/loginvalidation";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  }); 

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { message, isLogin, loading, error, status} = useSelector(
    (state) => state.authLogin
  );

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      loginSchema.parse(formData);
       dispatch(authLogin(formData));
    } catch (err) {
      const fieldErrors = {};
      err.errors.forEach((error) => {
        fieldErrors[error.path[0]] = error.message;
      });
      setErrors(fieldErrors);

      if (fieldErrors.password) {
        Swal.fire({
          icon: "error",
          title: "Login Error",
          text: fieldErrors.password,
        });
      }
    }
  };

  const handleNavigation = (e) => {
    e.preventDefault();
    navigate("/auth/forgotpassword");
  };

  useEffect(() => {
    if (isLogin) {
      if(status === false){
        navigate('/blocked-user')
      }else if(status === true){
        navigate('/')
      }
    }
  }, [isLogin, navigate, status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Wrapper id="contact">
      <div className="">
        <div className="container">
          <HeaderInfo>
            <h1 className="font40 extraBold">Login Here</h1>
            <p className="font13">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut
              <br />
              labore et dolore magna aliquyam erat, sed diam voluptua.
            </p>
          </HeaderInfo>
          <div className="row" style={{ paddingBottom: "30px" }}>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <Form>
                <InputWrapper>
                  <label className="font13" style={{ fontSize: "15px" }}>
                    Email:
                  </label>
                  <input
                    type="email"
                    onChange={handleChange}
                    id="email"
                    name="email"
                    className="font20 extraBold"
                    value={formData.email}
                    required
                  />

                  {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

                  <label className="font13" style={{ fontSize: "15px" }}>
                    Password:
                  </label>
                  <input
                    type="password"
                    onChange={handleChange}
                    id="password"
                    name="password"
                    className="font20 extraBold"
                    value={formData.password}
                    required
                  />

                  {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

                </InputWrapper>
              </Form>
              <SumbitWrapper className="flex">
                <ButtonInput
                  type="submit"
                  value={loading ? "Logging in..." : "Login"}
                  onClick={handleLogin}
                  className="pointer animate radius8"
                  style={{ maxWidth: "220px", fontSize: "15px" }}
                  // disabled={loading}
                />
                <ButtonInput
                  type="submit"
                  onClick={handleNavigation}
                  value={"Forgot-Password"}
                  className="pointer animate radius8"
                  style={{ maxWidth: "220px", fontSize: "15px" }}
                />
              </SumbitWrapper>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {message && <p style={{ color: "green" }}>{message}</p>}
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
const Form = styled.form`
  padding: 0 0 30px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  input,
  textarea {
    width: 100%;
    background-color: transparent;
    border: 0px;
    outline: none;
    box-shadow: none;
    border-bottom: 1px solid #707070;
    height: 30px;
    margin-bottom: 15px;
  }
  textarea {
    min-height: 100px;
  }
  @media (max-width: 860px) {
    padding: 30px 0;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  label {
    margin-bottom: 5px;
  }
`;

const ButtonInput = styled.input`
  border: 1px solid #7620ff;
  background-color: #7620ff;
  width: 100%;
  margin: 1.5px;
  padding: 12px;
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
  margin: -10px 30px 10px 0;
`;

const SumbitWrapper = styled.div`
  @media (max-width: 991px) {
    width: 100%;
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
