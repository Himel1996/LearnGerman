# Vercel Postgres Setup Guide

This guide will help you set up Vercel Postgres for storing feedback from your Learn German app.

## Step 1: Create Vercel Postgres Database

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (or create one if you haven't)
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a name for your database (e.g., "learngerman-db")
7. Select a region closest to your users
8. Click **Create**

## Step 2: Run the Database Migration

After creating the database, you need to create the `feedback` table:

### Option A: Using Vercel Dashboard (Recommended)

1. In your Vercel project, go to the **Storage** tab
2. Click on your Postgres database
3. Go to the **Data** or **SQL** tab
4. Copy and paste the SQL from `sql/init.sql`:

```sql
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_email ON feedback(email);
```

5. Click **Run** or **Execute**

### Option B: Using Vercel CLI

1. Install Vercel CLI if you haven't: `npm i -g vercel`
2. Login: `vercel login`
3. Link your project: `vercel link`
4. Run the SQL file:
   ```bash
   vercel postgres execute sql/init.sql
   ```

## Step 3: Environment Variables

Vercel automatically adds the following environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

These are automatically available in your Vercel deployments. The `@vercel/postgres` package uses these automatically.

## Step 4: Test the Integration

1. Deploy your app to Vercel (or use `vercel dev` for local testing)
2. Go to the Contact page
3. Submit a test feedback
4. Check your Vercel Postgres database to see if the feedback was saved

## Step 5: View Feedback (Optional)

You can view all feedback entries in your Vercel dashboard:
1. Go to **Storage** → Your Postgres database
2. Click on the **Data** tab
3. Select the `feedback` table
4. View all submitted feedback

## Troubleshooting

### Error: "relation 'feedback' does not exist"
- Make sure you've run the SQL migration (Step 2)
- The table needs to be created before the API can save data

### Error: "Connection refused" or "Database connection failed"
- Check that your Vercel Postgres database is active
- Verify environment variables are set in Vercel dashboard
- Make sure you're using the correct database region

### Local Development
- For local development, you can use `vercel env pull` to get environment variables
- Or use `vercel dev` which automatically handles environment variables

## Free Tier Limits

Vercel Postgres Free Tier includes:
- 256 MB storage
- 60 hours compute/month
- Perfect for feedback forms (can store thousands of entries)

## Next Steps

- Consider adding an admin page to view feedback
- Set up email notifications for new feedback
- Add rate limiting to prevent spam

