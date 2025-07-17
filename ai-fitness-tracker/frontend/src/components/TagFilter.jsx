import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TagIcon } from '@heroicons/react/24/solid';

const TagFilter = ({ 
  availableTags = [], 
  selectedTags = [], 
  onSelectionChange,
  placeholder = "Filter by tags"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTagToggle = (tag) => {
    const newSelection = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    onSelectionChange(newSelection);
  };

  const clearAllTags = () => {
    onSelectionChange([]);
  };

  const hasSelectedTags = selectedTags.length > 0;

  return (
    <div className="relative">
      {/* Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2
          ${hasSelectedTags 
            ? 'bg-accent-50 border-accent-200 text-accent-700' 
            : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <TagIcon className="w-4 h-4 mr-2" />
        <span>
          {hasSelectedTags ? `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''}` : placeholder}
        </span>
        <ChevronDownIcon 
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </motion.button>

      {/* Selected Tags Display */}
      {hasSelectedTags && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedTags.map((tag) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center px-2 py-1 text-xs font-medium bg-accent-100 text-accent-800 rounded-pill"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleTagToggle(tag)}
                className="ml-1 text-accent-600 hover:text-accent-800 transition-colors"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
          <button
            type="button"
            onClick={clearAllTags}
            className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-large border border-neutral-200 z-50"
          >
            <div className="p-2">
              {availableTags.length === 0 ? (
                <div className="px-3 py-2 text-sm text-neutral-500">
                  No tags available
                </div>
              ) : (
                <>
                  <div className="px-3 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wide">
                    Available Tags
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {availableTags.map((tag) => (
                      <motion.button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`
                          w-full flex items-center px-3 py-2 text-sm rounded-lg text-left
                          transition-colors duration-150
                          ${selectedTags.includes(tag)
                            ? 'bg-accent-50 text-accent-700'
                            : 'text-neutral-700 hover:bg-neutral-50'
                          }
                        `}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className={`
                          w-4 h-4 rounded border-2 mr-3 flex items-center justify-center
                          ${selectedTags.includes(tag)
                            ? 'bg-accent-500 border-accent-500'
                            : 'border-neutral-300'
                          }
                        `}>
                          {selectedTags.includes(tag) && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default TagFilter;