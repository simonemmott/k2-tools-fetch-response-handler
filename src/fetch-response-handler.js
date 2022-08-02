 const fetcher = {
	doFetch: (url, init) => {}
};

let withFetch = false;
try {
	fetcher.doFetch = fetch();
	withFetch = true;
} catch (e) {
	console.log("fetch() is not defined!");
}

const mockFetch = (fetchMock) => {
	fetcher.doFetch = fetchMock;
	withFetch = false;
};

const debug = {
	log: () => {},
	enable: (on = true) => {
	  if (on) {
	    debug.log = console.log;
	  } else {
	    debug.log = () => {};
	  }
	}
};

const fetchResponseHandler = (url, init = {}) => {
  // Returns an anonymous object
  // With methods then, catch, and finally like a Promise
  // the promise methods fetch the Response Promise if it has not already been fetched and
  // invoke the respective methods of the Response Promise and return the result
  // With an onSuccess method which receives a callback to handle fulfilled responses with
  // response.ok = true which is retained to handle the ok response when response is fetched and retains the handler
  // so that additional response handlers can be defined
  // With an onClientError method which receives a callback to handle fulfilled responses a 4xx http status code
  // which is retained to handle the client error responses when response is fetched and and retains the handler
  // so that additional response handlers can be defined
  // With an onServerError method which receives a callback to handle fulfilled responses a 5xx http status code
  // which is retained to handle the server error responses when response is fetched and and retains the handler
  // so that additional response handlers can be defined
  // With an onError method which receives a callback to handle fulfilled responses 4xx or 5xx http status code
  // which is retained to handle the server error responses when response is fetched and and retains the handler
  // so that additional response handlers can be defined
  // With an onJson method which receives a callback to handle JSON from fulfilled responses with response.ok = true
  // which is retained to handle the server error responses when response is fetched and and retains the handler
  // so that additional response handlers can be defined
  // With an onClientErrorJson method which receives a callback to handle JSON from fulfilled with status 4xx
  // which is retained to handle the server error responses when response is fetched and and retains the handler
  // so that additional response handlers can be defined
  // With an onServerErrorJson method which receives a callback to handle JSON from fulfilled with status 5xx
  // which is retained to handle the server error responses when response is fetched and and retains the handler
  // so that additional response handlers can be defined
  // With an onErrorJson method which receives a callback to handle JSON from fulfilled with status 4xx or 5xx
  // which is retained to handle the server error responses when response is fetched and and retains the handler
  // so that additional response handlers can be defined
  // With an onStatus method which receives a callback to handle fulfilled responses with given status
  // which is retained to handle the server error responses when response is fetched and and retains the handler
  // so that additional response handlers can be defined
  // With an onStatusJson method which receives a callback to handle JSON from fulfilled responses with given status
  // which is retained to handle the server error responses when response is fetched and and retains the handler
  // so that additional response handlers can be defined
  // With a fetch method which
  //   Optionally receives an AbortController
  //   If it does not receive an AbortController it creates a new one
  //   Updates the signal attribute of the fetch options to controller.signal
  //   Fetches the Response Promise
  //   Applies the defined handlers to the fetched Response Promise
  //   And returns the AbortController

  const handler = {
    handleResponse: (response) => {
	    let handled = false;
	    const isJsonResponse = response.headers.get("content-type")?.includes("application/json");
	    debug.log(JSON.stringify(response));
        if (response.ok) {
	      debug.log("Response OK");
          if (handler.onOkResponse) {
	        debug.log("Handle OK Response");
	        handled = true;
            handler.onOkResponse(response.clone());
          }
          if (isJsonResponse) {
            debug.log("Response OK JSON");
            if (handler.onOkResponseJson) {
              debug.log("Handle OK JSON Response");
              handled = true;
              response.clone().json().then(handler.onOkResponseJson);
            }
          }
        } else if (response.status >= 400 && response.status < 500) {
	      debug.log("Response CLIENT ERROR");
          if (handler.onClientErrorResponse) {
	        debug.log("Handle CLIENT ERROR Response");
	        handled = true;
            handler.onClientErrorResponse(response.clone());
          }
          if (defaultHandlers.onClientError) {
            if (!handler.onClientErrorResponse || defaultHandlers.onClientError.always) {
	          debug.log("Default Handle CLIENT ERROR");
	          handled = true;
              defaultHandlers.onClientError.handle(response.clone());
            }
          }
          if (handler.onErrorResponse) {
	        debug.log("Handle ERROR Response (client error)");
            handler.onErrorResponse(response.clone());
          }
          if (defaultHandlers.onError) {
            if (!handler.onErrorResponse || defaultHandlers.onError.always) {
	          debug.log("Default Handle ERROR Response (client error)");
	          handled = true;
              defaultHandlers.onError.handle(response.clone());
            }
          }
          if (isJsonResponse) {
	        debug.log("Response JSON CLIENT ERROR");
            if (handler.onClientErrorResponseJson) {
	          debug.log("Handle JSON CLIENT ERROR Response");
	          handled = true;
              response.clone().json().then(handler.onClientErrorResponseJson);
            }
            if (defaultHandlers.onClientErrorJson) {
              if (!handler.onClientErrorResponseJson || defaultHandlers.onClientErrorJson.always) {
	            debug.log("Default Handle JSON CLIENT ERROR Response");
	            handled = true;
                response.clone().json().then(defaultHandlers.onClientErrorJson.handle);
              }
            }
            if (handler.onErrorResponseJson) {
	          debug.log("Handle JSON ERROR Response (client error)");
	          handled = true;
              response.clone().json().then(handler.onErrorResponseJson);
            }
            if (defaultHandlers.onErrorJson) {
              if (!handler.onErrorResponseJson || defaultHandlers.onErrorJson.always) {
	            debug.log("Default Handle JSON ERROR Response (client error)");
	            handled = true;
                response.clone().json().then(defaultHandlers.onErrorJson.handle);
              }
            }
          }
        } else if (response.status >= 500) {
	      debug.log("Response SERVER ERROR");
          if (handler.onServerErrorResponse) {
	        debug.log("Handle SERVER ERROR Response");
	        handled = true;
            handler.onServerErrorResponse(response.clone());
          }
          if (defaultHandlers.onServerError) {
            if (!handler.onServerErrorResponse || defaultHandlers.onServerError.always) {
	          debug.log("Default Handle SERVER ERROR Response");
	          handled = true;
              defaultHandlers.onServerError.handle(response.clone());
            }
          }
          if (handler.onErrorResponse) {
	        debug.log("Handle ERROR Response (server error)");
	        handled = true;
            handler.onErrorResponse(response);
          }
          if (defaultHandlers.onError) {
            if (!handler.onErrorResponse || defaultHandlers.onError.always) {
	          debug.log("Default Handle ERROR Response (server error)");
	          handled = true;
              defaultHandlers.onError.handle(response.clone());
            }
          }
          if (isJsonResponse) {
	        debug.log("Response JSON SERVER ERROR");
            if (handler.onServerErrorResponseJson) {
	          handled = true;
              response.json().then(handler.onServerErrorResponseJson);
            }
            if (defaultHandlers.onServerErrorJson) {
              if (!handler.onServerErrorResponseJson || defaultHandlers.onServerErrorJson.always) {
	            debug.log("Handle JSON SERVER ERROR Response");
	            handled = true;
                response.clone().json().then(defaultHandlers.onServerErrorJson.handle);
              }
            }
            if (handler.onErrorResponseJson) {
	          debug.log("Handle JSON SERVER ERROR Response (server error)");
	          handled = true;
              response.json().then(handler.onErrorResponseJson);
            }
            if (defaultHandlers.onErrorJson) {
              if (!handler.onErrorResponseJson || defaultHandlers.onErrorJson.always) {
	            debug.log("Default Handle JSON SERVER ERROR Response (server error)");
	            handled = true;
                response.clone().json().then(defaultHandlers.onErrorJson.handle);
              }
            }
          }
        }
        if (handler.onStatusResponses) {
	      debug.log(`Response STATUS[${response.status}]`);
          handler.onStatusResponses.forEach((statusHandler) => {
            if (statusHandler.status === response.status) {
	          debug.log(`Handle STATUS[${statusHandler.status}] Response`);
	          handled = true;
              statusHandler.handler(response.clone());
            }
          });
        }
        if (handler.onStatusResponsesJson) {
          if (isJsonResponse) {
	        debug.log(`Response JSON STATUS[${response.status}]`);
	        debug.log("handler.onStatusResponsesJson: " + JSON.stringify(handler.onStatusResponsesJson));
            handler.onStatusResponsesJson.forEach((statusHandlerJson) => {
              if (statusHandlerJson.status === response.status) {
	            debug.log(`Handle JSON STATUS[${statusHandlerJson.status}] Response`);
	            handled = true;
                response.clone().json().then(statusHandlerJson.handler);
              }
            });
          }
        }
        if (!handled) {
	      if (isJsonResponse) {
		    response.json();
	      } else {
		    response.text();
		  }
        }
    },
    handleRuntimeError: (error) => {
	  debug.log("Runtime ERROR");
      if (handler.onRuntimeErrorHandler) {
	    debug.log("Handle Runtime ERROR");
        handler.onRuntimeErrorHandler(error);
      }
      debug.log("HERE");
      if (defaultHandlers.onRuntimeError) {
	    debug.log("WHERE");
        if (!handler.onRuntimeErrorHandler || defaultHandlers.onRuntimeError.always) {
	      debug.log("Default Handle Runtime ERROR");
          defaultHandlers.onRuntimeError.handle(error);
        }
      }
    },
    handleFinally: () => {
      if (handler.finalExecutor) {
	    debug.log("Run FINAL executor");
        handler.finalExecutor();
      }
      if (defaultHandlers.doFinally) {
        if (!handler.finalExecutor || defaultHandlers.doFinally.always) {
	      debug.log("Default Run FINAL executor");
          defaultHandlers.doFinally.handle();
        }
      }
    },
    fetch: (controller) => {
      let activeController;
      if (controller === undefined) {
        activeController = new AbortController();
      } else {
        activeController = controller;
      }
      init.signal = activeController.signal;
      debug.log("CAll fetch with " + url + " and " + JSON.stringify(init));
      if (withFetch) {
        fetch(url, init).then(response => {
	      debug.log("Response: " + JSON.stringify(response));
          handler.handleResponse(response);
        }).catch(error => {
	      debug.log("Error: " + JSON.stringify(error));
          handler.handleRuntimeError(error);
        }).finally(() => {
          handler.handleFinally();
        });
      } else {
        fetcher.doFetch(url, init).then(response => {
	      debug.log("Response: " + JSON.stringify(response));
          handler.handleResponse(response);
        }).catch(error => {
	      debug.log("Error: " + JSON.stringify(error));
          handler.handleRuntimeError(error);
        }).finally(() => {
          handler.handleFinally();
        });
	
      }
      return activeController;
    },
    onSuccess: (on) => {
      handler.onOkResponse = on;
      return handler;
    },
    onClientError: (on) => {
      handler.onClientErrorResponse = on;
      return handler;
    },
    onServerError: (on) => {
      handler.onServerErrorResponse = on;
      return handler;
    },
    onError: (on) => {
      handler.onErrorResponse = on;
      return handler;
    },
    onSuccessJson: (on) => {
      handler.onOkResponseJson = on;
      return handler;
    },
    onClientErrorJson: (on) => {
      handler.onClientErrorResponseJson = on;
      return handler;
    },
    onServerErrorJson: (on) => {
      handler.onServerErrorResponseJson = on;
      return handler;
    },
    onErrorJson: (on) => {
      handler.onErrorResponseJson = on;
      return handler;
    },
    onStatus: (status, on) => {
      if (handler.onStatusResponses === undefined) {
        handler.onStatusResponses = [];
      }
      handler.onStatusResponses.push({status: status, handler: on});
      return handler;
    },
    onStatusJson: (status, on) => {
      if (handler.onStatusResponsesJson === undefined) {
        handler.onStatusResponsesJson = [];
      }
      handler.onStatusResponsesJson.push({status: status, handler: on});
      return handler;
    },
    onRuntimeError: (on) => {
      handler.onRuntimeErrorHandler = on;
      return handler;
    },
    doFinally: (executor) => {
      handler.finalExecutor = executor;
      return handler;
    },
    //Promise-like methods
    then: (onFulfilled, onRejected) => {
	  if (withFetch) {
        return fetch(url, init).then(onFulfilled, onRejected);
      } else {
	    return fetcher.doFetch(url, init).then(onFulfilled, onRejected);
      }
    },
    catch: (onRejected) => {
	  if (withFetch) {
        return fetch(url, init).catch(onRejected);
      } else {
	    return fetcher.doFetch(url, init).catch(onRejected);
      }
    },
    finally: (executor) => {
	  if (withFetch) {
        return fetch(url, init).finally(executor);
      } else {
	    return fetcher.doFetch(url, init).finally(executor);
      }
    },
  };
  return handler;
};

