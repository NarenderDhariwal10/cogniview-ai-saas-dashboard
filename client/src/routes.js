import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Teams from "./pages/Teams";
import AI from "./pages/AI";
import Billing from "./pages/Billing";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

import Home from "./pages/Home";
import OrganizationPage from "./pages/OrganisationPage";
import TaskPage from "./pages/TaskPage";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Career from "./pages/Carrer";
import Blog from "./pages/Blog";
import TermsOfService from "./pages/TermsofService";
import PrivacyPolicy from "./pages/PrivacyPolicy";



const routes = [
  { path: "/", element: <Home /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/projects", element: <Projects /> },
  { path: "/projects/:id", element: <ProjectDetails /> },
  { path: "/teams", element: <Teams /> },
  { path: "/ai", element: <AI /> },
  { path: "/billing", element: <Billing /> },
  { path: "/payment-success", element: <PaymentSuccess /> },
  { path: "/payment-cancel", element: <PaymentCancel /> },
  { path: "/about", element: <About /> },
  { path: "/organization", element: <OrganizationPage /> },
  { path: "/tasks", element: <TaskPage /> },
  { path: "/features", element: <Features /> },
  { path: "/pricing", element: <Pricing /> },
  { path: "/contact", element: <Contact /> },
  { path: "/careers", element: <Career /> },
  { path: "/blog", element: <Blog /> },
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/terms", element: <TermsOfService /> },
];

export default routes;
