---
author: Seth McCullough
datetime: 2023-01-08T14:00:00Z
title: 'Connecting a NextJS 13 App to MongoDB with Vercel'
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

## Table of contents

## Prerequisites

## Deploying to Vercel

Wait, what about setting up MongoDB?! Worry not, Vercel has a seamless [MongoDB Atlas integration](https://vercel.com/integrations/mongodbatlas) that we'll be using after deploying to have a MongoDB database ready to go.

### Deploy

First, we need to create a new project on Vercel. This can be done by clicking the "Add New..." dropdown button on the [Vercel dashboard](https://vercel.com/dashboard) and selecting "Project".

![New Vercel Project](/assets/images/posts/saas-starter-pack-1/vercel-new-project.png)

Next, we need to connect our GitHub repo to Vercel. This can be done by clicking the "Import Project" button on the Vercel dashboard and selecting the "From Git Repository" option.

![Vercel import repo](/assets/images/posts/saas-starter-pack-1/vercel-import-repo.png)

Then simply click the big blue "Deploy" button to ship the app to production and automatically get a publicly accessible URL! 🎉

### MongoDB Atlas Integration

The last step is to add the [MongoDB Atlas integration](https://vercel.com/integrations/mongodbatlas) 👈 Go ahead and click that hyperlink and select the "Add Integration" button in the top right corner.

![Add atlas integration](/assets/images/posts/saas-starter-pack-1/add-atlas-integration.png)

The next few steps are pretty self explanatory, so rather than overloading you with screenshots, I'll just summarize the steps:

#### New Atlas integration

1. Select your Vercel Scope (your Vercel account where the repo we just deployed is located). Note: if you see that the integration is already installed, switch to the "Configure existing Atlas integration" section below.
2.

#### Configure existing Atlas integration
