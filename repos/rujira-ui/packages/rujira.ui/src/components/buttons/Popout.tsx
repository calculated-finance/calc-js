import clsx from "clsx";
import { FC, useEffect, useRef, useState } from "react";
import { AngleLeft, Ellipsis } from "../icons/Icons";
import { Button } from "./Button";
import { createPortal } from "react-dom";

export const Popout: FC<{
  children?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
}> = ({ children, className, buttonClassName }) => {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const navElement = document.getElementById("popout")!;

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", position);
      navElement.classList.add("open");
      position();
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", position);
      navElement.classList.remove("open");
    };
  }, [open]);

  const handleClickOutside = (e: any) => {
    if (navElement.contains(e.target)) {
      return;
    }
    setOpen(false);
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  };

  const position = () => {
    const containerElementElement = container.current;

    if (navElement && containerElementElement) {
      const rightPosition =
        window.scrollX +
        window.innerWidth -
        containerElementElement.getBoundingClientRect().left -
        parseInt(getComputedStyle(containerElementElement).borderLeftWidth, 10);
      const bottomPosition =
        -window.scrollY +
        window.innerHeight -
        containerElementElement.getBoundingClientRect().top -
        parseInt(getComputedStyle(containerElementElement).borderTopWidth, 10) -
        containerElementElement.offsetHeight;
      navElement.style.right = `${rightPosition + 4}px`;
      navElement.style.bottom = `${bottomPosition - 4}px`;
    }
  };

  return (
    <div
      ref={container}
      className={clsx({
        popout: true,
        [`${className}`]: className,
      })}>
      <Button
        onClick={() => setOpen(!open)}
        className={clsx({
          "button--grey button--small": !buttonClassName,
          [`${buttonClassName}`]: buttonClassName,
        })}>
        {!open ? <Ellipsis /> : <AngleLeft />}
      </Button>
      {open && createPortal(children, navElement)}
    </div>
  );
};
