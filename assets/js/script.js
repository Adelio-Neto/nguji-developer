const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navmenu a");

window.addEventListener("scroll", () => {
  let scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionTop = current.offsetTop - 100;
    const sectionHeight = current.offsetHeight;
    const sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const whatsappBtn = document.querySelector(".scroll-whatsapp");

  function toggleWhatsappButton() {
    if (window.scrollY > 100) {
      whatsappBtn.classList.add("active");
    } else {
      whatsappBtn.classList.remove("active");
    }
  }

  window.addEventListener("scroll", toggleWhatsappButton);
  toggleWhatsappButton();
});
