# Changelog

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
