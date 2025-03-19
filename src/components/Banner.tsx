import React from 'react';
import { motion } from 'framer-motion';

const Banner: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden py-8 bg-gradient-to-b from-purple-900/50 to-transparent">
      {/* Shooting Star */}
      <motion.div
        className="absolute w-1 h-1 bg-white rounded-full shadow-lg"
        style={{
          boxShadow: '0 0 20px #fff, 0 0 30px #fff, 0 0 40px #fff',
        }}
        initial={{ x: -100, y: -100 }}
        animate={{
          x: ['-100%', '200%'],
          y: ['0%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'linear',
        }}
      />
      
      {/* Title with Golden Glow */}
      <div className="text-center">
        <motion.h1
          className="text-5xl font-bold mb-2"
          style={{
            background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(251, 245, 183, 0.5)',
          }}
          animate={{
            scale: [1, 1.02, 1],
            filter: [
              'drop-shadow(0 0 20px rgba(251, 245, 183, 0.3))',
              'drop-shadow(0 0 25px rgba(251, 245, 183, 0.5))',
              'drop-shadow(0 0 20px rgba(251, 245, 183, 0.3))',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          Leola Lee's Library
        </motion.h1>
        <p className="text-xl text-gray-200">
          A collection of heartwarming stories and guides by Leola "Sister" Lee
        </p>
      </div>
    </div>
  );
};

export default Banner;
