# 💰 Cash Intelligence Navigator 

> **Take Control of Your Money. Track Smarter. Save Better.**

**Smart Budget Tracker** is a modern, full-stack personal finance management web application that helps users track income, manage expenses, set budgets, analyze spending patterns, and achieve savings goals — all from one smart dashboard.

🚀 **Live Demo:** https://cash-intelligence-navigator.vercel.app

---

## ✨ Features

### 🔐 User Authentication

* User registration and login
* Secure password hashing
* Password verification
* PHP session management
* Secure logout
* Duplicate email detection
* CSRF protection
* Server-side validation
* User-specific data isolation

### 📊 Smart Dashboard

* Total Balance
* Total Income
* Total Expenses
* Monthly Budget
* Remaining Budget
* Total Savings
* Current date and month
* Recent transactions
* Quick action buttons

All dashboard statistics are calculated from real database data.

### 💵 Income Management

* Add income
* Edit income
* Delete income
* View income records
* Income source tracking
* Payment method tracking
* Transaction descriptions

**Income Sources:**

* Salary
* Freelance
* Pocket Money
* Business
* Gift
* Other

### 💸 Expense Management

* Add expenses
* Edit expenses
* Delete expenses
* View expense records
* Category-based tracking
* Payment method tracking
* Used-for descriptions

**Categories:**

* Food
* Travel
* Shopping
* Education
* Bills
* Entertainment
* Health
* Other

### 🎯 Budget Management

* Overall monthly budget
* Category-wise budgets
* Spending tracking
* Remaining budget
* Budget utilization percentage
* Visual progress bars
* Budget warnings

Budget status automatically indicates:

* 🟢 Normal spending
* 🟡 80%+ budget usage
* 🟠 90%+ budget usage
* 🔴 100%+ budget usage

### 📜 Transaction History

View all income and expenses in one place.

Includes:

* Search
* Month filtering
* Date filtering
* Income/Expense filtering
* Category filtering
* Payment method filtering
* Amount filtering
* Sorting
* Pagination
* Edit
* Delete

### 📈 Monthly Analysis

Analyze financial performance by selecting a specific month and year.

The system calculates:

* Total Income
* Total Expenses
* Savings
* Monthly Budget
* Remaining Budget
* Average Daily Expense
* Number of Transactions
* Highest Spending Category
* Lowest Spending Category
* Highest Single Expense
* Average Expense
* Most Used Payment Method

### 📊 Interactive Charts

The application uses **Chart.js** to display real financial data through:

* Income vs Expense Chart
* Category-wise Spending Chart
* Daily Spending Chart
* Payment Method Distribution Chart

### 🔄 Month-to-Month Comparison

Compare two different months based on:

* Income
* Expenses
* Savings
* Budget
* Budget utilization
* Category spending
* Percentage changes

This helps users understand how their financial activity changes over time.

### 🧠 Smart Spending Insights

The application generates data-driven insights based on actual transactions.

Examples:

* Highest spending category
* Changes in monthly expenses
* Budget utilization
* Monthly savings
* Spending trends
* Most-used payment method
* Average daily expense

Insights are generated from explainable calculations rather than random or static information.

> **Note:** These insights are for personal tracking and educational purposes and are not professional financial advice.

### ❤️ Financial Health Score

A **0–100 Financial Health Score** is calculated using explainable factors such as:

* Savings rate
* Budget utilization
* Spending trend
* Expense consistency
* Savings goal progress

#### Score Levels

|  Score | Status             |
| -----: | ------------------ |
| 80–100 | 🟢 Excellent       |
|  60–79 | 🔵 Good            |
|  40–59 | 🟡 Needs Attention |
|   0–39 | 🔴 Critical        |

The application also provides a breakdown of the factors contributing to the score.

### 🎯 Savings Goals

Users can create and manage multiple savings goals.

Examples:

* 💻 Laptop
* 🏍️ Bike
* ✈️ Trip
* 🎓 Education
* 🛟 Emergency Fund

