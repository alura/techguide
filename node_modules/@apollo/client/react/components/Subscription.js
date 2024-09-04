import * as PropTypes from "prop-types";
import { useSubscription } from "../hooks/index.js";
/**
 * @deprecated
 * Official support for React Apollo render prop components ended in March 2020.
 * This library is still included in the `@apollo/client` package,
 * but it no longer receives feature updates or bug fixes.
 */
export function Subscription(props) {
    var result = useSubscription(props.subscription, props);
    return props.children && result ? props.children(result) : null;
}
Subscription.propTypes = {
    subscription: PropTypes.object.isRequired,
    variables: PropTypes.object,
    children: PropTypes.func,
    onSubscriptionData: PropTypes.func,
    onData: PropTypes.func,
    onSubscriptionComplete: PropTypes.func,
    onComplete: PropTypes.func,
    shouldResubscribe: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};
//# sourceMappingURL=Subscription.js.map