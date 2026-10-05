import { useEffect, useRef } from 'react';

/**
 * A custom React hook that uses the IntersectionObserver API to detect when
 * elements with the `.reveal` or `.reveal-stagger` classes enter the viewport.
 * Once visible, it adds the `.reveal-active` class to trigger hardware-accelerated CSS transitions.
 */
export default function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    // Initialize IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            // Stop observing once animation has triggered (animates once)
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.02, // Trigger immediately when even 2% is visible
        rootMargin: '0px 0px 40px 0px', // Trigger slightly ahead of scrolling
      }
    );

    const scanAndObserve = () => {
      const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If already in viewport on mount, activate immediately to avoid flash of invisible content
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('reveal-active');
        } else if (!el.classList.contains('reveal-active') && observerRef.current) {
          observerRef.current.observe(el);
        }
      });
    };

    scanAndObserve();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  /**
   * Scans the DOM and registers any newly mounted elements with the observer.
   * Crucial in single-page apps where content mounts dynamically.
   */
  const refresh = () => {
    const scan = () => {
      const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('reveal-active');
        } else if (!el.classList.contains('reveal-active') && observerRef.current) {
          observerRef.current.observe(el);
        }
      });
    };

    // Immediate check
    scan();
    // Subsequent check for React DOM paints
    setTimeout(scan, 80);
    setTimeout(scan, 250);
  };

  return { refresh };
}
