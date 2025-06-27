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

  // --- Custom Dropdown for Mobile Tabs ---
  var dropdownBtn = document.querySelector('.custom-dropdown-selected');
  var dropdownMenu = document.querySelector('.custom-dropdown-list');
  if (dropdownBtn && dropdownMenu) {
    var btnTextSpan = dropdownBtn.querySelector('.dropdown-btn-text');
    dropdownMenu.querySelectorAll('.dropdown-item').forEach(function(item) {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        // Update button text
        if (btnTextSpan) btnTextSpan.textContent = this.textContent;
        // Update active class
        dropdownMenu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        // Switch tab
        var tabId = this.getAttribute('data-tab');
        var tabTrigger = document.querySelector('[data-bs-target="#' + tabId + '"]');
        if (tabTrigger) {
          var tab = new bootstrap.Tab(tabTrigger);
          tab.show();
        }
      });
    });
    // Keep dropdown in sync with tab changes (arrows, etc)
    var tabButtons = document.querySelectorAll('#sectionTabs button[data-bs-toggle="tab"]');
    tabButtons.forEach(function (btn) {
      btn.addEventListener('shown.bs.tab', function (e) {
        var tabId = e.target.getAttribute('data-bs-target').replace('#', '');
        var activeItem = dropdownMenu.querySelector('.dropdown-item[data-tab="' + tabId + '"]');
        if (activeItem && btnTextSpan) {
          btnTextSpan.textContent = activeItem.textContent;
          dropdownMenu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
          activeItem.classList.add('active');
        }
      });
    });
  }
  // END Custom Dropdown for Mobile Tabs

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

  // --- Dot indicator sync for mobile tab navigation ---
  const tabIds = ['tab0', 'tab1', 'tab2', 'tab3', 'tab4'];
  // For each tab-image-wrapper, sync the dots
  document.querySelectorAll('.tab-image-wrapper').forEach(function(wrapper, tabIdx) {
    const dotContainer = wrapper.querySelector('.tab-dot-indicators');
    if (!dotContainer) return;
    const dots = dotContainer.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', function(e) {
        e.preventDefault();
        // Show the corresponding tab
        const tabTrigger = document.querySelector(`[data-bs-toggle="tab"][data-bs-target="#${tabIds[idx]}"]`);
        if (tabTrigger) {
          var tab = new bootstrap.Tab(tabTrigger);
          tab.show();
        }
      });
    });
  });
  // When a tab is shown, update all dot indicators
  document.querySelectorAll('#sectionTabs button[data-bs-toggle="tab"]').forEach(function(tabBtn, idx) {
    tabBtn.addEventListener('shown.bs.tab', function(e) {
      const activeTabId = e.target.getAttribute('data-bs-target');
      document.querySelectorAll('.tab-dot-indicators').forEach(function(dotContainer) {
        const dots = dotContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', `#${tabIds[i]}` === activeTabId);
        });
      });
    });
  });

  // --- Dropdown arrow icon swap on open/close ---
  var dropdownBtnEl = document.getElementById('roomDropdown');
  if (dropdownBtnEl) {
    dropdownBtnEl.addEventListener('show.bs.dropdown', function () {
      var icon = dropdownBtnEl.querySelector('.tab-dropdown-arrow i');
      if (icon) {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
      }
    });
    dropdownBtnEl.addEventListener('hide.bs.dropdown', function () {
      var icon = dropdownBtnEl.querySelector('.tab-dropdown-arrow i');
      if (icon) {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
      }
    });
  }
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
let heroAnimPaused = false; // Track pause state
let heroAnimCompleted = false; // Track if animation completed

