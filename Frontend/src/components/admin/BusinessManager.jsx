import { useState, useEffect } from 'react';
import { businessService } from '../../services/api';
import { Save } from 'lucide-react';

const BusinessManager = () => {
  const [businessInfo, setBusinessInfo] = useState({
    welcome: '',
    about: '',
    address: '',
    phone: '',
    email: '',
    facebook: '',
    instagram: '',
    businessDays: '',
    businessHours: '',
    deliveryHours: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [dirtyFields, setDirtyFields] = useState({});

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    try {
      setIsLoading(true);
      const data = await businessService.getBusinessInfo();
      setBusinessInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value,
    }));
    setDirtyFields(prev => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const updates = {};
      Object.keys(dirtyFields).forEach(field => {
        if (dirtyFields[field]) {
          updates[field] = businessInfo[field];
        }
      });

      if (Object.keys(updates).length === 0) {
        setSuccessMessage('No hay cambios para guardar');
        return;
      }

      await businessService.updateBusinessInfo(updates);
      setSuccessMessage('Información actualizada exitosamente');
      setDirtyFields({});
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (label, field, type = 'text', isTextarea = false) => (
    <div className="space-y-2">
      <label className="block text-gray-700 text-md font-bold">{label}</label>
      {isTextarea ? (
        <textarea
          value={businessInfo[field] || ''}
          onChange={e => handleInputChange(field, e.target.value)}
          className={`w-full py-1 px-2 rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 ${
            dirtyFields[field] ? 'border-brightColor' : 'border-gray-300'
          }`}
          rows={4}
        />
      ) : (
        <input
          type={type}
          value={businessInfo[field] || ''}
          onChange={e => handleInputChange(field, e.target.value)}
          className={`w-full py-1 px-2 rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 ${
            dirtyFields[field] ? 'border-brightColor' : 'border-gray-300'
          }`}
        />
      )}
    </div>
  );

  if (isLoading && Object.values(businessInfo).every(v => !v)) {
    return <div className="text-center py-4">Cargando información...</div>;
  }

  return (
    <div className="space-y-6 p-2 mt-0 md:mt-5">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl ml-2 md:ml-2 font-bold text-gray-800">
          Información del Negocio
        </h1>
        <button
          onClick={handleSubmit}
          disabled={isLoading || Object.keys(dirtyFields).length === 0}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-brightColor text-white rounded-lg hover:bg-brightColor/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5 mr-2" />
          Guardar Cambios
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>}

      {successMessage && (
        <div className="bg-green-50 text-green-500 p-4 rounded-lg">{successMessage}</div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6 md:col-span-2">
            {renderInput('Mensaje de Bienvenida', 'welcome')}
            {renderInput('Sobre Nosotros', 'about', 'text', true)}
          </div>

          {renderInput('Dirección', 'address')}
          {renderInput('Teléfono', 'phone', 'tel')}
          {renderInput('Email', 'email', 'email')}
          {renderInput('Facebook', 'facebook', 'url')}
          {renderInput('Instagram', 'instagram', 'url')}
          {renderInput('Días de Atención', 'businessDays')}
          {renderInput('Horario de Atención', 'businessHours')}
          {renderInput('Horario de Delivery', 'deliveryHours')}
        </div>
      </form>
    </div>
  );
};

export default BusinessManager;
