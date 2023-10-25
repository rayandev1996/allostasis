# Allostasis JS SDK

This SDK is for Allostasis community profile management.

## Usage

### Initialize

First step is to create an instance of the SDK.
```
import Allostasis from 'allostasis-js-sdk';

const allostasis = new Allostasis(community, options)
```

<table>
<thead>
<tr>
<th>Property</th>
<th>Required</th>
<th>Values</th>
</tr>
</thead>
<tbody>
<tr>
<td>community</td>
<td>Yes</td>
<td>
greenia
<br>
embodia
<br>
centeria
<br>
wearia
<br>
incarnia
<br>
avatia
</td>
</tr>
<tr>
<td>options</td>
<td>Yes</td>
<td>ConstructionOptions</td>
</tr>
</tbody>
</table>

```
ConstructionOptions = {
    nodeURL: URL of the node,
    provider?: Like MetaMask,
    chain?: {
        name: Name of the chain,
        id: ID of the chain
    },
    infura: {
        url: infura URL,
        projectId: infura project ID,
        apiKey: Infura API key
    }
}
```

### Connect to Ceramic and Lit

Using the `connect` method of the SDK, you can connect the user to specified network.

```
allostasis.connect().then({ did, address } => {
    // connected successfully
}).catch(error => {
    // error happened
})
```

### Check Connection
Use `isConnected` to check the status of connection to ceramic.

```
allostasis.isConnected().then({ did, address } => {
    // is connected
}).catch(error => {
    // is not connected or error happened
})
```

### Disconnect
To log the user out of the network, use `disconnect` method.

```
allostasis.disconnect().then(response => {
    // disconnected
}).catch(error => {
    // error happened
})
```

### Create / Update Profile
To update existing user profile or create new one, use as below:

```
allostasis.createOrUpdateProfile(RequestParams).then(response => {
    // created or updated
}).catch(error => {
    // error happened
})
```

`RequestParams` is an object:

<table>
<thead>
<tr>
<th>Property</th>
<th>Required</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr><td>displayName</td><td>No</td><td>String</td></tr>
<tr><td>email</td><td>No</td><td>String</td></tr>
<tr><td>avatar</td><td>No</td><td>String</td></tr>
<tr><td>cover</td><td>No</td><td>String</td></tr>
<tr><td>bio</td><td>No</td><td>String</td></tr>
<tr><td>accountType</td><td>No</td><td>PERSONNAL or ENTERPRISE</td></tr>
<tr><td>age</td><td>No</td><td>Number</td></tr>
<tr><td>skills</td><td>No</td><td>String[] max 10 items</td></tr>
<tr><td>gender</td><td>No</td><td>MALE or FEMALE or OTHER</td></tr>
<tr><td>phoneNumber</td><td>No</td><td>String</td></tr>
<tr><td>address</td><td>No</td><td>String</td></tr>
<tr><td>socialLinks</td><td>No</td><td>String[] max 20 items</td></tr>
</tbody>
</table>

### Get Profile

To get user's profile, use `getProfile` method.

```
allostasis.getProfile().then(response => {
    // profile data
}).catch(error => {
    // error happened
})
```

### Get Specific User's Profile

To get user's profile by ID, use `getUserProfile` method.

```
allostasis.getUserProfile(profileID).then(response => {
    // profile data
}).catch(error => {
    // error happened
})
```

### Get Specific User's Community Profile

To get user's community profile by ID, use `getCommunityUserProfile` method.

```
allostasis.getCommunityUserProfile(communityProfileID).then(response => {
    // community profile data
}).catch(error => {
    // error happened
})
```

## Development

This is an NPM package, after each commit, change the version number inside `package.json` and then run the following commands:
- `npm run build`
- `npm publish`

Note: You need to be logged in to your NPM account using npm cli.