function animateHeroSection() {
  // Elements
  const leftImage = document.getElementById('heroLeftImage');
  const leftDialogue = document.getElementById('heroLeftDialogue');
  const zoeImage = document.getElementById('heroZoeImage');
  const zoeDialogue = document.getElementById('heroZoeDialogue');
  const heroRow = document.querySelector('.hero-bottom-row');
  const animControlBtn = document.getElementById('heroAnimControlBtn');

  // Detect mode
  const desktop = window.matchMedia('(min-width: 1025px)').matches;
  const mode = desktop ? 'desktop' : 'mobile';
  if (lastHeroMode === mode) return; // Only animate if mode changes
  lastHeroMode = mode;

  // Kill previous timeline if exists
  if (heroTimeline) heroTimeline.kill();

  // Reset all
  gsap.set([leftImage, leftDialogue, zoeImage, zoeDialogue], {clearProps: 'all'});

  // Reset control state
  heroAnimPaused = false;
  heroAnimCompleted = false;
  if (animControlBtn) {
    animControlBtn.textContent = 'Pause Animation';
    animControlBtn.disabled = false;
    animControlBtn.style.display = desktop ? 'none' : 'inline-block';
  }

  if (desktop) {
    // Desktop animation
    if (zoeDialogue) zoeDialogue.src = 'image/zoe-dialogue.svg';
    gsap.set([leftImage, leftDialogue, zoeImage, zoeDialogue], {autoAlpha: 0});
    gsap.set(leftImage, {xPercent: -50, left: '50%', right: 'auto', position: 'absolute', zIndex: 2});
    gsap.set(leftDialogue, {xPercent: -50, left: '70%', right: 'auto', position: 'absolute', zIndex: 3});
    gsap.set(zoeImage, {right: 0, left: 'auto', position: 'absolute', zIndex: 2});
    gsap.set(zoeDialogue, {right: '25%', left: 'auto', position: 'absolute', zIndex: 3});

    heroTimeline = gsap.timeline();
    heroTimeline.to(leftImage, {autoAlpha: 1, duration: 1, ease: 'power2.out'})
      .to(leftDialogue, {autoAlpha: 1, duration: 1, ease: 'power2.out'}, '+=0.2')
      .to(leftImage, {
        xPercent: 0,
        left: 0,
        duration: 1,
        ease: 'power2.inOut',
        stagger: 0.05
      })
      .to(leftDialogue, {
        xPercent: 0,
        left: '30%',
        duration: 1,
        ease: 'power2.inOut',
        stagger: 0.05
      }, '<')
      .to(zoeImage, {autoAlpha: 1, x: 60, duration: 1, ease: 'power2.out'}, '+=0.3')
      .to(zoeImage, {x: 0, duration: 0.6, ease: 'power2.inOut'}, '-=0.2')
      .to(zoeDialogue, {autoAlpha: 1, duration: 0.6, ease: 'power2.out'}, '-=0.2');
  } else {


    // Mobile animation
    if (zoeDialogue) zoeDialogue.src = 'image/zoe-dialogue-mobile.svg';
    gsap.set([leftImage, leftDialogue, zoeImage, zoeDialogue], {autoAlpha: 0});
    gsap.set(leftImage, {xPercent: -50, left: '50%', right: 'auto', position: 'absolute', zIndex: 2});
    gsap.set(leftDialogue, {xPercent: -50, left: '70%', right: 'auto', position: 'absolute', zIndex: 3});
    gsap.set(zoeImage, {xPercent: 50, left: '50%', right: 'auto', position: 'absolute', zIndex: 2});
    gsap.set(zoeDialogue, {xPercent: 50, left: '10%', right: 'auto', position: 'absolute', zIndex: 3});

    heroTimeline = gsap.timeline({
      onComplete: function() {
        heroAnimCompleted = true;
        if (animControlBtn) {
          animControlBtn.textContent = 'Replay Animation';
          animControlBtn.disabled = false;
        }
      }
    });
    heroTimeline.to(leftImage, {autoAlpha: 1, duration: 0.6, ease: 'power2.out'})
      .to(leftDialogue, {autoAlpha: 1, duration: 0.5, ease: 'power2.out'}, '+=0.2')
      .to([leftImage, leftDialogue], {
        x: '-60vw',
        autoAlpha: 0,
        duration: 1,
        ease: 'power2.inOut',
        stagger: 0.05
      }, '+5')
      .to(zoeImage, {
        autoAlpha: 1,
        xPercent: -50,
        x: 0,
        duration: 1,
        left: '60%',
        ease: 'power2.out',
        stagger: 0.1
      }, '+=0.3')
       .to(zoeDialogue, {
        autoAlpha: 1,
        xPercent: 0,
        x: 0,
        duration: 1,
        left: '5%',
        ease: 'power2.out',
        stagger: 0.1
      }, '-=0.3');
  }

  // Button logic (mobile only)
  if (animControlBtn && !desktop) {
    animControlBtn.onclick = function() {
      if (heroAnimCompleted) {
        // Replay
        heroTimeline.restart();
        heroAnimCompleted = false;
        animControlBtn.textContent = 'Pause Animation';
      } else if (!heroAnimPaused) {
        // Pause
        heroTimeline.pause();
        heroAnimPaused = true;
        animControlBtn.textContent = 'Resume Animation';
      } else {
        // Resume
        heroTimeline.play();
        heroAnimPaused = false;
        animControlBtn.textContent = 'Pause Animation';
      }
    };
  }
}

// Run on load
animateHeroSection();
// Re-run on resize/orientation change
window.addEventListener('resize', () => {
  animateHeroSection();
});

// === LOTTIE GAUGE POINTER (SCROLL SCRUB, PAUSE ON STOP) ===
document.addEventListener('DOMContentLoaded', function() {
  var lottieContainer = document.getElementById('gauge-pointer-lottie');
  if (lottieContainer && window.lottie) {
    var lottieAnim = lottie.loadAnimation({
      container: lottieContainer,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: 'js/pointer.json'
    });
    lottieAnim.addEventListener('DOMLoaded', function() {
      var totalFrames = lottieAnim.totalFrames;
      var lastFrame = 0;
      var ticking = false;
      var scrollObj = {progress: 0};

      // GSAP scroll scrub: set frame based on scroll progress
      gsap.to(scrollObj, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.first-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: function(self) {
            // Only update frame if user is actively scrolling
            if (!ticking) {
              ticking = true;
              requestAnimationFrame(function() {
                var frame = Math.round(scrollObj.progress * (totalFrames - 1));
                lottieAnim.goToAndStop(frame, true);
                ticking = false;
              });
            }
          }
        }
      });
    });
  }
});


