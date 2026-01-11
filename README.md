# Mythos API - Projet Microservices (L3 Informatique)

Ce projet implémente un système de gestion de bestiaire légendaire basé sur une architecture microservices. L'objectif est de séparer la logique d'authentification (relationnelle) de la gestion du contenu (NoSQL).

## Architecture du projet

* **Auth-Service (Port 3001)** : Gestion des utilisateurs (Inscription/Connexion).
* *Stack* : Node.js, SQLite, Prisma.


* **Mongo-Service (Port 3000)** : Gestion du Lore (Créatures/Témoignages).
* *Stack* : Node.js, MongoDB, Mongoose.



## Workflow technique

1. **Identity Provider** : Authentification sur le port 3001. Un **JWT** (JSON Web Token) est généré, contenant l'ID et le rôle de l'utilisateur.
2. **Stateless Auth inter-services** : Le `mongo-service` valide le token de manière autonome grâce au **Secret Partagé** (`JWT_SECRET`). Cela évite des appels réseau inutiles vers le service d'authentification.
3. **Système de Legend Score** : Algorithme de gamification mis à jour lors de la validation d'un témoignage par un tiers.
* **Formule** : 



---

## Démarrage Rapide

Le script `start.sh` automatise le nettoyage des ports, l'installation des dépendances et le lancement des deux microservices dans des terminaux séparés.

### Utilisation :

1. **Permissions** :
```bash
chmod +x start.sh

```


2. **Exécution** :
```bash
./start.sh

```



---

## Configuration (.env)

Les fichiers `.env` doivent être présents à la racine de chaque service et partager le même secret de signature.

**Auth-Service :**

```env
PORT=3001
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=MaCle123

```

**Mongo-Service :**

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/mythos
JWT_SECRET=MaCle123

```

---

## Test avec Postman (Step-by-Step)

1. **Auth** : `POST http://localhost:3001/api/auth/login` -> Copier le `token`.
2. **Setup Postman** : Dans les requêtes suivantes, utiliser l'onglet **Auth** -> **Bearer Token**.
3. **Création** : `POST http://localhost:3000/api/creatures` -> Récupérer l'ID de la créature.
4. **Témoignage** : `POST http://localhost:3000/api/testimonies` -> Récupérer l'ID du témoignage.
5. **Validation** : `PUT http://localhost:3000/api/validate/<ID_TESTIMONY>` (utiliser le token d'un **autre** compte utilisateur).
6. **Vérification** : `GET http://localhost:3000/api/creatures`. Le champ `legendScore` doit être passé à **1.2**.

---

## Dépannage

* **Invalid signature** : Le `JWT_SECRET` diffère entre les deux services ou les serveurs n'ont pas été redémarrés.
* **Prisma error** : Vérifier que `DATABASE_URL` utilise le préfixe `file:`.
* **Port déjà utilisé** : Si un port reste bloqué, utiliser la commande `fuser -k 3000/tcp`.

---
