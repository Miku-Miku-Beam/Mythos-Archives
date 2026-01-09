
---
**Lore Service - Mythos Archives**

Ce microservice gère le bestiaire (créatures) et les témoignages de l'univers Mythos-Archives. 
Il est construit avec **Node.js**, **Express** et **MongoDB**.

##  Installation sur Linux
```markdown

1. **Installer les dépendances :**
   ```bash
   npm install

```

2. **Configurer les variables d'environnement :**
Créez un fichier `.env` à la racine :
```env
JWT_SECRET=votre_cle_secrete
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mythos_lore


```


3. **Lanceement de la base de données :**
```bash
sudo systemctl start mongodb

```


4. **Démarrage du serveur :**
```bash
npm run dev

```



---

## Utilisation de l'API via Postman

### 1. Token

Pour tester les routes sécurisées sans système de login complet, utilisez la route de développement :

* **URL** : `GET http://localhost:3000/get-token`
* **Action** : Copiez le `token` reçu dans la réponse.
* **Attention** : Si vous modifiez la clé JWT_SECRET dans le fichier .env, tous les anciens tokens deviendront invalides et vous devrez en générer un nouveau via la route /get-token."

### 2. Ajouter une Créature

* **Méthode** : `POST`
* **URL** : `http://localhost:3000/api/creatures`
* **Auth** : Onglet `Authorization` > Type `Bearer Token` > Collez votre token.
* **Body** (JSON) :
```json
{
  "name": "Basilic",
  "origin": "Grèce"
}

```



### 3. Ajouter un Témoignage

* **Méthode** : `POST`
* **URL** : `http://localhost:3000/api/testimonies`
* **Auth** : `Bearer Token` requis.
* **Body** (JSON) :
```json
{
  "creatureId": "ID_DE_LA_CREATURE",
  "description": "J'ai vu une lueur verte dans la forêt..."
}

```



---

## Structure du Projet

* `src/app.js` : Point d'entrée et configuration Express.
* `src/routes/LoreRoutes.js` : Définition des endpoints API.
* `src/models/` : Schémas Mongoose (Creatures, Testimony).
* `src/middlewares/auth.js` : Vérification du badge JWT.

---

##  Dépannage Token

### Erreur "Invalid Token"

1. Vérifiez que la clé `JWT_SECRET` dans votre `.env` est identique à celle utilisée pour générer le token.
2. Redémarrez le serveur après chaque modification du `.env`.

### Erreur MongoDB (Socket file / Permission denied)

Si MongoDB refuse de se lancer manuellement, utilisez toujours `systemctl` :

```bash
sudo rm /tmp/mongodb-27017.sock  # Nettoyage si crash précédent
sudo systemctl restart mongodb

```
