---
author: Seth McCullough
datetime: 2023-01-12T14:00:00Z
title: 'Authenticate users on the edge with Auth.js and NextJS 13'
slug: saas-starter-pack-3
featured: true
draft: true
tags:
  - typescript
  - nextjs
  - tailwindcss
  - tailwindui
  - auth.js
  - mongodb
  - sendgrid
  - edge
  - middleware
  - saas-starter-pack
ogImage: ''
description: 'Learn how to use Auth.js with NextJS 13 middleware to authenticate users on the edge.'
---

Welcome to the [SaaS (Software as a Service) Starter Pack](https://mckilla.dev/tags/saas-starter-pack) series. In this series we're building a SaaS app from scratch using bleeding edge technologies. The end goal is to have a minimal, ready to deploy application that you can use as a starting point for rapidly prototyping and (hopefully) validating your next SaaS business idea.

This is going to be an ever-evolving series; as the technologies we use change, so will this series. I'll be continually returning to the posts and associated repo to update them as new versions of the technologies are released.

---

In [Part 2](https://mckilla.dev/posts/saas-starter-pack-2) we deployed our app to Vercel and connected it to MongoDB Atlas using the Vercel integration. In this post we're going to be introducing [Auth.js](https://authjs.dev/) to authenticate our users on the edge with the help of NextJS 13 middleware. We'll be using SendGrid to setup passwordless email sign in. Let's get to it!

TL;DR 👉 [SaaS Starter Pack](https://github.com/Seth-McKilla/saas-starter-pack/tree/Part-3)

## Table of contents

## Prerequisites

1. An app deployed to Vercel and connected to MongoDB Atlas (See [Part 2](https://mckilla.dev/posts/saas-starter-pack-2))

## Creating a navigation bar

One of the most important parts of authentication is a way for users to easily know their current authentication status (i.e. are they logged in our out). The navigation bar is the perfect place to display this information.

Let's start by enlisting the help of [TailwindUI](https://tailwindui.com/). TailwindUI is a collection of beautiful, ready to use UI components built with TailwindCSS. It's a great resource for quickly building out the more complex parts of your app without spending a ton of time on the design. The components can also be customized with the tailwindcss classes that you already know and love, so win-win!

First things first, let's install the required packages:

```bash
pnpm add @headlessui/react @heroicons/react
```

_One thing to note going forward is that I'm not going to be diving into the intricacies of tailwindcss or styling in general. The focus of this series is on the technologies that make up a SaaS application. Our end goal is to have an extremely minimal and extensible template to rapidly deploy and validate potential SaaS business ideas._

Okay, enough preamble, let's create a simple navigation called `Navbar.tsx` within our `app` directory. We'll be using a **very** stripped-down version of the example from the [TailwindUI docs](https://tailwindui.com/components/application-ui/navigation/navbars).

```tsx
// app/Navbar.tsx

'use client';

import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { Fragment } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  return (
    <nav className="fixed w-full bg-gray-100">
      <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-stretch justify-start flex-1 text-2xl font-bold cursor-default">
            SSP
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open user menu</span>
                  <UserCircleIcon className="w-10 h-10 text-gray-100" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        Sign out
                      </Link>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

_Note: We'll be coming back to this component later to add some logic to determine whether or not the user is logged in after we setup Auth.js._

This component looks good to go for the time being right? Well, not quite. Remember that NextJS 13 introduces React server components. The goal here is to render as much code from the server as possible and only use client code (designated with the "use client" directive) when absolutely necessary.

This is a great way to improve performance and reduce the amount of code that needs to be sent to the client. When thinking about when to use the "use client" directive, think interactivity. If we want to use react hooks (useState, useEffect, etc.) then that logic needs to be client-side.

The beautiful thing about NextJS is that you can interlace server and client components in any way that you see fit! Check out the [Rendering Fundamental](https://beta.nextjs.org/docs/rendering/fundamentals) from the new NextJS docs to learn more.

So back to the code block above, we can see that we're using the `Menu` component from TailwindUI. This component is interactive and requires the use of react hooks. Therefore, let's extract this portion of JSX to a separate client component called `UserMenu.tsx`.

```tsx
// app/UserMenu.tsx

'use client';

import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { Fragment } from 'react';

import { classNames } from '@/utils/styles';

export default function UserMenu() {
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="sr-only">Open user menu</span>
          <UserCircleIcon className="w-10 h-10 text-gray-100" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                href="#"
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'block px-4 py-2 text-sm text-gray-700'
                )}
              >
                Profile
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href="#"
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'block px-4 py-2 text-sm text-gray-700'
                )}
              >
                Settings
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href="#"
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'block px-4 py-2 text-sm text-gray-700'
                )}
              >
                Sign out
              </Link>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
```

Notice that we also extracted the `classNames` utility function (for dynamically creating tailwindcss classNames) to a separate file called `styles.ts` in the `utils` directory. This is a great way to keep your code DRY and modular. We will no doubt be using this function in other components.

```tsx
// utils/styles.ts

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
```

Don't forget to add the `utils` path to the `tsconfig.json` file.

```json
// tsconfig.json

{
  "compilerOptions": {
    ...
    "paths": {
      ...
      "@/utils/*": ["./utils/*"]
    }
  }
}
```

Now we no longer need to use the "use client" directive in our `Navbar.tsx` component. Let's go ahead and remove it and import the `UserMenu` component.

```tsx
// app/Navbar.tsx

import UserMenu from './UserMenu';

export default function Navbar() {
  return (
    <nav className="fixed w-full bg-gray-100">
      <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-stretch justify-start flex-1 text-2xl font-bold cursor-default">
            SSP
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
```

Now we can't forget to actually import the `Navbar` component into our `Layout` component so we render it on the screen!

```tsx
// app/Layout.tsx

import './globals.css';
import { Inter } from '@next/font/google';

import Navbar from './Navbar';

const inter = Inter();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head />
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

This layout component will shared with every page in our application, so we can safely set it and forget it 😁

Okay, looking pretty good! One last thing you may have noticed is that the Inter font styles are not being applied to the TailwindUI components. We can fix this pretty easily by extending the theme in our `tailwind.config.js` file to include Inter:

```js
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
```

Onward to the login page!

[💻 commit](https://github.com/Seth-McKilla/saas-starter-pack/tree/ad6d63d1f88fc3ab819a9869c47d9944761b2179)

## Setting up the login page

## Adding Auth.js

## Configuring middleware

## Creating a protected route

## Wrapping up & next steps

```

```
