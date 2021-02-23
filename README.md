## Description

This is a simple REST API with NestJS and Mongodb.
It is used for managing tasks.

## Examples

### Show All Tasks in Project
#### ・URL
   /api/tasks
  
#### ・Method
   GET
  
#### ・Query Params
   Required:<br/>
   projectId=[integer]
  
#### ・Data Params
   None
  
#### ・Success Response
   Code： 200 <br/>
   Content: { tasks: [{id: 1, title: task name ... etc.}], message: "Task Created!"}

### ・Error Response
   Code:401<br/>
   Content: { message: 'Unauthorized' }
  
   or
  
   Code: 500<br/>
   Content: { message: 'Something went wrong, please try again.'}
  
### Create New Task
#### ・URL
　  /api/tasks
 
#### ・Method
　  POST

#### ・Data Params
    Required
  <p>title=[string]</p>
  <p>description=[string]</p>
  <p>limitDate=[Date]</p>
  <p>progress=[integer]</p>
  <p>status=[string]</p>
  <p>comments=[Array Of string]</p>
  <p>creator=[string]</p>
  <p>modfiedBy=[Array of string]</p>
  <p>personInCharge=[string]</p>
  <p>category=[string]</p>
  <p>project=[string]</p>
  <p>createdAt=[Date]</p>
  <p>updatedAt=[Date]</p>
  
#### ・Success Response
  Code： 200<br/>
  Content: { tasks: [{id: 1, title: task name ... etc.}], message: "Update Success!"}

#### ・Error Response
  Code:401<br/>
  Content: { message: 'Unauthorized' }
  
  or
  
  Code: 500<br/>
  Content: { message: 'Something went wrong, please try again.'}
  
#### ・Success Response
  Code: 201<br/>
  Content: { task: {id: 1, title: task name ... etc.}, message: "Created New Task"}
  
#### ・Error Response
  Code:401<br/>
  Content: { message: 'Unauthorized' }
  
  or
  
  Code: 500<br/>
  Content: { message: 'Something went wrong, please try again.'}

### ・Update Task
#### ・URL
　 api/task/:taskId

#### ・Method
   PATCH

#### ・Data Params
  Required:<br/>
  <p>title=[string]</p>
  <p>description=[string]</p>
  <p>limitDate=[Date]</p>
  <p>status=[string]</p>
  <p>progress=[integer]</p>
  <p>comment=[{title=[string], description=[string]}</p>
  <p>mmodfiedBy=[Array of string]</p>
  <p>personInCharge=[string]</p>
  <p>category=[string]</p>

#### ・URL PARAMS
　 taskId=[string]

#### ・Query Params
   perojectId=[string]

#### Request Header
   user=[{ id=[string], name=[string], email=[string], project=Array }]
    
### Delete Task
   /api/task/:id
    
#### ・Method
   Delete
    
#### ・URL PARAMS
　 taskId=[string]
   
#### ・Data Params
   None

#### ・Success Response
   Code： 200<br/>
   Content: { message: "Delete Task!"}

#### ・Error Response
   Code:401<br/>
   Content: { message: 'Unauthorized' }
  
   or
  
   Code: 500<br/>
   Content: { message: 'Something went wrong, please try again.'}
  
### Install
```bash
$ git clone https://github.com/ShunsukeNagashima/whatudo_backend.git
$ cd whatudo_backend
$ npm install
$ npm start
```
By following these steps, you will be ready to send a request to this API!<br/>
By default, it is listening to PORT8080.

#### ・Author
　Shunsuke Nagashima<br/>
  Twitter: https://twitter.com/shun_n_dr
