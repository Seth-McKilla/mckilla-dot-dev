---
author: Seth McCullough
datetime: 2023-01-05T14:00:00Z
title: 'TypeScript, NextJS 13, Tailwindcss, and Vercel: The Full Stack Dream Team'
slug: saas-starter-pack-1
featured: false
draft: false
tags:
  - typescript
  - nextjs
  - tailwindcss
  - vercel
  - saas-starter-pack
ogImage: 'https://res.cloudinary.com/dsysvier5/image/upload/v1672928874/saas-starter-pack/Post-1/ssp-1-og_gqqr1i.jpg'
description: Learn how to set up a repository with TypeScript, NextJS 13, Tailwindcss, deployed to Vercel for efficient and effective full stack development.
---

Welcome to the [SaaS (Software as a Service) Starter Pack](https://mckilla.dev/tags/saas-starter-pack) series. In this series we're building a SaaS app from scratch using bleeding edge technologies. The end goal is to have a minimal, ready to deploy application that you can use as a starting point for rapidly prototyping and (hopefully) validating your next SaaS business idea.

This is going to be an ever-evolving series; as the technologies we use change, so will this series. I'll be continually returning to the posts and associated repo to update them as new versions of the technologies are released.

---

In this pilot episode we'll be setting up a repository with TypeScript, NextJS 13 (with the experimental /app directory), Tailwindcss, and finally deploying it to Vercel.

TL;DR 👉 [SaaS Starter Pack](https://github.com/Seth-McKilla/saas-starter-pack/tree/Part-1)

## Table of contents

## Prerequisites

- [Node.js](https://nodejs.org/en/)
- [IDE](https://code.visualstudio.com/) (I'll be using VS Code)
- [Package Manager](https://pnpm.io/) (I'll be using pnpm)
- [git](https://git-scm.com/)
- [GitHub Account](https://github.com/)
- [Vercel Account](https://vercel.com/)

## Initializing the TypeScript NextJS 13 App and pushing to GitHub

First, we need to initialize a NextJS 13 app with TypeScript and the experimental app directory. To do this, we will use the [create-next-app](https://nextjs.org/docs/api-reference/create-next-app) command.

```bash
pnpm create next-app@latest --experimental-app --typescript saas-starter-pack
```

_Note: Select 'yes' when prompted to use ESLint._

This will create a new directory called `saas-starter-pack` and initialize a NextJS 13 app with TypeScript and the experimental app directory. Now simple change into the directory, open it in your favorite IDE, and start the development server.

```bash
cd saas-starter-pack
code .
pnpm dev
```

_Note: Make sure to select 'Yes' when the following VS Code prompt appears:_

> This workspace contains a TypeScript version. Would you like to use the workspace TypeScript version for TypeScript and JavaScript language features?

This plugin adds a lot of nifty TypeScript [features](https://beta.nextjs.org/docs/configuring/typescript#plugin-features) to VS Code.

Now you should be able to navigate to [http://localhost:3000](http://localhost:3000) and see the default NextJS 13 app.

Finally, let's create a new repository on GitHub (I'm naming mine the same as local: "saas-starter-pack") and copy the second set of commands from the GitHub repo creation page. Here's mine for reference:

```bash
git remote add origin https://github.com/Seth-McKilla/saas-starter-pack.git
git branch -M main
git push -u origin main
```

Your repo is now initialized locally & remotely. Boring tasks are officially done ✅ on to the fun stuff!

[💻 commit](https://github.com/Seth-McKilla/saas-starter-pack/tree/3a503138d86cc415cb83f5b151467571748615c1)

## Adding Tailwindcss

Next up is adding Tailwindcss. Lucky for us, Tailwind has exactly what we need: [Adding Tailwindcss to NextJS using the app directory](https://tailwindcss.com/docs/guides/nextjs#app-directory).

⚠️ Ignore step 1 as we've already done this.

Rather than rehashing the Tailwindcss docs, checkout the below commit which has all these steps completed & boilerplate removed.

[💻 commit](https://github.com/Seth-McKilla/saas-starter-pack/tree/e1d73a4b429f8aea9e1d6766483d644cf1369d89)

## Font customization

I'm an [Inter](https://fonts.google.com/specimen/Inter) fanboy so I'm going to use that as my custom font. To do this, we first need to install @next/font.

```bash
pnpm add @next/font
```

Then we simply import the font, instantiate it, and add it to our root html element.

```tsx
// app/layout.tsx

import './globals.css';
import { Inter } from '@next/font/google';

const inter = Inter();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head />
      <body>{children}</body>
    </html>
  );
}
```

While we're here, let's also add a few styles to the root page to personalize the welcome text (this will be the future landing page of the final SaaS app template).

```tsx
// app/page.tsx

export default function Home() {
  return (
    <h1 className="text-3xl font-bold grid h-screen place-items-center">
      Welcome to the SaaS Starter Pack!
    </h1>
  );
}
```

Last but not least, we need to specify a subset of the font to load. In a nutshell, this is a way to reduce the size of the font file by only loading the characters that we need. This is easily done in the `next.config.js` file.

```js
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
  },
};

module.exports = nextConfig;
```

Looking better already! 🎉

[💻 commit](https://github.com/Seth-McKilla/saas-starter-pack/tree/bf8f43508ac8cb6ecf23291374085334d3afbcec)

## Deploying to Vercel

First, we need to create a new project on Vercel. This can be done by clicking the "Add New..." dropdown button on the [Vercel dashboard](https://vercel.com/dashboard) and selecting "Project".

![New Vercel Project](https://res.cloudinary.com/dsysvier5/image/upload/v1673093734/saas-starter-pack/Post-1/vercel-new-project_ahbvv9.png)

Next, we need to connect our GitHub repo to Vercel. This can be done by clicking the "Import Project" button on the Vercel dashboard and selecting the "From Git Repository" option.

![Vercel import repo](https://res.cloudinary.com/dsysvier5/image/upload/v1673093734/saas-starter-pack/Post-1/vercel-import-repo_nkypgw.png)

Then simply click the big blue "Deploy" button to ship the app to production and automatically get a publicly accessible URL! 🎉

## Wrapping up & next steps

That's it! We've successfully created a Typescript NextJS 13 app with Tailwindcss from scratch and deployed it to Vercel. This is an excellent starting point for diving into the exciting world of SaaS app development.

Next up, we're going to dive into wiring up the app to a database using the seamless [MongoDB Atlas integration](https://vercel.com/integrations/mongodbatlas). Stay tuned!
