import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Crown, Sparkles, Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;

    setLoading(true);
    try {
      await login(formData.username, formData.password);
      navigate('/home');
    } catch (err) {
      // Error handling is done in AuthContext with toast
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-md bg-blue-600 rounded-2xl shadow-[0_0_50px_rgba(0,0,255,0.3)] overflow-hidden">
        <div className="pt-8 px-6 flex flex-col items-center">
          <div className="bg-yellow-400 rounded-full p-2 mb-4 animate-bounce-slow">
            <Crown className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
            BINGO
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            BINGO
          </h1>
          <p className="text-blue-100 text-lg">Gran Buda</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-8">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Usuario"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full h-12 px-4 bg-white/90 border-2 border-blue-400 rounded-md text-lg 
                       placeholder:text-gray-500 focus:outline-none focus:border-blue-300 
                       focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full h-12 px-4 bg-white/90 border-2 border-blue-400 rounded-md text-lg 
                       placeholder:text-gray-500 focus:outline-none focus:border-blue-300 
                       focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white text-xl font-bold 
                       rounded-md transition-all duration-300 transform hover:scale-[1.02] 
                       disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Cargando...</span>
                </div>
              ) : (
                'INGRESAR'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <span className="text-blue-100">¿Nuevo jugador? </span>
            <button 
              onClick={() => navigate('/register')}
              className="text-yellow-300 hover:text-yellow-200 font-medium transition-colors"
            >
              Regístrate aquí
            </button>
          </div>
        </form>

        <div className="h-8 bg-blue-700 flex">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex-1 border-r-2 border-blue-600 last:border-r-0 bg-gradient-to-b from-blue-600 to-blue-700"
            />
          ))}
        </div>
      </div>
    </div>
  );
};