/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
export class JwtHelper {
    /**
     * @param {?=} token
     * @return {?}
     */
    static decodeToken(token = '') {
        if (token === null || token === '') {
            return null;
        }
        /** @type {?} */
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        /** @type {?} */
        const decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            return null;
        }
        return JSON.parse(decoded);
    }
    /**
     * @private
     * @param {?} str
     * @return {?}
     */
    static urlBase64Decode(str) {
        /** @type {?} */
        let output = str;
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
        const data = atob(output);
        return decodeURIComponent(data);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LWhlbHBlci5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL2p3dC1oZWxwZXIuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLE1BQU0sT0FBTyxTQUFTOzs7OztJQUVYLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLEVBQUU7UUFDaEMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7WUFDaEMsT0FBTyxJQUFJLENBQUM7U0FDZjs7Y0FFSyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDOUIsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNwQixPQUFPLElBQUksQ0FBQztTQUNmOztjQUVLLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1YsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUVELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQixDQUFDOzs7Ozs7SUFFTyxNQUFNLENBQUMsZUFBZSxDQUFDLEdBQVc7O1lBQ2xDLE1BQU0sR0FBRyxHQUFHO1FBQ2hCLFFBQVEsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdkIsS0FBSyxDQUFDO2dCQUNGLE1BQU07WUFFVixLQUFLLENBQUM7Z0JBQ0YsTUFBTSxJQUFJLElBQUksQ0FBQztnQkFDZixNQUFNO1lBRVYsS0FBSyxDQUFDO2dCQUNGLE1BQU0sSUFBSSxHQUFHLENBQUM7Z0JBQ2QsTUFBTTtZQUVWO2dCQUNJLE9BQU8sSUFBSSxDQUFDO1NBQ25COztjQUVLLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXpCLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQztDQUVKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUp3dFBheWxvYWQgfSBmcm9tICcuL2p3dC1wYXlsb2FkLmludGVyZmFjZSc7XG5cbmV4cG9ydCBjbGFzcyBKd3RIZWxwZXIge1xuXG4gICAgcHVibGljIHN0YXRpYyBkZWNvZGVUb2tlbih0b2tlbiA9ICcnKTogSUp3dFBheWxvYWQge1xuICAgICAgICBpZiAodG9rZW4gPT09IG51bGwgfHwgdG9rZW4gPT09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhcnRzID0gdG9rZW4uc3BsaXQoJy4nKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCAhPT0gMykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkZWNvZGVkID0gdGhpcy51cmxCYXNlNjREZWNvZGUocGFydHNbMV0pO1xuICAgICAgICBpZiAoIWRlY29kZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGVjb2RlZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgdXJsQmFzZTY0RGVjb2RlKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IG91dHB1dCA9IHN0cjtcbiAgICAgICAgc3dpdGNoIChvdXRwdXQubGVuZ3RoICUgNCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICc9PSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJz0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IGF0b2Iob3V0cHV0KTtcblxuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGRhdGEpO1xuICAgIH1cblxufVxuIl19