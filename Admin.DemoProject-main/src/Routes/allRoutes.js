import React from "react";
import { Navigate } from "react-router-dom";

import Country from "../pages/LocationSetUp/Country/Country";
import City from "../pages/LocationSetUp/City/City";
import State from "../pages/LocationSetUp/State/State";
import CompanyLocation from "../pages/LocationSetUp/CompanyLocation";
import Login from "../pages/Authentication/Login";
import CategoryMaster from "../pages/Category/CategoryMaster";
import Blogs from "../pages/Blogs/Blogs";
import PromocodeMaster from "../pages/Subscription/PromocodeMaster";
import ProductDetails from "../pages/Products/ProductsDetails";
import UserProfile from "../pages/Authentication/user-profile";
import Banner from "../pages/CMS/Banner";
import CompanyDetails from "../pages/Setup/CompanyDetails";
import AdminUser from "../pages/Auth/AdminUser";
import ContactUs from "../pages/CMS/ContactUs";
import Review from "../pages/CMS/Review";
import NewProject from "../pages/CMS/NewProject";
const authProtectedRoutes = [
  // { path: "/dashboard", component: <DashboardCrm /> },
  { path: "/profile", component: <UserProfile /> },
  { path: "/country", component: <Country /> },
  { path: "/city", component: <City /> },
  { path: "/state", component: <State /> },
  { path: "/location", component: <CompanyLocation /> },
  { path: "/admin-user", component: <AdminUser /> },
  { path: "/company-details", component: <CompanyDetails /> },
  {path:"/contact",component:<ContactUs/>},
  { path: "/category", component: <CategoryMaster /> },
  {path:"/review",component:<Review/>},
  { path: "/blogs", component: <Blogs /> },
  { path: "/banner", component: <Banner /> },
  { path: "/promocode-master", component: <PromocodeMaster /> },
  {path:"/newproject",component:<NewProject/>},
  { path: "/product-details", component: <ProductDetails /> },


  {
    path: "/",
    exact: true,
    component: <Navigate to="/category" />,
  },
  { path: "*", component: <Navigate to="/category" /> },
];

const publicRoutes = [
  // { path: "/dashboard", component: <DashboardCrm /> },
  { path: "/", component: <Login /> },
];

export { authProtectedRoutes, publicRoutes };
