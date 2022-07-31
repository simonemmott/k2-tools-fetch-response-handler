# Cancelling In-flight Requests

The `init` property of the Fetch API supports cancelling the fetch by supplying the `signal` attribute of an `AbortController` to its `signal` attribute. Cancelling requests is essential to avoid wasting resources in reactive web applications. However, the `AbortController` required by `fetch(...)` further reduces the expressiveness of the code and again junks the idea of idiomatic code.

The Fetch Response Handler supports cancelling fetches in an expressive and idiomatic way.

The call to `fetch()` of the promise-like object returned by the Fetch Response Handler returns the `AbortController` whose signal is attached to the issued `fetch(url, init)`.

The example below shows cancelling a `fetch(...)` through the Fetch Response Handler.

```javascript
const controller = fetchResponseHandler("http://widgets.com/api/widgets/123")
  .onSuccessJson(widget => {...})
  .fetch();
  
controller.abort(); // Cancel the fetch
```

## Cancelling Multiple Requests

The Fetch Response Handler supports cancelling multiple `fetch(...)` calls with the same controller

```javascript
const controller = fetchResponseHandler("http://widgets.com/api/widgets/123")
  .onSuccessJson(widget => {...})
  .fetch();
  
fetchResponseHandler("http://widgets.com/api/widgets/456")
  .onSuccessJson(widget => {...})
  .fetch(controller); // Execute this fetch using the same controller
  
controller.abort(); // Cancel both the fetches
```
