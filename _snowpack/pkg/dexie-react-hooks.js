import { g as getDefaultExportFromNamespaceIfNotNamed, c as createCommonjsModule, a as commonjsGlobal } from './common/_commonjsHelpers-798ad6a7.js';
import { d as dexie } from './common/dexie-ce178fb8.js';
import { r as react } from './common/index-47b2c619.js';

var require$$0 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(dexie);

var dexieReactHooks = createCommonjsModule(function (module, exports) {
(function (global, factory) {
     factory(exports, require$$0, react) ;
}(commonjsGlobal, (function (exports, dexie, React) {
    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /** This file is copied from https://github.com/facebook/react/blob/master/packages/use-subscription/src/useSubscription.js
     * and updated by David Fahlander to also handle error callbacks by throwing the error in the renderer
     * so it can be caught by a react error boundrary.
     */
    var useDebugValue = React__default['default'].useDebugValue, useEffect = React__default['default'].useEffect, useState = React__default['default'].useState;
    // Hook used for safely managing subscriptions in concurrent mode.
    //
    // In order to avoid removing and re-adding subscriptions each time this hook is called,
    // the parameters passed to this hook should be memoized in some way–
    // either by wrapping the entire params object with useMemo()
    // or by wrapping the individual callbacks with useCallback().
    function useSubscription(_a) {
        var 
        // (Synchronously) returns the current value of our subscription.
        getCurrentValue = _a.getCurrentValue, 
        // This function is passed an event handler to attach to the subscription.
        // It should return an unsubscribe function that removes the handler.
        subscribe = _a.subscribe;
        // Read the current value from our subscription.
        // When this value changes, we'll schedule an update with React.
        // It's important to also store the hook params so that we can check for staleness.
        // (See the comment in checkForUpdates() below for more info.)
        var _b = useState(function () { return ({
            getCurrentValue: getCurrentValue,
            subscribe: subscribe,
            value: getCurrentValue(),
            error: null
        }); }), state = _b[0], setState = _b[1];
        // If there is an error, throw it so that an Error Boundrary can catch it.
        if (state.error)
            throw state.error;
        var valueToReturn = state.value;
        // If parameters have changed since our last render, schedule an update with its current value.
        if (state.getCurrentValue !== getCurrentValue ||
            state.subscribe !== subscribe) {
            // If the subscription has been updated, we'll schedule another update with React.
            // React will process this update immediately, so the old subscription value won't be committed.
            // It is still nice to avoid returning a mismatched value though, so let's override the return value.
            valueToReturn = getCurrentValue();
            setState({
                getCurrentValue: getCurrentValue,
                subscribe: subscribe,
                value: valueToReturn,
                error: null
            });
        }
        // Display the current value for this hook in React DevTools.
        useDebugValue(valueToReturn);
        // It is important not to subscribe while rendering because this can lead to memory leaks.
        // (Learn more at reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)
        // Instead, we wait until the commit phase to attach our handler.
        //
        // We intentionally use a passive effect (useEffect) rather than a synchronous one (useLayoutEffect)
        // so that we don't stretch the commit phase.
        // This also has an added benefit when multiple components are subscribed to the same source:
        // It allows each of the event handlers to safely schedule work without potentially removing an another handler.
        // (Learn more at https://codesandbox.io/s/k0yvr5970o)
        useEffect(function () {
            var didUnsubscribe = false;
            var checkForUpdates = function () {
                // It's possible that this callback will be invoked even after being unsubscribed,
                // if it's removed as a result of a subscription event/update.
                // In this case, React will log a DEV warning about an update from an unmounted component.
                // We can avoid triggering that warning with this check.
                if (didUnsubscribe) {
                    return;
                }
                // We use a state updater function to avoid scheduling work for a stale source.
                // However it's important to eagerly read the currently value,
                // so that all scheduled work shares the same value (in the event of multiple subscriptions).
                // This avoids visual "tearing" when a mutation happens during a (concurrent) render.
                var value = getCurrentValue();
                setState(function (prevState) {
                    // Ignore values from stale sources!
                    // Since we subscribe an unsubscribe in a passive effect,
                    // it's possible that this callback will be invoked for a stale (previous) subscription.
                    // This check avoids scheduling an update for that stale subscription.
                    if (prevState.getCurrentValue !== getCurrentValue ||
                        prevState.subscribe !== subscribe) {
                        return prevState;
                    }
                    // Some subscriptions will auto-invoke the handler, even if the value hasn't changed.
                    // If the value hasn't changed, no update is needed.
                    // Return state as-is so React can bail out and avoid an unnecessary render.
                    if (prevState.value === value) {
                        return prevState;
                    }
                    return __assign(__assign({}, prevState), { value: value });
                });
            };
            var unsubscribe = subscribe(checkForUpdates, function (error) { return setState(function (prevState) { return (__assign(__assign({}, prevState), { error: error })); }); });
            // Because we're subscribing in a passive effect,
            // it's possible that an update has occurred between render and our effect handler.
            // Check for this and schedule an update if work has occurred.
            checkForUpdates();
            return function () {
                didUnsubscribe = true;
                unsubscribe();
            };
        }, [getCurrentValue, subscribe]);
        // Return the current value for our caller to use while rendering.
        return valueToReturn;
    }

    function useLiveQuery(querier, dependencies, defaultResult) {
        var _a = React__default['default'].useState(defaultResult), lastResult = _a[0], setLastResult = _a[1];
        var subscription = React__default['default'].useMemo(function () {
            // Make it remember previus subscription's default value when
            // resubscribing (á la useTransition())
            var currentValue = lastResult;
            var observable = dexie.liveQuery(querier);
            return {
                getCurrentValue: function () { return currentValue; },
                subscribe: function (onNext, onError) {
                    var esSubscription = observable.subscribe(function (value) {
                        currentValue = value;
                        setLastResult(value);
                        onNext(value);
                    }, onError);
                    return esSubscription.unsubscribe.bind(esSubscription);
                }
            };
        }, 
        // Re-subscribe any time any of the given dependencies change
        dependencies || []);
        // The value returned by this hook reflects the current result from the querier
        // Our component will automatically be re-rendered when that value changes.
        var value = useSubscription(subscription);
        return value;
    }

    exports.useLiveQuery = useLiveQuery;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

});

var useLiveQuery = dexieReactHooks.useLiveQuery;
export { useLiveQuery };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV4aWUtcmVhY3QtaG9va3MuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9kZXhpZS1yZWFjdC1ob29rc0AxLjAuNl8yNmNhZTc1YzhiMDg1ZWM0NGVmZDJiYTZjZTIzMTRhOC9ub2RlX21vZHVsZXMvZGV4aWUtcmVhY3QtaG9va3MvZGlzdC9kZXhpZS1yZWFjdC1ob29rcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cywgcmVxdWlyZSgnZGV4aWUnKSwgcmVxdWlyZSgncmVhY3QnKSkgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnLCAnZGV4aWUnLCAncmVhY3QnXSwgZmFjdG9yeSkgOlxuICAgIChnbG9iYWwgPSB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWxUaGlzIDogZ2xvYmFsIHx8IHNlbGYsIGZhY3RvcnkoZ2xvYmFsLkRleGllUmVhY3RIb29rcyA9IHt9LCBnbG9iYWwuRGV4aWUsIGdsb2JhbC5SZWFjdCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKGV4cG9ydHMsIGRleGllLCBSZWFjdCkgeyAndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBfaW50ZXJvcERlZmF1bHRMZWdhY3kgKGUpIHsgcmV0dXJuIGUgJiYgdHlwZW9mIGUgPT09ICdvYmplY3QnICYmICdkZWZhdWx0JyBpbiBlID8gZSA6IHsgJ2RlZmF1bHQnOiBlIH07IH1cblxuICAgIHZhciBSZWFjdF9fZGVmYXVsdCA9IC8qI19fUFVSRV9fKi9faW50ZXJvcERlZmF1bHRMZWdhY3koUmVhY3QpO1xuXG4gICAgLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcbiAgICBQZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxuICAgIHB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcbiAgICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcbiAgICBSRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuICAgIEFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuICAgIElORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG4gICAgTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuICAgIE9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuICAgIFBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxuICAgIHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIH07XG5cbiAgICAvKiogVGhpcyBmaWxlIGlzIGNvcGllZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL21hc3Rlci9wYWNrYWdlcy91c2Utc3Vic2NyaXB0aW9uL3NyYy91c2VTdWJzY3JpcHRpb24uanNcbiAgICAgKiBhbmQgdXBkYXRlZCBieSBEYXZpZCBGYWhsYW5kZXIgdG8gYWxzbyBoYW5kbGUgZXJyb3IgY2FsbGJhY2tzIGJ5IHRocm93aW5nIHRoZSBlcnJvciBpbiB0aGUgcmVuZGVyZXJcbiAgICAgKiBzbyBpdCBjYW4gYmUgY2F1Z2h0IGJ5IGEgcmVhY3QgZXJyb3IgYm91bmRyYXJ5LlxuICAgICAqL1xuICAgIHZhciB1c2VEZWJ1Z1ZhbHVlID0gUmVhY3RfX2RlZmF1bHRbJ2RlZmF1bHQnXS51c2VEZWJ1Z1ZhbHVlLCB1c2VFZmZlY3QgPSBSZWFjdF9fZGVmYXVsdFsnZGVmYXVsdCddLnVzZUVmZmVjdCwgdXNlU3RhdGUgPSBSZWFjdF9fZGVmYXVsdFsnZGVmYXVsdCddLnVzZVN0YXRlO1xuICAgIC8vIEhvb2sgdXNlZCBmb3Igc2FmZWx5IG1hbmFnaW5nIHN1YnNjcmlwdGlvbnMgaW4gY29uY3VycmVudCBtb2RlLlxuICAgIC8vXG4gICAgLy8gSW4gb3JkZXIgdG8gYXZvaWQgcmVtb3ZpbmcgYW5kIHJlLWFkZGluZyBzdWJzY3JpcHRpb25zIGVhY2ggdGltZSB0aGlzIGhvb2sgaXMgY2FsbGVkLFxuICAgIC8vIHRoZSBwYXJhbWV0ZXJzIHBhc3NlZCB0byB0aGlzIGhvb2sgc2hvdWxkIGJlIG1lbW9pemVkIGluIHNvbWUgd2F54oCTXG4gICAgLy8gZWl0aGVyIGJ5IHdyYXBwaW5nIHRoZSBlbnRpcmUgcGFyYW1zIG9iamVjdCB3aXRoIHVzZU1lbW8oKVxuICAgIC8vIG9yIGJ5IHdyYXBwaW5nIHRoZSBpbmRpdmlkdWFsIGNhbGxiYWNrcyB3aXRoIHVzZUNhbGxiYWNrKCkuXG4gICAgZnVuY3Rpb24gdXNlU3Vic2NyaXB0aW9uKF9hKSB7XG4gICAgICAgIHZhciBcbiAgICAgICAgLy8gKFN5bmNocm9ub3VzbHkpIHJldHVybnMgdGhlIGN1cnJlbnQgdmFsdWUgb2Ygb3VyIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgZ2V0Q3VycmVudFZhbHVlID0gX2EuZ2V0Q3VycmVudFZhbHVlLCBcbiAgICAgICAgLy8gVGhpcyBmdW5jdGlvbiBpcyBwYXNzZWQgYW4gZXZlbnQgaGFuZGxlciB0byBhdHRhY2ggdG8gdGhlIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgLy8gSXQgc2hvdWxkIHJldHVybiBhbiB1bnN1YnNjcmliZSBmdW5jdGlvbiB0aGF0IHJlbW92ZXMgdGhlIGhhbmRsZXIuXG4gICAgICAgIHN1YnNjcmliZSA9IF9hLnN1YnNjcmliZTtcbiAgICAgICAgLy8gUmVhZCB0aGUgY3VycmVudCB2YWx1ZSBmcm9tIG91ciBzdWJzY3JpcHRpb24uXG4gICAgICAgIC8vIFdoZW4gdGhpcyB2YWx1ZSBjaGFuZ2VzLCB3ZSdsbCBzY2hlZHVsZSBhbiB1cGRhdGUgd2l0aCBSZWFjdC5cbiAgICAgICAgLy8gSXQncyBpbXBvcnRhbnQgdG8gYWxzbyBzdG9yZSB0aGUgaG9vayBwYXJhbXMgc28gdGhhdCB3ZSBjYW4gY2hlY2sgZm9yIHN0YWxlbmVzcy5cbiAgICAgICAgLy8gKFNlZSB0aGUgY29tbWVudCBpbiBjaGVja0ZvclVwZGF0ZXMoKSBiZWxvdyBmb3IgbW9yZSBpbmZvLilcbiAgICAgICAgdmFyIF9iID0gdXNlU3RhdGUoZnVuY3Rpb24gKCkgeyByZXR1cm4gKHtcbiAgICAgICAgICAgIGdldEN1cnJlbnRWYWx1ZTogZ2V0Q3VycmVudFZhbHVlLFxuICAgICAgICAgICAgc3Vic2NyaWJlOiBzdWJzY3JpYmUsXG4gICAgICAgICAgICB2YWx1ZTogZ2V0Q3VycmVudFZhbHVlKCksXG4gICAgICAgICAgICBlcnJvcjogbnVsbFxuICAgICAgICB9KTsgfSksIHN0YXRlID0gX2JbMF0sIHNldFN0YXRlID0gX2JbMV07XG4gICAgICAgIC8vIElmIHRoZXJlIGlzIGFuIGVycm9yLCB0aHJvdyBpdCBzbyB0aGF0IGFuIEVycm9yIEJvdW5kcmFyeSBjYW4gY2F0Y2ggaXQuXG4gICAgICAgIGlmIChzdGF0ZS5lcnJvcilcbiAgICAgICAgICAgIHRocm93IHN0YXRlLmVycm9yO1xuICAgICAgICB2YXIgdmFsdWVUb1JldHVybiA9IHN0YXRlLnZhbHVlO1xuICAgICAgICAvLyBJZiBwYXJhbWV0ZXJzIGhhdmUgY2hhbmdlZCBzaW5jZSBvdXIgbGFzdCByZW5kZXIsIHNjaGVkdWxlIGFuIHVwZGF0ZSB3aXRoIGl0cyBjdXJyZW50IHZhbHVlLlxuICAgICAgICBpZiAoc3RhdGUuZ2V0Q3VycmVudFZhbHVlICE9PSBnZXRDdXJyZW50VmFsdWUgfHxcbiAgICAgICAgICAgIHN0YXRlLnN1YnNjcmliZSAhPT0gc3Vic2NyaWJlKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgc3Vic2NyaXB0aW9uIGhhcyBiZWVuIHVwZGF0ZWQsIHdlJ2xsIHNjaGVkdWxlIGFub3RoZXIgdXBkYXRlIHdpdGggUmVhY3QuXG4gICAgICAgICAgICAvLyBSZWFjdCB3aWxsIHByb2Nlc3MgdGhpcyB1cGRhdGUgaW1tZWRpYXRlbHksIHNvIHRoZSBvbGQgc3Vic2NyaXB0aW9uIHZhbHVlIHdvbid0IGJlIGNvbW1pdHRlZC5cbiAgICAgICAgICAgIC8vIEl0IGlzIHN0aWxsIG5pY2UgdG8gYXZvaWQgcmV0dXJuaW5nIGEgbWlzbWF0Y2hlZCB2YWx1ZSB0aG91Z2gsIHNvIGxldCdzIG92ZXJyaWRlIHRoZSByZXR1cm4gdmFsdWUuXG4gICAgICAgICAgICB2YWx1ZVRvUmV0dXJuID0gZ2V0Q3VycmVudFZhbHVlKCk7XG4gICAgICAgICAgICBzZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgZ2V0Q3VycmVudFZhbHVlOiBnZXRDdXJyZW50VmFsdWUsXG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlOiBzdWJzY3JpYmUsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlVG9SZXR1cm4sXG4gICAgICAgICAgICAgICAgZXJyb3I6IG51bGxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIERpc3BsYXkgdGhlIGN1cnJlbnQgdmFsdWUgZm9yIHRoaXMgaG9vayBpbiBSZWFjdCBEZXZUb29scy5cbiAgICAgICAgdXNlRGVidWdWYWx1ZSh2YWx1ZVRvUmV0dXJuKTtcbiAgICAgICAgLy8gSXQgaXMgaW1wb3J0YW50IG5vdCB0byBzdWJzY3JpYmUgd2hpbGUgcmVuZGVyaW5nIGJlY2F1c2UgdGhpcyBjYW4gbGVhZCB0byBtZW1vcnkgbGVha3MuXG4gICAgICAgIC8vIChMZWFybiBtb3JlIGF0IHJlYWN0anMub3JnL2RvY3Mvc3RyaWN0LW1vZGUuaHRtbCNkZXRlY3RpbmctdW5leHBlY3RlZC1zaWRlLWVmZmVjdHMpXG4gICAgICAgIC8vIEluc3RlYWQsIHdlIHdhaXQgdW50aWwgdGhlIGNvbW1pdCBwaGFzZSB0byBhdHRhY2ggb3VyIGhhbmRsZXIuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFdlIGludGVudGlvbmFsbHkgdXNlIGEgcGFzc2l2ZSBlZmZlY3QgKHVzZUVmZmVjdCkgcmF0aGVyIHRoYW4gYSBzeW5jaHJvbm91cyBvbmUgKHVzZUxheW91dEVmZmVjdClcbiAgICAgICAgLy8gc28gdGhhdCB3ZSBkb24ndCBzdHJldGNoIHRoZSBjb21taXQgcGhhc2UuXG4gICAgICAgIC8vIFRoaXMgYWxzbyBoYXMgYW4gYWRkZWQgYmVuZWZpdCB3aGVuIG11bHRpcGxlIGNvbXBvbmVudHMgYXJlIHN1YnNjcmliZWQgdG8gdGhlIHNhbWUgc291cmNlOlxuICAgICAgICAvLyBJdCBhbGxvd3MgZWFjaCBvZiB0aGUgZXZlbnQgaGFuZGxlcnMgdG8gc2FmZWx5IHNjaGVkdWxlIHdvcmsgd2l0aG91dCBwb3RlbnRpYWxseSByZW1vdmluZyBhbiBhbm90aGVyIGhhbmRsZXIuXG4gICAgICAgIC8vIChMZWFybiBtb3JlIGF0IGh0dHBzOi8vY29kZXNhbmRib3guaW8vcy9rMHl2cjU5NzBvKVxuICAgICAgICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRpZFVuc3Vic2NyaWJlID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgY2hlY2tGb3JVcGRhdGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIEl0J3MgcG9zc2libGUgdGhhdCB0aGlzIGNhbGxiYWNrIHdpbGwgYmUgaW52b2tlZCBldmVuIGFmdGVyIGJlaW5nIHVuc3Vic2NyaWJlZCxcbiAgICAgICAgICAgICAgICAvLyBpZiBpdCdzIHJlbW92ZWQgYXMgYSByZXN1bHQgb2YgYSBzdWJzY3JpcHRpb24gZXZlbnQvdXBkYXRlLlxuICAgICAgICAgICAgICAgIC8vIEluIHRoaXMgY2FzZSwgUmVhY3Qgd2lsbCBsb2cgYSBERVYgd2FybmluZyBhYm91dCBhbiB1cGRhdGUgZnJvbSBhbiB1bm1vdW50ZWQgY29tcG9uZW50LlxuICAgICAgICAgICAgICAgIC8vIFdlIGNhbiBhdm9pZCB0cmlnZ2VyaW5nIHRoYXQgd2FybmluZyB3aXRoIHRoaXMgY2hlY2suXG4gICAgICAgICAgICAgICAgaWYgKGRpZFVuc3Vic2NyaWJlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gV2UgdXNlIGEgc3RhdGUgdXBkYXRlciBmdW5jdGlvbiB0byBhdm9pZCBzY2hlZHVsaW5nIHdvcmsgZm9yIGEgc3RhbGUgc291cmNlLlxuICAgICAgICAgICAgICAgIC8vIEhvd2V2ZXIgaXQncyBpbXBvcnRhbnQgdG8gZWFnZXJseSByZWFkIHRoZSBjdXJyZW50bHkgdmFsdWUsXG4gICAgICAgICAgICAgICAgLy8gc28gdGhhdCBhbGwgc2NoZWR1bGVkIHdvcmsgc2hhcmVzIHRoZSBzYW1lIHZhbHVlIChpbiB0aGUgZXZlbnQgb2YgbXVsdGlwbGUgc3Vic2NyaXB0aW9ucykuXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBhdm9pZHMgdmlzdWFsIFwidGVhcmluZ1wiIHdoZW4gYSBtdXRhdGlvbiBoYXBwZW5zIGR1cmluZyBhIChjb25jdXJyZW50KSByZW5kZXIuXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZ2V0Q3VycmVudFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgc2V0U3RhdGUoZnVuY3Rpb24gKHByZXZTdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZ25vcmUgdmFsdWVzIGZyb20gc3RhbGUgc291cmNlcyFcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luY2Ugd2Ugc3Vic2NyaWJlIGFuIHVuc3Vic2NyaWJlIGluIGEgcGFzc2l2ZSBlZmZlY3QsXG4gICAgICAgICAgICAgICAgICAgIC8vIGl0J3MgcG9zc2libGUgdGhhdCB0aGlzIGNhbGxiYWNrIHdpbGwgYmUgaW52b2tlZCBmb3IgYSBzdGFsZSAocHJldmlvdXMpIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBjaGVjayBhdm9pZHMgc2NoZWR1bGluZyBhbiB1cGRhdGUgZm9yIHRoYXQgc3RhbGUgc3Vic2NyaXB0aW9uLlxuICAgICAgICAgICAgICAgICAgICBpZiAocHJldlN0YXRlLmdldEN1cnJlbnRWYWx1ZSAhPT0gZ2V0Q3VycmVudFZhbHVlIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2U3RhdGUuc3Vic2NyaWJlICE9PSBzdWJzY3JpYmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2U3RhdGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gU29tZSBzdWJzY3JpcHRpb25zIHdpbGwgYXV0by1pbnZva2UgdGhlIGhhbmRsZXIsIGV2ZW4gaWYgdGhlIHZhbHVlIGhhc24ndCBjaGFuZ2VkLlxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgdmFsdWUgaGFzbid0IGNoYW5nZWQsIG5vIHVwZGF0ZSBpcyBuZWVkZWQuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJldHVybiBzdGF0ZSBhcy1pcyBzbyBSZWFjdCBjYW4gYmFpbCBvdXQgYW5kIGF2b2lkIGFuIHVubmVjZXNzYXJ5IHJlbmRlci5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZTdGF0ZS52YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2U3RhdGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBwcmV2U3RhdGUpLCB7IHZhbHVlOiB2YWx1ZSB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgdW5zdWJzY3JpYmUgPSBzdWJzY3JpYmUoY2hlY2tGb3JVcGRhdGVzLCBmdW5jdGlvbiAoZXJyb3IpIHsgcmV0dXJuIHNldFN0YXRlKGZ1bmN0aW9uIChwcmV2U3RhdGUpIHsgcmV0dXJuIChfX2Fzc2lnbihfX2Fzc2lnbih7fSwgcHJldlN0YXRlKSwgeyBlcnJvcjogZXJyb3IgfSkpOyB9KTsgfSk7XG4gICAgICAgICAgICAvLyBCZWNhdXNlIHdlJ3JlIHN1YnNjcmliaW5nIGluIGEgcGFzc2l2ZSBlZmZlY3QsXG4gICAgICAgICAgICAvLyBpdCdzIHBvc3NpYmxlIHRoYXQgYW4gdXBkYXRlIGhhcyBvY2N1cnJlZCBiZXR3ZWVuIHJlbmRlciBhbmQgb3VyIGVmZmVjdCBoYW5kbGVyLlxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIHRoaXMgYW5kIHNjaGVkdWxlIGFuIHVwZGF0ZSBpZiB3b3JrIGhhcyBvY2N1cnJlZC5cbiAgICAgICAgICAgIGNoZWNrRm9yVXBkYXRlcygpO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkaWRVbnN1YnNjcmliZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sIFtnZXRDdXJyZW50VmFsdWUsIHN1YnNjcmliZV0pO1xuICAgICAgICAvLyBSZXR1cm4gdGhlIGN1cnJlbnQgdmFsdWUgZm9yIG91ciBjYWxsZXIgdG8gdXNlIHdoaWxlIHJlbmRlcmluZy5cbiAgICAgICAgcmV0dXJuIHZhbHVlVG9SZXR1cm47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXNlTGl2ZVF1ZXJ5KHF1ZXJpZXIsIGRlcGVuZGVuY2llcywgZGVmYXVsdFJlc3VsdCkge1xuICAgICAgICB2YXIgX2EgPSBSZWFjdF9fZGVmYXVsdFsnZGVmYXVsdCddLnVzZVN0YXRlKGRlZmF1bHRSZXN1bHQpLCBsYXN0UmVzdWx0ID0gX2FbMF0sIHNldExhc3RSZXN1bHQgPSBfYVsxXTtcbiAgICAgICAgdmFyIHN1YnNjcmlwdGlvbiA9IFJlYWN0X19kZWZhdWx0WydkZWZhdWx0J10udXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBNYWtlIGl0IHJlbWVtYmVyIHByZXZpdXMgc3Vic2NyaXB0aW9uJ3MgZGVmYXVsdCB2YWx1ZSB3aGVuXG4gICAgICAgICAgICAvLyByZXN1YnNjcmliaW5nICjDoSBsYSB1c2VUcmFuc2l0aW9uKCkpXG4gICAgICAgICAgICB2YXIgY3VycmVudFZhbHVlID0gbGFzdFJlc3VsdDtcbiAgICAgICAgICAgIHZhciBvYnNlcnZhYmxlID0gZGV4aWUubGl2ZVF1ZXJ5KHF1ZXJpZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBnZXRDdXJyZW50VmFsdWU6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGN1cnJlbnRWYWx1ZTsgfSxcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uIChvbk5leHQsIG9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVzU3Vic2NyaXB0aW9uID0gb2JzZXJ2YWJsZS5zdWJzY3JpYmUoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldExhc3RSZXN1bHQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb25OZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgb25FcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlc1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZS5iaW5kKGVzU3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LCBcbiAgICAgICAgLy8gUmUtc3Vic2NyaWJlIGFueSB0aW1lIGFueSBvZiB0aGUgZ2l2ZW4gZGVwZW5kZW5jaWVzIGNoYW5nZVxuICAgICAgICBkZXBlbmRlbmNpZXMgfHwgW10pO1xuICAgICAgICAvLyBUaGUgdmFsdWUgcmV0dXJuZWQgYnkgdGhpcyBob29rIHJlZmxlY3RzIHRoZSBjdXJyZW50IHJlc3VsdCBmcm9tIHRoZSBxdWVyaWVyXG4gICAgICAgIC8vIE91ciBjb21wb25lbnQgd2lsbCBhdXRvbWF0aWNhbGx5IGJlIHJlLXJlbmRlcmVkIHdoZW4gdGhhdCB2YWx1ZSBjaGFuZ2VzLlxuICAgICAgICB2YXIgdmFsdWUgPSB1c2VTdWJzY3JpcHRpb24oc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGV4cG9ydHMudXNlTGl2ZVF1ZXJ5ID0gdXNlTGl2ZVF1ZXJ5O1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxufSkpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRleGllLXJlYWN0LWhvb2tzLmpzLm1hcFxuIl0sIm5hbWVzIjpbInJlcXVpcmUkJDEiLCJ0aGlzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsQ0FBQyxVQUFVLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDNUIsS0FBbUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFnQixFQUFFQSxLQUFnQixDQUFDLENBRXlCLENBQUM7QUFDakosQ0FBQyxDQUFDQyxjQUFJLEdBQUcsVUFBVSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUMxQztBQUNBLElBQUksU0FBUyxxQkFBcUIsRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksU0FBUyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0SDtBQUNBLElBQUksSUFBSSxjQUFjLGdCQUFnQixxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSSxRQUFRLEdBQUcsV0FBVztBQUM5QixRQUFRLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN6RCxZQUFZLEtBQUssSUFBSSxDQUFD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
