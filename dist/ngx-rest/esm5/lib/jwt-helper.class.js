/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var JwtHelper = /** @class */ (function () {
    function JwtHelper() {
    }
    /**
     * @param {?=} token
     * @return {?}
     */
    JwtHelper.decodeToken = /**
     * @param {?=} token
     * @return {?}
     */
    function (token) {
        if (token === void 0) { token = ''; }
        if (token === null || token === '') {
            return null;
        }
        /** @type {?} */
        var parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        /** @type {?} */
        var decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            return null;
        }
        return JSON.parse(decoded);
    };
    /**
     * @private
     * @param {?} str
     * @return {?}
     */
    JwtHelper.urlBase64Decode = /**
     * @private
     * @param {?} str
     * @return {?}
     */
    function (str) {
        /** @type {?} */
        var output = str;
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                return null;
        }
        /** @type {?} */
        var data = atob(output);
        return decodeURIComponent(data);
    };
    return JwtHelper;
}());
export { JwtHelper };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LWhlbHBlci5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL2p3dC1oZWxwZXIuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBO0lBQUE7SUEyQ0EsQ0FBQzs7Ozs7SUF6Q2lCLHFCQUFXOzs7O0lBQXpCLFVBQTBCLEtBQVU7UUFBVixzQkFBQSxFQUFBLFVBQVU7UUFDaEMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7WUFDaEMsT0FBTyxJQUFJLENBQUM7U0FDZjs7WUFFSyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDOUIsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNwQixPQUFPLElBQUksQ0FBQztTQUNmOztZQUVLLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1YsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUVELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQixDQUFDOzs7Ozs7SUFFYyx5QkFBZTs7Ozs7SUFBOUIsVUFBK0IsR0FBVzs7WUFDbEMsTUFBTSxHQUFHLEdBQUc7UUFDaEIsUUFBUSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN2QixLQUFLLENBQUM7Z0JBQ0YsTUFBTTtZQUVWLEtBQUssQ0FBQztnQkFDRixNQUFNLElBQUksSUFBSSxDQUFDO2dCQUNmLE1BQU07WUFFVixLQUFLLENBQUM7Z0JBQ0YsTUFBTSxJQUFJLEdBQUcsQ0FBQztnQkFDZCxNQUFNO1lBRVY7Z0JBQ0ksT0FBTyxJQUFJLENBQUM7U0FDbkI7O1lBRUssSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFekIsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUwsZ0JBQUM7QUFBRCxDQUFDLEFBM0NELElBMkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUp3dFBheWxvYWQgfSBmcm9tICcuL2p3dC1wYXlsb2FkLmludGVyZmFjZSc7XG5cbmV4cG9ydCBjbGFzcyBKd3RIZWxwZXIge1xuXG4gICAgcHVibGljIHN0YXRpYyBkZWNvZGVUb2tlbih0b2tlbiA9ICcnKTogSUp3dFBheWxvYWQge1xuICAgICAgICBpZiAodG9rZW4gPT09IG51bGwgfHwgdG9rZW4gPT09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhcnRzID0gdG9rZW4uc3BsaXQoJy4nKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCAhPT0gMykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkZWNvZGVkID0gdGhpcy51cmxCYXNlNjREZWNvZGUocGFydHNbMV0pO1xuICAgICAgICBpZiAoIWRlY29kZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGVjb2RlZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgdXJsQmFzZTY0RGVjb2RlKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IG91dHB1dCA9IHN0cjtcbiAgICAgICAgc3dpdGNoIChvdXRwdXQubGVuZ3RoICUgNCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICc9PSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJz0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IGF0b2Iob3V0cHV0KTtcblxuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGRhdGEpO1xuICAgIH1cblxufVxuIl19