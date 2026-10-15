// Keep page padding and scroll targets clear of the fixed navbar, even when text wraps.
const siteNavigation = document.querySelector(".site-nav");
if (siteNavigation) {
  const updateNavigationHeight = function () {
    document.documentElement.style.setProperty("--nav-height", `${siteNavigation.getBoundingClientRect().height}px`);
  };
  updateNavigationHeight();
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(updateNavigationHeight).observe(siteNavigation);
  } else {
    window.addEventListener("resize", updateNavigationHeight);
  }
}
