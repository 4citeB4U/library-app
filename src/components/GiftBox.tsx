import React from 'react';
import { motion } from 'framer-motion';

const GiftBox: React.FC = () => {
  return (
    <motion.div
      className="relative w-12 h-12"
      whileHover={{ scale: 1.1 }}
      animate={{
        rotate: [0, -5, 5, -5, 5, 0],
        transition: {
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2
        }
      }}
    >
      {/* Gift Box Base */}
      <div className="absolute bottom-0 w-full h-8 bg-red-600 rounded-md shadow-lg" />
      
      {/* Gift Box Lid */}
      <div className="absolute bottom-6 w-full h-4 bg-red-700 rounded-t-md shadow-md" />
      
      {/* Ribbon Vertical */}
      <div className="absolute bottom-0 left-1/2 w-2 h-12 bg-red-400 transform -translate-x-1/2" />
      
      {/* Ribbon Horizontal */}
      <div className="absolute top-1/2 w-full h-2 bg-red-400 transform -translate-y-1/2" />
      
      {/* Bow */}
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
        <div className="relative w-8 h-4">
          {/* Left Bow Loop */}
          <div className="absolute left-0 w-4 h-4 bg-red-400 rounded-full transform -rotate-45" />
          
          {/* Right Bow Loop */}
          <div className="absolute right-0 w-4 h-4 bg-red-400 rounded-full transform rotate-45" />
          
          {/* Bow Center */}
          <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-red-300 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </motion.div>
  );
};

export default GiftBox;
