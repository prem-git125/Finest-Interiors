import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import defaultImg from "../../assets/img/defaultphoto.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { DesignerAssignSheets } from '../../thunks/DesignerAssignSheets';
import { useNavigate } from 'react-router-dom';
import asset from '../../api/helper';

const DesignerProjectsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector((state) => state.DesignerAssignSheets);
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("pending");
  const [isHovered, setIsHovered] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(DesignerAssignSheets(id));
    }
  }, [dispatch, id]);

  const calculateDays = (date) => {
    const now = new Date();
    const dueDate = new Date(date);
    const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  if (loading) {
    return <LoadingWrapper><LoadingSpinner /><p>Loading projects...</p></LoadingWrapper>;
  }

  if (error) {
    return <ErrorMessage>Oops! {error}</ErrorMessage>;
  }

  if (!data || data.length === 0) {
    return <EmptyStateContainer>
      <EmptyStateIcon>📋</EmptyStateIcon>
      <EmptyStateText>No projects available</EmptyStateText>
      <EmptyStateSubtext>There are no assigned projects for this designer</EmptyStateSubtext>
    </EmptyStateContainer>;
  }

  const filteredJobsheets = data.filter((item) => {
    if(item.status === 'hired') {
      if (selectedTab === "accepted") {
        return item.finish_work_status === "accepted";
      } else if (selectedTab === "requested") {
        return item.finish_work_status === "requested";
      } else if (selectedTab === "pending") {
        return item.finish_work_status === "pending" || item.finish_work_status === "requested";
      } else {
        return item.finish_work_status === "rejected";
      }
    }
    return false;
  });

  return (
    <PageContainer>
      <PageHeader>
        <HeaderTitle>Designer Project Dashboard</HeaderTitle>
        <HeaderSubtitle>Manage and track all your assigned projects</HeaderSubtitle>
      </PageHeader>
      
      <TabsContainer>
        <TabsWrapper>
          <TabItem 
            active={selectedTab === "pending"} 
            onClick={() => setSelectedTab("pending")}
          >
            Pending Projects
            <TabIndicator active={selectedTab === "pending"} />
          </TabItem>
          <TabItem 
            active={selectedTab === "requested"} 
            onClick={() => setSelectedTab("requested")}
          >
            Requested Projects
            <TabIndicator active={selectedTab === "requested"} />
          </TabItem>
          <TabItem 
            active={selectedTab === "accepted"} 
            onClick={() => setSelectedTab("accepted")}
          >
            Accepted Projects
            <TabIndicator active={selectedTab === "accepted"} />
          </TabItem>
          <TabItem 
            active={selectedTab === "rejected"} 
            onClick={() => setSelectedTab("rejected")}
          >
            Rejected Projects
            <TabIndicator active={selectedTab === "rejected"} />
          </TabItem>
        </TabsWrapper>
      </TabsContainer>
      
      {filteredJobsheets.length === 0 ? (
        <EmptyStateContainer>
          <EmptyStateIcon>📋</EmptyStateIcon>
          <EmptyStateText>
            No {selectedTab === "accepted" 
              ? "accepted" 
              : selectedTab === "pending" 
                ? "pending" 
                : selectedTab === "requested" 
                  ? "requested" 
                  : "rejected"} projects found
          </EmptyStateText>
          <EmptyStateSubtext>
            {selectedTab === "pending" 
              ? "You don't have any pending projects currently" 
              : selectedTab === "accepted"
                ? "Your completed and accepted projects will appear here"
                : selectedTab === "requested"
                  ? "Projects awaiting client review will appear here"
                  : "No projects have been rejected"}
          </EmptyStateSubtext>
        </EmptyStateContainer>
      ) : (
        <JobsheetGrid>
          {filteredJobsheets.map((item, index) => (
            <JobsheetCard 
              key={item.id} 
              onMouseEnter={() => setIsHovered(index)}
              onMouseLeave={() => setIsHovered(null)}
              isHovered={isHovered === index}
            >
              <StatusBadge status={item.finish_work_status}>
                {item.finish_work_status === "accepted" 
                  ? "Accepted" 
                  : `${calculateDays(item.designer_end_date)} days left`}
              </StatusBadge>
              
              <CardHeader>
                <ProfileImage 
                  src={item.user?.profileUrl ? asset(item.user.profileUrl) : defaultImg} 
                  alt="Profile" 
                />
                <HeaderInfo>
                  <CardTitle>{item.user?.firstName || "No Name"}</CardTitle>
                  <CardDate>Due: {item.designer_end_date 
                    ? new Date(item.designer_end_date).toLocaleDateString("en-US", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) 
                    : "No Due Date"}
                  </CardDate>
                </HeaderInfo>
              </CardHeader>
              
              <CardDescription>
                {item.proposal || "No Description"}
              </CardDescription>
              
              <CardFooter>
                <BudgetAmount>
                  {(item.designer_budget 
                    ? (+item.designer_budget).toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR"
                      }) 
                    : "No Budget")}
                </BudgetAmount>
                
                {item.finish_work_status === 'pending' && (
                  <ActionButton onClick={() => navigate(`/finish-work/form/${item.job_sheet_id}`)}>
                    Finish Work
                    <ButtonArrow>→</ButtonArrow>
                  </ActionButton>
                )}
              </CardFooter>
            </JobsheetCard>
          ))}
        </JobsheetGrid>
      )}
    </PageContainer>
  );
};

