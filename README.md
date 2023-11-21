# Question Paper Generator

## Setup

Make sure to follow all these steps exactly as explained below. Do not miss any steps or you won't be able to run this application.

### Install MongoDB

To run this project, you need to install the latest version of MongoDB Community Edition first.

https://docs.mongodb.com/manual/installation/

Once you install MongoDB, make sure it's running.

### Install the Dependencies

Next, from the project folder, install the dependencies:

    npm i

### Set Environment variable

Create one .env file in the root directory of your project. Add environment-specific variables on new lines in the form of NAME=VALUE. 

```dosini
PORT = your_port_number
MONGO_CONNECTION_URL = your_mongodb_url
```

### Start the Server

    node index.js

This will launch the Node server on port 5000. If that port is busy, you can set a different point in .env file.


### Postman collection

You can import postman api collection using above mention collection. File name is "Reelo.postman_collection".

### MongoDB Collection

You can import sample data file. File name is "questions.csv".

### APIs

1) /add-question
-> You can add question in database using this api.

2) /generate-question-paper
-> You can generate question paper by providing required parameter. This api will fetch random data from database everytime when you hit this api. We assumed fixed range questions having fixed range of marks for a given difficulty. For example
```dosini
let numberOfHardQuestion = {
    "10_Marks": 0,
    "5_Marks": 0,
    "4_Marks": 0,
    "3_Marks": 0,
    "2_Marks": 0,
    "1_Marks": 0
};
let numberOfMediumQuestion = {
    "4_Marks": 0,
    "3_Marks": 0,
    "2_Marks": 0,
    "1_Marks": 0
};
let numberOfEasyQuestion = {
    "2_Marks": 0,
    "1_Marks": 0
};
```



Notes:- 

1) In generate question paper, You must provide totalMarks and percentages of Easy,Medium and Hard. Example is mention below.
```dosini
{
    "totalMarks": 100,
    "easy": 20,
    "medium": 50,
    "hard": 30
}
```

2) Project will raise error if you provide below values in generate question paper api because We don't have enough number of questions in database. otherwise you can provide default values to generate paper.
```dosini
{
    "totalMarks": 500,
    "easy": 100,
    "medium": 0,
    "hard": 0
}
```
