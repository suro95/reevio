/**
 * Created by aleksa on 2/4/16.
 */





if(typeof Array.prototype.remove_empty==undefined){
    Array.prototype.remove_empty = function() {
        for (var i = 0; i < this.length; i++) {
            if (!this[i]) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    };
}
if(typeof Array.prototype.unique===undefined) {
    Array.prototype.unique = function () {
        var u = {}, a = [];
        for (var i = 0, l = this.length; i < l; ++i) {
            if (u.hasOwnProperty(this[i])) {
                continue;
            }
            a.push(this[i]);
            u[this[i]] = 1;
        }
        return a;
    }
}
if(typeof String.prototype.isNumeric=='undefined') {
    String.prototype.isNumeric = function () {
        return !isNaN(parseFloat(this)) && isFinite(this);

    }
}
if(typeof Number.prototype.isNumeric==undefined) {
    Number.prototype.isNumeric = function () {
        return !isNaN(parseFloat(this)) && isFinite(this);

    }
}












