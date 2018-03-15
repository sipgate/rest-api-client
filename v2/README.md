# sipgate rest api client v2

Client for the sipgate rest api v2.

This version is still under development and therefore subject to change.

## Response error handling

Since version `5.0.0` all responses with a non-2xx status code result in a rejected promise. You can access response details through the `payload` property of the resulting error that fulfills the `ResponseErrorPayload` interface. 

```typescript
interface ResponseErrorPayload {
    status: number; // Response HTTP status code
    statusText: string; // Response HTTP status text
    body?: object; // Optional parsed JSON response body
}
```

### Example

```js
import createClient from 'sipgate-rest-api-client-v2';
const client = createClient('https://api.sipgate.com', 'SECRET_API_TOKEN');

client
  .getUsers()
  .then(users => console.log('Successfully fetched users', users))
  .catch(({ payload: { statusCode, statusText, body } }) => {
    console.warn(
      `Failed to fetch users! Got status code ${statusCode} and text ${statusText}`,
      body
    );
  });
```

## Legacy response error handling

In versions prior `5.0.0` HTTP response errors were not handled correctly. On receiving a non-2xx HTTP response, your promise was not rejected but fulfilled with the error HTTP response body. If you need to keep the old behavior set the fourth parameter `skipResponseErrorHandling` of `createClient` to `true`.

### Example

```js
import createClient from 'sipgate-rest-api-client-v2';

const handlePromiseResolved = response => {
	if (!(response.status >= 200 && response.status < 300)) {
		throw new Error("Received invalid API response");
	}
	return response;
};

const client = createClient(
  'https://api.sipgate.com',
  'SECRET_API_TOKEN',
  handlePromiseResolved,
  true // activate skipping response error handling
);
```

You should use the third parameter `onPromiseResolved: ((Response) => Response | PromiseLike<Response>)` of `createClient` to implement your own error handling. The function you provide is executed as part of the promise handling chain.
