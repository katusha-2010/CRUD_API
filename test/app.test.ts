import supertest from "supertest";
import { server} from "../src/app/app";

const url = `/api/users`;

const exampleUser = {
  username: "Pete",
  age: 10,
  hobbies: ["swimming"],
};

const gotUser = {
  id: "",
  username: "Pete",
  age: 10,
  hobbies: ["swimming"],
};

describe("Scenariy_1 - test all commands", () => {
  test("should create new user", async () => {   
    const response = await supertest(server).post(url)
    .send(JSON.stringify(exampleUser));
    expect(response.statusCode).toBe(201);
    gotUser.id = response.body.id;      
    expect(response.body).toEqual(gotUser);       
  });

  test("should get the user", async () => {       
    const response = await supertest(server).get(`${url}/${gotUser.id}`)    
    expect(response.statusCode).toBe(200);        
    expect(response.body).toEqual(gotUser);
  });

  test("should get users", async () => {     
    const response = await supertest(server).get(url)    
    expect(response.statusCode).toBe(200);        
    expect(response.body).toEqual([gotUser]);
  });

  test("should update the user", async () => {     
    const response = await supertest(server).put(`${url}/${gotUser.id}`)
    .send(JSON.stringify(gotUser))    
    expect(response.statusCode).toBe(200);        
    expect(response.body).toEqual(gotUser);
  });

  test("should delete the user", async () => {     
    const response = await supertest(server).delete(`${url}/${gotUser.id}`)       
    expect(response.statusCode).toBe(204);
  });

  test("should show the error of non-existing user", async () => {     
    const response = await supertest(server).delete(`${url}/${gotUser.id}`)       
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual("Such user doesn't exist");
  });
  afterAll(() => server.close())
});

describe('Scenario_2 - we print smth incorrect in url', () => {
  test("should return error404", async() => {    
    const response = await supertest(server).get(`/hello`)
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual("Invalid url");
  })

  test("should return error400", async() => {    
    const response = await supertest(server).get(`${url}/111`)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Invalid id in url");
  })

  test("should return error400", async() => {    
    const response = await supertest(server).get(`${url}/20354d7a-e4fe-47af-8ff6-187bca92f3f9`)
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual("Such user doesn't exist");
  })
  afterAll(() => server.close())
})

describe('Scenario_3-check validation of request input', () => {
  test("first create correct user", async () => {   
    const response = await supertest(server).post(url)
    .send(JSON.stringify(exampleUser));
    expect(response.statusCode).toBe(201);       
  });

  test("should create new user with incorrect type of age", async () => {
    const incorrectUser =  Object.assign(exampleUser, {age:'15'})   
    const response = await supertest(server).post(url)
    .send(JSON.stringify(incorrectUser));
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Invalid data");      
  });

  test("should create new user with incorrect type of username", async () => {
    const incorrectUser =  Object.assign(exampleUser, {username: 15})   
    const response = await supertest(server).post(url)
    .send(JSON.stringify(incorrectUser));
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Invalid data");      
  });

  test("should create new user with incorrect hobbies -not Array", async () => {
    const incorrectUser =  Object.assign(exampleUser, {hobbies: 'swim'})   
    const response = await supertest(server).post(url)
    .send(JSON.stringify(incorrectUser));
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Invalid data");      
  });

  test("should create new user with incorrect type of hobbies", async () => {
    const incorrectUser =  Object.assign(exampleUser, {hobbies: [15, 16]})   
    const response = await supertest(server).post(url)
    .send(JSON.stringify(incorrectUser));
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Invalid data");      
  });

  test("should update user with incorrect type of age", async () => {
    const incorrectUser =  Object.assign(exampleUser, {age:'15'});   
    const response = await supertest(server).put(`${url}/${gotUser.id}`)
    .send(JSON.stringify(incorrectUser));
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Invalid data");      
  });

  test("should update user with incorrect type of username", async () => {
    const incorrectUser =  Object.assign(exampleUser, {username: 15})   
    const response = await supertest(server).put(url)
    .send(JSON.stringify(incorrectUser));
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Invalid data");      
  });

  test("should update user with incorrect hobbies -not Array", async () => {
    const incorrectUser =  Object.assign(exampleUser, {hobbies: 'swim'})   
    const response = await supertest(server).put(url)
    .send(JSON.stringify(incorrectUser));
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Invalid data");      
  });

  test("should update user with incorrect type of hobbies", async () => {
    const incorrectUser =  Object.assign(exampleUser, {hobbies: [15, 16]})   
    const response = await supertest(server).put(url)
    .send(JSON.stringify(incorrectUser));
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Invalid data");      
  });
  afterAll(() => server.close())
})
