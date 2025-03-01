FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Add wait-for-it script to wait for the database to be ready
RUN apk add --no-cache bash
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Run database migrations and start the server
CMD /wait-for-it.sh db:3306 -t 60 -- npm run db:migrate && npm start