# This app has been made with Node and MongoDB


## Demo
https://socialapp-5ec19.firebaseapp.com/


## Frontend Codes Can be Found Here
https://github.com/mahesh863/snapTalk-frontend


This app is a personal project which is a basic implementation of social media app. Inspired by Instagram.

## What can be done in the app
1. Follow Users.
2. Share Posts.
3. News Feeds based on Following.
4. Search For Users.


## Parameters
1. userId : Get User By Id.
2. postId : Get Post By Id.
3. friendId : Search another user By Id.



## Routes

#### Authentication
  1. POST : /auth/signup - To Create an account.
  2. POST : /auth/signin - To Authenticate a user.
  3. GET : /signout - To Signout A User.

#### Feeds


  1. GET:  /feeds/generate/:userId - To generate user feeds based on followers.

#### Notification

  1 GET:  /:userId/all/notification  - To get User Notifications.
  
  
#### Posts

  1. POST :  /create/post/:userId - Create Post.
  2. PUT : /edit/post/:userId/:postId - Edit Post.
  3. DELETE : /delete/post/:userId/:postId - Delete Post.
  4. GET : /like/post/:userId/:postId  - Like A Post.
  5. GET : /unlike/post/:userId/:postId - Unlike A Post.


#### My Profile

  1. GET : /:userId/view/profile - View Profile.
  2. PUT : /:userId/edit/profile - Edit Profile.
  3. DELETE : /:userId/delete/profile - Delete Profile.
  4. GET : /:userId/get/post - Get My Posts.
  5. GET : /:userId/get/friends - Get My followers and following.
  6. PUT : /:userId/profile/image - Change Profile Picture.

#### Followers and Following

  1. GET :  /add/friend/:userId/:friendId  - Send Follow Request.
  2. GET : /delete/friend/:userId/:friendId - Delete Follow Request.
  3. GET : /accept/friend/:userId/:friendId - Accept Follow Request.
  4. GET : /reject/friend/:userId/:friendId - Reject Follow Request.
  5. POST : /search - Search For User.
  6. GET : /suggested - Suggested People To Follow.

## Future Plans
1. Improve the user feed system by making with realtime by using MessageQueue.
2. Improve the search system using Elasticsearch.
3. Add Comment Feature.
4. Better User and Post Suggestion. 
