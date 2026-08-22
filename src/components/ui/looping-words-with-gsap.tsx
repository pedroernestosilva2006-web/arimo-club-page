import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

export interface LoopingWordsProps {
  words: readonly string[];
  duration?: number;
  pause?: number;
  className?: string;
}

export function LoopingWords({
  words,
  duration = 0.85,
  pause = 1.8,
  className,
}: LoopingWordsProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const wordListRef = useRef<HTMLSpanElement>(null);
  const selectorRef = useRef<HTMLSpanElement>(null);
  const longestWord = useMemo(
    () => words.reduce((longest, word) => (word.length > longest.length ? word : longest), ""),
    [words],
  );

  useEffect(() => {
    if (words.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let timeline: { kill: () => void } | undefined;
    let resizeObserver: ResizeObserver | undefined;

    void import("gsap").then(({ default: gsap }) => {
      const root = rootRef.current;
      const wordList = wordListRef.current;
      const selector = selectorRef.current;
      if (cancelled || !root || !wordList || !selector) return;

      const buildTimeline = () => {
        timeline?.kill();

        const wordElements = Array.from(wordList.children) as HTMLElement[];
        const widths = wordElements.slice(0, words.length).map((word) => word.offsetWidth);
        const step = 100 / wordElements.length;
        const horizontalPadding = Math.max(14, root.getBoundingClientRect().height * 0.18);

        gsap.set(wordList, { yPercent: 0 });
        gsap.set(selector, { width: widths[0] + horizontalPadding });

        const nextTimeline = gsap.timeline({ repeat: -1 });
        for (let index = 1; index <= words.length; index += 1) {
          nextTimeline.to(
            wordList,
            {
              yPercent: -step * index,
              duration,
              ease: "power4.inOut",
            },
            `+=${pause}`,
          );
          nextTimeline.to(
            selector,
            {
              width: widths[index % words.length] + horizontalPadding,
              duration: duration * 0.72,
              ease: "expo.out",
            },
            "<",
          );
        }
        nextTimeline.set(wordList, { yPercent: 0 });
        timeline = nextTimeline;
      };

      buildTimeline();
      resizeObserver = new ResizeObserver(buildTimeline);
      resizeObserver.observe(root);
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      timeline?.kill();
    };
  }, [duration, pause, words]);

  if (words.length === 0) return null;

  const sequence = words.length > 1 ? [...words, words[0]] : words;

  return (
    <span ref={rootRef} className={cn("arimo-looping-words", className)} aria-label={words[0]}>
      <span className="arimo-looping-words__sizer" aria-hidden="true">
        {longestWord}
      </span>
      <span className="arimo-looping-words__viewport" aria-hidden="true">
        <span ref={wordListRef} className="arimo-looping-words__list">
          {sequence.map((word, index) => (
            <span className="arimo-looping-words__word" key={`${word}-${index}`}>
              {word}
            </span>
          ))}
        </span>
      </span>
      <span ref={selectorRef} className="arimo-looping-words__selector" aria-hidden="true">
        <i className="arimo-looping-words__corner is-top-left" />
        <i className="arimo-looping-words__corner is-top-right" />
        <i className="arimo-looping-words__corner is-bottom-right" />
        <i className="arimo-looping-words__corner is-bottom-left" />
      </span>
    </span>
  );
}
