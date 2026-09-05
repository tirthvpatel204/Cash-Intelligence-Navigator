# 💰 Smart Budget Tracker

> **Take Control of Your Money. Track Smarter. Save Better.**

A modern, full-stack personal finance management web application designed to help users **track income, manage expenses, set budgets, analyze spending habits, and achieve savings goals** from one centralized dashboard.

🔗 **Live Demo:** https://cash-intelligence-navigator.vercel.app

---

## 🚀 Overview

**Smart Budget Tracker** is a professional FinTech-style web application built with **Core PHP, MySQL, PDO, Vanilla JavaScript, HTML5 and CSS3**.

The application provides a secure and personalized financial dashboard where every user's financial information is stored separately and retrieved dynamically from the database.

Instead of simply displaying static statistics, the application performs real calculations using database records to provide meaningful insights into:

* 💵 Income
* 💸 Expenses
* 📊 Budgets
* 💰 Savings
* 🎯 Savings Goals
* 📈 Monthly Analytics
* 🧠 Smart Spending Insights
* ❤️ Financial Health Score

---

## ✨ Key Features

### 🔐 Secure Authentication

* User registration and login
* Secure password hashing
* Password verification
* PHP session authentication
* Logout functionality
* Duplicate email validation
* CSRF protection
* User-specific data isolation
* Server-side form validation

---

### 📊 Smart Dashboard

The dashboard provides an instant overview of the user's financial activity.

It displays:

* Total Balance
* Total Income
* Total Expenses
* Monthly Budget
* Remaining Budget
* Total Savings
* Current month
* Current date
* Recent transactions
* Quick action buttons

All statistics are calculated from **real MySQL data**.

---

### 💵 Income Management

Users can manage their income records with complete CRUD functionality.

**Supported operations:**

* Add income
* Edit income
* Delete income
* View income history

**Income sources include:**

* Salary
* Freelance
* Pocket Money
* Business
* Gift
* Other

**Payment methods:**

* Cash
* UPI
* Debit Card
* Credit Card
* Bank Transfer
* Other

---

### 💸 Expense Management

Track daily spending with detailed expense records.

Users can:

* Add expenses
* Edit expenses
* Delete expenses
* View expenses
* Assign categories
* Add descriptions
* Select payment methods
* Record what the expense was used for

**Expense categories:**

* 🍔 Food
* 🚗 Travel
* 🛍️ Shopping
* 📚 Education
* 🧾 Bills
* 🎬 Entertainment
* ❤️ Health
* 📦 Other

---

### 🎯 Budget Management

Create and monitor monthly budgets.

The system supports:

* Overall monthly budgets
* Category-wise budgets
* Spending tracking
* Remaining budget calculation
* Budget utilization percentage
* Visual progress bars
* Budget warnings

Budget status automatically changes according to spending:

| Usage     | Status            |
| --------- | ----------------- |
| Below 80% | Normal            |
| 80%+      | ⚠️ Warning        |
| 90%+      | 🚨 Strong Warning |
| 100%+     | ❌ Budget Exceeded |

---

### 📜 Transaction History

View income and expenses in one centralized history page.

Powerful filtering features include:

* Search
* Month filter
* Date filter
* Income/Expense filter
* Category filter
* Payment method filter
* Amount range
* Sorting
* Pagination
* Edit
* Delete

This makes it easy to find specific financial transactions quickly.

---

## 📈 Smart Monthly Analysis

The analysis dashboard converts financial records into meaningful visual information.

Users can select a:

* Month
* Year

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

---

## 📊 Interactive Charts

The application uses **Chart.js** to visualize real database information.

### 💰 Income vs Expense

Compare monthly income against monthly expenses.

### 🍔 Category Spending

Understand where the majority of money is being spent.

### 📅 Daily Spending

Track spending patterns throughout the selected month.

### 💳 Payment Method Distribution

See which payment methods are used most frequently.

> All charts are generated using actual user data rather than static or random values.

---

## 🔄 Month-to-Month Comparison

Compare two different months to understand financial trends.

For example:

**August 2026 vs September 2026**

The comparison can include:

* Income
* Expenses
* Savings
* Budget
* Budget utilization
* Category spending

The application can generate understandable comparisons such as:

> Expenses increased compared with the previous month.

> Food spending increased compared with the selected comparison period.

