import React, { useState } from 'react';

const TextInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestedText, setSuggestedText] = useState('');
  const suggestions = ['Option 1', 'Option 2', 'payment '];

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestedText('');
  };

  const renderSuggestions = () => {
    if (!suggestedText) {
      return null;
    }

    const filteredSuggestions = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().startsWith(suggestedText.toLowerCase())
    );

    if (filteredSuggestions.length === 0) {
      return null;
    }

    return (
      <ul>
        {filteredSuggestions.map((suggestion, index) => (
          <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setSuggestedText(inputValue)}
      />
      {renderSuggestions()}
    </div>
  );
};

export default TextInput;
