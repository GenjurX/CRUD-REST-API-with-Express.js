import database from "./database.js"; 
import express from "express";
import methodOverride from "method-override";

const app = express();
app.use(express.json());
app.use(methodOverride("_method"))  

app.post("/trip", async (request, response) => {
  const trip = request.body;
  const insert = await database.raw(`insert into trips (date, vacation) values ('${trip.date}','${trip.vacation}')`);
  const id = insert.lastInsertRowid;
  const result =  await database.raw(`select * from trips where id= ${id}`);
  response.status(200);
  response.json(result);
});

app.get("/trip/:id", async (request, response) => {
  const id = Number(request.params.id);
  const result = await database.raw(`select * from trips where id=${id}`)
    response.status(200);
    response.json(result);
  
});

app.get("/trip", async (request, response) => {
  const result = await database.raw(`select * from trips`);

  response.status(200);
  response.json(result);
});

app.put("/trip/:id", async (request, response) => {
  const id = Number(request.params.id);
  const {date, vacation} = request.body;
  await database.raw(`update trips set date = '${date}', vacation = '${vacation}' where id =${id} `);
  response.status(200)
  response.json(`User modified with ID: ${id}`)
});

app.delete("/trip/:id", async (request, response) => {
  const id = Number(request.params.id);
  await database.raw(`delete from trips where id=${id}`);
  const result =  await database.raw(`select * from trips`);

  response.status(200);
  response.json(result);
});


app.all("/*", async (request, response) => {
  response.status(404);
  response.json({ error: "This route does not exist" });
});

const hostname = "localhost";
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server listening on http://${hostname}:${port}`);
});
