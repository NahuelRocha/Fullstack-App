import { useState, useEffect } from 'react';

export const useSlider = (slides, interval = 3000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);

  useEffect(() => {
    if (!slides?.length) return;

    const slideInterval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
      setNextIndex(prevNext => (prevNext === slides.length - 1 ? 0 : prevNext + 1));
    }, interval);

    return () => clearInterval(slideInterval);
  }, [slides, interval]);

  return { currentIndex, nextIndex };
};
