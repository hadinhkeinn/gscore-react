# GScore React - National High School Exam Score Lookup

A modern React application for looking up National High School Exam scores with comprehensive reporting and data visualization features.

## 🎯 About

GScore React is a user-friendly web application that allows students, parents, and educators to easily look up National High School Exam scores. The application provides detailed score reports with data visualization to help users understand exam performance and trends.

## ✨ Features

- **Score Lookup**: Quick and easy search for National High School Exam scores
- **Data Visualization**: Interactive charts and graphs using Recharts
- **Comprehensive Reports**: Detailed score analysis and performance metrics
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Modern UI**: Clean and intuitive user interface with Radix UI components
- **Fast Performance**: Built with Vite for optimal development and build performance

## 🚀 Getting Started

### Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd gscore-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the environment example file:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your API configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```
   
   Replace `http://localhost:8000/api/v1` with your actual API base URL.

### Running the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the application.

### Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the production build**
   ```bash
   npm run preview
   ```

The built files will be in the `dist` directory, ready for deployment.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 📁 Project Structure

```
gscore-react/
├── src/
│   ├── api/          # API service functions
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── layout/       # Layout components
│   ├── lib/          # Utility functions
│   ├── pages/        # Page components
│   ├── types/        # TypeScript type definitions
│   └── assets/       # Static assets
├── public/           # Public static files
└── ...config files
```

## 🔧 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🌐 API Integration

This application connects to external APIs to fetch exam score data. Make sure your API endpoint is properly configured in the `.env` file:

- `VITE_API_BASE_URL`: The base URL for your exam score API

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing issues in the repository
2. Create a new issue with detailed information about the problem
3. Include steps to reproduce the issue and your environment details
