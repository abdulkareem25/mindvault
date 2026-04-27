const Loading = ({
  fullScreen = true,
  size = 'md',
  message = 'Loading...',
  showMessage = true
}) => {
  // Smooth dots animation keyframes
  const dotAnimation = `
    @keyframes smoothDots {
      0%, 60%, 100% {
        opacity: 0.6;
        transform: translateY(0);
      }
      30% {
        opacity: 1;
        transform: translateY(-12px);
      }
    }
    .dot-animate {
      animation: smoothDots 1.4s infinite ease-in-out;
    }
  `

  // Size configurations - increased sizes
  const sizeConfig = {
    sm: { dotSize: 'w-3 h-3', gap: 'gap-2', text: 'text-sm' },
    md: { dotSize: 'w-4 h-4', gap: 'gap-3', text: 'text-base' },
    lg: { dotSize: 'w-5 h-5', gap: 'gap-4', text: 'text-lg' },
  }

  const config = sizeConfig[size] || sizeConfig.md

  const LoadingContent = () => (
    <div className="flex flex-col items-center gap-4">
      <style>{dotAnimation}</style>
      <div className={`flex items-center ${config.gap}`}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`${config.dotSize} bg-claude-terracotta rounded-full dot-animate`}
            style={{
              animationDelay: `${i * 0.2}s`,
              backgroundColor: '#c96442'
            }}
          />
        ))}
      </div>
      {showMessage && (
        <p className={`${config.text} font-medium text-claude-warm-silver`}>
          {message}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-claude-deep-dark flex items-center justify-center p-4">
        {/* Content */}
        <div>
          <LoadingContent />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-4">
      <LoadingContent />
    </div>
  )
}

export default Loading