> Monthly income decreased compared with the selected month.

Percentage changes are calculated dynamically from database data.

---

## 🧠 Smart Spending Insights

The application analyzes financial records and generates understandable insights based on actual calculations.

Examples include:

* Your highest spending category
* Changes in expenses compared with another month
* Current budget utilization
* Monthly savings
* Spending trends
* Most frequently used payment method
* Average daily spending

The insights are **explainable and data-driven** rather than random messages.

> ⚠️ These insights are intended for personal tracking and educational purposes and should not be considered professional financial advice.

---

## ❤️ Financial Health Score

The application provides an easy-to-understand **Financial Health Score from 0–100**.

Example:

**78 / 100 — Good**

The score can consider explainable factors such as:

* Savings rate
* Budget utilization
* Spending trend
* Expense consistency
* Savings goal progress

### Score Levels

|  Score | Status             |
| -----: | ------------------ |
| 80–100 | 🟢 Excellent       |
|  60–79 | 🔵 Good            |
|  40–59 | 🟡 Needs Attention |
|   0–39 | 🔴 Critical        |

A breakdown is provided to help users understand how the score was calculated.

---

## 🎯 Savings Goals

Create and monitor multiple financial goals.

Example goals:

* 💻 Laptop
* 🏍️ Bike
* ✈️ Trip
* 🎓 Education
* 🛟 Emergency Fund

Each goal can include:

* Goal name
* Target amount
* Current saved amount
* Target date
* Description
* Completion percentage
* Remaining amount
* Progress bar

Users can:

* Add goals
* Edit goals
* Delete goals
* Add money toward goals
* Track progress

Example:

**Laptop**

Target: ₹80,000
Saved: ₹52,000
Progress: **65%**

---

## 👤 Profile Management

Users can manage their account information.

Available features:

* View profile
* Update name
* View email
* Change password
* Secure password validation

---

## 🌙 Dark Mode

A modern Light/Dark theme system is included.

Dark mode adapts:

* Dashboard
* Sidebar
* Cards
* Tables
* Forms
* Buttons
* Charts
* Modals
* Backgrounds
* Text

The selected theme is saved using **localStorage**, so the preference remains available when the user returns.

---

## 📱 Fully Responsive

The interface is designed to work across:

* 📱 320px mobile
* 📱 375px mobile
* 📱 414px mobile
* 📲 768px tablet
* 💻 1024px laptop
* 🖥️ 1280px desktop
* 🖥️ 1440px+ desktop

Responsive functionality includes:

* Mobile navigation
* Sidebar drawer
* Responsive cards
* Responsive tables
* Responsive forms
* Responsive charts
* Touch-friendly controls
* No unnecessary horizontal scrolling

---

## 🛡️ Security

Security is an important part of the application.

The project uses:

* `password_hash()`
* `password_verify()`
* PDO
* Prepared statements
* PHP sessions
* CSRF tokens
* Server-side validation
* `htmlspecialchars()`
* Authorization checks
* User-specific database queries
* SQL injection prevention

Every user's financial records are isolated.

A user cannot access another user's:

* Income
* Expenses
* Budgets
* Savings goals
* History
* Analysis

---

## 🧮 Financial Calculations

The application performs calculations dynamically using MySQL records.

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

No financial statistics are hard-coded.

---

## 🇮🇳 Indian Currency Support

The application uses the Indian Rupee symbol:

**₹**

Examples:

* ₹1,500
* ₹25,000
* ₹1,25,000

Indian-style number formatting is used wherever appropriate.

---

## 🛠️ Technologies Used

| Technology                      | Purpose                       |
| ------------------------------- | ----------------------------- |
| **HTML5**                       | Application structure         |
| **CSS3**                        | Modern responsive UI          |
| **Vanilla JavaScript**          | Interactive functionality     |
| **PHP 8+**                      | Backend logic                 |
| **MySQL**                       | Database                      |
| **PDO**                         | Secure database communication |
| **Chart.js**                    | Financial charts              |
| **Font Awesome / Lucide Icons** | UI icons                      |
| **XAMPP**                       | Local development             |
| **InfinityFree**                | PHP/MySQL hosting             |

---

## 💻 XAMPP Setup

### 1. Install XAMPP

Install XAMPP with:

* Apache
* MySQL
* PHP

### 2. Copy the Project

Place the project inside:

