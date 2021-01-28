# streamlabs-gradient-chatbox
A custom color and transparency gradient theme for the Streamlabs Twitch chatbox widget


## Description
The theme provides code to allow for the colors of the chat text and usernames to be colored and transparent based on their relative position in the chatbox. The configuration of the gradients can be set to include any number of colors, though any more than about 20 doesn't have much effect bacause of the number of messages possible in the chatbox.


## How To Use

- If disabled, enable custom HTML/CSS on your Streamlabs chatbox widget dashboard (https://streamlabs.com/dashboard#/chatbox)
- Copy the files into their respective text boxes
  - [chatbox.html](chatbox.html) into the _HTML_ text box
  - [chatbox.css](chatbox.css) into the _CSS_ text box
  - [chatbox.js](chatbox.js) into the _JS_ text box
- If there is not a tab for _Custom Fields_, click the _Add Custom Fields_ button below the aforementioned text box
- Click the _Edit Custom Fields_ button below the example custom fields
- Copy the [chatbox.json](chatbox.json) into the _Custom Fields_ text box
- Click the _Update_ button to save the custom fields.
- Make any changes required to the custom fields.
- Click the _Save Settings_ button
- Enjoy
