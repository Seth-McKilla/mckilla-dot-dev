---
author: Seth McCullough
datetime: 2023-01-18T13:00:00Z
title: Creating a simple application template with TailwindUI and React Server Components
slug: saas-starter-pack-3
featured: true
draft: false
tags:
  - typescript
  - nextjs
  - tailwindui
  - react-server-components
  - saas-starter-pack
ogImage: 'https://res.cloudinary.com/dsysvier5/image/upload/v1674046236/saas-starter-pack/Post-3/og-ssp-3_qdyl4n.jpg'
description: 'Learn how to create a navbar and sign-in page with Tailwindcss and TailwindUI'
---

Welcome to the [SaaS (Software as a Service) Starter Pack](https://mckilla.dev/tags/saas-starter-pack) series. In this series we're building a SaaS app from scratch using bleeding edge technologies. The end goal is to have a minimal, ready to deploy application that you can use as a starting point for rapidly prototyping and (hopefully) validating your next SaaS business idea.

This is going to be an ever-evolving series; as the technologies we use change, so will this series. I'll be continually returning to the posts and associated repo to update them as new versions of the technologies are released.

---

In [Part 2](https://mckilla.dev/posts/saas-starter-pack-2) we deployed our app to Vercel and connected it to MongoDB Atlas using the Vercel integration. In this post we're going to be introducing [Auth.js](https://authjs.dev/) to authenticate our users on the edge with the help of NextJS 13 middleware. We'll be using SendGrid to setup passwordless email sign in. Let's get to it!

TL;DR 👉 [SaaS Starter Pack](https://github.com/Seth-McKilla/saas-starter-pack/tree/Part-3)

## Table of contents

## Prerequisites

1. A new, blank, Typescript NextJS application (See [Part 1](https://mckilla.dev/posts/saas-starter-pack-1))

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
import Button from '@/components/Button';

export default function UserMenu() {
  let authenticated = false;

  return authenticated ? (
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
  ) : (
    <Link href="/sign-in">
      <Button>Sign in</Button>
    </Link>
  );
}
```

_Note: the `authenticated` variable is just a placeholder for now. We'll be coming back to this component later to add some logic to determine whether or not the user is logged in after we setup Auth.js._

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

We've also added a `Button` component to a new `components` directory. This global components directory at the root level of the `app` directory is a great place to store components that are going to be used in multiple places throughout the app.

```tsx
// app/components/Button.tsx

'use client';

import type { ButtonHTMLAttributes } from 'react';

export default function Button({
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md group"
      {...rest}
    >
      {children}
    </button>
  );
}
```

Let's not forget to update our `tsconfig.json` file to add the new `components` directory to the `paths` array!

```json
// tsconfig.json

{
  "compilerOptions": {
    ...
    "paths": {
      ...
      "@/components/*": ["./app/components/*"]
    }
  }
}
```

Now we no longer need to use the "use client" directive in our `Navbar.tsx` component. Let's go ahead and remove it and import the `UserMenu` component instead.

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

We can't forget to actually import the `Navbar` component into our `Layout` component so we render it on the screen!

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

Okay, let's save some time writing our own sign-in page by leverage publicly available resources again. We're going to use a stripped down version of the [TailwindUI "Simple no labels" Sign-In Form](https://tailwindui.com/components/application-ui/forms/sign-in-forms#component-55b9c2097342175b8ddfccf8a30fb68f) for our login page. We're going to be using the Magic Link sign in method, so we don't need to worry about a password field.

Let's start off by creating a new page in the app directory to hold this page and it's associated components. Remember, with the app directory this is done by adding a new folder with the page name and then a `page.tsx` file inside of it.

Using the same client / server component pattern as the `Navbar.tsx` file above, we have the following:

```tsx
// app/sign-in/page.tsx

import SignInForm from './SignInForm';
import Logo from '@/components/Logo';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col justify-center text-center">
          <Logo />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            {
              "No account? No problem. Enter your email and we'll create an account for you and send you a link to sign in."
            }
          </p>
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
```

As you can see we're importing two components: `SignInForm` and `Logo`. Let's go ahead and create those now.

Although `Logo` is actually a server component, this is the second time we're using it (also used in `Navbar.tsx` above) so I think it's a good idea to move it to a global `components` directory.

```tsx
// app/components/Logo.tsx

export default function Logo() {
  return <p className="text-3xl font-bold">SSP</p>;
}
```

_This will be swapped out with an actual logo in the future._

The `SignInForm` component is going to be a client component housed in the same directory as the `page.tsx` file since it's only going to be used on this page.

```tsx
// app/sign-in/SignInForm.tsx

'use client';

import { LockClosedIcon } from '@heroicons/react/20/solid';

import Button from '@/components/Button';
import Input from '@/components/Input';

export default function SignInForm() {
  return (
    <form className="mt-8 space-y-6" action="#" method="POST">
      <Input
        id="email-address"
        name="email"
        label="Email address"
        type="email"
        required
      />

      <Button type="submit">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <LockClosedIcon
            className="w-5 h-5 text-gray-500"
            aria-hidden="true"
          />
        </span>
        Sign in
      </Button>
    </form>
  );
}
```

This form will also require the `@tailwindcss/forms` plugin to be installed and added to the `tailwind.config.js` file. This plugin provides a basic reset for form styles that makes form elements easy to override with utilities.

```bash
pnpm add -D @tailwindcss/forms
```

```js
// tailwind.config.js

module.exports = {
  ...
  plugins: [require('@tailwindcss/forms')],
};
```

Also notice that we've got two additional components imported into the `SignInForm` component: the previously create `Button` and a new `Input`. The `Input` component is a simple wrapper around the `input` element that adds some Tailwind classes to make it look nice. This component will very likely be used again so let's go ahead and add it the `components` directory.

```tsx
// app/components/Input.tsx

'use client';

import type { InputHTMLAttributes } from 'react';

type Props = {
  id: string;
  name: string;
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({ id, name, label, ...rest }: Props) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={name}
        placeholder={label}
        className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none sm:text-sm"
        {...rest}
      />
    </div>
  );
}
```

Two last minor things to update before wrapping this post up. We need to replace the logo within the `Navbar.tsx` component with the new `Logo` component and update the root page to make a little more sense rather than rendering data from the database.

```tsx
// app/Nabvar.tsx

import Link from 'next/link';

import UserMenu from './UserMenu';
import Logo from '@/components/Logo';

export default function Navbar() {
  return (
    <nav className="fixed w-full bg-gray-100">
      <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-stretch justify-start flex-1">
            <Link href="/" style={{ cursor: 'pointer' }}>
              <Logo />
            </Link>
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

```tsx
// app/page.tsx

import Link from 'next/link';

import Button from '@/components/Button';

export default async function Home() {
  return (
    <div className="grid h-screen place-items-center">
      <div>
        <h1 className="mb-8 text-3xl font-bold text-center">
          Welcome to the SaaS Starter Pack
        </h1>
        <div className="flex justify-center">
          <div className="w-40">
            <Link href="/sign-in">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

You should now have something that looks similar to this

![Sign in page](https://res.cloudinary.com/dsysvier5/image/upload/v1674045241/saas-starter-pack/Post-3/demo_nmdcge.gif)

It's starting to look like an actual app now! 🎉

[💻 commit](https://github.com/Seth-McKilla/saas-starter-pack/tree/32939e607b9e27ed46639ebccda12d3a34f2ab26)

## Wrapping up & next steps

In this post we've gotten some basic components setup and added a sign in page. We've learned the basics of when to use React server components versus client components. The app is in a great spot for the next exciting topic...

Next up, we're going to tackle a tough one: 🔒 Authentication. Our weapon of choice is going to be the amazing [Auth.js](https://authjs.dev/) package to authenticate users on the edge 🔪 Stay tuned!
