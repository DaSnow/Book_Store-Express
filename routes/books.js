var router = express.Router();
const fs = require('fs');
const formidable = require('formidable');
const multiparty = require('multiparty');
const { IncomingForm } = require('formidable');
const conn = require('../data/server');

router.get('/', (req, res) => {
  res.render('books.ejs');
});

router.get('/getAll', (req, res) => {
  conn.query('SELECT * FROM books', (error, result) => {
    if (error) {
      console.log("Failed to load books");
      throw error;
    }
    let data = JSON.stringify(result);
    res.writeHead(200, { 'content-type': 'json' });
    res.write(data);
    res.end();
  });
});

router.post('/add', (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, (error, fields, files) => {
    var oldpath = files.Cover.filepath;
    var newpath = 'public/images/' + files.Cover.originalFilename;
    console.log(newpath);
    fs.copyFile(oldpath, newpath, function (error) {
      if (error) throw error;
    });
  });

  let formData = new multiparty.Form();
  formData.parse(req, (err, fields, files) => {
    var rowData = {
      Title: fields.Title[0],
      Author: fields.Author[0],
      Cover: files.Cover[0].originalFilename,
      Genre: fields.Genre[0]
    };
    console.log(rowData)
    var sqlCmd = 'INSERT INTO books SET ?';
    conn.query(sqlCmd, rowData, (error, result) => {
      if (error) {
        console.log("Book Insert failed");
        throw error;
      } else {
        res.end();
      }
    });
  });
});

router.put('/updateBook/:id', (req, res) => {
  let rowData = {};
  let form = new IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (files.Cover != undefined) {
      fs.unlinkSync(`./public/images/${fields.Pic}`);
      let oldP = files.Cover.filepath;
      let newP = 'public/images/' + files.Cover.originalFilename;
      fs.copyFileSync(oldP, newP);
      console.log(files.Cover)
    }
  });

  let formData = new multiparty.Form();
  formData.parse(req, (err, fields, files) => {
    if (files.Cover === undefined) {
      rowData.Title = fields.Title[0];
      rowData.Author = fields.Author[0];
      rowData.Genre = fields.Genre[0];
    } else {
      rowData.Title = fields.Title[0];
      rowData.Author = fields.Author[0];
      rowData.Genre = fields.Genre[0];
      rowData.Cover = files.Cover[0].originalFilename;
    }
    let cmd = 'UPDATE books SET ? WHERE BookID = ?';
    conn.query(cmd, [rowData, req.params.id], (error, result) => {
      if (error) {
        console.log("Book Update failed");
        throw error;
      }
      res.end();
    });
  });
});

router.delete('/delete/:id/:pic', (req, res) => {
  conn.query('DELETE FROM rentals WHERE BookID = ?', req.params.id, error => {
    if (error) {
      console.log("Rental delete failed");
      throw error;
    }
  });
  fs.unlinkSync(`./public/images/${req.params.pic}`);
  conn.query('DELETE FROM books WHERE BookID = ?', req.params.id, error => {
    if (error) {
      console.log("Book delete failed");
      throw error;
    } else {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end();
    }
  })
});

module.exports = router;