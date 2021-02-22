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
  Required:
  projectId=[integer]
  
#### ・Data Params
  None
  
#### ・Success Response
　Code： 200
  Content: { tasks: [{id: 1, title: task name ... etc.}], message: "Task Created!"}

### ・Error Response
  Code:401
  Content: { message: 'Unauthorized' }
  
  or
  
  Code: 500
  Content: { message: 'Something went wrong, please try again.'}
  
### Create New Task
#### ・URL
　/api/tasks
 
#### ・Method
　POST

#### ・Data Params
  Required
  title=[string]
  description=[string]
  limitDate=[Date]
  progress=[integer]
  status=[string]
  comments=[Array Of string]
  creator=[string]
  modfiedBy=[Array of string]
  personInCharge=[string]
  category=[string]
  project=[string]
  createdAt=[Date]
  updatedAt=[Date]
  
#### ・Success Response
　Code： 200
  Content: { tasks: [{id: 1, title: task name ... etc.}], message: "Update Success!"}

#### ・Error Response
  Code:401
  Content: { message: 'Unauthorized' }
  
  or
  
  Code: 500
  Content: { message: 'Something went wrong, please try again.'}
  
#### ・Success Response
  Code: 201
  Content: { task: {id: 1, title: task name ... etc.}, message: "Created New Task"}
  
#### ・Error Response
  Code:401
  Content: { message: 'Unauthorized' }
  
  or
  
  Code: 500
  Content: { message: 'Something went wrong, please try again.'}

### ・Update Task
#### ・URL
　　api/task/:taskId

#### ・Method
   PATCH

#### ・Data Params
　　Required
  　title=[string]
   description=[string]
   limitDate=[Date]
   status=[string]
   progress=[integer]
   comment=[{title=[string], description=[string]}
   mmodfiedBy=[Array of string]
   personInCharge=[string]
   category=[string]

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
　Code： 200
  Content: { message: "Delete Task!"}

#### ・Error Response
  Code:401
  Content: { message: 'Unauthorized' }
  
  or
  
  Code: 500
  Content: { message: 'Something went wrong, please try again.'}
  
### Install



#### ・Author
　Shunsuke Nagashima
  Twitter: https://twitter.com/shun_n_dr
