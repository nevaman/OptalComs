# OptalComs

## Development

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
npm run preview
```

## Deployment

This application uses client-side routing with React Router's BrowserRouter. The routing configuration has been set up for common deployment platforms:

### Netlify / Render / Surge
The `public/_redirects` file is already configured. No additional setup needed.

### Vercel
The `vercel.json` file is already configured. No additional setup needed.

### Apache
Add this to your `.htaccess` file:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Nginx
Add this to your nginx configuration:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Docker / Node.js Server
Use a simple static server like `serve`:
```bash
npx serve -s dist -l 3000
```

## Project Structure

- `/src/pages` - Public-facing pages
- `/src/pages/admin` - Admin panel pages
- `/src/components` - Reusable components
- `/src/lib` - Utilities and data stores
- `/supabase/migrations` - Database migrations
