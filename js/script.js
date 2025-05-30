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

  // Dropdown-tab sync for mobile
  // (Added by AI for mobile tab dropdown)
  var dropdown = document.getElementById('sectionTabsDropdown');
  if (!dropdown) return;

  dropdown.addEventListener('change', function () {
    var tabId = this.value;
    var tabTrigger = document.querySelector('[data-bs-target="#' + tabId + '"]');
    if (tabTrigger) {
      var tab = new bootstrap.Tab(tabTrigger);
      tab.show();
    }
  });

  // Keep dropdown in sync with tab changes (for arrow buttons, etc)
  var tabButtons = document.querySelectorAll('#sectionTabs button[data-bs-toggle="tab"]');
  tabButtons.forEach(function (btn) {
    btn.addEventListener('shown.bs.tab', function (e) {
      dropdown.value = e.target.getAttribute('data-bs-target').replace('#', '');
    });
  });

  // Accordion plus/minus icon toggle using Font Awesome
  document.querySelectorAll('.accordion-button').forEach(function(btn) {
    // Remove any existing icon
    let iconSpan = btn.querySelector('.accordion-icon');
    if (iconSpan) iconSpan.remove();
    // Add icon span
    let span = document.createElement('span');
    span.className = 'accordion-icon';
    // Set icon based on collapsed state
    if (btn.classList.contains('collapsed')) {
      span.innerHTML = '<i class="fa-solid fa-plus"></i>';
    } else {
      span.innerHTML = '<i class="fa-solid fa-minus"></i>';
    }
    btn.appendChild(span);
  });

  // Listen for accordion show/hide events to toggle icon
  document.querySelectorAll('.accordion').forEach(function(acc) {
    acc.addEventListener('show.bs.collapse', function(e) {
      let btn = e.target.previousElementSibling.querySelector('.accordion-button');
      if (btn) {
        let icon = btn.querySelector('.accordion-icon i');
        if (icon) icon.className = 'fa-solid fa-minus';
      }
    });
    acc.addEventListener('hide.bs.collapse', function(e) {
      let btn = e.target.previousElementSibling.querySelector('.accordion-button');
      if (btn) {
        let icon = btn.querySelector('.accordion-icon i');
        if (icon) icon.className = 'fa-solid fa-plus';
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

// === HERO SECTION ANIMATION (GSAP) ===
let lastHeroMode = null; // Track last mode: 'desktop' or 'mobile'
let heroTimeline = null; // Store timeline to kill on mode change
function animateHeroSection() {
  // Elements
  const leftImage = document.getElementById('heroLeftImage');
  const leftDialogue = document.getElementById('heroLeftDialogue');
  const zoeImage = document.getElementById('heroZoeImage');
  const zoeDialogue = document.getElementById('heroZoeDialogue');
  const heroRow = document.querySelector('.hero-bottom-row');

  // Detect mode
  const desktop = window.matchMedia('(min-width: 991px)').matches;
  const mode = desktop ? 'desktop' : 'mobile';
  if (lastHeroMode === mode) return; // Only animate if mode changes
  lastHeroMode = mode;

  // Kill previous timeline if exists
  if (heroTimeline) heroTimeline.kill();

  // Reset all
  gsap.set([leftImage, leftDialogue, zoeImage, zoeDialogue], {clearProps: 'all'});

  if (desktop) {
    // Desktop animation
    if (zoeDialogue) zoeDialogue.src = 'image/zoe-dialogue.png';
    gsap.set([leftImage, leftDialogue, zoeImage, zoeDialogue], {autoAlpha: 0});
    gsap.set(leftImage, {xPercent: -50, left: '50%', right: 'auto', position: 'absolute', zIndex: 2});
    gsap.set(leftDialogue, {xPercent: -50, left: '70%', right: 'auto', position: 'absolute', zIndex: 3});
    gsap.set(zoeImage, {right: 0, left: 'auto', position: 'absolute', zIndex: 2});
    gsap.set(zoeDialogue, {right: '25%', left: 'auto', position: 'absolute', zIndex: 3});

    heroTimeline = gsap.timeline();
    heroTimeline.to(leftImage, {autoAlpha: 1, duration: 0.6, ease: 'power2.out'})
      .to(leftDialogue, {autoAlpha: 1, duration: 0.5, ease: 'power2.out'}, '+=0.2')
      .to(leftImage, {
        xPercent: 0,
        left: 0,
        duration: 0.7,
        ease: 'power2.inOut',
        stagger: 0.05
      })
      .to(leftDialogue, {
        xPercent: 0,
        left: '30%',
        duration: 0.7,
        ease: 'power2.inOut',
        stagger: 0.05
      }, '<')
      .to(zoeImage, {autoAlpha: 1, x: 60, duration: 0.7, ease: 'power2.out'}, '-=0.3')
      .to(zoeImage, {x: 0, duration: 0.4, ease: 'power2.inOut'}, '-=0.2')
      .to(zoeDialogue, {autoAlpha: 1, duration: 0.5, ease: 'power2.out'}, '-=0.2');
  } else {
    // Mobile animation
    if (zoeDialogue) zoeDialogue.src = 'image/zoe-dialogue-mobile.png';
    gsap.set([leftImage, leftDialogue, zoeImage, zoeDialogue], {autoAlpha: 0});
    gsap.set(leftImage, {xPercent: -50, left: '50%', right: 'auto', position: 'absolute', zIndex: 2});
    gsap.set(leftDialogue, {xPercent: -50, left: '70%', right: 'auto', position: 'absolute', zIndex: 3});
    gsap.set(zoeImage, {xPercent: 50, left: '50%', right: 'auto', position: 'absolute', zIndex: 2});
    gsap.set(zoeDialogue, {xPercent: 50, left: 0, right: 'auto', position: 'absolute', zIndex: 3});

    heroTimeline = gsap.timeline();
    heroTimeline.to(leftImage, {autoAlpha: 1, duration: 0.6, ease: 'power2.out'})
      .to(leftDialogue, {autoAlpha: 1, duration: 0.5, ease: 'power2.out'}, '+=0.2')
      .to([leftImage, leftDialogue], {
        x: '-60vw',
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power2.inOut',
        stagger: 0.05
      })
      .to(zoeImage, {
        autoAlpha: 1,
        xPercent: -50,
        x: 0,
        duration: 0.7,
        left: '60%',
        ease: 'power2.out',
        stagger: 0.1
      }, '-=0.3')
       .to(zoeDialogue, {
        autoAlpha: 1,
        xPercent: 0,
        x: 0,
        duration: 0.7,
        left: '0%',
        ease: 'power2.out',
        stagger: 0.1
      }, '-=0.3');
  }
}

// Run on load
animateHeroSection();
// Re-run on resize/orientation change
window.addEventListener('resize', () => {
  animateHeroSection();
});