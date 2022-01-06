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
var _id="";
var cd=0,cf=0,ff=0,fd=0,md=0,mf=0,pd=0,pf=0;
// var md=0;

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
  password: String,
  Car:{
    carType:String,
    distance:Number,
    footprint:Number
  },
  Flight:{
    flightType:String,
    distance:Number,
    footprint:Number
  },
  Public:{
    vehicleType:String,
    distance:Number,
    footprint:Number
  },
  Motor:{
    motorType:String,
    distance:String,
    footprint:Number
  },
  Result:{
    total:Number
  }
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

entry=req.body.entry;
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
  Data.findOne({_id:_id}, function (err, user) {

    cd=user.Car.distance;
    cf=user.Car.footprint;


  res.render("cars",{title:"Cars",carbon:cf,dist:cd});
  });

}
else{
  res.render("starter");
}



});
app.get("/CarTravelClear",function(req,res){
carbonFootprintResult=carbonFootprintResult-carbonFootprint1;
carbonFootprint1=0;
carsDist=0;
const motor1={
  carType:"",
  distance:carsDist,
  footprint:carbonFootprint1
}


Data.findByIdAndUpdate(_id, { $set: { Car: motor1 }}, function(err){
  if(err){
    console.log(err);
  }

})
    res.render("cars",{title:"Cars",carbon:0,dist:0});


});


app.get("/Flight",function(req,res){
  if(req.isAuthenticated()){
    Data.findOne({_id:_id}, function (err, user) {

      fd=user.Flight.distance;
      ff=user.Flight.footprint;

        res.render("Flight",{title:"Flight",carbon:ff,dist:fd});
    });
  }
  else{
    res.render("starter");
  }                                                                                  //to render respective pages for specified routes

});

app.get("/FlightClear",function(req,res){

  carbonFootprintResult-=carbonFootprint2;
carbonFootprint2=0;
flightDist=0;
const motor1={
  flightType:"",
  distance:flightDist,
  footprint:carbonFootprint2
}


Data.findByIdAndUpdate(_id, { $set: { Flight: motor1 }}, function(err){
  if(err){
    console.log(err);
  }

})
    res.render("Flight",{title:"Flight",carbon:0,dist:0});



});

app.get("/MotorBike",function(req,res){

  if(req.isAuthenticated()){
  Data.findOne({_id:_id}, function (err, user) {
console.log(user.Motor.distance);
    md=user.Motor.distance;
    mf=user.Motor.footprint;

      res.render("bike",{title:"MotorBike",carbon:mf,dist:md});
  });


  }
  else{
    res.render("starter");
  }                                                                                  //to render respective pages for specified routes


});

app.get("/MotorBikeClear",function(req,res){
  carbonFootprintResult-=carbonFootprint3;

carbonFootprint3=0;
motorDist=0;
const motor1={
  motorType:"",
  distance:motorDist,
  footprint:carbonFootprint3
}


Data.findByIdAndUpdate(_id, { $set: { Motor: motor1 }}, function(err){
  if(err){
    console.log(err);
  }

})
res.render("bike",{title:"MotorBike",carbon:carbonFootprint3,dist:0});

});


app.get("/PublicTransit",function(req,res){

  if(req.isAuthenticated()){
    Data.findOne({_id:_id}, function (err, user) {

      pd=user.Public.distance;
      pf=user.Public.footprint;

    res.render("public",{title:"Public Transport",carbon:pf,dist:pd})
    });
  }
  else{
    res.render("starter");
  }                                                                                  //to render respective pages for specified routes


})
app.get("/publicTransitClear",function(req,res){
  carbonFootprintResult-=carbonFootprint4;
  carbonFootprint4=0;
  publicDist=0;
  const motor1={
    vehicleType:"",
    distance:publicDist,
    footprint:carbonFootprint4
  }


  Data.findByIdAndUpdate(_id, { $set: { Public: motor1 }}, function(err){
    if(err){
      console.log(err);
    }

  })
  res.render("public",{title:"Public Transport",carbon:carbonFootprint4,dist:0})
})


app.get("/results",function(req,res){
  console.log(carbonFootprintResult);
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
res.render("login",{msg:" "});
})

app.get("/clear",function(re,res){
  flag=1;
  res.redirect("/home");
})

app.get("/logout", function (req, res){
  req.session.destroy(function (err) {
    res.render("starter"); //Inside a callback… bulletproof!
  });
});


app.post("/login",function(req,res){

  const user=new Data({
    username:req.body.username,

  })

  passport.authenticate('local', function(err, user, info) {
   if (err) { return next(err); }
   if (!user) { res.render("login",{msg:"User doesn't exist."});
    }
   req.logIn(user, function(err) {
     if (err) { return (err); }
     _id=user._id;
     return res.redirect("/home");
   });
 })(req, res);
})

app.post("/register",function(req,res){

  const user2=new Data({
    username:req.body.username,

  });
  Data.register(user2,req.body.password,function(err,user){
    if(err){
    res.render("register",{msg:"user already found"});
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
		"x-rapidapi-key": "31e39c86e9mshb674da02ecd39e8p1a4fd8jsn3061fdfac797",        //should get subscription after 100reqs
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

}
const flight={
  flightType:a,
  distance:flightDist,
  footprint:carbonFootprint2

}
carbonFootprintResult+=carbonFootprint2;
Data.findByIdAndUpdate(_id, { $set: {Flight: flight }}, options, function(err){
  if(err){
    console.log(err);
  }
})
                                                                   //updating the corresponding result variables

 }
else if(z==="CarTravel"){
  carbonFootprint1=JSON.parse(body).carbonEquivalent;
  carbonFootprintResult+=carbonFootprint1;

  const car={
    carType:a,
    distance:carsDist,
    footprint:carbonFootprint1
  }
  Data.findByIdAndUpdate(_id, { $set: { Car: car }}, options, function(err){
    if(err){
      console.log(err);
    }
  })

}
else if(z==="PublicTransit"){
    carbonFootprint4=JSON.parse(body).carbonEquivalent;
    carbonFootprintResult+=carbonFootprint4;
    const public={
      vehicleType:a,
      distance:publicDist,
      footprint:carbonFootprint4
    }
    Data.findByIdAndUpdate(_id, { $set: { Public: public }}, options, function(err){
      if(err){
        console.log(err);
      }
    })
}
else{
  carbonFootprint3=JSON.parse(body).carbonEquivalent;
  carbonFootprintResult+=carbonFootprint3;
  const motor={
    motorType:a,
    distance:motorDist,
    footprint:carbonFootprint3
  }
  Data.findByIdAndUpdate(_id, { $set: { Motor: motor }}, options, function(err){
    if(err){
      console.log(err);
    }
  })

}
const result={
total:carbonFootprintResult
}
Data.findByIdAndUpdate(_id, { $set: { Result:result }}, options, function(err){
  if(err){
    console.log(err);
  }
})

  response.redirect(x);                                                     //redirectinig to corresponding routes
	});
});


request.end();

});



app.listen("3000",function(){
  console.log("the server is up and running");
})
