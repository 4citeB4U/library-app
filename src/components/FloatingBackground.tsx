

interface Particle {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  type: string;
  size: number;
  opacity: number;
}

const FloatingBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speedX: (Math.random() - 0.5) * 0.3, // Further reduced initial speed
      speedY: (Math.random() - 0.5) * 0.3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.5, // Smoother rotation
      type: Math.random() > 0.5 ? '🪡' : '🧶',
      size: 25 + Math.random() * 25,
      opacity: 0.6 + Math.random() * 0.4
    }));
    
    setParticles(initialParticles);
    
    const animate = () => {
      setParticles(prev => prev.map(particle => {
        // Smooth sinusoidal movement
        const time = Date.now() * 0.001;
        const sinOffset = Math.sin(time + particle.id * 0.5) * 0.02;
        const cosOffset = Math.cos(time + particle.id * 0.5) * 0.02;
        
        let newSpeedX = particle.speedX + sinOffset;
        let newSpeedY = particle.speedY + cosOffset;
        
        // Gradual speed adjustment
        const targetSpeed = 0.5;
        const speedAdjustment = 0.01;
        const currentSpeed = Math.sqrt(newSpeedX * newSpeedX + newSpeedY * newSpeedY);
        
        if (currentSpeed > 0) {
          const speedFactor = 1 + (targetSpeed - currentSpeed) * speedAdjustment;
          newSpeedX *= speedFactor;
          newSpeedY *= speedFactor;
        }
        
        let newX = particle.x + newSpeedX;
        let newY = particle.y + newSpeedY;
        let newRotation = particle.rotation + particle.rotationSpeed;
        
        // Smooth boundary wrapping
        if (newX < -40) newX = window.innerWidth;
        if (newX > window.innerWidth) newX = -40;
        if (newY < -40) newY = window.innerHeight;
        if (newY > window.innerHeight) newY = -40;
        
        return {
          ...particle,
          x: newX,
          y: newY,
          speedX: newSpeedX,
          speedY: newSpeedY,
          rotation: newRotation
        };
      }));
    };
    
    const intervalId = setInterval(animate, 50); // Slightly slower updates for smoother animation
    
    // Handle window resize
    const handleResize = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: Math.min(particle.x, window.innerWidth - 40),
        y: Math.min(particle.y, window.innerHeight - 40)
      })));
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute select-none"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            transform: `rotate(${particle.rotation}deg)`,
            fontSize: `${particle.size}px`,
            opacity: particle.opacity,
            transition: 'transform 0.05s ease-out'
          }}
        >
          {particle.type}
        </div>
      ))}
    </div>
  );
};

export default FloatingBackground;

