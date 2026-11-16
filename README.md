
# SpendWise - Personal Expense Tracker

SpendWise is a full-stack personal expense tracking application that helps users manage their income and expenses in one place. Users can securely create an account, record transactions, monitor their financial balance, and manage their transaction history through a simple dashboard.

## Features

- **User Authentication:** Register and log in securely using JWT-based authentication.
- **Password Security:** Passwords are hashed using bcryptjs before being stored.
- **Dashboard:** View total income, total expenses, and available balance.
- **Transaction Management:** Add, view, edit, and delete income and expense records.
- **User-specific Data:** Each user can access only their own transactions.
- **Protected Routes:** Restrict access to dashboard and transaction pages without authentication.
- **Responsive Interface:** A clean and user-friendly interface built with React.

## Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

### Tools
- Visual Studio Code
- Postman
- MongoDB Atlas
- Git and GitHub

## Project Structure

```text
SpendWise/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── transactionRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/SpendWise.git
cd SpendWise
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend development server:

```bash
npm run dev
```

The backend will run at:

`http://localhost:5000`

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at:

`http://localhost:5173`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in an existing user |

### Transactions

All transaction endpoints require a valid JWT token in the Authorization header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | Get user transactions |
| POST | `/api/transactions` | Create a transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |
| GET | `/api/transactions/summary` | Get income and expense summary |

### Authentication Header

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Database Models

### User
- name
- email
- password (hashed)

### Transaction
- userId
- title
- amount
- type (income/expense)
- category
- date
- description

## Security

- Passwords are hashed using bcryptjs.
- JWT tokens are used to authenticate users.
- Protected backend routes prevent unauthenticated access.
- Transactions are associated with individual user IDs.
- Environment variables are used to store sensitive configuration.

## Future Improvements

- Transaction filtering by category and date.
- Monthly spending charts and analytics.
- Budget creation and tracking.
- Export transaction history.
- Improved mobile responsiveness.

## Author

**Aryeman Verma**

---

*SpendWise is a learning project developed to explore full-stack web development, REST APIs, database integration, and authentication.*
