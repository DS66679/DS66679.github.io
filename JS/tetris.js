import { create, createbutton } from "/JS/creators.js";
import { figures, colors } from "/JS/constants.js";
import { menu, returnstl, returnstr, returnspeed } from "/JS/menu.js";
//////////////////{ТЕТРИС}///////////////////////
export function startgame() {
    let stl = returnstl();
    let str = returnstr();
    let speed = returnspeed();
    let score = 0;
    let sec = 0;
    let min = 0;
    let timersec = null
    while (document.body.firstChild) { document.body.removeChild(document.body.firstChild); }
    create("div", { id: "gamecontainer" }, document.body);
    create("div", { id: "gamestats" }, gamecontainer);
    const gamescore = create("div", { id: "gamescore" }, gamestats);
    scoreplus(0);
    const gametime = create("div", { id: "gametime" }, gamestats);
    gametime.textContent = "0:00";
    timer();
    create("div", { id: "pausearea" }, gamecontainer);
    const divpausemenu = create("div", { id: "divpausemenu" }, pausearea);
    divpausemenu.addEventListener("click", gamemenuon);
    const divpause = create("div", { id: "divpause" }, pausearea);
    divpause.addEventListener("click", pause);

    let block = 32; //Размер квадратика
    if(window.screen.width<800){ //Для телефонов
        block = 20;
        const mobilebuttons = create("div", { id: "mobilebuttons" }, gamecontainer);
        const leftbutton = create("div", { id: "leftbutton" }, mobilebuttons);
        leftbutton.addEventListener("click", () => {
            if (!(endgame || gamepause)&&(canimove(figure.matrix, figure.stroka, figure.stolb - 1))) {figure.stolb = figure.stolb - 1;}
        });
        const downbutton = create("div", { id: "downbutton" }, mobilebuttons);
        downbutton.addEventListener("click", () => {
            const stroka = figure.stroka + 1;
            if (!(endgame || gamepause)&&!canimove(figure.matrix, stroka, figure.stolb)) {
                figure.stroka = stroka - 1;
                endmove();
                return;
            }
            figure.stroka = stroka;
        });
        const roratebutton = create("div", { id: "roratebutton" }, mobilebuttons);
        roratebutton.addEventListener("click", () => {
            const matrix = rotatefigure(figure.matrix);
            if (!(endgame || gamepause)&&canimove(matrix, figure.stroka, figure.stolb)) {
                figure.matrix = matrix;
            }
        });
        const rightbutton = create("div", { id: "rightbutton" }, mobilebuttons);
        rightbutton.addEventListener("click", () => {
            if (!(endgame || gamepause)&&canimove(figure.matrix, figure.stroka, figure.stolb + 1)) {figure.stolb = figure.stolb + 1;}
        });
    }

    const canvas = create("canvas", { id: "game", width: `${block * stl}`, height: `${block * str}` }, gamecontainer);
    const context = canvas.getContext("2d");

    let figurefield = [];
    for (let stroka = -2; stroka < str; stroka++) {
        figurefield[stroka] = [];
        for (let stolb = 0; stolb < stl; stolb++) {
            figurefield[stroka][stolb] = 0;
        }
    }
    let figuresrange = []; //Последовательность фигур
    let count = 0; //Счётчик для скорости
    let figure = nextfigure(); //Текущая фигура
    let animationwork = null;  //https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
    let endgame = false;
    let gamepause = false;

    //////////////////{ФУНКЦИИ}///////////////////////

    function scoreplus(plusscore) {
        score += plusscore;
        gamescore.textContent = "Счет: " + score;
    }

    function timer() {
        timersec = setInterval(function () {
            sec++;
            if (sec >= 60) {
                sec = 0;
                min++;
                gametime.textContent = min + ":" + sec;
                if (speed > 6) {
                    speed--;
                }
            }
            else if (sec < 10) {
                gametime.textContent = min + ":0" + sec;
            }
            else {
                gametime.textContent = min + ":" + sec;
            }
        }, 1000);


    }

    function pause() {
        if (document.getElementById("gamemenu") !== null) {
            document.getElementById("gamemenu").remove();
        }
        if (gamepause) {
            animationwork = requestAnimationFrame(gamego);
            timer();
            gamepause = false;
        }
        else {
            cancelAnimationFrame(animationwork);
            clearInterval(timersec);
            gamepause = true;
        }
    }

    function gamemenuon() {
        if (document.getElementById("gamemenu") !== null) pause();
        else {
            if (!gamepause) pause();
            const gamemenu = create("div", { id: "gamemenu" }, gamecontainer);

            create("div", { id: "gamemenustats" }, gamemenu);
            const gamemenuscore = create("div", { id: "gamescore" }, gamemenustats);
            gamemenuscore.textContent = "Счет: " + score;
            const gamemenutime = create("div", { id: "gametime" }, gamemenustats);
            sec < 10 ? gamemenutime.textContent = min + ":0" + sec : gamemenutime.textContent = min + ":" + sec;

            if (endgame) {
                createbutton({ id: "replaybutton", class: "gamemenubuttons" }, gamemenu, "Начать заново", replay);
            }
            else {
                createbutton({ id: "pausebutton", class: "gamemenubuttons" }, gamemenu, "Продолжить", pause);
            }
            createbutton({ id: "returntomenu", class: "gamemenubuttons" }, gamemenu, "Вернуться в меню", backtomenu);
        }
    }

    function saveresult() {
        score += min * 10;
        if (localStorage) {
            let masscore = JSON.parse(localStorage.getItem("scoretop"));
            for (let i = 0; i < masscore[1].length; i++) {
                if (masscore[1][i] < score) {
                    let a = score;
                    let b = localStorage.getItem("profilenow");
                    for (let j = i; j < masscore[1].length; j++) {
                        let c = masscore[1][j];
                        let d = masscore[0][j]
                        masscore[1][j] = a;
                        masscore[0][j] = b;
                        a = c;
                        b = d;
                    }
                    break;
                }
            }
            localStorage.setItem("scoretop", JSON.stringify(masscore));
        }
    }

    function replay() { saveresult(); startgame(); }
    function backtomenu() { saveresult(); menu(); }

    //    *Рандомайзер от мин до макс.
    //  ceil - округляет и возвращает наименьшее целое число,
    //большее или равное заданному числу.
    //  floor - округляет в меньшую сторону и возвращает наибольшее целое число,
    //меньшее или равное заданному числу.
    function randomnum(min, max) {
        return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
    }

    //    *Генератор последовательности
    //randomnum - рандомная фигура
    //splice - убираем из массива
    //push - добавляем в последовательность
    function maderange() {
        const figureslist = ["O", "I", "S", "Z", "L", "J", "T"];
        while (figureslist.length) {
            const a = figureslist.splice(randomnum(0, figureslist.length - 1), 1)[0];
            figuresrange.push(a);
        }
    }

    //    *Возвращает следующую фигуру с её параметрами
    //  pop - удаляет последний элемент из массива--
    //и возвращает этот элемент.
    function nextfigure() {
        if (figuresrange.length == 0) maderange();
        const name = figuresrange.pop();
        const matrix = figures[name];
        const stolb = figurefield[0].length / 2 - Math.ceil(matrix[0].length / 2);
        const stroka = name === "I" ? -1 : -2; //Если I, то на одну строку ниже
        return { name: name, matrix: matrix, stolb: stolb, stroka: stroka };
    }

    //    *Поворот фигуры
    //  map - содержит пары ключ-значение и запоминает исходный порядок вставки ключей.
    //1) Перебор каждой строки - i 2)Перебор значения строки - j
    // 3) Идем по столбцу (i), заполняя его (matrix.length - 1 - j)
    function rotatefigure(matrix) {
        return matrix.map((stroka, i) => stroka.map((val, j) => matrix[matrix.length - 1 - j][i]));
    }

    //    *Допустимость движения, поворота фигуры
    function canimove(matrix, cellstroka, cellstolb) {
        for (let stroka = 0; stroka < matrix.length; stroka++) {
            for (let stolb = 0; stolb < matrix[stroka].length; stolb++) {
                if (matrix[stroka][stolb] && ( //Есть ли часть нашей фигуры
                    cellstolb + stolb < 0 || //Выход за левую границу
                    cellstolb + stolb >= figurefield[0].length || //Выход за правую границу
                    cellstroka + stroka >= figurefield.length || //Выход за нижнюю границу
                    figurefield[cellstroka + stroka][cellstolb + stolb]) //Пересекается ли с другими фигурами
                ) { return false; }
            }
        }
        return true;
    }

    //    *Проверка остановки фигуры
    function endmove() {
        for (let stroka = 0; stroka < figure.matrix.length; stroka++) {
            for (let stolb = 0; stolb < figure.matrix[stroka].length; stolb++) {
                if (figure.matrix[stroka][stolb]) {//Есть ли часть нашей фигуры
                    if (figure.stroka + stroka < 0) {//Выход за верхнюю границу, конец игры
                        return showendgame();
                    }
                    //Иначе сохранение фигуры на том месте
                    figurefield[figure.stroka + stroka][figure.stolb + stolb] = figure.name;
                }
            }
        }

        // Проверка заполности строк
        //cell - клетка
        //!!cell:
        //!!0 = false
        //!!1 = true
        //!!null = false
        //!!someNonZeroNumber = true
        //!!undefined = false
        let bonus = 0;
        for (let stroka = figurefield.length - 1; stroka >= 0;) {
            if (figurefield[stroka].every(cell => !!cell)) {
                bonus++;
                for (let r = stroka; r >= 0; r--) { //Сдвигаем вниз строки
                    for (let c = 0; c < figurefield[r].length; c++) {
                        figurefield[r][c] = figurefield[r - 1][c];
                    }
                }
            }
            else {
                stroka--;
            }
        }
        if (bonus > 0) {
            scoreplus((10 + bonus) * bonus);
        }
        figure = nextfigure();
    }

    //      *Анимирование игры
    // fillRect - рисует прямоугольник, заполненный в соответствии с x,y,width,height
    function gamego() {
        animationwork = requestAnimationFrame(gamego);
        context.clearRect(0, 0, canvas.width, canvas.height); //Очистка поля
        for (let stroka = 0; stroka < str; stroka++) { //Отрисовка поля и остановившихся фигур
            for (let stolb = 0; stolb < stl; stolb++) {
                if (figurefield[stroka][stolb]) {
                    const name = figurefield[stroka][stolb];
                    context.fillStyle = colors[name];
                    context.fillRect(stolb * block, stroka * block, block - 1, block - 1); //-1 Чтобы фигуры не слипались (На больших размерах всё равно слипается)
                }
            }
        }
        if (figure) {
            if (++count > speed) { //движение фигуры
                figure.stroka++;
                count = 0;
                if (!canimove(figure.matrix, figure.stroka, figure.stolb)) { //Проверка возможности двигаться
                    figure.stroka--;
                    endmove();
                }
            }
            context.fillStyle = colors[figure.name]; //Цвет фигуры
            for (let stroka = 0; stroka < figure.matrix.length; stroka++) { //Отрисовка фигуры
                for (let stolb = 0; stolb < figure.matrix[stroka].length; stolb++) {
                    if (figure.matrix[stroka][stolb]) {
                        context.fillRect((figure.stolb + stolb) * block, (figure.stroka + stroka) * block, block - 1, block - 1);
                    }
                }
            }
        }
    }

    //  *Конец игры
    //cancelAnimationFrame - отменяет запрос кадра анимации
    function showendgame() {
        cancelAnimationFrame(animationwork);
        clearInterval(timersec);
        endgame = true;
        gamemenuon();
    }

    /////////////////{Клавиши}/////////////////////
    document.addEventListener("keydown", function (e) {
        if (endgame || gamepause) return;
        let key = e.key;
        if (key == "ArrowLeft" || key == "ArrowRight") { //  Влево, вправо
            const stolb = key == "ArrowLeft" ? figure.stolb - 1 : figure.stolb + 1;
            if (canimove(figure.matrix, figure.stroka, stolb)) {
                figure.stolb = stolb;
            }
        }
        if (key == "ArrowUp") { //  Поворот
            const matrix = rotatefigure(figure.matrix);
            if (canimove(matrix, figure.stroka, figure.stolb)) {
                figure.matrix = matrix;
            }
        }

        if (key == "ArrowDown") {  //  Вниз
            const stroka = figure.stroka + 1;
            if (!canimove(figure.matrix, stroka, figure.stolb)) {
                figure.stroka = stroka - 1;
                endmove();
                return;
            }
            figure.stroka = stroka;
        }
    });

    // старт игры
    animationwork = requestAnimationFrame(gamego);

    document.addEventListener("visibilitychange", () => {
        if (!gamepause) document.hidden ? clearInterval(timersec) : timer()
            ;
    });
}