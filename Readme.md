### Complete Backend Project With Explaination 
<br>

### Dependency vs Dev-dependency
1. **Dev-dependency** --> used for development, Not used in production
2. **Dependency** --> Packages required for your application to run in production.

 [Model Link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj) 
- This is the link for all the models that are going to be made in the project for backend

## FOLDER STRUCTURE
- For image storage --> 3rd Party Service -- AWS, Azure, Cloudinary || temporary storage on cloud


- **./public/temp**
    - .gitkeep --> It iss used to track all the MT folder so that git can track it and send it to github (git status)

- **.gitignore**
    - [Git Ignore Generator](https://mrkandreev.name/snippets/gitignore-generator/#Node)
    - Used To Keep the sensitive data for privacy

- **.env**
    - Environment Variable
    - All these variables are used from the system
    - We can use **.env.sample** to send it to github 

- **src**
    - User dependent where he wants to keep the files in root or in src folder
    - Create Files named **app.js**,  **constants.js**,  **index.js**


 ## [Nodemon Install](https://www.npmjs.com/package/nodemon)
    - npm i nodemon


## create Folders in src
    - controllers
    - db
    - middlewares
    - models
    - routes
    - utils

# **Install Prettier**
- **npm i -D prettier**
- It is used to modify the code when you are working in group.

**es5 : ecmascript 5**<br>
**semi : Semicolon**


## Creating files for prettier extension
.prettierignore
.prettierrc


### DATABASE CONNECTION

- npm i mongoose
- npm i express
- npm i express

Write the Database connection code in **src/db/index.js**

write the database_name in **constants.js** file and import in **db/index.js**.


### CUSTOM API REFERENCE


## [Model Link](https://app.eraser.io/workspace/ndX9JRFc9hyah66Lmq9Y?origin=share)
 - it is the model link
 - it means how many models must be created for databses


## installing bcrypt and jsonwebtoken and mongoose-aggregate-paginate-v2.



### FILE HANDLING
- production grade projects me file handling khud ke system pe nhi hotii
- ya tho 3rdn party services use kii jati h ya phir AWS pe 