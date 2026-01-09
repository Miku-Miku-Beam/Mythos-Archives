# Mythos Archives

Mythos Archives est une plateforme où les utilisateurs répertorient des créatures mythologiques imaginaires (ou inspirées de folklores fictifs) et soumettent des témoignages les concernant, tandis que des experts valident ou rejettent ces données.

## Auth Service – Installation

## Cloner le dépôt

```bash
git clone https://github.com/Miku-Miku-Beam/Mythos-Archives.git
cd auth-service
```

## Installer les dépendances

```bash
npm install
```

## Créer le fichier .env

```bash
DATABASE_URL="mysql://root:@localhost:3306/auth_service_db"
JWT_SECRET="mon_secret_super_sécurisé"
```

## Crée la basse de donnée MySQL

En utilisant Xampp(lancer Apache et MySQL), sur phpMyAdmin crée une nouvelle base de donnée `auth_service_db`

## Lancer Prisma et la base de données

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Lancer le microservice

```bash
npm run dev
```

Le service sera disponible sur :
`http://localhost:3000`

## Routes API pour tester (exemples Postman)

Register

POST `/auth/register`

Headers:

```bash
Content-Type: application/json
```

Body (JSON)

```bash
{
"email": "user@test.com",
"username": "user1",
"password": "password123"
}
```

## Login

POST `/auth/login`

Headers
`Content-Type: application/json`

Body (JSON)

```bash
{
"email": "user@test.com",
"password": "password123"
}
```

## Réponse :

```bash
{
"token": "JWT_TOKEN"
}
```

## Profil utilisateur

GET `/auth/me`

Header :
`Authorization: Bearer JWT_TOKEN`

## Admin – Liste des utilisateurs

GET `/admin/users`

Header :
`Authorization: Bearer ADMIN_JWT_TOKEN`

## Admin – Modifier le rôle

PATCH `/admin/users/:id/role`

Body (JSON)

```bash
{
"role": "ADMIN"
}
```

## Technologies utilisées

- Node.js / Express
- Prisma ORM
- MySQL (XAMPP)
- JWT Authentication
