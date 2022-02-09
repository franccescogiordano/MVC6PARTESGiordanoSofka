(function () {
    self.Board = function (width, height) { //ObJETO ESCENARIO
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.playing = false;
        this.endgame = false;
        this.puntajeganador = 10;
        this.player1pts = 0;
        this.player2pts = 0;
        this.yasumepuntos = false;
    }

    self.Board.prototype = { //PROTOTIPO ESCENARIO
        get elements() {
            var elements = this.bars.map(function (bar) { return bar; }); //cambio para no llenar de basura la memoria
            elements.push(this.ball);
            return elements;
        }
    }
})();
//-------------------------PELOTA--------------------------------
(function () {
    self.ball = function (x, y, radius, board) { //ObJETO PELOTA
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 4;
        this.board = board;
        board.ball = this;
        this.kind = "circle";
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 4;


    }
    self.ball.prototype = { //PROTOTIPO PELOTA
        move: function () {
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
        },
        get width() {
            return this.radius * 2;
        },
        get height() {
            return this.radius * 2;
        },
        collision: function (bar) {//REACCIONA AL CHOQUE CON LA bARRA 
            var relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;

            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle);

            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if (this.x > (this.board.width / 2)) this.direction = -1;

            else this.direction = 1;
        }
    }
})();
//-------------------------PELOTA FIN--------------------------------

//-------------------------bARRAS------------------------------------
(function () { //funcion para crear las barras
    self.Bar = function (x, y, width, height, board) { //ObJETO bARRAS
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fillStyle = '#c81d11';
        this.board = board;
        this.board.bars.push(this); //accedo al board y al bars , luego lo envio
        this.kind = "rectangle";
        this.speed = 15;
    }

    self.Bar.prototype = { //mover las barras
        down: function () {
            this.y += this.speed;
        },
        up: function () {
            this.y -= this.speed;
        }
    }
})();
//-------------------------bARRAS FIN------------------------------------

