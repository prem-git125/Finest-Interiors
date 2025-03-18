import React, { useState } from "react";
import styled from "styled-components";
import defaultImg from "../../assets/img/interior/default2.jpeg";
import ImgOne from "../../assets/img/interior/reg1.jpg";
import ImgTwo from "../../assets/img/interior/reg2.jpg";
import ImgThree from "../../assets/img/interior/reg3.jpg";
import { ZodError } from "zod";
import { detailSchema } from "../../validation/addetailsvalidation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { UserDetails } from "../../thunks/UserDetails";

const Details = () => {
  const id = useSelector((state) => state.authLogin.id) 
  const dispatch = useDispatch() 

  const [formData, setFormData] = useState({
    addressOne: '',
    addressTwo: '',
    city: '',
    state: '',
    phone: '',
    caption: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
        detailSchema.parse(formData);
        console.log("Form data is valid", formData);
        
        dispatch(UserDetails({
          userId: id, 
          addressOne: formData.addressOne,
          addressTwo: formData.addressTwo,
          state: formData.state,
          city: formData.city,
          phone: formData.phone,
          caption: formData.caption,
        }));
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = {};
          error.errors.forEach((err) => {
            formattedErrors[err.path[0]] = err.message;
          });
          setErrors(formattedErrors);
        }
      }
  };

  return (
    <Wrapper id="edit">
      <div className="container">
        <HeaderInfo>
          <h1 className="font40 extraBold">Add Your Details</h1>
        </HeaderInfo>
        <div className="row" style={{ paddingBottom: "20px" }}>
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <Form onSubmit={handleSubmit}>
              <InputWrapper>
                <label className="font13" style={{ fontSize: "13px" }}>
                  Address 1:
                </label>
                <input
                  type="text"
                  name="addressOne"
                  onChange={handleChange}
                  className={`font20 extrabold ${
                    errors.addressOne ? "input-error" : ""
                  }`}
                />
                {errors.Address1 && (
                  <ErrorMessage>{errors.addressOne}</ErrorMessage>
                )}

                <label className="font13" style={{ fontSize: "13px" }}>
                  Address 2:
                </label>
                <input
                  type="text"
                  name="addressTwo"
                  onChange={handleChange}
                  className={`font20 extrabold ${
                    errors.addressTwo ? "input-error" : ""
                  }`}
                />
                {errors.Address2 && (
                  <ErrorMessage>{errors.addressTwo}</ErrorMessage>
                )}

                <label className="font13" style={{ fontSize: "13px" }}>
                  State:
                </label>
                <input
                  type="text"
                  name="state"
                  onChange={handleChange}
                  className={`font20 extrabold ${
                    errors.state ? "input-error" : ""
                  }`}
                />
                {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}

                <label className="font13" style={{ fontSize: "13px" }}>
                  City:
                </label>
                <input
                  type="text"
                  name="city"
                  onChange={handleChange}
                  className={`font20 extrabold ${
                    errors.city ? "input-error" : ""
                  }`}
                />
                {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}

                <label className="font13" style={{ fontSize: "13px" }}>
                  Phone:
                </label>
                <input
                  type="text"
                  name="phone"
                  onChange={handleChange}
                  className={`font20 extrabold ${
                    errors.phone ? "input-error" : ""
                  }`}
                />
                {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}

                <label className="font13" style={{ fontSize: "13px" }}>
                  Add a caption:
                </label>
                <input
                  type="text"
                  name="caption"
                  onChange={handleChange}
                  className={`font20 extrabold ${
                    errors.caption ? "input-error" : ""
                  }`}
                />
                {errors.caption && (
                  <ErrorMessage>{errors.caption}</ErrorMessage>
                )}
              </InputWrapper>
              <SumbitWrapper className="flex">
                <ButtonInput
                  type="submit"
                  value="Add Details"
                  className="pointer animate radius8"
                  style={{ maxWidth: "200px", fontSize: "14px", margin: "5px" }}
                />
              </SumbitWrapper>
            </Form>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 flex">
            <div style={{ width: "50%" }} className="flexNullCenter flexColumn">
              <ContactImgBox>
                <img
                  src={ImgOne}
                  alt="office"
                  className="radius6"
                  style={{ objectFit: "cover" }}
                />
              </ContactImgBox>
              <ContactImgBox>
                <img
                  src={ImgTwo}
                  alt="office"
                  className="radius6"
                  style={{ objectFit: "cover" }}
                />
              </ContactImgBox>
            </div>
            <div style={{ width: "50%" }}>
              <div style={{ marginTop: "100px" }}>
                <img
                  src={ImgThree}
                  alt="office"
                  className="radius6"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Details;

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

const ContactImgBox = styled.div`
  max-width: 180px;
  align-self: flex-end;
  margin: 10px 30px 10px 0;
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

  .input-error {
    border-bottom: 1px solid red;
  }
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

const SumbitWrapper = styled.div`
  @media (max-width: 991px) {
    width: 100%;
    margin-bottom: 50px;
  }
`;

const ErrorMessage = styled.span`
  display: block;
  color: #d9534f;
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #d9534f;
  border-radius: 4px;
  background-color: #f9d6d5;
  width: fit-content;
`;
