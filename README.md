# 🛍️ Mall Customer Analyzer

> **Customer Insights & Shopping Behavior Dashboard**  
> A simple, visual tool that helps mall managers and store owners understand who their customers are, how they spend, and how to attract more shoppers.

---

## 💡 What Does This Project Do?

This application analyzes customer shopping patterns based on two simple factors:
1. **Annual Income** (how much money they earn per year)
2. **Spending Habit Score** (how frequently and actively they spend at the mall, on a scale from 1 to 100)

Using these factors, the system automatically groups 200 mall shoppers into **5 clear customer groups**. This makes it easy to run targeted promotions, design store layouts, and improve sales.

---

## 👥 The 5 Customer Groups

| Group | Name | Profile & Spending Style | Recommended Strategy |
| :--- | :--- | :--- | :--- |
| **Group 1** | **Standard / Balanced** | Middle-income earners who shop steadily and predictably. | Everyday value items, seasonal sales, standard points rewards. |
| **Group 2** | **VIP / High Spenders** | High-income earners who spend heavily on luxury and fine dining. | Private shopping previews, free valet parking, concierge services. |
| **Group 3** | **Young Trendsetters** | Younger shoppers with modest earnings who spend heavily on fashion and cafes. | Influencer pop-ups, student perks, social media campaigns. |
| **Group 4** | **Careful Savers** | High-income earners who spend cautiously and research before buying. | Product warranties, durability focus, high-value cashback offers. |
| **Group 5** | **Budget Shoppers** | Price-conscious shoppers looking for essentials and deals. | Clearance events, discount coupon mailers, affordable grocery deals. |

---

## ✨ Features

- **📊 Overview & Metrics**: View key numbers at a glance (average income, average spending score, gender split, and group distribution).
- **🗺️ Interactive Shopper Map**: A visual chart plotting every shopper across Income and Spending habits.
- **📋 Customer Directory**: A searchable, filterable list of customers with sorting and **one-click CSV download**.
- **🎯 Shopper Profiler**: Move the sliders for Income and Spending to immediately identify which group a customer belongs to and get personalized marketing tips.
- **💡 Growth Strategies**: Practical advice on mall store leasing, loyalty programs, and seasonal campaigns.

---

## 🚀 How to Run the Project

### ⚙️ Step 1: First-Time Setup (Dataset & Model Training)
Because datasets and model files are excluded from Git (via `.gitignore`), when you first set up or clone the project:

1. **Add the Dataset:**  
   Place `Mall_Customers.csv` inside the `backend/dataset/` folder.

2. **Train the Model:**  
   Run the training script to analyze the data and generate the model files (`scaler.pkl` and `kmeans_model.pkl`):
   ```powershell
   python backend/src/clustering.py
   ```

---

### 🖥️ Step 2: Start the Application

#### Option A: Quick Start (Recommended for Windows)
Simply double-click the **`start.bat`** file in this folder. It will automatically start both the backend and frontend for you!

Once started, open your web browser and go to:  
👉 **http://localhost:5000**

#### Option B: Manual Start (Step-by-Step)

If you prefer to start the servers manually using the terminal:

#### 1. Start the Backend Server:
```powershell
.\.venv\Scripts\python.exe app.py
```
*(The backend runs at http://localhost:5000)*

#### 2. Start the Frontend (Optional, for developers):
Open a second terminal window:
```powershell
cd frontend
npm run dev
```
*(The development server runs at http://localhost:5174)*

---

## 📁 Project Structure (In Simple Words)

```text
Mall_customer_analyzer/
│
├── app.py              # Main backend server (handles data and serves the website)
├── start.bat           # One-click launcher to start the project
├── .gitignore          # Tells Git which files to ignore
├── README.md           # Project guide (this file)
│
├── backend/
│   ├── dataset/        # Customer data files (Mall_Customers.csv)
│   ├── models/         # Pre-calculated customer profiles and scaler files
│   └── src/            # Data preparation and analysis scripts
│
└── frontend/
    ├── src/            # Source code for the dashboard user interface
    │   ├── components/ # Reusable UI pieces (Navbar, Sidebar, StatCards)
    │   ├── pages/      # Dashboard, Directory, Groups, Profiler, and Strategies
    │   └── services/   # Connects the frontend to the backend
    ├── dist/           # Ready-to-use production website files
    └── package.json    # Frontend settings and libraries
```

---

## 🛠️ Built With

- **Backend**: Python, Flask, Pandas, Scikit-learn
- **Frontend**: React, Tailwind CSS, Lucide Icons, Vite
