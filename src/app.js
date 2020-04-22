const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = findRepositoryIndexById(id);

  if (repositoryIndex < 0) {
    response.status(400).send("Repository not found!");
  }

  const oldRepository = repositories[repositoryIndex];

  const repository = {
    id,
    title,
    url,
    techs,
    likes: oldRepository.likes,
  };

  repositories[repositoryIndex] = repository;

  response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = findRepositoryIndexById(id);

  if (repositoryIndex < 0) {
    response.status(400).send("Repository not found!");
  }

  repositories.splice(repositoryIndex);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = findRepositoryIndexById(id);

  if (repositoryIndex < 0) {
    response.status(400).send("Repository not found!");
  }

  const repository = repositories[repositoryIndex];

  repository.likes = repository.likes + 1;

  repositories[repositoryIndex] = repository;

  response.json({ likes: repository.likes });
});

const findRepositoryIndexById = (id) => {
  return repositories.findIndex((repository) => repository.id === id);
};

module.exports = app;
