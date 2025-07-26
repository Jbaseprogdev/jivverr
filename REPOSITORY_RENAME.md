# Repository Rename Guide: jivverr

This guide will help you rename your GitHub repository from `medalyzer-vercel` to `jivverr`.

## Step 1: Rename Repository on GitHub

1. **Go to Repository Settings**
   - Navigate to your GitHub repository
   - Click on "Settings" tab
   - Scroll down to "Repository name" section

2. **Change Repository Name**
   - Current name: `medalyzer-vercel`
   - New name: `jivverr`
   - Click "Rename" button
   - Confirm the change

## Step 2: Update Local Repository

After renaming on GitHub, update your local repository:

```bash
# Check current remote URL
git remote -v

# Update remote URL to new repository name
git remote set-url origin https://github.com/Jbaseprogdev/jivverr.git

# Verify the change
git remote -v

# Test the connection
git fetch origin
```

## Step 3: Update Vercel Project

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Go to "Settings" → "General"
   - Update project name to "jivverr"

2. **Reconnect Repository (if needed)**
   - If Vercel lost connection, reconnect to the renamed repository
   - Go to "Settings" → "Git"
   - Connect to the new `jivverr` repository

## Step 4: Update Environment Variables

Ensure all environment variables are still configured:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Step 5: Test Deployment

1. **Make a test commit**
   ```bash
   git add .
   git commit -m "Test deployment after repository rename"
   git push origin main
   ```

2. **Verify deployment**
   - Check Vercel dashboard for successful deployment
   - Test the live site at https://jivverr.com

## Step 6: Update External References

Update any external references to the old repository name:

### Documentation
- Update any documentation that references the old repository
- Update README files if they contain old repository URLs

### CI/CD (if applicable)
- Update GitHub Actions workflows
- Update any deployment scripts

### Social Media/Websites
- Update any links pointing to the old repository
- Update any documentation or blog posts

## Step 7: Notify Team Members

If you have collaborators:
1. Inform them about the repository rename
2. Provide them with the new repository URL
3. Ask them to update their local remotes

## Verification Checklist

- [ ] Repository renamed on GitHub
- [ ] Local remote URL updated
- [ ] Vercel project updated
- [ ] Environment variables configured
- [ ] Test deployment successful
- [ ] Domain working at jivverr.com
- [ ] All team members notified

## Troubleshooting

### Repository Not Found
- Ensure the new repository name is correct
- Check that you have access to the renamed repository
- Verify the remote URL is updated locally

### Deployment Issues
- Check Vercel project settings
- Verify environment variables are set
- Check build logs for any errors

### Domain Issues
- Ensure DNS is properly configured
- Check Vercel domain settings
- Verify SSL certificate is provisioned

---

**Note**: After renaming, the old repository URL will redirect to the new one for a period, but it's best to update all references immediately. 