//-------------------------ESCENARIO------------------------------------
(function () {
    self.BoardView = function (canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype = { //bOARD PROTOTIPO
        clean: function () {
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function () {
            for (var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i]; //buscamos elemento a dibujar
                draw(this.ctx, el)
            };
        },
        checko_collisions: function () {
            for (var i = this.board.bars.length - 1; i >= 0; i--) {
                var bar = this.board.bars[i];
                if (hit(bar, this.board.ball)) {
                    this.board.ball.collision(bar);
                }
            };

            this.board.yasumepuntos = false;
        },
        verificarestadojuego: function () {
            if (this.board.endgame) { //SI UN JUGADOR ANOTA
                if (this.board.player1pts >= this.board.puntajeganador || this.board.player2pts >= this.board.puntajeganador) { //SI SE LLEGO AL MAXIMO DE PUNTOS
                    reset(true);
                    return;
                }
                reset(false);
            }
        },
        play: function () {
            if (this.board.playing) {
                this.clean();
                this.draw();
                this.checko_collisions();
                this.verificarestadojuego();
     //------------------VERIFICACION PARA QUE LAS PALETAS NO SALGAN DEL TABLERO-----------------  /*|*/
   /*|*/if (bar.y <= 1) bar.y = 1;                                                                 /*|*/
   /*|*/ else if (bar.y >= this.board.height - bar.height) bar.y = this.board.height - bar.height; /*|*/
    /*|*/if (bar2.y <= 1) bar2.y = 1;                                                              /*|*/
    /*|*/else if (bar2.y >= this.board.height - bar2.height) bar2.y = this.board.height - bar2.height - 1;/*|*/
     /*|*/   this.board.ball.move();                                                                     /*|*/
                //--------------------------------------------------------------------------------------------------------
                document.querySelector('#jugador1').innerHTML = this.board.player1pts;
                document.querySelector('#jugador2').innerHTML = this.board.player2pts;
            }
        }
    }
    //-------------------------ESCENARIO FIN------------------------------------   

    function hit(paleta, pelota) { //CATALOGA DOS ObJETOS DE TAL FORMA QUE SE SABE SI ESTOS COLISIONAN 
        var hit = false;
        let velocidad = 3;
        if (pelota.x >= this.board.width - pelota.radius) {
            this.board.endgame = true;
            if (!this.board.yasumepuntos) {
                this.board.player1pts += 0.5;

            }
        }

        if (pelota.x <= pelota.radius) {
            this.board.endgame = true;

            if (!this.board.yasumepuntos) {
                this.board.player2pts += 0.5;
            }
        }
        if (pelota.y <= pelota.radius ) { //PEGA ARRIBA
            pelota.speed_y = 3;
        } else if (pelota.y >= this.board.height - pelota.radius) { //pega abajo
            pelota.speed_y = -3;
        }

        if (pelota.x + pelota.width >= paleta.x && pelota.x < paleta.x + paleta.width) {
            if (pelota.y + pelota.height >= paleta.y && pelota.y < paleta.y + paleta.height)
                hit = true;
        }
        if (pelota.x <= paleta.x && pelota.x + pelota.width >= paleta.x + paleta.width) {
            if (pelota.y <= paleta.y && pelota.y + pelota.height >= paleta.y + paleta.height) {
                hit = true;
            }
        }//a
        if (paleta.x <= pelota.x && paleta.x + paleta.width >= pelota.x + pelota.width) {
            if (paleta.y <= pelota.y && paleta.y + paleta.height >= pelota.y + pelota.height) {
                hit = true;

            }
        }
        return hit;
    }

    //-------------------------DIbUJOS------------------------------------
    function draw(ctx, element) {

        switch (element.kind) {
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                ctx.fillStyle = "#ffffff";
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }

    }
})();
//--------------------------RESETEO------------------------------------------------------------

//this.board.height ancho this.board.width alto
function reset(hard) {
    pelotax = (this.board.width / 2);
    pelotay = (this.board.height / 2);
    ball.speed_y = 0;
    ball.speed_x = 3;
    ball.x = 350;
    ball.y = 180;
    bar.x = 20;
    bar.y = (this.board.height / 2) - (bar.height / 2);
    bar2.x = (this.board.width - bar2.width - 20);
    bar2.y = (this.board.height / 2) - (bar2.height / 2);
    this.board.endgame = false;
    if (hard) {
        bar.x = 20;
        bar.y = (this.board.height / 2) - (bar.height / 2);

        bar2.x = (this.board.width - bar2.width - 20);
        bar2.y = (this.board.height / 2) - (bar2.height / 2);

        if (this.board.player1pts >= this.board.puntajeganador) {
            //texto.innerHTML="Ganador: Jugador 1"
            console.log("GANADOR 1");
        } else {
            //texto.innerHTML="Ganador: Jugador 2"
            console.log("GANADOR 2");
        }
        this.board.endgame = true;
    }
}
//--------------------------------------------------------------------------------------------
//CREACION E INSTANCIA DE ObJETOS
var board = new Board(800, 400);
var bar = new Bar(20, 100, 40, 100, board);
var bar2 = new Bar(740, 100, 40, 100, board);
var canvas = document.getElementById('canvas', board);
var board_view = new BoardView(canvas, board);
var ball = new ball(350, 180, 10, board);


document.addEventListener("keydown", function (ev) {

    if (ev.keyCode == 38) {
        ev.preventDefault();
        bar2.up();
    } else if (ev.keyCode == 40) {
        ev.preventDefault();
        bar2.down();
    } else if (ev.keyCode == 87) {//this.board.width
        ev.preventDefault();
        bar.up();
    } else if (ev.keyCode == 83) {//s
        ev.preventDefault();
        bar.down();
    } else if (ev.keyCode == 32) {//PAUSA CON SPACE
        ev.preventDefault();
        board.playing = !board.playing;
    }
});



window.requestAnimationFrame(controller);
board_view.draw();
setTimeout(function () {
    ball.direction = -1;
});
function controller() {
    board_view.play();
    window.requestAnimationFrame(controller);

}

