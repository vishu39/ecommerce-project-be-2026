app/
 ├── auth/
 │   ├── model.js        → User schema
 │   ├── function.js     → Auth logic
 │   └── routes.js       → Auth endpoints
 │
 ├── products/
 │   ├── model.js
 │   ├── function.js
 │   └── routes.js
 │
 ├── orders/
 │   ├── model.js
 │   ├── function.js
 │   └── routes.js
 │
 ├── cart/
 │   ├── model.js
 │   ├── function.js
 │   └── routes.js
 │
 └── reviews/
 │   ├── model.js
 │   ├── function.js
 │   └── routes.js
 │
constants/
 └── constant.js         → App-wide constants

env/
 └── .env.development    → Environment variables

middleware/
 ├── verifyToken.js      → JWT authentication
 ├── errorHandler.js     → Global error handling
 └── roleCheck.js        → Admin/User authorization

startup/
 ├── db.js               → Database connection
 └── routes.js           → Route registration

server.js                → Application entry point
