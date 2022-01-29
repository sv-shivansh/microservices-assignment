> ### Pre Requisites

-   Docker

> ### Sample ENV
>
> ENV's are different for each service as they are sunning on different containers

> User Service:

```
MONGO_URL=mongodb://mongo:27017/pratilipi_assig?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false
USER_PORT=3000
```

> Book Service:

```
MONGO_URL=mongodb://mongo:27017/pratilipi_assig?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false
BOOK_PORT=5000
```

> Activity Service:

```
MONGO_URL=mongodb://mongo:27017/pratilipi_assig?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false
ACTIVITY_PORT=8000
```

> ### To run the application

```
> docker-compose up --build
```

> Folder Structure

```
└── microservice_assignment
│   .gitignore
│   docker-compose.yml
│   README.md
│
├───Activity
│   │   .env
│   │   Activity.js
│   │   Dockerfile
│   │   package-lock.json
│   │   package.json
│   │
│   └───routes
│           activity.js
│
├───Book
│   │   .env
│   │   Book.js
│   │   Dockerfile
│   │   package-lock.json
│   │   package.json
│   │
│   ├───models
│   │       book-content.js
│   │
│   ├───routes
│   │       book.js
│   │
│   └───uploads
├───User
│   │   .env
│   │   Dockerfile
│   │   package-lock.json
│   │   package.json
│   │   User.js
│   │
│   ├───models
│   │       user-model.js
│   │
│   └───routes
│           user.js
│
└───utility
        auth.js
        db.js
```

> ### Assumptions

**1.** The Book's data that will be inserted via CSV must have a valid UserID or else the Author will remain unknown.

**2.** Only the author can perform Updation and deletion on that particular Book.

**3.** The users will be able to modify or delete only their own profile.

**4.** For private routes there is no authentication. Only the valid ObjectID must be in the headers as user. Later on authentication can be applied via JWT tokens.

**5.** If a valid user id is present in headers the user will be considered as authenticated and for any user Interaction the same userID will be used.

**6.** The likes and reads of books via user are unique. So doesn't matter how many times user read or like a book. It will be considered only once.

**7.** While executing the requests of the postman collection you will be needed to change the ObjectID in headers and the URL's where you are fetching a particular user or book by ID according to the new ObjectID's generated for each case.

> ## Snapshot

> The userID of refers to current user should be passed in the headers while sending request to the private Routes. This UserID will be considered as logged in user. **Below is the sample userid you will be needed to input your own id after creating a new user.**

> **Similarly You will be needed to change the id's in few of the requests where it fetches data by id.**

> ![image](https://user-images.githubusercontent.com/56015329/150004239-de9f5063-2eb5-4df5-8280-cf7cb8c05438.png)

> ## Architechure
> ![Pratilipi](https://user-images.githubusercontent.com/56015329/151653205-9f852d2b-f2e7-4261-966f-b87aadae417e.png)
