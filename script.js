document.addEventListener("DOMContentLoaded", () => {

  /* ---- Mobile menu toggle ---- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close the menu when the window is resized to desktop width
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900 && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  /* ---- Image placeholders ----
     Shows the gray "Image" box until a real image file loads.
     Drop your photos into /images with the filenames used in index.html. */
  document.querySelectorAll(".img-slot img").forEach((img) => {
    const slot = img.closest(".img-slot");
    const onLoad = () => slot.classList.add("has-image");
    const onError = () => img.remove();

    if (img.complete) {
      img.naturalWidth > 0 ? onLoad() : onError();
    } else {
      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);
    }
  });

});
