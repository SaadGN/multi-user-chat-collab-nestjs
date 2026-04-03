# Multi-User Workspace Chat (NestJS)

A backend learning project built with NestJS that implements:
- admin-controlled user onboarding via invite links,
- workspace invitations and membership management,
- real-time workspace chat using Socket.IO and JWT auth.

The project demonstrates a complete role-based flow where only invited users can sign up, only workspace members can join chat rooms, and messages are shared with all members inside the same workspace.

## Project Description

This application uses a two-step invite process:

1. **Platform onboarding invite**
   - Admin sends an invite to a new user email.
   - User signs up using the invite token.
2. **Workspace invite**
   - Admin invites an existing platform user to a specific workspace.
   - User accepts the workspace invite token.
   - User becomes a member of that workspace.

After joining a workspace, members can connect through WebSocket and chat in real time. All users in the same workspace room receive incoming messages.

## Tech Stack

- **Backend framework:** NestJS
- **Database ORM:** TypeORM
- **Database:** PostgreSQL
- **Auth:** JWT + custom authorization guard
- **Realtime:** Socket.IO (`@nestjs/websockets`)
- **Mail:** Nodemailer (SMTP)
- **Validation:** class-validator + global `ValidationPipe`

## Core Functionalities

- **Default admin bootstrapping**
  - On app startup, a default admin is auto-created from environment variables.
- **Invite-based signup**
  - Only invited emails can create accounts via `/auth/signup?token=...`.
- **Role-based authorization**
  - `ADMIN` and `MEMBER` routes are protected with `AuthorizeGuard` + custom decorators.
- **Workspace management (Admin)**
  - Create, list, update, delete workspaces.
- **Workspace membership via invite**
  - Workspace invite links are token-based and expirable.
  - Accepted invites create records in `workspace_member`.
- **Realtime workspace chat**
  - JWT-authenticated socket connection.
  - Join workspace room only if user is a workspace member.
  - Load previous messages and broadcast new messages to room members.

## Project Structure

```text
src/
  admin/        # admin APIs: onboarding invites 
  auth/         # login + invite-based signup + JWT config
  user/         # user CRUD (admin-protected)
  workspace/    # workspace CRUD + accept workspace invites + memberships + workspace invites
  chat/         # websocket gateway + message persistence
  mail/         # SMTP invite mail sending
  guards/       # authorization guard
  config/       # auth and database config loaders
  frontend/     # simple chat testing page (chat-test.html)
```

## Data Model (High-Level)

- `User`
  - role: `ADMIN` | `MEMBER`
- `Invite`
  - onboarding invite token (for signup)
- `Workspace`
  - workspace metadata
- `WorkspaceInvite`
  - workspace-specific invite token
- `WorkspaceMember`
  - membership mapping: user <-> workspace
- `Message`
  - chat messages (`workspaceId`, `senderId`, `message`)

## Setup Guide

### 1) Clone and install

```bash
npm install
```

### 2) Configure environment variables

Copy `env.example` to `.env` and fill all values:

```bash
cp env.example .env
```

Required values used by the app:

- App / DB:
  - `PORT` (optional, default `3000`)
  - `ENV_MODE`
  - `DB_HOST`
  - `DB_PORT`
  - `DB_USERNAME`
  - `DB_PASSWORD`
  - `DB_NAME`
- Default admin bootstrap:
  - `ADMIN_USERNAME`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`
- JWT:
  - `JWT_TOKEN_SECRET`
  - `JWT_TOKEN_EXPIRESIN`
  - `JWT_TOKEN_ISSUER`
  - `JWT_TOKEN_AUDIENCE`
- Mail + invite links:
  - `MAIL_HOST`
  - `MAIL_PORT`
  - `MAIL_USER`
  - `MAIL_PASSWORD`
  - `INVITE_LINK` (example: `http://localhost:3000`)


### 3) Start PostgreSQL

Create the database configured in `DB_NAME` and ensure credentials match `.env`.

### 4) Run the backend

```bash
npm run start:dev
```

On startup, the app creates tables automatically (`synchronize: true`) and attempts to create the default admin user.

## Main API Endpoints

### Auth

- `POST /auth/login` - login and receive JWT
- `POST /auth/signup?token=<invite-token>` - signup using onboarding invite

### Admin (JWT + ADMIN role)

- `POST /admin/invite` - send onboarding invite to email


### Workspace
- `POST /workspace/invite` - send workspace invite (`email`, `workspaceId`)
- `GET /workspace/invite?token=<workspace-invite-token>` - accept workspace invite (JWT + MEMBER role)
- `GET /workspace` - list all workspaces (ADMIN)
- `GET /workspace/id/:id` - get one workspace (authenticated)
- `POST /workspace` - create workspace (ADMIN)
- `PATCH /workspace/:id` - update workspace (ADMIN)
- `DELETE /workspace/:id` - delete workspace (ADMIN)

### Users (JWT + ADMIN role)

- `GET /user`
- `POST /user`
- `PATCH /user/:id`
- `DELETE /user/:id`

## End-to-End Functional Flow

1. Start backend.
2. Login as default admin (`POST /auth/login`).
3. Admin sends onboarding invite (`POST /admin/invite`).
4. Invited user signs up (`POST /auth/signup?token=...`).
5. Admin creates workspace (`POST /workspace`).
6. Admin sends workspace invite (`POST /admin/workspace/invite`).
7. User logs in (`POST /auth/login`) and gets JWT.
8. User accepts workspace invite (`GET /workspace/invite?token=...`).
9. User can now join workspace chat via Socket.IO.

## Realtime Chat Testing (`chat-test.html`)

Your frontend test file is: `src/frontend/chat-test.html`.

Use your Live Server approach to open this file in browser, then:

1. Open the page in **two browser tabs** (or two browsers).
2. Paste each user JWT and click **Connect**.
3. Enter the same workspace ID and click **Join Workspace**.
4. Send messages from one tab.
5. Messages appear in both tabs for users in that workspace.

Socket events used:
- Client emits: `joinWorkspace`, `sendMessage`
- Server emits: `joinedWorkspace`, `previousMessages`, `newMessage`

## Important Notes

- Only workspace members can join chat rooms and send messages.
- Socket auth verifies JWT from `client.handshake.auth.token`.
- Current chat gateway validates JWT using `JWT_TOKEN_SECRET`.
- The project currently uses `synchronize: true` (good for learning/dev, not for production).

