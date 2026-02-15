import React from 'react';
import Select from 'react-select'

const RedexSelector = ({ data,setSelectArea }) => {
  const handleSelectChange = (selectedOption) => {
    setSelectArea(selectedOption);
  
  };

  return (
    <>
      <Select options={data} onChange={handleSelectChange} />
    </>
  );
};

export default RedexSelector;