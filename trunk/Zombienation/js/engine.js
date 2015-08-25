(function() {
    
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) 
    {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
    {
        window.requestAnimationFrame = function(callback, element) 
        {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };        
    }
 
    if (!window.cancelAnimationFrame)
    {
        window.cancelAnimationFrame = function(id) 
        {
            clearTimeout(id);
        };
        
    }

}());

var Game = new function ()
{
    var boards = [];

    this.init = function(canvasElementId, sprite_data, callback)
    {
        this.canvas = document.getElementById(canvasElementId);
        
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
        if (!this.ctx)
        {
            return alert("Please upgrade your browser to play.");
        }
        
        this.loop();

        SpriteSheet.load(sprite_data, undefined);
    }

    var lastTime = new Date().getTime();
    var maxTime = 1/30;

    this.loop = function (curTime)
    {
        requestAnimationFrame(Game.loop);
        var dt = (curTime - lastTime)/1000;
        if (dt > maxTime) 
        { 
            dt = maxTime;
        }
        lastTime = curTime;
    }

    this.setBoard = function(num,board) 
    { 
        boards[num] = board; 
    };    
}

var SpriteSheet = new function() 
{
    this.map = { }; 
    this.load = function(spriteData, callback) 
    { 
        this.map = spriteData;
        this.image = new Image();
        this.image.onload = callback;
        this.image.src = 'images/sprites.png';
    };

    this.draw = function(ctx, sprite, x, y, frame) 
    {
        var s = this.map[sprite];
        
        if(!frame) 
        {
            frame = 0;
        }
        
        ctx.drawImage(this.image, s.sx + frame * s.w, s.sy, s.w, s.h, Math.floor(x), Math.floor(y), s.w, s.h);
    };

    return this;
};

var GameBoard = function() 
{
  var board = this;

  // The current list of objects
  this.objects = [];
  this.cnt = {};

  // Add a new object to the object list
  this.add = function(obj) 
  { 
    obj.board = this; 
    this.objects.push(obj); 
    this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
  
    return obj; 

  };

  // Call the same method on all current objects 
  this.iterate = function(funcName) 
  {
     var args = Array.prototype.slice.call(arguments,1);
    
     for(var i=0,len=this.objects.length;i<len;i++) 
     {
       var obj = this.objects[i];
       obj[funcName].apply(obj,args);
     }

  };

  // Call step on all objects and them delete
  // any object that have been marked for removal
  this.step = function(dt) 
  { 
    this.resetRemoved();
    this.iterate('step',dt);
    this.finalizeRemoved();
  };

  // Draw all the objects
  this.draw= function(ctx) 
  {
    this.iterate('draw',ctx);
  };

};

