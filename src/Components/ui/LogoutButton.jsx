import React from "react";
import styled from "styled-components";

export default function LogoutButton({ title, action, border }) {
  return (
    <Wrapper
      className="animate pointer radius8"
      onClick={action ? () => action() : null}
      border={border}
    >
      {title}
    </Wrapper>
  );
}

const Wrapper = styled.button`
  border: 1px solid ${(props) => (props.border ? "#7620ff" : "#ff0000")};
  background-color: ${(props) => (props.border ? "transparent" : "#ff0000")};
  width: 100%;
  padding: 15px;
  outline: none;
  color: ${(props) => (props.border ? "#7620ff" : "#fff")};
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border 0.3s;

  :hover {
    background-color: ${(props) => (props.border ? "transparent" : "#580cd2")};
    border: 1px solid ${(props) => (props.border ? "#7620ff" : "#580cd2")};
    color: ${(props) => (props.border ? "#7620ff" : "#fff")};
  }
`;
