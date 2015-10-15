This is a small chat application where user can register, login and chat between all users (both individually and in group).

How it works?

First user needs to registrer himself. Then user can login. After login user will be navigated to chat page. In chat page left panel,
all registered user will be shown with their status (currently available or unavailable). A default group will be created where all 
registered user can chat together.
User can chat with any other user personally selecting the user from left panel. Unread message count will be shown beside 
the user's name in left panel.

Prerequisites:
1. MongoDB needs to be installed in the system
2. Node needs to be installed

How to start?

1. Download project
2. Start mongoDB
3. Open command prompt and change directory till the project location
4. start app by typing 'npm start' in command prompt

Note:
By default app will have the url: http://192.168.1.10:3000. User can configure it at 'config.js' file. Same configuration needs 
to be made in public/javascripts/config.js file.
