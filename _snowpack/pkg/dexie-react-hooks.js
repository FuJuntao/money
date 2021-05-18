import { g as getDefaultExportFromNamespaceIfNotNamed, c as createCommonjsModule, a as commonjsGlobal } from './common/_commonjsHelpers-798ad6a7.js';
import { d as dexie } from './common/dexie-164a5663.js';
import { r as react } from './common/index-404563d3.js';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV4aWUtcmVhY3QtaG9va3MuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9kZXhpZS1yZWFjdC1ob29rcy9kaXN0L2RleGllLXJlYWN0LWhvb2tzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzLCByZXF1aXJlKCdkZXhpZScpLCByZXF1aXJlKCdyZWFjdCcpKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cycsICdkZXhpZScsICdyZWFjdCddLCBmYWN0b3J5KSA6XG4gICAgKGdsb2JhbCA9IHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFRoaXMgOiBnbG9iYWwgfHwgc2VsZiwgZmFjdG9yeShnbG9iYWwuRGV4aWVSZWFjdEhvb2tzID0ge30sIGdsb2JhbC5EZXhpZSwgZ2xvYmFsLlJlYWN0KSk7XG59KHRoaXMsIChmdW5jdGlvbiAoZXhwb3J0cywgZGV4aWUsIFJlYWN0KSB7ICd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIF9pbnRlcm9wRGVmYXVsdExlZ2FjeSAoZSkgeyByZXR1cm4gZSAmJiB0eXBlb2YgZSA9PT0gJ29iamVjdCcgJiYgJ2RlZmF1bHQnIGluIGUgPyBlIDogeyAnZGVmYXVsdCc6IGUgfTsgfVxuXG4gICAgdmFyIFJlYWN0X19kZWZhdWx0ID0gLyojX19QVVJFX18qL19pbnRlcm9wRGVmYXVsdExlZ2FjeShSZWFjdCk7XG5cbiAgICAvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuICAgIFBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG4gICAgcHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuICAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuICAgIFJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG4gICAgQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG4gICAgSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbiAgICBMT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG4gICAgT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG4gICAgUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG4gICAgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgfTtcblxuICAgIC8qKiBUaGlzIGZpbGUgaXMgY29waWVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2Jsb2IvbWFzdGVyL3BhY2thZ2VzL3VzZS1zdWJzY3JpcHRpb24vc3JjL3VzZVN1YnNjcmlwdGlvbi5qc1xuICAgICAqIGFuZCB1cGRhdGVkIGJ5IERhdmlkIEZhaGxhbmRlciB0byBhbHNvIGhhbmRsZSBlcnJvciBjYWxsYmFja3MgYnkgdGhyb3dpbmcgdGhlIGVycm9yIGluIHRoZSByZW5kZXJlclxuICAgICAqIHNvIGl0IGNhbiBiZSBjYXVnaHQgYnkgYSByZWFjdCBlcnJvciBib3VuZHJhcnkuXG4gICAgICovXG4gICAgdmFyIHVzZURlYnVnVmFsdWUgPSBSZWFjdF9fZGVmYXVsdFsnZGVmYXVsdCddLnVzZURlYnVnVmFsdWUsIHVzZUVmZmVjdCA9IFJlYWN0X19kZWZhdWx0WydkZWZhdWx0J10udXNlRWZmZWN0LCB1c2VTdGF0ZSA9IFJlYWN0X19kZWZhdWx0WydkZWZhdWx0J10udXNlU3RhdGU7XG4gICAgLy8gSG9vayB1c2VkIGZvciBzYWZlbHkgbWFuYWdpbmcgc3Vic2NyaXB0aW9ucyBpbiBjb25jdXJyZW50IG1vZGUuXG4gICAgLy9cbiAgICAvLyBJbiBvcmRlciB0byBhdm9pZCByZW1vdmluZyBhbmQgcmUtYWRkaW5nIHN1YnNjcmlwdGlvbnMgZWFjaCB0aW1lIHRoaXMgaG9vayBpcyBjYWxsZWQsXG4gICAgLy8gdGhlIHBhcmFtZXRlcnMgcGFzc2VkIHRvIHRoaXMgaG9vayBzaG91bGQgYmUgbWVtb2l6ZWQgaW4gc29tZSB3YXnigJNcbiAgICAvLyBlaXRoZXIgYnkgd3JhcHBpbmcgdGhlIGVudGlyZSBwYXJhbXMgb2JqZWN0IHdpdGggdXNlTWVtbygpXG4gICAgLy8gb3IgYnkgd3JhcHBpbmcgdGhlIGluZGl2aWR1YWwgY2FsbGJhY2tzIHdpdGggdXNlQ2FsbGJhY2soKS5cbiAgICBmdW5jdGlvbiB1c2VTdWJzY3JpcHRpb24oX2EpIHtcbiAgICAgICAgdmFyIFxuICAgICAgICAvLyAoU3luY2hyb25vdXNseSkgcmV0dXJucyB0aGUgY3VycmVudCB2YWx1ZSBvZiBvdXIgc3Vic2NyaXB0aW9uLlxuICAgICAgICBnZXRDdXJyZW50VmFsdWUgPSBfYS5nZXRDdXJyZW50VmFsdWUsIFxuICAgICAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHBhc3NlZCBhbiBldmVudCBoYW5kbGVyIHRvIGF0dGFjaCB0byB0aGUgc3Vic2NyaXB0aW9uLlxuICAgICAgICAvLyBJdCBzaG91bGQgcmV0dXJuIGFuIHVuc3Vic2NyaWJlIGZ1bmN0aW9uIHRoYXQgcmVtb3ZlcyB0aGUgaGFuZGxlci5cbiAgICAgICAgc3Vic2NyaWJlID0gX2Euc3Vic2NyaWJlO1xuICAgICAgICAvLyBSZWFkIHRoZSBjdXJyZW50IHZhbHVlIGZyb20gb3VyIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgLy8gV2hlbiB0aGlzIHZhbHVlIGNoYW5nZXMsIHdlJ2xsIHNjaGVkdWxlIGFuIHVwZGF0ZSB3aXRoIFJlYWN0LlxuICAgICAgICAvLyBJdCdzIGltcG9ydGFudCB0byBhbHNvIHN0b3JlIHRoZSBob29rIHBhcmFtcyBzbyB0aGF0IHdlIGNhbiBjaGVjayBmb3Igc3RhbGVuZXNzLlxuICAgICAgICAvLyAoU2VlIHRoZSBjb21tZW50IGluIGNoZWNrRm9yVXBkYXRlcygpIGJlbG93IGZvciBtb3JlIGluZm8uKVxuICAgICAgICB2YXIgX2IgPSB1c2VTdGF0ZShmdW5jdGlvbiAoKSB7IHJldHVybiAoe1xuICAgICAgICAgICAgZ2V0Q3VycmVudFZhbHVlOiBnZXRDdXJyZW50VmFsdWUsXG4gICAgICAgICAgICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcbiAgICAgICAgICAgIHZhbHVlOiBnZXRDdXJyZW50VmFsdWUoKSxcbiAgICAgICAgICAgIGVycm9yOiBudWxsXG4gICAgICAgIH0pOyB9KSwgc3RhdGUgPSBfYlswXSwgc2V0U3RhdGUgPSBfYlsxXTtcbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gZXJyb3IsIHRocm93IGl0IHNvIHRoYXQgYW4gRXJyb3IgQm91bmRyYXJ5IGNhbiBjYXRjaCBpdC5cbiAgICAgICAgaWYgKHN0YXRlLmVycm9yKVxuICAgICAgICAgICAgdGhyb3cgc3RhdGUuZXJyb3I7XG4gICAgICAgIHZhciB2YWx1ZVRvUmV0dXJuID0gc3RhdGUudmFsdWU7XG4gICAgICAgIC8vIElmIHBhcmFtZXRlcnMgaGF2ZSBjaGFuZ2VkIHNpbmNlIG91ciBsYXN0IHJlbmRlciwgc2NoZWR1bGUgYW4gdXBkYXRlIHdpdGggaXRzIGN1cnJlbnQgdmFsdWUuXG4gICAgICAgIGlmIChzdGF0ZS5nZXRDdXJyZW50VmFsdWUgIT09IGdldEN1cnJlbnRWYWx1ZSB8fFxuICAgICAgICAgICAgc3RhdGUuc3Vic2NyaWJlICE9PSBzdWJzY3JpYmUpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBzdWJzY3JpcHRpb24gaGFzIGJlZW4gdXBkYXRlZCwgd2UnbGwgc2NoZWR1bGUgYW5vdGhlciB1cGRhdGUgd2l0aCBSZWFjdC5cbiAgICAgICAgICAgIC8vIFJlYWN0IHdpbGwgcHJvY2VzcyB0aGlzIHVwZGF0ZSBpbW1lZGlhdGVseSwgc28gdGhlIG9sZCBzdWJzY3JpcHRpb24gdmFsdWUgd29uJ3QgYmUgY29tbWl0dGVkLlxuICAgICAgICAgICAgLy8gSXQgaXMgc3RpbGwgbmljZSB0byBhdm9pZCByZXR1cm5pbmcgYSBtaXNtYXRjaGVkIHZhbHVlIHRob3VnaCwgc28gbGV0J3Mgb3ZlcnJpZGUgdGhlIHJldHVybiB2YWx1ZS5cbiAgICAgICAgICAgIHZhbHVlVG9SZXR1cm4gPSBnZXRDdXJyZW50VmFsdWUoKTtcbiAgICAgICAgICAgIHNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBnZXRDdXJyZW50VmFsdWU6IGdldEN1cnJlbnRWYWx1ZSxcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVUb1JldHVybixcbiAgICAgICAgICAgICAgICBlcnJvcjogbnVsbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRGlzcGxheSB0aGUgY3VycmVudCB2YWx1ZSBmb3IgdGhpcyBob29rIGluIFJlYWN0IERldlRvb2xzLlxuICAgICAgICB1c2VEZWJ1Z1ZhbHVlKHZhbHVlVG9SZXR1cm4pO1xuICAgICAgICAvLyBJdCBpcyBpbXBvcnRhbnQgbm90IHRvIHN1YnNjcmliZSB3aGlsZSByZW5kZXJpbmcgYmVjYXVzZSB0aGlzIGNhbiBsZWFkIHRvIG1lbW9yeSBsZWFrcy5cbiAgICAgICAgLy8gKExlYXJuIG1vcmUgYXQgcmVhY3Rqcy5vcmcvZG9jcy9zdHJpY3QtbW9kZS5odG1sI2RldGVjdGluZy11bmV4cGVjdGVkLXNpZGUtZWZmZWN0cylcbiAgICAgICAgLy8gSW5zdGVhZCwgd2Ugd2FpdCB1bnRpbCB0aGUgY29tbWl0IHBoYXNlIHRvIGF0dGFjaCBvdXIgaGFuZGxlci5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gV2UgaW50ZW50aW9uYWxseSB1c2UgYSBwYXNzaXZlIGVmZmVjdCAodXNlRWZmZWN0KSByYXRoZXIgdGhhbiBhIHN5bmNocm9ub3VzIG9uZSAodXNlTGF5b3V0RWZmZWN0KVxuICAgICAgICAvLyBzbyB0aGF0IHdlIGRvbid0IHN0cmV0Y2ggdGhlIGNvbW1pdCBwaGFzZS5cbiAgICAgICAgLy8gVGhpcyBhbHNvIGhhcyBhbiBhZGRlZCBiZW5lZml0IHdoZW4gbXVsdGlwbGUgY29tcG9uZW50cyBhcmUgc3Vic2NyaWJlZCB0byB0aGUgc2FtZSBzb3VyY2U6XG4gICAgICAgIC8vIEl0IGFsbG93cyBlYWNoIG9mIHRoZSBldmVudCBoYW5kbGVycyB0byBzYWZlbHkgc2NoZWR1bGUgd29yayB3aXRob3V0IHBvdGVudGlhbGx5IHJlbW92aW5nIGFuIGFub3RoZXIgaGFuZGxlci5cbiAgICAgICAgLy8gKExlYXJuIG1vcmUgYXQgaHR0cHM6Ly9jb2Rlc2FuZGJveC5pby9zL2sweXZyNTk3MG8pXG4gICAgICAgIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGlkVW5zdWJzY3JpYmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBjaGVja0ZvclVwZGF0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gSXQncyBwb3NzaWJsZSB0aGF0IHRoaXMgY2FsbGJhY2sgd2lsbCBiZSBpbnZva2VkIGV2ZW4gYWZ0ZXIgYmVpbmcgdW5zdWJzY3JpYmVkLFxuICAgICAgICAgICAgICAgIC8vIGlmIGl0J3MgcmVtb3ZlZCBhcyBhIHJlc3VsdCBvZiBhIHN1YnNjcmlwdGlvbiBldmVudC91cGRhdGUuXG4gICAgICAgICAgICAgICAgLy8gSW4gdGhpcyBjYXNlLCBSZWFjdCB3aWxsIGxvZyBhIERFViB3YXJuaW5nIGFib3V0IGFuIHVwZGF0ZSBmcm9tIGFuIHVubW91bnRlZCBjb21wb25lbnQuXG4gICAgICAgICAgICAgICAgLy8gV2UgY2FuIGF2b2lkIHRyaWdnZXJpbmcgdGhhdCB3YXJuaW5nIHdpdGggdGhpcyBjaGVjay5cbiAgICAgICAgICAgICAgICBpZiAoZGlkVW5zdWJzY3JpYmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBXZSB1c2UgYSBzdGF0ZSB1cGRhdGVyIGZ1bmN0aW9uIHRvIGF2b2lkIHNjaGVkdWxpbmcgd29yayBmb3IgYSBzdGFsZSBzb3VyY2UuXG4gICAgICAgICAgICAgICAgLy8gSG93ZXZlciBpdCdzIGltcG9ydGFudCB0byBlYWdlcmx5IHJlYWQgdGhlIGN1cnJlbnRseSB2YWx1ZSxcbiAgICAgICAgICAgICAgICAvLyBzbyB0aGF0IGFsbCBzY2hlZHVsZWQgd29yayBzaGFyZXMgdGhlIHNhbWUgdmFsdWUgKGluIHRoZSBldmVudCBvZiBtdWx0aXBsZSBzdWJzY3JpcHRpb25zKS5cbiAgICAgICAgICAgICAgICAvLyBUaGlzIGF2b2lkcyB2aXN1YWwgXCJ0ZWFyaW5nXCIgd2hlbiBhIG11dGF0aW9uIGhhcHBlbnMgZHVyaW5nIGEgKGNvbmN1cnJlbnQpIHJlbmRlci5cbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBnZXRDdXJyZW50VmFsdWUoKTtcbiAgICAgICAgICAgICAgICBzZXRTdGF0ZShmdW5jdGlvbiAocHJldlN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElnbm9yZSB2YWx1ZXMgZnJvbSBzdGFsZSBzb3VyY2VzIVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB3ZSBzdWJzY3JpYmUgYW4gdW5zdWJzY3JpYmUgaW4gYSBwYXNzaXZlIGVmZmVjdCxcbiAgICAgICAgICAgICAgICAgICAgLy8gaXQncyBwb3NzaWJsZSB0aGF0IHRoaXMgY2FsbGJhY2sgd2lsbCBiZSBpbnZva2VkIGZvciBhIHN0YWxlIChwcmV2aW91cykgc3Vic2NyaXB0aW9uLlxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIGNoZWNrIGF2b2lkcyBzY2hlZHVsaW5nIGFuIHVwZGF0ZSBmb3IgdGhhdCBzdGFsZSBzdWJzY3JpcHRpb24uXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2U3RhdGUuZ2V0Q3VycmVudFZhbHVlICE9PSBnZXRDdXJyZW50VmFsdWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZTdGF0ZS5zdWJzY3JpYmUgIT09IHN1YnNjcmliZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZTdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBTb21lIHN1YnNjcmlwdGlvbnMgd2lsbCBhdXRvLWludm9rZSB0aGUgaGFuZGxlciwgZXZlbiBpZiB0aGUgdmFsdWUgaGFzbid0IGNoYW5nZWQuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSB2YWx1ZSBoYXNuJ3QgY2hhbmdlZCwgbm8gdXBkYXRlIGlzIG5lZWRlZC5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmV0dXJuIHN0YXRlIGFzLWlzIHNvIFJlYWN0IGNhbiBiYWlsIG91dCBhbmQgYXZvaWQgYW4gdW5uZWNlc3NhcnkgcmVuZGVyLlxuICAgICAgICAgICAgICAgICAgICBpZiAocHJldlN0YXRlLnZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZTdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIHByZXZTdGF0ZSksIHsgdmFsdWU6IHZhbHVlIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciB1bnN1YnNjcmliZSA9IHN1YnNjcmliZShjaGVja0ZvclVwZGF0ZXMsIGZ1bmN0aW9uIChlcnJvcikgeyByZXR1cm4gc2V0U3RhdGUoZnVuY3Rpb24gKHByZXZTdGF0ZSkgeyByZXR1cm4gKF9fYXNzaWduKF9fYXNzaWduKHt9LCBwcmV2U3RhdGUpLCB7IGVycm9yOiBlcnJvciB9KSk7IH0pOyB9KTtcbiAgICAgICAgICAgIC8vIEJlY2F1c2Ugd2UncmUgc3Vic2NyaWJpbmcgaW4gYSBwYXNzaXZlIGVmZmVjdCxcbiAgICAgICAgICAgIC8vIGl0J3MgcG9zc2libGUgdGhhdCBhbiB1cGRhdGUgaGFzIG9jY3VycmVkIGJldHdlZW4gcmVuZGVyIGFuZCBvdXIgZWZmZWN0IGhhbmRsZXIuXG4gICAgICAgICAgICAvLyBDaGVjayBmb3IgdGhpcyBhbmQgc2NoZWR1bGUgYW4gdXBkYXRlIGlmIHdvcmsgaGFzIG9jY3VycmVkLlxuICAgICAgICAgICAgY2hlY2tGb3JVcGRhdGVzKCk7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRpZFVuc3Vic2NyaWJlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSwgW2dldEN1cnJlbnRWYWx1ZSwgc3Vic2NyaWJlXSk7XG4gICAgICAgIC8vIFJldHVybiB0aGUgY3VycmVudCB2YWx1ZSBmb3Igb3VyIGNhbGxlciB0byB1c2Ugd2hpbGUgcmVuZGVyaW5nLlxuICAgICAgICByZXR1cm4gdmFsdWVUb1JldHVybjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1c2VMaXZlUXVlcnkocXVlcmllciwgZGVwZW5kZW5jaWVzLCBkZWZhdWx0UmVzdWx0KSB7XG4gICAgICAgIHZhciBfYSA9IFJlYWN0X19kZWZhdWx0WydkZWZhdWx0J10udXNlU3RhdGUoZGVmYXVsdFJlc3VsdCksIGxhc3RSZXN1bHQgPSBfYVswXSwgc2V0TGFzdFJlc3VsdCA9IF9hWzFdO1xuICAgICAgICB2YXIgc3Vic2NyaXB0aW9uID0gUmVhY3RfX2RlZmF1bHRbJ2RlZmF1bHQnXS51c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIE1ha2UgaXQgcmVtZW1iZXIgcHJldml1cyBzdWJzY3JpcHRpb24ncyBkZWZhdWx0IHZhbHVlIHdoZW5cbiAgICAgICAgICAgIC8vIHJlc3Vic2NyaWJpbmcgKMOhIGxhIHVzZVRyYW5zaXRpb24oKSlcbiAgICAgICAgICAgIHZhciBjdXJyZW50VmFsdWUgPSBsYXN0UmVzdWx0O1xuICAgICAgICAgICAgdmFyIG9ic2VydmFibGUgPSBkZXhpZS5saXZlUXVlcnkocXVlcmllcik7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGdldEN1cnJlbnRWYWx1ZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gY3VycmVudFZhbHVlOyB9LFxuICAgICAgICAgICAgICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKG9uTmV4dCwgb25FcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXNTdWJzY3JpcHRpb24gPSBvYnNlcnZhYmxlLnN1YnNjcmliZShmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0TGFzdFJlc3VsdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbk5leHQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9LCBvbkVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlLmJpbmQoZXNTdWJzY3JpcHRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sIFxuICAgICAgICAvLyBSZS1zdWJzY3JpYmUgYW55IHRpbWUgYW55IG9mIHRoZSBnaXZlbiBkZXBlbmRlbmNpZXMgY2hhbmdlXG4gICAgICAgIGRlcGVuZGVuY2llcyB8fCBbXSk7XG4gICAgICAgIC8vIFRoZSB2YWx1ZSByZXR1cm5lZCBieSB0aGlzIGhvb2sgcmVmbGVjdHMgdGhlIGN1cnJlbnQgcmVzdWx0IGZyb20gdGhlIHF1ZXJpZXJcbiAgICAgICAgLy8gT3VyIGNvbXBvbmVudCB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgcmUtcmVuZGVyZWQgd2hlbiB0aGF0IHZhbHVlIGNoYW5nZXMuXG4gICAgICAgIHZhciB2YWx1ZSA9IHVzZVN1YnNjcmlwdGlvbihzdWJzY3JpcHRpb24pO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZXhwb3J0cy51c2VMaXZlUXVlcnkgPSB1c2VMaXZlUXVlcnk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGV4aWUtcmVhY3QtaG9va3MuanMubWFwXG4iXSwibmFtZXMiOlsicmVxdWlyZSQkMSIsInRoaXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxDQUFDLFVBQVUsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUM1QixLQUFtRSxPQUFPLENBQUMsT0FBTyxFQUFFLFVBQWdCLEVBQUVBLEtBQWdCLENBQUMsQ0FFeUIsQ0FBQztBQUNqSixDQUFDLENBQUNDLGNBQUksR0FBRyxVQUFVLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQzFDO0FBQ0EsSUFBSSxTQUFTLHFCQUFxQixFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxTQUFTLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RIO0FBQ0EsSUFBSSxJQUFJLGNBQWMsZ0JBQWdCLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUFJLFFBQVEsR0FBRyxXQUFXO0FBQzlCLFFBQVEsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3pELFlBQVksS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUs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
