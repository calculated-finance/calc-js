import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

export const Nav: FC = () => {
  const location = useLocation();
  return (
    <nav className="docs__nav">
      <h5>Getting Started</h5>
      <Link
        className={location.pathname === "/install" ? "current" : ""}
        to="/install">
        Installing
      </Link>
      <Link
        className={location.pathname === "/usage" ? "current" : ""}
        to="/usage">
        Usage
      </Link>
      <Link
        className={location.pathname === "/breakpoints" ? "current" : ""}
        to="/breakpoints">
        Breakpoints
      </Link>

      <h5>Class Selectors</h5>
      <Link
        className={location.pathname === "/display" ? "current" : ""}
        to="/display">
        Display
      </Link>
      <Link
        className={location.pathname === "/spacing" ? "current" : ""}
        to="/spacing">
        Spacing
      </Link>
      <Link
        className={location.pathname === "/colors" ? "current" : ""}
        to="/colors">
        Colors
      </Link>
      <Link
        className={location.pathname === "/typography" ? "current" : ""}
        to="/typography">
        Typography
      </Link>
      <Link
        className={location.pathname === "/filters" ? "current" : ""}
        to="/filters">
        Filters
      </Link>
      <Link
        className={location.pathname === "/flexbox" ? "current" : ""}
        to="/flexbox">
        Flexbox
      </Link>

      <h5>Styled Components</h5>
      <Link
        className={location.pathname === "/styledcomponents" ? "current" : ""}
        to="/styledcomponents">
        Introduction
      </Link>
      <Link
        className={location.pathname === "/cards" ? "current" : ""}
        to="/cards">
        Cards
      </Link>
      <Link
        className={location.pathname === "/table" ? "current" : ""}
        to="/table">
        Table
      </Link>
      <Link
        className={location.pathname === "/tabs" ? "current" : ""}
        to="/tabs">
        Tabs
      </Link>
      <Link className={location.pathname === "/tag" ? "current" : ""} to="/tag">
        Tag
      </Link>
      <Link
        className={location.pathname === "/general-css" ? "current" : ""}
        to="/general-css">
        General
      </Link>

      <h5>Components</h5>
      <Link
        className={location.pathname === "/button" ? "current" : ""}
        to="/button">
        Button
      </Link>
      <Link
        className={location.pathname === "/tx-button" ? "current" : ""}
        to="/tx-button">
        TxButton
      </Link>
      <Link
        className={location.pathname === "/denomicons" ? "current" : ""}
        to="/denomicons">
        Denom Icon
      </Link>
      <Link
        className={location.pathname === "/inputs" ? "current" : ""}
        to="/inputs">
        Inputs
      </Link>
      <Link
        className={location.pathname === "/numbers" ? "current" : ""}
        to="/numbers">
        Numbers
      </Link>
      <Link
        className={location.pathname === "/number-clip" ? "current" : ""}
        to="/number-clip">
        Number Clip
      </Link>
      <Link
        className={location.pathname === "/select" ? "current" : ""}
        to="/select">
        Select
      </Link>
      <Link
        className={location.pathname === "/slider" ? "current" : ""}
        to="/slider">
        Slider
      </Link>
      <Link
        className={location.pathname === "/progress" ? "current" : ""}
        to="/progress">
        Progress
      </Link>
      <Link
        className={location.pathname === "/toggle" ? "current" : ""}
        to="/toggle">
        Toggle
      </Link>
      <Link
        className={location.pathname === "/icons" ? "current" : ""}
        to="/icons">
        Icons
      </Link>
      <Link
        className={location.pathname === "/header" ? "current" : ""}
        to="/header">
        Header
      </Link>
      <Link
        className={location.pathname === "/messages" ? "current" : ""}
        to="/messages">
        Messages
      </Link>
      <Link
        className={location.pathname === "/modal" ? "current" : ""}
        to="/modal">
        Modal
      </Link>
      <Link
        className={location.pathname === "/loader" ? "current" : ""}
        to="/loader">
        Loader
      </Link>
      <Link
        className={location.pathname === "/card" ? "current" : ""}
        to="/card">
        Card
      </Link>

      <h5>Hooks</h5>
      <Link
        className={location.pathname === "/usequeryparam" ? "current" : ""}
        to="/usequeryparam">
        useQueryParam
      </Link>
      <Link
        className={location.pathname === "/uselocalstorage" ? "current" : ""}
        to="/uselocalstorage">
        useLocalStorage
      </Link>
      <Link
        className={location.pathname === "/usewindowsize" ? "current" : ""}
        to="/usewindowsize">
        useWindowSize
      </Link>
    </nav>
  );
};
