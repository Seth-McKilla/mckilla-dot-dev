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

In this episode we'll be connecting our NextJS 13 app to MongoDB with Vercel using the [MongoDB Atlas integration](https://vercel.com/integrations/mongodbatlas). If you haven't already, I recommend you read [Part 1](https://mckilla.dev/saas-starter-pack-1) before continuing.

TL;DR - here's the snapshot of the repo with the below steps completed 👉 [SaaS Starter Pack](https://github.com/Seth-McKilla/saas-starter-pack/tree/Part-2)

## Table of contents

## Prerequisites

1. Everything from [Part 1](https://mckilla.dev/saas-starter-pack-1)
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

### MongoDB Atlas Integration

First things first, let's wire our app deployed to Vercel with the [MongoDB Atlas integration](https://vercel.com/integrations/mongodbatlas) 👈 Go ahead and click that hyperlink and select the "Add Integration" button in the top right corner.

![Add atlas integration](/assets/images/posts/saas-starter-pack-1/add-atlas-integration.png)

The next few steps are pretty self explanatory, so rather than overloading you with screenshots, I'll just summarize the steps for both the new and existing Atlas integration flows:

#### New Atlas integration

1. Select your Vercel Scope (your Vercel account where the repo we just deployed is located). Note: if you see that the integration is already installed, switch to the "Configure existing Atlas integration" section below.
2.

#### Configure existing Atlas integration
