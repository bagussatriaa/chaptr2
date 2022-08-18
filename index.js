const express = require('express');

const app = express();
app.set('view engine', 'hbs');
app.use('/assets', express.static(__dirname + '/assets'));
// app.use(express.urlencoded({ extended: false }));

port = 300;

app.get('/', (req, resp) => {
  resp.render('index');
});

app.get('/add-project', (req, resp) => {
  resp.render('project');
});

app.get('/contact', (req, resp) => {
  resp.render('contact');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
