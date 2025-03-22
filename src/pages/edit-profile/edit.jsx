import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import defaultImg from "../../assets/img/interior/default2.jpeg";
import { useDispatch, useSelector } from "react-redux";
import asset from "../../api/helper";
import { useNavigate } from "react-router";
import { setProfile, setName } from "../../slice/authLogin"; // Import actions to update authLogin slice

// Edit User Profile Imports
import { EditProfile } from "../../thunks/EditProfile";
import { FetchUserData } from "../../thunks/FetchUserdata";
import { clearUpdateSuccess } from "../../slice/userUpdateProfile";

// Edit Add View User Details Imports
import { FetchingUserDetails, UpdatingUserDetails } from "../../thunks/UpdateUserDetails";
import { resetUpdateUserDetails } from "../../slice/UpdateUserDetails";
import { UserDetails } from "../../thunks/UserDetails";


export default function Edit() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const[formDetail,setFormDetails] = useState({
    addressOne: "",
    addressTwo: "",
    phone: "",
    city: "",
    state: "",
    caption: "",
  })

  const [avatarPreview, setAvatarPreview] = useState(defaultImg);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const { user, loading, error, updateSuccess } = useSelector(
    (state) => state.userUpdateProfile
  );

  const { details, updateDetailsSuccess } = useSelector(
    (state) => state.UpdateUserDetails
  )

  const id = useSelector((state) => state.authLogin.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(FetchingUserDetails({ id }))
        .then((action) => {
          const { payload } = action;
          if (payload) {
            setFormDetails({
              addressOne: payload?.addressOne || "",
              addressTwo: payload?.addressTwo || "",
              state: payload?.state || "",
              city: payload?.city || "",
              phone: payload?.phone || "",
              caption: payload?.caption || "",
            });
          } else {
            console.error("Payload is undefined or null");
          }
        })
        .catch((error) => {
          console.error("FetchingUserDetails failed:", error);
        });
    } else {
      console.log("Error in Fetching Id, Id Undefined.");
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(FetchUserData(id))
        .then((action) => {
          const { payload } = action;
          setFormData({
            firstName: payload.user.firstName || "",
            lastName: payload.user.lastName || "",
            email: payload.user.email || "",
          });
          const userImage = asset(payload.user.profileUrl || defaultImg);
          setAvatarPreview(userImage);
        })
        .catch((error) => {
          console.error("FetchUserData failed:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      dispatch(clearUpdateSuccess());
      dispatch(setName(formData.firstName));
      dispatch(setProfile(avatarPreview));
      alert("Profile Updated Successfully!");
      navigate("/");
    }
  }, [updateSuccess, dispatch, formData.firstName, avatarPreview, navigate]);


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
    if (fileInput.current) {
      fileInput.current.click();
    } else {
      console.error("File input reference is null");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDetailsChange = (event) => {
    const { name, value } = event.target;
    setFormDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const onSubmit = (event) => {
    event.preventDefault();
    const formDataObj = new FormData();
    for (const key in formData) {
      formDataObj.append(key, formData[key]);
    }

    if (file) {
      formDataObj.append("profileUrl", file);
    }

    dispatch(EditProfile({ id, formDataObj }));

    console.log("Edit form data:", formDataObj);
    console.log(avatarPreview);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    for (const key in formDetail) {
      formDataObj.append(key, formDetail[key]);
    }
    if(details) {
      dispatch(UpdatingUserDetails({id, formDetail}))
    }else{
      dispatch(UserDetails({
        userId: id,
        addressOne: formDetail.addressOne,
        addressTwo: formDetail.addressTwo,
        city: formDetail.city,
        state: formDetail.state,
        phone: formDetail.phone,
        caption: formDetail.caption,
      }));
    }
  }

  return (
    <Wrapper id="edit">
      <div className="container">
        <HeaderInfo>
          <h1 className="font40 extraBold" style={{textAlign:'center'}}>Edit Your Personal Details</h1>
        </HeaderInfo>
        <div className="row" style={{ paddingBottom: "20px" }}>
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <Form onSubmit={onSubmit}>
              <AvatarWrapper onClick={handleAvatarClick}>
                <Avatar src={avatarPreview} alt="Avatar" className="avatar" />
              </AvatarWrapper>

              <input
                type="file"
                style={{ display: "none" }}
                ref={fileInput}
                name="profileUrl"
                value={formData.profileUrl}
                accept="image/*"
                onChange={handleAvatarChange}
              />

              <InputWrapper>
                <label className="font13" style={{ fontSize: "13px" }}>
                  First-Name:
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`font20 extrabold ${
                    !formData.firstName ? "input-error" : ""
                  }`}
                />

                <label className="font13" style={{ fontSize: "13px" }}>
                  Last-Name:
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`font20 extrabold ${
                    !formData.lastName ? "input-error" : ""
                  }`}
                />

                <label className="font13" style={{ fontSize: "13px" }}>
                  Email:
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`font20 extrabold ${
                    !formData.email ? "input-error" : ""
                  }`}
                />
              </InputWrapper>
              <SumbitWrapper className="flex">
                <ButtonInput
                  type="submit"
                  value="Save Changes"
                  className="pointer animate radius8"
                  style={{
                    maxWidth: "200px",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                />
              </SumbitWrapper>
            </Form>
          </div>

          {/* -------------------------- Other Form for user details ------------------------------- */}

          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <Form onSubmit={handleSubmit} style={{marginTop: '10px'}}>
              <InputWrapper>
                <label className="font13" style={{ fontSize: "13px" }}>
                  Address 1:
                </label>
                <input
                  type="text"
                  name="addressOne"
                  value={formDetail.addressOne}
                  onChange={handleDetailsChange}
                  className={`font20 extrabold ${"" ? "input-error" : ""}`}
                />

                <label className="font13" style={{ fontSize: "13px" }}>
                  Address 2 (Optional) :
                </label>
                <input
                  type="text"
                  name="addressTwo"
                  value={formDetail.addressTwo}
                  onChange={handleDetailsChange}
                  className={`font20 extrabold ${"" ? "input-error" : ""}`}
                />

                <label className="font13" style={{ fontSize: "13px" }}>
                  State:
                </label>
                <input
                  type="text"
                  name="state"
                  value={formDetail.state}
                  onChange={handleDetailsChange}
                  className={`font20 extrabold ${"" ? "input-error" : ""}`}
                />

                <label className="font13" style={{ fontSize: "13px" }}>
                  City:
                </label>
                <input
                  type="text"
                  name="city"
                  value={formDetail.city}
                  onChange={handleDetailsChange}
                  className={`font20 extrabold ${"" ? "input-error" : ""}`}
                />

                <label className="font13" style={{ fontSize: "13px" }}>
                  Phone:
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formDetail.phone}
                  onChange={handleDetailsChange}
                  className={`font20 extrabold ${"" ? "input-error" : ""}`}
                />

                <label className="font13" style={{ fontSize: "13px" }}>
                  Caption:
                </label>
                <input
                  type="text"
                  name="caption"
                  value={formDetail.caption}
                  onChange={handleDetailsChange}
                  className={`font20 extrabold ${"" ? "input-error" : ""}`}
                />
              </InputWrapper>
              <SumbitWrapper className="flex">
                <ButtonInput
                  type="submit"
                  value="Save Changes"
                  className="pointer animate radius8"
                  style={{
                    maxWidth: "200px",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                />
              </SumbitWrapper>
            </Form>
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
