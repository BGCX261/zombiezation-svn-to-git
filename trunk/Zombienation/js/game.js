var sprites = 
{
	background: { sx: 0, sy: 0, w: 1280, h: 720, frames: 1 },
	hero: {sx: 0, sy: 279, w: 60, h: 98, frames: 1 },
}
$(window).load(
	function() 
	{
		Game.init('gameCanvas', sprites, undefined);
		var board = new GameBoard();
		board.add(new Player());
		Game.setBoard(3,board);
	}
);

var Player = function ()
{
	var playerCtx = document.getElementById("gameCanvas");
};
