import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { FetchingJobsheets } from "../../thunks/FetchJobsheet";
import asset from "../../api/helper";

const Id = () => {
  const { userId } = useParams();
  const userImg = useSelector((state) => state.authLogin.profileUrl);
  const { user, loading, error } = useSelector((state) => state.FetchJobsheet);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("pending");

  useEffect(() => {
    dispatch(FetchingJobsheets(userId));
  }, [dispatch, userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter jobsheets based on the selected tab
  const filteredJobsheets = user.filter((item) =>
    selectedTab === "approved" ? item.status === "approved" || item.status === "completed" : item.status === "pending"
  );

  return (
    <>
      <Tabs>
        <TabHeading active={selectedTab === "pending"} onClick={() => setSelectedTab("pending")}>
          Pending Projects
        </TabHeading>
        <TabHeading active={selectedTab === "approved"} onClick={() => setSelectedTab("approved")}>
          Approved Projects
        </TabHeading>
      </Tabs>
      {filteredJobsheets.length === 0 && <NoJobsheets>No {selectedTab === "approved" ? "Approved" : "Pending"} Jobsheets Found</NoJobsheets>}
      <JobsheetContainer>
        {
          filteredJobsheets.map((item, index) => (
            <JobsheetItem key={index}>
              <ProfileContainer>
                <ProfileImage src={asset(userImg)} alt="Profile" />
              </ProfileContainer>
              <JobsheetInfo>
                <JobsheetTitle>{item.job_sheet_title}</JobsheetTitle>
                <JobsheetDescription>{item.job_sheet_description}</JobsheetDescription>
                <JobsheetDates>
                  <span>End: {new Date(item.end_at).toDateString()}</span>
                </JobsheetDates>
                <JobsheetBudget>{`Budget: ${(+item.budget).toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}`}</JobsheetBudget>
                <JobsheetStatus status={item.status}>{item.status}</JobsheetStatus>
                <MoreDetailsButton onClick={() => navigate(`/job-sheet/job-sheet-single/${item.id}`)}>
                  More Details
                </MoreDetailsButton>
              </JobsheetInfo>
            </JobsheetItem>
          ))
        }
      </JobsheetContainer>
    </>
  );
};

export default Id;

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
  margin-top: 20px;
  transition: color 0.3s ease, border-bottom 0.3s ease;

  &:hover {
    color: #7620ff;
  }
`;

const JobsheetContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
  max-width: 1500px;
  margin: 0 auto;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 15px;
  }

  @media (max-width: 768px) {
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


const JobsheetItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding-top: 1.5rem;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: transform 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
  }
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
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const JobsheetDates = styled.div`
  font-size: 14px;
  color: #95a5a6;
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
  status === "completed" ? "#0066b2" :  status === "approved" ? "#2ecc71" : status === "rejected" ? "#f39c12" : "#e74c3c"};
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  white-space: nowrap;
`;

const MoreDetailsButton = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
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
