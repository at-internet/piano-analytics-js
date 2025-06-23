# Changelog
## 6.16.3
### New
- Add the ability to stop sending heartbeats after a specified duration

## 6.16.2
### Fixes
- [browser] event_url_full not updating in some SPA cases

## 6.16.1
### Fixes
- [browser] requests with a payload larger than 64KiB might be cancelled in 6.16.0

## 6.16.0
### New
- [browser] New Instant Tracking feature

## 6.15.4
### Changes
- `device_timestamp_utc` is no longer sent in milliseconds but in seconds (becoming a decimal number)
- [browser] `cookie_creation_date` is now sent with hours and minutes details
- Updated the readme file
- migrated rollup from v2 to v4
- [browser] New esm file available : `dist/browser/piano-analytics.esm.js`

## 6.15.2
### Fixes
- Fix the configuration `sendEventWhenOptout` (broken in versions 6.15.0 and 6.15.1)

## 6.15.1
### Fixes
- [browser] Fix a specific case when consent is disabled

## 6.15.0
### New
- [browser] New AV Insights method (`media.playbackKill`) to technically stop a playback session
- [browser] `browserId` can now be set from `pdl`
- [browser] Cookie testing (`_cookie_test`) skipped when cookie domain configured

### Fixes
- [browser] Fixed empty campaign parameters sent with `undefined` value
- [browser] Fixed an issue with empty cookie domain when none configured
- [browser] Manage case where `PA` is not part of `consent.products`

### Changes
- [dev] Configuration file does not contain the version by default. Version is now added during build

## 6.14.2
### Fixes
- [react-native] Fixed android user-agent value to prevent default processing exclusion

## 6.14.1
### Fixes
- [browser] Fixed a bug when several `setProperty(ies)` and `sendEvent(s)` methods were chained without delays

## 6.14.0
### New
- [browser] New consent methods using `purposes`

### Changes
- All events properties can now be overridden (using setProperty(ies) or specifying the property directly in events sent)

### Fixes
- Fixed a conflict with global variables used in multiple taggings

## 6.13.1
### Fixes
- [browser] Cookie testing is now secure on suitable URLs

## 6.13.0
### New
- [browser] New configuration `enableExtendedOptout` to enable enhanced tracking of optout visitors (`false` by default)

## 6.12.2
### Fixes
- - [browser] Cookie `_pcus` being created by mistake

## 6.12.1
### Fixes
- [browser] Fix cookies expiration date being expanded when using consent without specifying storageMode

### Changes
- [browser] `cookie_creation_date` is now anonymized (time set to 0)

## 6.12.0

### New
- [browser] Automatic page context refresh added
- [browser] New configuration to manage automatic page context refresh (`enableAutomaticPageRefresh`)
  
## 6.11.1
### Fixes

- [browser] No more error log when `cookie_creation_date` not available

## 6.11.0
### New

- [browser] New property `cookie_creation_date` (date of the visitor cookie creation)
- [browser] New configuration `globalVarName` to change default global instance variable name (`pa` by default) 

### Fixes
- [browser] Improved potential conflict for queuing variable (`_paq` by default)

## 6.10.0
### Changes
- Event URL is now sent in property `event_url_full` instead of `page_url`
### Fixes
- Privacy rules were not applied properly to content properties in version 6.9.0

## 6.9.1
### Changes
- Event URL is now sent in property `event_url_full` instead of `page_url`
### Fixes
- Privacy rules were not applied properly to content properties in version 6.9.0


## 6.9.0
### New

- Automatically add `https://` to `collectDomain` configuration without protocol
- New configuration `allowHighEntropyClientHints` to allow retrieving high entropy Client Hints (`true` by default)
- New configuration `sendEmptyProperties` to allow sending properties with empty value

### Changes

- Now decode campaign values retrieved from querystring
- Now decode UTM values retrieved from querystring
- Change priority of content properties set from tagging over the ones automatically retrieved from page's meta tags
- Consent: Allow `page_url` in essential mode

### Fixes

- Fix ES5 build

## 6.8.3
### New
- Updated the build with a new generated ES5-compatible file (`/dist/browser/piano-analytics.es5.js`)

## 6.8.2
### Fixes
- Fixed an issue preventing various cookies from being deposited when not using Consent

## 6.8.1
### Fixes
- Consent management was crashing in rare case where no `window.pdl` was set beforehand

## 6.8.0
### New
- New consent management feature

## 6.7.1
### Fixes
- Changed request's headers sent in hits for browserless 
- Added a fallback to send hit requests (using fetch api) when sendBeacon is blocked due to its limitations

## 6.7.0
### Fixes
- Handle `queueVarName` conflict (no more crash, console log)
- Correctly retrieve encoded cookies, even if the configuration is not enabled

### Changes
- Allow boolean value for `addEventUrl` configuration
- Remove anchor in `page_url` retrieved
- Automatically generated visitor IDs are now 16 characters long (no more GUID)
- Visitor ID must be 16 or 36 characters long
- Visitor id is now stored in `_pcid` cookie
- Empty values for configurations are now ignored

### New
- New cookie `_pctx` created to store contextual data
- Automatically retrieve HTML page title into property `page_title_html`
- New contextual properties added (`has_access`, `pageview_id`)
- Properties `page_title_html` and `pageview_id` are allowed in exempt mode
- New methods for Piano cross-product integrations (`setContentProperties`, `setContentProperty`, `refresh`)

## 6.6.0
### Added or Changed
- Added SmartTag cookie `atuserid` management for Privacy `exempt` mode

## 6.5.0
### Added or Changed
- Added React Native compatibility

## 6.4.1
### Added or Changed
- Fix version number

## 6.4.0

### Added or Changed
- New configuration key `queueVarName` to set the global variable name used in asynchronous tagging

## 6.3.0

### Added or Changed
- property previous_url is now allowed in exempt mode
- requests without events are not sent anymore
- setProperty and setProperties now allow wildcard for event name (e.g: 'page.*')
- fix cases where multiple sendEvent called simultaneously don't send all events

## 6.2.0

### Added or Changed
- fix privacy mode name ("no-consent", "no-storage")
- upgraded dev-dependencies

## 6.1.2

### Added or Changed
- updated README

## 6.1.1

### Added or Changed
- releasing to npm
- releasing a browserless version for NodeJS environments
- renamed words "whitelist" and "blacklist" to "allowed" and "forbidden" respectively
- updated README 

## 6.0.0

### Added or Changed
- releasing to github
