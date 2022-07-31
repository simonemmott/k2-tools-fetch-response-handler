# A Simple React Example

The example below is shows how to use the fetchResponseHandler in a React Functional Component

```javascript
const ViewWidget = ({id}) => {                      // (1)
  const [widget, setWidget] = useState(undefined);  // (2)
  
  useEffect(() => {
    if (id) {
      const controller = fetchResponseHandler("http://widgets.com/api/widgets/" + id)
        .onSuccessJson(setWidget)                   // (4)
        .fetch();
        
      return () => controller.abort();              // (5)
    }
  }, [id]);                                         // (3)
  
  return {widget && ...};                           // (6)
}
```

1. Pass the `id` of a widget to render
2. Create a state variable to hold the widget, initially undefined
3. When the component first renders, or re-renders with a different `id` fetch the widget by `id`
4. On a successful response which supplies JSON data set the widget state
5. When the component re-renders or when the component is unloaded cancel the widget fetch if it is still in flight
6. If the widget has been fetched include the widget in the render

Now that is pretty expressive code, but in production applications we often will have HTTP headers, time outs, HTTP methods, payload data, and others to deal with.
So in real world examples we will loose expressiveness and our code is still less than idiomatic.
