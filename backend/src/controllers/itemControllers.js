const models = require("../models");

const browse = (req, res) => {
  models.item
    .findAll()
    .then(([rows]) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

// const add = (req, res) => {
//   const namesPlayersAndListOfPoints = req.body;

//     .res.send(namesPlayersAndListOfPoints);
//     .catch((err) => {
//       console.error(err);
//       res.sendStatus(500);
//     });
// };

// const add = (req, res) => {
// const item = req.body;
// console.warn("item", item);
// models.item
// .insert(item)
// .then(([result]) => {
// res.location(`/items/${result.insertId}`).sendStatus(201);
// })
// .catch((err) => {
// console.error(err);
// res.sendStatus(500);
// });
// };

const destroy = (req, res) => {
  models.item
    .delete(req.params.id)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  browse,
  destroy,
};
