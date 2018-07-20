# Invitation actions

`index.js` is required, it loads all modules in this directory ending with `.js`

an invite action looks the following

`<invite-type>.js`
```javascript

function accept(inv, callback) {
  // do something that should be done if a user accepts an invite

  callback('accepted')
}

function decline(inv, callback) {
  // do something that should be done if a user declines an invite

  callback('declined')
}

// the callback's message property is sent back to the user in the response

module.exports = {
  accept,
  decline
}
```
