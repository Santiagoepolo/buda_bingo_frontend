import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameLobby } from './components/GameLobby';
import { GameBoard } from './components/GameBoard';
import { RegisterForm } from './components/RegisterForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<GameLobby />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route 
            path="/game" 
            element={
              <ProtectedRoute>
                <GameBoard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;