let {Server: SocketIO} = require("socket.io");

class Socket{
  static instancia;
  constructor(http){
    if(Socket.instancia){
      return Socket.instancia;
    }
    Socket.instancia = this;
    this.io = new SocketIO(http);
    this.mensajes = [];
    this.usuarios = [];
  }
  init(){
    try {
      this.io.on("connection",socket=>{
        console.log("Usuario conectado!");

        socket.emit("init",this.mensajes);

        socket.on("mensaje",data =>{
          let res = {
            id : socket.id,
            mensaje : data
          };
          this.mensajes.push(res);
          this.io.sockets.emit('listenserver',this.mensajes); 
        });

        socket.on("addUser",data =>{
          let newUser = {
            id : socket.id,
            ...data,
            active: true
          };
          this.usuarios.push(newUser);
          this.io.sockets.emit('loadUsers',this.usuarios); 
        });

        socket.on("disconnect",data =>{
          console.log("Alguien se desconectó");
          // ...
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Socket;