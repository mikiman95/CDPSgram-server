var fs = require('fs');
var photo_model = require('./../models/photo');
var mongodb = require("mongodb"); //PARA BBDD


// Devuelve una lista de las imagenes disponibles y sus metadatos
exports.list = function (req, res) {
	//var photos = photo_model.photos;        
	//res.render('photos/index', {photos: photos});

	
	var MongoClient =mongodb.MongoClient;
	var url = "mongodb://localhost:27017/serverDB";
	MongoClient.connect(url,function(err,db){
		if(err){
			console.log("unable to conect to the mongodb server",err);
		}else{
			console.log("connection established with mongo server");
			var collection = db.collection ("photos");
			
			//{} es Todo everything
			collection.find({}).toArray(function(err,result){

				if(err){
					//not conected
					res.send(err); //sacar mensaje por pantalla
				}
				else if (result.length){
					res.render('photos/index',{
						photos:result
					});
				}
				else{
					//conected but empty
					//res.send("No documents found in BBDD");
					res.send("result: "+ result);

				}

				db.close();

			});
		}
	})

};

// Devuelve la vista del formulario para subir una nueva foto
exports.new = function (req, res) {
	res.render('photos/new');
};

// Devuelve la vista de visualización de una foto.
// El campo photo.url contiene la url donde se encuentra el fichero de audio
exports.show = function (req, res) {
	//var photo = photo_model.photos[req.params.photoId];
	//photo.id = req.params.photoId;
	//res.render('photos/show', {photo: photo});



	var MongoClient =mongodb.MongoClient;
	var url = "mongodb://localhost:27017/serverDB";
	MongoClient.connect(url,function(err,db){
		if(err){
			console.log("unable to conect to the mongodb server",err);
		}else{
			console.log("connection established with mongo server");
			var collection = db.collection ("photos");
			
			//{} es Todo everything
			collection.find({}).toArray(function(err,result){

				if(err){
					//not conected
					res.send(err); //sacar mensaje por pantalla
				}
				else if (result.length){
					var photo = result[req.params.photoId];
						photo.id = req.params.photoId;
						res.render('photos/show', {photo: photo});

				}
				else{
					//conected but empty
					res.send("No documents found in BBDD");
				}

				db.close();

			});
		}
	})



};

// Escribe una nueva foto en el registro de imagenes.
exports.create = function (req, res) {
	var photo = req.files.photo;
	console.log('Nuevo fichero: ', req.body);
	var name = req.body.name;
	var url = req.body.url;
	var id = Math.random().toString(36).substr(2, 10);
	
	// Escribe los metadatos de la nueva foto en el registro.
	/*
	photo_model.photos[id] = {
		name: name,
		url: url
	};
	*/
	//res.redirect('/photos');


	var MongoClient = mongodb.MongoClient;
	var urlMongo = "mongodb://localhost:27017/serverDB";
	MongoClient.connect(urlMongo,function(err,db){
		if(err){
			console.log("Unable to connect to mongodb",err);
		}else{
			console.log("connected to mongodb");
			var collection = db.collection("photos");

			var newPhoto = {
					name: name,
					url: url
				};

			collection.insert([newPhoto],function(err,result){
				if(err){
					console.log(err);
				}else{
					res.redirect('/photos');
				}


				db.close();
			});
		}
	});

};

// Borra una foto (photoId) del registro de imagenes 
exports.destroy = function (req, res) {
	var photoId = req.params.photoId;

	// Aquí debe implementarse el borrado del fichero de audio indetificado por photoId en photos.cdpsfy.es

	// Borra la entrada del registro de datos
	delete photo_model.photos[photoId];
	res.redirect('/photos');
};
