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
var carbonFootprint11=0;
var carbonFootprintResult1=0;
var b=0;
var flag=0;
var a="";
var msg="";
var msgb="";
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
const MotorSchema=new mongoose.Schema({
name:String,
footprint:Number

});
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
    distance:Number,
    footprint:Number
  },
  Car1:{
    carType:String,
    distance:Number,
    footprint:Number
  },
  Flight1:{
    flightType:String,
    distance:Number,
    footprint:Number
  },
  Public1:{
    vehicleType:String,
    distance:Number,
    footprint:Number
  },
  Motor1:{
    motorType:String,
    distance:Number,
    footprint:Number
  },
  Result:{
    total:Number
  },
  Result1:{
    total:Number
  },
    entry:String
});

DataSchema.plugin(passportLocalMongoose);
MotorSchema.plugin(passportLocalMongoose);

const Data=new mongoose.model("Data",DataSchema);



const MotorData=new mongoose.model("MotorData",MotorSchema);


const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(Data.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});



app.get("/PieChart",function(req,res){
  res.render("PieChart");
})

app.get("/",function(req,res){
  if(req.isAuthenticated()){
    Data.findOne({_id:_id},function(err,user){
        res.render("home",{sel:user.entry});
    })

  }
  else {
    res.render("starter");
  }

})

app.post("/entry",function(req,res){

var  entry=req.body.entry;
  console.log(entry);
  Data.findByIdAndUpdate(_id, { $set: { entry:entry }}, function(err){
    if(err){
      console.log(err);
    }
  })

  res.redirect("/CarTravel");
})

app.get("/home",function(req,res){


if(req.isAuthenticated()){
  Data.findOne({_id:_id},function(err,user){
      res.render("home",{sel:user.entry});
  })

}

else{

  res.render("starter");
}

})
app.get("/next",function(req,res){
  res.render("next");
})

app.get("/CarTravel",function(req,res){

if(req.isAuthenticated()){

  Data.findOne({_id:_id}, function (err, user) {
    if(user.entry==="entry1"){
    cd=user.Car.distance;
    cf=user.Car.footprint;
    var ct=user.Car.carType;
    console.log(user.Car.carType);
    }
    else{
    cd=user.Car1.distance;
    cf=user.Car1.footprint;
    var ct=user.Car1.carType;
}
if(cf>=20){
  var statement="I’m like 97% of scientist myself, and I can’t deny … it’s getting hot in here.";
}
  res.render("cars",{title:"Cars",carbon:cf,dist:cd,sel:ct,pie:cf,statement:statement});

  });
}



else{
  res.render("starter");
}


});

app.get("/CarTravelClear",function(req,res){

  const motor1={
    carType:"",
    distance:0,
    footprint:0
  }
    Data.findOne({_id:_id}, function (err, user) {
  if(user.entry==="entry1"){
      carbonFootprintResult=carbonFootprintResult-carbonFootprint1;
      if(carbonFootprintResult<0){
        carbonFootprintResult=0;
      }
      const result={
      total:carbonFootprintResult
      }
      Data.findByIdAndUpdate(_id, { $set: { Result:result }}, function(err){
        if(err){
          console.log(err);
        }
      })
      Data.findByIdAndUpdate(_id, { $set: { Car: motor1 }}, function(err){
        if(err){
          console.log(err);
        }

      })

    }
    else{
      carbonFootprintResult1=carbonFootprintResult1-carbonFootprint11;
      if(carbonFootprintResult1<0){
        carbonFootprintResult1=0;
      }
      const result={
      total:carbonFootprintResult1
      }
      Data.findByIdAndUpdate(_id, { $set: { Result1:result }}, function(err){
        if(err){
          console.log(err);
        }
      })
      Data.findByIdAndUpdate(_id, { $set: { Car1: motor1 }}, function(err){
        if(err){
          console.log(err);
        }

      })
    }
  })





    res.render("cars",{title:"Cars",carbon:0,dist:0,sel:"--Please choose an option--",pie:cf,statement:""});


});


app.get("/Flight",function(req,res){
  if(req.isAuthenticated()){
    Data.findOne({_id:_id}, function (err, user) {

      fd=user.Flight.distance;
      ff=user.Flight.footprint;
      ft=user.Flight.flightType;
        res.render("Flight",{title:"Flight",carbon:ff,dist:fd,sel:ft});
    });
  }
  else{
    res.render("starter");
  }                                                                                  //to render respective pages for specified routes

});

