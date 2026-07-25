# Phase 7: CI/CD Integration

## GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test -- --watch=false --coverage
      - run: npm run lint
```

> **Note** 
> Reference only for now. **DO NOT IMPLEMENT.**