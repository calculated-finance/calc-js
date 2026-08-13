import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icons, Pill, useTranslation } from "rujira.ui";
import purposeCube1 from "../assets/purpose-cube-1.svg";
import purposeCube2 from "../assets/purpose-cube-2.svg";
import purposeCube3 from "../assets/purpose-cube-3.svg";
import purposeCube4 from "../assets/purpose-cube-4.svg";
import purposeCube5 from "../assets/purpose-cube-5.svg";
import purposeCube6 from "../assets/purpose-cube-6.svg";
import purposeIcon1 from "../assets/cubes-icon-1.svg";
import purposeIcon2 from "../assets/cubes-icon-2.svg";
import purposeIcon3 from "../assets/cubes-icon-3.svg";
import purposeIcon4 from "../assets/cubes-icon-4.svg";
import purposeIcon5 from "../assets/cubes-icon-5.svg";
import purposeIcon6 from "../assets/cubes-icon-6.svg";
import purposeLine1 from "../assets/cubes-line-1.svg";
import purposeLine2 from "../assets/cubes-line-2.svg";
import purposeLine3 from "../assets/cubes-line-3.svg";
import purposeSquares from "../assets/purpose-squares.png";
import purposeStar from "../assets/purple-star.svg";
import timelineBase from "../assets/timeline.svg";
import timelineEmptyCircle from "../assets/empty-circle.svg";
import timelineFilledCircle from "../assets/filled-circle.svg";

const lineAssets = {
  bottom: {
    className: "home__purpose-story__line--bottom",
    src: purposeLine1,
  },
  upperLeft: {
    className: "home__purpose-story__line--upper-left",
    src: purposeLine2,
  },
  upperRight: {
    className: "home__purpose-story__line--upper-right",
    src: purposeLine3,
  },
} as const;

const iconAssets = {
  bitcoin: {
    className: "home__purpose-story__icon--bitcoin",
    src: purposeIcon1,
  },
  chain: {
    className: "home__purpose-story__icon--chain",
    src: purposeIcon2,
  },
  tools: {
    className: "home__purpose-story__icon--tools",
    src: purposeIcon3,
  },
  orbit: {
    className: "home__purpose-story__icon--orbit",
    src: purposeIcon4,
  },
  blocks: {
    className: "home__purpose-story__icon--blocks",
    src: purposeIcon5,
  },
  cube: {
    className: "home__purpose-story__icon--cube",
    src: purposeIcon6,
  },
} as const;

const starSlots = {
  bottom: "home__purpose-story__star--bottom",
  upperLeft: "home__purpose-story__star--upper-left",
  upperRight: "home__purpose-story__star--upper-right",
} as const;

type LineId = keyof typeof lineAssets;
type IconId = keyof typeof iconAssets;
type StarId = keyof typeof starSlots;

type PurposeSlide = {
  cube: string;
  icons: IconId[];
  id: number;
  lead: string;
  mobileLeadLines?: string[];
  lines: LineId[];
  paragraphs: string[];
  stars: StarId[];
  title: string;
};

