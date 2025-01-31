import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { scroller } from 'react-scroll';
const Button = ({ title, scrollTarget, ...props }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (title.toLowerCase() === 'login') {
      navigate('/login');
    } else if (scrollTarget) {
      scroller.scrollTo(scrollTarget, {
        duration: 800,
        delay: 100,
        smooth: 'easeInOutQuart',
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-brightColor text-white px-6 py-1 text-md rounded-full hover:bg-opacity-90 transition-colors"
    >
      {title}
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  scrollTarget: PropTypes.string,
};

export default Button;
