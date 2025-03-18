import React from 'react'
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { useState } from "react";
import ContactImg1 from "../../../assets/img/contact-1.png";
import ContactImg2 from "../../../assets/img/contact-2.png";
import ContactImg3 from "../../../assets/img/contact-3.png";
import { finishWorkSchema } from '../../../validation/finishworksheetvalidation';
import { createFinishWorksheet } from '../../../thunks/createFinishWorksheet';
import { z } from 'zod';
import Swal from 'sweetalert2';

const id = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = useSelector((state) => state.authLogin.id);

  const [files, setFiles] = useState([]);
  const [alert, setAlert] = useState(false);
  const [validationError, setValidationError] = useState({});

  const [formData, setFormData] = useState(
    {
      title: "",
      description: "",
    }
  );

  const handleChange =  (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }
  const onDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setValidationError({});

    if (alert) {
      Swal.fire({
        icon: 'warning',
        title: 'You have already submitted.',
        text: 'Cannot submit again'
      })
      return
    }

    try {
      
      const validatedData = finishWorkSchema.parse(formData);

      const formDataToSubmit = new FormData();
      Object.keys(validatedData).forEach((key) => {
        formDataToSubmit.append(key, validatedData[key]);
      });

      formDataToSubmit.append('job_sheet_id', id);
      formDataToSubmit.append('user_id', userId);

      files.forEach((file) => {
        formDataToSubmit.append("images", file);
      });

      const finishWorkRes = await dispatch(
        createFinishWorksheet({
          formData: formDataToSubmit,
          job_sheet_id: id,
        })
      ).unwrap();

      if (finishWorkRes.error) {
        Swal.fire({
          icon: 'error',
          title: finishWorkRes.payload.error,
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Your Final Work Submitted!',
          text: 'Your Comments Submitted Successfully.',
        }).then(() => {
          navigate('/');
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map errors to validationError state
        const errors = error.format();
        setValidationError({
          title: errors.title?._errors?.[0],
          description: errors.description?._errors?.[0],
        });
      } else {
        console.error("Submission failed:", error);
      }
    }
  };


  return (
    <Wrapper>
      <div className="container">
        <HeaderInfo>
          <h1>Congratulations you have completed your project</h1>
          <p>
            fill out the form below to receive a quote for your project
          </p>
        </HeaderInfo>
        <FormSection>
          <Form onSubmit={handleSubmit} >
            <InputWrapper>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </InputWrapper>

            {validationError.title && <ErrorText>{validationError.title}</ErrorText>}

            <InputWrapper>
              <label htmlFor="description">Add Comments</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </InputWrapper>

            {validationError.description && <ErrorText>{validationError.description}</ErrorText>}

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

            <ButtonWrapper>
              <Button type="submit">Submit your final work</Button>
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
  )
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

export default id

