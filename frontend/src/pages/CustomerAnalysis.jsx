import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

function CustomerAnalysis({ customers = [], onSelectCustomerForPrediction, setActiveTab }) {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [sortBy, setSortBy] = useState("customer_id");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Filter & Search logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // Group filter
      if (groupFilter !== "all" && c.cluster !== parseInt(groupFilter)) {
        return false;
      }
      // Gender filter
      if (genderFilter !== "all" && c.gender.toLowerCase() !== genderFilter.toLowerCase()) {
        return false;
      }
      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const idMatch = c.customer_id.toString().includes(query);
        const groupMatch = (c.cluster_name || "").toLowerCase().includes(query);
        const genderMatch = (c.gender || "").toLowerCase().includes(query);
        if (!idMatch && !groupMatch && !genderMatch) return false;
      }
      return true;
    });
  }, [customers, groupFilter, genderFilter, search]);

  // Sorting logic
  const sortedCustomers = useMemo(() => {
    const list = [...filteredCustomers];
    list.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredCustomers, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedCustomers.length / pageSize) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCustomers.slice(start, start + pageSize);
  }, [sortedCustomers, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Export to CSV function
  const handleExportCSV = () => {
    if (!customers.length) return;
    const headers = ["CustomerID,Gender,Age,Annual_Income_k$,Spending_Score,Customer_Group"];
    const rows = customers.map(
      (c) =>
        `${c.customer_id},${c.gender},${c.age},${c.annual_income},${c.spending_score},"${c.cluster_name}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mall_customers_profiles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, and inspect individual customer records and their shopping behavior profiles.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition"
        >
          <Download size={14} />
          Export Customer CSV
        </button>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by ID, group name, gender..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter size={14} className="text-slate-400" />
            <span>Customer Group:</span>
            <select
              value={groupFilter}
              onChange={(e) => {
                setGroupFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Groups (5)</option>
              <option value="0">Standard / Balanced</option>
              <option value="1">VIP / High Spenders</option>
              <option value="2">Young Trendsetters</option>
              <option value="3">Careful Savers</option>
              <option value="4">Budget Shoppers</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Gender:</span>
            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Genders</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th
                  onClick={() => handleSort("customer_id")}
                  className="px-6 py-3.5 cursor-pointer hover:text-indigo-600 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Customer ID
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("gender")}
                  className="px-6 py-3.5 cursor-pointer hover:text-indigo-600 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Gender
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("age")}
                  className="px-6 py-3.5 cursor-pointer hover:text-indigo-600 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Age
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("annual_income")}
                  className="px-6 py-3.5 cursor-pointer hover:text-indigo-600 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Annual Income
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("spending_score")}
                  className="px-6 py-3.5 cursor-pointer hover:text-indigo-600 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Spending Score (1-100)
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("cluster")}
                  className="px-6 py-3.5 cursor-pointer hover:text-indigo-600 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Shopping Group
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((c) => (
                  <tr key={c.customer_id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      #{c.customer_id}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium ${
                          c.gender === "Female"
                            ? "bg-pink-50 text-pink-700 border border-pink-100"
                            : "bg-blue-50 text-blue-700 border border-blue-100"
                        }`}
                      >
                        <User size={11} />
                        {c.gender}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-medium">{c.age} yrs</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">${c.annual_income}k</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min(100, (c.annual_income / 140) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{c.spending_score}</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-pink-500 rounded-full"
                            style={{ width: `${c.spending_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold text-xs text-white shadow-xs"
                        style={{ backgroundColor: c.cluster_color || "#6366F1" }}
                      >
                        {c.cluster_name}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => {
                          if (onSelectCustomerForPrediction) {
                            onSelectCustomerForPrediction(c);
                            setActiveTab("prediction");
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                      >
                        <Sparkles size={11} />
                        Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    No customers match the current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing{" "}
            <strong>
              {sortedCustomers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(currentPage * pageSize, sortedCustomers.length)}
            </strong>{" "}
            of <strong>{sortedCustomers.length}</strong> shoppers
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerAnalysis;
