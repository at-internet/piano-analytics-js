import {cloneObject, uuid} from '../utils/index';

const AVInsights = function (pa) {
    const _config = {
        minHeartbeat: pa.getConfiguration('minHeartbeat'),
        minBufferingHeartbeat: pa.getConfiguration('minBufferingHeartbeat')
    };
    const ATVALUE = '_ATVALUE';
    const ATPREFIX = '_ATPREFIX';
    const Utility = function () {
        const _thisUtil = this;
        _thisUtil.debugError = {
            trigger: 'AvInsights:Media:setContentValues:Error',
            level: 'ERROR',
            messageObject: 'Not an object'
        };
        _thisUtil.processHeartbeatValue = function (val, min) {
            const _val = parseInt(val, 10);
            if (_val) {
                return Math.max(_val, min);
            }
            return 0;
        };
        _thisUtil.value2Number = function (val) {
            let validNumber = 0;
            if (!isNaN(Number(val))) {
                validNumber = Number(val);
            }
            return Math.max(validNumber, 0);
        };
    };

    function splitProtocolAndKey(key, toLower) {
        let _prefix, _key;
        if ((key.length < 2) || (key[1] !== ':')) {
            _prefix = '';
            _key = key;
        } else if ((key.length < 4) || (key[3] !== ':')) {
            _prefix = key.substring(0, 1);
            _key = key.substring(2, key.length);
        } else {
            _prefix = key.substring(0, 3);
            _key = key.substring(4, key.length);
        }
        if (toLower) {
            _prefix = _prefix.toLowerCase();
            _key = _key.toLowerCase();
        }
        return {
            'prefix': _prefix,
            'key': _key
        };
    }

    function isObject(contextualObject) {
        return ((contextualObject !== null) && (typeof contextualObject === 'object') && !(contextualObject instanceof Array));
    }

    function object2Flatten(source, parentPath, destination, parentPrefix, toLower) {
        let splittedObject = {};
        let prefix = '';
        let path = '';
        let levels = [];
        let newPath = '';
        let i = 0;
        for (const sourceKey in source) {
            if (Object.prototype.hasOwnProperty.call(source, sourceKey)) {
                splittedObject = splitProtocolAndKey(sourceKey, toLower);
                prefix = splittedObject.prefix || parentPrefix || '';
                path = (parentPath ? parentPath + '_' : '') + splittedObject.key;
                if (isObject(source[sourceKey])) {
                    object2Flatten(source[sourceKey], path, destination, prefix, toLower);
                } else {
                    levels = path.split('_');
                    newPath = '';
                    for (i = 0; i < levels.length; i++) {
                        splittedObject = splitProtocolAndKey(levels[i], toLower);
                        prefix = splittedObject.prefix || prefix;
                        newPath += splittedObject.key + ((i < levels.length - 1) ? '_' : '');
                    }
                    path = newPath || path;
                    destination[path] = destination[path] || {};
                    destination[path][ATVALUE] = source[sourceKey];
                    destination[path][ATPREFIX] = prefix;
                }
            }
        }
    }

    function addEvtListener(obj, event, callback) {
        if (obj['addEventListener']) {
            obj['addEventListener'](event, callback, false);
        } else if (obj['attachEvent']) {
            obj['attachEvent']('on' + event, callback);
        }
    }

    const Media = function (heartbeatValue, bufferHeartbeatValue, sessionId) {
        const _thisMedia = this;
        const _utility = new Utility();
        let _context = null;
        let _timers = null;
        let _properties = null;

        const _initContext = function () {
            _context = {
                previousCursorPosition: 0, // Position of the cursor of the previous event
                currentCursorPosition: 0, // Position of the cursor of the current event
                eventDuration: 0, // Event duration
                playbackSpeed: 1, // Playback speed
                previousEvent: '',
                isPlaybackActivated: false,
                isPlaying: false,
                sessionId: '',
                delayConfiguration: [], // Delay structure
                delayConfigurationBackup: [], // Delay structure backup
                delayBufferingConfiguration: [], // Delay buffering structure
                delayBufferingConfigurationBackup: [] // Delay buffering structure backup
            };
        };
        const _initSessionID = function () {
            _context.sessionId = sessionId || uuid.v4();
        };
        const _resetSession = function () {
            _context.previousCursorPosition = 0;
            _context.currentCursorPosition = 0;
            _context.eventDuration = 0;
            _context.previousEvent = '';
            _context.sessionId = uuid.v4();
        };
        const _restoreDelayConfiguration = function (buffering) {
            if (buffering) {
                _context.delayBufferingConfiguration = cloneObject(_context.delayBufferingConfigurationBackup);
            } else {
                _context.delayConfiguration = cloneObject(_context.delayConfigurationBackup);
            }
        };
        const _saveDelayConfiguration = function (buffering) {
            if (buffering) {
                _context.delayBufferingConfigurationBackup = cloneObject(_context.delayBufferingConfiguration);
            } else {
                _context.delayConfigurationBackup = cloneObject(_context.delayConfiguration);
            }
        };
        const _resetDelayConfiguration = function (buffering) {
            if (buffering) {
                _context.delayBufferingConfiguration = [];
                _context.delayBufferingConfigurationBackup = [];
            } else {
                _context.delayConfiguration = [];
                _context.delayConfigurationBackup = [];
            }
        };
        const _sortDelayConfiguration = function (buffering) {
            const delayConfig = buffering ? _context.delayBufferingConfiguration : _context.delayConfiguration;
            delayConfig.sort(function (a, b) {
                if (a.delay < b.delay) {
                    return -1;
                }
                if (a.delay > b.delay) {
                    return 1;
                }
                return 0;
            });
        };
        const _updateDelayConfiguration = function (buffering) {
            let nextDelay;
            const delayConfig = buffering ? _context.delayBufferingConfiguration : _context.delayConfiguration;
            if (typeof delayConfig[1] !== 'undefined') {
                nextDelay = delayConfig[1].delay;
            }
            if (typeof nextDelay === 'undefined') {
                delayConfig[0].number = 1;
            } else if (delayConfig[0].number > 0) {
                delayConfig[0].number--;
            } else if (typeof nextDelay === 'number') {
                delayConfig[0].number = Math.floor((nextDelay - delayConfig[0].delay) * 60 / delayConfig[0].refresh) - 1;
            }
        };
        const _initHeartbeat = function (buffering, heartbeat) {
            if (heartbeat) {

                _resetDelayConfiguration(buffering);

                let _heartbeatObject = {};
                if (isObject(heartbeat)) {
                    _heartbeatObject = heartbeat;
                } else if (!isNaN(heartbeat)) {
                    _heartbeatObject[0] = heartbeat;
                } else {
                    _heartbeatObject = JSON.parse(heartbeat);
                }
                for (const key in _heartbeatObject) {
                    if (Object.prototype.hasOwnProperty.call(_heartbeatObject, key)) {
                        if (buffering) {
                            _context.delayBufferingConfiguration.push({
                                delay: _utility.processHeartbeatValue(key, 0),
                                number: 0,
                                timeout: -1,
                                refresh: _utility.processHeartbeatValue(_heartbeatObject[key], _config.minBufferingHeartbeat)
                            });
                        } else {
                            _context.delayConfiguration.push({
                                delay: _utility.processHeartbeatValue(key, 0),
                                number: 0,
                                timeout: -1,
                                refresh: _utility.processHeartbeatValue(_heartbeatObject[key], _config.minHeartbeat)
                            });
                        }
                    }
                }
                _sortDelayConfiguration(buffering);
                _saveDelayConfiguration(buffering);
            }
        };
        const _initHeartbeats = function () {
            _initHeartbeat(false, heartbeatValue);
            _initHeartbeat(true, bufferHeartbeatValue);
        };
        const _initProperties = function () {
            _properties = {};
        };
        const _addOptionalProperties = function (object2Send) {
            object2Send.av_previous_position = {};
            object2Send.av_previous_position[ATVALUE] = _context.previousCursorPosition;
            object2Send.av_previous_position[ATPREFIX] = '';
            object2Send.av_position = {};
            object2Send.av_position[ATVALUE] = _context.currentCursorPosition;
            object2Send.av_position[ATPREFIX] = '';
            object2Send.av_duration = {};
            object2Send.av_duration[ATVALUE] = _context.eventDuration;
            object2Send.av_duration[ATPREFIX] = '';
            object2Send.av_previous_event = {};
            object2Send.av_previous_event[ATVALUE] = _context.previousEvent;
            object2Send.av_previous_event[ATPREFIX] = '';
        };
        const _getFinalObject = function (object2Send) {
            const content = {};
            let newKey;
            for (const key in object2Send) {
                if (Object.prototype.hasOwnProperty.call(object2Send, key)) {
                    if (!Object.prototype.hasOwnProperty.call(object2Send[key], ATVALUE)) {
                        content[key] = object2Send[key];
                    } else {
                        newKey = object2Send[key][ATPREFIX] ? `${object2Send[key][ATPREFIX]}:${key}` : key;
                        content[newKey] = object2Send[key][ATVALUE];
                    }
                }
            }
            return content;
        };
        const _sendEvent = function (action, withOptions, eventOptions, extraProps) {

            // Process media properties
            const object2Send = cloneObject(_properties);

            // Adding session ID
            object2Send.av_session_id = {};
            object2Send.av_session_id[ATVALUE] = _context.sessionId;
            object2Send.av_session_id[ATPREFIX] = '';

            // Adding optional properties
            if (withOptions) {
                _addOptionalProperties(object2Send);
                // Update this contextual value only for events with options
                _context.previousEvent = action;
            }

            // Adding extra properties
            if (isObject(extraProps)) {
                object2Flatten(extraProps, null, object2Send, null, true);
            }

            // Getting final object
            const finalObject = _getFinalObject(object2Send);

            // Sending hit
            pa.sendEvent(action, finalObject, eventOptions);

        };
        const Timers = function () {

            const _thisTimers = this;
            let _baseTime = 0; // Base time UTC
            let _totalEventDuration = 0; // Cumulative duration of events

            _thisTimers.getEventDuration = function () {
                const eventDuration = new Date().getTime() - _baseTime - _totalEventDuration;
                _totalEventDuration += eventDuration;
                return eventDuration;
            };
            _thisTimers.initBaseTime = function () {
                if (_baseTime === 0) {
                    _baseTime = new Date().getTime();
                }
            };
            _thisTimers.resetProperties = function () {
                _baseTime = 0;
                _totalEventDuration = 0;
            };
            _thisTimers.initHeartbeatTimer = function (callback, buffering) {
                const delayConfig = buffering ? _context.delayBufferingConfiguration : _context.delayConfiguration;
                if (delayConfig.length > 0) {
                    _updateDelayConfiguration(buffering);
                    clearTimeout(delayConfig[0].timeout);
                    delayConfig[0].timeout = setTimeout(function () {
                        if (delayConfig[0].number === 0) {
                            delayConfig.splice(0, 1);
                        }
                        callback && callback();
                    }, delayConfig[0].refresh * 1e3);
                }
            };
            _thisTimers.stopHeartbeatTimer = function (buffering) {
                const delayConfig = buffering ? _context.delayBufferingConfiguration : _context.delayConfiguration;
                for (let i = 0; i < delayConfig.length; i++) {
                    clearTimeout(delayConfig[i].timeout);
                    delayConfig[i].timeout = -1;
                }
            };
        };
        const _initTimers = function () {
            _timers = new Timers();
            if (BUILD_BROWSER) {
                addEvtListener(window, 'pagehide', function () {
                    _timers.stopHeartbeatTimer(false);
                    _timers.stopHeartbeatTimer(true);
                });
            }
        };

        _thisMedia.set = function (propKey, propValue) {
            const splittedObject = splitProtocolAndKey(propKey, true);
            _properties[splittedObject.key] = _properties[splittedObject.key] || {};
            _properties[splittedObject.key][ATVALUE] = propValue;
            _properties[splittedObject.key][ATPREFIX] = splittedObject.prefix;
        };
        _thisMedia.get = function (propKey) {
            let property = null;
            const splittedObject = splitProtocolAndKey(propKey, true);
            if (typeof _properties[splittedObject.key] !== 'undefined') {
                property = _properties[splittedObject.key][ATVALUE];
            }
            return property;
        };
        _thisMedia.del = function (propKey) {
            const splittedObject = splitProtocolAndKey(propKey, true);
            if (typeof _properties[splittedObject.key] !== 'undefined') {
                delete _properties[splittedObject.key];
            }
        };
        _thisMedia.setProps = function (properties) {
            if (isObject(properties)) {
                object2Flatten(properties, null, _properties, null, true);
            }
        };
        _thisMedia.getProps = function () {
            let properties = null;
            for (const key in _properties) {
                if (Object.prototype.hasOwnProperty.call(_properties, key)) {
                    properties = properties || {};
                    properties[key] = _properties[key][ATVALUE];
                }
            }
            return properties;
        };
        _thisMedia.delProps = function () {
            _properties = {};
        };

        const _heartbeat = function (autoPosition, autoTimer, cursorPosition, eventOptions, extraProps) {
            _timers.initBaseTime();
            _context.eventDuration = _timers.getEventDuration(); // duration since the last event (usually heartbeat)
            _context.previousCursorPosition = _context.currentCursorPosition; // event-1 Cursor Position  (usually HB)
            // event Cursor Position
            _context.currentCursorPosition = autoPosition ? (_context.previousCursorPosition + Math.floor(_context.playbackSpeed * _context.eventDuration)) : cursorPosition;
            autoTimer && _timers.initHeartbeatTimer(function () {
                _heartbeat(true, true);
            }, false);
            _sendEvent('av.heartbeat', true, eventOptions, extraProps);
        };
        const _bufferHeartbeat = function (autoTimer, eventOptions, extraProps) {

            _timers.initBaseTime();

            _context.eventDuration = _timers.getEventDuration(); // duration since the last event

            autoTimer && _timers.initHeartbeatTimer(function () {
                _bufferHeartbeat(true);
            }, true);

            _sendEvent('av.buffer.heartbeat', true, eventOptions, extraProps);

        };
        const _rebufferHeartbeat = function (autoTimer, eventOptions, extraProps) {

            _timers.initBaseTime();

            _context.eventDuration = _timers.getEventDuration(); // duration since Rebuffer start or since the last rebuffer heartbeat
            _context.previousCursorPosition = _context.currentCursorPosition; // event-1 Cursor Position (rebuffer start or rebuffer HB)

            autoTimer && _timers.initHeartbeatTimer(function () {
                _rebufferHeartbeat(true);
            }, true);

            _sendEvent('av.rebuffer.heartbeat', true, eventOptions, extraProps);

        };
        _thisMedia.setPlaybackSpeed = function (playbackSpeed) {

            const pbSpeed = _utility.value2Number(playbackSpeed) || _context.playbackSpeed;
            if (pbSpeed !== _context.playbackSpeed) {
                _timers.stopHeartbeatTimer(false);
                if (_context.isPlaying) {
                    _heartbeat(true, false);
                    _timers.initHeartbeatTimer(function () {
                        _heartbeat(true, true);
                    }, false);
                }
                _context.playbackSpeed = pbSpeed;
            }

        };
        _thisMedia.getSessionID = function () {
            return _context.sessionId;
        };

        _thisMedia.track = function (action, options, eventOptions, extraProps) {
            const opt = options || {};
            switch (action) {
            case 'av.heartbeat':
                _thisMedia.heartbeat(opt.av_position, eventOptions, extraProps);
                break;
            case 'av.buffer.heartbeat':
                _thisMedia.bufferHeartbeat(eventOptions, extraProps);
                break;
            case 'av.rebuffer.heartbeat':
                _thisMedia.rebufferHeartbeat(eventOptions, extraProps);
                break;
            case 'av.play':
                _thisMedia.play(opt.av_position, eventOptions, extraProps);
                break;
            case 'av.buffer.start':
                _thisMedia.bufferStart(opt.av_position, eventOptions, extraProps);
                break;
            case 'av.start':
                _thisMedia.playbackStart(opt.av_position, eventOptions, extraProps);
                break;
            case 'av.resume':
                _thisMedia.playbackResumed(opt.av_position, eventOptions, extraProps);
                break;
            case 'av.pause':
                _thisMedia.playbackPaused(opt.av_position, eventOptions, extraProps);
                break;
            case 'av.stop':
                _thisMedia.playbackStopped(opt.av_position, eventOptions, extraProps);
                break;
            case 'av.backward':
                _thisMedia.seekBackward(opt.av_previous_position, opt.av_position, eventOptions, extraProps);
                break;
            case 'av.forward':
                _thisMedia.seekForward(opt.av_previous_position, opt.av_position, eventOptions, extraProps);
                break;
            case 'av.seek.start':
                _thisMedia.seekStart(opt.av_previous_position, eventOptions, extraProps);
                break;
            case 'av.error':
                _thisMedia.error(opt.av_player_error, eventOptions, extraProps);
                break;
            default:
                _sendEvent(action, false, eventOptions, extraProps);
            }
        };
        _thisMedia.heartbeat = function (cursorPosition, eventOptions, extraProps) {

            let autoPosition = true;
            let position;
            if ((typeof cursorPosition !== 'undefined') && (cursorPosition !== null) && (cursorPosition >= 0)) {
                autoPosition = false;
                position = _utility.value2Number(cursorPosition);
            }

            _heartbeat(autoPosition, false, position, eventOptions, extraProps);

        };
        _thisMedia.bufferHeartbeat = function (eventOptions, extraProps) {

            _bufferHeartbeat(false, eventOptions, extraProps);

        };
        _thisMedia.rebufferHeartbeat = function (eventOptions, extraProps) {

            _rebufferHeartbeat(false, eventOptions, extraProps);

        };
        _thisMedia.play = function (cursorPosition, eventOptions, extraProps) {

            _timers.initBaseTime();

            const processedPosition = _utility.value2Number(cursorPosition);

            _context.eventDuration = 0; // always 0
            _context.previousCursorPosition = processedPosition; // event Cursor Position
            _context.currentCursorPosition = processedPosition; // event Cursor Position
            _context.isPlaying = false;
            _context.isPlaybackActivated = false;

            _timers.stopHeartbeatTimer(false);
            _timers.stopHeartbeatTimer(true);

            _sendEvent('av.play', true, eventOptions, extraProps);

        };
        _thisMedia.bufferStart = function (cursorPosition, eventOptions, extraProps) {

            _timers.initBaseTime();

            const processedPosition = _utility.value2Number(cursorPosition);

            _context.eventDuration = _timers.getEventDuration(); // duration since play
            _context.previousCursorPosition = _context.currentCursorPosition; // event -1 Cursor Position (usually HB)
            _context.currentCursorPosition = processedPosition; // event Cursor Position

            _timers.stopHeartbeatTimer(false);
            _timers.stopHeartbeatTimer(true);

            if (_context.isPlaybackActivated) {
                _timers.initHeartbeatTimer(function () {
                    _rebufferHeartbeat(true);
                }, true);
                _sendEvent('av.rebuffer.start', true, eventOptions, extraProps);
            } else {
                _timers.initHeartbeatTimer(function () {
                    _bufferHeartbeat(true);
                }, true);
                _sendEvent('av.buffer.start', true, eventOptions, extraProps);
            }

        };
        _thisMedia.playbackStart = function (cursorPosition, eventOptions, extraProps) {

            _timers.initBaseTime();

            const processedPosition = _utility.value2Number(cursorPosition);

            _context.eventDuration = _timers.getEventDuration(); // duration since play
            _context.previousCursorPosition = processedPosition; // event Cursor Position
            _context.currentCursorPosition = processedPosition; // event Cursor Position
            _context.isPlaying = true;
            _context.isPlaybackActivated = true;

            _timers.stopHeartbeatTimer(false);
            _timers.stopHeartbeatTimer(true);

            _timers.initHeartbeatTimer(function () {
                _heartbeat(true, true);
            }, false);

            _sendEvent('av.start', true, eventOptions, extraProps);

        };
        _thisMedia.playbackResumed = function (cursorPosition, eventOptions, extraProps) {

            _timers.initBaseTime();

            const processedPosition = _utility.value2Number(cursorPosition);

            _context.eventDuration = _timers.getEventDuration(); // duration since play
            _context.previousCursorPosition = _context.currentCursorPosition; // event-1 Cursor Position  (usually HB)
            _context.currentCursorPosition = processedPosition; // event Cursor Position
            _context.isPlaying = true;
            _context.isPlaybackActivated = true;

            _timers.stopHeartbeatTimer(false);
            _timers.stopHeartbeatTimer(true);
            _timers.initHeartbeatTimer(function () {
                _heartbeat(true, true);
            }, false);

            _sendEvent('av.resume', true, eventOptions, extraProps);


        };
        _thisMedia.playbackPaused = function (cursorPosition, eventOptions, extraProps) {

            _timers.initBaseTime();

            const processedPosition = _utility.value2Number(cursorPosition);

            _context.eventDuration = _timers.getEventDuration(); // duration since the last event (usually heartbeat)
            _context.previousCursorPosition = _context.currentCursorPosition; // event-1 Cursor Position  (usually HB)
            _context.currentCursorPosition = processedPosition; // event Cursor Position
            _context.isPlaying = false;
            _context.isPlaybackActivated = true;

            _timers.stopHeartbeatTimer(false);
            _timers.stopHeartbeatTimer(true);

            _sendEvent('av.pause', true, eventOptions, extraProps);


        };
        _thisMedia.playbackStopped = function (cursorPosition, eventOptions, extraProps) {

            _timers.initBaseTime();

            const processedPosition = _utility.value2Number(cursorPosition);

            _context.eventDuration = _timers.getEventDuration(); // duration since the last event (usually heartbeat)
            _context.previousCursorPosition = _context.currentCursorPosition; // event-1 Cursor Position  (usually HB)
            _context.currentCursorPosition = processedPosition; // event Cursor Position
            _context.isPlaying = false;
            _context.isPlaybackActivated = false;

            _timers.stopHeartbeatTimer(false);
            _timers.stopHeartbeatTimer(true);
            _timers.resetProperties();

            _restoreDelayConfiguration(false);
            _restoreDelayConfiguration(true);

            _sendEvent('av.stop', true, eventOptions, extraProps);

            _resetSession();

        };
        _thisMedia.playbackKill = function () {
            _timers.initBaseTime();
            _context.isPlaying = false;
            _context.isPlaybackActivated = false;
            _timers.stopHeartbeatTimer(false);
            _timers.stopHeartbeatTimer(true);
            _timers.resetProperties();
            _restoreDelayConfiguration(false);
            _restoreDelayConfiguration(true);
            _resetSession();
        };
        _thisMedia.seek = function (oldCursorPosition, newCursorPosition, eventOptions, extraProps) {

            const processedOldPosition = _utility.value2Number(oldCursorPosition);
            const processedNewPosition = _utility.value2Number(newCursorPosition);

            if (processedOldPosition > processedNewPosition) {
                _thisMedia.seekBackward(processedOldPosition, processedNewPosition, eventOptions, extraProps);
            } else {
                _thisMedia.seekForward(processedOldPosition, processedNewPosition, eventOptions, extraProps);
            }

        };
        _thisMedia.seekBackward = function (oldCursorPosition, newCursorPosition, eventOptions, extraProps) {

            _thisMedia.seekStart(oldCursorPosition, null, extraProps);

            _context.eventDuration = 0;
            _context.previousCursorPosition = _utility.value2Number(oldCursorPosition); // Cursor position at the beginning of the seek
            _context.currentCursorPosition = _utility.value2Number(newCursorPosition); // Cursor position at the end of the seek

            _sendEvent('av.backward', true, eventOptions, extraProps);

        };
        _thisMedia.seekForward = function (oldCursorPosition, newCursorPosition, eventOptions, extraProps) {

            _thisMedia.seekStart(oldCursorPosition, null, extraProps);

            _context.eventDuration = 0;
            _context.previousCursorPosition = _utility.value2Number(oldCursorPosition); // Cursor position at the beginning of the seek
            _context.currentCursorPosition = _utility.value2Number(newCursorPosition); // Cursor position at the end of the seek

            _sendEvent('av.forward', true, eventOptions, extraProps);

        };
        _thisMedia.seekStart = function (oldCursorPosition, eventOptions, extraProps) {

            const processedOldPosition = _utility.value2Number(oldCursorPosition);

            _context.previousCursorPosition = _context.currentCursorPosition;
            _context.currentCursorPosition = processedOldPosition;
            if (_context.isPlaying) {
                _context.eventDuration = _timers.getEventDuration(); // duration since the last event (usually heartbeat)
            } else {
                _context.eventDuration = 0;
            }

            _sendEvent('av.seek.start', true, eventOptions, extraProps);

        };
        _thisMedia.adClick = function (eventOptions, extraProps) {

            _sendEvent('av.ad.click', false, eventOptions, extraProps);

        };
        _thisMedia.adSkip = function (eventOptions, extraProps) {

            _sendEvent('av.ad.skip', false, eventOptions, extraProps);

        };
        _thisMedia.error = function (message, eventOptions, extraProps) {

            let newProps = {};
            if (isObject(extraProps)) {
                newProps = extraProps;
            }
            newProps.av_player_error = String(message);
            _sendEvent('av.error', false, eventOptions, newProps);

        };
        _thisMedia.display = function (eventOptions, extraProps) {

            _sendEvent('av.display', false, eventOptions, extraProps);

        };
        _thisMedia.close = function (eventOptions, extraProps) {

            _sendEvent('av.close', false, eventOptions, extraProps);

        };
        _thisMedia.volume = function (eventOptions, extraProps) {

            _sendEvent('av.volume', false, eventOptions, extraProps);

        };
        _thisMedia.subtitleOn = function (eventOptions, extraProps) {

            _sendEvent('av.subtitle.on', false, eventOptions, extraProps);

        };
        _thisMedia.subtitleOff = function (eventOptions, extraProps) {

            _sendEvent('av.subtitle.off', false, eventOptions, extraProps);

        };
        _thisMedia.fullscreenOn = function (eventOptions, extraProps) {

            _sendEvent('av.fullscreen.on', false, eventOptions, extraProps);

        };
        _thisMedia.fullscreenOff = function (eventOptions, extraProps) {

            _sendEvent('av.fullscreen.off', false, eventOptions, extraProps);
        };
        _thisMedia.quality = function (eventOptions, extraProps) {

            _sendEvent('av.quality', false, eventOptions, extraProps);

        };
        _thisMedia.speed = function (eventOptions, extraProps) {

            _sendEvent('av.speed', false, eventOptions, extraProps);

        };
        _thisMedia.share = function (eventOptions, extraProps) {

            _sendEvent('av.share', false, eventOptions, extraProps);

        };

        _initContext();
        _initHeartbeats();
        _initSessionID();
        _initTimers();
        _initProperties();
    };

    pa.avInsights = {};
    pa.avInsights.Media = Media;
};

export {
    AVInsights
};
