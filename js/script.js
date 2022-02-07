(function(){
    self.Board = function(width,height){ //OBJETO ESCENARIO
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.playing= false;
    }

    self.Board.prototype = { //PROTOTIPO ESCENARIO
        get elements(){
            var elements = this.bars.map(function(bar){return bar;}); //cambio para no llenar de basura la memoria
            elements.push(this.ball);
            return elements;
        }
    }
})();
//-------------------------PELOTA--------------------------------
(function(){
self.Ball= function(x,y,radius,board){ //OBJETO PELOTA
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed_y = 0
    this.speed_x = 3
    this.board = board;
    board.ball=this;
    this.kind="circle";



}
self.Ball.prototype = { //PROTOTIPO PELOTA
    move: function(){
        this.x +=(this.speed_y * this.direction);
        this.y +=(this.speed_x * this.direction);
    }
}
})();
//-------------------------PELOTA FIN--------------------------------

//-------------------------BARRAS------------------------------------
(function(){ //funcion para crear las barras
    self.Bar=function(x,y,width,height,board){ //OBJETO BARRAS
     this.x=x;
     this.y=y;
     this.width=width;
     this.height=height;
     this.board=board;
     this.board.bars.push(this); //accedo al board y al bars , luego lo envio
     this.kind="rectangle";
     this.speed=15;
    }

    self.Bar.prototype={ //mover las barras
        down: function (){
            this.y+=this.speed;
        },
        up: function(){
            this.y-=this.speed;
        }
    }
    })();
//-------------------------BARRAS FIN------------------------------------

//-------------------------ESCENARIO------------------------------------
(function(){
    self.BoardView=function(canvas,board){
        this.canvas=canvas;
        this.canvas.width=board.width;
        this.canvas.height=board.height;
        this.board=board;
        this.ctx=canvas.getContext("2d");
    }

    self.BoardView.prototype = { //BOARD PROTOTIPO
        clean:function(){
            this.ctx.clearRect(0,0,this.board.width,this.board.height);
        },
        draw:function(){
            for (var i = this.board.elements.length - 1; i >= 0; i--){
              var el = this.board.elements[i]; //buscamos elemento a dibujar
              draw(this.ctx,el)
            };
       },
       play: function(){
    if(this.board.playing){
        this.clean();
        this.draw();
        this.board.ball.move();
    }
  }
   }
//-------------------------ESCENARIO FIN------------------------------------   

//-------------------------DIBUJOS------------------------------------
   function draw(ctx,element){
       // if(element !== null && element.hasOwnProperty("kind")){
            switch(element.kind){
                case "rectangle":
               ctx.fillRect(element.x,element.y,element.width,element.height);  
                break;
                case "circle":
                    ctx.beginPath();
                    ctx.arc(element.x,element.y,element.radius,0,7);
                    ctx.fill();
                    ctx.closePath();
                    break;
            }
     //   } 
    }
    })();

    //CREACION E INSTANCIA DE OBJETOS
    var board = new Board (800,400);
    var bar = new Bar(20,100,40,100,board);
    var bar2 = new Bar(740,100,40,100,board);
    var canvas= document.getElementById('canvas',board);
    var board_view= new BoardView(canvas,board);
    var ball= new Ball(350,180,10,board);
   
    
document.addEventListener("keydown",function(ev){

    if(ev.keyCode == 38){
        ev.preventDefault();
        bar.up();
    }else if(ev.keyCode == 40){
        ev.preventDefault();
        bar.down();
    }else if(ev.keyCode == 87){//w
        ev.preventDefault();
        bar2.up();
    }else if(ev.keyCode == 83){//s
        ev.preventDefault();
        bar2.down();
    }else if(ev.keyCode == 32){//PAUSA CON SPACE
       ev.preventDefault();
       board.playing=!board.playing;
    }
});



window.requestAnimationFrame(controller);
board_view.draw();
setTimeout(function(){
ball.direction = -1;
});
function controller(){
    board_view.play();
    window.requestAnimationFrame(controller);

}

