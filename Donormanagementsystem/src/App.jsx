import React from "react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Donors } from "./pages/Donors";
import { Donations } from "./pages/Donations";
import { Campaigns } from "./pages/Campaigns";
import { CampaignDetails } from "./pages/CampaignDetails";
import { Reports } from "./pages/Reports";
import { Communications } from "./pages/Communications";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="donors" element={<Donors />} />
        <Route path="donations" element={<Donations />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="campaigns/:id" element={<CampaignDetails />} />
        <Route path="reports" element={<Reports />} />
        <Route path="communications" element={<Communications />} />
      </Route>
    </Routes>
  );
}