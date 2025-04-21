# Personal Website Server

A robust backend server for personal website built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Features

- RESTful API architecture
- TypeScript for type safety
- Prisma ORM for database management
- JWT authentication
- Role-based access control
- User management system
- Secure password handling

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MySQL database
- Prisma CLI

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/kristinefung/personal_website_server.git
cd personal_website_server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.sample .env
```
Edit the `.env` file with your configuration.

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

## 🏃‍♂️ Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📁 Project Structure

```
src/
├── controllers/    # API controllers
├── dtos/          # Data Transfer Objects
├── repositories/  # Database repositories
├── services/      # Business logic
├── utils/         # Utility functions
├── ioc/           # Inversion of Control
└── router/        # API routes
```

## 🔒 Environment Variables

- `PORT`: Server port (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT secret key
- `NODE_ENV`: Environment (development/production)

## 🐳 Docker Support

Build the Docker image:
```bash
docker build -t personal-website-server .
```

Run the container:
```bash
docker run -p 3000:3000 personal-website-server
```

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

Kristine Fung

## 🙏 Acknowledgments

- Express.js
- TypeScript
- Prisma
- Jest
