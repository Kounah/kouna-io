const {User, Document} = require('../db');
const {dir, config} = require('../context')
const {def} = require('../fn')

module.exports = function(app, passport, edge) {

  app.get('/docs/list', (req, res) => {
    let query = {};
    let sort = {title: 1};

    if(req.query != undefined) {
      if(req.query.title != undefined)
        query.title = req.query.title;
      if(req.query.type != undefined)
        query.type = req.query.type;
      if(req.query.creator != undefined)
        query.creator = req.query.creator;
      if(req.query.sort != undefined)
        sort = JSON.parse(req.query.sort);
    }

    query.public = true;

    Document.count(query, (err, count) => {
      var page = {};
      page.cur = req.query.page | 0;
      if(count > config.docs.itemsPerPage) {
        page.max = count / Math.ceil(count / itemsPerPage);
      }
      Document.find(query).skip(config.docs.itemsPerPage * page.cur).limit(config.docs.itemsPerPage).exec(function(err, docs) {
        if(err) {
          res.redirect('/docs/list');
          throw(err);
        }

        res.send(edge.render('page.docs', def({docs: docs, count: count, page: page, context: req, types: config.docs.types, colors: config.docs.colors})));
      });
    })

  })

  app.get('/docs/mydocs', (req, res) => {
    if(req.isAuthenticated()) {
      let query = {
        creator: req.user._id
      };
      let sort = {title: 1};

      if(req.query != undefined) {
        if(req.query.title != undefined)
        query.title = req.query.title
        if(req.query.type != undefined)
        query.type = req.query.type
        if(req.query.sort != undefined)
        sort = JSON.parse(req.query.sort)
      }

      Document.count(query, (err, count) => {
        var page = {};
        page.cur = req.query.page | 0;
        if(count > config.docs.itemsPerPage) {
          page.max = count / Math.floor(count / itemsPerPage);
        }
        Document.find(query).skip(config.docs.itemsPerPage * page.cur).limit(config.docs.itemsPerPage).exec(function(err, docs) {
          if(err) {
            res.redirect('/docs/list');
            throw(err);
          }

          res.send(edge.render('page.docs.mydocs', def({docs: docs, count: count, page: page, context: req, types: config.docs.types, colors: config.docs.colors})));
        });
      })
    } else { res.redirect('/docs/list') }
  })

  app.post('/docs/edit/:docId/settings', (req, res) => {
    if(req.isAuthenticated()) {
      Document.findById(req.params.docId, (err, doc) => {
        if(doc.creator == req.user._id) {
          doc.title = req.body.title;
          doc.topic = req.body.topic;
          doc.description = req.body.description;
          doc.public = req.body.public == 'on';
          doc.color = req.body.color;
          doc.type = req.body.type;
          doc.modified = new Date();

          doc.save(function(err) {
            if(err) {
              console.log(err)
              res.send(err)
              return;
            }
            res.redirect('/docs/edit/' + doc._id);
          })
        }
      });
    } else { res.redirect('/docs/list') }
  })

  app.get('/docs/preview/:docId', (req, res) => {
    res.send(fs.readFileSync(path.join(dir, 'static', 'img', 'coming-soon.png')))
  });


  app.get('/docs/edit/:docid', (req, res) => {
    if(req.isAuthenticated()) {
      Document.findById(req.params.docid, (err, doc) => {
        if(err) {
          res.redirect('/docs/list')
        }

        res.send(edge.render('page.docs.edit', def({
          context: req,
          doc: doc,
          types: config.docs.types,
          colors: config.docs.colors,
          isCreator: doc.creator == req.user._id,
          isEditor: doc.editors.includes(req.user._id)
        })))
      })
    } else {
      res.redirect('/docs/list')
    }
  });

  app.post('/docs', (req, res) => {
    if(req.isAuthenticated()) {
      let newDoc = new Document();

      console.log(req.user._id);

      newDoc.title          = req.body.title;
      newDoc.topic          = req.body.topic;
      newDoc.description    = req.body.description;
      newDoc.type           = req.body.type;
      newDoc.color          = req.body.color;
      newDoc.creator        = req.user._id;
      newDoc.created        = new Date();

      newDoc.save(function(err) {
        if (err) {
          console.log(err);
          throw err;
          res.send(err);
        }
        res.redirect(`/docs/list?title=${newDoc.title}`)
      })

    } else {
      res.redirect('/docs/list')
    }
  })
}
