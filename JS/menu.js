import { create, createbutton } from "/js/creators.js";
import { chooseprofile } from "/js/profiles.js";
import { rating } from "/js/rating.js";
import { backgroundfigures } from "/js/backgroundfigures.js";
import { colors } from "/js/constants.js";
export function menu() {
    while (document.body.firstChild) { document.body.removeChild(document.body.firstChild); }
    create("div", { id: "menuarea" }, document.body);
    create("div", { id: "menubuttonsarea" }, menuarea);
    create("div", { id: "namemenu" }, menuarea);
    createbutton({ id: "startbutton", class: "menubuttons" }, menubuttonsarea, "Старт", chooseprofile);
    createbutton({ id: "testbutton", class: "menubuttons" }, menubuttonsarea, "Рейтинг", rating);
    createbutton({ id: "settingsbutton", class: "menubuttons" }, menubuttonsarea, "Настройки", settings);
    backgroundfigures();
}

let stl = 10; //min 4 max 30
let str = 20; //min 4 max 30
let speed = 32; //Скорость падения фигуры
export function returnstl() { return stl };
export function returnstr() { return str };
export function returnspeed() { return speed };

function settings() {
    let settingsarea = null;
    if (document.getElementById("settingsarea") !== null) {
        document.getElementById("settingsarea").style.left = "15%";
        document.getElementById("settingsarea").style.top = "10%";
    }
    else {
        settingsarea = create("div", { id: "settingsarea" }, menuarea);

        let x = 0;
        let y = 0;
        let mousedown = false;
        //=> - (параметры) => выражение или ({тело анонимной функции})
        settingsarea.addEventListener("mousedown", (e) => {
            mousedown = true;
            x = e.clientX - settingsarea.offsetLeft;
            y = e.clientY - settingsarea.offsetTop;
        });
        document.addEventListener("mousemove", (e) => {
            if (mousedown) {
                settingsarea.style.left = e.clientX - x + "px";
                settingsarea.style.top = e.clientY - y + "px";
            }
        });
        document.addEventListener("mouseup", () => {
            mousedown = false;
        });

        let closebutton = create("div", { class: "closebutton" }, settingsarea); //Кнопка выхода
        closebutton.addEventListener("click", function () { settingsarea.remove(); });

        //Раскрас фигуры
        let numfigur = 0;
        create("div", { id: "figurecontainer" }, settingsarea); 
        create("div", { id: "trianglesettings1", class: "triangle" }, figurecontainer);
        trianglesettings1.addEventListener("click", () => {
            numfigur--;
            if (numfigur <= 1) numfigur = 6;
            figurecolorsee.setAttribute("src", "/data/f" + numfigur + ".png")
        });
        create("div", { id: "figurearea" }, figurecontainer);
        const figurecolorsee = create("img", { id: "figurecolorsee", src: "/data/f0.png", alt: "" }, figurearea);
        const trianglesettings2 = create("div", { id: "trianglesettings2", class: "triangle" }, figurecontainer);
        trianglesettings2.addEventListener("click", () => {
            numfigur++;
            if (numfigur >= 7) numfigur = 0;
            figurecolorsee.setAttribute("src", "/data/f" + numfigur + ".png")
        });

        create("div", { id: "colorfigure" }, settingsarea);
        const figurs = ["T", "O", "I", "J", "Z", "S", "L"];
        let colorchoose = create("input", { id: "colorchoose", type: "color", value: "#0000ff" }, colorfigure);
        createbutton({ id: "colorchoosebutton" }, colorfigure, "Подтвердить", ("click", () => {
            colors[figurs[numfigur]] = colorchoose.value;
        }));

        //Настройки игры
        const settingsgamearea = create("div", { id: "settingsgamearea" }, settingsarea);
        const settingsspeed = create("div", { class: "divsettingsgame" }, settingsgamearea);
        const settingsspeedvalue = create("input", { type: "text", class: "settingsseevalue", pattern: "[0-9][0-9]", maxlength: "2", placeholder: "32" }, settingsspeed);
        settingsspeedvalue.value = speed;
        createbutton({ class: "settingsgamebuttons" }, settingsspeed, "ПОДТВЕРДИТЬ", ("click", () => {
            if (settingsspeedvalue.value < 1) {
                settingsspeedvalue.value = 1;
                speed = 1;
            }
            else { speed = settingsspeedvalue.value; }
            settingsspeedvaluenow.textContent = "Сейчас скорость: " + speed + ". [1-99] Чем меньше значение, тем больше скорость";
        }));
        const settingsspeedvaluenow = create("div", { class: "settingsseevaluenow" }, settingsspeed);
        settingsspeedvaluenow.textContent = "Сейчас скорость: " + speed + ". [1-99] Чем меньше значение, тем больше скорость.";

        const settingsstolbic = create("div", { class: "divsettingsgame" }, settingsgamearea);
        const settingsstolbicvalue = create("input", { type: "text", class: "settingsseevalue", pattern: "[0-3][0-9]", maxlength: "2", placeholder: "10" }, settingsstolbic);
        settingsstolbicvalue.value = stl;
        createbutton({ class: "settingsgamebuttons" }, settingsstolbic, "ПОДТВЕРДИТЬ", ("click", () => {
            if(window.screen.width<800){
                if (settingsstolbicvalue.value < 4 || settingsstolbicvalue.value > 16 || settingsstolbicvalue.value % 2 == 1) {
                    settingsstolbicvalue.value = 4;
                    stl = 4;
                }
                else { stl = settingsstolbicvalue.value; }
                settingsstolbicvaluenow.textContent = "Сейчас столбиков: " + stl + ". [4-16] Только четные.";
            }
            else{
                if (settingsstolbicvalue.value < 4 || settingsstolbicvalue.value > 30 || settingsstolbicvalue.value % 2 == 1) {
                    settingsstolbicvalue.value = 4;
                    stl = 4;
                }
                else { stl = settingsstolbicvalue.value; }
                settingsstolbicvaluenow.textContent = "Сейчас столбиков: " + stl + ". [4-30] Только четные.";
            }
        }));
        const settingsstolbicvaluenow = create("div", { class: "settingsseevaluenow" }, settingsstolbic);
        if(window.screen.width<800){settingsstolbicvaluenow.textContent = "Сейчас столбиков: " + stl + ". [4-16] Только четные.";}
        else{settingsstolbicvaluenow.textContent = "Сейчас столбиков: " + stl + ". [4-30] Только четные.";}

        const settingsstroca = create("div", { class: "divsettingsgame" }, settingsgamearea);
        const settingsstrokavalue = create("input", { type: "text", class: "settingsseevalue", pattern: "[0-3][0-9]", maxlength: "2", placeholder: "20" }, settingsstroca);
        settingsstrokavalue.value = str;
        createbutton({ class: "settingsgamebuttons" }, settingsstroca, "ПОДТВЕРДИТЬ", ("click", () => {
            if(window.screen.width<800){
                if (settingsstrokavalue.value < 4 || settingsstrokavalue.value > 24) {
                    settingsstrokavalue.value = 4;
                    str = 4;
                }
                else { str = settingsstrokavalue.value; }
                settingsstrokavaluenow.textContent = "Сейчас строк: " + str + ". [4-24]";
            }
            else{
                if (settingsstrokavalue.value < 4 || settingsstrokavalue.value > 30) {
                    settingsstrokavalue.value = 4;
                    str = 4;
                }
                else { str = settingsstrokavalue.value; }
                settingsstrokavaluenow.textContent = "Сейчас строк: " + str + ". [4-30]";
            }
        }));
        const settingsstrokavaluenow = create("div", { class: "settingsseevaluenow" }, settingsstroca);
        if(window.screen.width<800){settingsstrokavaluenow.textContent = "Сейчас строк: " + str + ". [4-24]";}
        else{settingsstrokavaluenow.textContent = "Сейчас строк: " + str + ". [4-30]";}
    }
}