export default function PurposeStory() {
  const { t } = useTranslation();
  const slides = useMemo<PurposeSlide[]>(() => [
    {
      cube: purposeCube1,
      icons: [],
      id: 1,
      lead: t("purposeSparkLead"),
      lines: [],
      paragraphs: [],
      stars: [],
      title: t("purposeSparkTitle"),
    },
    {
      cube: purposeCube2,
      icons: ["bitcoin"],
      id: 2,
      lead: t("purposeSparkLead"),
      lines: ["bottom"],
      paragraphs: [
        t("purposeSparkParagraph1"),
        t("purposeSparkParagraph2"),
      ],
      stars: ["bottom"],
      title: t("purposeSparkTitle"),
    },
    {
      cube: purposeCube3,
      icons: ["bitcoin", "chain", "tools"],
      id: 3,
      lead: t("purposeDriftLead"),
      mobileLeadLines: [
        t("purposeDriftMobileLead1"),
        t("purposeDriftMobileLead2"),
      ],
      lines: ["bottom"],
      paragraphs: [t("purposeDriftParagraph1"), t("purposeDriftParagraph2")],
      stars: ["bottom"],
      title: t("purposeDriftTitle"),
    },
    {
      cube: purposeCube4,
      icons: ["bitcoin", "chain", "tools", "orbit"],
      id: 4,
      lead: t("purposeReturnLead"),
      lines: ["bottom"],
      paragraphs: [
        t("purposeReturnParagraph1"),
        t("purposeReturnParagraph2"),
        t("purposeReturnParagraph3"),
      ],
      stars: ["bottom"],
      title: t("purposeReturnTitle"),
    },
    {
      cube: purposeCube5,
      icons: ["bitcoin", "blocks", "chain", "orbit", "tools"],
      id: 5,
      lead: t("purposeConnectionLead"),
      lines: ["bottom", "upperLeft"],
      paragraphs: [
        t("purposeConnectionParagraph1"),
        t("purposeConnectionParagraph2"),
        t("purposeConnectionParagraph3"),
      ],
      stars: ["bottom", "upperLeft"],
      title: t("purposeConnectionTitle"),
    },
    {
      cube: purposeCube6,
      icons: ["bitcoin", "blocks", "chain", "cube", "orbit", "tools"],
      id: 6,
      lead: t("purposeStandardLead"),
      lines: ["bottom", "upperLeft", "upperRight"],
      paragraphs: [
        t("purposeStandardParagraph1"),
        t("purposeStandardParagraph2"),
      ],
      stars: ["bottom", "upperLeft", "upperRight"],
      title: t("purposeStandardTitle"),
    },
  ], [t]);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const markerRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [timelineProgressHeight, setTimelineProgressHeight] =
    useState("1.4375rem");

  const handleTimelineClick = useCallback((index: number) => {
    const scrollArea = scrollAreaRef.current;

    if (!scrollArea) {
      return;
    }

    const totalScrollable = Math.max(
      scrollArea.offsetHeight - window.innerHeight,
      1
    );
    const targetProgress = slides.length > 1 ? index / (slides.length - 1) : 0;
    const targetY =
      window.scrollY +
      scrollArea.getBoundingClientRect().top +
      totalScrollable * targetProgress;

    setActiveSlide(index);

    window.scrollTo({
      top: targetY,
    });
  }, [slides.length]);

  useEffect(() => {
    let frame = 0;

    const updateSlide = () => {
      frame = 0;

      const scrollArea = scrollAreaRef.current;

      if (!scrollArea) {
        return;
      }

      const rect = scrollArea.getBoundingClientRect();
      const totalScrollable = Math.max(
        scrollArea.offsetHeight - window.innerHeight,
        1
      );
      const traveled = Math.min(Math.max(-rect.top, 0), totalScrollable);
      const progress = traveled / totalScrollable;
      const nextSlide = Math.min(
        slides.length - 1,
        Math.floor(progress * slides.length),
      );

      setActiveSlide((currentSlide) => {
        if (currentSlide === nextSlide) return currentSlide;
        return nextSlide > currentSlide ? currentSlide + 1 : currentSlide - 1;
      });
    };

    const scheduleUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateSlide);
      }
    };

    scheduleUpdate();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  useEffect(() => {
    const updateTimelineProgress = () => {
      const timeline = timelineRef.current;
      const activeMarker = markerRefs.current[activeSlide];

      if (!timeline || !activeMarker) {
        return;
      }

      const timelineRect = timeline.getBoundingClientRect();
      const markerRect = activeMarker.getBoundingClientRect();
      const nextHeight = `${markerRect.top - timelineRect.top + markerRect.height / 2}px`;

      setTimelineProgressHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight
      );
    };

    updateTimelineProgress();
    window.addEventListener("resize", updateTimelineProgress);

    return () => {
      window.removeEventListener("resize", updateTimelineProgress);
    };
  }, [activeSlide]);

  const slide = slides[activeSlide];
  const lead = slide.lead;
  const isTimelineComplete = activeSlide === slides.length - 1;
  const hasLead = lead.trim().length > 0;
  const hasParagraphs = slide.paragraphs.length > 0;
  const timelineStyle = {
    "--purpose-progress-height": timelineProgressHeight,
  } as CSSProperties;

  return (
    <section
      className="home__purpose-story px-4"
      aria-labelledby="purpose-story-title">
      <div className="rujira__inner">
        <div className="home__purpose-story__scroll-area" ref={scrollAreaRef}>
          <div className="home__purpose-story__sticky">
            <div className="home__purpose-story__panel" style={timelineStyle}>
              <div
                className={[
                  "home__purpose-story__timeline",
                  isTimelineComplete ? "is-complete" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                ref={timelineRef}
                aria-label={t("purposeTimelineAria")}>
                <img
                  className="home__purpose-story__timeline-track"
                  src={timelineBase}
                  alt=""
                  decoding="async"
                />
                <span className="home__purpose-story__timeline-progress" />
                <ol className="home__purpose-story__timeline-markers">
                  {slides.map((storySlide, index) => {
                    const isActive = index === activeSlide;
                    const isComplete = index < activeSlide;

                    return (
                      <li
                        key={storySlide.id}
                        ref={(element) => {
                          markerRefs.current[index] = element;
                        }}
                        className={[
                          "home__purpose-story__timeline-marker",
                          isActive ? "is-active" : "",
                          isComplete ? "is-complete" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}>
                        <button
                          type="button"
                          className="home__purpose-story__timeline-button"
                          aria-current={isActive ? "step" : undefined}
                          aria-label={t("purposeTimelineGoTo", {
                            title: storySlide.title,
                          })}
                          onClick={() => {
                            handleTimelineClick(index);
                          }}>
                          <img
                            src={
                              isActive || isComplete
                                ? timelineFilledCircle
                                : timelineEmptyCircle
                            }
                            alt=""
                            decoding="async"
                          />
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div className="home__purpose-story__text-column">
                <Pill
                  className="home__purpose-story__pill"
                  icon={<Icons.StarAlt aria-hidden="true" />}
                  label={t("purposePill")}
                />
                <div className="home__purpose-story__text-stage">
                  <h2
                    id="purpose-story-title"
                    className="home__purpose-story__title">
                    {slide.title}
                  </h2>
                  {hasLead && (
                    <>
                      <p className="home__purpose-story__lead home__purpose-story__lead--desktop">
                        {lead}
                      </p>
                      <p className="home__purpose-story__lead home__purpose-story__lead--mobile">
                        {(slide.mobileLeadLines ?? [slide.lead]).map((line) => (
                          <span
                            className="home__purpose-story__lead-line"
                            key={line}>
                            {line}
                          </span>
                        ))}
                      </p>
                    </>
                  )}
                  {hasParagraphs && (
                    <div
                      className="home__purpose-story__body"
                      key={`body-${slide.id}`}>
                      {slide.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="home__purpose-story__visual-column">
                <div
                  className="home__purpose-story__visual-stage"
                  aria-hidden="true">
                  <div className="home__purpose-story__visual-base">
                    <img src={purposeSquares} alt="" decoding="async" />
                  </div>
                  {(Object.keys(lineAssets) as LineId[]).map((lineId) => {
                    const line = lineAssets[lineId];

                    return (
                      <div
                        key={lineId}
                        className={[
                          "home__purpose-story__line",
                          line.className,
                          slide.lines.includes(lineId) ? "is-visible" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}>
                        <img src={line.src} alt="" decoding="async" />
                      </div>
                    );
                  })}
                  {(Object.keys(starSlots) as StarId[]).map((starId) => (
                    <div
                      key={starId}
                      className={[
                        "home__purpose-story__star",
                        starSlots[starId],
                        slide.stars.includes(starId) ? "is-visible" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}>
                      <img src={purposeStar} alt="" decoding="async" />
                    </div>
                  ))}
                  {(Object.keys(iconAssets) as IconId[]).map((iconId) => {
                    const icon = iconAssets[iconId];

                    return (
                      <div
                        key={iconId}
                        className={[
                          "home__purpose-story__icon",
                          icon.className,
                          slide.icons.includes(iconId) ? "is-visible" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}>
                        <img src={icon.src} alt="" decoding="async" />
                      </div>
                    );
                  })}
                  <div className="home__purpose-story__cube" key={slide.cube}>
                    <img src={slide.cube} alt="" decoding="async" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
