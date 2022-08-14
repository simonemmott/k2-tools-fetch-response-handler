[![Total alerts](https://img.shields.io/lgtm/alerts/g/simonemmott/k2-tools-fetch-response-handler.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/simonemmott/k2-tools-fetch-response-handler/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/simonemmott/k2-tools-fetch-response-handler.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/simonemmott/k2-tools-fetch-response-handler/context:javascript)

# Fetch Response Handler

Fetch Response Handler is  wrapper for the javascript Fetch API which provides expressive and idiomatic handling of network errors, client errors `HTTP status = 4**`, server errors `HTTP status = 5**` and successful responses as either the native `Response` or as a `JSON` object for responses with `Content-Type = application/json`.
It also provides support for default error handling and cancelling requests using `AbortControllers`.

It exists to improve the expressiveness and idiomacity of production web applications using the Fetch API. 

## Getting Started

### Install

```
npm install fetch-response-handler
```

### Import

```javascript
// Import the fetchResponseHandler function from the fetch-response-handler package in a module
import {fetchResponseHandler} from "fetch-response-handler";

// OR in a script
var fetchResponseHandler = require("./src/fetch-response-handler.js").fetchResponseHandler;
```

### Usage

```javascript
// Fetch JSON payload from URL
fetchResponseHandler(<URL>)
  .onSuccessJson(json => {<Do something with the received JSON>})
  .fetch();
```

## [Background](./docs/REQUIREMENT.md)

## [Cancelling Requests](./docs/CANCEL_REQUESTS.md)

## [Simple React Example](./docs/REACT_EXAMPLE.md)

## [Maximise Code Reuse and Idiomacity](./docs/API_CLIENT.md)

## [Default Response Handlers](./docs/DEFAULTS.md)

## [Fetch Response Handler API](./docs/API.md)

## Contributing

If you'd like to contribute to this project feel free to fork the repository and use a feature branch. Pull requests are warmly welcome

## Licensing

The code in this project is under the MIT licence



  







