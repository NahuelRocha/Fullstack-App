import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuItem from '../layouts/MenuItem';
import { menuService } from '../services/api';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupedItems, setGroupedItems] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await menuService.getAllMenuItems();
        setMenuItems(data);

        const grouped = data.reduce((acc, item) => {
          const categoryKey = item.category.toLowerCase();
          const categoryDisplay = item.category.charAt(0).toUpperCase() + item.category.slice(1);

          if (!acc[categoryKey]) {
            acc[categoryKey] = {
              display: categoryDisplay,
              items: [],
            };
          }
          acc[categoryKey].items.push(item);
          return acc;
        }, {});

        setGroupedItems(grouped);

        if (Object.keys(grouped).length > 0) {
          setActiveCategory(Object.keys(grouped)[0]);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching menu items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleCategoryChange = newCategory => {
    setActiveCategory(newCategory);
  };

  // Variantes de animación para el contenedor de categorías
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Variantes de animación para los items del menú
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-b-2 border-brightColor"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex justify-center items-center"
      >
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pt-16 mb-5">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold text-center mt-2 mb-1"
        >
          Nuestro Menú
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center overflow-x-auto gap-4 py-3 mb-1 md:py-1 no-scrollbar"
        >
          {Object.entries(groupedItems).map(([key, { display }], index) => (
            <motion.button
              key={key}
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleCategoryChange(key)}
              className={`whitespace-nowrap px-6 py-1 rounded-full transition-all ${
                activeCategory === key
                  ? 'bg-brightColor text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {display}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={activeCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-semibold text-brightColor flex items-center"
              >
                <span className="mr-2">{groupedItems[activeCategory].display}</span>
                <div className="h-px bg-brightColor flex-grow opacity-20"></div>
              </motion.h2>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2"
                variants={containerVariants}
              >
                {groupedItems[activeCategory].items.map((item, index) => (
                  <motion.div key={item.id} variants={itemVariants} custom={index} layout>
                    <MenuItem item={item} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Menu;
