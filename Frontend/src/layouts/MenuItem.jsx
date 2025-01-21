import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MenuItem = ({ item }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (item.imageUrls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex =>
        prevIndex === item.imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [item.imageUrls]);

  const handleWhatsAppClick = () => {
    const phoneNumber = '5492235632600';
    const message = `Hola! Estoy interesado en: ${item.title}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const [showMore, setShowMore] = useState(false);

  const handleShowMoreClick = () => {
    setShowMore(true);
  };

  return (
    <div className="bg-white space-y-1 rounded-xl shadow-lg overflow-hidden flex flex-col h-[430px] md:mb-5">
      {/* Contenedor de imagen con proporción fija */}
      <div className="relative w-full aspect-[16/5] -mb-2">
        {item.imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`${item.title} - ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Contenido de texto */}
      <div className="p-4 grow flex-shrink">
        {/* Título y subtítulo */}
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
          <h4 className="text-md font-semibold text-gray-800">{item.subtitle}</h4>
        </div>

        {/* Descripción */}
        <p className="text-md mb-1 text-gray-600 leading-relaxed">{item.description}</p>

        {/* Lista de contenidos */}
        <ul className="space-y-0 grid grid-cols-2">
          {item.contentItems.slice(0, showMore ? undefined : 7).map((content, index) => (
            <li key={index} className="flex items-start">
              <span className="text-brightColor mr-2">•</span>
              <span className="text-gray-600">{content}</span>
            </li>
          ))}
        </ul>

        {!showMore && item.contentItems.length > 8 && (
          <button
            onClick={handleShowMoreClick}
            className="text-sm bg-brightColor text-white px-3 mt-2 ml-1 rounded-full hover:bg-opacity-90 transition-colors"
          >
            Ver más...
          </button>
        )}
      </div>

      {/* Precio y botón */}
      <div className="mt-auto p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-brightColor">${item.price}</div>
          <button
            onClick={handleWhatsAppClick}
            className="bg-brightColor text-white px-4 py-2 text-sm rounded-full hover:bg-opacity-90 transition-colors"
          >
            Me interesa
          </button>
        </div>
      </div>
    </div>
  );
};

MenuItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    contentItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
};

export default MenuItem;
