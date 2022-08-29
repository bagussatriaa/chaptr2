const express = require('express');
const database = require('./connections/database');
const dayjs = require('dayjs');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
const upload = require('./middleware/fileUpl');
const app = express();

app.use(
  session({
    secret: 'wEver',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.set('view engine', 'hbs');
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
port = 300;

database.connect((err, client, done) => {
  if (err) throw err;

  app.get('/', (req, res) => {
    // console.log(req.session.user);
    let query = `SELECT tb_projects.id, project_name, start_date, end_date, "desc", tech, image, author_id, name
    FROM tb_projects LEFT JOIN tb_user ON tb_projects.author_id = tb_user.id ORDER BY id DESC;`;
    client.query(query, (err, result) => {
      if (err) throw err;
      data = result.rows;
      // console.log(data);
      // console.log(data);
      // console.log(data.start_date);
      let cardData = data.map((items) => {
        return {
          ...items,
          duration: getDuration(items.start_date, items.end_date),
          login: req.session.login,
        };
      });

      let filterCard;
      if (req.session.user) {
        filterCard = cardData.filter((items) => {
          return items.author_id === req.session.user.id;
        });
      }
      let resultCard = req.session.user ? filterCard : cardData;
      // console.log(cardData);
      res.render('index', { cardData: resultCard, user: req.session.user, login: req.session.login });
    });
  });

  app.get('/add-project', (req, res) => {
    if (!req.session.user) {
      req.flash('notLogin', 'Login First');
      return res.redirect('login');
    }
    res.render('project');
  });

  app.post('/add-project', upload.single('image'), (req, res) => {
    let data = req.body;
    // console.log(data.projectName);
    let image = req.file.filename;
    let icons = {
      node: data.node,
      python: data.python,
      laravel: data.laravel,
      js: data.js,
    };
    let userId = req.session.user.id;
    let query = `INSERT INTO tb_projects(project_name, start_date, end_date, "desc", image, tech, author_id) 
    VALUES ('${data.project_name}', '${data.start_date}', '${data.end_date}', '${data.desc}', '${image}', '{"${icons.node}","${icons.python}","${icons.laravel}","${icons.js}"}', ${userId});`;
    // console.log(data);
    client.query(query, (err, result) => {
      if (err) throw err;
    });
    res.redirect('/');
  });

  app.get('/update/:id', (req, res) => {
    let id = req.params.id;
    if (!req.session.user) {
      req.flash('notLogin', 'Login First');
      return res.redirect('login');
    }
    let query = `SELECT * FROM tb_projects WHERE id = '${id}'`;

    client.query(query, (err, result) => {
      if (err) throw err;
      let data = result.rows;
      let sd_beforeFormat = dayjs(data[0].start_date);
      let ed_beforeFormat = dayjs(data[0].end_date);

      let sd_afterFormat = sd_beforeFormat.format('YYYY-MM-DD');
      let ed_afterFormat = ed_beforeFormat.format('YYYY-MM-DD');
      let editData = data.map((items) => {
        return {
          ...items,
          sd_afterFormat,
          ed_afterFormat,
        };
      });

      // console.log(editData[0]);

      res.render('edit-project', { id, data: editData[0] });
    });
  });

  app.post('/update/:id', upload.single('image'), (req, res) => {
    let id = req.params.id;
    let image = req.file.filename;
    let dataUpdate = req.body;
    console.log(dataUpdate);
    let iconsUpdate = {
      node: dataUpdate.node,
      python: dataUpdate.python,
      laravel: dataUpdate.laravel,
      js: dataUpdate.js,
    };
    console.log(iconsUpdate);

    let query = `UPDATE public.tb_projects SET project_name='${dataUpdate.project_name}', start_date='${dataUpdate.startDate},',
    end_date='${dataUpdate.endDate}', "desc"='${dataUpdate.desc}', image ='${image}', tech= '{"${iconsUpdate.node}","${iconsUpdate.python}","${iconsUpdate.laravel}","${iconsUpdate.js}"}' WHERE id= '${id}'`;

    client.query(query, (err, result) => {
      if (err) throw err;
      console.log(result);
      console.log(image);
      res.redirect('/');
    });
  });

  app.get('/contact', (req, res) => {
    res.render('contact');
  });

  app.get('/detail/:id', (req, res) => {
    let id = req.params.id;
    // console.log(id);
    let query = `SELECT * FROM tb_projects WHERE id =${id}`;
    // console.log(req.file.filename);
    client.query(query, (err, result) => {
      if (err) throw err;

      data = result.rows;
      let sd_beforeFormat = dayjs(data[0].start_date);
      let ed_beforeFormat = dayjs(data[0].end_date);
      let sd_afterFormat = sd_beforeFormat.format('YYYY-MM-DD');
      let ed_afterFormat = ed_beforeFormat.format('YYYY-MM-DD');
      // console.log(data);
      let detail = data.map((items) => {
        return {
          ...items,
          duration: getDuration(items.start_date, items.end_date),
          startDate: new Date(items.start_date),
          endDate: new Date(items.end_date),
          sd_afterFormat,
          ed_afterFormat,
          node: items.tech[0],
          python: items.tech[1],
          laravel: items.tech[2],
          js: items.tech[3],
          // image,
        };
      });
      console.log(detail[0]);
      res.render('detail', { data: detail[0] });
    });
  });

  app.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    if (!req.session.user) {
      req.flash('notLogin', 'Login First');
      return res.redirect('login');
    }
    console.log(id);
    let query = `DELETE FROM tb_projects WHERE id= ${id}`;
    client.query(query, (err, result) => {
      if (err) throw err;
      res.redirect('/');
    });
  });

  app.get('/register', (req, res) => {
    res.render('register');
  });

  app.post('/register', (req, res) => {
    let { userName, userEmail, userPw } = req.body;

    let hashedPw = bcrypt.hashSync(userPw, 10);
    let query = `INSERT INTO public.tb_user( name, email, password) VALUES ( '${userName}', '${userEmail}','${hashedPw}');`;

    client.query(query, (err, result) => {
      if (err) throw err;
      res.redirect('/login');
    });
  });

  app.get('/login', (req, res) => {
    res.render('login');
  });

  app.post('/login', (req, res) => {
    let { userEmail, userPw } = req.body;

    let query = `SELECT * FROM tb_user WHERE email = '${userEmail}'`;

    client.query(query, (err, result) => {
      if (err) throw err;
      // console.log(result.rows[0].password);
      if (result.rows.length === 0) {
        req.flash('failed', 'Email has not registered yet');
        return res.redirect('login');
      }

      const matching = bcrypt.compareSync(userPw, result.rows[0].password);
      console.log(matching);
      if (matching) {
        req.session.login = true;
        req.session.user = {
          id: result.rows[0].id,
          name: result.rows[0].name,
          email: result.rows[0].email,
        };
        req.flash('success', 'Login Success');
        res.redirect('/');
      } else {
        req.flash('pwFailed', 'Wrong Password');
        res.redirect('login');
      }
    });
  });

  app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function getDuration(startDate, endDate) {
  let result;
  start = new Date(startDate);
  end = new Date(endDate);

  if (start < end) {
    result = end - start;
  } else {
    start - end;
  }

  const msecond = 1000;
  const secInHours = 3600;
  const hoursInDay = 24;
  const dayInMonth = 30;
  const monthInYears = 12;

  let distanceInDays = Math.floor(result / (msecond * secInHours * hoursInDay));
  let distanceInMonth = Math.floor(result / (msecond * secInHours * hoursInDay * dayInMonth));
  let distanceInYears = Math.floor(result / (msecond * secInHours * hoursInDay * dayInMonth * monthInYears));
  if (distanceInDays == 1) {
    return `${distanceInDays} Day`;
  } else if (distanceInYears == 1) {
    return `${distanceInYears} Year`;
  } else if (distanceInYears > 1) {
    return `${distanceInYears} Years`;
  } else if (distanceInDays >= 30) {
    return `${distanceInMonth} Month `;
  } else if (distanceInDays > 1) {
    return `${distanceInDays} Days`;
  }
}
