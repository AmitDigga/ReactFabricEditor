import { useEffect } from 'react';
import { Observable } from 'rxjs';
import { useForceUpdate } from './useForceUpdate';


export function useWatch(change$: Observable<void>) {
    const forceUpdate = useForceUpdate();
    useEffect(() => {
        const subscription = change$.subscribe(() => {
            forceUpdate();
        });
        return () => {
            subscription.unsubscribe();
        }
    }, [change$]);
}
