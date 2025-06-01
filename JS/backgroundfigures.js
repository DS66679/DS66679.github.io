import { create } from "/JS/creators.js";
import { figures, colors } from "/JS/constants.js";
//    *Анимация фигур на фоне (Сильная нагрузка)
//  Работа тетриса расписана ниже, в startgame!
//backgroundfigures переработанная версия
export function backgroundfigures() {
    const backgroundcanvas = create("canvas", { id: "figuresee", width: `${window.innerWidth}`, height: `${window.innerHeight}` }, menuarea);
    const backgroundcontext = backgroundcanvas.getContext("2d");
    let figurefield = [];
    for (let stroka = -2; stroka < 40; stroka++) {
        figurefield[stroka] = [];
        for (let stolb = 0; stolb < 34; stolb++) {
            figurefield[stroka][stolb] = 0;
        }
    }
    const block = 32;

    let figuresrange = [];
    const figureslist = ["O", "I", "S", "Z", "L", "J", "T"];
    while (figureslist.length) {
        const a = figureslist.splice(randomnum(0, figureslist.length - 1), 1)[0];
        figuresrange.push(a);
    }

    //Массив фигур
    let masfigures = [nextfigure(), nextfigure(), nextfigure(), nextfigure(), nextfigure(), nextfigure(), nextfigure()];

    function randomnum(min, max) {
        return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
    }

    function nextfigure() {
        const name = figuresrange.pop();
        const matrix = figures[name];
        const stroka = randomnum(-2, -30);
        const speed = randomnum(8, 32);  //Скорость фигуры
        const count = 0;  //Счетчик фигуры
        return { name: name, matrix: matrix, stroka: stroka, speed: speed, count: count };
    }

    let backgroundwork = null;

    function backgroundfiguresgo() {
        backgroundwork = requestAnimationFrame(backgroundfiguresgo);
        backgroundcontext.clearRect(0, 0, backgroundcanvas.width, backgroundcanvas.height);


        for (let Nfigure = 0; Nfigure < 7; Nfigure++) {  //Перебор всех фигур в массиве
            if (++masfigures[Nfigure].count > masfigures[Nfigure].speed) {  //Движение фигуры
                masfigures[Nfigure].stroka++;
                masfigures[Nfigure].count = 0;
                if (masfigures[Nfigure].stroka >= figurefield.length) {
                    masfigures[Nfigure].stroka = randomnum(-2, -30);
                    masfigures[Nfigure].speed = randomnum(8, 32);
                }
            }
            backgroundcontext.fillStyle = colors[masfigures[Nfigure].name]; //Прорисовка фигуры
            for (let stroka = 0; stroka < masfigures[Nfigure].matrix.length; stroka++) {
                for (let stolb = 0; stolb < masfigures[Nfigure].matrix[stroka].length; stolb++) {
                    if (masfigures[Nfigure].matrix[stroka][stolb]) {
                        backgroundcontext.fillRect((stolb) * block + window.innerWidth / 6 * Nfigure + 75, (masfigures[Nfigure].stroka + stroka) * block, block - 1, block - 1);
                    }
                }
            }
        }
    }
    backgroundwork = requestAnimationFrame(backgroundfiguresgo);
}