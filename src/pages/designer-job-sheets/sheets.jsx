import React, {useState, useEffect } from "react";
import styled from "styled-components";
import defaultImg from "../../assets/img/defaultphoto.jpg";
import { useDispatch, useSelector } from "react-redux";
import { FetchingUsersJobsheets } from "../../thunks/FetchingUsersJobsheets";
import assetProfile from "../../api/helper";
import { useNavigate } from "react-router";

const Sheets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { jobsheetData, error, loading } = useSelector(
    (state) => state.FetchingUsersJobsheets
  );

  useEffect(() => {
    dispatch(FetchingUsersJobsheets());
  }, [dispatch]);

  const [selectedTab, setSelectedTab] = useState("pending");

  if (loading) return <p>Loading...</p>;
  
  if (error) {
    return <p>Error: {typeof error === 'string' ? error : JSON.stringify(error)}</p>;
  }

  if (!jobsheetData || !Array.isArray(jobsheetData)) {
    return <p>No job sheets found for this user.</p>;
  }

  const filteredJobsheets = jobsheetData.filter((item) =>
    selectedTab === "approved" ? item.status === "approved" || item.status === "completed"  : item.status === "pending"
  );


  return (
    <>
    <Tabs>
      <TabHeading
        active={selectedTab === "pending"}
        onClick={() => setSelectedTab("pending")}
      >
        Pending Projects
      </TabHeading>
      <TabHeading
        active={selectedTab === "approved"}
        onClick={() => setSelectedTab("approved")}
      >
        Approved Projects
      </TabHeading>
    </Tabs>

    {filteredJobsheets.length === 0 && <NoJobsheets>No {selectedTab === "approved" ? "Approved" : "Pending"} Jobsheets Found</NoJobsheets>}

    <JobsheetContainer>
      {filteredJobsheets.map((item, index) => (
        <JobsheetItemWrapper key={index}>
          <JobsheetItem>
            <ProfileContainer>
              <ProfileImage
                src={assetProfile(item.user?.profileUrl || defaultImg)}
                alt="Profile"
              />
            </ProfileContainer>
            <JobsheetInfo>
              <JobsheetTitle>{item.user?.firstName}{" "}{item.user?.lastName}</JobsheetTitle>
              <JobsheetDescription>
                {item.job_sheet_title}
              </JobsheetDescription>
              <JobsheetDates>
                <span>Due: {new Date(item.end_at).toDateString()}</span>
              </JobsheetDates>
              <JobsheetBudget>{(+item.budget).toLocaleString("en-US", {
                style: "currency",
                currency: "INR"
              })}</JobsheetBudget>
              <JobsheetStatus status={item.status}>
                {item.status}
              </JobsheetStatus>
            </JobsheetInfo>
          </JobsheetItem>
          <JobsheetActionButtons>
            <ApprovalButton onClick={() => navigate(`/designer-job-sheets/${item.id}`)}>
              More Details
            </ApprovalButton>
          </JobsheetActionButtons>
        </JobsheetItemWrapper>
      ))}
    </JobsheetContainer>
  </>
  );
};

export default Sheets;


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
  background-color: ${({ status }) =>
    status === "approved" || status === "completed" 
      ? "#2ecc71"
      : status === "rejected"
      ? "#f39c12"
      : "#e74c3c"};
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

