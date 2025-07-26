# Domain Setup Guide for jivverr.com

This guide will help you configure the `jivverr.com` domain for your Medalyzer app on Vercel.

## Prerequisites

- Domain ownership of `jivverr.com`
- Access to your domain registrar's DNS settings
- Vercel account with project deployed

## Step 1: Add Domain in Vercel

1. **Go to Vercel Dashboard**
   - Navigate to your project dashboard
   - Click on "Settings" tab
   - Select "Domains" from the left sidebar

2. **Add Custom Domain**
   - Click "Add Domain"
   - Enter `jivverr.com`
   - Click "Add"

3. **Add WWW Subdomain**
   - Click "Add Domain" again
   - Enter `www.jivverr.com`
   - Click "Add"

## Step 2: Configure DNS Records

You'll need to add the following DNS records at your domain registrar:

### For jivverr.com (Root Domain)
```
Type: A
Name: @
Value: 76.76.19.19
TTL: 3600
```

### For www.jivverr.com (WWW Subdomain)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Alternative: Use Vercel Nameservers
If your registrar supports it, you can use Vercel's nameservers:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
ns3.vercel-dns.com
ns4.vercel-dns.com
```

## Step 3: Verify Configuration

1. **Check DNS Propagation**
   - Use tools like [whatsmydns.net](https://whatsmydns.net)
   - Enter `jivverr.com` and check A record
   - Enter `www.jivverr.com` and check CNAME record

2. **Verify in Vercel**
   - Go back to Vercel Domains settings
   - Both domains should show "Valid Configuration"
   - HTTPS should be automatically enabled

## Step 4: Test Your Domain

Once DNS is propagated (can take up to 48 hours):

1. **Test Root Domain**: https://jivverr.com
2. **Test WWW Subdomain**: https://www.jivverr.com
3. **Test Redirects**: Both should work and redirect properly

## Common Issues & Solutions

### Domain Not Working
- **Check DNS Records**: Ensure A and CNAME records are correct
- **Wait for Propagation**: DNS changes can take 24-48 hours
- **Clear Cache**: Try accessing in incognito mode

### HTTPS Issues
- **Automatic**: Vercel handles HTTPS automatically
- **SSL Certificate**: Should be provisioned within minutes
- **Force HTTPS**: Vercel redirects HTTP to HTTPS automatically

### WWW vs Non-WWW
- **Both Work**: Both `jivverr.com` and `www.jivverr.com` will work
- **Redirects**: Vercel handles redirects automatically
- **SEO**: Both versions are treated equally

## Security Headers

The app includes security headers configured in `vercel.json`:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information

## Monitoring

### Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor traffic and performance
- Track domain-specific metrics

### Domain Health
- Regular DNS checks
- SSL certificate monitoring
- Uptime monitoring

## Support

If you encounter issues:
1. Check Vercel's [Domain Troubleshooting Guide](https://vercel.com/docs/concepts/projects/custom-domains)
2. Contact your domain registrar for DNS issues
3. Check Vercel status page for service issues

## Next Steps

After domain setup:
1. Update Firebase Auth domains to include `jivverr.com`
2. Test authentication flows on the new domain
3. Update any hardcoded URLs in your app
4. Set up monitoring and analytics

---

**Note**: This setup ensures your Medalyzer app is accessible at `jivverr.com` with proper security, performance, and SEO optimization. 