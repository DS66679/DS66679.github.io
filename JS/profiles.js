import { create, createbutton } from "/js/creators.js";
import { menu } from "/js/menu.js";
import { startgame } from "/js/tetris.js";
export function chooseprofile() {
    while (document.body.firstChild) { document.body.removeChild(document.body.firstChild); }
    create("div", { id: "chooseprofilearea" }, document.body);
    let closebutton = create("div", { class: "closebutton" }, chooseprofilearea);//Кнопка выхода
    closebutton.addEventListener("click", menu);

    //Ввод профиля
    const chooseprofiletext = create("input", { id: "chooseprofiletext", type: "text", placeholder: "Введите название профиля" }, chooseprofilearea);
    chooseprofiletext.addEventListener("keydown", profilekeydown);
    chooseprofiletext.addEventListener("keyup", profilekeyup);
    //Список профилей
    create("div", { id: "listprofiles" }, chooseprofilearea);
    const yourprofile = create("div", { id: "yourprofile" }, chooseprofilearea);
    if (localStorage) {
        yourprofile.textContent = localStorage.getItem("profilenow");
        let masprofiles = JSON.parse(localStorage.getItem("profiles"));
        for (let i = 0; i < masprofiles.length; i++) {
            createprofileN(i, masprofiles[i]);
        }
    }
    //Кнопки взаимодействия
    create("div", { id: "buttonsprofile" }, chooseprofilearea);
    createbutton({ id: "startgamenewprofile", class: "profilebuttons" }, buttonsprofile, "Играть", startgame);
    const createnewprofile = createbutton({ id: "createnewprofile", class: "profilebuttons" }, buttonsprofile, "Создать", createprofile);
    createnewprofile.disabled = true;
    const choosenewprofile = createbutton({ id: "choosenewprofile", class: "profilebuttons" }, buttonsprofile, "Выбрать", choosethisprofile);
    choosenewprofile.disabled = true;

    //Функции
    let selectprofilenow = null;
    let before = 0;
    function selectprofile() {
        document.getElementsByClassName("numprofile")[before].style.removeProperty('background-color');
        this.style.backgroundColor = "red";
        selectprofilenow = this.textContent;
        before = this.dataset.indexNumber;
        document.getElementById('choosenewprofile').disabled = false;
    }

    function createprofileN(index, text) {
        const numprofile = create("div", { class: "numprofile" }, listprofiles);
        numprofile.dataset.indexNumber = index;
        numprofile.addEventListener("click", selectprofile);
        numprofile.textContent = text;
    }

    function createprofile() {
        if (localStorage) {
            let masprofiles = JSON.parse(localStorage.getItem("profiles"));
            createprofileN(masprofiles.length, document.getElementById("chooseprofiletext").value);
            createnewprofile.disabled = true;
            masprofiles.push(document.getElementById("chooseprofiletext").value);
            localStorage.setItem("profiles", JSON.stringify(masprofiles));
            localStorage.setItem("profilenow", document.getElementById("chooseprofiletext").value);
            yourprofile.textContent = document.getElementById("chooseprofiletext").value;
        }
    }

    function choosethisprofile() {
        if (localStorage) {
            localStorage.setItem("profilenow", selectprofilenow);
            yourprofile.textContent = selectprofilenow;
        }
    }

    function profilekeydown() {
        let masprofiles = JSON.parse(localStorage.getItem("profiles"));
        for (let i = 0; i < masprofiles.length; i++) {
            if (masprofiles[i] != this.value) { createnewprofile.disabled = false; }
            else { createnewprofile.disabled = true; }
        }
    }

    function profilekeyup(event) {
        let key = event.key;
        if (this.value.length > 0) { createnewprofile.disabled = false; }
        if (key == "Backspace" || key == "Delete") {
            if (localStorage && this.value.length < 1) {
                createnewprofile.disabled = true;
            }
        }
    }
}