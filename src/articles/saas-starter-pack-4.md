---
author: Seth McCullough
datetime: 2023-01-21T08:00:00Z
title: Authenticating users on the edge with Auth.js and NextJS 13 middleware
slug: saas-starter-pack-4
featured: false
draft: true
tags:
  - typescript
  - nextjs
  - authjs
  - middleware
  - mongodb
  - sendgrid
  - saas-starter-pack
ogImage: ''
description: Learn how to use Auth.js to authenticate users on the edge with NextJS 13 middleware.
---

Welcome to the [SaaS (Software as a Service) Starter Pack](https://mckilla.dev/tags/saas-starter-pack) series. In this series we're building a SaaS app from scratch using bleeding edge technologies. The end goal is to have a minimal, ready to deploy application that you can use as a starting point for rapidly prototyping your next SaaS business idea.

This is going to be an ever-evolving series; as the technologies we use change, so will this series. I'll be continually returning to the posts and associated repo to update them as new versions of the technologies are released.

---

In the [last post](https://mckilla.dev/articles/saas-starter-pack-3) we added a sign in page as well as a navbar to display the user's authentication status. In this one we're going to tackle authentication to ensure that only users who are signed in can access the dashboard page. We'll be using a JWT session strategy with [Auth.js](https://authjs.dev) to handle this authentication on the edge. Our app is going to be utilizing magic links for passwordless sign in, so we'll also be needing an email provider to send these links; our weapon of choice is going to be [SendGrid](https://sendgrid.com).

TL;DR 👉 [SaaS Starter Pack](https://github.com/Seth-McKilla/saas-starter-pack/tree/Part-4)

## Table of contents

## Prerequisites

1. A NextJS app connected to a MongoDB Atlas database with a login page and a navbar (see the completed [Part 3](https://mckilla.dev/articles/saas-starter-pack-3) app)
2. A [SendGrid](https://signup.sendgrid.com/) account

If you'd like to pick up where we left off in the previous post, run the following commands:

```bash
git clone https://github.com/Seth-McKilla/saas-starter-pack.git
cd saas-starter-pack
git checkout Part-3
pnpm install
```

## Setting up Auth.js

First things first, let's install the next-auth (Auth.js) package:

```bash
pnpm add next-auth
```

Then let's navigate to the `pages/api/auth` directory and create a new file called `[...nextauth].ts`. This is the file that will handle all of our authentication logic. We'll be using the [JWT session strategy](https://next-auth.js.org/configuration/options#session) for this app so that authentication can be handled on the edge. We'll also be using the [Email Provider](https://next-auth.js.org/providers/email) to send magic links to users for passwordless sign in.

```ts
// pages/api/auth/[...nextauth].ts

import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

export default NextAuth({
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: '/sign-in',
    signOut: '/',
  },
  session: {
    strategy: 'jwt',
  },
});
```

Let's break down each of these options:

- `providers`: This is where we configure the authentication providers we want to use. In this case we're only using the Email Provider, but you can also use providers like Google, Facebook, Twitter, etc. You can find a list of all the available providers [here](https://next-auth.js.org/providers).
- `pages`: This is where we configure the pages that we want to use for the authentication flow. In this case we're using the `/sign-in` page we created in the last post for the sign in page and redirecting users to `/` (homepage) on sign out.
- `session`: This is where we configure the session strategy. In this case we're using the JWT session strategy so that we can handle authentication on the edge.

Now that all of these options are configured, let's wire up SendGrid to add the magic 🪄🔮 to these magic links!

[💻 commit](https://github.com/Seth-McKilla/saas-starter-pack/tree/4529ecc5835f75da10ef37df78d6bc606c56d3c0)

## Configuring Sendgrid SMTP

We're going to be using SendGrid's SMTP service to send our magic links to users, but we'll also need NodeMailer as a peer dependency when using the Email Provider. So let's install that as well:

```bash
pnpm add -D nodemailer
```

Now we can head over to our SendGrid dashboard and grab the SMTP credentials by creating a new API Key from the Settings > API Keys page.

![SendGrid API Key](https://res.cloudinary.com/dsysvier5/image/upload/v1674647309/saas-starter-pack/Part-4/Sendgrid_API_Key_kplrll.png)

Select the "Full Access" permissions and give it a name. Then click the "Create & View" button to view the API Key.

![Create API Key](https://res.cloudinary.com/dsysvier5/image/upload/v1674647654/saas-starter-pack/Part-4/Create_API_Key_jcubqj.png)

⚠️ Copy this value and save it for later! You won't be able to view it again after you leave this page.

Before we leave SendGrid, we need to verify a single sender identity. Head on over to the Settings > Sender Authentication page and click the "Verify a New Sender" button. Enter the required information and follow the necessary steps to verify your sender identity.

![Verify Sender Identity](https://res.cloudinary.com/dsysvier5/image/upload/v1674648943/saas-starter-pack/Part-4/Sender_Authentication_e9ipmo.png)

⚠️ Make sure to take note of the email address you used to verify your sender identity. You'll need this for the next step.

Now we need to configure our environment variables. Head on over to the Vercel dashboard and click the "Environment Variables" button on the left sidebar. Then add the following environment variables.

![SMTP env vars](https://res.cloudinary.com/dsysvier5/image/upload/v1674650216/saas-starter-pack/Part-4/SMTP_env_vars_ngs6y5.png)

The `EMAIL_SERVER_PASSWORD` is the API Key we copied earlier and the `EMAIL_FROM` is the email address we used to verify our sender identity. Also make sure that all scopes are selected for theses variables (production, preview, and development).

Last but not least, let's pull these variables to our local development environment.

```bash
vc env pull .env.local
```

_Note: Before running this command, ensure you have the [Vercel CLI](https://vercel.com/download) installed and your local repo linked to your Vercel project. If you need help with this, check out [Post 2](https://mckilla.dev/articles/saas-starter-pack-2) of this series._

SMTP complete! Now on to wiring this up to MongoDB using the NextAuth MongoDB adapter.

## Setting up the MongoDB adapter

## Updating frontend authentication status

## Creating the middleware

## Wrapping up & next steps

```

```
