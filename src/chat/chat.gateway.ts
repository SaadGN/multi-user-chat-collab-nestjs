import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server } from "socket.io";
import { ChatService } from "./chat.service";
import { Socket } from "socket.io";
import { SendMessageDto } from "./dto/send-message.dto";
import { JwtService } from "@nestjs/jwt";


@WebSocketGateway({
    cors: true
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private chatService: ChatService,
        private jwtService: JwtService
    ) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token
            if (!token) {
                throw new WsException('No token');
            }

            const decoded: any = this.jwtService.verify(token,{
                secret: process.env.JWT_TOKEN_SECRET
            })
            // client.data.user = decoded;

            client.data.user={
                id:decoded.sub,
                email:decoded.email,
                role:decoded.role
            }


            console.log(`User connected : ${decoded.id}`);
        } catch (error) {
            client.disconnect();
        }

    }

    handleDisconnect(client: Socket) {
        console.log(`User Disconnected : ${client.id}`);
    }

    @SubscribeMessage('joinWorkspace')
    async joinWorkspace(
        @MessageBody() data: { workspaceId: number },
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const userId = client.data.user.id;
            await this.chatService.validateUser(data.workspaceId, userId)

            const room = this.chatService.getWorkspaceRoom(data.workspaceId);
            client.join(room)

            console.log(`User ${userId} joined workpsace ${data.workspaceId}`);

            client.emit('joinedWorkspace', room)
        } catch (error) {
            throw new WsException(error.message)
        }
    }

    @SubscribeMessage('sendMessage')
    async sendMessage(
        @MessageBody() dto: SendMessageDto,
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const userId = client.data.user.id;

            const savedMessage = await this.chatService.saveMessage(
                dto.workspaceId,
                userId,
                dto.message
            );
            const room = this.chatService.getWorkspaceRoom(dto.workspaceId);
            this.server.to(room).emit('newMessage', savedMessage);

            console.log(`Message sent in workspace ${dto.workspaceId}`);

        } catch (error) {
            throw new WsException(error.message)
        }
    }

}