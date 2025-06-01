import { menu } from "/js/menu.js";
(function () {
  window.addEventListener("load", loadsait);

  function loadsait() {
    if (localStorage) {
      if (localStorage.scoretop == null) {
        let nullscoreresult = [["...", "...", "...", "...", "...", "...", "...", "...", "...", "..."], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        localStorage.setItem("scoretop", JSON.stringify(nullscoreresult));
      }
      if (localStorage.profiles == null) {
        let nullprofiles = ["Player"];
        localStorage.setItem("profiles", JSON.stringify(nullprofiles));
      }
    }
    menu();
  }
})();

