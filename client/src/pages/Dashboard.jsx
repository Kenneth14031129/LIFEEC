// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Dashboard.css";
import Header from "../components/Header";
import PatientBarChart from "../charts/PatientBarChart";

const Dashboard = () => {
  const [token] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="dashboard-component">
      <Header />
      <section className="main-body">
        <main>
          <h1>Dashboard</h1>
          <div className="chart-container">
            <PatientBarChart />
          </div>
        </main>
      </section>
    </div>
  );
};

export default Dashboard;