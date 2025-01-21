import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ onAnimationEnd }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Duración del splash screen
    const timer = setTimeout(() => {
      setIsVisible(false); // Muestra el mensaje de "Bienvenido" después de la animación
      onAnimationEnd(); // Llama a esta función cuando termine la animación
    }, 4000); // Mantener visible por 4 segundos

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <motion.div
      className={`absolute inset-0 flex justify-center items-center flex-col z-50`}
      style={{
        background: 'linear-gradient(135deg, #de7e80 0%, #ffffff 100%)', // Gradiente de fondo entre #de7e80 y blanco
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }} // Mantener la opacidad alta
      transition={{ duration: 4 }} // Duración de la animación de fondo
    >
      {/* Logo */}
      <motion.img
        src="/DE-LOGO.png" // Asegúrate de tener este logo en la carpeta public
        alt="Logo de Daniela Eventos"
        className="w-64 h-auto"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }} // Animación de escala más lenta para que el logo crezca
        transition={{ duration: 2 }} // Duración de 2 segundos para el logo
      />

      {/* Slogan */}
      <motion.h1
        className="mt-6 text-white text-3xl font-light font-fira-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }} // Hace que el eslogan sea visible
        transition={{ duration: 2, delay: 1 }} // Retraso para que el eslogan aparezca después del logo
      >
        Bienvenido!
      </motion.h1>

      {/* Indicador de Carga */}
      <motion.div
        className="mt-4 w-8 h-8 border-4 border-t-[#ffffff] border-solid rounded-full animate-spin"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }} // Indicador fijo durante la animación
        transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }} // Ciclo infinito de la animación
      />
    </motion.div>
  );
};

export default SplashScreen;
