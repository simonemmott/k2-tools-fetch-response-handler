let fetchResponseHandler = require("./fetch-response-handler.js").fetchResponseHandler;
let mockFetch = require("./fetch-response-handler.js").mockFetch;
let debug = require("./fetch-response-handler.js").debug;
let doFinally = require("./fetch-response-handler.js").doFinally;
let onServerError = require("./fetch-response-handler.js").onServerError;
let onClientError = require("./fetch-response-handler.js").onClientError;
let onError = require("./fetch-response-handler.js").onError;
let onServerErrorJson = require("./fetch-response-handler.js").onServerErrorJson;
let onClientErrorJson = require("./fetch-response-handler.js").onClientErrorJson;
let onErrorJson = require("./fetch-response-handler.js").onErrorJson;
let onRuntimeError = require("./fetch-response-handler.js").onRuntimeError;
let clearDefaultHandlers = require("./fetch-response-handler.js").clearDefaultHandlers;

debug.enable(false);

const mockHeaders = (init = []) => {
	const headers = {
		init: init,
		get: (key) => {
			let result = null;
			headers.init.forEach(([k, v]) => {
				if (key.toLowerCase() === k.toLowerCase()) {
					if (result === null) {
						result = v;
					} else {
						result = result + "," + v;
					}
				}
			});
			return result;
		}
	}
	return headers;
};

const mockJsonResponse = (json, status = 200) => {
	const response = {
		ok: status >= 200 && status < 300,
		status: status,
		headers: mockHeaders([["Content-Type", "application/json"]]),
		clone: () => {return response},
		json: () => {return Promise.resolve(json)}
	}
	return response;
}

const mockResponse = (text, status = 200) => {
	const response = {
		ok: status >= 200 && status < 300,
		status: status,
		headers: mockHeaders([["Content-Type", "application/text-plain"]]),
		clone: () => {return response},
		text: () => {return Promise.resolve(text)}
	}
	return response;
}

beforeEach(() => {
	clearDefaultHandlers();
})

