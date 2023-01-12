import http from "http";
import 'dotenv/config';
import { createNewUser, deleteUser, putUser, readUsers, UsersType } from "../users/users";
import { InvalidError, NotFoundError } from "./errors";
import { validate as uuidValidate } from 'uuid';
import { ERR_INVALID_ID, ERR_INVALID_URL } from "./constant_error";
import cluster from 'cluster';
import os from 'os';

const port = process.env.PORT || 4000;
let allUsersArr: UsersType[] = [];
let result:any;

const requestListener = async function(request:any, response:any){
  const requestArr = request.url.trim().slice(1).split('/');
  const [api, users, userID, ...other] = requestArr;
  const isUserIdExistInAdress = `${api}/${users}` === 'api/users' && userID;
  const isURLCorrect = `${api}/${users}` === 'api/users' && other.length < 1;

  const bufferArr = [];
  for await (const chunk of request) {
    bufferArr.push(chunk);
  } 
  const dataRequest = JSON.parse(Buffer.concat(bufferArr).toString());

  response.setHeader("Content-Type", "application/json");
  response.statusCode = 200;
  
  try {
    if(!isURLCorrect){ throw new NotFoundError(ERR_INVALID_URL) };
    if(userID && !uuidValidate(userID)) { throw new InvalidError(ERR_INVALID_ID) }

    switch(request.method) {
    case'GET': 
      if (isUserIdExistInAdress) {        
        // if(!uuidValidate(userID)) { throw new InvalidError(ERR_INVALID_ID) }
        result = await readUsers(userID, allUsersArr)
      } else {
        result = [...allUsersArr]
      };
    break;
    case'POST': 
      const resultTotalObj = await createNewUser(isUserIdExistInAdress, dataRequest);
      allUsersArr.push(resultTotalObj);
      result = resultTotalObj;
      response.statusCode = 201;
    break;
    case'PUT':
      // if(!uuidValidate(userID)) { throw new InvalidError(ERR_INVALID_ID);}
      const resultObjectUpdate = await putUser(userID, allUsersArr, dataRequest);
      allUsersArr = resultObjectUpdate.updatedAllUsersArr;
      result = resultObjectUpdate.updatedUser;   
    break;
    case'DELETE':      
      // if(!uuidValidate(userID)) { throw new InvalidError(ERR_INVALID_ID);}
      allUsersArr = [...await deleteUser(userID, allUsersArr)];
      response.statusCode = 204;
    break;
    default:
    }
    
  } catch (error:any) {
    if(error instanceof InvalidError) {
      response.statusCode = 400;       
    } else if(error instanceof NotFoundError) {
      response.statusCode = 404;
    } else {
      response.statusCode = 500;
    }
    result = {message: error.message}   
  }

  response.end(JSON.stringify(result));
};

const server = http.createServer(requestListener);

export function app(){
  // if (cluster.isPrimary) {
  //   const countCpus = os.cpus().length;
  //   for(let i = 0; i < countCpus - 1; i++) {
  //     const worker = cluster.fork();
  //     worker.on('exit', () => {console.log(`Worker died PID: ${process.pid}`)})
  //   }
  // } else {
  //   server.listen(port, ()=>{
  //   console.log(`Server running at http://localhost:${port}/`);
  //   });
  // }

    server.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
    })
}
