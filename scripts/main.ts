/// <reference path="sprites.ts"/>
/// <reference path="vector.ts"/>

class Foothold {
    playerTouches: boolean;

    constructor(public Position: Vector, public Size: Size) { }

	draw(ctx : CanvasRenderingContext2D){
        ctx.fillStyle = this.playerTouches ? 'rgba(100, 0, 0, 0.2)':'rgba(0, 0, 0, 0.2)';
		ctx.fillRect(this.Position.x, this.Position.y, this.Size.width, this.Size.height);
    }

    isPointColliding(point: Vector, velocity: Vector): boolean {
        return (
            this.Position.x <= point.x &&
            this.Position.x + this.Size.width >= point.x &&
            this.Position.y >= point.y &&
            this.Position.y <= point.y + velocity.y &&
            true);
    }
}
 
enum KeyCodes { 
	left = 37,
	right = 39,
	up = 38,
	down = 40,
    enter = 13,
    space = 32
 }

class Texture {
	image : HTMLImageElement;
	hasLoaded : boolean;
	hasError : boolean;
	
	constructor(path : string){
		this.image = new Image();
		this.image.src = path;
		
		var instance = this;
		this.image.onload = () => instance.hasLoaded = true;
		this.image.onerror = () => instance.hasError = true;
	}
	
	draw(ctx : CanvasRenderingContext2D, pos : Vector, size? : Size) {
		if (this.hasError){
			size = size || new Size(100, 100);
			ctx.fillStyle = 'rgba(200, 0, 0, 0.2)';
			ctx.fillRect(pos.x, pos.y, size.width, size.height);
			ctx.fillStyle = 'rgb(0, 0, 0)';
			ctx.fillText('error...', pos.x + 10, pos.y + 10);
			return;
		}
		
		if (!this.hasLoaded){
            size = size || new Size(100, 100);
			ctx.fillStyle = 'rgba(0, 0, 200, 0.2)';
            ctx.fillRect(pos.x, pos.y, size.width, size.height);
			ctx.fillStyle = 'rgb(0, 0, 0)';
			ctx.fillText('loading...', pos.x, pos.y);
			return;
		}
		
		if (size == null)
			ctx.drawImage(this.image, pos.x, pos.y, this.image.width, this.image.height);	
		else
			ctx.drawImage(this.image, pos.x, pos.y, size.width, size.height);	
	}
}

class Camera {
	Position : Vector;
	Zoom: number = 1;
	
	init() {
		this.Position = new Vector(0, 0);
	}
	update() {
		var targetPos = new Vector(0, 0);
		targetPos.x = player.Position.x + -game.canvas.width / 2 - player.Size.width / 2;
		
		//this.Position = targetPos;
		
		game.ctx.setTransform(1, 0, 0, 1, 0, 0);
		game.ctx.translate(this.Position.x, this.Position.y);
		game.ctx.scale(this.Zoom, this.Zoom);
	}
	draw() { }
}

class Player {
	image : Texture;
	Position : Vector;
	Velocity : Vector;
    Size: Size;
    hasJumped: boolean;
	
	init() {
		this.Position = new Vector(500, 0);
		this.Velocity = new Vector(0, 0);
        this.Size = new Size(60, 80);
		this.image = new Texture('http://nxcache.nexon.net/spotlight/112/007kn-7e9ea6e9-e3c1-402e-803d-7df82ad5ac53.gif');
        this.hasJumped = true;

		var instance = this;
		window.onkeydown = (e) => instance.onKeyDown(e);
		window.onkeyup = (e) => instance.onKeyUp(e);
	}
	
	onKeyDown(e : KeyboardEvent){
		if (e.keyCode == KeyCodes.left)
			this.Velocity.x = -3;
		else if (e.keyCode == KeyCodes.right)
			this.Velocity.x = 3;
		  
        if (e.keyCode == KeyCodes.down) { this.Position.y++; this.Velocity.y++; }
        if (e.keyCode == KeyCodes.up) { }
        if (e.keyCode == KeyCodes.space) {
            if (this.hasJumped == false) {
                this.Velocity.y -= 8;
                this.hasJumped = true;
            }
        }
	}
	
