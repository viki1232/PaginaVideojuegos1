import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext'; // ✅ AGREGAR
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
  const { user } = useAuth(); // ✅ AGREGAR esta línea
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

  const addToLibrary = async (game) => {
    if (!user) {
      alert('Debes iniciar sesión para agregar juegos');
      handleNavigation('login');
      return;
    }

    try {
      const response = await fetch('http://localhost:2000/api/perfil/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          game_id: game.id,
          user_id: user.id,
          username: user.username,
          game_title: game.title,
          game_price: game.price,
          game_image: game.image_url
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Juego agregado a tu biblioteca!');
        // ✅ Opcional: redirigir al perfil
        handleNavigation('profile');
      } else {
        alert(data.error || 'Error al agregar juego');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    }
  };

  const handleNavigation = (view, data = null) => {
    console.log('🔍 Navigation:', view, 'Data:', data);
    setCurrentView(view);
    setSelectedGame(null);

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
        return <Store onNavigate={handleNavigation} onGameSelect={handleGameSelect} onAddToLibrary={addToLibrary} />; // ✅ Agregar si quieres botón en Store
      case 'discover':
        return <Store onNavigate={handleNavigation} onGameSelect={handleGameSelect} onAddToLibrary={addToLibrary} />; // ✅ Agregar si quieres botón en Store
      case 'community':
        return <Community onNavigate={handleNavigation} />;
      case 'about':
        return <About onNavigate={handleNavigation} />;
      case 'login':
        return <Login onNavigate={handleNavigation} />;
      case 'signup':
        return <SignUp onNavigate={handleNavigation} />;
      case 'profile':
        return <Profile key={Date.now()} onNavigate={handleNavigation} />; // ✅ key única para forzar recarga
      case 'support':
        return <Support onNavigate={handleNavigation} />;
      case 'verify':
        return <EmailVerification token={verificationToken} onNavigate={handleNavigation} />;
      case 'game':
        return <GameDetail gameId={selectedGameId} onNavigate={handleNavigation} onAddToLibrary={addToLibrary} />; // ✅ AGREGAR onAddToLibrary
      case 'gameDetail':
        return selectedGame ? (
          <GameDetail game={selectedGame} onNavigate={handleNavigation} onAddToLibrary={addToLibrary} /> // ✅ AGREGAR onAddToLibrary
        ) : (
          <Home onNavigate={handleNavigation} onGameSelect={handleGameSelect} />
        );
      default:
        return <Home onNavigate={handleNavigation} onGameSelect={handleGameSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar onNavigate={handleNavigation} currentView={currentView} />
      <main>{renderView()}</main>
      <Footer onNavigate={handleNavigation} />
    </div>
  );
}

export default App;