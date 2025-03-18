import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { io } from "socket.io-client";
import { GetChatUsers } from "../../thunks/GetChatUsers";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import asset from "../../api/helper";

const ChatLayout = () => {
  const { id } = useParams();
  const { role_id } = useSelector((state) => state.authLogin);
  const dispatch = useDispatch();

  const socket = io("http://localhost:7000");
  const { users, loading, error } = useSelector((state) => state.GetChatUsers)
  
  const [selectedUser, setSelectedUser] = useState(users[0]);

  useEffect(() => {
    dispatch(GetChatUsers({id, role_id}));
  }, [dispatch]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to IO server");
      console.log("Socket IO Id ->", socket.id);
    });

    socket.on("welcome", (message) => {
      console.log(message);
    });
  }, [socket]);
 
  return (
    <Container>
      <Sidebar>
        <SearchContainer>
          <SearchWrapper>
            <SearchInput placeholder="Search users..." />
          </SearchWrapper>
        </SearchContainer>

        <UsersList>
          {users.map((item) => (
            <UserItem
              key={item.user.id}
              onClick={() => setSelectedUser(item)}
              selected={selectedUser?.user.id === item.user.id}
            >
              <UserAvatar>
                <img src={asset(item.user.profileUrl)} alt={item.user.firstName} />
              </UserAvatar>
              <UserInfo>
                <UserName className="text-truncate">{item.job_sheet_details.job_sheet_title}</UserName>
                <LastMessage>{`${item.user.firstName} ${item.user.lastName}`}</LastMessage>
              </UserInfo>
            </UserItem>
          ))}
        </UsersList>
      </Sidebar>

      {selectedUser ? (
        <ChatArea>
          <ChatHeader>
            <UserAvatar>
              <img src={asset(selectedUser.user.profileUrl)} alt={selectedUser.user.firstName} />
            </UserAvatar>
            <UserInfo>
              <UserName className="text-truncate">{selectedUser.job_sheet_details.job_sheet_title}</UserName>
              <LastMessage>{`${selectedUser.user.firstName} ${selectedUser.user.lastName}`}</LastMessage>
            </UserInfo>
          </ChatHeader>
        </ChatArea>
      ) : (
        <p>Please select a user to start chatting.</p>
      )}
    </Container>
  )};

export default ChatLayout;

const Container = styled.div`
  display: flex;
  background-color: #f3f4f6;
  margin: 15px 15px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 20rem;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SearchContainer = styled.div`
  padding: 0.5rem;
  display: flex;
  border-bottom: 1px solid #e5e7eb;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1.3rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  position: relative;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const SearchWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const UsersList = styled.div`
  flex: 1;
`;

const UserItem = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  background-color: ${props => props.selected ? '#eff6ff' : 'transparent'};

  &:hover {
    background-color: ${props => props.selected ? '#eff6ff' : '#f9fafb'};
  }
`;

const UserAvatar = styled.div`
  position: relative;
  
  img {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const StatusIndicator = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 2px solid white;
  background-color: ${props => props.online ? '#10b981' : '#9ca3af'};
`;

const UserInfo = styled.div`
  margin-left: 0.75rem;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserName = styled.h3`
  font-weight: 500;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LastMessage = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${props => props.sent ? 'flex-end' : 'flex-start'};
`;

const Message = styled.div`
  max-width: 70%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  ${props => props.sent ? `
    background-color: #2563eb;
    color: white;
    border-bottom-right-radius: 0;
  ` : `
    background-color: #e5e7eb;
    color: #1f2937;
    border-bottom-left-radius: 0;
  `}
`;

const MessageTime = styled.span`
  font-size: 0.75rem;
  opacity: 0.7;
  display: block;
  margin-top: 0.25rem;
`;

const MessageForm = styled.form`
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #e5e7eb;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const SendButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;