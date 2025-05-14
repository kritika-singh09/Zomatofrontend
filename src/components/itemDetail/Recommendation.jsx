import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaFilter } from 'react-icons/fa';
import { BiSolidLeaf } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa';

const Recommendation = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Recommended');
  const [expandedAccordion, setExpandedAccordion] = useState('Popular');
  const [activeQuickFilter, setActiveQuickFilter] = useState(null);
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Sample filter options
  const filterOptions = ['Recommended', 'Rating', 'Price: Low to High', 'Price: High to Low', 'Delivery Time'];
  
  // Sample quick filter chips
  const quickFilters = ['Veg Only', 'Non-Veg', 'Less than ₹200', 'Bestseller'];
  
  // Sample categories and items
  const originalCategories = [
    {
      name: 'Popular',
      items: [
        { id: 1, name: 'Chicken Biryani', price: 250, rating: 4.5, veg: false, image: 'https://via.placeholder.com/80' },
        { id: 2, name: 'Paneer Butter Masala', price: 180, rating: 4.3, veg: true, image: 'https://via.placeholder.com/80' },
        { id: 3, name: 'Butter Naan', price: 40, rating: 4.2, veg: true, image: 'https://via.placeholder.com/80' },
      ]
    },
    {
      name: 'Starters',
      items: [
        { id: 4, name: 'Chicken 65', price: 220, rating: 4.4, veg: false, image: 'https://via.placeholder.com/80' },
        { id: 5, name: 'Paneer Tikka', price: 190, rating: 4.1, veg: true, image: 'https://via.placeholder.com/80' },
      ]
    },
    {
      name: 'Main Course',
      items: [
        { id: 6, name: 'Dal Makhani', price: 160, rating: 4.3, veg: true, image: 'https://via.placeholder.com/80' },
        { id: 7, name: 'Butter Chicken', price: 280, rating: 4.6, veg: false, image: 'https://via.placeholder.com/80' },
      ]
    },
    {
      name: 'Desserts',
      items: [
        { id: 8, name: 'Gulab Jamun', price: 80, rating: 4.7, veg: true, image: 'https://via.placeholder.com/80' },
        { id: 9, name: 'Rasmalai', price: 90, rating: 4.5, veg: true, image: 'https://via.placeholder.com/80' },
      ]
    }
  ];

   // Apply filters and sorting to categories
  useEffect(() => {
    // Create a deep copy of the original categories
    let newCategories = JSON.parse(JSON.stringify(originalCategories));
    
    // Apply quick filter if active
    if (activeQuickFilter) {
      newCategories = newCategories.map(category => {
        const filteredItems = category.items.filter(item => {
          switch (activeQuickFilter) {
            case 'Veg Only':
              return item.veg;
            case 'Non-Veg':
              return !item.veg;
            case 'Less than ₹200':
              return item.price < 200;
            case 'Bestseller':
              return item.bestseller;
            default:
              return true;
          }
           });
        return { ...category, items: filteredItems };
      });
    }
    
    // Apply sorting based on active filter
    newCategories = newCategories.map(category => {
      let sortedItems = [...category.items];
      
      switch (activeFilter) {
        case 'Rating':
          sortedItems.sort((a, b) => b.rating - a.rating);
          break;
        case 'Price: Low to High':
          sortedItems.sort((a, b) => a.price - b.price);
          break;
        case 'Price: High to Low':
          sortedItems.sort((a, b) => b.price - a.price);
          break;
         case 'Delivery Time':
          sortedItems.sort((a, b) => a.deliveryTime - b.deliveryTime);
          break;
        case 'Recommended':
        default:
          // For recommended, prioritize bestsellers and higher ratings
          sortedItems.sort((a, b) => {
            if (a.bestseller && !b.bestseller) return -1;
            if (!a.bestseller && b.bestseller) return 1;
            return b.rating - a.rating;
          });
          break;
      }
      
      return { ...category, items: sortedItems };
    });
    
    // Filter out categories with no items
       newCategories = newCategories.filter(category => category.items.length > 0);
    
    setFilteredCategories(newCategories);
  }, [activeFilter, activeQuickFilter]);

  // Toggle filter dropdown
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Select filter option
  const selectFilter = (filter) => {
    setActiveFilter(filter);
    setIsFilterOpen(false);
  };

  // Toggle accordion
  const toggleAccordion = (categoryName) => {
    if (expandedAccordion === categoryName) {
      setExpandedAccordion(null);
    } else {
      setExpandedAccordion(categoryName);
    }
  };
   // Toggle quick filter
  const toggleQuickFilter = (filter) => {
    if (activeQuickFilter === filter) {
      setActiveQuickFilter(null);
    } else {
      setActiveQuickFilter(filter);
    }
  };
   // Check if a non-default filter is active
  const isNonDefaultFilterActive = activeFilter !== 'Recommended';

  return (
    <div className="p-3 bg-white">
      <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
      
      {/* Filter section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          {/* Filter dropdown */}
          <div className="relative">
            <button 
              className={`flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm transition-colors ${
                isNonDefaultFilterActive 
                  ? 'border-red-800 bg-red-50 text-red-800' 
                  : 'border-gray-300 text-gray-700'
              }`}
              onClick={toggleFilter}
            >
              <FaFilter className={isNonDefaultFilterActive ? "text-red-800" : "text-gray-500"} />
              <span>Filter</span>
              <FaChevronDown className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''} ${
                isNonDefaultFilterActive ? 'text-red-800' : 'text-gray-500'
              }`} />
            </button>
            
            {/* Filter dropdown menu */}
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${activeFilter === option ? 'bg-red-50 text-red-800 font-medium' : ''}`}
                    onClick={() => selectFilter(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick filter chips */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {quickFilters.map((filter) => (
              <button
                key={filter}
                className={`whitespace-nowrap text-xs border rounded-full px-3 py-1 transition-colors ${
                  activeQuickFilter === filter 
                    ? 'bg-red-800 text-white border-red-800' 
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => toggleQuickFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Category accordions */}
  <div className="space-y-3">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div key={category.name} className="border border-gray-200 rounded-md overflow-hidden">
              {/* Accordion header */}
              <button
                className="w-full flex items-center justify-between p-3 bg-gray-50 text-left"
                onClick={() => toggleAccordion(category.name)}
              >
                <span className="font-medium">{category.name} ({category.items.length})</span>
                {expandedAccordion === category.name ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {/* Accordion content */}
              {expandedAccordion === category.name && (
                <div className="p-3 space-y-4">
                  {category.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {/* Item image */}
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      
                      {/* Item details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium flex items-center">
                              {item.name}
                              {item.veg && (
                                <span className="ml-1 inline-block border border-green-600 p-0.5">
                                  <BiSolidLeaf className="text-green-600 text-xs" />
                                </span>
                              )}
                              {item.bestseller && (
                                <span className="ml-1 text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                                  Bestseller
                                </span>
                              )}
                            </h3>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="bg-green-600 text-white text-xs px-1 rounded flex items-center">
                                {item.rating} <FaStar className="ml-0.5 text-[8px]" />
                              </span>
                              <span className="text-xs text-gray-500">• {item.deliveryTime || 30}-{(item.deliveryTime || 30) + 5} mins</span>
                            </div>
                            <p className="text-sm mt-1">₹{item.price}</p>
                          </div>
                          
                          {/* Add button */}
                          <button className="border border-gray-300 text-green-600 font-medium rounded-md px-3 py-1 text-sm hover:bg-green-50">
                            ADD
                          </button>
                        </div>
                        
                        {/* Item description - optional */}
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          Delicious {item.name.toLowerCase()} prepared with finest ingredients.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No items match your selected filters
          </div>
        )}
      </div>
      
      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Recommendation;