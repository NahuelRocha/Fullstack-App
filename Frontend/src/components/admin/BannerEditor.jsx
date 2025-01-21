import { useState, useEffect } from 'react';
import { bannerService, adminBannerService, imageService } from '../../services/api';

const BannerEditor = () => {
  const MAX_IMAGES = 5; // Número máximo de imágenes permitido
  const [bannerData, setBannerData] = useState({
    title: '',
    description: '',
    images: [],
  });
  const [availableImages, setAvailableImages] = useState([]);
  const [error, setError] = useState(null);

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
    try {
      await adminBannerService.updateBannerData(bannerData.title, bannerData.description);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddImage = async imageUrl => {
    if (bannerData.images.length >= MAX_IMAGES) return; // Evita superar el límite
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
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-2 mt-0 md:mt-5">
      <h1 className="text-3xl font-bold ml-4 md:ml-2 mb-5">Editor de Banner</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleUpdateData} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-md font-bold mb-1">Título</label>
          <input
            type="text"
            value={bannerData.title}
            onChange={e => setBannerData({ ...bannerData, title: e.target.value })}
            className=" w-full py-1 px-2 rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 "
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
          className="bg-customColor hover:bg-customColor/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Actualizar Datos
        </button>
      </form>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Imágenes Actuales del Banner</h2>
        <p className="text-sm text-gray-600 mb-2">
          Puedes añadir hasta un máximo de {MAX_IMAGES} imágenes. ({bannerData.images.length}/
          {MAX_IMAGES})
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Imágenes Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableImages
            .filter(image => !bannerData.images.includes(image.url)) // Evita duplicados en el banner
            .map(image => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={`Available ${image.id}`}
                  className="w-full h-48 object-cover rounded"
                />
                <button
                  onClick={() => handleAddImage(image.url)} // Cambia a `image.url`
                  disabled={bannerData.images.length >= MAX_IMAGES}
                  className={`absolute top-2 right-2 p-2 rounded-full ${
                    bannerData.images.length >= MAX_IMAGES
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-700 text-white'
                  } opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  Añadir
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BannerEditor;
