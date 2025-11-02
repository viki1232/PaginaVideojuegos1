import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Store from './components/Store';
import Community from './components/Community';
import About from './components/About';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Support from './components/Support';
import GameDetail from './components/GameDetail';
import Footer from './components/Footer';
import EmailVerification from './components/EmailVerification';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedGame, setSelectedGame] = useState(null);
  const [verificationToken, setVerificationToken] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/verify\/(.+)/);

    if (match) {
      const token = match[1];
      console.log('🔍 Token de verificación detectado:', token);
      setVerificationToken(token);
      setCurrentView('verify');
    }
  }, []);

  // ✅ ACTUALIZAR ESTA FUNCIÓN
  const handleNavigation = (view, data = null) => {
    console.log('🔍 Navigation:', view, 'Data:', data); // Para debuggear

    setCurrentView(view);
    setSelectedGame(null);

    // ✅ AGREGAR: Guardar el gameId cuando navegas desde Store
    if (view === 'game' && data !== null) {
      console.log('💾 Guardando gameId:', data);
      setSelectedGameId(data);
    }

    if (currentView === 'verify') {
      window.history.pushState({}, '', '/');
    }
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setCurrentView('gameDetail');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={handleNavigation} onGameSelect={handleGameSelect} />;
      case 'store':
        return <Store onNavigate={handleNavigation} onGameSelect={handleGameSelect} />;
      case 'discover':
        return <Store onNavigate={handleNavigation} onGameSelect={handleGameSelect} />;
      case 'community':
        return <Community onNavigate={handleNavigation} />;
      case 'about':
        return <About onNavigate={handleNavigation} />;
      case 'login':
        return <Login onNavigate={handleNavigation} />;
      case 'signup':
        return <SignUp onNavigate={handleNavigation} />;
      case 'profile':
        return <Profile onNavigate={handleNavigation} />;
      case 'support':
        return <Support onNavigate={handleNavigation} />;
      case 'verify':
        return <EmailVerification token={verificationToken} onNavigate={handleNavigation} />;
      case 'game':
        return <GameDetail gameId={selectedGameId} onNavigate={handleNavigation} />;
      case 'gameDetail':
        return selectedGame ? (
          <GameDetail game={selectedGame} onNavigate={handleNavigation} />
        ) : (
          <Home onNavigate={handleNavigation} onGameSelect={handleGameSelect} />
        );
      default:
        return <Home onNavigate={handleNavigation} onGameSelect={handleGameSelect} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-900">
        <Navbar onNavigate={handleNavigation} currentView={currentView} />
        <main>{renderView()}</main>
        <Footer onNavigate={handleNavigation} />
      </div>
    </AuthProvider>
  );
}

export default App;