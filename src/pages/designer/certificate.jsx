import React, { useState } from "react";
import styled from "styled-components";
import { FileUploader } from "react-drag-drop-files";
import { designerFormSchema } from "../../validation/designerformvalidation"; 
import ContactImg1 from "../../assets/img/contact-1.png";
import ContactImg2 from "../../assets/img/contact-2.png";
import ContactImg3 from "../../assets/img/contact-3.png";
import { useSelector, useDispatch } from "react-redux";
import { authDesignerForm } from "../../thunks/authDesignerForm";
import { useNavigate } from "react-router";

const fileTypes = ["JPG", "PNG", "PDF", "JPEG"];

export default function Certificate() {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const userId = useSelector((state) => state.authLogin.id);

  const handleFileChange = (file) => {
    const validationResult = designerFormSchema.safeParse({ certificateFile: file });
    
    if (validationResult.success) {
      setFile(file);
      setErrors({});
    } else {
      setErrors({ certificateFile: validationResult.error.format().certificateFile?._errors[0] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      setErrors({ certificateFile: "Please upload a certificate file." });
      return;
    }

    const formData = new FormData();
    formData.append('certificateUrl', file);
    formData.append('userId', userId);
    formData.append('approval', 'not-approved'); // default value

    try {
     dispatch(authDesignerForm(formData));
     navigate('/')
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Wrapper id="contact">
      <div className="">
        <div className="container">
          <HeaderInfo>
            <h1 className="font40 extraBold">Become a Designer..!</h1>
            <p className="font13">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut
              <br />
              labore et dolore magna aliquyam erat, sed diam voluptua.
            </p>
          </HeaderInfo>
          <div className="row" style={{ paddingBottom: "30px" }}>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <Form onSubmit={handleSubmit}>
                <label className="font10 extrabold">Upload Your Designer Certificate:</label>
                <StyledFileUploader
                  handleChange={handleFileChange}
                  name="certificateUrl"
                  types={fileTypes}
                  children={ 
                    <FileDrop>
                      {file
                        ? `Selected File: ${file.name}`
                        : "Drag & drop a file here, or click to select a file"}
                    </FileDrop>
                  }
                />
                {errors.certificateFile && <Error>{errors.certificateFile}</Error>}
                <SubmitWrapper className="flex">
                  <ButtonInput
                    type="submit"
                    className="pointer animate radius8"
                    style={{ maxWidth: "220px" }}
                  >Submit</ButtonInput>
                </SubmitWrapper>
              </Form>
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

const ButtonInput = styled.button`
  margin-top: 20px;
  border: 1px solid #7620ff;
  background: #7620ff;
  width: 100%;
  padding: 15px;
  outline: none;
  color: #fff;
  &:hover {
    background: #580cd2;
    border: 1px solid #7620ff;
    color: #fff;
  }
`;

const StyledFileUploader = styled(FileUploader)`
  padding: 40px;
  border-radius: 8px;
  cursor: pointer;
  background-color: #f0f0f0;
  margin-bottom: 30px;
  &:hover {
    background-color: #e8e8e8;
  }
`;

const FileDrop = styled.div`
  font-size: 14px;
  color: #707070;
  border: 2px dashed #7620ff;
  padding: 40px;
  border-radius: 8px;
`;

const Error = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

const ContactImgBox = styled.div`
  max-width: 180px;
  align-self: flex-end;
  margin: -10px 30px 10px 0;
`;

const SubmitWrapper = styled.div`
  @media (max-width: 991px) {
    width: 100%;
    margin-bottom: 50px;
  }
`;
