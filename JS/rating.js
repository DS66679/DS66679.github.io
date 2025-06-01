import { create } from "/JS/creators.js";
import { menu } from "/JS/menu.js";
export function rating() {
    while (document.body.firstChild) { document.body.removeChild(document.body.firstChild); }
    const ratingarea = create("div", { id: "ratingarea" }, document.body);
    const closebutton = create("div", { class: "closebutton" }, ratingarea);//Кнопка выхода
    closebutton.addEventListener("click", menu);
    //Таблица лидеров
    const scoretext = create("div", { id: "scoretext" }, ratingarea);
    scoretext.textContent = "Таблица лидеров:"
    const scorearea = create("div", { id: "scorearea" }, ratingarea);
    if (localStorage) {
        let masrating = JSON.parse(localStorage.getItem("scoretop"));
        for (let i = 0; i < masrating[1].length; i++) {
            const numprofile = create("div", { class: "numrating" }, scorearea);
            const numratingname = create("div", { class: "numratingname" }, numprofile);
            numratingname.textContent = masrating[0][i];
            const numratingscore = create("div", { class: "numratingscore" }, numprofile);
            numratingscore.textContent = masrating[1][i];
        }
    }
}