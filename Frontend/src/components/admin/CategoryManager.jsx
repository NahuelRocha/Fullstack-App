import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Check } from 'lucide-react';
import { categoryService } from '../../services/api';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null); // ID de la categoría en edición
  const [editedCategoryName, setEditedCategoryName] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const newCategory = await categoryService.createCategory(newCategoryName);
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async id => {
    if (window.confirm('¿Está seguro de eliminar esta categoría?')) {
      try {
        await categoryService.deleteCategory(id);
        setCategories(categories.filter(cat => cat.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEdit = async id => {
    if (!editedCategoryName.trim()) return;

    try {
      const updatedCategory = await categoryService.updateCategory(id, editedCategoryName);
      setCategories(categories.map(cat => (cat.id === id ? updatedCategory : cat)));
      setEditingCategory(null); // Salir del modo de edición
      setEditedCategoryName('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6 p-2 mt-0 md:mt-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl ml-4 md:ml-2 font-bold">Gestión de Categorías</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          placeholder="Nueva categoría..."
          className="p-2 flex-1 rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-brightColor text-white rounded-lg hover:bg-opacity-90"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {categories.length === 0 ? (
        <p className="text-center text-2xl text-gray-500">No hay categorías creadas actualmente.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div
              key={category.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
            >
              {editingCategory === category.id ? (
                <input
                  type="text"
                  value={editedCategoryName}
                  onChange={e => setEditedCategoryName(e.target.value)}
                  placeholder="Editar nombre..."
                  className="p-2 flex-1 rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150"
                />
              ) : (
                <span className="font-semibold capitalize text-lg">{category.category}</span>
              )}

              <div className="flex gap-2">
                {editingCategory === category.id ? (
                  <button
                    onClick={() => handleEdit(category.id)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <Check className="w-6 h-6" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingCategory(category.id);
                      setEditedCategoryName(category.category); // Inicializamos el nombre editable
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
