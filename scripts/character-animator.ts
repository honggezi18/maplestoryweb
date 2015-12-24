
class CharacterAnimationFrame {
    public id: number;
    public tex: Texture;
    public frameLength: number;
    public originalFrameLength: number;
    public offset: Vector;
    public z: string;
    public maps: { [name: string]: Vector } = {};

    constructor(private ms: IEngine, data, id, path, defaultDelay) {
        var offset = data.origin;
        this.frameLength = data.delay || defaultDelay;
        this.originalFrameLength = defaultDelay;

        this.tex = new Texture(ms, ms.http.baseUrl + path + '.png');
        this.offset = new Vector(offset.x, offset.y);
        this.id = id;
        this.z = data.z;

        for (var key in data.map) {
            var map = data.map[key];
            this.maps[key] = new Vector(map.x, map.y);
        }
    }
}

class CharacterPart {
    timeToNextFrame: number = 0;
    currentFrame: number = 0;
    public frames: CharacterAnimationFrame[] = [];
    draw(ms: IEngine, ctx: CanvasRenderingContext2D, x: number, y: number, flip: boolean) {
        this.timeToNextFrame -= ms.game.frameTime;
        while (this.timeToNextFrame < 0) {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.timeToNextFrame += this.frames[this.currentFrame].frameLength;
        }

        var frame = this.frames[this.currentFrame];
        var topLeftX = x - frame.offset.x;
        var topLeftY = y - frame.offset.y;

        //if (frame.z == "arm") {
        //    topLeftX += 6 + frame.maps["hand"].x;
        //    topLeftY -= 15 + frame.maps["hand"].y;
        //}

        frame.tex.draw(ctx, topLeftX, topLeftY, flip);
    }
}

class CharacterAnimation {
    parts: CharacterPart[] = [];
    loaded: boolean = false;

    draw(ms: IEngine, ctx: CanvasRenderingContext2D, x: number, y: number, flip: boolean) {
        if (!this.loaded) return;

        for (var i = 0; i < this.parts.length; i++)
            this.parts[i].draw(ms, ctx, x, y, flip);
    }
}

class CharacterAnimator {
    loaded: boolean = false;
    animations: { [name: string]: CharacterAnimation } = {};

    constructor(private ms: IEngine, path: string, animationNames: string[]) {
        for (var i = 0; i < animationNames.length; i++)
            this.loadAnimation(path, animationNames[i]);
    }

    loadAnimation(basePath: string, animationName: string) {
        var instance = this;
        this.ms.http.getJsonPropertyForPath(basePath + '/' + animationName, (data) => {
            var body = new CharacterPart();
            var arm = new CharacterPart();
            var animation = new CharacterAnimation();

            animation.parts.push(body);
            animation.parts.push(arm);
            instance.animations[animationName] = animation;

            for (var key in data) {
                if (isNaN(key))
                    continue;

                var id = parseInt(key);
                body.frames.push(new CharacterAnimationFrame(this.ms, data[key].body, id, basePath + '/' + animationName + "/" + key + "/body", data[key].delay));
                arm.frames.push(new CharacterAnimationFrame(this.ms, data[key].arm, id, basePath + '/' + animationName + "/" + key + "/arm", data[key].delay));
            }

            body.frames.sort((a, b) => b.id - a.id);
            arm.frames.sort((a, b) => b.id - a.id);

            animation.loaded = true;
        });
    }

    draw(ctx: CanvasRenderingContext2D, x: number, y: number, flip: boolean, animationName: string) {
        this.animations[animationName].draw(this.ms, ctx, x, y, flip);
    }
}
