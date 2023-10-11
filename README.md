# SwastyaAI_Assignment

This Assessment is on backend development with:
1. The objective is to create a backend API with User, Blog and Comment
models. A Blog is created by a User and any User can create a Comment
on any blog.


2. Create a database with sample data, using a database of your choice.

3. Consider all users who have commented on the same blog as friends (1st
level friend).

4. A friend is 2nd level friend if they have commented on a blog where a 1st
level friend has also commented but has not commented on any common
blog.

5. Example - Blog1 has the comment of {User1, User2}, Blog2 has the
comment of {User1, User3}. Here User2 and User3 are 2nd level friends if
there exists no blog which has the comment of User2 and User3.

6. Similar to above there can be third level friend and k-th level friends (
LinkedIn shows this kind of friend level).

7. Using REST or GraphQL, implement read and create APIs for Users, Blogs
and Comments.

8. Also create an API (again REST or GraphQL as above) to return all the n-th
level friends of a given user, where n is an input number. (Example with
REST API: GET /users/<userId>/level/<levelNo> which should give list of all
friends of that level for given userId (ex- /users/1234/level/1 for first level
friend).

9. Use high standard design principles while implementing the solution.

10.Write modular and clean code with comments keeping in mind scalability
and manageability of code.


I used NodeJs and MongoDB for this assignment,
In models folder you find all the schemas of user,blog,comment.
In app.js, you find database connection and intialization,  
then you find respective post, get REST API's for user,blog and comment in respective order.
For finding nth-level friends I used breadth-first traversal in the following REST API: /users/:userId/level/:levelNo.

To initalize:
1. you need to run "npm init" to install node modules
2. install express, mongoose, nodemon modules using "npm install mongoose express nodemon"
3. run command nodemon start
4. If you want to check working of REST API's you have two ways:
5. use VS code extension ThunderClient for testing the REST API's
6. create an app.http file and write all the paths of REST API's and click on send request to  check working of them.
