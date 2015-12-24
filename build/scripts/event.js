var MapleEvent = (function () {
    function MapleEvent() {
        this.handlers = [];
    }
    MapleEvent.prototype.on = function (handler) {
        this.handlers.push(handler);
    };
    MapleEvent.prototype.off = function (handler) {
        this.handlers = this.handlers.filter(function (h) { return h !== handler; });
    };
    MapleEvent.prototype.trigger = function (data) {
        if (this.handlers) {
            this.handlers.slice(0).forEach(function (h) { return h(data); });
        }
    };
    return MapleEvent;
})();
