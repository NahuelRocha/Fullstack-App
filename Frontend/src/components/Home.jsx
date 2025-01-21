import { useState, useEffect } from 'react';
import Button from '../layouts/Button';
import { bannerService } from '../services/api';
import { useSlider } from '../hooks/useSlider';

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
      <div className="min-h-screen flex items-center justify-center">
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
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!bannerData.slides.length) {
    return <div className="min-h-screen flex items-center justify-center">No images available</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Images Container */}
      <div className="absolute inset-0 z-0">
        {[currentIndex, nextIndex].map(index => (
          <div
            key={index}
            className={`absolute inset-0 bg-center bg-no-repeat bg-cover transition-opacity duration-1000
              ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `url(${bannerData.slides[index]?.url})`,
              filter: 'brightness(1)',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 lg:px-32">
        <div className="w-full max-w-2xl space-y-5 text-center">
          <div className="p-6 rounded-lg bg-black/40 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <h1 className="text-white font-semibold text-4xl md:text-4xl lg:text-6xl mb-4 drop-shadow-lg">
                {bannerData.title}
              </h1>
              <p className="text-white font-medium text-lg md:text-xl lg:text-xl mb-6 drop-shadow-md w-full">
                {bannerData.description}
              </p>
              <div className="mt-1">
                <Button
                  title="Haz tu pedido"
                  className="transform transition-transform duration-300"
                  scrollTarget="menu"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {bannerData.slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToNextSlide(index)}
            className={`h-1 transition-all duration-300 rounded-full
              ${index === currentIndex ? 'w-8 bg-white' : 'w-4 bg-white/50 hover:bg-white/70'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
