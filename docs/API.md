# Fetch Response Handler API

## Import

```javascript
import {fetchResponseHandler} from "fetch-response-handler";
```

## Usage

```javascript
const controller = fetchResponseHander("http://widgets.com/api/widgets")
  .onSuccessJson(widgets => {... // Do something with the JSON array of Widgets returned from the host})
  .fetch();
  
controlled.abort(); // To cancel the in-flight request
```

## Return Type

The call to `fetchResponseHandler(...)` returns an anonymous `promise-like` object.

The `promise-like` object returned by the Fetch Response Handler has the following methods

### Handler Methods

| Method | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `fetch` | `Function(AbortController)` | `AbortController` | Perform the `fetch(...)` and return the `AbortController` to cancel the fetch |
| `onClientError` | `Function(Response)` | `handler` | Define a handler for the Response object to respond to all responses with `HTTP status = 4**` and return the `promise-like` object for further configuration before fetch |
| `onServerError` | `Function(Response)` | `handler` | Define a handler for the Response object to respond to all responses with `HTTP status = 5**` and return the `promise-like` object for further configuration before fetch |
| `onError` | `Function(Response)` | `handler` | Define a handler for the Response object to respond to all responses with `HTTP status = 4** or 5**`  and return the `promise-like` object for further configuration before fetch |
| `onSuccess` | `Function(Response)` | `handler` | Define a handler for the Response object to respond to all responses with `HTTP status = 2**` and return the `promise-like` object for further configuration before fetch |
| `onSuccessJson` | `Function(JSON object)` | `handler` | Define a handler for the JSON payload to respond to all responses with `HTTP status = 2**` and a `Content-Type = "application/json` and return the `promise-like` object for further configuration before fetch |
| `onClientErrorJson` | `Function(JSON object)` | `handler` | Define a handler for the JSON payload to respond to all responses with `HTTP status = 4**` and a `Content-Type = "application/json` and return the `promise-like` object for further configuration before fetch |
| `onServerErrorJson` | `Function(JSON object)` | `handler` | Define a handler to for the JSON payload respond to all responses with `HTTP status = 5**` and a `Content-Type = "application/json` and return the `promise-like` object for further configuration before fetch |
| `onErrorJson` | `Function(JSON object)` | `handler` | Define a handler for the JSON payload to respond to all responses with `HTTP status = 4** or 5**` and a `Content-Type = "application/json` and return the `promise-like` object for further configuration before fetch |
| `onStatus` | `HTTP status code, Function(Response)` | `handler` | Add a handler to respond to responses with the given HTTP status code and and return the `promise-like` object for further configuration before fetch. Multiple handlers can be added for the same status code and they will execute in the order in which they were defined. |
| `onStatusJson` | `HTTP status code, Function(JSON object)` | `handler` | Add a handler to respond to responses with the given HTTP status code and a `Content-Type = "application/json` and return the `promise-like` object for further configuration before fetch. Multiple handlers can be added for the same status code and they will execute in the order in which they were defined. |
| `onRuntimeError` | `Function(Error)` | `handler` | Define a handler for the Error object thrown by network errors and return the `promise-like` object for further configuration before fetch |
| `onAbortr` | `Function(Error)` | `handler` | Define a handler for the Error object thrown when the request is aborted and return the `promise-like` object for further configuration before fetch |
| `doFinally` | `Function()` | `handler` | Add an executor to be invoked after the response is returned |

### Promise Like Methods

The `Promise-like` object returned by Fetch Response Handler includes `then(...)`, `catch(..)`, and `finally(...)` like a Promise. (a Thenable)

| Method | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `then` | `Function(Response), Function(Error)` | `Response Promise` | And handlers for the resolve and reject events of the Response object returned by the call to `fetch(...)` and return the Response Promise |
| `catch` | `Function(Error)` | `Response Promise` | Add a handler for the network error thrown by the call to `fetch(..)` and return the Response Promise |
| `finally` | `Function()` | ``Response Promise`` | Add an executor to be executed after the Response promise resolves and has been handled and return the Response Promise |

Using the `promise-like` methods causes `fetchResponseHandler(...)` to behave exactly like `fetch(...)` and ignores any handlers added via the Handlers methods and any default handlers defined.
The promise like methods allow developers to deal with edge cases where the response handling supplied by the Fetch Response Handler do not support the business requirements.

Using the `promise-like` methods returns absolute control to the developer at the cost of the developer having to handle anything that the request may produce and having to manage cancel fetches without support.


