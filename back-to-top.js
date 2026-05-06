const backToTop = document.querySelector(".back-to-top");

function updateBackToTop() {
  if (!backToTop) {
    return;
  }

  backToTop.classList.toggle("visible", window.scrollY > 420);
}

if (backToTop) {
  backToTop.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateBackToTop();
  window.addEventListener("scroll", updateBackToTop, { passive: true });
}
