import { withCancel } from '@graphql-tools/utils';
export function addCancelToResponseStream(resultStream, controller) {
    return withCancel(resultStream, () => {
        if (!controller.signal.aborted) {
            controller.abort();
        }
    });
}
