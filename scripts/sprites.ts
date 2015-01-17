﻿class TextureSprite
{
    Tex: Texture;
    Offset: Vector;

    constructor(path, offset?: Vector) {
        this.Tex = new Texture(http.baseUrl + path + '.png'); 

        if (offset)
            this.Offset = offset;
        else {
            this.Offset = new Vector(0, 0);
            var inst = this;
            http.getJsonPropertyForPath(path, function (prop) {
                var origin = prop.origin;
                if (!origin || typeof origin.x != 'number')
                    debugger;
                inst.Offset = new Vector(origin.x, origin.y);
            });
        }
    }
}


