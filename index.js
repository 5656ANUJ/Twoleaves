// Slider configuration and elements
const slider = document.getElementById("slider");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const dots = document.querySelectorAll(".dot");

const totalSlides = 2;
let currentSlide = 0;
let autoplayInterval = null;

// Update slider visual state
function updateSlider() {
  if (!slider) return;
  
  // Apply translation
  slider.style.transform = `translateX(-${currentSlide * 100}vw)`;

  // Hide/show navigation buttons gracefully
  if (prevBtn) {
    prevBtn.style.opacity = currentSlide === 0 ? "0" : "1";
    prevBtn.style.pointerEvents = currentSlide === 0 ? "none" : "auto";
  }
  if (nextBtn) {
    nextBtn.style.opacity = currentSlide === totalSlides - 1 ? "0" : "1";
    nextBtn.style.pointerEvents = currentSlide === totalSlides - 1 ? "none" : "auto";
  }

  // Update dots indicator active states
  dots.forEach((dot, index) => {
    if (index === currentSlide) {
      dot.classList.add("bg-white");
      dot.classList.remove("bg-white/50", "scale-100");
      dot.classList.add("scale-125");
    } else {
      dot.classList.remove("bg-white", "scale-125");
      dot.classList.add("bg-white/50", "scale-100");
    }
  });
}

// Autoplay functionality
function startAutoplay() {
  stopAutoplay();
  autoplayInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  }, 6000);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

function resetAutoplay() {
  stopAutoplay();
  startAutoplay();
}

// Click interactions
if (nextBtn) {
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      updateSlider();
      resetAutoplay();
    }
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentSlide > 0) {
      currentSlide--;
      updateSlider();
      resetAutoplay();
    }
  });
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const targetSlide = Number(dot.dataset.slide);
    if (!isNaN(targetSlide) && targetSlide !== currentSlide) {
      currentSlide = targetSlide;
      updateSlider();
      resetAutoplay();
    }
  });
});

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (slider) {
  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  // Hover states to pause/resume autoplay
  const container = slider.parentElement;
  if (container) {
    container.addEventListener("mouseenter", stopAutoplay);
    container.addEventListener("mouseleave", startAutoplay);
  }
}

function handleSwipe() {
  const swipeThreshold = 50;
  if (touchEndX < touchStartX - swipeThreshold) {
    // Swipe left -> Next slide
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      updateSlider();
      resetAutoplay();
    }
  } else if (touchEndX > touchStartX + swipeThreshold) {
    // Swipe right -> Previous slide
    if (currentSlide > 0) {
      currentSlide--;
      updateSlider();
      resetAutoplay();
    }
  }
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      updateSlider();
      resetAutoplay();
    }
  } else if (e.key === "ArrowLeft") {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlider();
      resetAutoplay();
    }
  }
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateSlider();
  startAutoplay();
});

// Fallback in case DOMContentLoaded already fired
if (document.readyState === "interactive" || document.readyState === "complete") {
  updateSlider();
  startAutoplay();
}

// Product Slider Navigation
const prodSlider = document.getElementById("product-slider");
const prodPrevBtn = document.getElementById("prod-prev");
const prodNextBtn = document.getElementById("prod-next");

if (prodSlider && prodPrevBtn && prodNextBtn) {
  // Width of card (320px) + Gap (32px) = 352px
  const scrollAmount = 352;

  prodNextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    prodSlider.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  prodPrevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    prodSlider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  // Dynamically update arrow button opacities depending on scroll state
  const updateProductButtons = () => {
    const scrollLeft = prodSlider.scrollLeft;
    const maxScroll = prodSlider.scrollWidth - prodSlider.clientWidth;

    // Fade out previous button if at the start
    if (scrollLeft <= 10) {
      prodPrevBtn.style.opacity = "0";
      prodPrevBtn.style.pointerEvents = "none";
    } else {
      prodPrevBtn.style.opacity = "1";
      prodPrevBtn.style.pointerEvents = "auto";
    }

    // Fade out next button if at the end
    if (scrollLeft >= maxScroll - 10) {
      prodNextBtn.style.opacity = "0";
      prodNextBtn.style.pointerEvents = "none";
    } else {
      prodNextBtn.style.opacity = "1";
      prodNextBtn.style.pointerEvents = "auto";
    }

    // Update Slider Progress Indicator
    const prodProgress = document.getElementById("prod-progress");
    if (prodProgress && prodSlider.scrollWidth > 0) {
      const visibleRatio = Math.min(1, prodSlider.clientWidth / prodSlider.scrollWidth);
      const thumbWidthPercent = Math.max(15, visibleRatio * 100); // minimum 15% width
      prodProgress.style.width = `${thumbWidthPercent}%`;
      
      if (maxScroll > 0) {
        const scrollPercent = Math.min(1, Math.max(0, scrollLeft / maxScroll));
        const leftPercent = scrollPercent * (100 - thumbWidthPercent);
        prodProgress.style.left = `${leftPercent}%`;
      } else {
        prodProgress.style.left = "0%";
      }
    }
  };

  // Listen for scroll events on the carousel
  prodSlider.addEventListener("scroll", updateProductButtons);
  
  // Re-adjust visibility on window resize
  window.addEventListener("resize", updateProductButtons);

  // Initial calculation after elements and assets are rendered
  setTimeout(updateProductButtons, 300);
}
// Mobile Menu Drawer Logic
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const closeDrawerBtn = document.getElementById("close-drawer-btn");
const mobileDrawer = document.getElementById("mobile-drawer");
const drawerBackdrop = document.getElementById("drawer-backdrop");
const drawerContent = document.getElementById("drawer-content");

function openDrawer() {
  if (!mobileDrawer) return;
  mobileDrawer.classList.remove("hidden");
  setTimeout(() => {
    if (drawerBackdrop) drawerBackdrop.classList.remove("opacity-0");
    if (drawerContent) drawerContent.classList.remove("-translate-x-full");
  }, 10);
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  if (!mobileDrawer) return;
  if (drawerBackdrop) drawerBackdrop.classList.add("opacity-0");
  if (drawerContent) drawerContent.classList.add("-translate-x-full");
  setTimeout(() => {
    mobileDrawer.classList.add("hidden");
  }, 300);
  document.body.style.overflow = "";
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", openDrawer);
}
if (closeDrawerBtn) {
  closeDrawerBtn.addEventListener("click", closeDrawer);
}
if (drawerBackdrop) {
  drawerBackdrop.addEventListener("click", closeDrawer);
}

const words = ["chai tea", "hot coffee", "iced matcha", "bubble tea"];
let text = document.getElementById("typing-text");
let index = 0;
let textbox = document.querySelector("#textbox");

window.addEventListener("click",(e) => {
  if (!textbox) return;
  if (e.target == textbox || textbox.contains(e.target)) {
    textbox.classList.add("md:max-w-[1000px]");
    textbox.classList.remove("max-w-[500px]");
  }
  else {
    textbox.classList.remove("md:max-w-[1000px]");
    textbox.classList.add("max-w-[500px]");
  }
})

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function typingEffect() {
  while (true) {
    let currentword = words[index];

    // text writing effect
    for (let i = 0; i < currentword; i++){
      text.textContent = currentword.substring(0, i);
      await delay(150);
    }

    await delay(1000);

    for (let i = currentword.length; i >= 0; i--) {
      text.textContent = currentword.substring(0, i);
      await delay(75); // Speed of erasing (usually faster than typing)
    }
    await delay(500);

    index = (index + 1) % words.length;
  }
}

document.addEventListener("DOMContentLoaded" ,typingEffect());

