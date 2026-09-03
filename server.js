const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

let quests = [
  {
    id: 1,
    title: "Тайна старого особняка",
    genre: "Детектив",
    status: "published",
  },
  {
    id: 2,
    title: "Побег из кибер-тюрьмы",
    genre: "Фантастика",
    status: "draft",
  },
];

const generateId = () =>
  quests.length > 0 ? Math.max(...quests.map((q) => q.id)) + 1 : 1;
app.get("/api/quests", (req, res) => {
  res.status(200).json(quests);
});

app.get("/api/quests/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const quest = quests.find((q) => q.id === id);

  if (!quest) {
    return res.status(404).json({ error: "Квест не найден" });
  }
  res.status(200).json(quest);
});

app.post("/api/quests", (req, res) => {
  const { title, genre, status } = req.body;

  if (!title) {
    return res
      .status(400)
      .json({ error: 'Поле "title" обязательно для заполнения' });
  }

  const newQuest = {
    id: generateId(),
    title: title,
    genre: genre || "Без жанра",
    status: status || "draft",
  };

  quests.push(newQuest);
  res.status(201).json(newQuest);
});

app.put("/api/quests/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, genre, status } = req.body;

  const questIndex = quests.findIndex((q) => q.id === id);

  if (questIndex === -1) {
    return res.status(404).json({ error: "Квест для обновления не найден" });
  }

  quests[questIndex] = {
    ...quests[questIndex],
    title: title || quests[questIndex].title,
    genre: genre || quests[questIndex].genre,
    status: status || quests[questIndex].status,
  };

  res.status(200).json(quests[questIndex]);
});

app.delete("/api/quests/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const questIndex = quests.findIndex((q) => q.id === id);

  if (questIndex === -1) {
    return res.status(404).json({ error: "Квест для удаления не найден" });
  }

  const deletedQuest = quests.splice(questIndex, 1);

  res
    .status(200)
    .json({ message: "Квест успешно удален", deleted: deletedQuest[0] });
});

app.use((err, req, res, next) => {
  console.error("Произошла непредвиденная ошибка:", err.stack);

  res.status(500).json({
    error: "Что-то пошло не так на сервере",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Сервер платформы квестов запущен на http://localhost:${PORT}`);
});
