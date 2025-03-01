FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose port 5173 (Vite's default port)
EXPOSE 5173

# Start the React development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]