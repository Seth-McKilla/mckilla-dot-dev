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

## Syncing environment variables

## Consuming data in our app

## Wrapping up & next steps
