# Contributing to Nourish

Thank you for your interest in contributing to Nourish! This document provides guidelines and instructions for contributing to this project.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/nourish.git
   cd nourish
   ```
3. **Set up your development environment**
   ```bash
   ./setup_local.sh
   # OR
   docker-compose up
   ```

## Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

#### Backend Changes
- Edit files in `backend/`
- Follow PEP 8 style guidelines
- Add type hints where applicable
- Update tests if needed

#### Frontend Changes
- Edit files in `frontend/src/`
- Follow React best practices
- Use functional components with hooks
- Maintain consistent styling with Tailwind CSS

### 3. Test Your Changes

#### Backend Testing
```bash
cd backend
# Run existing tests
pytest

# Test API endpoints manually
curl http://localhost:8001/api/
```

#### Frontend Testing
```bash
cd frontend
# Run tests
yarn test

# Test in browser
yarn start
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add amazing feature"
```

#### Commit Message Format
Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add user authentication
fix: resolve login redirect issue
docs: update setup instructions
```

### 5. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request
- Go to the original repository
- Click "New Pull Request"
- Select your feature branch
- Fill in the PR template
- Submit for review

## Code Style Guidelines

### Backend (Python)
- Follow PEP 8
- Use type hints
- Maximum line length: 88 characters (Black formatter)
- Use meaningful variable names

```python
# Good
async def create_status_check(input: StatusCheckCreate) -> StatusCheck:
    """Create a new status check entry."""
    pass

# Avoid
async def create(i):
    pass
```

### Frontend (JavaScript/React)
- Use functional components
- Prefer hooks over class components
- Use meaningful component names
- Keep components focused and small

```jsx
// Good
const UserProfile = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div data-testid="user-profile">
      {user.name}
    </div>
  );
};

// Avoid
const UP = ({ u }) => <div>{u.n}</div>;
```

### General
- Write clear, descriptive comments
- Keep functions small and focused
- Use consistent naming conventions
- Add error handling

## Project Structure

```
nourish/
├── backend/              # FastAPI backend
│   ├── server.py        # Main application
│   ├── requirements.txt # Python dependencies
│   └── .env            # Environment variables
├── frontend/            # React frontend
│   ├── src/
│   │   ├── App.js      # Main component
│   │   ├── components/ # Reusable components
│   │   └── hooks/      # Custom hooks
│   ├── package.json    # Node dependencies
│   └── .env           # Environment variables
├── scripts/            # Development scripts
├── tests/             # Test files
└── docker-compose.yml # Docker configuration
```

## Adding New Features

### Backend API Endpoint

1. Add the route to `backend/server.py`:
```python
@api_router.post("/new-feature")
async def new_feature(data: FeatureInput):
    # Implementation
    return {"status": "success"}
```

2. Add Pydantic models if needed:
```python
class FeatureInput(BaseModel):
    name: str
    description: str
```

3. Test the endpoint:
```bash
curl -X POST http://localhost:8001/api/new-feature \
  -H "Content-Type: application/json" \
  -d '{"name": "test", "description": "test feature"}'
```

### Frontend Component

1. Create component in `frontend/src/components/`:
```jsx
// NewFeature.jsx
import React from 'react';

const NewFeature = () => {
  return (
    <div data-testid="new-feature">
      {/* Component content */}
    </div>
  );
};

export default NewFeature;
```

2. Import and use in App.js:
```jsx
import NewFeature from './components/NewFeature';

// In your component
<NewFeature />
```

## Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
yarn test
```

### Integration Tests
```bash
./scripts/test_api.sh
```

## Documentation

When adding new features:
1. Update relevant README files
2. Add inline code comments
3. Update API documentation
4. Add examples where helpful

## Environment Variables

### Adding New Environment Variables

1. Add to `.env.example`:
```bash
# Backend
NEW_API_KEY="your_api_key_here"
```

2. Document in README:
```markdown
| Variable | Description | Required |
|----------|-------------|----------|
| NEW_API_KEY | API key for service X | Yes |
```

3. Use in code:
```python
# Backend
import os
api_key = os.environ.get('NEW_API_KEY')
```

```javascript
// Frontend
const apiKey = process.env.REACT_APP_NEW_API_KEY;
```

## Database Changes

### Adding New Collections
1. Define the model in `server.py`:
```python
class NewCollection(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

2. Create endpoints for CRUD operations
3. Test with sample data

## Common Issues

### Port Conflicts
```bash
# Kill process on port
lsof -ti:PORT | xargs kill -9
```

### Dependency Issues
```bash
# Backend
pip install -r requirements.txt --upgrade

# Frontend
rm -rf node_modules
yarn install
```

### Database Connection
```bash
# Check if MongoDB is running
docker ps | grep mongodb
# or
sudo systemctl status mongodb
```

## Getting Help

- Check existing issues
- Read the documentation
- Ask in discussions
- Create a detailed issue

## Code Review Process

1. All PRs require at least one review
2. All tests must pass
3. Code must follow style guidelines
4. Documentation must be updated
5. No merge conflicts

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Questions?

Feel free to open an issue or reach out to the maintainers!

---

Thank you for contributing to Nourish! 🎉
