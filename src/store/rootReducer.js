import { combineReducers } from "redux";
import {
  userSlice,
  productSlice,
  authRegister,
  authOtp,
  authLogin,
  authForgotPassword,
  authUpdatePassword,
  authDesignerForm,
  userUpdateProfile,
  FetchDesigners,
  DesignerSearch,
  UserDetails,
  UpdateUserDetails,
  ProfileSingleView,
  createJobsheet,
  FetchJobsheet,
  FetchingSingleJobsheet,
  FetchingUsersJobsheets,
  FetchingDesignerJobsheet,
  createDesignerJobsheet,
  FetchingDesignerJobsheetResponse,
  FetchingSingleDesignerJobsheetResponse,
  DesignerRejected,
  DesignerShortlisting,
  CreatePayment,
  FetchingDesignerNotifications,
  DeleteNotification,
  DesignerAssignSheets,
  FinishWorkApprovalRejectStatus,
  GetChatUsers,
} from "../slice";


const staticReducers = {
  user: userSlice,
  product: productSlice,
  authRegister: authRegister,
  authOtp: authOtp,
  authLogin: authLogin,
  authForgotPassword: authForgotPassword,
  authUpdatePassword: authUpdatePassword,
  authDesignerForm: authDesignerForm,
  userUpdateProfile: userUpdateProfile,
  FetchDesigners: FetchDesigners,
  DesignerSearch: DesignerSearch,
  UserDetails: UserDetails,
  UpdateUserDetails: UpdateUserDetails,
  ProfileSingleView:  ProfileSingleView,
  createJobsheet: createJobsheet,
  FetchJobsheet:FetchJobsheet,
  FetchingSingleJobsheet: FetchingSingleJobsheet,
  FetchingUsersJobsheets: FetchingUsersJobsheets,
  FetchingDesignerJobsheet: FetchingDesignerJobsheet,
  createDesignerJobsheet: createDesignerJobsheet,
  FetchingDesignerJobsheetResponse: FetchingDesignerJobsheetResponse,
  FetchingSingleDesignerJobsheetResponse: FetchingSingleDesignerJobsheetResponse,
  DesignerRejected: DesignerRejected,
  DesignerShortlisting: DesignerShortlisting,
  CreatePayment: CreatePayment,
  FetchingDesignerNotifications: FetchingDesignerNotifications,
  DeleteNotification: DeleteNotification,
  DesignerAssignSheets: DesignerAssignSheets,
  FinishWorkApprovalRejectStatus: FinishWorkApprovalRejectStatus,
  GetChatUsers: GetChatUsers
};

const createRootReducer = (asyncReducers = {}) => {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });
};

const rootReducer = (state, action) => {
  const combinedReducer = createRootReducer();
  return combinedReducer(state, action);
};

export default rootReducer;