app.get("/FlightClear",function(req,res){

  carbonFootprintResult-=carbonFootprint2;
  if(carbonFootprintResult<0){
    carbonFootprintResult=0;
  }
  const result={
  total:carbonFootprintResult
  }
  Data.findByIdAndUpdate(_id, { $set: { Result:result }}, function(err){
    if(err){
      console.log(err);
    }
  })

const motor1={
  flightType:"",
  distance:0,
  footprint:0
}


Data.findByIdAndUpdate(_id, { $set: { Flight: motor1 }}, function(err){
  if(err){
    console.log(err);
  }

})
    res.render("Flight",{title:"Flight",carbon:0,dist:0,sel:"--Please choose an option--"});



});

app.get("/MotorBike",function(req,res){

  if(req.isAuthenticated()){
  Data.findOne({_id:_id}, function (err, user) {
console.log(user.Motor.motorType);
    md=user.Motor.distance;
    mf=user.Motor.footprint;
   mt=user.Motor.motorType;
      res.render("bike",{title:"MotorBike",carbon:mf,dist:md,sel:mt});
  });


  }
  else{
    res.render("starter");
  }                                                                                  //to render respective pages for specified routes


});

app.get("/MotorBikeClear",function(req,res){
  carbonFootprintResult-=carbonFootprint3;
  if(carbonFootprintResult<0){
    carbonFootprintResult=0;
  }
  const result={
  total:carbonFootprintResult
  }
  Data.findByIdAndUpdate(_id, { $set: { Result:result }}, function(err){
    if(err){
      console.log(err);
    }
  })

const motor1={
  motorType:"",
  distance:0,
  footprint:0
}


Data.findByIdAndUpdate(_id, { $set: { Motor: motor1 }}, function(err){
  if(err){
    console.log(err);
  }

})
res.render("bike",{title:"MotorBike",carbon:0,dist:0,sel:"--Please choose an option--"});

});


app.get("/PublicTransit",function(req,res){

  if(req.isAuthenticated()){
    Data.findOne({_id:_id}, function (err, user) {

      pd=user.Public.distance;
      pf=user.Public.footprint;
      pt=user.Public.vehicleType;
    res.render("public",{title:"Public Transport",carbon:pf,dist:pd,sel:pt})
    });
  }
  else{
    res.render("starter");
  }                                                                                  //to render respective pages for specified routes


})
app.get("/publicTransitClear",function(req,res){
  carbonFootprintResult-=carbonFootprint4;
  if(carbonFootprintResult<0){
    carbonFootprintResult=0;
  }
  const result={
  total:carbonFootprintResult
  }
  Data.findByIdAndUpdate(_id, { $set: { Result:result }}, function(err){
    if(err){
      console.log(err);
    }
  })

  const motor1={
    vehicleType:"",
    distance:0,
    footprint:0
  }


  Data.findByIdAndUpdate(_id, { $set: { Public: motor1 }}, function(err){
    if(err){
      console.log(err);
    }

  })
  res.render("public",{title:"Public Transport",carbon:0,dist:0,sel:"--Please choose an option--"})
})


app.get("/results",function(req,res){

// carbonFootprintResult=  Math.round(carbonFootprintResult * 100) / 100;
  if(req.isAuthenticated()){
Data.findOne({_id:_id}, function (err, user) {
if(user.entry=="entry1"){
  var Final=user.Result.total;
}
else{
  var Final=user.Result1.total;
}


res.render("results",{carbon:Final})
});
}
})

app.get("/results2",function(req,res){
  if(req.isAuthenticated()){
    Data.findOne({_id:_id}, function (err, user) {

      cd=user.Car.distance;
      cf=user.Car.footprint;
      var ct=user.Car.carType;


            fd=user.Flight.distance;
            ff=user.Flight.footprint;
            ft=user.Flight.flightType;

            md=user.Motor.distance;
            mf=user.Motor.footprint;
           mt=user.Motor.motorType;


            pd=user.Public.distance;
            pf=user.Public.footprint;
            pt=user.Public.vehicleType;

            var c=user.Result.total;

                    cd1=user.Car1.distance;
                    cf1=user.Car1.footprint;
                    var ct1=user.Car1.carType;


                  fd1=user.Flight1.distance;
                  ff1=user.Flight1.footprint;
                  ft1=user.Flight1.flightType;

                  md1=user.Motor1.distance;
                  mf1=user.Motor1.footprint;
                 mt1=user.Motor1.motorType;


                  pd1=user.Public1.distance;
                  pf1=user.Public1.footprint;
                  pt1=user.Public1.vehicleType;

                  var c1=user.Result1.total;

      res.render("results2",{vehicle1:ct,distance1:cd,footprint1:cf,vehicle2:ft,distance2:fd,footprint2:ff,vehicle3:mt,distance3:md,footprint3:mf,vehicle4:pt,distance4:pd,footprint4:pf,carbon:c,vehicle11:ct1,distance11:cd1,footprint11:cf1});
    });
  }
  else{
    res.render("starter");
  }


})
app.post("/results2",function(req,res){
  res.redirect("/results2");

})
app.get("/reduce",function(req,res){
  res.render("reduce");
})

