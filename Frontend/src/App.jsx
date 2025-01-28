import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { publicRoutes, adminRoutes } from './routes/routes';
import { useAuth } from './hooks/useAuth';
import { PageTransition } from './components/PageTransition';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { PrivateRoute } from './components/PrivateRoute';
import { AuthProvider } from './context/AuthProvider';
import { LandingPage } from './components/LandingPage';
import SplashScreen from './components/SplashScreen';
import { useState } from 'react';
const AppContent = () => {
  const location = useLocation();
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const { isAuthenticated, logout, setIsAuthenticated } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleSplashEnd = () => {
    setIsSplashVisible(false); // Desactiva el Splash Screen cuando termine la animación
  };

  return (
    <div className="flex flex-col min-h-screen">
      {isSplashVisible && <SplashScreen onAnimationEnd={handleSplashEnd} />}
      {!isSplashVisible && (
        <>
          <ScrollToTop />
          <Navbar
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            onLogout={logout}
          />

          <div className="flex-grow relative">
            <AnimatePresence mode="wait" initial={false}>
              <Routes location={location} key={location.pathname}>
                {/* Landing Page */}
                <Route
                  path="/"
                  element={
                    <div className="relative">
                      <LandingPage />
                    </div>
                  }
                />

                {/* Landing Page Sections */}
                {['/home', '/menu', 'custom', '/about'].map(path => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <PageTransition>
                        <div className="min-h-screen">
                          <LandingPage />
                        </div>
                      </PageTransition>
                    }
                  />
                ))}

                {/* Public Routes */}
                {publicRoutes
                  .filter(route => route.path !== '/')
                  .map(({ path, element }) => (
                    <Route
                      key={path}
                      path={path}
                      element={
                        <PageTransition>
                          <div className="min-h-screen">{element}</div>
                        </PageTransition>
                      }
                    />
                  ))}

                {/* Admin Routes */}
                {adminRoutes.map(({ path, element, children }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <PrivateRoute>
                        <PageTransition>
                          <div className="min-h-screen">{element}</div>
                        </PageTransition>
                      </PrivateRoute>
                    }
                  >
                    {children?.map(({ path: childPath, element: childElement }) => (
                      <Route key={childPath} path={childPath} element={childElement} />
                    ))}
                  </Route>
                ))}

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </div>

          {!isAdminRoute && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Footer />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
