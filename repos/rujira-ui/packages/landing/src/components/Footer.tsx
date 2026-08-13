import { FC } from "react";
import { Link } from "react-router-dom";
import { RujiraLogo } from "rujira.ui";

export const Footer: FC = () => (
  <footer className="rujira__footer">
    <div className="rujira__inner">
      <div className="flex wrap">
        <RujiraLogo className="rujira__footer-logo" />
        <div className="ml-a mr-0 flex wrap">
          <div>
            <h4>RUJIRA</h4>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/whatisrujira">What is Rujira</Link>
              <Link to="/whatisruji">What is RUJI</Link>
              <Link to="/roadmap">Roadmap</Link>
              <Link to="/getinvolved">Get Involved</Link>
            </nav>
          </div>
          <div className="mx-md-10">
            <h4>Develop</h4>
            <nav>
              <a href="https://docs.rujira.network" target="_blank">
                Documentation
              </a>
              <a href="https://discord.gg/ddWCkJjD4u" target="_blank">
                Discord
              </a>
            </nav>
          </div>
          <div>
            <h4>Community</h4>
            <nav>
              <a href="https://x.com/RujiraNetwork" target="_blank">
                x.com
              </a>
              <a href="https://t.me/team_kujira" target="_blank">
                Kujira
              </a>
              <a href="https://t.me/thorchain_org" target="_blank">
                THORChain
              </a>
              <a href="https://discord.gg/c4EhDZdFMA" target="_blank">
                THORChain University
              </a>
            </nav>
          </div>
        </div>
      </div>
      <p className="fs-12 lh-15 mt-5">
        All RUJIRA brand is in public domain. No rights reserved.
      </p>
    </div>
  </footer>
);