export default DesignerProjectsPage;

// Styled Components with enhanced styling to match the previous pages
const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;

const HeaderTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 10px;
`;

const HeaderSubtitle = styled.p`
  font-size: 18px;
  color: #718096;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-bottom: 15px;
  }
`;

const TabsWrapper = styled.div`
  display: flex;
  position: relative;
  
  @media (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 5px;
    &::-webkit-scrollbar {
      height: 3px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(118, 32, 255, 0.2);
      border-radius: 10px;
    }
  }
`;

const TabItem = styled.button`
  position: relative;
  background: transparent;
  border: none;
  padding: 15px 20px;
  font-size: 16px;
  white-space: nowrap;
  font-weight: ${({ active }) => (active ? "600" : "500")};
  color: ${({ active }) => (active ? "#7620ff" : "#718096")};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #7620ff;
  }
  
  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 14px;
  }
`;

const TabIndicator = styled.div`
  position: absolute;
  bottom: -11px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #7620ff;
  border-radius: 3px;
  opacity: ${({ active }) => (active ? "1" : "0")};
  transition: opacity 0.3s ease;
`;

const JobsheetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const JobsheetCard = styled.div`
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  padding: 25px;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #edf2f7;
  
  transform: ${({ isHovered }) => (isHovered ? 'translateY(-5px)' : 'none')};
  box-shadow: ${({ isHovered }) => 
    isHovered 
      ? '0 12px 24px rgba(0, 0, 0, 0.12)' 
      : '0 4px 20px rgba(0, 0, 0, 0.08)'};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
`;

const HeaderInfo = styled.div`
  margin-left: 15px;
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 5px;
  text-transform: capitalize;
`;

const CardDate = styled.p`
  font-size: 14px;
  color: #718096;
`;

const CardDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 20px;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #edf2f7;
`;

const BudgetAmount = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #38a169;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  color: #7620ff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(3px);
  }
`;

const ButtonArrow = styled.span`
  transition: transform 0.2s ease;
  display: inline-block;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${({ status }) =>
    status === "accepted" ? "#38a169" :
    status === "rejected" ? "#e53e3e" :
    status === "requested" ? "#dd6b20" : "#7620ff"};
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
`;

const EmptyStateText = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 10px;
`;

const EmptyStateSubtext = styled.p`
  font-size: 16px;
  color: #718096;
  max-width: 400px;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #718096;
  font-size: 18px;
  gap: 15px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(118, 32, 255, 0.1);
  border-radius: 50%;
  border-top: 4px solid #7620ff;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background-color: #feebc8;
  border-left: 5px solid #dd6b20;
  color: #c05621;
  padding: 20px;
  border-radius: 8px;
  margin: 30px 0;
  font-size: 16px;
  font-weight: 500;
`;