import Home from './Home';
import Menu from './Menu';
import About from './About';
import CustomServiceBuilder from './CustomServiceBuilder';
import { useLocation } from 'react-router-dom';

export const LandingPage = () => {
  const location = useLocation();

  // Si estamos en la ruta raíz, mostramos todo
  if (location.pathname === '/') {
    return (
      <div>
        <section id="home">
          <Home />
        </section>
        <section id="menu">
          <Menu />
        </section>
        <section id="custom">
          <CustomServiceBuilder />
        </section>
        <section id="about">
          <About />
        </section>
      </div>
    );
  }

  // Para rutas específicas, mostramos solo el componente correspondiente
  switch (location.pathname) {
    case '/home':
      return <Home />;
    case '/menu':
      return <Menu />;
    case '/custom':
      return <CustomServiceBuilder />;
    case '/about':
      return <About />;
    default:
      return null;
  }
};