describe("Fetch Response Handler", () => {
	
	it("Calls fetch(...) with the given url and init options with the signal from the given AbortController and return the given AbortController", async () => {
		const response = mockResponse("TEXT");
		const abortController = new AbortController();
		const fetchFn = jest.fn(() => {return Promise.resolve(response)});
		mockFetch(fetchFn);
		const controller = fetchResponseHandler("URL", {init: "INIT"})
		  .fetch(abortController);	
		expect(fetchFn).toHaveBeenCalledWith("URL", {init: "INIT", signal: controller.signal});
		expect(controller).toEqual(abortController);
	});

	it("Returns an new AbortController when it is not give AbortController and calls fetch with the signal from the returned controller", async () => {
		const response = mockResponse("TEXT");
		const fetchFn = jest.fn(() => {return Promise.resolve(response)});
		mockFetch(fetchFn);
		const controller = fetchResponseHandler("URL", {init: "INIT"})
		  .fetch();
		expect(controller).toBeInstanceOf(AbortController);
		expect(fetchFn).toHaveBeenCalledWith("URL", {init: "INIT", signal: controller.signal});
	});
	
 	it("Supplies Response on Success to onSuccess callback", async () => {
		const response = mockResponse("TEXT");
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onSuccess(resp => {
			  resolve(resp);
		    })
		    .fetch();
		})).toEqual(response);
	});
    
 	it("Supplies Response on Client Error to onClientError callback", async () => {
		const response = mockResponse("TEXT", 400);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onClientError(resp => {
			  resolve(resp);
		    })
		    .fetch();
		})).toEqual(response);
	});

	it("Supplies Response on Client Error to onError callback", async () => {
		const response = mockResponse("TEXT", 400);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onError(resp => {
			  resolve(resp);
		    })
		    .fetch();
		})).toEqual(response);
	});

 	it("Supplies Response on Server Error to onServerError callback", async () => {
		const response = mockResponse("TEXT", 500);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onServerError(resp => {
			  resolve(resp);
		    })
		    .fetch();
		})).toEqual(response);
	});

 	it("Supplies Response on Server Error to onError callback", async () => {
		const response = mockResponse("TEXT", 500);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onError(resp => {
			  resolve(resp);
		    })
		    .fetch();
		})).toEqual(response);
	});
    
 	it("Supplies Response on Specific Error to specific error callback", async () => {
		const response = mockResponse("TEXT", 300);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onStatus(300, resp => {
			  resolve(resp);
		    })
		    .fetch();
		})).toEqual(response);
	});
    
	it("Supplies JSON on Success to onSuccessJson callback", async () => {
		const jsonResponse = {key: "KEY"};
		mockFetch(jest.fn(() => {
		  return Promise.resolve(mockJsonResponse(jsonResponse))
		}));
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onSuccessJson(json => {
			  resolve(json);
		    })
		    .fetch();
		})).toEqual(jsonResponse);
	});
    
	it("Supplies JSON on Client Error to onClientErrorJson callback", async () => {
		const jsonResponse = {key: "KEY"};
		mockFetch(jest.fn(() => {
		  return Promise.resolve(mockJsonResponse(jsonResponse, 400))
		}));
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onClientErrorJson(json => {
			  resolve(json);
		    })
		    .fetch();
		})).toEqual(jsonResponse);
	});
    
	it("Supplies JSON on Client Error to onErrorJson callback", async () => {
		const jsonResponse = {key: "KEY"};
		mockFetch(jest.fn(() => {
		  return Promise.resolve(mockJsonResponse(jsonResponse, 400))
		}));
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onErrorJson(json => {
			  resolve(json);
		    })
		    .fetch();
		})).toEqual(jsonResponse);
	});
    
	it("Supplies JSON on Server Error to onServerErrorJson callback", async () => {
		const jsonResponse = {key: "KEY"};
		mockFetch(jest.fn(() => {
		  return Promise.resolve(mockJsonResponse(jsonResponse, 500))
		}));
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onServerErrorJson(json => {
			  resolve(json);
		    })
		    .fetch();
		})).toEqual(jsonResponse);
	});
    
	it("Supplies JSON on Server Error to onErrorJson callback", async () => {
		const jsonResponse = {key: "KEY"};
		mockFetch(jest.fn(() => {
		  return Promise.resolve(mockJsonResponse(jsonResponse, 500))
		}));
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onErrorJson(json => {
			  resolve(json);
		    })
		    .fetch();
		})).toEqual(jsonResponse);
	});
    
 	it("Supplies JSON Response on Specific Error to specific JSON error callback", async () => {
		const jsonResponse = {key: "KEY"};
		mockFetch(jest.fn(() => {
		  return Promise.resolve(mockJsonResponse(jsonResponse, 300))
		}));
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onStatusJson(300, json => {
			  resolve(json);
		    })
		    .fetch();
		})).toEqual(jsonResponse);
	});
    
 	it("Supplies Runtime Error on to onRuntimeError callback", async () => {
		mockFetch(jest.fn(() => {
		  return Promise.reject({message: "ERROR"})
		}));
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onRuntimeError(error => {
			  resolve(error.message);
		    })
		    .fetch();
		})).toEqual("ERROR");
	});
    
 	it("Runs the final executor after resolving", async () => {
		const jsonResponse = {key: "KEY"};
		mockFetch(jest.fn(() => {
		  return Promise.resolve(mockJsonResponse(jsonResponse, 300))
		}));
		const jsonResult = {};
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onStatusJson(300, json => {
			  jsonResult.json = json;
		    })
		    .doFinally(() => {
			  resolve("DONE")
		    })
		    .fetch();
		})).toEqual("DONE");
		expect(jsonResult.json).toEqual(jsonResponse);
	});
    
 	it("Runs the final executor after rejecting", async () => {
		mockFetch(jest.fn(() => {
		  return Promise.reject({message: "ERROR"})
		}));
		const errorResult = {};
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onRuntimeError(error => {
			  errorResult.error = error;
		    })
		    .doFinally(() => {
			  resolve("DONE");
		    })
		    .fetch();
		})).toEqual("DONE");
	    expect(errorResult.error.message).toEqual("ERROR");
	});
	 
});