```text
xampp/htdocs/
```

For example:

```text
xampp/htdocs/Smart-Budget-Tracker/
```

### 3. Start XAMPP

Open XAMPP Control Panel and start:

```text
Apache
MySQL
```

### 4. Create the Database

Open:

```text
http://localhost/phpmyadmin
```

Create a database named:

```text
smart_budget_tracker
```

### 5. Import Database

Open the **Import** section in phpMyAdmin and select:

```text
database.sql
```

Execute the SQL script.

### 6. Configure Database Connection

Update the database configuration in:

```text
db.php
```

For XAMPP, typical settings are:

```text
Host: localhost
Database: smart_budget_tracker
Username: root
Password: empty
```

### 7. Run the Application

Open:

```text
http://localhost/Smart-Budget-Tracker/
```

Register a new account and start using the application.

---

## 🌐 InfinityFree Deployment

The project is designed to work with standard PHP/MySQL shared hosting.

### Step 1 — Create Hosting

Create an InfinityFree hosting account and activate your website.

### Step 2 — Upload Files

Open the hosting file manager or FTP and upload the project files into the appropriate web root, commonly:

```text
htdocs/
```

### Step 3 — Create MySQL Database

From the InfinityFree control panel, create a MySQL database.

InfinityFree will provide database details such as:

* MySQL hostname
* Database name
* Username
* Password

### Step 4 — Import Database

Open the provided database management interface and import:

```text
database.sql
```

### Step 5 — Update Database Configuration

Update `db.php` with the MySQL credentials provided by your hosting account.

Do **not** use:

```text
localhost
```

for the production database unless your hosting provider specifically instructs you to.

### Step 6 — Open Website

Visit your assigned domain and test:

* Registration
* Login
* Dashboard
* Income
* Expenses
* Budget
* History
* Analysis
* Savings
* Profile
* Logout

---

## ⚙️ Changing MySQL Credentials

Database configuration should be kept separate from application logic.

For local development:

```text
Host: localhost
Database: smart_budget_tracker
Username: root
Password: 
```

For InfinityFree:

```text
Host: YOUR_INFINITYFREE_MYSQL_HOST
Database: YOUR_DATABASE_NAME
Username: YOUR_DATABASE_USERNAME
Password: YOUR_DATABASE_PASSWORD
```

Never publish real production database credentials to GitHub.

If credentials are accidentally exposed, change them immediately.

---

## 🔧 Troubleshooting

### Database connection error

Check:

* MySQL is running
* Database name is correct
* Username is correct
* Password is correct
* Hostname is correct

### Login not working

Check:

* `database.sql` was imported successfully
* The `users` table exists
* PHP sessions are enabled
* Passwords are being stored using `password_hash()`

### Charts not appearing

Check:

* Internet connection
* Chart.js is loading correctly
* Browser developer console for JavaScript errors
* PHP is returning valid data

### InfinityFree database not connecting

Make sure you are using the **MySQL hostname supplied by InfinityFree**, not automatically assuming it is `localhost`.

### CSS not loading

Check that:

* `style.css` exists
* The stylesheet path is correct
* File names match exactly
* Browser cache is cleared

---

## 📌 Project Goals

Smart Budget Tracker was designed with the following goals:

* Make personal expense tracking simple
* Provide useful financial visualization
* Help users understand spending patterns
* Encourage budget awareness
* Track savings goals
* Provide meaningful data-driven insights
* Demonstrate full-stack PHP/MySQL development
* Maintain a clean and beginner-friendly codebase

---

## 🎓 Portfolio Value

This project demonstrates practical knowledge of:

* Full-stack web development
* PHP backend development
* MySQL database design
* CRUD operations
* Authentication
* Session management
* PDO prepared statements
* SQL relationships
* Data visualization
* JavaScript DOM manipulation
* Responsive web design
* Security fundamentals
* Hosting and deployment
* Real-world application architecture

It is suitable for showcasing in a **college portfolio, GitHub profile, internship applications, and resume projects section**.

---

## 🔗 Live Demo

### 🚀 Try Smart Budget Tracker

**https://cash-intelligence-navigator.vercel.app**

---

## 📄 License

This project is created for **educational, portfolio, and learning purposes**.

You are free to study, modify, and improve the project according to your requirements.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**Build smarter. Track better. Save with purpose. 💰📊**