app.get("/register",function(req,res){
res.render("starter",{msgb:" "});
})
app.get("/login",function(req,res){
res.render("starter",{msg:" "});
})
//--------------------------------------------------

app.get("/clear",function(re,res){

carbonFootprintResult=0;

const result={
total:carbonFootprintResult
}
Data.findByIdAndUpdate(_id, { $set: { Result:result }}, function(err){
  if(err){
    console.log(err);
  }
})


const motor1={
  carType:"",
  distance:0,
  footprint:0
}


Data.findByIdAndUpdate(_id, { $set: { Car: motor1 }}, function(err){
  if(err){
    console.log(err);
  }

})


  const motor2={
    motorType:"",
    distance:0,
    footprint:0
  }


  Data.findByIdAndUpdate(_id, { $set: { Motor: motor2 }}, function(err){
    if(err){
      console.log(err);
    }

  })

  const motor3={
    flightType:"",
    distance:0,
    footprint:0
  }


  Data.findByIdAndUpdate(_id, { $set: { Flight: motor3 }}, function(err){
    if(err){
      console.log(err);
    }

  })


  const motor4={
    vehicleType:"",
    distance:0,
    footprint:0
  }


  Data.findByIdAndUpdate(_id, { $set: { Public: motor4 }}, function(err){
    if(err){
      console.log(err);
    }

  })
res.redirect("/CarTravel");

})


//--------------------------------------------------------
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
   if (!user) { res.render("starter",{msg:"User doesn't exist."});
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
    res.render("starter",{msgb:"user already found"});
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
    "x-rapidapi-key": "e692b4c540msh177df994cbab230p1ad0e8jsn7d7f74d478b4",
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
// carbonFootprint2 = carbonFootprint2.toFixed(2);
if(req.body.a==="two"){
  carbonFootprint2=carbonFootprint2*2;

}
carbonFootprintResult+=carbonFootprint2;
const flight={
  flightType:a,
  distance:flightDist,
  footprint:carbonFootprint2

}

Data.findByIdAndUpdate(_id, { $set: {Flight: flight }}, options, function(err){
  if(err){
    console.log(err);
  }
})
                                                                   //updating the corresponding result variables

 }
else if(z==="CarTravel"){



    Data.findOne({_id:_id}, function (err, user) {
      carbonFootprint1=JSON.parse(body).carbonEquivalent;
      // carbonFootprint1 = carbonFootprint1.toFixed(2);
      carbonFootprintResult+=carbonFootprint1;
      if(user.entry==="entry1"){
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
      else{
        carbonFootprint11=JSON.parse(body).carbonEquivalent;

        carbonFootprintResult1+=carbonFootprint11;
        const car={
          carType:a,
          distance:carsDist,
          footprint:carbonFootprint11
        }

        Data.findByIdAndUpdate(_id, { $set: { Car1: car }}, options, function(err){
          if(err){
            console.log(err);
          }
        })

      }
    });






}
else if(z==="PublicTransit"){
    carbonFootprint4=JSON.parse(body).carbonEquivalent;
    // carbonFootprint4 = carbonFootprint4.toFixed(2);
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
  // carbonFootprint3 = carbonFootprint3.toFixed(2);
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


  Data.findOne({_id:_id}, function (err, user) {
    if(user.entry==="entry1"){
      const result={
      total:carbonFootprintResult
      }
      Data.findByIdAndUpdate(_id, { $set: { Result:result }}, options, function(err){
        if(err){
          console.log(err);
        }
      })

    }
else{
  const result1={
  total:carbonFootprintResult1
  }
  Data.findByIdAndUpdate(_id, { $set: { Result1:result1 }}, options, function(err){
    if(err){
      console.log(err);
    }
  })
}
});

  response.redirect(x);                                                     //redirectinig to corresponding routes
	});
});


request.end();

});

