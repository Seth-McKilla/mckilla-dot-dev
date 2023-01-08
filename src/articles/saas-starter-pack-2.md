---
author: Seth McCullough
datetime: 2023-01-08T14:00:00Z
title: 'Connecting a NextJS 13 App to MongoDB Atlas with Vercel'
slug: saas-starter-pack-2
featured: true
draft: true
tags:
  - nextjs
  - typescript
  - mongodb
  - vercel
  - saas-starter-pack
ogImage: ''
description: Learn how to connect a NextJS 13 app to MongoDB with Vercel using the MongoDB Atlas integration.
---

Welcome to the [SaaS (Software as a Service) Starter Pack](https://mckilla.dev/tags/saas-starter-pack) series. In this series we're building a SaaS app from scratch using bleeding edge technologies. The end goal is to have a minimal, ready to deploy application that you can use as a starting point for rapidly prototyping and (hopefully) validating your next SaaS business idea.

This is going to be an ever-evolving series; as the technologies we use change, so will this series. I'll be continually returning to the posts and associated repo to update them as new versions of the technologies are released.

---

In this episode we'll be connecting our NextJS 13 app to MongoDB Atlas with Vercel using the [MongoDB Atlas integration](https://vercel.com/integrations/mongodbatlas). If you haven't already, I recommend you read [Part 1](https://mckilla.dev/posts/saas-starter-pack-1) before continuing.

TL;DR 👉 [SaaS Starter Pack](https://github.com/Seth-McKilla/saas-starter-pack/tree/Part-2)

## Table of contents

## Prerequisites

1. Our app deployed to Vercel from [Part 1](https://mckilla.dev/posts/saas-starter-pack-1)
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
3. The [Vercel CLI](https://vercel.com/docs/cli) installed

## Configure MongoDB Atlas Integration

First things first, let's wire up our app deployed to Vercel with the [MongoDB Atlas integration](https://vercel.com/integrations/mongodbatlas) 👈 Go ahead and click that hyperlink and select the "Add Integration" button in the top right corner.

![Add atlas integration](https://res.cloudinary.com/dsysvier5/image/upload/v1673093754/saas-starter-pack/Post-2/add-atlas-integration_p4rmsl.png)

_Note: This configuration only needs to be done once per Vercel account, if you see "Configure" instead of "Add Integration, scroll down to the "Access" section of the page and click "Manage Access" to add another repository to the integration._

I'm going to assume that you haven't used the MongoDB Atlas integration before since you're reading this blog post 😅 If you have used it before, you can skip to the next section.

The next few steps are pretty self explanatory, so rather than overloading you with screenshots, I'll just briefly summarize each step:

1. Select your Vercel Scope (if you have multiple Vercel accounts)
2. Select your deployed Vercel Project from [Part 1](https://mckilla.dev/posts/saas-starter-pack-1) (I prefer this over the "All Projects" option)
3. Select "Add Integration" to begin the MongoDB Atlas OAuth flow
4. Select your MongoDB Atlas account or sign up for a new one
5. Choose "Create a new Atlas organization" (I prefer a new org for each project to keep things organized)
6. Click "I Acknowledge" to agree to the terms of service (the organization name can be changed later through the MongoDB Atlas dashboard)
7. Select preferred region and then click "Create New Cluster and Return to Vercel"
8. That's it! You now have a MongoDB Atlas cluster and a MongoDB Atlas integration configured for your Vercel project.

If you head over to your Vercel Project Settings page, you should now see that a MONGODB_URI environment variable has been automatically added to your project.

![MongoDB URI environment variable](https://res.cloudinary.com/dsysvier5/image/upload/v1673097001/saas-starter-pack/Post-2/mongo-uri_sc3dxu.png)

## Adding a development database

A development database is crucial for testing and developing locally without affecting your production database. Let's add a development database to our MongoDB Atlas project through the online Atlas dashboard.

### Updating the organization settings

Head on over to the [MongoDB Atlas dashboard](https://cloud.mongodb.com/), log in with the same email you used to sign up for the integration, and make sure that you're in the correct organization.

![Atlas Organization](https://res.cloudinary.com/dsysvier5/image/upload/v1673179904/saas-starter-pack/Post-2/atlas-org_vfuyhe.png)

Let's change the organization name to something more descriptive, like "SaaS Starter Pack". Click the gear icon next to the organization name (or "Settings" in the side navbar), then the pencil icon in the "Organization Name" card to change the name to whatever you'd like.

### Creating a development database

Now that we've updated the organization name, let's create a development database. You could either create a new cluster or a new project, I personally prefer the latter so we'll do that. First, let's rename the existing project that's already setup to "ssp-production" (or whatever you'd like) and then create a new project called "ssp-development".

![Create Atlas Development Database](https://res.cloudinary.com/dsysvier5/image/upload/v1673181011/saas-starter-pack/Post-2/new-atlas-project_n1ucog.gif)

Next, create a new database using that big green "Build a Database" button. Choose the Shared Cluster option on the right and then you can simply keep all the default settings and click "Create Cluster".

We're going to authenticate our connection using a username and password. Choose a username, and then select "Autogenerate Secure Password" to generate a secure password. Then click "Create User".

⚠️ Make sure to copy and save these credentials somewhere safe, you'll need them later!

![Atlas Development Database Credentials](https://res.cloudinary.com/dsysvier5/image/upload/v1673181642/saas-starter-pack/Post-2/atlas-user-password_tcrznq.png)

Last but not least, we need to configure the network access to our database. Choose the "My Local Environment" option and to keep things simple, we're going to whitelist all IP addresses. Type in 0.0.0.0/0, add a description, and click "Add Entry".

![Atlas IP Whitelist](https://res.cloudinary.com/dsysvier5/image/upload/v1673182458/saas-starter-pack/Post-2/ip-whitelist_muzuwf.png)

I find this is the easiest and least error prone method for getting started. And this is a development database so we're not working with sensitive data.

Once all this is done, the "Finish and Close" button should be enabled. Click it and you should be taken back to the MongoDB Atlas dashboard.

While we're here, let's add some dummy data to our development database so we can test out our app locally. Click the "Browse Collections" button on the cluster card, then click the "Add My Own Data" button. Enter "main" for the database name and "test" for the collection name, then click "Create Database". Copy and paste the following JSON into the text box and click "Insert Document".

```json
{
  "message": "I guess this actually works!"
}
```

![Add dummy data](https://res.cloudinary.com/dsysvier5/image/upload/v1673186459/saas-starter-pack/Post-2/add-data_nedeyi.gif)

## Syncing environment variables using Vercel CLI

While we're still here in the Atlas dashboard, let's go ahead and copy our development database connection string. Click the "Connect" button on the cluster, then "Connect Your Application", choose the second option "Connect your application", and then copy the connection string under section 2.

![Atlas Connection String](https://res.cloudinary.com/dsysvier5/image/upload/v1673183125/saas-starter-pack/Post-2/connection-string_vrisoy.png)

Now let's head back over to Vercel to add this database connection string as an environment variable. First, update the existing MONGODB_URI environment variable to not include the "development" environment.

![Vercel Production Environment Variable](https://res.cloudinary.com/dsysvier5/image/upload/v1673183467/saas-starter-pack/Post-2/vercel-prod-connection-string_gpvrhj.png)

Then scroll up and add a new environment variable with the same exact name (MONGODB_URI) and paste in the connection string we copied from Atlas.

⚠️ Make sure to replace the `<password>` placeholder with the password you generated earlier!

![Vercel Development Environment Variable](https://res.cloudinary.com/dsysvier5/image/upload/v1673183690/saas-starter-pack/Post-2/vercel-dev-connection-string_mphbia.png)

Click save and you're done! Now we can finally get back into our IDE!

### Linking our Vercel project

For this section, make sure that you have the [Vercel CLI](https://vercel.com/docs/cli) installed and that you're logged in to your Vercel account using the `vercel login` command in your terminal.

First, let's link our Vercel project to our local project. Navigate to the root of your project and run the following command:

```bash
vc link
```

Follow the prompts to complete the linking process. Once that's done, you should see a `.vercel` folder in the root of your project.

```bash
Vercel CLI 25.1.0
? Set up “~/src/side-projects/saas-starter-pack”? [Y/n] y
? Which scope should contain your project? Seth McCullough
? Found project “seth-mckilla/saas-starter-pack”. Link to it? [Y/n] y
✅  Linked to seth-mckilla/saas-starter-pack (created .vercel)
```

### Pulling our environment variables

Now we can use the following beautiful command to pull down all of our "development" environment variables from Vercel and add them to our local `.env.local` file.

```bash
vc env pull .env.local
```

If you open up the newly created `.env.local` file, you should see the development MONGODB_URI environment variable that we added to Vercel earlier. Nifty!

Going forward, I strongly encourage changing your mindset to enter all environment variables through your Vercel dashboard and pulling from there. It has saved me so much time and headache having a single source of truth for environment variables.

## Consuming data in our app

## Wrapping up & next steps
