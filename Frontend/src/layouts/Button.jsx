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
      className="font-medium px-6 py-2 border-2  border-white text-white hover:bg-brightColor hover:text-white transition-all rounded-full"
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