	onKeyUp(e : KeyboardEvent){
		if (e.keyCode == KeyCodes.left && this.Velocity.x < 0) // left
			this.Velocity.x = 0;
		else if (e.keyCode == KeyCodes.right && this.Velocity.x > 0) // right
			this.Velocity.x = 0;
	}
	
    update() {
        this.Velocity.y += 0.3;

        for (var i = 0; i < map.Footholds.length; i++)
            map.Footholds[i].playerTouches = false;
        
         
        for (var i = 0; i < map.Footholds.length; i++) {
            if (map.Footholds[i].isPointColliding(Vector.plus(this.Position, new Vector(-this.Size.width / 2, 0)), this.Velocity) ||
                map.Footholds[i].isPointColliding(Vector.plus(this.Position, new Vector(this.Size.width / 2, 0)), this.Velocity)) {
                map.Footholds[i].playerTouches = true;
                this.Velocity.y = 0;
                this.Position.y = map.Footholds[i].Position.y;
                this.hasJumped = false;
            }
        }

        this.Position = Vector.plus(this.Position, this.Velocity);

        if (this.Position.y > 1000) {
            this.Position.y = 0;
            this.Velocity.y = 0;
        }
    }
	
	draw() {
        this.image.draw(game.ctx, new Vector(this.Position.x - this.Size.width / 2, this.Position.y - this.Size.height), this.Size);
        game.ctx.beginPath();
        game.ctx.strokeStyle = "black";
        game.ctx.moveTo(this.Position.x - 5, this.Position.y);
        game.ctx.lineTo(this.Position.x + 5, this.Position.y);
        game.ctx.moveTo(this.Position.x, this.Position.y + 5);
        game.ctx.lineTo(this.Position.x, this.Position.y - 5);
        game.ctx.stroke();
	}
}


class World {
	Footholds : Foothold[];
    Id: string;
    BasePath: string;
    Tiles: BackgroundSprite[];

	init(id: string) {
        this.Tiles = [];
        this.Id = id;
        this.BasePath = 'Map/Map' + this.Id.substr(0, 1) + '/' + this.Id + '.img/';
        var instance = this;
        httpGetAsset(this.BasePath + 'properties.json', function (data) { instance.loadData(data) });
	    
		this.Footholds = [];
		for (var i = 0; i < 10; i++)
			this.Footholds.push(new Foothold(
				new Vector(Math.random() * 1400, Math.random() * 1000), 
				new Size(Math.random() * 500 + 200, 40)))
	}

    loadData(mapData) {
        for (var key in mapData.back) {
            var item = mapData.back[key];
            var bg = new BackgroundSprite();
            bg.Sprite = new TextureSprite(item.bS.bS, item.no.no);
            bg.Position = new Vector(item.x.x, item.y.y);
            bg.C = new Vector(item.cx, item.cy);
            bg.R = new Vector(item.rx, item.ry);
            if (item.type.type == 0) bg.Type = BackgroundType.LensFlare;
            else bg.Type = BackgroundType.unknown6;

            this.Tiles.push(bg);
        }
    }

	update() { }
	draw() {
        for (var i = 0; i < this.Tiles.length; i++)
            this.Tiles[i].draw(game.ctx);

		for (var i = 0; i < this.Footholds.length; i++)
			this.Footholds[i].draw(game.ctx);
	}
}
   
class Game {
	public ctx : CanvasRenderingContext2D;
	public canvas : HTMLCanvasElement;
    public totalGameTime : number;
	
	init() {
		this.canvas = <HTMLCanvasElement>document.getElementById('gameCanvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.ctx = this.canvas.getContext('2d', { alpha: false });
	}
		
	update() {
        this.totalGameTime = Date.now();
		camera.update();
		map.update();
		player.update();
	}
	draw() {
		this.ctx.fillStyle = 'rgb(100, 149, 237)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		
		camera.draw();
		map.draw();
		player.draw();
	}
}

var game = new Game();
var camera = new Camera();
var map = new World();
var player = new Player();

game.init();
camera.init();
player.init();
map.init('100000000');

function httpGet(path: string, callback: (any) => void) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

function httpGetAsset(path: string, callback: (any) => void) {
    return httpGet('http://mapleassets.jeremi.se/' + path, callback);
}


function gotAnimationFrame() {
	requestAnimationFrame(gotAnimationFrame);
	
	game.update();
	game.draw();
}
gotAnimationFrame();
