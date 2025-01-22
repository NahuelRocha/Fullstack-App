import { useState, useEffect, useCallback } from 'react';
import { imageService } from '../../services/api';
import { Upload, X, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const ImageManager = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await imageService.getAllImages();
      setImages(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const onDrop = useCallback(async acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result.split(',')[1];
          await imageService.uploadImage(base64String);
          fetchImages();
          setError(null);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError(err.message);
      } finally {
        setUploading(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    multiple: false,
  });

  const handleImageDelete = async () => {
    if (!selectedImage) return;

    try {
      setDeleteLoading(true);
      setModalError(null);
      await imageService.deleteImage(selectedImage.id);
      await fetchImages();
      setShowDeleteDialog(false);
      setSelectedImage(null);
    } catch (err) {
      setModalError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowDeleteDialog(false);
    setModalError(null);
    setSelectedImage(null);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-6 mt-1 md:mt-7">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl ml-3 font-bold text-gray-800">Gestor de Imágenes</h2>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center
          transition-colors duration-200 cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <Upload className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          {uploading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Subiendo imagen...</span>
            </div>
          ) : (
            <>
              <p className="text-lg font-medium">
                {isDragActive
                  ? 'Suelta la imagen aquí'
                  : 'Arrastra una imagen o haz clic para seleccionar'}
              </p>
              <p className="text-sm text-gray-500">PNG, JPG o GIF (max. 5MB)</p>
            </>
          )}
        </div>
      </div>

      {/* Error Alert for Upload */}
      {error && (
        <div className="flex items-center gap-2 p-4 text-red-700 bg-red-100 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}

      {/* Mobile Carousel View */}
      <div className="lg:hidden">
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : images.length > 0 ? (
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-square mb-4">
              <img
                src={images[currentImageIndex].url}
                alt={`Imagen ${currentImageIndex + 1}`}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <button
                onClick={e => {
                  e.stopPropagation();
                  setSelectedImage(images[currentImageIndex]);
                  setShowDeleteDialog(true);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>

            {/* Thumbnail Preview */}
            <div className="flex gap-2 overflow-x-auto pb-4 snap-x snap-mandatory">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`
                    flex-none w-20 h-20 rounded-lg overflow-hidden cursor-pointer
                    transition-all duration-200 mt-1 ml-1
                    ${
                      index === currentImageIndex
                        ? 'ring-2 ring-blue-500 ring-offset-2'
                        : 'opacity-60'
                    }
                  `}
                  onClick={() => setCurrentImageIndex(index)}
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
        ) : null}
      </div>

      {/* Desktop Grid View */}
      <div className="hidden lg:block">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="h-[calc(2*(100vw/4*0.9))] overflow-y-auto">
            <div className="grid grid-cols-4 gap-4 auto-rows-fr">
              {images.map(image => (
                <div
                  key={image.id}
                  className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-square"
                >
                  <img
                    src={image.url}
                    alt={`Imagen ${image.id}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={e => {
                          e.preventDefault();
                          setSelectedImage(image);
                          setShowDeleteDialog(true);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer.
            </p>

            {/* Modal Error Message */}
            {modalError && (
              <div className="mb-4 flex items-center gap-2 p-4 text-red-700 bg-red-100 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>{modalError}</p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleImageDelete}
                disabled={deleteLoading}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManager;
