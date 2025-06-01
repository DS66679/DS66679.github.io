(function () {
  window.addEventListener("load", loadsait);

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
    localStorage.clear()
    if (localStorage){
      if(localStorage.scoretop==null){
        let nullscoreresult = [["...","...","...","...","...","...","...","...","...","..."], [0,0,0,0,0,0,0,0,0,0]];
        //let nullscoreresult = [["a","b","c","d","e","f","g","h","i","j"], [9,8,7,6,5,4,3,2,1,0]];
        localStorage.setItem("scoretop", JSON.stringify(nullscoreresult));
      }
      if(localStorage.profiles==null){
        let nullprofiles = ["Player"];
        localStorage.setItem("profiles",JSON.stringify(nullprofiles));
      }
      if(localStorage.getItem("profilenow")!==null){
        profilenow = localStorage.getItem("profilenow");
      }
      else{
        localStorage.setItem("profilenow", "Player");
        profilenow = "Player";
      }
    }

    console.log(localStorage)
    console.log(localStorage.profiles)

    menu();
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
      while (document.body.firstChild) {document.body.removeChild(document.body.firstChild);}
      create("div",{id: "menuarea"},document.body);
      create("div",{id: "menubuttonsarea"},menuarea);
      createbutton({id: "startbutton", class: "menubuttons"}, menubuttonsarea, "Старт", chooseprofile);
      createbutton({id: "testbutton", class: "menubuttons"}, menubuttonsarea, "Рейтинг", rating);
      createbutton({id: "settingsbutton", class: "menubuttons"}, menubuttonsarea, "Настройки", settings);
      backgroundfigures();
    }

    function settings(){
      let settingsarea = null;
      if(document.getElementById("settingsarea")!==null){
        document.getElementById("settingsarea").style.left = "15%";
        document.getElementById("settingsarea").style.top = "10%";
      }
      else{
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

        let closebutton = create("img",{class: "closebutton", src:"Data/exit.jpg", alt:"Выйти"},settingsarea);
        closebutton.addEventListener("click", function(){settingsarea.remove();});

        create("div",{id: "figurecontainer"},settingsarea);
        create("div",{id: "trianglesettings1", class: "triangle"},figurecontainer);
        create("div",{id: "figurearea"},figurecontainer);
        create("div",{id: "trianglesettings2", class: "triangle"},figurecontainer);

        create("div",{id: "colorfigure"},settingsarea);
        create("input",{id: "colorchoose", type: "color", value: "#0000ff"},colorfigure);
        createbutton({id: "colorchoosebutton"}, colorfigure, "Подтвердить", settings);
      }
    }

    function chooseprofile(){
      while (document.body.firstChild) {document.body.removeChild(document.body.firstChild);}
      create("div",{id: "chooseprofilearea"},document.body);
      let closebutton = create("img",{id:"profileclosebutton",class: "closebutton", src:"Data/exit.jpg", alt:"Выйти"},chooseprofilearea);
      closebutton.addEventListener("click", menu);
      const chooseprofiletext = create("input",{id: "chooseprofiletext", type: "text", placeholder: "Введите название профиля"},chooseprofilearea);
      chooseprofiletext.addEventListener("keydown", profilekeydown);
      chooseprofiletext.addEventListener("keyup", profilekeyup);
      create("div",{id: "listprofiles"},chooseprofilearea);
      const yourprofile = create("div",{id: "yourprofile"},chooseprofilearea);
      if (localStorage){
        yourprofile.textContent=localStorage.getItem("profilenow");
        let masprofiles = JSON.parse(localStorage.getItem("profiles"));
        for(let i=0; i<masprofiles.length;i++){
          createprofileN(i,masprofiles[i]);
        }
      }
      create("div",{id: "buttonsprofile"},chooseprofilearea);
      createbutton({id: "startgamenewprofile", class: "profilebuttons"}, buttonsprofile, "Играть", startgame);
      const createnewprofile = createbutton({id: "createnewprofile", class: "profilebuttons"}, buttonsprofile, "Создать", createprofile);
      createnewprofile.disabled=true;
      const choosenewprofile = createbutton({id: "choosenewprofile", class: "profilebuttons"}, buttonsprofile, "Выбрать", choosethisprofile);
      choosenewprofile.disabled=true;


      let selectprofilenow=null;
      let before = 0;
      function selectprofile(){
        console.log(document.getElementsByClassName("numprofile")[before])
        document.getElementsByClassName("numprofile")[before].style.removeProperty('background-color');;
        this.style.backgroundColor = "red";
        selectprofilenow = this.textContent;
        before = this.dataset.indexNumber;
        document.getElementById('choosenewprofile').disabled=false;
      }

      function createprofileN(index,text){
        const numprofile = create("div",{class: "numprofile"},listprofiles);
        numprofile.dataset.indexNumber = index;
        numprofile.addEventListener("click", selectprofile);
        numprofile.textContent=text;
      }

      function createprofile(){
        if(localStorage){
          let masprofiles = JSON.parse(localStorage.getItem("profiles"));
          createprofileN(masprofiles.length,document.getElementById("chooseprofiletext").value);
          createnewprofile.disabled=true;
          masprofiles.push(document.getElementById("chooseprofiletext").value);
          localStorage.setItem("profiles", JSON.stringify(masprofiles));
          localStorage.setItem("profilenow", document.getElementById("chooseprofiletext").value);
          yourprofile.textContent=document.getElementById("chooseprofiletext").value;
        }
      }

      function choosethisprofile(){
        if(localStorage){
          localStorage.setItem("profilenow", selectprofilenow);
          yourprofile.textContent=selectprofilenow;
        }
      }

      function profilekeydown(){
        if (this.value.length>0) {
          let masprofiles = JSON.parse(localStorage.getItem("profiles"));
          for(let i=0; i<masprofiles.length;i++){
            if(masprofiles[i]!=this.value){createnewprofile.disabled=false;}
            else{createnewprofile.disabled=true;}
          }
        }
      }

      function profilekeyup(event){
        let key = event.key;
        if (key == "Backspace" || key == "Delete") { 
          if (localStorage&&this.value.length < 1) {
            createnewprofile.disabled=true;
          }
        }
      }
    }


    function rating(){
      while (document.body.firstChild) {document.body.removeChild(document.body.firstChild);}
      const ratingarea = create("div",{id: "ratingarea"},document.body);
      const closebutton = create("img",{id:"profileclosebutton",class: "closebutton", src:"Data/exit.jpg", alt:"Выйти"},ratingarea);
      closebutton.addEventListener("click", menu);
      const scoretext = create("div",{id: "scoretext"},ratingarea);
      scoretext.textContent = "Таблица лидеров:"
      const scorearea = create("div",{id: "scorearea"},ratingarea);
      if (localStorage){
        let masrating = JSON.parse(localStorage.getItem("scoretop"));
        for(let i=0; i<masrating[1].length;i++){
          const numprofile = create("div",{class: "numrating"},scorearea);
          const numratingname = create("div",{class: "numratingname"},numprofile);
          numratingname.textContent = masrating[0][i];
          const numratingscore = create("div",{class: "numratingscore"},numprofile);
          numratingscore.textContent = masrating[1][i];
        }
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
              masfigures[Nfigure].speed=randomnum(8,32);
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
      let score = 0;
      let sec = 0;
      let min = 0;
      let timersec =null
      while (document.body.firstChild) {document.body.removeChild(document.body.firstChild);}
      create("div",{id: "gamecontainer"},document.body);
      create("div",{id: "gamestats"},gamecontainer);
      const gamescore = create("div",{id: "gamescore"},gamestats);
      scoreplus(0);
      const gametime = create("div",{id: "gametime"},gamestats);
      gametime.textContent="0:00";
      timer();
      create("div",{id: "pausearea"},gamecontainer);
      const divpausemenu = create("div",{id: "divpausemenu"},pausearea);
      divpausemenu.addEventListener("click",gamemenuon);
      const divpause = create("div",{id: "divpause"},pausearea);
      divpause.addEventListener("click",pause);

      let size = 1; // Размеры поля
      const canvas = create("canvas",{id: "game", width: `${320*size}`, height: `${640*size}`},gamecontainer);
      const context = canvas.getContext("2d");
      
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
      let gamepause = false;



      //////////////////{ФУНКЦИИ}///////////////////////

      function scoreplus(plusscore){
        score += plusscore;
        gamescore.textContent="Счет: "+score;
      }

      function timer() {
        timersec = setInterval(function() {
          sec++;
          if(sec>=60){
            sec=0;
            min++;
            gametime.textContent=min+":"+sec;
          }
          else if(sec<10){
            gametime.textContent=min+":0"+sec;
          }
          else{
            gametime.textContent=min+":"+sec;
          }
        }, 1000);
      }

      document.addEventListener("visibilitychange", () => {
        if (!gamepause) document.hidden ? clearInterval(timersec) : timer()
      ;});

      function pause(){
        if(document.getElementById("gamemenu")!==null){
          document.getElementById("gamemenu").remove();
        }
        if(gamepause){
          animationwork = requestAnimationFrame(gamego);
          timer();
          gamepause=false;
        }
        else{
          cancelAnimationFrame(animationwork);
          clearInterval(timersec);
          gamepause=true;
        }
      }

      function gamemenuon(){
        if(document.getElementById("gamemenu")!==null) pause();
        else{
          if(!gamepause) pause();
          const gamemenu = create("div",{id: "gamemenu"},gamecontainer);

          create("div",{id: "gamemenustats"},gamemenu);
          const gamemenuscore = create("div",{id: "gamescore"},gamemenustats);
          gamemenuscore.textContent="Счет: "+score;
          const gamemenutime = create("div",{id: "gametime"},gamemenustats);
          sec <10 ? gamemenutime.textContent=min+":0"+sec : gamemenutime.textContent=min+":"+sec;
          
          if(endgame){
            createbutton({id: "replaybutton", class:"gamemenubuttons"}, gamemenu, "Начать заново", replay);
          }
          else{
            createbutton({id: "pausebutton", class:"gamemenubuttons"}, gamemenu, "Продолжить", pause);
          }
          createbutton({id: "returntomenu", class:"gamemenubuttons"}, gamemenu, "Вернуться в меню", backtomenu);
        }
      }

      function saveresult(){
        if(localStorage){
          let masscore = JSON.parse(localStorage.getItem("scoretop"));
          for(let i =0; i<masscore[1].length;i++){
            if(masscore[1][i]<score){
              let a = score;
              let b = localStorage.getItem("profilenow");
              for(let j=i;j<masscore[1].length;j++){
                let c = masscore[1][j];
                let d = masscore[0][j]
                masscore[1][j]=a;
                masscore[0][j]=b;
                a=c;
                b=d;
              }
              break;
            }
          }
          localStorage.setItem("scoretop", JSON.stringify(masscore));
        }
      }
      
      function replay(){saveresult();startgame();}
      function backtomenu(){saveresult();menu();}

      //  *Конец игры
      //cancelAnimationFrame - отменяет запрос кадра анимации
      function showendgame() {
        cancelAnimationFrame(animationwork);
        clearInterval(timersec);
        endgame = true;
        gamemenuon();
      }

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

      //    *Возвращает следующую фигуру с её параметрами
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
                figurefield[cellstroka + stroka][cellstolb + stolb]) //Пересекается ли с другими фигурами
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
            scoreplus(10);
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

      

      /////////////////{Клавиши}/////////////////////
      document.addEventListener("keydown", function(e) {
        if (endgame||gamepause) return;
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