//
// var count=0;
// while(count!=1){
//   var SmallDieselCar=new MotorData({
//     name:"SmallDieselCar",
//     footprint:1.20
//   });
//   var MediumDieselCar=new MotorData({
//     name:"MediumDieselCar",
//     footprint:1.20
//   });
//   var LargeDieselCar=new MotorData({
//     name:"LargeDieselCar",
//     footprint:1.30
//
//   });
//   var MediumHybridCar=new MotorData({
//     name:"MediumHybridCar",
//     footprint:1.20
//   });
//   var LargeHybridCar=new MotorData({
//     name:"LargeHybridCar",
//     footprint:1.20
//   });
//   var MediumLPGCar=new MotorData({
//     name:"MediumLPGCar",
//     footprint:1.20
//   });
//   var LargeLPGCar=new MotorData({
//     name:"LargeLPGCar",
//     footprint:1.20
//   });
//   var SmallPetrolVan=new MotorData({
//     name:"SmallPetrolVan",
//     footprint:1.20
//   });
//   var MediumPetrolCar=new MotorData({
//     name:"MediumPetrolCar",
//     footprint:1.20
//   });
//   var LargePetrolCar=new MotorData({
//     name:"LargePetrolCar",
//     footprint:1.20
//   });
//   var MediumCNGCar=new MotorData({
//     name:"MediumCNGCar",
//     footprint:1.20
//   });
//   var LargeCNGCar=new MotorData({
//     name:"LargeCNGCar",
//     footprint:1.20
//   });
//
//
//
//   var DomesticFlight=new MotorData({
//     name:"DomesticFlight",
//     footprint:1.20
//   });
//   var ShortEconomyClassFlight=new MotorData({
//     name:"ShortEconomyClassFlight",
//     footprint:1.20
//   });
//   var ShortBusinessClassFlight=new MotorData({
//     name:"ShortBusinessClassFlight",
//     footprint:1.20
//   });
//   var LongEconomyClassFlight=new MotorData({
//     name:"LongEconomyClassFlight",
//     footprint:1.20
//   });
//   var LongPremiumClassFlight=new MotorData({
//     name:"LongPremiumClassFlight",
//     footprint:1.20
//   });
//   var LongBusinessClassFlight=new MotorData({
//     name:"LongBusinessClassFlight",
//     footprint:1.20
//   });
//   var LongFirstClassFlight=new MotorData({
//     name:"LongFirstClassFlight",
//     footprint:1.20
//   });
//
//
//
//
//   var Taxi=new MotorData({
//     name:"Taxi",
//     footprint:1.20
//   });
//   var ClassicBus=new MotorData({
//     name:"ClassicBus",
//     footprint:1.20
//   });
//   var Coach=new MotorData({
//     name:"Coach",
//     footprint:1.20
//   });
//   var NationalTrain=new MotorData({
//     name:"NationalTrain",
//     footprint:1.20
//   });
//   var LightRail=new MotorData({
//     name:"LightRail",
//     footprint:1.20
//   });
//   var EcoBus=new MotorData({
//     name:"EcoBus",
//     footprint:1.20
//   });
//   var FerryOnFoot=new MotorData({
//     name:"FerryOnFoot",
//     footprint:1.20
//   });
//
//
//
//
//
// var SmallMotorBike=new MotorData({
//   name:"SmallMotorBike",
//   footprint:1.20
// });
// var MediumMotorBike=new MotorData({
//   name:"MediumMotorBike",
//   footprint:2.20
// });
// var LargeMotorBike=new MotorData({
//   name:"LargeMotorBike",
//   footprint:3.20
// });
// // ,MediumDieselCar, LargeDieselCar, MediumHybridCar, LargeHybridCar, MediumLPGCar, LargeLPGCar, MediumCNGCar, LargeCNGCar, SmallPetrolVan, MediumPetrolCar, LargePetrolCar, DomesticFlight, ShortEconomyClassFlight, ShortBusinessClassFlight, LongEconomyClassFlight, LongPremiumClassFlight, LongBusinessClassFlight, LongFirstClassFlight,Taxi, ClassicBus, Coach, NationalTrain, LightRail,EcoBus, FerryOnFoot
// MotorData.insertMany([SmallMotorBike,MediumMotorBike,LargeMotorBike ,MediumDieselCar, LargeDieselCar, MediumHybridCar, LargeHybridCar, MediumLPGCar, LargeLPGCar, MediumCNGCar, LargeCNGCar, SmallPetrolVan, MediumPetrolCar, LargePetrolCar, DomesticFlight, ShortEconomyClassFlight, ShortBusinessClassFlight, LongEconomyClassFlight, LongPremiumClassFlight, LongBusinessClassFlight, LongFirstClassFlight,Taxi, ClassicBus, Coach, NationalTrain, LightRail,EcoBus, FerryOnFoot],function(err){
//   if(err){
//     console.log(err);
//   }
// });
// count++;
// }
//


app.listen("3000",function(){
  console.log("the server is up and running");
})
