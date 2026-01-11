# Mythos API - Projet Microservices

Ce projet implémente une architecture microservices pour la gestion d'un bestiaire légendaire. Le système sépare l'identité et la réputation (SQL) du contenu métier (NoSQL).

## Architecture du projet

* **Auth-Service (Port 3001)** : Gestion des utilisateurs et de leur réputation.
* *Stack* : Node.js, SQLite, Prisma.
* *Structure* : Architecture par couches (Routes -> Controllers -> Services) dans le dossier `src/`.


* **Mongo-Service (Port 3000)** : Gestion du Lore (Créatures et Témoignages).
* *Stack* : Node.js, MongoDB, Mongoose.



## Workflow technique

1. **Identity Provider** : Authentification sur le port 3001 pour obtenir un **JWT** signé.
2. **Stateless Auth** : Le `mongo-service` valide l'identité via son middleware `auth.js` grâce au secret partagé (`JWT_SECRET`).
3. **Internal API (Réputation)** : Le `auth-service` expose une route sécurisée par une clé d'API interne (`x-internal-key`) permettant au `mongo-service` de mettre à jour la réputation d'un utilisateur.
4. **Logic de Promotion** :
* Un utilisateur gagne de la réputation via ses actions.
* À partir de **10 points**, il passe automatiquement au rang **EXPERT**.


5. **Legend Score** : Les créatures voient leur score évoluer selon la formule : .

---

## Démarrage Rapide

Le script `start.sh` automatise le nettoyage des ports et le lancement des services dans des terminaux séparés.

### Utilisation :

1. **Permissions** : `chmod +x start.sh`
2. **Exécution** : `./start.sh`

---

## Configuration (.env)

**Auth-Service (`auth-service/.env`) :**

```env
PORT=3001
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=MaCleSecrete123
INTERNAL_KEY=CleInternePourLeServiceMongo

```

**Mongo-Service (`mongo-service/.env`) :**

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/mythos
JWT_SECRET=MaCleSecrete123
INTERNAL_KEY=CleInternePourLeServiceMongo

```

---

## Guide de Test Postman

### 1. Authentification

* `POST http://localhost:3001/api/auth/login`
* Récupérer le `token` et l'utiliser dans l'onglet **Auth > Bearer Token** pour les services Mongo.

### 2. Gestion de la Réputation (Inter-services)

* **Méthode** : `PATCH`
* **URL** : `http://localhost:3001/api/reputation/users/:id/reputation`
* **Header requis** : `x-internal-key` : *Votre_Cle_Interne*
* **Body** : `{"delta": 5}` (Incrémente la réputation de 5).

### 3. Cycle de vie des Créatures

* `POST :3000/api/creatures` (Création).
* `POST :3000/api/testimonies` (Ajout d'un témoignage).
* `PUT :3000/api/validate/<ID>` (Validation par un expert/admin).
* `GET :3000/api/creatures` (Vérification du Legend Score).

---

## Dépannage

* **Forbidden (403)** : La clé `x-internal-key` dans Postman ne correspond pas au `.env` du `auth-service`.
* **ERR_MODULE_NOT_FOUND** : Vérifier que les imports dans `src/` incluent bien l'extension `.js`.
* **Prisma Studio** : Utiliser `npx prisma studio` dans `auth-service` pour visualiser la base SQLite.

---

