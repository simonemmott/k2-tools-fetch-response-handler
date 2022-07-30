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
      if (response.ok) {
        if (handler.onOkResponse) {
          handler.onOkResponse(response.clone());
        }
        if (response.headers.get('content-type')?.includes('application/json')) {
          if (handler.onOkResponseJson) {
            response.clone().json().then(handler.onOkResponseJson);
          }
        }
      } else if (response.status >= 400 && response.status < 500) {
        if (handler.onClientErrorResponse) {
          handler.onClientErrorResponse(response.clone());
        }
        if (defaultHandlers.onClientError) {
          if (!handler.onClientErrorResponse || defaultHandlers.onClientError.always) {
            defaultHandlers.onClientError.handle(response.clone());
          }
        }
        if (handler.onErrorResponse) {
          handler.onErrorResponse(response.clone());
        }
        if (defaultHandlers.onError) {
          if (!handler.onErrorResponse || defaultHandlers.onError.always) {
            defaultHandlers.onError.handle(response.clone());
          }
        }
        if (response.headers.get('content-type')?.includes('application/json')) {
          if (handler.onClientErrorResponseJson) {
            response.clone().json().then(handler.onClientErrorResponseJson);
          }
          if (defaultHandlers.onClientErrorJson) {
            if (!handler.onClientErrorResponseJson || defaultHandlers.onClientErrorJson.always) {
              response.clone().json().then(defaultHandlers.onClientErrorJson.handle);
            }
          }
          if (handler.onErrorResponseJson) {
            response.clone().json().then(handler.onErrorResponseJson);
          }
          if (defaultHandlers.onErrorJson) {
            if (!handler.onErrorResponseJson || defaultHandlers.onErrorJson.always) {
              response.clone().json().then(defaultHandlers.onErrorJson.handle);
            }
          }
        }
      } else if (response.status >= 500) {
        if (handler.onServerErrorResponse) {
          handler.onServerErrorResponse(response.clone());
        }
        if (defaultHandlers.onServerError) {
          if (!handler.onServerErrorResponse || defaultHandlers.onServerError.always) {
            defaultHandlers.onServerError.handle(response.clone());
          }
        }
        if (handler.onErrorResponse) {
          handler.onErrorResponse(response);
        }
        if (defaultHandlers.onError) {
          if (!handler.onErrorResponse || defaultHandlers.onError.always) {
            defaultHandlers.onError.handle(response.clone());
          }
        }
        if (response.headers.get('content-type')?.includes('application/json')) {
          if (handler.onServerErrorResponseJson) {
            response.json().then(handler.onServerErrorResponseJson);
          }
          if (defaultHandlers.onServerErrorJson) {
            if (!handler.onServerErrorResponseJson || defaultHandlers.onServerErrorJson.always) {
              response.clone().json().then(defaultHandlers.onServerErrorJson.handle);
            }
          }
          if (handler.onErrorResponseJson) {
            response.json().then(handler.onErrorResponseJson);
          }
          if (defaultHandlers.onErrorJson) {
            if (!handler.onErrorResponseJson || defaultHandlers.onErrorJson.always) {
              response.clone().json().then(defaultHandlers.onErrorJson.handle);
            }
          }
        }
      }
      if (handler.onStatusResponses) {
        handler.onStatusResponses.forEach((statusHandler) => {
          if (statusHandler.status === response.status) {
            statusHandler.handler(response);
          }
        });
      }
      if (handler.onStatusResponsesJson) {
        if (response.headers.get('content-type')?.includes('application/json')) {
          handler.onStatusResponsesJson.forEach((statusHandlerJson) => {
            if (statusHandlerJson.status === response.status) {
              response.json().then(statusHandlerJson.handler);
            }
          });
        }
      }
    },
    handleError: (error) => {
      if (handler.onNetworkErrorHandler) {
        handler.onNetworkErrorHandler(error);
      }
      if (defaultHandlers.onNetworkErrorHandler) {
        if (!handler.onNetworkErrorHandler || defaultHandlers.onNetworkErrorHandler.always) {
          defaultHandlers.onNetworkErrorHandler.handle(error);
        }
      }
    },
    handleFinally: () => {
      if (handler.finalExecutor) {
        handler.finalExecutor();
      }
      if (defaultHandlers.doFinally) {
        if (!handler.finalExecutor || defaultHandlers.doFinally.always) {
          defaultHandlers.doFinally.handle();
        }
      }
    },
    fetch: (controller) => {
      let activeController = controller;
      if (controller === undefined) {
        activeController = new AbortController();
      } else {
        activeController = controller;
      }
      opts.signal = activeController.signal;
      fetch(url, opts).then(response => {
        handler.handleResponse(response);
      }).catch(error => {
        handler.handleError(error);
      }).finally(() => {
        handler.handleFinally();
      });
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
    onNetworkError: (on) => {
      handler.onNetworkErrorHandler = on;
      return handler;
    },
    doFinally: (executor) => {
      handler.finalExecutor = executor;
      return handler;
    },
    //Promise methods
    then: (onFulfilled, onRejected) => {
      return fetch(url, opts).then(onFulfilled, onRejected);
    },
    catch: (onRejected) => {
      return fetch(url, opts).catch(onRejected);

    },
    finally: (executor) => {
      return fetch(url, opts).finally(executor);
    },
  };
  return handler;
};

const defaultHandlers = {};

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

const onNetworkError = (on, always = false) => {
  defaultHandlers.onNetworkErrorHandler = {handle: on, always: always};
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
	onNetworkError: onNetworkError};