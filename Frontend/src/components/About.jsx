import img from '../assets/images/DE-LOGO.png';
import { useState, useEffect } from 'react';
import { aboutService } from '../services/api';

const About = () => {
  const [aboutInfo, setAboutInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const data = await aboutService.getAboutInfo();
        setAboutInfo(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching business info:', err);
      }
    };

    fetchBusinessInfo();
  }, []);

  if (error) {
    return (
      <div className="bg-black text-white p-4 text-center">
        <p className="text-red-400">Error loading business information</p>
      </div>
    );
  }

  if (!aboutInfo) {
    return (
      <div className="bg-black text-white p-4 text-center">
        <p>Loading business information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-center items-center lg:px-32 px-5">
      <img src={img} alt="img" className="mr-5" />

      <div className=" space-y-4 lg:pt-14">
        <h1 className=" font-semibold text-4xl text-center md:text-start">Por que elegirnos?</h1>
        <p>{aboutInfo.about}</p>
      </div>
    </div>
  );
};

export default About;