Features include:

* Create goal
* Edit goal
* Delete goal
* Add money
* Target amount
* Saved amount
* Remaining amount
* Target date
* Completion percentage
* Progress bar

### 👤 Profile Management

Users can:

* View profile information
* Update their name
* View email
* Change password
* Securely validate account changes

### 🌙 Dark Mode

A complete Light/Dark theme system with:

* CSS variables
* Responsive theme styling
* Dark dashboard
* Dark tables
* Dark forms
* Dark charts
* Dark sidebar
* Dark modals

Theme preference is stored using **localStorage**.

### 📱 Responsive Design

Designed for:

* 320px mobile
* 375px mobile
* 414px mobile
* 768px tablet
* 1024px laptop
* 1280px desktop
* 1440px+ desktop

Includes:

* Responsive cards
* Responsive tables
* Responsive forms
* Responsive charts
* Mobile navigation
* Sidebar drawer
* Touch-friendly controls
* No unnecessary horizontal scrolling

---

# 🛠️ Languages & Technologies

## 💻 Programming Languages

### HTML5

Used to create the structure and semantic layout of the application.

### CSS3

Used for:

* Modern UI design
* Responsive layouts
* CSS variables
* Dark mode
* Animations
* Hover effects
* Cards
* Forms
* Progress indicators

### JavaScript

**Vanilla JavaScript** is used for:

* DOM manipulation
* Search and filtering
* Form interactions
* Dark mode
* Mobile navigation
* Modal windows
* Toast notifications
* Confirmation dialogs
* Chart initialization
* Progress animations

---

# 🛡️ Security

Security has been considered throughout the application.
Each user's financial information is isolated from other users.

---

# 🧮 Financial Calculations

The application calculates financial statistics dynamically.

### Balance

```text
Balance = Total Income − Total Expenses
```

### Savings

```text
Savings = Total Income − Total Expenses
```

### Remaining Budget

```text
Remaining Budget = Budget − Expenses
```

### Budget Usage

```text
Budget Usage = (Expenses ÷ Budget) × 100
```

All calculations are based on actual user records stored in MySQL.

---

# 🇮🇳 Indian Currency

The application uses the Indian Rupee:

**₹**

Examples:

```text
₹1,500
₹25,000
₹1,25,000
```

Indian numbering format is supported where appropriate.

---

# 🎨 UI/UX

The application follows a modern **FinTech/SaaS-inspired design**.

The interface includes:

* Clean dashboard cards
* Rounded components
* Soft shadows
* Modern typography
* Consistent spacing
* Professional buttons
* Interactive charts
* Progress indicators
* Toast notifications
* Smooth hover effects
* Light/Dark themes
* Responsive layouts

The goal is to provide a polished experience rather than a basic college-project interface.

---

# 🎓 Project Purpose

Smart Budget Tracker was created to demonstrate practical full-stack development skills through a real-world financial management application.

The project demonstrates knowledge of:

* Full-stack web development
* PHP backend development
* MySQL database design
* CRUD operations
* Authentication
* Session management
* Secure database queries
* Data visualization
* JavaScript interactions
* Responsive web design
* Financial calculations
* User authorization
* UI/UX development

---

# 🚀 Why Smart Budget Tracker?

Managing money can become difficult when income, expenses, budgets, and savings are tracked separately.

**Smart Budget Tracker brings everything together in one place.**

> **Track your money. Understand your spending. Plan your budget. Reach your goals.**

---

# 🌐 Live Demo

### 🚀 Smart Budget Tracker

**https://cash-intelligence-navigator.vercel.app**

---

## 📄 License

This project is developed for **educational, learning, and portfolio purposes**.

Feel free to study the code, customize the design, add new functionality, and improve the application.

---

<div align="center">

### 💰Cash Intelligence Navigator

**Track Smarter • Spend Wisely • Save Better**

⭐ If you find this project useful, consider giving it a star!

</div>
