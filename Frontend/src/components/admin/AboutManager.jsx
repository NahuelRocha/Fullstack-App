import { useState, useEffect } from 'react';
import { aboutService } from '../../services/api';
import { AlertCircle, Check } from 'lucide-react';

const AboutManager = () => {
  const [aboutData, setAboutData] = useState({
    title: '',
    about: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      setIsLoading(true);
      const data = await aboutService.getAboutInfo();
      setAboutData({
        title: data.title,
        about: data.about,
      });
      setError('');
    } catch (err) {
      setError('Error al cargar la información del About');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await aboutService.updateAboutInfo(aboutData);
      setSuccess('Información actualizada exitosamente');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al actualizar la información');
      setSuccess('');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setAboutData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6 mt-1 md:mt-7">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl ml-4 md:ml-4 font-bold text-gray-800">
          Gestión de Información About
        </h2>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-red-700 bg-red-100 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 text-green-700 bg-green-100 rounded-lg">
          <Check className="w-5 h-5" />
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 ml-2">
        <div className="space-y-8">
          <div>
            <label htmlFor="title" className="block text-gray-700 text-md font-bold">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={aboutData.title}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 py-1 px-2"
              required
            />
          </div>

          <div>
            <label htmlFor="about" className="block text-gray-700 text-md font-bold">
              Contenido About
            </label>
            <textarea
              id="about"
              name="about"
              value={aboutData.about}
              onChange={handleChange}
              rows={6}
              className="mt-1 w-full rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 py-1 px-2"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 text-white bg-brightColor rounded-md hover:bg-opacity-90 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutManager;
