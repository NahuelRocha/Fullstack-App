import { useState, useEffect } from 'react';
import { bannerService, adminBannerService, imageService } from '../../services/api';
import { ChevronLeft, ChevronRight, Plus, X, CheckCircle, Loader } from 'lucide-react';

const BannerEditor = () => {
  const MAX_IMAGES = 5;
  const [bannerData, setBannerData] = useState({
    title: '',
    description: '',
    images: [],
  });
  const [availableImages, setAvailableImages] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentAvailableIndex, setCurrentAvailableIndex] = useState(0);

  const fetchData = async () => {
    try {
      const [bannerResponse, imagesResponse] = await Promise.all([
        bannerService.getBannerImages(),
        imageService.getAllImages(),
      ]);

      setBannerData({
        title: bannerResponse.title,
        description: bannerResponse.description,
        images: bannerResponse.images.map(img => img.url),
      });
      setAvailableImages(imagesResponse);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateData = async e => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setError(null);
    try {
      await adminBannerService.updateBannerData(bannerData.title, bannerData.description);
      fetchData();
      setSuccessMessage('Datos actualizados exitosamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = async imageUrl => {
    if (bannerData.images.length >= MAX_IMAGES) return;
    try {
      await adminBannerService.addBannerImage(imageUrl);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveImage = async imageUrl => {
    try {
      await adminBannerService.removeBannerImage(imageUrl);

      setBannerData(prevState => {
        const updatedImages = prevState.images.filter(img => img !== imageUrl);
        const newIndex = Math.max(0, Math.min(currentBannerIndex, updatedImages.length - 1));

        setCurrentBannerIndex(newIndex); // Ajusta el índice para evitar referencias inválidas
        return { ...prevState, images: updatedImages };
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePrevBanner = () => {
    setCurrentBannerIndex(prev => (prev > 0 ? prev - 1 : bannerData.images.length - 1));
  };

  const handleNextBanner = () => {
    setCurrentBannerIndex(prev => (prev < bannerData.images.length - 1 ? prev + 1 : 0));
  };

  const handlePrevAvailable = () => {
    const filteredImages = availableImages.filter(image => !bannerData.images.includes(image.url));
    setCurrentAvailableIndex(prev => (prev > 0 ? prev - 1 : filteredImages.length - 1));
  };

  const handleNextAvailable = () => {
    const filteredImages = availableImages.filter(image => !bannerData.images.includes(image.url));
    setCurrentAvailableIndex(prev => (prev < filteredImages.length - 1 ? prev + 1 : 0));
  };

  const filteredAvailableImages = availableImages.filter(
    image => !bannerData.images.includes(image.url)
  );

  return (
    <div className="container mx-auto p-2 mt-0 md:mt-5">
      <h1 className="text-3xl font-bold ml-4 md:ml-2 mb-5">Editor de Banner</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded flex items-center">
          <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
          <p>{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleUpdateData} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-md font-bold mb-1">Título</label>
          <input
            type="text"
            value={bannerData.title}
            onChange={e => setBannerData({ ...bannerData, title: e.target.value })}
            className="w-full py-1 px-2 rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-md font-bold mb-1">Descripción</label>
          <textarea
            value={bannerData.description}
            onChange={e => setBannerData({ ...bannerData, description: e.target.value })}
            className="w-full py-1 px-2 rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 h-32"
          />
        </div>

        <button
          type="submit"
          className={`flex items-center justify-center bg-customColor hover:bg-customColor/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isLoading ? 'cursor-not-allowed opacity-70' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading && <Loader className="w-5 h-5 mr-2 animate-spin" />}
          Actualizar Datos
        </button>
      </form>

      {/* Imágenes del Banner */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Imágenes Actuales del Banner</h2>
        <p className="text-sm text-gray-600 mb-2">
          Puedes añadir hasta un máximo de {MAX_IMAGES} imágenes. ({bannerData.images.length}/
          {MAX_IMAGES})
        </p>

        {/* Vista móvil del banner */}
        <div className="lg:hidden">
          {bannerData.images.length > 0 && (
            <div className="relative mb-4">
              {/* Imagen principal */}
              <div className="relative aspect-video mb-4">
                <img
                  src={bannerData.images[currentBannerIndex]}
                  alt={`Banner ${currentBannerIndex + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
                <button
                  onClick={() => handleRemoveImage(bannerData.images[currentBannerIndex])}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Botones de navegación */}
              <button
                onClick={handlePrevBanner}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={handleNextBanner}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>

              {/* Miniaturas */}
              <div className="flex gap-2 overflow-x-auto pb-4 snap-x snap-mandatory">
                {bannerData.images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`
                      flex-none w-20 h-14 rounded-lg overflow-hidden cursor-pointer
                      transition-all duration-200 mt-1 ml-1
                      ${
                        index === currentBannerIndex
                          ? 'ring-2 ring-blue-500 ring-offset-2'
                          : 'opacity-60'
                      }
                    `}
                    onClick={() => setCurrentBannerIndex(index)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vista desktop del banner */}
        <div className="hidden lg:grid grid-cols-4 gap-4">
          {bannerData.images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Banner ${index + 1}`}
                className="w-full h-48 object-cover rounded"
              />
              <button
                onClick={() => handleRemoveImage(imageUrl)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Imágenes Disponibles */}
      <div>
        <h2 className="text-xl font-bold mb-4">Imágenes Disponibles</h2>

        {/* Vista móvil de imágenes disponibles */}
        <div className="lg:hidden">
          {filteredAvailableImages.length > 0 && (
            <div className="relative mb-4">
              {/* Imagen principal */}
              <div className="relative aspect-video mb-4">
                <img
                  src={filteredAvailableImages[currentAvailableIndex].url}
                  alt={`Available ${currentAvailableIndex + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
                <button
                  onClick={() => handleAddImage(filteredAvailableImages[currentAvailableIndex].url)}
                  disabled={bannerData.images.length >= MAX_IMAGES}
                  className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                    bannerData.images.length >= MAX_IMAGES
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Botones de navegación */}
              <button
                onClick={handlePrevAvailable}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={handleNextAvailable}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>

              {/* Miniaturas */}
              <div className="flex gap-2 overflow-x-auto pb-4 snap-x snap-mandatory">
                {filteredAvailableImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`
                      flex-none w-20 h-14 rounded-lg overflow-hidden cursor-pointer
                      transition-all duration-200 mt-1 ml-1
                      ${
                        index === currentAvailableIndex
                          ? 'ring-2 ring-blue-500 ring-offset-2'
                          : 'opacity-60'
                      }
                    `}
                    onClick={() => setCurrentAvailableIndex(index)}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vista desktop de imágenes disponibles */}
        <div className="hidden lg:grid grid-cols-4 gap-4">
          {filteredAvailableImages.map(image => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={`Available ${image.id}`}
                className="w-full h-48 object-cover rounded"
              />
              <button
                onClick={() => handleAddImage(image.url)}
                disabled={bannerData.images.length >= MAX_IMAGES}
                className={`absolute top-2 right-2 p-2 rounded-full ${
                  bannerData.images.length >= MAX_IMAGES
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-700 text-white'
                } opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerEditor;