describe("Default doFinally", () => {

  it("Runs the default final executor after resolving", async () => {
	const jsonResponse = {key: "KEY"};
	mockFetch(jest.fn(() => {
	  return Promise.resolve(mockJsonResponse(jsonResponse, 300))
	}));
	const jsonResult = {};
	expect(await new Promise((resolve) => {
	  doFinally(() => {resolve("DONE")});
      fetchResponseHandler("URL", {init: "INIT"})
	    .onStatusJson(300, json => {
		  jsonResult.json = json;
	    })
	    .fetch();
	})).toEqual("DONE");
	expect(jsonResult.json).toEqual(jsonResponse);
  });

  it("Does not run the default final executor after resolving if onFinally is given", async () => {
	const jsonResponse = {key: "KEY"};
	mockFetch(jest.fn(() => {
	  return Promise.resolve(mockJsonResponse(jsonResponse, 300))
	}));
	const jsonResult = {};
	expect(await new Promise((resolve) => {
	  doFinally(() => {resolve("NOT_DONE")});
      fetchResponseHandler("URL", {init: "INIT"})
	    .onStatusJson(300, json => {
		  jsonResult.json = json;
	    })
	    .doFinally(() => {resolve("DONE")})
	    .fetch();
	})).toEqual("DONE");
	expect(jsonResult.json).toEqual(jsonResponse);
  });

  it("Always runs the default final executor after resolving if onFinally is given if so configured", async () => {
	const jsonResponse = {key: "KEY"};
	mockFetch(jest.fn(() => {
	  return Promise.resolve(mockJsonResponse(jsonResponse, 300))
	}));
	const jsonResult = {};
	const finallyResult = {};
	expect(await new Promise((resolve) => {
	  doFinally(() => {resolve("DONE")}, true);
      fetchResponseHandler("URL", {init: "INIT"})
	    .onStatusJson(300, json => {
		  jsonResult.json = json;
	    })
	    .doFinally(() => {finallyResult.finally = "FINALLY"})
	    .fetch();
	})).toEqual("DONE");
	expect(jsonResult.json).toEqual(jsonResponse);
	expect(finallyResult.finally).toEqual("FINALLY");
  });

  it("Runs the default final executor after rejecting", async () => {
	const jsonResponse = {key: "KEY"};
	mockFetch(jest.fn(() => {
	  return Promise.reject({message: "ERROR"})
	}));
	const jsonResult = {};
	expect(await new Promise((resolve) => {
	  doFinally(() => {resolve("DONE")});
      fetchResponseHandler("URL", {init: "INIT"})
	    .onStatusJson(300, json => {
		  jsonResult.json = json;
	    })
	    .fetch();
	})).toEqual("DONE");
	expect(jsonResult.json).toBeUndefined();
  });

  it("Does not run the default final executor after rejecting if onFinally is given", async () => {
	const jsonResponse = {key: "KEY"};
	mockFetch(jest.fn(() => {
	  return Promise.reject({message: "ERROR"})
	}));
	const jsonResult = {};
	expect(await new Promise((resolve) => {
	  doFinally(() => {resolve("NOT_DONE")});
      fetchResponseHandler("URL", {init: "INIT"})
	    .onStatusJson(300, json => {
		  jsonResult.json = json;
	    })
	    .doFinally(() => {resolve("DONE")})
	    .fetch();
	})).toEqual("DONE");
	expect(jsonResult.json).toBeUndefined();
  });

  it("Always runs the default final executor after rejecting if onFinally is given if so configured", async () => {
	const jsonResponse = {key: "KEY"};
	mockFetch(jest.fn(() => {
	  return Promise.reject({message: "ERROR"})
	}));
	const jsonResult = {};
	const finallyResult = {};
	expect(await new Promise((resolve) => {
	  doFinally(() => {resolve("DONE")}, true);
      fetchResponseHandler("URL", {init: "INIT"})
	    .onStatusJson(300, json => {
		  jsonResult.json = json;
	    })
	    .doFinally(() => {finallyResult.finally = "FINALLY"})
	    .fetch();
	})).toEqual("DONE");
	expect(jsonResult.json).toBeUndefined();
	expect(finallyResult.finally).toEqual("FINALLY");
  });


});


describe("Default onServerError", () => {
	
 	it("Supplies Response on Server Error to default onServerError", async () => {
		const response = mockResponse("TEXT", 500);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onServerError((resp) => {resolve(resp)});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .fetch();
		})).toEqual(response);
	});

 	it("Does not supply Response on Server Error to default onServerError when onServerError is given", async () => {
		const response = mockResponse("TEXT", 500);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onServerError((resp) => {resolve("NOT_DONE")});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onServerError((resp) => {
			  resolve(resp);
		    })
		    .fetch();
		})).toEqual(response);
	});

 	it("Always supplies Response on Server Error to default onServerError when onServerError is given if so configured", async () => {
		const response = mockResponse("TEXT", 500);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		errorResponse = {};
		expect(await new Promise((resolve) => {
		  onServerError((resp) => {resolve(resp)}, true);
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onServerError((resp) => {
			  errorResponse.response = resp;
		    })
		    .fetch();
		})).toEqual(response);
		expect(errorResponse.response).toEqual(response);
	});


});

