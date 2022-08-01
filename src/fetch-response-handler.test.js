let fetchResponseHandler = require("./fetch-response-handler.js").fetchResponseHandler;
let mockFetch = require("./fetch-response-handler.js").mockFetch;
let debug = require("./fetch-response-handler.js").debug;

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

describe("Fetch Response Handler", () => {
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

});