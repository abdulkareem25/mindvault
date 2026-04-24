

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
        opacity: 0.3;
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

  // Size configurations
  const sizeConfig = {
    sm: { dotSize: 'w-2 h-2', gap: 'gap-1.5', text: 'text-sm' },
    md: { dotSize: 'w-3 h-3', gap: 'gap-2.5', text: 'text-base' },
    lg: { dotSize: 'w-4 h-4', gap: 'gap-3.5', text: 'text-lg' },
  }

  const config = sizeConfig[size] || sizeConfig.md

  const LoadingContent = () => (
    <div className="flex flex-col items-center gap-4">
      <style>{dotAnimation}</style>
      <div className={`flex items-center ${config.gap}`}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`${config.dotSize} bg-linear-to-b from-[#21808d] to-[#00aaff] rounded-full dot-animate`}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      {showMessage && (
        <p className={`${config.text} font-medium text-[#a0a0a0]`}>
          {message}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f]"></div>
        <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-[#21808d]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#00aaff]/5 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10">
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
