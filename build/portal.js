/// <reference path="main.ts" />
var PortalTypeNames;
(function (PortalTypeNames) {
    PortalTypeNames[PortalTypeNames["Start Point"] = 0] = "Start Point";
    PortalTypeNames[PortalTypeNames["Invisible"] = 1] = "Invisible";
    PortalTypeNames[PortalTypeNames["Visible"] = 2] = "Visible";
    PortalTypeNames[PortalTypeNames["Collision"] = 3] = "Collision";
    PortalTypeNames[PortalTypeNames["Changable"] = 4] = "Changable";
    PortalTypeNames[PortalTypeNames["Changable Invisible"] = 5] = "Changable Invisible";
    PortalTypeNames[PortalTypeNames["Town Portal"] = 6] = "Town Portal";
    PortalTypeNames[PortalTypeNames["Script"] = 7] = "Script";
    PortalTypeNames[PortalTypeNames["Script Invisible"] = 8] = "Script Invisible";
    PortalTypeNames[PortalTypeNames["Script Collision"] = 9] = "Script Collision";
    PortalTypeNames[PortalTypeNames["Hidden"] = 10] = "Hidden";
    PortalTypeNames[PortalTypeNames["Script Hidden"] = 11] = "Script Hidden";
    PortalTypeNames[PortalTypeNames["Vertical Spring"] = 12] = "Vertical Spring";
    PortalTypeNames[PortalTypeNames["Custom Impact Spring"] = 13] = "Custom Impact Spring";
    PortalTypeNames[PortalTypeNames["Unknown (PCIG)"] = 14] = "Unknown (PCIG)";
})(PortalTypeNames || (PortalTypeNames = {}));
;
var Portal = (function () {
    function Portal(position, name) {
        this.position = position;
        this.name = name;
    }
    Portal.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 20, 0, Math.PI * 2, false);
        ctx.strokeStyle = 'pink';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText(this.name, this.position.x - 30, this.position.y - 30);
    };
    Portal.loadPortals = function (data) {
        var list = [];
        for (var key in data) {
            var portal = data[key];
            var mapId = portal.tm;
            var portalName = portal.tn;
            var type = portal.tn;
            var pos = new Vector(portal.x, portal.y);
            list.push(new Portal(new Vector(pos.x, pos.y), portal.pn + ":" + portal.pt));
        }
        return list;
    };
    return Portal;
})();