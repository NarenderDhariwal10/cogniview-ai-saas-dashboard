// client/src/services/api.js
import axios from "axios";
import { getSocket } from "./socket";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

// Axios instance
const API = axios.create({
  baseURL: BASE,
  timeout: 15000,
});

// 👉 Helper to fetch orgId (from localStorage or user context)
const getOrgId = () => {
  try {
    return localStorage.getItem("orgId") || null;
  } catch {
    return null;
  }
};

// Request Interceptor: Attach token + orgId
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const orgId = getOrgId();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (orgId) {
    config.headers["x-org-id"] = orgId; // custom header for backend
  }

  console.log("➡️ API Request:", {
    url: config.url,
    method: config.method,
    orgId,
    token: token ? "present" : "missing",
  });

  return config;
});

// Response Interceptor: Normalize error messages
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.data?.message) {
      err.message = err.response.data.message;
    }
    return Promise.reject(err);
  }
);

// ---------- PROJECTS ----------
export const getProjects = () => API.get("/projects");
export const createProject = (payload) => API.post("/projects", payload);
export const updateProject = (id, payload) => API.put(`/projects/${id}`, payload);
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const getProjectById = (id) => API.get(`/projects/${id}`);

// ---------- EVENTS (Socket) ----------
export const emitEvent = (event, payload) => {
  const socket = getSocket();
  if (socket?.connected) socket.emit(event, payload);
};

// ---------- AUTH ----------
export const loginUser = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  // save token + orgId in localStorage
  if (res.data?.token) localStorage.setItem("token", res.data.token);
  if (res.data?.user?.organization?._id) {
    localStorage.setItem("orgId", res.data.user.organization._id);
  }
  return res.data;
};

export const registerUser = async (email, password, name) => {
  const res = await API.post("/auth/register", { email, password, name });
  if (res.data?.token) localStorage.setItem("token", res.data.token);
  if (res.data?.user?.organization?._id) {
    localStorage.setItem("orgId", res.data.user.organization._id);
  }
  return res.data;
};

export const getUser = async () => (await API.get("/auth/me")).data;
export const logoutUser = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("orgId");
  return API.post("/auth/logout");
};

// ---------- TEAMS ----------
export const getTeams = async () => (await API.get("/teams")).data;
export const getTeamById = async (id) => (await API.get(`/teams/${id}`)).data;
export const createTeam = async (team) => (await API.post("/teams/create", team)).data;
export const addMember = async (data) => (await API.post("/teams/add-member", data)).data;

// ---------- AI ----------
export const chatAI = async (message) => (await API.post("/ai/chat", { message })).data;
export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return (await API.post("/ai/upload-csv", formData)).data;
};

// ---------- BILLING ----------
// client/src/services/api.js
export const createCheckout = async (priceId) =>
  (await API.post("/billing/create-checkout-session", { priceId })).data;

export const getBilling = async () => (await API.get("/billing/me")).data;
// client/services/api.js
export const getPrices = async () => (await API.get("/billing/prices")).data;


//organisation
export const createOrganization = async (name) => (await API.post("/organizations/create", { name })).data;
export const inviteMember = async (orgId, email, role) =>
  (await API.post("/organizations/invite", { orgId, email, role })).data;
export const removeMember = async (orgId, userId) =>
  (await API.post("/organizations/remove", { orgId, userId })).data; 


export default API;
