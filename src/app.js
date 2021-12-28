const express = require("express");
const path = require("path")
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");



const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server,{                 
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

//   const clientjs_path = path.join(__dirname, "../templates/views/js");
//   app.use(express.static(clientjs_path)); 

  const users = {};     // creating a type of dictionary where the key is socket.id and value is the name.

  // here io.on is an instance of socket.io which will listen to socket connections like harryjoined, rahuljoined 
  io.on('connection', (socket) =>{
      // here socket.on will handle anything that happens with a particular connection 
      socket.on('new-user-joined', name => {
          console.log("New user", name);
          users[socket.id] = name;                          // appending the name to the users list
          socket.broadcast.emit('user-joined', name)        // broadcasts to all the other users 
      });
  
      // here socket.on will handle the event whenever someone sends a Message 
      socket.on('send', message => {
          socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
      });
  
      // here socket.on will handle the event whenever someone leaves the chat  
      socket.on('disconnect', message =>{
          socket.broadcast.emit('left', users[socket.id])
          delete users[socket.id];
      })
  })
  
  const PORT = process.env.PORT || 8000;
  server.listen(PORT, () => console.log(`server running on port ${PORT}`));



require("./db/conn")
const Register = require("./models/registers");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
const images_path = path.join(__dirname, "../templates/views/images");
console.log(__dirname)

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.use(express.static(images_path)); 
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req,res)=>{
    res.render("index");
});

app.get("/register", (req,res)=>{
    res.render("register");
})

app.post("/register", async (req,res)=>{
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password === cpassword){
            const registerStudent = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: password,
                confirmpassword: cpassword
            })

        const registered = await registerStudent.save();
        res.status(201).render("index");
        }else{
            res.send("password are not matching")
        }
    } catch (error) {
        res.status(400).send(error)
    }
});

app.get("/login", (req,res)=>{
    res.render("login");
});

app.post("/login", async (req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});

        const isMatch = await bcrypt.compare(password, useremail.password);

        if(isMatch){
            res.status(201).render("home");
        }else{
            res.send("Invalid Login Details");
        }
    } catch (error) {
        res.status(400).send("Invalid Login Details");
    }
});


app.get("/home", (req,res)=>{
    res.render("home");
});

app.get("/chat", (req,res)=>{
    res.render("chat");
});

// app.get("/js/client.js", (req,res)=>{
//     res.render("chat");
// });






app.listen(port, ()=>{
    console.log(`server is running at port no ${port}`);
});