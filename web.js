const express=require("express");
const app=express();
const jquery=require("jquery");
const ejs = require("ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const https=require("https");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const mongoose=require("mongoose");
app.set('view engine', 'ejs');

var carbonFootprint1=0;
var carbonFootprint2=0;                     //variables to store result
var carbonFootprint3=0;
var carbonFootprint4=0;
var carbonFootprintResult=0;
var b=0;
var flag=0;
var a="";
var msg="";
var motorDist=0;
var carsDist=0;
var flightDist=0;
var publicDist=0;
app.use(express.static("public"));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true

}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/usersData");
const DataSchema=new mongoose.Schema({
  username: String,
  password: String
});

DataSchema.plugin(passportLocalMongoose);


const Data=new mongoose.model("Data",DataSchema);


const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(Data.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get("/",function(req,res){
  if(req.isAuthenticated()){
    res.render("home");
  }
  else {
    res.render("starter");
  }

})

app.get("/home",function(req,res){


if(req.isAuthenticated()){
  res.render("home");
}

else{

  res.render("starter");
}



})
app.get("/CarTravel",function(req,res){

console.log(a);
if(req.isAuthenticated()){
  res.render("cars",{title:"Cars",carbon:carbonFootprint1,dist:carsDist});

}



});
app.get("/CarTravelClear",function(req,res){
carbonFootprintResult=carbonFootprintResult-carbonFootprint1;
carbonFootprint1=0;
carsDist=0;
    res.render("cars",{title:"Cars",carbon:0,dist:0});


});
app.get("/FlightClear",function(req,res){

  carbonFootprintResult-=carbonFootprint2;
carbonFootprint2=0;
    res.render("Flight",{title:"Flight",carbon:0,dist:0});
flightDist=0;


});

app.get("/Flight",function(req,res){
                                                                                      //to render respective pages for specified routes
  res.render("Flight",{title:"Flight",carbon:carbonFootprint2,dist:flightDist});

});

app.get("/MotorBike",function(req,res){

  res.render("bike",{title:"MotorBike",carbon:carbonFootprint3,dist:motorDist});

});

app.get("/MotorBikeClear",function(req,res){
  carbonFootprintResult-=carbonFootprint3;

carbonFootprint3=0;
motorDist=0;
  res.render("bike",{title:"MotorBike",carbon:carbonFootprint3,dist:0});
});

app.get("/PublicTransit",function(req,res){


  res.render("public",{title:"Public Transport",carbon:carbonFootprint4,dist:publicDist})

})
app.get("/publicTransitClear",function(req,res){
  carbonFootprintResult-=carbonFootprint4;
  carbonFootprint4=0;
  publicDist=0;
  res.render("public",{title:"Public Transport",carbon:carbonFootprint4,dist:0})
})
app.get("/results",function(req,res){
carbonFootprintResult=  Math.round(carbonFootprintResult * 100) / 100
  res.render("results",{carbon:carbonFootprintResult})
})

app.get("/reduce",function(req,res){
  res.render("reduce");
})

app.get("/register",function(req,res){
res.render("register",{msg:msg});
})
app.get("/login",function(req,res){
res.render("login");
})

app.get("/clear",function(re,res){
  flag=1;
  res.redirect("/home");
})


app.get("/logout",function(req,res){
  req.logout();
  res.render("home");
})

app.post("/login",function(req,res){
  const user=new Data({
    username:req.body.username,
    password:req.body.password
  })
  req.login(user,function(err){
    if(err){
      console.log("err");
    // res.render("register");
    }
    else{

      passport.authenticate("local")(req,res,function(){
      res.redirect("/home");
    });
    }
  })
})

app.post("/register",function(req,res){
  const user2=new Data({
    username:req.body.username,
    password:req.body.password
  });
  Data.register(user2,req.body.password,function(err,user){
    if(err){
    res.render("register",{msg:msg});
    }
    else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/login");
      });
    }
  })
})



app.post("/:a",function(req,response){

 b=req.body.distance;
const z=req.params["a"];
if(z==="CarTravel"){                     //checking the route type to pass it to the API path
     a=req.body.cars;
carsDist=req.body.distance;
}
else if(z==="Flight"){
   a=req.body.vehical;
   flightDist=req.body.distance;
}
else if(z==="PublicTransit"){
  a=req.body.public;
  publicDist=req.body.distance;
}
else{
   a=req.body.bike;
   motorDist=req.body.distance;
}


var type="";
if(z==="CarTravel"){
  type="vehicle";
}                                              //setting type for url
else{
  type="type";
}
const options = {
	"method": "GET",
	"hostname": "carbonfootprint1.p.rapidapi.com",
	"port": null,
	"path": "/CarbonFootprintFrom"+z+"?distance="+b+"&"+type+"="+a,
	"headers": {
		"x-rapidapi-host": "carbonfootprint1.p.rapidapi.com",
		"x-rapidapi-key": "f88e4ac70fmshd3e44f914199d9bp1f3ef8jsn908ce4e4613e",        //should get subscription after 100reqs
		"useQueryString": true
	}
};
console.log(options.path);
const request = https.request(options, function (res) {
	const chunks = [];

	res.on("data", function (chunk) {
		chunks.push(chunk);
	});
                                                                                            //getting data through https(api)
	res.on("end", function () {
		const body = Buffer.concat(chunks);


  const y=["/",z];
  const x=y.join('');                                                     //forming redirecting route
 if(z==="Flight"){

carbonFootprint2=JSON.parse(body).carbonEquivalent;

if(req.body.a==="two"){
  carbonFootprint2=carbonFootprint2*2;

}                                                                          //updating the corresponding result variables
carbonFootprintResult+=carbonFootprint2;
 }
else if(z==="CarTravel"){
  carbonFootprint1=JSON.parse(body).carbonEquivalent;
  carbonFootprintResult+=carbonFootprint1;
}
else if(z==="PublicTransit"){
    carbonFootprint4=JSON.parse(body).carbonEquivalent;
    carbonFootprintResult+=carbonFootprint4;
}
else{
  carbonFootprint3=JSON.parse(body).carbonEquivalent;
  carbonFootprintResult+=carbonFootprint3;
}

  response.redirect(x);                                                     //redirectinig to corresponding routes
	});
});


request.end();

});



app.listen("3000",function(){
  console.log("the server is up and running");
})
