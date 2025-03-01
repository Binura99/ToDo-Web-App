# To-Do Task Application

This is a full-stack To-Do application built with React Vite TypeScript for the frontend and Express.js for the backend with MySQL database.

## Project Structure

```
.
├── backend/           # Express.js backend
├── frontend/          # React Vite TypeScript frontend
├── docker-compose.yml # Docker Compose configuration
└── .env               # Root environment variables for Docker
```

## Prerequisites

- Docker and Docker Compose installed on your machine

## How to Run

1. Clone the repository
2. Place the Dockerfiles in the respective directories:
   - `backend/Dockerfile`
   - `frontend/Dockerfile`
3. Place the `docker-compose.yml` and `.env` file in the root directory
4. Run the following command from the root directory:

```bash
docker-compose up
```

To run in detached mode:

```bash
docker-compose up -d
```

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/tasks

## Database

The MySQL database is accessible:
- Within Docker: `db:3306`
- From your host machine: `localhost:3306`
- Credentials as specified in the `.env` file

## Development

The Docker setup includes:
- Volume mounts for hot reloading of code changes
- Database persistence via Docker volumes
- Automatic running of migrations on startup

## Testing

To run tests:

```bash
docker-compose exec backend npm test
```

## Stopping the Application

```bash
docker-compose down
```

If you want to remove all data (including the database):

```bash
docker-compose down -v
```