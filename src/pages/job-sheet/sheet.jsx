import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import { createJobsheet } from "../../thunks/createJobsheet";
import { useDispatch, useSelector } from "react-redux";
import ContactImg1 from "../../assets/img/contact-1.png";
import ContactImg2 from "../../assets/img/contact-2.png";
import ContactImg3 from "../../assets/img/contact-3.png";
import { useNavigate } from "react-router";
import { jobsheetSchema } from "../../validation/createjobsheetvalidation";
import { resetJobsheetState } from "../../slice/createJobsheet";
import { z } from "zod";
import Swal from "sweetalert2"; 

export default function JobsheetForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { jobsheet, error, loading, success } = useSelector(
    (state) => state.createJobsheet
  );
  
  const id = useSelector((state) => state.authLogin.id);
  
  const [formData, setFormData] = useState({
    job_sheet_title: "",
    job_sheet_description: "",
    from_to: "",
    end_at: "",
    budget: "",
  });
  
  const [files, setFiles] = useState([]);
  const [validationError, setValidationError] = useState({});

  
  const onDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }, 
  });

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError({});

    try {
      
      const validatedData = jobsheetSchema.parse({
        ...formData,
        budget: parseFloat(formData.budget),
      });

     
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSubmit.append(key, formData[key]);
      });
      formDataToSubmit.append("userId", id);
      files.forEach((file) => {
        formDataToSubmit.append("images", file);
      });

      
      dispatch(createJobsheet(formDataToSubmit));

    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.format());
      } else {
        console.error("Failed to create jobsheet:", error);
      }
    }
  };

  useEffect(() => {
    if (success) {
      Swal.fire({
        title: 'Job Sheet Added Successfully!',
        text: 'Your job sheet has been created.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        dispatch(resetJobsheetState());
        navigate('/'); 
      });
    }
  }, [success, dispatch, navigate]);

  return (
    <Wrapper>
      <div className="container">
        <HeaderInfo>
          <h1>Create a Job Sheet</h1>
          <p>
            Fill out the form below to create a detailed job sheet for your
            project.
          </p>
        </HeaderInfo>
        <FormSection>
          <Form onSubmit={handleSubmit}>
            <InputWrapper>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="job_sheet_title"
                name="job_sheet_title"
                value={formData.job_sheet_title}
                onChange={handleChange}
              />
              {validationError.job_sheet_title && (
                <ErrorText>{validationError.job_sheet_title._errors[0]}</ErrorText>
              )}
            </InputWrapper>

            <InputWrapper>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="job_sheet_description"
                value={formData.job_sheet_description}
                onChange={handleChange}
              />
              {validationError.job_sheet_description && (
                <ErrorText>{validationError.job_sheet_description._errors[0]}</ErrorText>
              )}
            </InputWrapper>

            <InputWrapper>
              <label>Upload Images</label>
              <Dropzone {...getRootProps()}>
                <input {...getInputProps()} />
                <DropzoneText>
                  Drag & drop images here, or click to select files
                </DropzoneText>
              </Dropzone>
              <ImagePreview>
                {files.map((file, index) => (
                  <Image
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`preview ${index}`}
                  />
                ))}
              </ImagePreview>
            </InputWrapper>

            <InputWrapper>
              <label htmlFor="fromDate">From Date</label>
              <input
                type="date"
                id="from_to"
                name="from_to"
                value={formData.from_to}
                onChange={handleChange}
              />
              {validationError.from_to && (
                <ErrorText>{validationError.from_to._errors[0]}</ErrorText>
              )}
            </InputWrapper>

            <InputWrapper>
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="end_at"
                name="end_at"
                value={formData.end_at}
                onChange={handleChange}
              />
              {validationError.end_at && (
                <ErrorText>{validationError.end_at._errors[0]}</ErrorText>
              )}
            </InputWrapper>

            <InputWrapper>
              <label htmlFor="budget">Budget</label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Enter your budget"
              />
              {validationError.budget && (
                <ErrorText>{validationError.budget._errors[0]}</ErrorText>
              )}
            </InputWrapper>

            <ButtonWrapper>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Job Sheet"}
              </Button>
            </ButtonWrapper>
            {error && <ErrorText>{error}</ErrorText>}
          </Form>

          <ImageSection>
            <ImageContainer>
              <img src={ContactImg1} alt="office" />
              <img src={ContactImg2} alt="office" />
            </ImageContainer>
            <img src={ContactImg3} alt="office" className="large" />
          </ImageSection>
        </FormSection>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  padding: 40px 0;
  background: #f5f5f5;
`;

const HeaderInfo = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
  }

  p {
    font-size: 1.1rem;
    color: #555;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
    }
  }
`;

const FormSection = styled.div`
  display: flex;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Form = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
  }

  input,
  textarea {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 1rem;
    color: #333;
    background: #f9f9f9;

    &:focus {
      border-color: #7620ff;
      outline: none;
      background: #fff;
    }
  }

  textarea {
    min-height: 100px;
  }
`;

const Dropzone = styled.div`
  border: 2px dashed #ddd;
  padding: 20px;
  border-radius: 8px;
  background: #f9f9f9;
  text-align: center;
  cursor: pointer;

  &:hover {
    background: #e9ecef;
  }
`;

const DropzoneText = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #555;
`;

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #7620ff;
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #580cd2;
  }
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  img {
    width: 100%;
    border-radius: 8px;
    object-fit: cover;
  }

  .large {
    margin-top: 20px;
  }

  @media (max-width: 768px) {
    img {
      width: 100%;
      height: auto;
    }
  }
`;

const ErrorText = styled.p`
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 5px;
`;

const ImageContainer = styled.div`
  display: flex;
  gap: 20px;

  img {
    width: calc(50% - 10px);
    height: auto;
  }
`;
