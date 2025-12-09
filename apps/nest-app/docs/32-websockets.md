# WebSockets (Real-Time) 📡

NestJS ofrece un módulo robusto para manejar conexiones en tiempo real, soportando tanto **Socket.io** (el default y recomendado) como **ws** (nativo).

## 1. Instalación

Para usar Socket.io (el estándar más común):

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

## 2. Gateways (El "Controller" de WS)

En WebSockets, no usamos "Controllers". Usamos **Gateways**.
Un Gateway es simplemente una clase anotada con `@WebSocketGateway()` que escucha eventos.

```typescript
// chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // Habilitar CORS es vital
export class ChatGateway {
  // Acceso a la instancia del servidor (para emitir a todos)
  @WebSocketServer()
  server: Server;

  // Escuchar el evento 'message' desde el cliente
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(`Cliente ${client.id} dice: ${data}`);

    // Emitir respuesta a TODOS los conectados (Broadcast)
    this.server.emit('message', `Broadcast: ${data}`);

    // O responder solo al que envió el mensaje
    // client.emit('response', 'Mensaje recibido');
  }
}
```

## 3. Registrar el Gateway

No olvides registrar tu Gateway en los `providers` de tu módulo.

```typescript
// app.module.ts
@Module({
  providers: [ChatGateway],
})
export class AppModule {}
```

## 4. Conceptos Clave

| Decorador                     | Función                                                                             |
| :---------------------------- | :---------------------------------------------------------------------------------- |
| `@WebSocketGateway()`         | Marca la clase como Gateway. Puedes pasar opciones como `{ port: 80, cors: true }`. |
| `@WebSocketServer()`          | Inyecta la instancia del servidor (`io`). Útil para emitir eventos globales.        |
| `@SubscribeMessage('evento')` | Escucha un evento específico del cliente.                                           |
| `@MessageBody()`              | Extrae el payload (datos) del mensaje.                                              |
| `@ConnectedSocket()`          | Extrae la instancia del socket cliente (para obtener ID, IP, etc).                  |

## 5. Namespaces y Rooms

Socket.io permite agrupar conexiones.

**Unirse a una sala ("Room"):**

```typescript
@SubscribeMessage('joinRoom')
handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
  client.join(room); // El cliente entra a la sala 'vip'
  this.server.to(room).emit('message', 'Un nuevo usuario entró a la sala');
}
```

## 🔥 Best Practices 2026

1.  **Autenticación:** Usa Guards en los Gateways (`@UseGuards(WsJwtGuard)`). La autenticación en WS se suele hacer por Token en el Handshake.
2.  **Validación:** Usa DTOs y Pipes (`@UsePipes(new ValidationPipe())`) igual que en controladores HTTP.
3.  **CORS:** Configura bien el CORS en `@WebSocketGateway({ cors: ... })` o te fallará la conexión desde el frontend.
4.  **No satures el Event Loop:** Si tienes que hacer una tarea pesada tras recibir un mensaje, mándala a una cola (BullMQ), no bloquees el socket.
