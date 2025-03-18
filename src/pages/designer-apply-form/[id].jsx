import React from "react";
import { useState } from "react";
import { designerApprovalSchema } from "../../validation/designerjobsheetvalidation";
import { createDesignerJobsheet } from "../../thunks/createDesignerJobsheet"
import styled from "styled-components";
import ContactImg1 from "../../assets/img/contact-1.png";
import ContactImg2 from "../../assets/img/contact-2.png";
import ContactImg3 from "../../assets/img/contact-3.png";
import { useDropzone } from "react-dropzone";
import {  useNavigate, useParams } from "react-router";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const Id = () => {
  const [files, setFiles] = useState([]);

  const [alert,setAlert] = useState(false)

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { id } = useParams()

  const designerId = useSelector(state => state.authLogin.id)

  const [validationError,setValidationError] = useState({})

  const [formData,setFormData] = useState({
    proposal: '',
    designer_budget: '',
    designer_end_date: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData,[name]: value});
  }

  const onDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setValidationError({});

    if(alert) {
      Swal.fire({
        icon: 'warning',
        title: 'You have already submitted.',
        text: 'Cannot submit again'
      })
      return
    }

    try {
      const validatedData = designerApprovalSchema.parse({
        ...formData,
        designer_budget: parseFloat(formData.designer_budget),
      });

      console.log("Validation Success:", validatedData);

      const formDataToSubmit = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataToSubmit.append(key, formData[key]);
      });

      formDataToSubmit.append("job_sheet_id", id); 
      formDataToSubmit.append("designer_id", designerId);

      files.forEach((file) => {
        formDataToSubmit.append("images", file);
      });

      const jobSheetRes = await dispatch(createDesignerJobsheet({formData :formDataToSubmit, job_sheet_id :id}));
     
      console.log('Job ---> ', jobSheetRes);
      if (jobSheetRes.error) {
        Swal.fire({
          icon: 'error',
          title: jobSheetRes.payload.error,
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Job sheet submitted!',
          text: 'Jobsheet submitted successfully!',
        }).then(() => {
          navigate('/')
        })
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("Validation failed:", error.errors);
        const errors = error.format();
        setValidationError({
          proposal: errors.proposal?._errors?.[0],
          designer_end_date: errors.designer_end_date?._errors?.[0],
          designer_budget: errors.designer_budget?._errors?.[0],
        });
      } else {
        console.error("Failed to create jobsheet:", error);
      }
    }
  };

  return (
    <Wrapper>
      <div className="container">
        <HeaderInfo>
          <h1>Apply Jobsheet</h1>
          <p>
            Fill out the form below to create a detailed job sheet for your
            project.
          </p>
        </HeaderInfo>
        <FormSection>
          <Form onSubmit={handleSubmit}>
            <InputWrapper>
              <label htmlFor="description">Proposal</label>
              <textarea 
                id="description"
                name="proposal"
                value={formData.proposal}
                onChange={handleChange}
              />
              {validationError.proposal && (
                <ErrorText>{validationError.proposal}</ErrorText>
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
              <label htmlFor="endDate">End Date</label>
              <input 
              type="date"
              id="designer_end_date"
              name="designer_end_date"
              value={formData.designer_end_date}
              onChange={handleChange}
              />
              {validationError.designer_end_date && (
                <ErrorText>{validationError.designer_end_date}</ErrorText>
              )}
            </InputWrapper>

            <InputWrapper>
              <label htmlFor=""> Counter-Budget</label>
              <input
                type="number"
                id="designer_budget"
                name="designer_budget"
                value={formData.designer_budget}
                onChange={handleChange}
              />
              {validationError.designer_budget && (
                <ErrorText>{validationError.designer_budget}</ErrorText>
              )}
            </InputWrapper>

            <ButtonWrapper>
              <Button type="submit">Submit Job Sheet</Button>
            </ButtonWrapper>
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
};

export default Id;

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