const defaultHandlers = {};
const clearDefaultHandlers = () => {
	defaultHandlers.doFinally = undefined;
	defaultHandlers.onError = undefined;
	defaultHandlers.onServerError = undefined;
	defaultHandlers.onClientError = undefined;
	defaultHandlers.onErrorJson = undefined;
	defaultHandlers.onServerErrorJson = undefined;
	defaultHandlers.onClientErrorJson = undefined;
	defaultHandlers.onRuntimeError = undefined;
};

const doFinally = (executor, always = false) => {
  defaultHandlers.doFinally = {handle: executor, always: always};
};
const onError = (on, always = false) => {
  defaultHandlers.onError = {handle: on, always: always};
};

const onServerError = (on, always = false) => {
  defaultHandlers.onServerError = {handle: on, always: always};
};

const onClientError = (on, always = false) => {
  defaultHandlers.onClientError = {handle: on, always: always};
};

const onErrorJson = (on, always = false) => {
  defaultHandlers.onErrorJson = {handle: on, always: always};
};

const onServerErrorJson = (on, always = false) => {
  defaultHandlers.onServerErrorJson = {handle: on, always: always};
};

const onClientErrorJson = (on, always = false) => {
  defaultHandlers.onClientErrorJson = {handle: on, always: always};
};

const onRuntimeError = (on, always = false) => {
  defaultHandlers.onRuntimeError = {handle: on, always: always};
};

module.exports = {
	fetchResponseHandler: fetchResponseHandler,
	doFinally: doFinally,
	onError: onError,
	onServerError: onServerError,
	onClientError: onClientError,
	onErrorJson: onErrorJson,
	onServerErrorJson: onServerErrorJson,
	onClientErrorJson: onClientErrorJson,
	onRuntimeError: onRuntimeError,
	clearDefaultHandlers: clearDefaultHandlers,
	mockFetch: mockFetch,
	debug: debug};