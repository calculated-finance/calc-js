import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { RujiraLogo } from "rujira.ui";

export const Header: FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="rujira__header">
      <div className="flex ai-c">
        <RujiraLogo className="rujira__header-logo" />
        <nav className={open ? "open" : ""}>
          <Link onClick={() => setOpen(false)} to="/">
            Home
          </Link>
          <Link onClick={() => setOpen(false)} to="/whatisrujira">
            What is Rujira
          </Link>
          <Link onClick={() => setOpen(false)} to="/whatisruji">
            What is RUJI
          </Link>
          <Link onClick={() => setOpen(false)} to="/roadmap">
            Roadmap
          </Link>
          <Link onClick={() => setOpen(false)} to="/getinvolved">
            Get Involved
          </Link>
        </nav>
        <button
          className={`rujira__header-hamburger ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}>
          <i />
          <i />
          <i />
        </button>
      </div>
    </header>
  );
};
