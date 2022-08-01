# Default Response Handlers

Often in production code we want to always handle network errors in a consistent manner, for example by redirecting to an error page and/or logging the error.
We often want to do the same or similar in response to server `HTTP Status = 5**` errors.

The Fetch Response Handler provides methods to set default handling for various types of Response including network errors.

It also provides methods to define actions that should happen after all requests, whether successful or not.

By default the default handlers are overridden by supplying handlers with each usage of `fetchResponseHandler(...)`. However, default handlers can optionally be defined to always execute. Such handlers will execute even if the usage of `fetchResponseHandler(...)` provides its own handler for the type of response.
In this case the default handler fires after the handler supplied with the usage of `fetchResponseHandler(...)`

## Import

```javascript
import {onServerError} from "fetch-response-handler";
```

Each default handler function is imported separately from Fetch Response Handler.

## Usage

The default handler function accepts a callback to handle the event and optionally a boolean to identify whether the handler should always handle the response.

```javascript
// Add a handler for all 5** http status responses which always logs the response to the console
onServerError(console.log, true);
```

import and call this method once at the top of your application and all subsequent requests through the Fetch Response Handler will invoke the defined handler

## Default Response Handlers

| Handler Function | Properties | Description |
| --- | --- | --- \
| `doFinally` | `(Function (), always = false)` | Invoked after all responses |
| `onError` | `(Function (Response), always = false)` | Invoked after all `HTTP status 4**` or `HTTP status 5**` responses |
| `onServerError` | `(Function (Response), always = false)` | Invoked after all `HTTP status 5**` responses |
| `onClientError` | `(Function (Response), always = false)` | Invoked after all `HTTP status 4**` responses |
| `onErrorJson` | `(Function (JSON payload), always = false)` | Invoked after all `HTTP status 4**` or `HTTP status 5**` responses with `Content-Type = application/json` |
| `onServerErrorJson` | `(Function (JSON payload), always = false)` | Invoked after all `HTTP status 5**` responses with `Content-Type = application/json` |
| `onClientErrorJson` | `(Function (JSON payload), always = false)` | Invoked after all `HTTP status 4**` responses with `Content-Type = application/json` |
| `onRuntimeError` | `(Function (Error), always = false)` | Invoked after all runtime errors |

Default handlers can be set for all, any, or none of the response types, and all default handers can be defined to always execute.

If multiple calls to the same default handler function are made then only the last defined handler will execute.
