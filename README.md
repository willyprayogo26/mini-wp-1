## Mini WP

#### List of basic routes:

| Route          | HTTP | Header(s) | Body                                | Description                                                  |
| -------------- | ---- | --------- | ----------------------------------- | ------------------------------------------------------------ |
| /registerAdmin | POST | none      | email: String<br />password: String | Create a user (role auto admin)<br />success:<br />(201), example: {"_id": String, "name": String, "email": String, "password": String, "role": String}<br />errors:<br />(500), error |
| /register      | POST | none      | email: String<br />password: String | Create a user (role auto user)<br />success:<br />(201), example: {"_id": String, "name": String, "email": String, "password": String, "role": String}<br />errors:<br />(500), error |
| /login         | POST | none      | email: String<br />password: String | Login and get token based on credentials<br />success:<br />(200), example: {"_id": String, "name": String, "email": String, "password": String, "role": String, "token": String}<br />errors:<br />(400), {message: 'Invalid email/password'}<br />(500), error |
| /google-login  | POST | none      | email: String<br />password: String | Login using Oauth2 (Google)<br />success:<br />(200), example: {object}<br />errors:<br />(500), error |



#### List of user routes:

| Route      | HTTP   | Header(s)                                                    | Body                                                         | Description                                                  |
| ---------- | :----- | :----------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| /users     | GET    | Authenticated:<br />(token),<br />Authorized:<br />(role: admin) | none                                                         | Get all users info (Admin only)<br />success:<br />(200), example: [{"_id": String, "name": String, "email": String, "password": String, "role": String}, {"_id": String, "name": String, "email": String, "password": String, "role": String}, etc]<br />errors:<br />(500), error |
| /users/:id | GET    | Authenticated:<br />(token)                                  | none                                                         | Get a single user info (Admin and authenticated member)<br />success:<br />(200), example: {"_id": String, "name": String, "email": String, "password": String, "role": String}<br />errors:<br />(404), example: {message: 'User not found'}<br />(500), error |
| /users     | POST   | Authenticated:<br />(token),<br />Authorized:<br />(role: admin) | name: String<br />email: String<br />password: String<br />role: String | Create a user (admin only)<br />success:<br />(201), example: {"_id": String, "name": String, "email": String, "password": String, "role": String}<br />errors:<br />(500), error |
| /users/:id | PUT    | Authenticated:<br />(token)                                  | name: String<br />email: String<br />password: String        | Update a user with new info (admin and authenticated member)<br />success:<br />(200), example: {message: 'Updated'}<br />errors:<br />(404), example: {message: 'User not found'}<br />(500), error |
| /users/:id | DELETE | Authenticated:<br />(token),<br />Authorized:<br />(role: admin) | none                                                         | Delete a user (admin only)<br />success:<br />(200), example: {message: 'Deleted'}<br />errors:<br />(404), example: {message: 'User not found'}<br />(500), error |



#### List of article routes:

| Route                          | HTTP   | Header(s)                                                    | Body                                               | Description                                                  |
| ------------------------------ | :----- | :----------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| /articles                      | GET    | Authenticated:<br />(token)                                  | none                                               | Get all article<br />success:<br />(200), example: [{"name": String, "content": String, "author": {ObjectId}, "pictureUrl": String, "tags": [String], views: Number, votes: [{"userId": {ObjectId}, "status": Number}]}, {"name": String, "content": String, "author": {ObjectId}, "pictureUrl": String, "tags": [String], views: Number, votes: [{"userId": {ObjectId}, "status": Number}]}, etc]<br />errors:<br />(500), error |
| /articles/:userId              | GET    | Authenticated:<br />(token)                                  | none                                               | Get articles that has based on userId<br />success:<br />(200), example: [{"name": String, "content": String, "author": {ObjectId}, "pictureUrl": String, "tags": [String], views: Number, votes: [{"userId": {ObjectId}, "status": Number}]}, {"name": String, "content": String, "author": {ObjectId}, "pictureUrl": String, "tags": [String], views: Number, votes: [{"userId": {ObjectId}, "status": Number}]}, etc]<br />errors:<br />(500), error |
| /articles/:id/:articleId       | GET    | Authenticated:<br />(token)<br />Authorized:<br />(check isUser) | none                                               | Get a single article info<br />success:<br />(200), example: {"name": String, "content": String, "author": {ObjectId}, "pictureUrl": String, "tags": [String], views: Number, votes: [{"userId": {ObjectId}, "status": Number}]}<br />errors:<br />(404), example: {message: 'Article not found'}<br />(500), error |
| /articles/:id/find/:tagName    | GET    | Authenticated:<br />(token)<br />Authorized:<br />(check isUser) | none                                               | Get articles that has based on tag<br />success:<br />(200), example: [{"name": String, "content": String, "author": {ObjectId}, "pictureUrl": String, "tags": [String], views: Number, votes: [{"userId": {ObjectId}, "status": Number}]}, {"name": String, "content": String, "author": {ObjectId}, "pictureUrl": String, "tags": [String], views: Number, votes: [{"userId": {ObjectId}, "status": Number}]}, etc]<br />errors:<br />(500), error |
| /articles/:id                  | POST   | Authenticated:<br />(token),<br />Authorized:<br />(check isUser) | name: String<br />content: String<br />image: File | Create a article<br />success:<br />(201), example: {"name": String, "content": String, "author": {ObjectId}, "pictureUrl": String, "tags": [String], views: Number, votes: [{"userId": {ObjectId}, "status": Number}]}<br />errors:<br />(400), example: {"message": String}<br />(500), error |
| /articles/:id/:articleId       | PUT    | Authenticated:<br />(token)<br />Authorized:<br />(check isUser) | name: String<br />content: String<br />image: File | Update a article with new info<br />success:<br />(200), example: {"name": String, "content": String, "author": {ObjectId}, "pictureUrl": String, "tags": [String], views: Number, votes: [{"userId": {ObjectId}, "status": Number}]}<br />errors:<br />(404), example: {message: 'Article not found'}<br />(500), error |
| /articles/:id/votes/:articleId | PUT    | Authenticated:<br />(token)<br />Authorized:<br />(check isUser) | views: Number                                      | Update a article with new info<br />success:<br />(200), example: {"name": String, "content": String, "author": {ObjectId}, "pictureUrl": String, "tags": [String], views: Number, votes: [{"userId": {ObjectId}, "status": Number}]}<br />errors:<br />(404), example: {message: 'Article not found'}<br />(500), error |
| /articles/:id/:articleId       | DELETE | Authenticated:<br />(token),<br />Authorized:<br />(check isUser) | none                                               | Delete a article<br />success:<br />(200), example: {message: 'Article successfully deleted'}<br />errors:<br />(404), example: {message: 'Article not found'}<br />(500), error |



#### List of tag routes:

| Route | HTTP | Header(s)                   | Body | Description                                                  |
| ----- | :--- | :-------------------------- | ---- | ------------------------------------------------------------ |
| /tags | GET  | Authenticated:<br />(token) | none | Get all article<br />success:<br />(200), example: [{"name": String}, {"name": String}, etc]<br />errors:<br />(500), error |



### Link Deploy

Server:

<http://portfoly-server.willyprayogo26.xyz>



Client:

<http://portfoly.willyprayogo26.xyz>