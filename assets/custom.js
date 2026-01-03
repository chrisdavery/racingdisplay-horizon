
function scrollToHash() {
  const hash = window.location.hash; // "#faq"
  if (hash) {
    const id = hash.slice(1); // remove #
    const target = document.querySelector(`[data-section-id="${id}"]`);
    if (target) {
      let offset = 0;
      const stickyHeader = document.querySelector('.header[data-sticky-state="active"]');
      if (stickyHeader) {
        offset = stickyHeader.clientHeight;
      }

      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    }
  }
}

// Run on page load
scrollToHash();


// Run on hash change
window.addEventListener("hashchange", scrollToHash);

// js/common/behavior/scroll-progress.js
var ScrollProgress = class extends HTMLElement {
  connectedCallback() {
    // Don't proceed if we can't find a scrolled element
    if (!this.scrolledElement) {
      console.warn('scroll-progress: No scrolled element found');
      return;
    }
    
    this.scrolledElement.addEventListener("scroll", throttle(this._updateScrollProgress.bind(this)));
    if (window.ResizeObserver) {
      new ResizeObserver(this._updateScrollProgress.bind(this)).observe(this.scrolledElement);
    }
  }
  
  get scrolledElement() {
    if (!this._scrolledElement) {
      // Check if we should observe a slideshow component
      const observesAttr = this.getAttribute("observes");
      if (observesAttr === 'slideshow-component') {
        // Find the nearest slideshow component and get its slides container
        const slideshow = this.closest('slideshow-component');
        this._scrolledElement = slideshow ? slideshow.querySelector('slideshow-slides') : null;
      } else if (observesAttr) {
        // Otherwise, use the selector from the attribute
        this._scrolledElement = this.closest(observesAttr);
      }
      // No fallback - only use what's explicitly specified
    }
    return this._scrolledElement;
  }
  
  _updateScrollProgress() {
    if (!this.scrolledElement) return;
    
    const scrollLeft = document.dir === "ltr" ? 
      this.scrolledElement.scrollLeft : 
      Math.abs(this.scrolledElement.scrollLeft);
    
    const advancement = (scrollLeft + this.scrolledElement.clientWidth) / this.scrolledElement.scrollWidth;
    this.style.setProperty("--scroll-progress", Math.max(0, Math.min(advancement, 1)).toFixed(6));
  }
};

if (!window.customElements.get("scroll-progress")) {
  window.customElements.define("scroll-progress", ScrollProgress);
}

function throttle(fn, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return fn(...args);
    };
}