echo "Nettoyage des ports 3000 et 3001..."
fuser -k 3000/tcp 2>/dev/null
fuser -k 3001/tcp 2>/dev/null

echo "Setup Auth-Service..."
cd auth-service && npm install && npx prisma db push
gnome-terminal --title="AUTH-SERVICE" -- bash -c "npm run dev; exec bash" &
cd ..

echo "Setup Mongo-Service..."
cd mongo-service && npm install
gnome-terminal --title="MONGO-SERVICE" -- bash -c "npm run dev; exec bash" &

echo "Microservices lancés !"