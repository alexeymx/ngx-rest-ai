/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function IJwtPayload() { }
if (false) {
    /**
     * The "iss" (issuer) claim identifies the principal that issued the
     * JWT.  The processing of this claim is generally application specific.
     * The "iss" value is a case-sensitive string containing a StringOrURI
     * value.
     * @see https://tools.ietf.org/html/rfc7519#section-4.1
     * @type {?|undefined}
     */
    IJwtPayload.prototype.iss;
    /**
     * The "sub" (subject) claim identifies the principal that is the
     * subject of the JWT.  The claims in a JWT are normally statements
     * about the subject.  The subject value MUST either be scoped to be
     * locally unique in the context of the issuer or be globally unique.
     * The processing of this claim is generally application specific.  The
     * "sub" value is a case-sensitive string containing a StringOrURI
     * value.
     * @see https://tools.ietf.org/html/rfc7519#section-4.1
     * @type {?|undefined}
     */
    IJwtPayload.prototype.sub;
    /**
     * The "exp" (expiration time) claim identifies the expiration time on
     * or after which the JWT MUST NOT be accepted for processing.  The
     * processing of the "exp" claim requires that the current date/time
     * MUST be before the expiration date/time listed in the "exp" claim.
     * @see https://tools.ietf.org/html/rfc7519#section-4.1
     * @type {?|undefined}
     */
    IJwtPayload.prototype.exp;
    /**
     * The "iat" (issued at) claim identifies the time at which the JWT was
     * issued.  This claim can be used to determine the age of the JWT.  Its
     * value MUST be a number containing a NumericDate value.  Use of this
     * claim is OPTIONAL.
     * @see https://tools.ietf.org/html/rfc7519#section-4.1
     * @type {?|undefined}
     */
    IJwtPayload.prototype.iat;
    /**
     * The "nbf" (not before) claim identifies the time before which the JWT
     * MUST NOT be accepted for processing.  The processing of the "nbf"
     * claim requires that the current date/time MUST be after or equal to
     * the not-before date/time listed in the "nbf" claim.  Implementers MAY
     * provide for some small leeway, usually no more than a few minutes, to
     * account for clock skew.  Its value MUST be a number containing a
     * NumericDate value.  Use of this claim is OPTIONAL.
     * @see https://tools.ietf.org/html/rfc7519#section-4.1
     * @type {?|undefined}
     */
    IJwtPayload.prototype.nbf;
    /**
     * The "jti" (JWT ID) claim provides a unique identifier for the JWT.
     * The identifier value MUST be assigned in a manner that ensures that
     * there is a negligible probability that the same value will be
     * accidentally assigned to a different data object; if the application
     * uses multiple issuers, collisions MUST be prevented among values
     * produced by different issuers as well.  The "jti" claim can be used
     * to prevent the JWT from being replayed.  The "jti" value is a case-
     * sensitive string.  Use of this claim is OPTIONAL.
     * @type {?|undefined}
     */
    IJwtPayload.prototype.jti;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LXBheWxvYWQuaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXJlc3QvIiwic291cmNlcyI6WyJsaWIvand0LXBheWxvYWQuaW50ZXJmYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxpQ0ErREM7Ozs7Ozs7Ozs7SUF2REcsMEJBQWE7Ozs7Ozs7Ozs7OztJQVliLDBCQUFzQjs7Ozs7Ozs7O0lBU3RCLDBCQUFhOzs7Ozs7Ozs7SUFTYiwwQkFBYTs7Ozs7Ozs7Ozs7O0lBWWIsMEJBQWE7Ozs7Ozs7Ozs7OztJQVliLDBCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgSUp3dFBheWxvYWQge1xuICAgIC8qKlxuICAgICAqIFRoZSBcImlzc1wiIChpc3N1ZXIpIGNsYWltIGlkZW50aWZpZXMgdGhlIHByaW5jaXBhbCB0aGF0IGlzc3VlZCB0aGVcbiAgICAgKiBKV1QuICBUaGUgcHJvY2Vzc2luZyBvZiB0aGlzIGNsYWltIGlzIGdlbmVyYWxseSBhcHBsaWNhdGlvbiBzcGVjaWZpYy5cbiAgICAgKiBUaGUgXCJpc3NcIiB2YWx1ZSBpcyBhIGNhc2Utc2Vuc2l0aXZlIHN0cmluZyBjb250YWluaW5nIGEgU3RyaW5nT3JVUklcbiAgICAgKiB2YWx1ZS5cbiAgICAgKiBAc2VlIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3NTE5I3NlY3Rpb24tNC4xXG4gICAgICovXG4gICAgaXNzPzogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFwic3ViXCIgKHN1YmplY3QpIGNsYWltIGlkZW50aWZpZXMgdGhlIHByaW5jaXBhbCB0aGF0IGlzIHRoZVxuICAgICAqIHN1YmplY3Qgb2YgdGhlIEpXVC4gIFRoZSBjbGFpbXMgaW4gYSBKV1QgYXJlIG5vcm1hbGx5IHN0YXRlbWVudHNcbiAgICAgKiBhYm91dCB0aGUgc3ViamVjdC4gIFRoZSBzdWJqZWN0IHZhbHVlIE1VU1QgZWl0aGVyIGJlIHNjb3BlZCB0byBiZVxuICAgICAqIGxvY2FsbHkgdW5pcXVlIGluIHRoZSBjb250ZXh0IG9mIHRoZSBpc3N1ZXIgb3IgYmUgZ2xvYmFsbHkgdW5pcXVlLlxuICAgICAqIFRoZSBwcm9jZXNzaW5nIG9mIHRoaXMgY2xhaW0gaXMgZ2VuZXJhbGx5IGFwcGxpY2F0aW9uIHNwZWNpZmljLiAgVGhlXG4gICAgICogXCJzdWJcIiB2YWx1ZSBpcyBhIGNhc2Utc2Vuc2l0aXZlIHN0cmluZyBjb250YWluaW5nIGEgU3RyaW5nT3JVUklcbiAgICAgKiB2YWx1ZS5cbiAgICAgKiBAc2VlIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3NTE5I3NlY3Rpb24tNC4xXG4gICAgICovXG4gICAgc3ViPzogc3RyaW5nIHwgbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFwiZXhwXCIgKGV4cGlyYXRpb24gdGltZSkgY2xhaW0gaWRlbnRpZmllcyB0aGUgZXhwaXJhdGlvbiB0aW1lIG9uXG4gICAgICogb3IgYWZ0ZXIgd2hpY2ggdGhlIEpXVCBNVVNUIE5PVCBiZSBhY2NlcHRlZCBmb3IgcHJvY2Vzc2luZy4gIFRoZVxuICAgICAqIHByb2Nlc3Npbmcgb2YgdGhlIFwiZXhwXCIgY2xhaW0gcmVxdWlyZXMgdGhhdCB0aGUgY3VycmVudCBkYXRlL3RpbWVcbiAgICAgKiBNVVNUIGJlIGJlZm9yZSB0aGUgZXhwaXJhdGlvbiBkYXRlL3RpbWUgbGlzdGVkIGluIHRoZSBcImV4cFwiIGNsYWltLlxuICAgICAqIEBzZWUgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzc1MTkjc2VjdGlvbi00LjFcbiAgICAgKi9cbiAgICBleHA/OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgXCJpYXRcIiAoaXNzdWVkIGF0KSBjbGFpbSBpZGVudGlmaWVzIHRoZSB0aW1lIGF0IHdoaWNoIHRoZSBKV1Qgd2FzXG4gICAgICogaXNzdWVkLiAgVGhpcyBjbGFpbSBjYW4gYmUgdXNlZCB0byBkZXRlcm1pbmUgdGhlIGFnZSBvZiB0aGUgSldULiAgSXRzXG4gICAgICogdmFsdWUgTVVTVCBiZSBhIG51bWJlciBjb250YWluaW5nIGEgTnVtZXJpY0RhdGUgdmFsdWUuICBVc2Ugb2YgdGhpc1xuICAgICAqIGNsYWltIGlzIE9QVElPTkFMLlxuICAgICAqIEBzZWUgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzc1MTkjc2VjdGlvbi00LjFcbiAgICAgKi9cbiAgICBpYXQ/OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgXCJuYmZcIiAobm90IGJlZm9yZSkgY2xhaW0gaWRlbnRpZmllcyB0aGUgdGltZSBiZWZvcmUgd2hpY2ggdGhlIEpXVFxuICAgICAqIE1VU1QgTk9UIGJlIGFjY2VwdGVkIGZvciBwcm9jZXNzaW5nLiAgVGhlIHByb2Nlc3Npbmcgb2YgdGhlIFwibmJmXCJcbiAgICAgKiBjbGFpbSByZXF1aXJlcyB0aGF0IHRoZSBjdXJyZW50IGRhdGUvdGltZSBNVVNUIGJlIGFmdGVyIG9yIGVxdWFsIHRvXG4gICAgICogdGhlIG5vdC1iZWZvcmUgZGF0ZS90aW1lIGxpc3RlZCBpbiB0aGUgXCJuYmZcIiBjbGFpbS4gIEltcGxlbWVudGVycyBNQVlcbiAgICAgKiBwcm92aWRlIGZvciBzb21lIHNtYWxsIGxlZXdheSwgdXN1YWxseSBubyBtb3JlIHRoYW4gYSBmZXcgbWludXRlcywgdG9cbiAgICAgKiBhY2NvdW50IGZvciBjbG9jayBza2V3LiAgSXRzIHZhbHVlIE1VU1QgYmUgYSBudW1iZXIgY29udGFpbmluZyBhXG4gICAgICogTnVtZXJpY0RhdGUgdmFsdWUuICBVc2Ugb2YgdGhpcyBjbGFpbSBpcyBPUFRJT05BTC5cbiAgICAgKiBAc2VlIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3NTE5I3NlY3Rpb24tNC4xXG4gICAgICovXG4gICAgbmJmPzogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFwianRpXCIgKEpXVCBJRCkgY2xhaW0gcHJvdmlkZXMgYSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIEpXVC5cbiAgICAgKiBUaGUgaWRlbnRpZmllciB2YWx1ZSBNVVNUIGJlIGFzc2lnbmVkIGluIGEgbWFubmVyIHRoYXQgZW5zdXJlcyB0aGF0XG4gICAgICogdGhlcmUgaXMgYSBuZWdsaWdpYmxlIHByb2JhYmlsaXR5IHRoYXQgdGhlIHNhbWUgdmFsdWUgd2lsbCBiZVxuICAgICAqIGFjY2lkZW50YWxseSBhc3NpZ25lZCB0byBhIGRpZmZlcmVudCBkYXRhIG9iamVjdDsgaWYgdGhlIGFwcGxpY2F0aW9uXG4gICAgICogdXNlcyBtdWx0aXBsZSBpc3N1ZXJzLCBjb2xsaXNpb25zIE1VU1QgYmUgcHJldmVudGVkIGFtb25nIHZhbHVlc1xuICAgICAqIHByb2R1Y2VkIGJ5IGRpZmZlcmVudCBpc3N1ZXJzIGFzIHdlbGwuICBUaGUgXCJqdGlcIiBjbGFpbSBjYW4gYmUgdXNlZFxuICAgICAqIHRvIHByZXZlbnQgdGhlIEpXVCBmcm9tIGJlaW5nIHJlcGxheWVkLiAgVGhlIFwianRpXCIgdmFsdWUgaXMgYSBjYXNlLVxuICAgICAqIHNlbnNpdGl2ZSBzdHJpbmcuICBVc2Ugb2YgdGhpcyBjbGFpbSBpcyBPUFRJT05BTC5cbiAgICAgKi9cbiAgICBqdGk/OiBzdHJpbmcgfCBudW1iZXI7XG59XG4iXX0=