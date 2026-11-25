const copyrightYear = new Intl.DateTimeFormat("id-ID", {
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

function updateCopyrightYear() {
  const year = document.querySelector("[data-copyright-year]");
  if (year) year.textContent = ` ${copyrightYear.format(new Date())}`;
}

if (typeof document$ !== "undefined") document$.subscribe(updateCopyrightYear);
else updateCopyrightYear();
