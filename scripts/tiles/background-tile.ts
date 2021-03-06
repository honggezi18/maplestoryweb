﻿/// <reference path="../main.ts" />

enum BackgroundType {
  "Regular",
  "HorizontalCopies",
  "VerticalCopies",
  "HVCopies",
  "HorizontalMovingCopies",
  "VerticalMovingCopies",
  "HVCopiesHorizontalMoving",
  "HVCopiesVerticalMoving"
}

class BackgroundTile implements ITile {
  Type: BackgroundType;
  Tex: Texture;
  origin: Vector;
  flip: boolean;

  C: Vector;
  R: Vector;
  position: Vector;
  z: number;

  constructor(private ms: IEngine) { }

  static LoadBackground(ms: IEngine, item: any, z: number): BackgroundTile {
    var bg = new BackgroundTile(ms);
    // Todo, if item.ani == true then use Map/Ani/ instead of Map/Back/
    bg.Tex = new Texture(ms, ms.http.baseUrl + 'Map/Back/' + item.bS + '.img/back/' + item.no + '.png');
    bg.position = new Vector(item.x, item.y);
    bg.origin = new Vector(0, 0);
    bg.C = new Vector(item.cx || 0, item.cy || 0);
    bg.R = new Vector(item.rx || 0, item.ry || 0);
    bg.Type = <BackgroundType>item.type;
    bg.flip = item.flip > 0;
    bg.z = z;

    // Todo, if item.front then add to foreground layer

    return bg;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.Tex.hasLoaded) return;

    var x = this.position.x; //+ this.R.x * -this.ms.camera.centerX * 0.01;
    var y = this.position.y; // + 300 + ((this.R.y * (-this.ms.camera.centerY + 300)) / 100);

    switch (this.Type) {
      case BackgroundType.Regular:
        for (let x = this.R.x; x < 30000; x += this.position.x) {
          this.Tex.draw(ctx, x, y, this.flip);
        }
        break;

      case BackgroundType.HorizontalCopies:
        this.ms.game.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.Tex.drawTiled(ctx, x, y, this.C.x, this.C.y, true, false);
        this.ms.camera.draw();
        break;

      case BackgroundType.HorizontalMovingCopies:
        x += this.R.x * 0.004;
        this.Tex.drawTiled(ctx, x, y, this.C.x, this.C.y, true, false);
        break;

      //case BackgroundType.VerticalCopies:
      //    this.Tex.drawTiled(ctx, x, y, this.C.x, this.C.y, false, true);
      //    break;

      //case BackgroundType.VerticalMovingCopies:
      //    y += (1451087797502 - this.ms.game.totalGameTime) * this.R.y * 0.004;
      //    this.Tex.drawTiled(ctx, x, y, this.C.x, this.C.y, false, true);
      //    break;


      //case BackgroundType.HVCopies:
      //    //this.Tex.drawTiled(ctx, x, y, this.C.x, this.C.y, true, true);
      //    break;

      //case BackgroundType.HVCopiesHorizontalMoving:
      //    x += (1451087797502 - this.ms.game.totalGameTime) * this.R.x * 0.004;
      //    this.Tex.drawTiled(ctx, x, y, this.C.x, this.C.y, true, true);
      //    break;

      //case BackgroundType.HVCopiesVerticalMoving:
      //    y += (1451087797502 - this.ms.game.totalGameTime) * this.R.y * 0.004;
      //    this.Tex.drawTiled(ctx, x, y, this.C.x, this.C.y, true, true);
      //    break;


      //var pos = Vector.plus(new Vector(game.totalGameTime % 100, 0), Position);
      //batch.Draw(Sprite.Tex, pos, Color.White);
      //batch.RectangleStroke(pos, new Vector2(Sprite.Tex.Width, Sprite.Tex.Height), 1, Color.Red, 0);
      //batch.DrawStringWithShadowCheap(Game1.Font, "R: " + R + "\r\nC: " + C + "\r\nO: " + Sprite.Offset + "\r\nt: " + Type, pos);
      //break;
      //case BackgroundType.LensFlare:
      //    pos = Camera.Position * R * -0.1f + Position;
      //    batch.Draw(Sprite.Tex, pos, Color.White);
      //    batch.RectangleStroke(pos, new Vector2(Sprite.Tex.Width, Sprite.Tex.Height), 1, Color.Red, 0);
      //    batch.DrawStringWithShadowCheap(Game1.Font, "R: " + R + "\r\nC: " + C + "\r\nO: " + Sprite.Offset + "\r\nt: " + Type, pos);
      //    break;
      //case BackgroundType.unknown3:
      //case BackgroundType.unknown4:
      //case BackgroundType.unknown6:
      //    pos = Camera.Position * R * -0.1f + Position;
      //    batch.Draw(Sprite.Tex, pos, Color.White);
      //    batch.RectangleStroke(pos, new Vector2(Sprite.Tex.Width, Sprite.Tex.Height), 1, Color.Red, 0);
      //    batch.DrawStringWithShadowCheap(Game1.Font, "R: " + R + "\r\nC: " + C + "\r\nO: " + Sprite.Offset + "\r\nt: " + Type, pos);

      //break;
    }

  }
}
