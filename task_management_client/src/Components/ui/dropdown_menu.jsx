import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";

// Context for managing dropdown open/close state
const DropdownContext = createContext(null);

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left" ref={menuRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, asChild, ...props }) {
  const { open, setOpen } = useContext(DropdownContext);

  const handleClick = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      ...props,
    });
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  children,
  align = "end",
  className = "",
}) {
  const { open } = useContext(DropdownContext);

  if (!open) return null;

  const alignStyles = align === "end" ? "right-0" : "left-0";

  return (
    <div
      className={`absolute ${alignStyles} mt-2 w-56 z-50 rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5 border border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  className = "",
  onClick,
  ...props
}) {
  const { setOpen } = useContext(DropdownContext);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    setOpen(false); // Close menu on item click
  };

  return (
    <div
      onClick={handleClick}
      className={`flex cursor-pointer items-center rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ children, className = "" }) {
  return (
    <div className={`px-3 py-2 text-xs text-gray-500 font-normal ${className}`}>
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className = "" }) {
  return <div className={`-mx-1 my-1 h-px bg-gray-100 ${className}`} />;
}

export function DropdownMenuGroup({ children }) {
  return <div className="space-y-0.5">{children}</div>;
}
