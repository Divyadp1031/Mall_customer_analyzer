import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CustomerAnalysis from "./pages/CustomerAnalysis";
import Segmentation from "./pages/Segmentation";
import Prediction from "./pages/Prediction";
import Insights from "./pages/Insights";
import api from "./services/api";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [centroids, setCentroids] = useState([]);
  const [scatterData, setScatterData] = useState(null);

  // Selected customer or preset for prediction/profiling
  const [predictionCustomer, setPredictionCustomer] = useState(null);

  // Fetch all initial data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Health check
      const health = await api.checkHealth();
      if (health && health.status === "online") {
        setIsOnline(true);
      }

      // 2. Load Stats, Customers, Clusters, Scatter
      const [statsData, customersData, clustersData, scatterPoints] = await Promise.all([
        api.getStats().catch(() => null),
        api.getCustomers().catch(() => ({ customers: [] })),
        api.getClusters().catch(() => ({ clusters: [], centroids: [] })),
        api.getScatterData().catch(() => null),
      ]);

      if (statsData) setStats(statsData);
      if (customersData?.customers) setCustomers(customersData.customers);
      if (clustersData?.clusters) setClusters(clustersData.clusters);
      if (clustersData?.centroids) setCentroids(clustersData.centroids);
      if (scatterPoints) setScatterData(scatterPoints);
    } catch (err) {
      console.error("Failed to load initial data:", err);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler when user selects customer from list or chart to test in profiler
  const handleSelectCustomerForPrediction = (customer) => {
    setPredictionCustomer({
      annual_income: customer.annual_income,
      spending_score: customer.spending_score,
      age: customer.age,
      gender: customer.gender,
    });
    setActiveTab("prediction");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Navigation Bar */}
      <Navbar
        isOnline={isOnline}
        onRefresh={loadData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q.trim() && activeTab !== "customers") {
            setActiveTab("customers");
          }
        }}
      />

      {/* Main Container with Sidebar + Page Content */}
      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          totalCustomers={stats?.total_customers || customers.length || 200}
        />

        <main className="flex-1 min-w-0 pb-16 overflow-y-auto">
          {loading && !stats ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-indigo-600 border-t-transparent"></div>
              <p className="text-xs text-slate-500 font-medium">
                Loading customer insights and shopping behavior...
              </p>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <Dashboard
                  stats={stats}
                  scatterData={scatterData}
                  setActiveTab={setActiveTab}
                  onSelectCustomerForPrediction={handleSelectCustomerForPrediction}
                />
              )}

              {activeTab === "customers" && (
                <CustomerAnalysis
                  customers={customers}
                  onSelectCustomerForPrediction={handleSelectCustomerForPrediction}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === "segmentation" && (
                <Segmentation
                  clusters={clusters}
                  centroids={centroids}
                  setActiveTab={setActiveTab}
                  onSelectPresetForPrediction={(preset) => {
                    setPredictionCustomer(preset);
                    setActiveTab("prediction");
                  }}
                />
              )}

              {activeTab === "prediction" && (
                <Prediction
                  initialData={predictionCustomer}
                  scatterData={scatterData}
                />
              )}

              {activeTab === "insights" && (
                <Insights stats={stats} setActiveTab={setActiveTab} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
