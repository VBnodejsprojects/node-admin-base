import React from "react";
import { Navigate } from "react-router-dom";

// Profile
import UserProfile from "../pages/Authentication/user-profile";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import ChangePassword from "../pages/Authentication/ChangePassword";

// Dashboard  (backend: /homePage/dashboard/stats)
import Dashboard from "../pages/Dashboard/index";

// Utility / error pages
import PagesMaintenance from "../pages/Utility/pages-maintenance";
import PagesComingsoon from "../pages/Utility/pages-comingsoon";
import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";

// Backend-backed resource pages
import Users from "../pages/Users";                 // backend: /user
import Vendors from "../pages/Vendor";              // backend: /vendor
import Addresses from "../pages/Addresses";         // backend: /address
import Banner from "../pages/Banner";               // backend: /banner
import Coupon from "../pages/Coupon";               // backend: /coupon
import HelpSupport from "../pages/HelpSupport";     // backend: /helpsupport
import WalletTransactions from "../pages/Wallet";   // backend: /wallet/transaction
import WithdrawalRequest from "../pages/Wallet/withdrawalRequest"; // backend: /wallet/transaction/withdrawals
import Notification from "../pages/Notification";           // backend: /notification/push
import AllNotifications from "../pages/AllNotifications";    // backend: /notification/list/forAdmin

// Settings pages (all backed by backend: /settings)
import UserSettings from "../pages/UserSettings";
import VendorSettings from "../pages/VendorSettings";
import DeliveryPartnerSettings from "../pages/DeliveryPartnerSettings";
import WebsiteSettings from "../pages/WebsiteSettings";
import UserFAQ from "../pages/FAQs/userFaq";
import VendorFAQ from "../pages/FAQs/vendorFAQ";
import DeliveryPartnerFAQ from "../pages/FAQs/deliveryPartnerFAQ";
import AppSetting from "../pages/AppSetting";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },

  { path: "/users", component: <Users /> },
  { path: "/vendors", component: <Vendors /> },
  { path: "/addresses", component: <Addresses /> },

  { path: "/banner", component: <Banner /> },
  { path: "/coupons", component: <Coupon /> },

  // Notifications
  { path: "/notifications", component: <Notification /> },
  { path: "/all-notifications", component: <AllNotifications /> },

  // Help & support
  { path: "/help-support", component: <HelpSupport /> },

  // Wallet
  { path: "/wallet/transactions", component: <WalletTransactions /> },
  { path: "/wallet/withdrawal/requests", component: <WithdrawalRequest /> },

  // Settings
  { path: "/user-settings", component: <UserSettings /> },
  { path: "/vendor-settings", component: <VendorSettings /> },
  { path: "/delivery-partner-settings", component: <DeliveryPartnerSettings /> },
  { path: "/website-settings", component: <WebsiteSettings /> },
  { path: "/user-faq", component: <UserFAQ /> },
  { path: "/vendor-faq", component: <VendorFAQ /> },
  { path: "/delivery-partner-faq", component: <DeliveryPartnerFAQ /> },
  { path: "/app-setting", component: <AppSetting /> },

  // Profile
  { path: "/profile", component: <UserProfile /> },
  { path: "/change-password", component: <ChangePassword /> },

  { path: "", exact: true, component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },

  { path: "/pages-maintenance", component: <PagesMaintenance /> },
  { path: "/pages-comingsoon", component: <PagesComingsoon /> },
  { path: "/pages-404", component: <Pages404 /> },
  { path: "/pages-500", component: <Pages500 /> },
];

export { authProtectedRoutes, publicRoutes };
