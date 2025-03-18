import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import defaultImg from "../../assets/img/defaultphoto.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { DesignerAssignSheets } from '../../thunks/DesignerAssignSheets';
import { useNavigate } from 'react-router-dom';
import asset from '../../api/helper';

const id = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector((state) => state.DesignerAssignSheets);
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("pending");

  useEffect(() => {
    if (id) {
      dispatch(DesignerAssignSheets(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>{error}</span>;
  }

  if (!data || data.length === 0) {
    return <span>No data available.</span>;
  }

  const calculateDays = (date) => {
    const now = new Date();
    const dueDate = new Date(date);
    const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const filteredJobsheets = data.filter((item) => {
    if(item.status === 'hired') {
      if (selectedTab === "accepted") {
        return item.finish_work_status === "accepted"
      } else if (selectedTab === "requested") {
        return item.finish_work_status === "requested"
      } else if (selectedTab === "pending") {
        return item.finish_work_status === "pending" || item.finish_work_status === "requested"
      } else {
        return item.finish_work_status === "rejected"
      }
    }
    return false;
  });

  return (
    <>
      <div style={{ marginTop: '15px' }}>
        <Tabs>
          <TabHeading
            active={selectedTab === "pending"}
            onClick={() => setSelectedTab("pending")}
          >
            Pending Projects
          </TabHeading>
          <TabHeading
            active={selectedTab === "requested"}
            onClick={() => setSelectedTab("requested")}
          >
            Requested Projects
          </TabHeading>
          <TabHeading
            active={selectedTab === "accepted"}
            onClick={() => setSelectedTab("accepted")}
          >
            Accepted Projects
          </TabHeading>
          <TabHeading
            active={selectedTab === "rejected"}
            onClick={() => setSelectedTab("rejected")}
          >
            Rejected Projects
          </TabHeading>
        </Tabs>
      </div>

      {filteredJobsheets.length === 0 && (
          <NoJobsheets>
            No {selectedTab === "accepted" 
              ? "Accepted" 
              : selectedTab === "pending" 
                ? "Pending" 
                : selectedTab === "requested" 
                  ? "Requested" 
                  : "Rejected"} Projects Found
          </NoJobsheets>
        )}

      <JobsheetContainer>
        {filteredJobsheets.map((item) => (
          <JobsheetItemWrapper key={item.id}>
            <JobsheetItem>
              <ProfileContainer>
                <ProfileImage
                  src={item.user?.profileUrl ? asset(item.user.profileUrl) : defaultImg}
                  alt="Profile"
                />
              </ProfileContainer>
              <JobsheetInfo>
                <JobsheetTitle>{item.user?.firstName || "No Name"}</JobsheetTitle>
                <JobsheetDescription>
                  {item.proposal || "No Description"}
                </JobsheetDescription>

                <JobsheetDates>
                  <span>Due: {item.designer_end_date ? new Date(item.designer_end_date).toDateString() : "No Due Date"}</span>
                </JobsheetDates>

                <JobsheetBudget>
                  {(item.designer_budget ? (+item.designer_budget).toLocaleString("en-US", {
                    style: "currency",
                    currency: "INR"
                  }) : "No Budget")}
                </JobsheetBudget>

                <JobsheetStatus status={item.finish_work_status}>
                  {item.finish_work_status === "accepted" ? (
                    <span>{item.finish_work_status}</span>
                  ) : (
                    <span>{calculateDays(item.designer_end_date)} days left</span>
                  )}
                </JobsheetStatus>
              </JobsheetInfo>
            </JobsheetItem>
            {item.finish_work_status === 'pending'  && (
              <JobsheetActionButtons>
                <ApprovalButton onClick={() => navigate(`/finish-work/form/${item.job_sheet_id}`)} >
                  Finish Work
                </ApprovalButton>
              </JobsheetActionButtons>
            )}
          </JobsheetItemWrapper>
        ))}
      </JobsheetContainer>
    </>
  )
}

export default id

const JobsheetContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
  max-width: 1500px;
  margin: 0 auto;

  @media (max-width: 992px) {
    /* md devices */
    grid-template-columns: repeat(2, 1fr);
    padding: 15px;
  }

  @media (max-width: 768px) {
    /* sm devices */
    grid-template-columns: 1fr;
    padding: 10px;
  }
`;

const Heading = styled.h1`
  font-size: 32px;
  margin-bottom: 20px;
  text-align: center;
  margin-top: 10px;
  color: #2c3e50;
  font-weight: 700;
`;

const JobsheetItemWrapper = styled.div`
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  background: #fff;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
  }
`;

const JobsheetItem = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
`;

const ProfileContainer = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 20px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const JobsheetInfo = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
`;

const JobsheetTitle = styled.h2`
  font-size: 20px;
  color: #7620ff;
  margin-bottom: 10px;
  text-transform: capitalize;
`;

const JobsheetDescription = styled.p`
  font-size: 16px;
  color: #7f8c8d;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limits to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 3.2em; /* Adjust based on line height */
`;

const JobsheetDates = styled.div`
  font-size: 14px;
  color: #95a5a6;
  display: flex;
  justify-content: space-between;
`;

const JobsheetBudget = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #27ae60;
  margin-top: 10px;
`;

const JobsheetStatus = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  text-align: center;
  border-radius: 12px;
  color: #fff;
  background-color: ${(props) => (props.status === "accepted" ? "#27ae60" : "#7620ff")};
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  white-space: nowrap;
`;

const JobsheetActionButtons = styled.button`
  display: inline-block;
  background: unset;
  border: unset;
  padding: 0 20px;
  padding-bottom: 20px;
  width: 100%;
`;

const ApprovalButton = styled.button`
  width: 100%;
  margin-top: 15px;
  padding:  5px 10px;
  background-color: transparent;
  color: #7620ff; 
  border: 2px solid #7620ff; 
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #7620ff; 
    color: #fff; 
    border: 2px solid transparent; 
  }
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
`;

const TabHeading = styled.h2`
  cursor: pointer;
  font-size: 22px;
  font-weight: bold;
  color: ${({ active }) => (active ? "#7620ff" : "#7f8c8d")};
  border-bottom: ${({ active }) => (active ? "2px solid #7620ff" : "none")};
  padding: 10px 20px;
  margin: 0 15px;
  transition: color 0.3s ease, border-bottom 0.3s ease;

  &:hover {
    color: #7620ff;
  }
`;

const NoJobsheets = styled.h3`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  text-align: center;
  color: #95a5a6;
  font-size: 20px;
  font-weight: bold;
`;


