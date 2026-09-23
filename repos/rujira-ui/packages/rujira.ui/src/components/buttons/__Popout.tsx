import { useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: React.ReactNode;
  position: { top: number; left: number };
  visible: boolean;
}

export const Popout: React.FC<Props> = ({ children, position, visible }) => {
  const node = useRef<HTMLElement>(null);
  if (!visible) return null;

  return createPortal(
    <nav
      ref={node}
      className="popout condensed"
      style={{
        top: position.top - (node.current?.offsetHeight || 0) + 8,
        left: position.left - (node.current?.offsetWidth || 0),
      }}>
      {children}
    </nav>,
    document.body
  );
};

export const usePopout = () => {
  const [popoutState, setPopoutState] = useState<{
    content: React.ReactNode;
    position: { top: number; left: number };
    visible: boolean;
  }>({
    content: "",
    position: { top: 0, left: 0 },
    visible: false,
  });

  const showPopout = (content: React.ReactNode, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    setPopoutState({
      content,
      position: {
        top: rect.top + window.scrollY + rect.height,
        left: rect.left + window.scrollX,
      },
      visible: true,
    });
  };

  const hidePopout = () => {
    setPopoutState((prev) => ({ ...prev, visible: false }));
  };

  return { popoutState, showPopout, hidePopout };
};
