(function(){
    self.Board = function(width,height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    self.Board.prototype = {
        get elements(){
            var elements = this.bars;
            elements.push(this.ball);
            return elements;
        }
    }
})();
(function(){
self.Ball= function(x,y,radius,board){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed_y = 0
    this.speed_x = 3
    this.board = board;
    board.ball=this;
    this.kind="circle";
}
})();
(function(){ //funcion para crear las barras
    self.Bar=function(x,y,width,height,board){
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

(function(){
    self.BoardView=function(canvas,board){
        this.canvas=canvas;
        this.canvas.width=board.width;
        this.canvas.height=board.height;
        this.board=board;
        this.ctx=canvas.getContext("2d");
    }

    self.BoardView.prototype = {
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
        this.clean();
        this.draw();
       }
   }
   
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
    var board = new Board (800,400);
    var bar = new Bar(20,100,40,100,board);
    var bar2 = new Bar(740,100,40,100,board);
    var canvas= document.getElementById('canvas',board);
    var board_view= new BoardView(canvas,board);
    var ball= new Ball(350,180,10,board);
   
    
document.addEventListener("keydown",function(ev){
    ev.preventDefault();
    if(ev.keyCode == 38){
        bar.up();
    }else if(ev.keyCode == 40){
        bar.down();
    }else if(ev.keyCode == 87){//w
        bar2.up();
    }else if(ev.keyCode == 83){//s
        bar2.down();
    }else{
        ev.preventDefault();
    }
});

window.requestAnimationFrame(controller);

function controller(){
    board_view.play();
    window.requestAnimationFrame(controller);

}

