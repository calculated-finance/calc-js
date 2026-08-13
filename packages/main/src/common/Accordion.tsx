import { useState, ReactNode } from "react";
import { Icons } from "rujira.ui";


interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
}

export const Accordion = ({ title, children }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      className="pointer card p-2 mb-1 color-white text-left"
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}>
      <div className="flex ai-c">
        {title}
        {!isOpen ? (
          <Icons.AngleDown className="ml-a w-3 h-3 color-grey" />
        ) : (
          <Icons.AngleUp className="ml-a w-3 h-3 color-grey" />
        )}
      </div>
      {isOpen && <div className="accordion__content">{children}</div>}
    </button>
  );
};
