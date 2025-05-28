// use a script tag or an external JS file
document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  // gsap code here!

  // GSAP orbit animation for bubbles in the first tab (oscillate, not full circle)
  gsap.to('.orbit-1', {
    rotate: 30,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
    transformOrigin: '50% 50%'
  });
  gsap.to('.orbit-2', {
    rotate: -30,
    duration: 2.5,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
    transformOrigin: '50% 50%'
  });
  gsap.to('.orbit-3', {
    rotate: 20,
    duration: 3,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
    transformOrigin: '50% 50%'
  });
});

gsap.from("header .container", { duration: 1, y: -50, opacity: 0, ease: "power2.out" });

// Initialize GSAP ScrollSmoother for smooth scrolling using wrapper and content selectors
if (window.ScrollSmoother) {
  ScrollSmoother.create({
    wrapper: '.smooth-wrapper',
    content: '.smooth-content',
    smooth: 1.2,
    effects: true
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Listen for clicks on any tab-arrow button
  document.querySelectorAll('.tab-arrow').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const targetSelector = btn.getAttribute('data-bs-target');
      if (targetSelector) {
        const tabTrigger = document.querySelector(`[data-bs-toggle="tab"][data-bs-target="${targetSelector}"]`);
        if (tabTrigger) {
          var tab = new bootstrap.Tab(tabTrigger);
          tab.show();
        }
      }
    });
  });

  // GSAP tab animation for tabbed-section (direction-aware)
  const tabContent = document.getElementById('sectionTabsContent');
  let isAnimating = false;
  let currentTabIndex = 0;

  // Helper: get tab index from trigger
  function getTabIndex(tabTrigger) {
    const tabs = Array.from(document.querySelectorAll('#sectionTabs .nav-link'));
    return tabs.findIndex(tab => tab === tabTrigger);
  }

  function animateTabSwitch(nextTabTrigger) {
    if (isAnimating) return;
    isAnimating = true;

    const tabs = Array.from(document.querySelectorAll('#sectionTabs .nav-link'));
    const nextTabIndex = getTabIndex(nextTabTrigger);
    const direction = nextTabIndex > currentTabIndex ? 1 : -1;

    const currentPane = tabContent.querySelector('.tab-pane.active');
    const nextPane = document.querySelector(nextTabTrigger.getAttribute('data-bs-target'));

    gsap.to(currentPane, {
      x: -100 * direction,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        var tab = new bootstrap.Tab(nextTabTrigger);
        tab.show();
        setTimeout(() => {
          gsap.fromTo(nextPane, { x: 100 * direction, opacity: 0 }, {
            x: 0,
            opacity: 1,
            duration: 0.3,
            onComplete: () => {
              isAnimating = false;
              currentTabIndex = nextTabIndex;
            }
          });
        }, 10);
      }
    });
  }

  // Intercept tab and arrow clicks for GSAP animation
  document.querySelectorAll('#sectionTabs .nav-link, .tab-arrow').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      const targetSelector = btn.getAttribute('data-bs-target');
      if (targetSelector) {
        e.preventDefault();
        const nextTabTrigger = document.querySelector(`[data-bs-toggle="tab"][data-bs-target="${targetSelector}"]`);
        if (nextTabTrigger) {
          animateTabSwitch(nextTabTrigger);
        }
      }
    });
  });
});

// Debounced resize handler to refresh ScrollSmoother and ScrollTrigger
(function() {
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      if (window.ScrollSmoother && ScrollSmoother.get()) {
        ScrollSmoother.get().refresh();
      }
      if (window.ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    }, 150); // 150ms debounce
  });
})();