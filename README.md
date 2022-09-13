# Livechart Util

[Explanation on how to use the MAL API](documentation/howtoMalApi.md)

## Features

- [x] sync MAL --> livechart
  - [x] episode count
  - [ ] rating
  - [ ] status
- [ ] sync livechart --> MAL
  - [ ] episode count
  - [ ] rating
  - [ ] status
- [ ] sync anime with slightly different names
- [ ] popup with settings
- [x] automatically set darkmode in livechart

## Installation

To install this web extension the preference `xpinstall.signatures.required` should be set to `false` in `about:config`. This works in Firefox Developer Edition.

Package the extension with:

```bash
git clone https://github.com/andregoetz/livechart-util.git
cd livechart-util
zip -r extension.xpi icons js manifest.json
```

and install it in `about:addons` using the *Install Add-on From File...* option
