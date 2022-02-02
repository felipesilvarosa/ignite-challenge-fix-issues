const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
	return response.json(repositories);
});

app.post("/repositories", (request, response) => {
	const { title, url, techs } = request.body;

	const repository = {
		id: uuid(),
		title,
		url,
		techs,
		likes: 0,
	};

	repositories.push(repository);

	return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
	const { id } = request.params;
	const { title, url, techs } = request.body;

	const repositoryFound = repositories.find((repository) => repository.id === id);

	if (repositoryFound) {
		repositoryFound.title = title;
		repositoryFound.url = url;
		repositoryFound.techs = techs;

		return response.json(repositoryFound);
	}

	return response.status(404).json({ error: "Repository not found" });
});

app.delete("/repositories/:id", (request, response) => {
	const id = request.params.id;

	const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

	if (repositoryIndex === -1) {
		return response.status(404).json({ error: "Repository not found" });
	}

	repositories.splice(repositoryIndex, 1);

	return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
	const id = request.params.id;

	const repositoryFound = repositories.find((repository) => repository.id === id);

	if (repositoryFound) {
		repositoryFound.likes++;
		return response.json(repositoryFound);
	}

	return response.status(404).json({ error: "Repository not found" });
});

module.exports = app;
