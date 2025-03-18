import React from "react";
import styled from "styled-components";
import asset from "../../api/helper";

export default function ProjectBox({ img, title, text, action }) {
  return (
    <Wrapper>
      <ImgBtn className="animate pointer" onClick={action ? () => action() : null}>
        <img className="radius8" src={asset(img)} alt="project" />
      </ImgBtn>
      <h3 className="font20 extraBold">{title}</h3>
      <p className="font13">{text}</p>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  img {
    width: 100%;
    object-fit: cover;
    height: 300px;
    margin: 20px 0;
  }
  h3 {
    padding-bottom: 0px;
  }
`;

const ImgBtn = styled.button`
  background-color: transparent;
  border: 0px;
  outline: none;
  padding: 0px;
  margin: 0px;
  :hover > img {
    opacity: 0.5;
  }
`;
