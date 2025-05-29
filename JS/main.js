(function () {
  window.addEventListener("load", loadsait);
  
  function fclick(){
    //document.body.style.backgroundstolbor = "linear-gradient(90deg,rgb(42, 123, 155) 0%, rgb(87, 199, 133) 50%, rgb(237, 221, 83) 100%)";
    //document.body.style.background = "linear-gradient(90deg,rgb(42, 123, 155) 0%, rgb(87, 199, 133) 50%, rgb(237, 221, 83) 100%)";
    console.log("click");
  }

  function loadsait() {
    const figures = {
      "O": [[1,1],[1,1],],
      "I": [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
      "S": [[0,1,1],[1,1,0],[0,0,0],],
      "Z": [[1,1,0],[0,1,1],[0,0,0],],
      "L": [[0,0,1],[1,1,1],[0,0,0],],
      "J": [[1,0,0],[1,1,1],[0,0,0],],
      "T": [[0,1,0],[1,1,1],[0,0,0],]
    };

    const colors = {
      "I": "cyan",
      "O": "yellow",
      "T": "purple",
      "S": "green",
      "Z": "red",
      "J": "blue",
      "L": "orange"
    };
    menu();
    let settingsopen =false;

    function create(tag,attributes = {}, parent){
      const el = document.createElement(tag);
      for (const key in attributes) {
        el.setAttribute(key, attributes[key]);
      }
      parent.appendChild(el);
      return el;
    }

    function createbutton(attributes = {}, parent,text,event){
      const el = document.createElement("button");
      for (const key in attributes) {
        el.setAttribute(key, attributes[key]);
      }
      parent.appendChild(el);
      el.textContent = text;
      el.addEventListener("click",event);
      return el;
    }

    function menu(){
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      create("div",{id: "menuarea"},document.body);
      create("div",{id: "menubuttonsarea"},menuarea);
      createbutton({id: "startbutton", class: "menubuttons"}, menubuttonsarea, "Старт", startgame);
      createbutton({id: "testbutton", class: "menubuttons"}, menubuttonsarea, "Тест", fclick);
      createbutton({id: "settingsbutton", class: "menubuttons"}, menubuttonsarea, "Настройки", settings);
      backgroundfigures();
    }

    function settings(){
      let settingsarea = null;
      if(settingsopen){
        document.getElementById("settingsarea").style.left = "15%";
        document.getElementById("settingsarea").style.top = "10%";
      }
      else{
        settingsopen = true;
        settingsarea = create("div",{id: "settingsarea"},menuarea);

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

        let settingsclosebutton = create("img",{id: "settingsclosebutton", src:"Data/exit.jpg", alt:"Выйти"},settingsarea);
        settingsclosebutton.addEventListener("click", function(){
          settingsopen = false;
          settingsarea.remove();
        });

        create("div",{id: "figurecontainer"},settingsarea);
        create("div",{id: "trianglesettings1", class: "triangle"},figurecontainer);
        create("div",{id: "figurearea"},figurecontainer);
        create("div",{id: "trianglesettings2", class: "triangle"},figurecontainer);

        create("div",{id: "colorfigure"},settingsarea);
        create("input",{id: "colorchoose", type: "color", value: "#0000ff"},colorfigure);
        createbutton({id: "colorchoosebutton"}, colorfigure, "Подтвердить", settings);
      }
    }

    
    //    *Анимация фигур на фоне (Сильная нагрузка)
    //  Работа тетриса расписана ниже, в startgame!
    //backgroundfigures переработанная версия
    function backgroundfigures(){
      const backgroundcanvas = create("canvas",{id: "figuresee", width: `${window.innerWidth}`, height: `${window.innerHeight}`},menuarea);
      const backgroundcontext = backgroundcanvas.getContext("2d");
      let figurefield = [];
      for (let stroka = -2; stroka < 40; stroka++) {
        figurefield[stroka] = [];
        for (let stolb = 0; stolb < 34; stolb++) {
          figurefield[stroka][stolb] = 0;
        }
      }
      const block = 32;
      
      let backgroundwork = null;
      let figuresrange = [];
      const figureslist = ["O", "I", "S", "Z", "L", "J", "T"];
      while (figureslist.length) {
        const a = figureslist.splice(randomnum(0, figureslist.length - 1), 1)[0];
        figuresrange.push(a);
      }
      //Массив фигур
      let masfigures = [figure=nextfigure(),figure2=nextfigure(),figure3=nextfigure(),figure4=nextfigure(),figure5=nextfigure(),figure6=nextfigure(),figure7=nextfigure()];

      function randomnum(min, max) {
        return Math.floor(Math.random()*(Math.floor(max)-Math.ceil(min)+1))+Math.ceil(min);
      }

      function nextfigure() {
        const name = figuresrange.pop();
        const matrix = figures[name];
        const stroka = randomnum(-2,-30); 
        const speed = randomnum(8,32);  //Скорость фигуры
        const count = 0;  //Счетчик фигуры
        return {name:name, matrix:matrix,stroka:stroka,speed:speed,count:count};
      }

      function backgroundfiguresgo() {
        backgroundwork = requestAnimationFrame(backgroundfiguresgo);
        backgroundcontext.clearRect(0,0,backgroundcanvas.width,backgroundcanvas.height);
        
        
        for (let Nfigure =0; Nfigure<7;Nfigure++){  //Перебор всех фигур в массиве
          if (++masfigures[Nfigure].count > masfigures[Nfigure].speed) {  //Движение фигуры
            masfigures[Nfigure].stroka++;
            masfigures[Nfigure].count = 0;
            if(masfigures[Nfigure].stroka>=figurefield.length){
              masfigures[Nfigure].stroka=randomnum(-2,-30);
            }
          }
          backgroundcontext.fillStyle = colors[masfigures[Nfigure].name]; //Прорисовка фигуры
          for (let stroka = 0; stroka<masfigures[Nfigure].matrix.length; stroka++) {
            for (let stolb = 0; stolb<masfigures[Nfigure].matrix[stroka].length; stolb++) {
              if (masfigures[Nfigure].matrix[stroka][stolb]) {
                backgroundcontext.fillRect((stolb)*block+window.innerWidth/6*Nfigure+75, (masfigures[Nfigure].stroka+stroka)*block, block-1, block-1);
              }
            }
          }
        }
      }
      backgroundwork = requestAnimationFrame(backgroundfiguresgo);
    }

    //////////////////{ТЕТРИС}///////////////////////

    function startgame(){
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      let size = 1; // Размеры поля

      const canvas = document.createElement('canvas');
      canvas.setAttribute("id", "game");
      canvas.setAttribute("width", `${320*size}`);
      canvas.setAttribute("height", `${640*size}`);
      document.body.append(canvas);
      const context = canvas.getContext("2d");
      
      // Игровое поле
      let figurefield = [];
      for (let stroka = -2; stroka < 20*size; stroka++) {
        figurefield[stroka] = [];
        for (let stolb = 0; stolb < 10*size; stolb++) {
          figurefield[stroka][stolb] = 0;
        }
      }
      const block = 32; //Размер квадратика
      let figuresrange = []; //Последовательность фигур
      let count = 0; //Счётчик для скорости
      let speed = 32; //Скорость падения фигуры
      let figure = nextfigure(); //Текущая фигура
      let animationwork = null;  //https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
      let endgame = false;



      //////////////////{ФУНКЦИИ}///////////////////////

      //    *Рандомайзер от мин до макс.
      //  ceil - округляет и возвращает наименьшее целое число,
      //большее или равное заданному числу.
      //  floor - округляет в меньшую сторону и возвращает наибольшее целое число,
      //меньшее или равное заданному числу.
      function randomnum(min, max) {
        return Math.floor(Math.random()*(Math.floor(max)-Math.ceil(min)+1))+Math.ceil(min);
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

      //    *Возращает следующую фигуру с её параметрами
      //  pop - удаляет последний элемент из массива--
      //и возвращает этот элемент.
      function nextfigure() {
        if (figuresrange.length==0) maderange();
        const name = figuresrange.pop();
        const matrix = figures[name];
        const stolb = figurefield[0].length/2-Math.ceil(matrix[0].length / 2);
        const stroka = name === "I" ? -1 : -2; //Если I, то на одну строку ниже
        return {name:name, matrix:matrix, stolb:stolb, stroka:stroka};
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
                figurefield[cellstroka + stroka][cellstolb + stolb]) //Перескается ли с другими фигурами
              ) {return false;}
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
        for (let stroka = figurefield.length - 1; stroka >= 0; ) {
          if (figurefield[stroka].every(cell => !!cell)) {
            for (let r = stroka; r >= 0; r--) { //Сдвигаем вниз строки
              for (let c = 0; c < figurefield[r].length; c++) {
                figurefield[r][c] = figurefield[r-1][c]; 
              }
            }
          }
          else {
            stroka--;
          }
        }
        figure = nextfigure();
      }

      //      *Анимирование игры
      // fillRect - рисует прямоугольник, заполненный в соответствии с x,y,width,height
      function gamego() {
        animationwork = requestAnimationFrame(gamego);
        context.clearRect(0,0,canvas.width,canvas.height); //Очистка поля
        for (let stroka = 0; stroka < 20*size; stroka++) { //Отрисовка поля и остановившихся фигур
          for (let stolb = 0; stolb < 10*size; stolb++) {
            if (figurefield[stroka][stolb]) {
              const name = figurefield[stroka][stolb];
              context.fillStyle = colors[name];
              context.fillRect(stolb * block, stroka * block, block-1, block-1); //-1 Чтобы фигуры не слипались (На больших размерах всё равно слипается)
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
          for (let stroka = 0; stroka<figure.matrix.length; stroka++) { //Отрисовка фигуры
            for (let stolb = 0; stolb<figure.matrix[stroka].length; stolb++) {
              if (figure.matrix[stroka][stolb]) {
                context.fillRect((figure.stolb+stolb)*block, (figure.stroka+stroka)*block, block-1, block-1);
              }
            }
          }
        }
      }

      //  *Конец игры
      //cancelAnimationFrame - отменяет запрос кадра анимации
      function showendgame() {
        cancelAnimationFrame(animationwork);
        endgame = true;
        create("div",{id: "endarea"},document.body);
        createbutton({id: "returntomenu",}, endarea, "Вернуться в меню", menu);
      }

      /////////////////{Клавиши}/////////////////////
      document.addEventListener("keydown", function(e) {
        if (endgame) return;
        let key = e.key;
        if (key=="ArrowLeft"||key=="ArrowRight") { //  Влево, вправо
          const stolb = key=="ArrowLeft" ? figure.stolb-1 : figure.stolb+1;
          if (canimove(figure.matrix, figure.stroka, stolb)) {
            figure.stolb = stolb;
          }
        }
        if (key=="ArrowUp") { //  Поворот
          const matrix = rotatefigure(figure.matrix);
          if (canimove(matrix, figure.stroka, figure.stolb)) {
            figure.matrix = matrix;
          }
        }

        if(key=="ArrowDown") {  //  Вниз
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
    }
    
  }
})();

