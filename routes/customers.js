var router = express.Router();

router.get('/', (req, res) => {
  res.render('customers.ejs');
});

router.get('/getAll', (req, res) => {
  conn.query('SELECT * FROM customers', (error, result) => {
    if (error) {
      console.log("Failed to load customers");
      throw error;
    }
    let data = JSON.stringify(result);
    res.writeHead(200, { 'content-type': 'json' });
    res.write(data);
    res.end();
  });
});

router.post('/add', (req, res) => {
  let cmd = 'INSERT INTO customers SET ?';
  conn.query(cmd, req.body, error => {
    if (error) {
      console.log("Insert failed");
      throw error;
    }
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end();
  });
});

router.put('/update/:id', (req, res) => {
  let cmd = 'UPDATE customers SET ? WHERE CustomerID = ?';
  conn.query(cmd, [req.body, req.params.id], error => {
    if (error) {
      console.log("Customer update failed");
      throw error;
    }
    res.end();
  });
});

router.delete('/delete/:id', (req, res) => {
  let booksID;
  conn.query('SELECT BookID FROM rentals WHERE CustomerID = ?', req.params.id, (error, result) => {
    if (error) {
      console.log("Failed to load rentals");
      throw error;
    }
    booksID = result;
  });
  conn.query('UPDATE books SET Available = 1 WHERE BookID = ?', [booksID], error => {
    if (error) {
      console.log("Failed to update books");
      throw error;
    }
  });
  conn.query('DELETE FROM rentals WHERE CustomerID = ?', req.params.id, error => {
    if (error) {
      console.log("Rental delete failed");
      throw error;
    }
  });
  conn.query('DELETE FROM customers WHERE CustomerID = ?', req.params.id, error => {
    if (error) {
      console.log("Customer delete failed");
      throw error;
    }
    res.end();
  });
});

module.exports = router;