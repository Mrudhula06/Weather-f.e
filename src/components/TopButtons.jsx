import React from 'react';

const cities = [
  { id: 1, name: 'Chennai' },
  { id: 2, name: 'Bengaluru' },
  { id: 3, name: 'Palakkad' },
  { id: 4, name: 'Delhi' },
  { id: 5, name: 'Mumbai' }
];

const TopButtons = ({ onButtonClick }) => {
  const handleClick = (cityName) => {
    onButtonClick(cityName); // Trigger background change
  };

  return (
    <div className='flex items-center justify-around my-6'>
      {cities.map(city => (
        <button
          key={city.id}
          className='text-lg font-medium hover:bg-gray-700/20 px-3 py-2 rounded-md transition ease-in'
          onClick={() => handleClick(city.name)}
        >
          {city.name}
        </button>
      ))}
    </div>
  );
};

export default TopButtons;
