window.onload = ()=>{
    const socket = io();
    // constants
    const ChatForm = document.getElementById("ChatForm");

    // create a li
    const LiCreator = (text,id,className) =>{
        const newLi = document.createElement("li");
        newLi.innerHTML = `${text}`;
        newLi.setAttribute("id",id);
        newLi.classList.add(className);
        document.getElementsByTagName("ul")[0].appendChild(newLi);
    }

    const RandomUid = ()=>{
        let ra = () =>{
            return (200+  Math.floor((100 * Math.random())));
        }
        return `anhhh-${ra()}-bnnhh${ra()}-cnnnh${ra()}-dprivate${ra()}`
    }
    const username = prompt("Please enter your name");
    if(typeof username != null){
        socket.emit('join',username);
        LiCreator(`Hey ${username} you joined the chat`,`${RandomUid()}`,'users');
    }else {
        let genuser = "Anon User";
        LiCreator(`Hey ${genuser} you joined the chat`,`${RandomUid()}`,'users');
        socket.emit('join',genuser);
    }
    // create a uid

    // push the text to the server
    ChatForm.addEventListener("submit" , event =>{
        event.preventDefault();
        socket.emit("text",ChatForm.text.value)
        LiCreator(`${username}: ${ChatForm.text.value}`,`${RandomUid()}`,'text');
        ChatForm.text.value = "";
    });

    // listen to sockets
    socket.on("text" , text=> LiCreator(text,`${RandomUid()}`,'text')
    );
    socket.on('join',data=> LiCreator(data,`${RandomUid()}`,'users')
    );
    socket.on('left',data=> LiCreator(data,`${RandomUid()}`,'users')
    );
}