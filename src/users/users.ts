import { v4 as uuidv4 } from 'uuid';
import { ERR_INVALID_FIELDS, ERR_INVALID_URL, ERR_NOT_FOUND_ID } from '../app/constant_error';
import { InvalidError, NotFoundError } from '../app/errors';
import { validateUsers } from './validationUsers';

export type UsersType = {
  id?:string,
  username:string,
  age:number,
  hobbies:String[] | []
}

function isExistAllFieldsForCreateUser(requestData:UsersType){
  const fieldsNewUser = ['username', 'age', 'hobbies'];
  for(let field of fieldsNewUser) {
    if(!requestData.hasOwnProperty(field)){
      return false;
    }
  }
  return true;
}

export async function createNewUser(isUserIdExistInAdress:Boolean, requestData:UsersType) {
  try {
    if(isUserIdExistInAdress){
      throw new NotFoundError(ERR_INVALID_URL);
    } 
    if(!isExistAllFieldsForCreateUser(requestData)){
      throw new InvalidError(ERR_INVALID_FIELDS);
    }
    const newID = uuidv4();
    return Object.assign({id: newID}, requestData);    
  } catch (error:any) {
    throw new InvalidError(`${error.message}`)   
  }    
}

export async function readUsers(requestID:string, allUsersArr:UsersType[]) {
  try {
    const searchUserById = allUsersArr.filter((el) => el.id! === requestID);
    if(searchUserById.length === 1) {
      return Object.assign({},...searchUserById);
    } else {
      throw new Error('');
    }  
  } catch (error:any) {
    throw new NotFoundError(ERR_NOT_FOUND_ID)   
  }    
}

export async function deleteUser(requestID:string, allUsersArr:UsersType[]) {
  try {
    const searchUserById = allUsersArr.filter((el) => el.id! === requestID);    
    if(searchUserById.length === 1) {
      const userObject = Object.assign({},...searchUserById);
      return allUsersArr.filter((el) => el.id !== userObject.id);
    } else {
      throw new Error('');
    }       
  } catch (error:any) {
    throw new NotFoundError(ERR_NOT_FOUND_ID)   
  }    
}

export async function putUser(requestID:string, allUsersArr:UsersType[], requestData:UsersType) {
  try {
    const searchUserById = allUsersArr.filter((el) => el.id! === requestID);    
    if(searchUserById.length === 1) {
      const userObject = Object.assign({},...searchUserById);
      const userID =  userObject.id;
      const updatedAllUsersArr = allUsersArr.map(el => el.id === requestID? Object.assign(el, requestData) : el);
      const updatedUser = updatedAllUsersArr.find(el => el.id === requestID)
      return {updatedAllUsersArr, updatedUser}      
    } else {
      throw new Error('');
    }       
  } catch (error:any) {
    throw new NotFoundError(ERR_NOT_FOUND_ID)   
  }    
}
