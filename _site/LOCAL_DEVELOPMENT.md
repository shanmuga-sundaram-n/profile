# Local Development Guide

Due to eventmachine compilation issues on macOS with newer Ruby versions, local development requires an alternative approach.

## Option 1: Push to GitHub and Let Actions Build (Recommended)

The site is configured with GitHub Actions for automatic deployment:

1. **Commit and push your changes**:
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```

2. **GitHub Actions will automatically**:
   - Build the Jekyll site
   - Deploy to GitHub Pages
   - Available at: https://shanmuga-sundaram-n.github.io

3. **Check build status**:
   - Go to your repository on GitHub
   - Click "Actions" tab
   - View the workflow run

## Option 2: Use Docker (Alternative for Local Preview)

If you need to preview locally, use Docker:

```bash
# Pull Jekyll Docker image
docker pull jekyll/jekyll:latest

# Serve the site
docker run --rm -it \
  --volume="$PWD:/srv/jekyll" \
  --publish 4000:4000 \
  jekyll/jekyll \
  jekyll serve
```

Then visit: http://localhost:4000

## Option 3: Simple Python Server (Static Preview Only)

For quick static preview without Jekyll processing:

```bash
# Build once (if you can get bundle install to work)
bundle exec jekyll build

# Or use the Python server script
python3 serve.py
```

## Why Local Jekyll Doesn't Work

The `eventmachine` gem (required for Jekyll's live reload) fails to compile on:
- macOS with Apple Silicon
- Ruby 3.x versions
- Newer Xcode/Command Line Tools

This is a known issue with the gem, not with your setup.

## Recommended Workflow

1. **Edit files** locally in your editor
2. **Commit and push** to GitHub
3. **GitHub Actions builds** and deploys automatically
4. **View live site** at your GitHub Pages URL

This is actually the standard workflow for GitHub Pages sites!
