# sipgate rest api client v2

Client for the sipgate rest api v2.

This version is still under development and therefore subject to change.

## Response error handling

In versions `<5` http response errors were not handled correctly. If you need to keep the old behavior set the `skipResponseErrorHandling` parameter to `true`.

### Legacy behavior example

```js
import createClient from 'sipgate-rest-api-client-v2';

const client = createClient(
	'https://api.sipgate.com',
	'SECRET_API_TOKEN',
	promise => promise,
	true
)
```
