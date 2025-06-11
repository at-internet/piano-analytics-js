import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../../config.js';

const PENDING_EVENTS_KEY = 'piano_analytics_pending_events';
const MAX_PENDING_EVENTS = 100; // Maximum number of pending events to store

// In-memory cache of pending events
let pendingEventsCache = null;

// Store the active loading promise
let pendingEventsPromise = null;

const getPendingEvents = async () => {
    // If we already have the events in memory, return them
    if (pendingEventsCache !== null) {
        return pendingEventsCache;
    }
    
    // If there's already a promise loading the events, return that promise
    if (pendingEventsPromise) {
        return pendingEventsPromise;
    }
    
    // Create a new promise and store it for reuse
    pendingEventsPromise = (async () => {
        try {
            const pendingEvents = await AsyncStorage.getItem(PENDING_EVENTS_KEY);
            pendingEventsCache = pendingEvents ? JSON.parse(pendingEvents) : [];
            return pendingEventsCache;
        } catch (error) {
            console.error('Failed to get stored pending events:', error);
            pendingEventsCache = [];
            return pendingEventsCache;
        } finally {
            // Clear the promise reference when done
            pendingEventsPromise = null;
        }
    })();
    
    return pendingEventsPromise;
};

const addPendingEvents = (eventsArray) => {
    // Update the cache with new events and limit to the most recent MAX_PENDING_EVENTS
    const combinedEvents = [...pendingEventsCache, ...eventsArray];
    pendingEventsCache = combinedEvents.slice(Math.max(0, combinedEvents.length - MAX_PENDING_EVENTS));

    __DEV__ && console.log(`Added ${eventsArray.length} events to pending events cache, total now: ${pendingEventsCache.length}`);
};

const persistPendingEvents = async () => {
    try {
        await AsyncStorage.setItem(PENDING_EVENTS_KEY, JSON.stringify(pendingEventsCache));
    } catch (error) {
        console.error('Failed to persist pending events:', error);
    }
};

// Load pending events at startup
const loadPendingEvents = () => {
    getPendingEvents().then(events => {
        if (events.length > 0) {
            __DEV__ && console.log(`Loaded ${events.length} pending events from storage`);
        }
    }).catch(error => {
        console.error('Error loading pending events at startup:', error);
    });
};

// Initialize loading of pending events
loadPendingEvents();

// Add events to cache and persist them
const storeEvents = async (eventsToStore) => {
    if (Array.isArray(eventsToStore) && eventsToStore.length > 0) {
        eventsToStore.forEach(event => {
            event?.data && (event.data.connection_type = 'OFFLINE'); // tell Piano to honor device_timestamp_utc
        });

        !pendingEventsCache && await getPendingEvents(); // Ensure we have the pending events loaded before adding new ones

        // We add, rather than replace, to avoid losing any other events that may have been added by concurrent requests
        addPendingEvents(eventsToStore);
        await persistPendingEvents();
    }
};

const http = {
    post: async function (model, url, data, callback) {
        // data: {events: array}
        let dataToSend = data;
        let postBody = null;

        try {
            // Check if the caller asked to postpone tracking, via the send_later flag
            // if (data?.events?.[0]?.data?.send_later) {
            //     delete data.events[0].data.send_later; // Remove the send_later flag from the event
            //     __DEV__ && console.log('Event has send_later flag, storing as pending event');
            //     storeEvents(data.events);
            //     return Promise.resolve();
            // }

            // Try to merge any previously pending events
            // do not worry if pending events are not loaded yet, they will be processed in the next request
            if (pendingEventsCache?.length > 0) {
                __DEV__ && console.log(`Found ${pendingEventsCache.length} pending events to merge`);
                __DEV__ && console.log('Pending events:', pendingEventsCache);
                
                // Combine the pending events with the current events and replace the data object, to avoid modifying the original data
                dataToSend = {events: [...pendingEventsCache, ...data.events]};
                __DEV__ && console.log(`Merged ${pendingEventsCache.length} previous events with current request`);
                
                // Clear pending events - we'll re-add any that fail again
                // this is critical, as otherwise other concurrent requests may read the same pending events and duplicate them when failing
                pendingEventsCache = [];
                await persistPendingEvents();
            }
            __DEV__ && console.log('Data to send:', dataToSend);
            __DEV__ && console.log('Sending to URL:', url);
             // serialize here, if it fails it is safer to lose all the events because we do not know where the problem is
            postBody = JSON.stringify(dataToSend);
        } catch (error) {
            console.error('Error creating post body:', error);
            // If there's an error, we should still proceed with the original request
        }
        
        if (!postBody) {
            return Promise.reject(new Error('Cannot create post body'));
        }

        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8',
            },
            body: postBody // Use either original or modified data
        };
        
        if (Platform.OS === 'android') {
            params.headers['User-Agent'] = `PA SDK React Native Android/${Config.version}`;
        }
        
        return fetch(url, params)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                __DEV__ && console.log('Success tracking event');
                callback && callback(url, response);
            })
            .catch(async (error) => {
                __DEV__ && console.log('Request failed, storing events as pending:', error);
                storeEvents(dataToSend.events);
            });
    }
};

export {http};
