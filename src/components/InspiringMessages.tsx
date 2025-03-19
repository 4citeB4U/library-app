

const InspiringMessages: React.FC = () => {
  const messages = [
    "Keep stitching your dreams together!",
    "A single thread of hope is still a strong thread.",
    "Stay warm with cozy yarn and warm words.",
    "Every stitch is a story waiting to unfold."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [messages.length]);

  return (
    <div 
      className="fixed left-4 top-1/2 transform -translate-y-1/2 p-4 max-w-[200px]"
      style={{
        background: 'linear-gradient(to right, rgba(0,0,0,0.3), transparent)',
      }}
    >
      <div
        className="text-lg"
        style={{
          background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 10px rgba(251, 245, 183, 0.3)',
        }}
      >
        {messages[currentIndex]}
      </div>
    </div>
  );
};

export default InspiringMessages;

