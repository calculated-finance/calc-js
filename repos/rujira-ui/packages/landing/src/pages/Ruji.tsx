import { FC, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import bg from "../assets/ruji.jpg";
import roadmap from "../assets/roadmap.png";
import roadmapmobile from "../assets/roadmap-mobile.png";
import { Allocation, AllocationMobile } from "../components";

export const Ruji: FC = () => {
  const location = useLocation();

  const refRoadmap = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (location.pathname === "/whatisruji") {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    }
    if (location.pathname === "/roadmap") {
      refRoadmap.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [location]);

  return (
    <>
      <motion.div
        className="rujira__background ruji"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 4 }}
        style={{ backgroundImage: `url(${bg})` }}></motion.div>
      <div className="rujira__inner ruji">
        <section className="ruji__banner">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="fs-24 lh-md-30 fs-md-32 lh-md-39 fw-400 mb-1 color-white">
            RUJI Token
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.35 }}
            className="fs-48 lh-48 fs-md-70 lh-md-70 fw-600 uppercase color-white">
            Zero Inflation,
            <br />
            100% Utility
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="fs-20 lh-24 fs-md-24 lh-md-29 fw-400 mt-4">
            RUJI is a fee collection token powering the entire Rujira ecosystem,
            accruing value from 5+ DeFi applications into USDC.
            <br />
            No inflation, just pure utility.
          </motion.h3>
        </section>
        <section className="ruji__key">
          <h2 className="color-primary2 fs-20 lh-24 mb-10 fw-400 uppercase">
            Key Details
          </h2>
          <div className="ruji__key-points">
            <div className="row wrap pad">
              <div className="col-12 col-md-4">
                <div className="ruji__key-point">
                  <div>
                    <h3>Max Supply</h3>
                    <p>
                      <span className="fw-500">100M RUJI</span>
                      <br />
                      This will be the hard cap on the total RUJI token supply,
                      ensuring scarcity and value accrual for long-term holders.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4 mt-4 mt-md-0">
                <div className="ruji__key-point bg2">
                  <div>
                    <h3>Inflation</h3>
                    <p>
                      <span className="fw-500">0%</span>
                      <br />
                      RUJI will not experience inflation, offering a fixed
                      supply that ensures consistent value retention over time.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4 mt-4 mt-md-0">
                <div className="ruji__key-point bg3">
                  <div>
                    <h3>Utility</h3>
                    <p>
                      RUJI stakers will accrue value from over 5 DeFi apps, with
                      revenue paid out in USDC.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="ruji__allocation">
          <h2 className="color-primary2 fs-20 lh-24 mb-14 fw-400 uppercase">
            Allocation
          </h2>
          <div className="ruji__allocation-graph">
            <AllocationMobile />
            <Allocation />
          </div>
        </section>
        <section className="ruji__roadmap text-center" ref={refRoadmap}>
          <div>
            <h2 className="fs-28 lh-34 fs-md-32 lh-md-39 fw-600 uppercase mb-q5">
              Rujira's Roadmap
            </h2>
            <p className="fs-16 lh-20 fs-md-20 lh-md-24">
              With the acquisition of KUJIRA and Levana complete, Rujira is
              moving into its next phase: migration.
            </p>
          </div>
          <img src={roadmap} alt="Roadmap" />
          <img src={roadmapmobile} alt="Roadmap Mobile" />
        </section>
      </div>
    </>
  );
};
