import { SidebarOpenIcon } from "lucide-react";

const SidebarToggle = ({
  sidebarOpen,
  onOpenSidebar,
  onCloseSidebar
}) => {
  return (
    <>
      {/* ── Mobile backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onCloseSidebar}
        />
      )}

      {/* Desktop show-sidebar button (when collapsed) */}
      {!sidebarOpen && (
        <div className="hidden md:block absolute top-6 left-6 z-10">
          <button
            onClick={onOpenSidebar}
            className="
              flex items-center justify-center w-15 h-15 rounded-base
              text-claude-stone hover:text-claude-text-on-dark
              transition-all duration-150
            "
          >
            <SidebarOpenIcon />
          </button>
        </div>
      )}
    </>
  );
};

export default SidebarToggle;