describe("Default onClientError", () => {
	
 	it("Supplies Response on Client Error to default onClientError", async () => {
		const response = mockResponse("TEXT", 400);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onClientError((resp) => {resolve(resp)});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .fetch();
		})).toEqual(response);
	});

 	it("Does not supply Response on Client Error to default onClientError when onClientError is given", async () => {
		const response = mockResponse("TEXT", 400);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onClientError((resp) => {resolve("NOT_DONE")});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onClientError((resp) => {
			  resolve(resp);
		    })
		    .fetch();
		})).toEqual(response);
	});

 	it("Always supplies Response on Client Error to default onClientError when onClientError is given if so configured", async () => {
		const response = mockResponse("TEXT", 400);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		errorResponse = {};
		expect(await new Promise((resolve) => {
		  onClientError((resp) => {resolve(resp)}, true);
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onClientError((resp) => {
			  errorResponse.response = resp;
		    })
		    .fetch();
		})).toEqual(response);
		expect(errorResponse.response).toEqual(response);
	});


});

describe("Default onServerErrorJson", () => {
	
 	it("Supplies JSON on Server Error to default onServerErrorJson", async () => {
	    const jsonResponse = {key: "KEY"};
		const response = mockJsonResponse(jsonResponse, 500);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onServerErrorJson((json) => {resolve(json)});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .fetch();
		})).toEqual(jsonResponse);
	});

 	it("Does not supply JSON on Server Error to default onServerErrorJson when onServerErrorJson is given", async () => {
	    const jsonResponse = {key: "KEY"};
		const response = mockJsonResponse(jsonResponse, 500);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onServerErrorJson((json) => {resolve("NOT_DONE")});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onServerErrorJson((json) => {
			  resolve(json);
		    })
		    .fetch();
		})).toEqual(jsonResponse);
	});

 	it("Always supply JSON on Server Error to default onServerErrorJson when onServerErrorJson is given if so configured", async () => {
	    const jsonResponse = {key: "KEY"};
		const response = mockJsonResponse(jsonResponse, 500);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		errorResponse = {};
		expect(await new Promise((resolve) => {
		  onServerErrorJson((json) => {resolve(json)}, true);
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onServerErrorJson((json) => {
			  errorResponse.json = json;
		    })
		    .fetch();
		})).toEqual(jsonResponse);
		expect(errorResponse.json).toEqual(jsonResponse);
	});


});

describe("Default onClientErrorJson", () => {
	
 	it("Supplies Json on Client Error to default onClientErrorJson", async () => {
	    const jsonResponse = {key: "KEY"};
		const response = mockJsonResponse(jsonResponse, 400);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onClientErrorJson((json) => {resolve(json)});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .fetch();
		})).toEqual(jsonResponse);
	});

 	it("Does not supply JSON on Client Error to default onClientErrorJson when onClientErrorJson is given", async () => {
	    const jsonResponse = {key: "KEY"};
		const response = mockJsonResponse(jsonResponse, 400);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onClientErrorJson((json) => {resolve("NOT_DONE")});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onClientErrorJson((json) => {
			  resolve(json);
		    })
		    .fetch();
		})).toEqual(jsonResponse);
	});

 	it("Always supplies JSON on Client Error to default onClientErrorJson when onClientErrorJson is given if so configured", async () => {
	    const jsonResponse = {key: "KEY"};
		const response = mockJsonResponse(jsonResponse, 400);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		errorResponse = {};
		expect(await new Promise((resolve) => {
		  onClientErrorJson((json) => {resolve(json)}, true);
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onClientErrorJson((json) => {
			  errorResponse.json = json;
		    })
		    .fetch();
		})).toEqual(jsonResponse);
		expect(errorResponse.json).toEqual(jsonResponse);
	});


});

