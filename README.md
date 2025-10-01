
## Project Architecture
- **Monorepo structure**: Contains `backend/` (PHP API, SQL, Apache config), `frontend/` (static HTML, JS, CSS, Nginx config), and `scripts/` (Python utilities).
- **Backend**: PHP API endpoints in `backend/api/` (e.g., `books.php`, `categories.php`). Database schema and migrations in `backend/database.sql` and updates. Apache config in `backend/apache.conf`.
- **Frontend**: Static HTML pages in `frontend/`, with JS modules for routing, data handling, and UI logic in `frontend/assets/js/`. CSS in `frontend/assets/css/`. Nginx config in `frontend/nginx.conf`.
- **Scripts**: Python scripts for data tasks (e.g., `scripts/scraper.py`).
- **Containerization**: Uses `docker-compose.yml` at the root, with separate `Dockerfile` for backend and frontend.

## Developer Workflows
- **Run locally**: Use `docker-compose up` from the project root to start both backend and frontend services.
- **Database updates**: Apply SQL migrations in `backend/` as needed. Main schema is in `database.sql`; incremental updates in `database_update.sql` and `database_update_2.sql`.
- **Static assets**: Place images in `frontend/assets/images/`, CSS in `frontend/assets/css/`, JS in `frontend/assets/js/`.
- **API changes**: Update PHP files in `backend/api/` and ensure database consistency.

## Project-Specific Patterns
- **API endpoints**: Each PHP file in `backend/api/` is a single endpoint. Data is returned as JSON. Example: `books.php` returns book data for frontend consumption.
- **Frontend routing**: JS in `frontend/assets/js/routing.js` handles navigation between static pages.
- **No framework**: Frontend is pure HTML/CSS/JS, no React/Vue/Angular. Backend is raw PHP, no Laravel/Symfony.
- **Config separation**: Web server configs (`apache.conf`, `nginx.conf`) are kept in their respective service folders.

## Integration Points
- **Frontend-backend communication**: Frontend JS fetches data from backend API endpoints (e.g., `/api/books.php`).
- **Database**: MySQL schema and updates managed via SQL files in `backend/`.
- **Python scripts**: Used for data scraping or import, not part of main app runtime.

## Examples
- To add a new API endpoint: create a new PHP file in `backend/api/`, update database if needed, and document the endpoint for frontend use.
- To add a new page: create HTML in `frontend/`, add JS/CSS as needed, update routing if navigation is required.

## Key Files & Directories
- `docker-compose.yml`: Service orchestration
- `backend/api/`: PHP API endpoints
- `backend/database.sql`: Main DB schema
- `frontend/assets/js/`: Frontend logic
- `frontend/nginx.conf`, `backend/apache.conf`: Web server configs
- `scripts/scraper.py`: Data utility

---
For unclear workflows or missing conventions, ask the user for clarification before making assumptions.
