# Why The Fetch Response Handler Exists

## Requirement

Production code should be expressive and idiomatic to maximise code maintainability.
Expressive code uses variable and function names which `express` the usage of and/or functionality provided by the code. Expressive code helps developers to understand what a variable contains or what a function call does.
Idiomatic code is structured in such a way that the expressive variable and function names combined with the native language syntax such as `if (...) \* then *\ {...} else {...}` reads like a natural sentence. Idiomatic code helps developers to understand the logic expressed by a section of code.

The `fetch(...)` call returns a Response Promise which significantly eases making REST requests to back end APIs.
There are two ways to work with the `fetch(...)` API using the Response Promise directly using the `then(resolve, reject)`, `error(error)`, and `finally(executor)` methods, or using the `async/await` keywords which provide simple handling of the Response by waiting for the Promise to resolve or throwing the error.

The fetch API is much more expressive than using the old `xmlHttpRequest` API but is still involves an amount of boiler plate code and the resultant code is still less than idiomatic.
The other issue with the fetch API is that the `error(...)` method is only called on a network error which prevents the back end API from supplying the Response. 
However, back end APIs supply error details to the front end by successfully supplying a `Response` to the `fetch(...)`.

Idiomatically we would expect the `error(...)` method to handling error responses from the back end which it doesn't. We therefore have to inspect the resolved Response for the HTTP status code to identify whether the API call was actually successful or not. This required inspection of the resolved Response Promise reduces the expressiveness of the code and completely junks the idea of idiomatic code.

## Solution

The Fetch Response Handler is a javascript function which accepts the same properties as the `fetch(...)` method. i.e. `fetchResponseHanlder(url, init)`. However, instead of returning a Promise, it returns a promise-like object. i.e. an object with `then(resolved, reject)`, `error(error)`, and `finally(executor)` methods.
Calls to these methods of the Fetch Response Handlers promise-like object simply pass the supplied `url` and `init` properties to a `fetch(...)` call and return the result off calling the `then(...)`, `error(...)`, or `finally(...)` method respectively. The `fetchResponseHandler(...)` function behaves just like the `fetch(...)` method in this respect.

However, the promise-like object returned by `fetchResponseHandler(...)` offers many other methods to make calls to `fetch(...)` properly expressive and idiomatic.

The example below shows how to use `fetchResponseHandler(...)` to fetch a JSON object from a REST API and handle successful Responses, client error Responses, server error Responses, and network failures with distinct callbacks for each type of response.

```javascript
fetchResponseHandler("http://widgets.com/api/widgets/123")
  .onSuccessJson(widget => {...})      // handle a widget successfully supplied from the REST API
  .onClientErrorJson(errJson => {...}) // handle the JSON response of all 4** HTTP status responses
  .onServerErrorJson(errJson => {...}) // handle the JSON responses of all 5** HTTP status responses
  .onError(error => {...})             // handle a thrown network error
  .fetch();
```

The call to `fetchResponseHandler(...)` and all the methods of the resultant promise-like object are non-blocking and guaranteed to return.
