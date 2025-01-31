import { useState, useEffect } from 'react';
import Button from '../layouts/Button';
import { bannerService } from '../services/api';
import { useSlider } from '../hooks/useSlider';
import Logo from '../assets/images/TEST.png';

const Home = () => {
  const [bannerData, setBannerData] = useState({
    slides: [],
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentIndex, nextIndex, goToNextSlide } = useSlider(bannerData.slides);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setIsLoading(true);
        const data = await bannerService.getBannerImages();
        setBannerData({
          slides: data.images,
          title: data.title,
          description: data.description,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(goToNextSlide, 5000);
    return () => clearInterval(intervalId);
  }, [goToNextSlide]);

  if (isLoading) {
    return (
      <div className="min-h-screen mt-20 flex items-center justify-center">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-600"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mt-20 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!bannerData.slides.length) {
    return (
      <div className="min-h-screen mt-20 flex items-center justify-center">No images available</div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Contenedor principal que ocupa toda la altura disponible después del navbar */}
      <div className="h-[calc(100vh-6rem)] pt-32 md:pt-32 px-0">
        {/* Contenedor flex para centrar todo */}
        <div className="h-full flex items-center justify-center px-4 md:px-10">
          {/* Grid de dos columnas perfectamente simétricas */}
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {/* Columna izquierda - Logo y contenido */}
            <div className="flex flex-col items-center justify-center space-y-2 md:space-y-1 px-2 md:px-10 mr-0 md:-mr-10 -mt-6">
              {/* Logo container */}
              <div className="w-36 h-36 md:w-44 md:h-44 -mb-5 md:-mb-4">
                <img
                  src={Logo}
                  alt="Daniela Eventos Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Contenido centrado */}
              <div className="text-center max-w-lg space-y-1 md:space-y-2">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800">{bannerData.title}</h1>
                <p className="text-md md:text-lg text-gray-800 leading-relaxed">
                  {bannerData.description}
                </p>
                <div className="pt-1">
                  <Button title="Haz tu pedido" className="" scrollTarget="menu" />
                </div>
              </div>
            </div>

            {/* Columna derecha - Slider */}
            <div className="flex items-center justify-center py-4 -mt-4 px-4 md:mt-0 mr-0 md:mr-6">
              {/* Contenedor del slider con efecto de sombra y espacio */}
              <div className="w-full max-w-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)] ml-0 md:-ml-10 p-4 bg-white/10 backdrop-blur-sm">
                {' '}
                {/* Efecto de sombra y espacio */}
                {/* Contenedor interno del slider */}
                <div className="relative aspect-[6/7] md:aspect-[18/11] w-full overflow-hidden">
                  {/* Slides con transición suave */}
                  {[currentIndex, nextIndex].map((index, i) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-1000 ease-in-out
            ${i === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`} // Transición suave sin colores
                    >
                      <img
                        src={bannerData.slides[index]?.url}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {/* Dots Navigation */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {bannerData.slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToNextSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300
              ${
                index === currentIndex
                  ? 'bg-customColor/80 scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
