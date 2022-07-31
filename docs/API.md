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

| Method | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `fetch` | `Function(AbortController)` | `AbortController` |  |
| `onClientError` | `Function(Response)` | `handler` |  |
| `onServerError` | `Function(Response)` | `handler` |  |
| `onError` | `Function(Response)` | `handler` |  |
| `onSuccessJson` | `Function(JSON object)` | `handler` |  |
| `onClientErrorJson` | `Function(JSON object)` | `handler` |  |
| `onServerErrorJson` | `Function(JSON object)` | `handler` |  |
| `onErrorJson` | `Function(JSON object)` | `handler` |  |
| `onStatus` | `HTTP status code, Function(Response)` | `handler` |  |
| `onStatusJson` | `HTTP status code, Function(JSON object)` | `handler` |  |
| `onNetworkError` | `Function(Error)` | `handler` |  |
| `doFinally` | `Function()` | `handler` |  |
| --- | --- | --- | --- |
| `then` | `Function(Response), Function(Error)` | `Response Promise` |  |
| `catch` | `Function(Error)` | `Response Promise` |  |
| `finally` | `Function()` | ``Response Promise`` |  |
|



