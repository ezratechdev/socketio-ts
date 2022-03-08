import express ,{Request , Response} from "express";
import path from "path";
import http from "http";
import {Server} from "socket.io";


// constants
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server);

// middle wares
app.use(express.json());
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.urlencoded({extended:true}));

// route get
app.get("/", (req:Request , res:Response)=>{
    res.sendFile("index.html");
})

// io activites

// users mock database
var users:any = [];

io.on("connection" , socket=>{
    socket.on("connect",()=>{
        console.log("A user joined");
    });
    // join
    socket.on("join" , (name)=>{
        const user = {
            uid:socket.id,
            name,
        };
        users.push({...user});
        socket.broadcast.emit("join",`${name} joined the group 😊`);
    });
    // text
    socket.on("text" , text=>{
        const user = users.find((user:any) => user.uid == socket.id);
        socket.broadcast.emit("text",`${user.name}: ${text}`);
    });
    //on disconnect
    socket.on("disconnect" , ()=>{
        const user = users.find((user:any) => user.uid = socket.id);
        users = users.filter((user:any) => user.uid != socket.id);
        socket.broadcast.emit("left",`${user.name} left the chat 😞`);
    })
});


// 404 error
app.use((req :Request , res :Response)=>{
    res.status(404).json({
        error:true,
        status:404,
    });
})
// 
server.listen(port);