# REST API Clients

In production code we often have to add complicated details to our REST requests such as `HTTP headers`, `timeouts`, `Authentication`, `CORS`, and a whole host of other options.
Adding these details in-line with your business logic obfuscates what your code is doing and makes it much harder to read and junks idiomacity.

Defining a REST API client for each remote service that you application uses allows you to define in one place how your application connects to the remote service including all the nasty production details.
The rest API client can then be used wherever you need it in your application. Using expressive names for your API clients and the methods that they expose allows the business logic of your application to be idiomatic.

You should define a separate method for each rest end-point of the remote service that your application uses which receives the request parameters and payload as method parameters and generate the `url` and `init` options for the Request.
Each method should return the `promise-like` object returned by `fetchResponseHandler(url, init)`

## Rest API Client For The Widgets Service 

```javascript
const widgetApi = {                                       // (1)
  get: (id) => {                                          // (2)
    const url = 'http://widgets.com/api/widgets/' + id;   // (3)
    const init = {
      method: 'GET', 
      headers: {...}, 
      ...};                                               // (4)
    return fetchResponseHandler(url, init);               // (5)
  },
  save: (id, widget) => {                                 // (6)
    const url = 'http://widgets.com/api/widgets/' + id;
    const init = {
      method: 'GET', 
      headers: {...}, 
      body: JSON.stringify(widget),                       // (7)
      ...};
    return fetchResponseHandler(url, init);
  }
};

export default widgetApi;
```

## Using The Widget API REST Client

```javascript
import widgetApi from "<somewhere>"

const ViewWidget = ({id}) => { 
  const [widget, setWidget] = useState(undefined);
  
  useEffect(() => {
    if (id) {
      const controller = widgetApi.get(id)                 // (8)
        .onSuccessJson(setWidget)
        .fetch();
        
      return () => controller.abort();
    }
  }, [id]);
  
  return {widget && ...};
}
```

1. Define a REST API Client for the Widgets API
2. Add a method to get a widget by `id`
3. Define the GET `url` for the given `id`
4. Define the `init` parameters for GET requests
5. Return the Fetch Response Handler promise-like object
6. Add a method to save a widget and/or other methods of the Widget API
7. Add the widget to save to the body of the `init` parameters as JSON
8. Use the widgetApi wherever you need it in your code

Defining REST API Clients keeps the nasty details of production API requests away from your business logic and ensures that this nastiness only exists in one place.
Using REST API CLients keeps your business logic clean and expressive even in complex production applications. 