'use client';

import React, { useState } from 'react';

interface IconItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  tags: string[];
}

interface IconLibraryProps {
  onIconSelect: (iconData: IconItem) => void;
}

const IconLibrary: React.FC<IconLibraryProps> = ({ onIconSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const iconCategories = [
    'all',
    'business',
    'communication',
    'design',
    'development',
    'education',
    'entertainment',
    'finance',
    'food',
    'health',
    'nature',
    'real-estate',
    'social',
    'technology',
    'transportation',
    'weather'
  ];

  const icons: IconItem[] = [
    // Business & Real Estate Icons
    { id: 'home', name: 'Home', category: 'real-estate', icon: '🏠', tags: ['house', 'home', 'property', 'real estate'] },
    { id: 'building', name: 'Building', category: 'real-estate', icon: '🏢', tags: ['building', 'office', 'apartment', 'condo'] },
    { id: 'house-with-garden', name: 'House with Garden', category: 'real-estate', icon: '🏡', tags: ['house', 'garden', 'family', 'home'] },
    { id: 'office-building', name: 'Office Building', category: 'business', icon: '🏢', tags: ['office', 'business', 'corporate', 'workplace'] },
    { id: 'factory', name: 'Factory', category: 'business', icon: '🏭', tags: ['factory', 'industry', 'manufacturing', 'production'] },
    { id: 'bank', name: 'Bank', category: 'finance', icon: '🏦', tags: ['bank', 'finance', 'money', 'savings'] },
    { id: 'shopping-cart', name: 'Shopping Cart', category: 'business', icon: '🛒', tags: ['shopping', 'cart', 'commerce', 'retail'] },
    { id: 'dollar-sign', name: 'Dollar Sign', category: 'finance', icon: '💲', tags: ['money', 'dollar', 'currency', 'finance'] },
    { id: 'chart-up', name: 'Chart Up', category: 'finance', icon: '📈', tags: ['chart', 'growth', 'analytics', 'statistics'] },
    { id: 'chart-down', name: 'Chart Down', category: 'finance', icon: '📉', tags: ['chart', 'decline', 'analytics', 'statistics'] },

    // Communication Icons
    { id: 'phone', name: 'Phone', category: 'communication', icon: '📞', tags: ['phone', 'call', 'contact', 'communication'] },
    { id: 'email', name: 'Email', category: 'communication', icon: '📧', tags: ['email', 'mail', 'message', 'communication'] },
    { id: 'speech-bubble', name: 'Speech Bubble', category: 'communication', icon: '💬', tags: ['speech', 'chat', 'message', 'communication'] },
    { id: 'loudspeaker', name: 'Loudspeaker', category: 'communication', icon: '📢', tags: ['loudspeaker', 'announcement', 'broadcast', 'sound'] },
    { id: 'megaphone', name: 'Megaphone', category: 'communication', icon: '📣', tags: ['megaphone', 'announcement', 'broadcast', 'marketing'] },

    // Design & Creative Icons
    { id: 'palette', name: 'Palette', category: 'design', icon: '🎨', tags: ['palette', 'art', 'design', 'creative', 'colors'] },
    { id: 'artist-palette', name: 'Artist Palette', category: 'design', icon: '🖌️', tags: ['palette', 'art', 'paint', 'creative'] },
    { id: 'crayon', name: 'Crayon', category: 'design', icon: '🖍️', tags: ['crayon', 'art', 'drawing', 'creative'] },
    { id: 'pencil', name: 'Pencil', category: 'design', icon: '✏️', tags: ['pencil', 'writing', 'drawing', 'design'] },
    { id: 'straight-ruler', name: 'Straight Ruler', category: 'design', icon: '📏', tags: ['ruler', 'measurement', 'design', 'straight'] },
    { id: 'triangular-ruler', name: 'Triangular Ruler', category: 'design', icon: '📐', tags: ['ruler', 'measurement', 'design', 'triangle'] },

    // Technology Icons
    { id: 'computer', name: 'Computer', category: 'technology', icon: '💻', tags: ['computer', 'laptop', 'technology', 'work'] },
    { id: 'laptop', name: 'Laptop', category: 'technology', icon: '💻', tags: ['laptop', 'computer', 'technology', 'portable'] },
    { id: 'mobile-phone', name: 'Mobile Phone', category: 'technology', icon: '📱', tags: ['mobile', 'phone', 'smartphone', 'technology'] },
    { id: 'desktop-computer', name: 'Desktop Computer', category: 'technology', icon: '🖥️', tags: ['desktop', 'computer', 'technology', 'workstation'] },
    { id: 'keyboard', name: 'Keyboard', category: 'technology', icon: '⌨️', tags: ['keyboard', 'typing', 'computer', 'input'] },
    { id: 'mouse', name: 'Mouse', category: 'technology', icon: '🖱️', tags: ['mouse', 'computer', 'input', 'pointer'] },
    { id: 'printer', name: 'Printer', category: 'technology', icon: '🖨️', tags: ['printer', 'print', 'office', 'technology'] },

    // Transportation Icons
    { id: 'car', name: 'Car', category: 'transportation', icon: '🚗', tags: ['car', 'vehicle', 'transportation', 'automobile'] },
    { id: 'taxi', name: 'Taxi', category: 'transportation', icon: '🚕', tags: ['taxi', 'car', 'transportation', 'ride'] },
    { id: 'bus', name: 'Bus', category: 'transportation', icon: '🚌', tags: ['bus', 'transportation', 'public', 'vehicle'] },
    { id: 'truck', name: 'Truck', category: 'transportation', icon: '🚚', tags: ['truck', 'delivery', 'transportation', 'vehicle'] },
    { id: 'bicycle', name: 'Bicycle', category: 'transportation', icon: '🚲', tags: ['bicycle', 'bike', 'transportation', 'eco'] },
    { id: 'motorcycle', name: 'Motorcycle', category: 'transportation', icon: '🏍️', tags: ['motorcycle', 'bike', 'transportation', 'vehicle'] },
    { id: 'airplane', name: 'Airplane', category: 'transportation', icon: '✈️', tags: ['airplane', 'flight', 'travel', 'transportation'] },
    { id: 'ship', name: 'Ship', category: 'transportation', icon: '🚢', tags: ['ship', 'boat', 'transportation', 'maritime'] },

    // Nature & Environment Icons
    { id: 'tree', name: 'Tree', category: 'nature', icon: '🌳', tags: ['tree', 'nature', 'environment', 'green'] },
    { id: 'deciduous-tree', name: 'Deciduous Tree', category: 'nature', icon: '🌳', tags: ['tree', 'nature', 'environment', 'forest'] },
    { id: 'evergreen-tree', name: 'Evergreen Tree', category: 'nature', icon: '🌲', tags: ['tree', 'evergreen', 'nature', 'pine'] },
    { id: 'palm-tree', name: 'Palm Tree', category: 'nature', icon: '🌴', tags: ['palm', 'tree', 'tropical', 'beach'] },
    { id: 'cactus', name: 'Cactus', category: 'nature', icon: '🌵', tags: ['cactus', 'desert', 'nature', 'plant'] },
    { id: 'flower', name: 'Flower', category: 'nature', icon: '🌸', tags: ['flower', 'nature', 'bloom', 'plant'] },
    { id: 'sunflower', name: 'Sunflower', category: 'nature', icon: '🌻', tags: ['sunflower', 'flower', 'nature', 'yellow'] },
    { id: 'rose', name: 'Rose', category: 'nature', icon: '🌹', tags: ['rose', 'flower', 'nature', 'romantic'] },
    { id: 'tulip', name: 'Tulip', category: 'nature', icon: '🌷', tags: ['tulip', 'flower', 'nature', 'spring'] },
    { id: 'four-leaf-clover', name: 'Four Leaf Clover', category: 'nature', icon: '🍀', tags: ['clover', 'luck', 'nature', 'leaf'] },

    // Food & Beverage Icons
    { id: 'hamburger', name: 'Hamburger', category: 'food', icon: '🍔', tags: ['hamburger', 'burger', 'food', 'fast food'] },
    { id: 'pizza', name: 'Pizza', category: 'food', icon: '🍕', tags: ['pizza', 'food', 'italian', 'cheese'] },
    { id: 'hot-dog', name: 'Hot Dog', category: 'food', icon: '🌭', tags: ['hot dog', 'food', 'sausage', 'fast food'] },
    { id: 'taco', name: 'Taco', category: 'food', icon: '🌮', tags: ['taco', 'food', 'mexican', 'wrap'] },
    { id: 'burrito', name: 'Burrito', category: 'food', icon: '🌯', tags: ['burrito', 'food', 'mexican', 'wrap'] },
    { id: 'coffee', name: 'Coffee', category: 'food', icon: '☕', tags: ['coffee', 'drink', 'beverage', 'hot'] },
    { id: 'tea', name: 'Tea', category: 'food', icon: '🍵', tags: ['tea', 'drink', 'beverage', 'hot'] },
    { id: 'beer', name: 'Beer', category: 'food', icon: '🍺', tags: ['beer', 'drink', 'alcohol', 'beverage'] },
    { id: 'wine', name: 'Wine', category: 'food', icon: '🍷', tags: ['wine', 'drink', 'alcohol', 'beverage'] },

    // Health & Medical Icons
    { id: 'hospital', name: 'Hospital', category: 'health', icon: '🏥', tags: ['hospital', 'medical', 'health', 'care'] },
    { id: 'doctor', name: 'Doctor', category: 'health', icon: '👨‍⚕️', tags: ['doctor', 'medical', 'health', 'professional'] },
    { id: 'nurse', name: 'Nurse', category: 'health', icon: '👩‍⚕️', tags: ['nurse', 'medical', 'health', 'care'] },
    { id: 'pill', name: 'Pill', category: 'health', icon: '💊', tags: ['pill', 'medicine', 'medical', 'health'] },
    { id: 'syringe', name: 'Syringe', category: 'health', icon: '💉', tags: ['syringe', 'injection', 'medical', 'health'] },
    { id: 'thermometer', name: 'Thermometer', category: 'health', icon: '🌡️', tags: ['thermometer', 'temperature', 'medical', 'health'] },
    { id: 'stethoscope', name: 'Stethoscope', category: 'health', icon: '🩺', tags: ['stethoscope', 'medical', 'health', 'doctor'] },

    // Education Icons
    { id: 'school', name: 'School', category: 'education', icon: '🏫', tags: ['school', 'education', 'learning', 'building'] },
    { id: 'university', name: 'University', category: 'education', icon: '🎓', tags: ['university', 'graduation', 'education', 'degree'] },
    { id: 'book', name: 'Book', category: 'education', icon: '📚', tags: ['book', 'books', 'education', 'reading'] },
    { id: 'notebook', name: 'Notebook', category: 'education', icon: '📓', tags: ['notebook', 'notes', 'education', 'writing'] },
    { id: 'pencil-case', name: 'Pencil Case', category: 'education', icon: '🖊️', tags: ['pencil', 'case', 'education', 'supplies'] },
    { id: 'microscope', name: 'Microscope', category: 'education', icon: '🔬', tags: ['microscope', 'science', 'education', 'laboratory'] },
    { id: 'telescope', name: 'Telescope', category: 'education', icon: '🔭', tags: ['telescope', 'astronomy', 'science', 'education'] },

    // Entertainment Icons
    { id: 'movie-camera', name: 'Movie Camera', category: 'entertainment', icon: '🎥', tags: ['camera', 'movie', 'film', 'entertainment'] },
    { id: 'clapper-board', name: 'Clapper Board', category: 'entertainment', icon: '🎬', tags: ['clapper', 'movie', 'film', 'entertainment'] },
    { id: 'popcorn', name: 'Popcorn', category: 'entertainment', icon: '🍿', tags: ['popcorn', 'movie', 'entertainment', 'snack'] },
    { id: 'musical-note', name: 'Musical Note', category: 'entertainment', icon: '🎵', tags: ['music', 'note', 'entertainment', 'sound'] },
    { id: 'musical-notes', name: 'Musical Notes', category: 'entertainment', icon: '🎶', tags: ['music', 'notes', 'entertainment', 'melody'] },
    { id: 'microphone', name: 'Microphone', category: 'entertainment', icon: '🎤', tags: ['microphone', 'music', 'singing', 'entertainment'] },
    { id: 'headphones', name: 'Headphones', category: 'entertainment', icon: '🎧', tags: ['headphones', 'music', 'audio', 'entertainment'] },
    { id: 'guitar', name: 'Guitar', category: 'entertainment', icon: '🎸', tags: ['guitar', 'music', 'instrument', 'entertainment'] },
    { id: 'piano', name: 'Piano', category: 'entertainment', icon: '🎹', tags: ['piano', 'music', 'instrument', 'entertainment'] },

    // Social & People Icons
    { id: 'person', name: 'Person', category: 'social', icon: '👤', tags: ['person', 'user', 'individual', 'people'] },
    { id: 'man', name: 'Man', category: 'social', icon: '👨', tags: ['man', 'person', 'male', 'people'] },
    { id: 'woman', name: 'Woman', category: 'social', icon: '👩', tags: ['woman', 'person', 'female', 'people'] },
    { id: 'family', name: 'Family', category: 'social', icon: '👨‍👩‍👧‍👦', tags: ['family', 'people', 'group', 'parents'] },
    { id: 'couple', name: 'Couple', category: 'social', icon: '👫', tags: ['couple', 'people', 'relationship', 'pair'] },
    { id: 'handshake', name: 'Handshake', category: 'social', icon: '🤝', tags: ['handshake', 'agreement', 'deal', 'partnership'] },
    { id: 'thumbs-up', name: 'Thumbs Up', category: 'social', icon: '👍', tags: ['thumbs up', 'like', 'approval', 'positive'] },
    { id: 'thumbs-down', name: 'Thumbs Down', category: 'social', icon: '👎', tags: ['thumbs down', 'dislike', 'negative', ' disapproval'] },

    // Weather Icons
    { id: 'sun', name: 'Sun', category: 'weather', icon: '☀️', tags: ['sun', 'weather', 'bright', 'day'] },
    { id: 'cloud', name: 'Cloud', category: 'weather', icon: '☁️', tags: ['cloud', 'weather', 'overcast', 'sky'] },
    { id: 'rain-cloud', name: 'Rain Cloud', category: 'weather', icon: '🌧️', tags: ['rain', 'cloud', 'weather', 'precipitation'] },
    { id: 'lightning', name: 'Lightning', category: 'weather', icon: '⚡', tags: ['lightning', 'storm', 'weather', 'electric'] },
    { id: 'snowflake', name: 'Snowflake', category: 'weather', icon: '❄️', tags: ['snow', 'winter', 'weather', 'cold'] },
    { id: 'rainbow', name: 'Rainbow', category: 'weather', icon: '🌈', tags: ['rainbow', 'weather', 'colorful', 'hope'] },
    { id: 'umbrella', name: 'Umbrella', category: 'weather', icon: '☂️', tags: ['umbrella', 'rain', 'weather', 'protection'] },

    // Additional Shapes and Symbols
    { id: 'heart', name: 'Heart', category: 'design', icon: '❤️', tags: ['heart', 'love', 'shape', 'symbol'] },
    { id: 'star', name: 'Star', category: 'design', icon: '⭐', tags: ['star', 'shape', 'rating', 'favorite'] },
    { id: 'diamond', name: 'Diamond', category: 'design', icon: '💎', tags: ['diamond', 'gem', 'luxury', 'shape'] },
    { id: 'gem', name: 'Gem', category: 'design', icon: '💎', tags: ['gem', 'diamond', 'luxury', 'precious'] },
    { id: 'crown', name: 'Crown', category: 'design', icon: '👑', tags: ['crown', 'royal', 'luxury', 'king'] },
    { id: 'trophy', name: 'Trophy', category: 'design', icon: '🏆', tags: ['trophy', 'award', 'winner', 'achievement'] },
    { id: 'medal', name: 'Medal', category: 'design', icon: '🏅', tags: ['medal', 'award', 'achievement', 'winner'] },
    { id: 'ribbon', name: 'Ribbon', category: 'design', icon: '🎀', tags: ['ribbon', 'bow', 'decoration', 'gift'] },
    { id: 'gift', name: 'Gift', category: 'design', icon: '🎁', tags: ['gift', 'present', 'box', 'surprise'] },
    { id: 'balloon', name: 'Balloon', category: 'design', icon: '🎈', tags: ['balloon', 'party', 'celebration', 'colorful'] },
    { id: 'party-popper', name: 'Party Popper', category: 'design', icon: '🎉', tags: ['party', 'celebration', 'confetti', 'popper'] },
    { id: 'fireworks', name: 'Fireworks', category: 'design', icon: '🎆', tags: ['fireworks', 'celebration', 'party', 'explosion'] }
  ];

  const filteredIcons = icons.filter(icon => {
    const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
    const matchesSearch = searchTerm === '' ||
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleIconClick = (icon: IconItem) => {
    onIconSelect(icon);
  };

  return (
    <div className="icon-library bg-white border rounded-lg p-4 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span className="mr-2">🎨</span>
          Icon Library
        </h3>

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1 mb-3">
          {iconCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Icons Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-4 gap-2">
          {filteredIcons.map((icon) => (
            <button
              key={icon.id}
              onClick={() => handleIconClick(icon)}
              className="aspect-square bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg flex items-center justify-center text-2xl transition-all duration-200 hover:scale-105 group"
              title={icon.name}
            >
              <span className="group-hover:scale-110 transition-transform duration-200">
                {icon.icon}
              </span>
            </button>
          ))}
        </div>

        {filteredIcons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-sm">No icons found matching your search</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {filteredIcons.length} icons available
        </p>
      </div>
    </div>
  );
};

export default IconLibrary;