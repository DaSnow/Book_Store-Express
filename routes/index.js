var router = express.Router();

router.get('/', (req, res) => {
  let data = {};
  conn.query('SELECT * FROM books WHERE Available = 1', (error, result) => {
    if (error) {
      console.log("Failed to load books");
      throw error;
    }
    data.books = JSON.stringify(result);
  });
  conn.query('SELECT * FROM books WHERE Available = 0', (error, result) => {
    if (error) {
      console.log("Failed to load rented books");
      throw error;
    }
    data.rented = JSON.stringify(result);
  });
  conn.query('SELECT * FROM customers', (error, result) => {
    if (error) {
      console.log("failed to load customers");
      throw error;
    }
    data.customers = JSON.stringify(result);
    res.render('index.ejs', { system: data });
  });
});

router.post('/add', (req, res) => {
  let bookcmd = 'UPDATE books SET Available = 0 WHERE BookID = ?'
  conn.query(bookcmd, req.body.BookID, (error, result) => {
    if (error) {
      console.log("Book update failed");
      throw error;
    }
  });
  let cmd = 'INSERT INTO rentals SET ?';
  conn.query(cmd, req.body, (error, result) => {
    if (error) {
      console.log("Rental Insert failed");
      throw error;
    }
    res.end();
  });
});

router.put('/update/:id', (req, res) => {
  conn.query('UPDATE rentals SET ? WHERE BookID = ?', [req.body, req.params.id], (error, result) => {
    if (error) {
      console.log("Rental Update failed");
      throw error;
    }
    res.end();
  })
});

router.delete('/delete/:id', (req, res) => {
  conn.query('UPDATE books Set Available = 1 WHERE BookID = ?', req.params.id, (error, result) => {
    if (error) {
      console.log("Available Update failed");
      throw error;
    }
  });
  conn.query('DELETE FROM rentals WHERE BookID = ?', req.params.id, (error, result) => {
    if (error) {
      console.log("Rental Delete failed");
      throw error;
    }
    res.end();
  });
});

module.exports = router;