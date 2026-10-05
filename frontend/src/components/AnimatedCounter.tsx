import { useEffect, useState, useRef } from 'react';
import type { AnimatedCounterProps } from '../types';

/**
 * A performance-optimized animated count-up text component.
 * It remains at 0 until scrolled into view, then animates to the target number
 * using requestAnimationFrame and a smooth ease-out-quad curve.
 */
export default function AnimatedCounter({ target, duration = 1500, suffix = '', prefix = '' }: AnimatedCounterProps) {
  // Initial state is target so static extraction, SSR, or unhydrated page shows meaningful value (never '0+')
  const [count, setCount] = useState(target);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setCount(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startCountUp();
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [target, duration]);

  const startCountUp = () => {
    setCount(0);
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Ease-out Quad curve: progress * (2 - progress)
      const easedProgress = progress * (2 - progress);
      const currentVal = Math.floor(easedProgress * target);

      setCount(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    window.requestAnimationFrame(animate);
  };

  return (
    <span ref={elementRef}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
