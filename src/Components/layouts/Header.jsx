import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-scroll";
import { Link as RouterLink, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Backdrop from "../ui/Backdrop";
import LogoIcon from "../../assets/svg/Logo";
import BurgerIcon from "../../assets/svg/BurgerIcon";
import NotificationBellIcon from "../../assets/svg/Services/NotificationBellIcon";
import MessageBoxIcon from "../../assets/svg/Services/MessageBoxIcon";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import asset from "../../api/helper";
import { FiXCircle } from "react-icons/fi";
import { FetchingDesignerNotifications } from "../../thunks/FetchingDesignerNotifications";
import { DeleteNotification } from "../../thunks/DeleteNotification";

export default function Header() {
  const [y, setY] = useState(window.scrollY);
  const [sidebarOpen, toggleSidebar] = useState(false);
  const isAuth = useSelector((state) => state.authLogin.isLogin);
  const userImg = useSelector((state) => state.authLogin.profileUrl);
  const userName = useSelector((state) => state.authLogin.firstName);
  const userId = useSelector((state) => state.authLogin.id);
  const roleId = useSelector((state) => state.authLogin.role_id);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationData = useSelector(
    (state) => state.FetchingDesignerNotifications.notifications || []
  );
  

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProfileNavigation = () => {
    navigate("/profile/profile");
  };

  const handleHomeNavigation = () => {
    navigate("/");
  };

  const handleJobsheetNavigation = () => {
    navigate("/job-sheet/sheet");
  };

  const handleSheetsNavigation = () => {
    navigate(`/job-sheet/${userId}`);
  };

  const handleDesignerJobsheets = () => {
    navigate(`/designer-job-sheets/sheets`);
  };

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  const handleNotificationDelete = (notification_id) => {
    dispatch(DeleteNotification(notification_id));
  };

  const handleContactNavigation = () => {
    navigate("/contact-us");
  }

  const handleBlogNavigation = () => {
    navigate("/blog");
  }

  const handleWorkStatusNavigation = () => {
    navigate(`/work-status/${userId}`);
  }

  const messagesNavigation = () => {
    navigate(`/messages/${userId}`);
  }

  const handleNotificationReadAll = () => {};

  useEffect(() => {
    window.addEventListener("scroll", () => setY(window.scrollY));
    return () => {
      window.removeEventListener("scroll", () => setY(window.scrollY));
    };
  }, [y]);

  useEffect(() => {
    dispatch(FetchingDesignerNotifications(userId));
  }, []);

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && <Backdrop toggleSidebar={toggleSidebar} />}
      <Wrapper
        className="flexCenter animate whiteBg shadow"
        style={y > 100 ? { height: "60px" } : { height: "80px" }}
      >
        <NavInner className="container flexSpaceCenter">
          <Link className="pointer flexNullCenter" to="home" smooth={true}>
            <LogoIcon />
            <h1 style={{ marginLeft: "15px" }} className="font20 extraBold">
              Finest Interiors
            </h1>
          </Link>
          <BurderWrapper
            className="pointer"
            onClick={() => toggleSidebar(!sidebarOpen)}
          >
            <BurgerIcon />
          </BurderWrapper>
          <UlWrapper className="flexNullCenter">
            <li className="semiBold font15 pointer">
              <Link
                activeClass="active"
                style={{ padding: "10px 15px" }}
                onClick={handleHomeNavigation}
                spy={true}
                smooth={true}
                offset={-80}
              >
                Home
              </Link>
            </li>

            {roleId === 3 ? (
              <>
              <li className="semiBold font15 pointer">
                <Link
                  activeClass="active"
                  style={{ padding: "10px 15px" }}
                  spy={true}
                  smooth={true}
                  offset={-80}
                  onClick={handleDesignerJobsheets}
                >
                  Job Sheets
                </Link>
              </li>
              <li className="semiBold font15 pointer">
                <Link
                 activeClass="active"
                 style={{ padding: "10px 15px" }}
                 spy={true}
                 smooth={true}
                 offset={-80}
                  onClick={handleWorkStatusNavigation}
                >
                  Work Status
                </Link>
              </li>
              </>
            ) : (
              <>
                <li className="semiBold font15 pointer">
                  <Link
                    activeClass="active"
                    style={{ padding: "10px 15px" }}
                    spy={true}
                    smooth={true}
                    offset={-80}
                    onClick={handleSheetsNavigation}
                  >
                    Job Sheets
                  </Link>
                </li>
              </>
            )}

            <li className="semiBold font15 pointer">
              <Link
                activeClass="active"
                style={{ padding: "10px 15px" }}
                onClick={handleBlogNavigation}
                spy={true}
                smooth={true}
                offset={-80}
              >
                Blog
              </Link>
            </li>

            <li className="semiBold font15 pointer">
              <Link
                activeClass="active"
                style={{ padding: "10px 15px" }}
                onClick={handleContactNavigation}
                spy={true}
                smooth={true}
                offset={-80}
              >
                Contact
              </Link>
            </li>
          </UlWrapper>
          <UlWrapperRight className="flexNullCenter">
            {!isAuth ? (
              <>
                <li className="semiBold font15 pointer">
                  <RouterLink
                    to="/auth/login"
                    style={{ padding: "10px 30px 10px 0" }}
                  >
                    Log in
                  </RouterLink>
                </li>
                <li className="semiBold font15 pointer flexCenter">
                  <RouterLink
                    to="/auth/register"
                    className="radius8 lightBg"
                    style={{ padding: "10px 15px" }}
                  >
                    Get Started
                  </RouterLink>
                </li>
              </>
            ) : (
              <>
                <AvatarContainer className="flexNullCenter">
                  <Avatar src={asset(userImg)} alt="User Avatar" />
                  <UserName
                    className="font15 semiBold"
                    onClick={handleProfileNavigation}
                  >
                    Hello, {userName}
                  </UserName>
                </AvatarContainer>
              </>
            )}

            <NotificationBell onClick={toggleNotification}>
              <NotificationBellIcon />
            </NotificationBell>

            {notificationOpen && (
            <NotificationsDropdown>
              {notificationData.length > 0 ? (
                notificationData.map((notif) => (
                  <NotificationItem key={notif.id}>
                    {notif.message}
                    <DeleteIcon className="deleteIcon" onClick={() => handleNotificationDelete(notif.id)}/>
                  </NotificationItem>
                ))
              ) : (
                <NotificationItem>No new notifications</NotificationItem>
              )}
              <ReadAllButton>
                Read All
              </ReadAllButton>
            </NotificationsDropdown>
          )}

          <MessageBox>
            <MessageBoxIcon onClick={messagesNavigation} />
          </MessageBox>

          </UlWrapperRight>
        </NavInner>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.nav`
  width: 100%;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 999;
`;
const NavInner = styled.div`
  position: relative;
  height: 100%;
`;
const BurderWrapper = styled.button`
  outline: none;
  border: 0px;
  background-color: transparent;
  height: 100%;
  padding: 0 15px;
  display: none;
  @media (max-width: 760px) {
    display: block;
  }
`;
const UlWrapper = styled.ul`
  display: flex;
  @media (max-width: 760px) {
    display: none;
  }
`;

const ButtonInput = styled.input`
  border: 1px solid red;
  background-color: red;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  margin-left: 10px;
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

const UlWrapperRight = styled.ul`
  display: flex;
  align-items: center;
  @media (max-width: 760px) {
    display: none;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 15px;
`;

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
`;

const UserName = styled.p`
  margin-left: 10px;
  color: #333;
  cursor: pointer;
`;

const NotificationBell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 20px;
  position: relative;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const MessageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const NotificationsDropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  width: 325px;
  max-height: 300px;
  overflow-y: auto;
  background-color: #fff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 10px;
  z-index: 10;
  display: flex;
  flex-direction: column;
`;

const NotificationItem = styled.div`
  position: relative;
  padding: 10px;
  font-size: 13px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:last-child {
    border-bottom: none;
  }

  &:hover .deleteIcon {
    display: block;
  }
`;

const DeleteIcon = styled(FiXCircle)`
  display: none;
  cursor: pointer;
  font-size: 18px;
  color: #ff4d4f;
`;

const ReadAllButton = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;
