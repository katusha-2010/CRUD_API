import http, { IncomingMessage, ServerResponse } from "http";
import 'dotenv/config';
import { createNewUser, deleteUser, putUser, readUsers, UsersType } from "../users/users";
import { InvalidError, NotFoundError } from "./errors";
import { validate as uuidValidate, validate } from 'uuid';
import { ERR_INVALID_ID, ERR_INVALID_URL, ERR_INVALID_FIELDS, ERR_NOT_FOUND_ID, ERR_INVALID_DATA } from "./constant_error";
import cluster from 'cluster';
import os from 'os';
import { validateUsers } from "../users/validationUsers";

const port = process.env.PORT || 4000;
let allUsersArr: UsersType[] = [];
let result:any;

export const requestListener = async function(request:IncomingMessage, response:ServerResponse){
  const requestArr = request.url!.trim().slice(1).split('/');
  const [api, users, userID, ...other] = requestArr;
  const isUserIdExistInAdress = (`${api}/${users}` === 'api/users' && userID)? true : false;
  const isURLCorrect = `${api}/${users}` === 'api/users' && other.length < 1;

  const bufferArr: Buffer[]= [];
  for await (const chunk of request) {
    bufferArr.push(chunk);
  }

  const dataRequest = bufferArr.length === 0? null : JSON.parse(Buffer.concat(bufferArr).toString());  

  response.setHeader("Content-Type", "application/json");
  response.statusCode = 200;
  
  try {
    if(isURLCorrect === false){ throw new NotFoundError(ERR_INVALID_URL) };
    if(userID && !uuidValidate(userID)) { throw new InvalidError(ERR_INVALID_ID) }

    switch(request.method) {
    case'GET': 
      if (isUserIdExistInAdress) {
        result = await readUsers(userID, allUsersArr)
      } else {
        result = [...allUsersArr]
      };
    break;
    case'POST':     
      validateUsers(dataRequest);
      const resultTotalObj = await createNewUser(isUserIdExistInAdress, dataRequest);
      allUsersArr.push(resultTotalObj);
      result = resultTotalObj;
      response.statusCode = 201;
    break;
    case'PUT':
      validateUsers(dataRequest);
      const resultObjectUpdate = await putUser(userID, allUsersArr, dataRequest);
      allUsersArr = resultObjectUpdate.updatedAllUsersArr;
      result = resultObjectUpdate.updatedUser;   
    break;
    case'DELETE':
      allUsersArr = [...await deleteUser(userID, allUsersArr)];
      response.statusCode = 204;
    break;
    default:
    }
    
  } catch (err:any) {
    // if(err instanceof InvalidError) {
    //   response.statusCode = 400;       
    // } else if(err instanceof NotFoundError) {
    //   response.statusCode = 404;
    // } 
    // else if(err instanceof Error) {
    //   response.statusCode = 500;
    // }
    if(err.message === ERR_INVALID_ID) {
      response.statusCode = 400
    } else if(err.message === ERR_INVALID_URL) {
      response.statusCode = 404
    } else if(err.message === ERR_INVALID_FIELDS) {
      response.statusCode = 400
    } else if(err.message === ERR_NOT_FOUND_ID) {
      response.statusCode = 404
    } else if(err.message === ERR_INVALID_DATA) {
      response.statusCode = 400
    } else {
      response.statusCode = 500;
    }
    result = {message: err.message}   
  }

  response.end(JSON.stringify(result));
};

export const server = http.createServer(requestListener);

export function app(){
  const consoleArgs = process.argv.slice(2);
  const argCluster = consoleArgs.find(el => el.startsWith('--cluster'));  
  if(argCluster) {
    if (cluster.isPrimary) {
      const countCpus = os.cpus().length;
    for(let i = 0; i < countCpus - 1; i++) {
      const worker = cluster.fork({WorkerPort: +port + 1 + i});
      worker.on('exit', () => {console.log(`Worker died PID: ${process.pid}`)})
    }

    cluster.on('exit', () => console.log(`Worker died!`));

    server.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
  })

    } else {
      const workerPort = +process.env.WorkerPort! as number;
      http.createServer().listen(workerPort, ()=>{
      console.log(`Server running at http://localhost:${workerPort}/`);
    });
  }
  } else {
    server.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
    })
  }
}