describe("Default onError", () => {
	
	it("Supplies Response on Server Error to default onError", async () => {
		const response = mockResponse("TEXT", 500);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onError((resp) => {resolve(resp)});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .fetch();
		})).toEqual(response);
	});

 	it("Does not supply Response on Server Error to default onError when onError is given", async () => {
		const response = mockResponse("TEXT", 500);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onError((resp) => {resolve("NOT_DONE")});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onError((resp) => {
			  resolve(resp);
		    })
		    .fetch();
		})).toEqual(response);
	});

 	it("Always supplies Response on Server Error to default onError when onError is given if so configured", async () => {
		const response = mockResponse("TEXT", 500);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		errorResponse = {};
		expect(await new Promise((resolve) => {
		  onError((resp) => {resolve(resp)}, true);
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onError((resp) => {
			  errorResponse.response = resp;
		    })
		    .fetch();
		})).toEqual(response);
		expect(errorResponse.response).toEqual(response);
	});

 	it("Supplies Response on Client Error to default onError", async () => {
		const response = mockResponse("TEXT", 400);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onError((resp) => {resolve(resp)});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .fetch();
		})).toEqual(response);
	});

 	it("Does not supply Response on Client Error to default onError when onError is given", async () => {
		const response = mockResponse("TEXT", 400);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onError((resp) => {resolve("NOT_DONE")});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onError((resp) => {
			  resolve(resp);
		    })
		    .fetch();
		})).toEqual(response);
	});

 	it("Always supplies Response on Client Error to default onError when onError is given if so configured", async () => {
		const response = mockResponse("TEXT", 400);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		errorResponse = {};
		expect(await new Promise((resolve) => {
		  onError((resp) => {resolve(resp)}, true);
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onError((resp) => {
			  errorResponse.response = resp;
		    })
		    .fetch();
		})).toEqual(response);
		expect(errorResponse.response).toEqual(response);
	});
	
});

describe("Default onErrorJson", () => {
	
 	it("Supplies JSON on Server Error to default onErrorJson", async () => {
	    const jsonResponse = {key: "KEY"};
		const response = mockJsonResponse(jsonResponse, 500);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onErrorJson((json) => {resolve(json)});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .fetch();
		})).toEqual(jsonResponse);
	});

 	it("Does not supply JSON on Server Error to default onErrorJson when onErrorJson is given", async () => {
	    const jsonResponse = {key: "KEY"};
		const response = mockJsonResponse(jsonResponse, 500);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onErrorJson((json) => {resolve("NOT_DONE")});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onErrorJson((json) => {
			  resolve(json);
		    })
		    .fetch();
		})).toEqual(jsonResponse);
	});

 	it("Always supply JSON on Server Error to default onErrorJson when onErrorJson is given if so configured", async () => {
	    const jsonResponse = {key: "KEY"};
		const response = mockJsonResponse(jsonResponse, 500);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		errorResponse = {};
		expect(await new Promise((resolve) => {
		  onErrorJson((json) => {resolve(json)}, true);
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onErrorJson((json) => {
			  errorResponse.json = json;
		    })
		    .fetch();
		})).toEqual(jsonResponse);
		expect(errorResponse.json).toEqual(jsonResponse);
	});

 	it("Supplies Json on Client Error to default onErrorJson", async () => {
	    const jsonResponse = {key: "KEY"};
		const response = mockJsonResponse(jsonResponse, 400);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onErrorJson((json) => {resolve(json)});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .fetch();
		})).toEqual(jsonResponse);
	});

 	it("Does not supply JSON on Client Error to default onErrorJson when onErrorJson is given", async () => {
	    const jsonResponse = {key: "KEY"};
		const response = mockJsonResponse(jsonResponse, 400);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		expect(await new Promise((resolve) => {
		  onErrorJson((json) => {resolve("NOT_DONE")});
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onErrorJson((json) => {
			  resolve(json);
		    })
		    .fetch();
		})).toEqual(jsonResponse);
	});

 	it("Always supplies JSON on Client Error to default onErrorJson when onErrorJson is given if so configured", async () => {
	    const jsonResponse = {key: "KEY"};
		const response = mockJsonResponse(jsonResponse, 400);
		mockFetch(jest.fn(() => {
		  return Promise.resolve(response)
		}));	
		errorResponse = {};
		expect(await new Promise((resolve) => {
		  onErrorJson((json) => {resolve(json)}, true);
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onErrorJson((json) => {
			  errorResponse.json = json;
		    })
		    .fetch();
		})).toEqual(jsonResponse);
		expect(errorResponse.json).toEqual(jsonResponse);
	});

	
});

