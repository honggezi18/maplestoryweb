var Camera = (function () {
    function Camera(ms) {
        this.ms = ms;
        //Zoom: number = 1 / (window.devicePixelRatio || 1);
        this.Zoom = 1;
    }
    Camera.prototype.init = function () {
        this.Position = new Vector(0, 0);
    };
    Camera.prototype.reset = function () {
        this.ms.game.ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
    Camera.prototype.moveToPlayer = function () {
        this.Position.x = Math.round(this.ms.player.Position.x + -this.width / 2 - this.ms.player.Size.width / 2);
        this.Position.y = Math.round(this.ms.player.Position.y + -this.height / 2 - this.ms.player.Size.height / 2);
        this.Position.x = Math.max(this.ms.map.bounds.x1, this.Position.x);
        this.Position.x = Math.min(this.ms.map.bounds.x2, this.Position.x + this.width) - this.width;
    };
    Camera.prototype.update = function () {
        this.width = this.ms.game.canvas.width / this.Zoom;
        this.height = this.ms.game.canvas.height / this.Zoom;
        this.targetX = Math.round(this.ms.player.Position.x + -this.width / 2 - this.ms.player.Size.width / 2);
        this.targetY = Math.round(this.ms.player.Position.y + -this.height / 2 - this.ms.player.Size.height / 2);
        this.targetX = Math.max(this.ms.map.bounds.x1, this.targetX);
        this.targetX = Math.min(this.ms.map.bounds.x2, this.targetX + this.width) - this.width;
        if (Math.abs(this.Position.x - this.targetX) < 0.7)
            this.Position.x = this.targetX;
        if (Math.abs(this.Position.y - this.targetY) < 0.7)
            this.Position.y = this.targetY;
        this.Position.x = MathHelper.lerp(this.Position.x, this.targetX, 0.04);
        this.Position.y = MathHelper.lerp(this.Position.y, this.targetY, 0.04);
        this.boundsLeft = this.Position.x;
        this.boundsRight = this.Position.x + this.width;
        this.boundsTop = this.Position.y;
        this.boundsBottom = this.Position.y + this.height;
        this.centerX = this.boundsLeft + (this.boundsRight - this.boundsLeft) * 0.5;
        this.centerY = this.boundsTop + (this.boundsBottom - this.boundsTop) * 0.5;
    };
    Camera.prototype.draw = function () {
        this.reset();
        var roundMultiple = this.Zoom;
        var x = -this.Position.x * this.Zoom;
        var y = -this.Position.y * this.Zoom;
        x = Math.floor(x * roundMultiple) / roundMultiple;
        y = Math.floor(y * roundMultiple) / roundMultiple;
        this.ms.game.ctx.translate(x, y);
        this.ms.game.ctx.scale(this.Zoom, this.Zoom);
    };
    return Camera;
})();