describe("Default onRuntimeError", () => {
	
 	it("Supplies Runtime Error to default onRuntimeError", async () => {
		mockFetch(jest.fn(() => {
		  return Promise.reject({message: "ERROR"})
		}));
		expect(await new Promise((resolve) => {
		  onRuntimeError(error => {
			  resolve(error.message);
		    });
		  fetchResponseHandler("URL", {init: "INIT"})
		    .fetch();
		})).toEqual("ERROR");
	});
    
 	it("Does not supply Runtime Error to default onRuntimeError when onRuntimeError is given", async () => {
		mockFetch(jest.fn(() => {
		  return Promise.reject({message: "ERROR"})
		}));
		expect(await new Promise((resolve) => {
		  onRuntimeError(error => {
			  resolve("NOT_DONE");
		    });
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onRuntimeError(error => {
			  resolve(error.message);
		    })
		    .fetch();
		})).toEqual("ERROR");
	});
    
 	it("Always supplies Runtime Error to default onRuntimeError when onRuntimeError is given if so configured", async () => {
		mockFetch(jest.fn(() => {
		  return Promise.reject({message: "ERROR"})
		}));
		const runtimeErrorResponse = {};
		expect(await new Promise((resolve) => {
		  onRuntimeError(error => {resolve(error.message)}, true);
		  fetchResponseHandler("URL", {init: "INIT"})
		    .onRuntimeError(error => {
			  runtimeErrorResponse.error = error;
		    })
		    .fetch();
		})).toEqual("ERROR");
		expect(runtimeErrorResponse.error).toEqual({message: "ERROR"});
	});
    
});

describe("Promeise-like methods", () => {
	
	it("Calls fetch(...) with the given url and init options then calls the onFulfilled via then with the resolved response", async () => {
        const response = mockResponse("TEXT");
		const fetchFn = jest.fn(() => {return Promise.resolve(response)});
		mockFetch(fetchFn);
		expect(await new Promise((resolve) => {
		  const onFulfilled = (resp) => {resolve(resp)};
		  const onRejected = (error) => {};
		  fetchResponseHandler("URL", {init: "INIT"})
		    .then(onFulfilled, onRejected);	
		})).toEqual(response);
		expect(fetchFn).toHaveBeenCalledWith("URL", {init: "INIT"});
	});
	
	it("Calls fetch(...) with the given url and init options then calls the onRejected via then with the rejected error", async () => {
        const error = {message: "ERROR"};
		const fetchFn = jest.fn(() => {return Promise.reject(error)});
		mockFetch(fetchFn);
		expect(await new Promise((resolve) => {
		  const onFulfilled = (resp) => {};
		  const onRejected = (error) => {resolve(error)};
		  fetchResponseHandler("URL", {init: "INIT"})
		    .then(onFulfilled, onRejected);	
		})).toEqual(error);
		expect(fetchFn).toHaveBeenCalledWith("URL", {init: "INIT"});
	});
	
	it("Calls fetch(...) with the given url and init options then calls the onRejected via catch with the rejected error", async () => {
        const error = {message: "ERROR"};
		const fetchFn = jest.fn(() => {return Promise.reject(error)});
		mockFetch(fetchFn);
		expect(await new Promise((resolve) => {
		  const onRejected = (error) => {resolve(error)};
		  fetchResponseHandler("URL", {init: "INIT"})
		    .catch(onRejected);	
		})).toEqual(error);
		expect(fetchFn).toHaveBeenCalledWith("URL", {init: "INIT"});
	});
	
	it("Calls fetch(...) with the given url and init options then executes the executor via finally and returns the result when resolved", async () => {
        const response = mockResponse("TEXT");
		const fetchFn = jest.fn(() => {return Promise.resolve(response)});
		mockFetch(fetchFn);
		expect(await new Promise((resolve) => {
		  fetchResponseHandler("URL", {init: "INIT"})
		    .finally(() => {resolve("DONE")});	
		})).toEqual("DONE");
		expect(fetchFn).toHaveBeenCalledWith("URL", {init: "INIT"});
	});
	
});

























