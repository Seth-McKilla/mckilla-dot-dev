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
pnpm add nodemailer
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

SMTP complete! Now on to wiring this up to MongoDB using the NextAuth MongoDB adapter. When using the Email Provider, we need to have a database to store our users in. So let's get that set up next.

## Setting up the MongoDB adapter

NextAuth has a built-in adapter for MongoDB, so first things first, let's install it.

```bash
pnpm add @next-auth/mongodb-adapter
```

Now the only thing left to do is configure the adapter. Let's head over to the `pages/api/auth` directory, open the `[...nextauth].ts` file, and revise the code to the following:

```ts
// pages/api/auth/[...nextauth].ts

import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import EmailProvider from 'next-auth/providers/email';

import clientPromise from '@/lib/mongodb/client';

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.MONGODB_AUTH_DB_NAME,
  }),
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

_Reminder: This code is assuming you've already configured your MongoDB connection from a previous post. If you haven't, check out [Post 2](https://mckilla.dev/posts/saas-starter-pack-2) of this series._

Note that we included the `databaseName` option in the adapter configuration. This is the name of the database we want to store our users in. If you leave this option blank, MongoDB with default to using a database named `test`, which doesn't make things very intuitive. All of our authentication data will be stored in this authentication database while our application data will be stored in the database we configured in the previous post. We'll setup a `config` directory in a future post to easily manage which database we want to interact with.

⚠️ Make sure to add the new `MONGODB_AUTH_DB_NAME` environment variable (with all environment scopes) to your Vercel project and then pull it to your local development environment. Maybe you're getting the hang of this by now 😉

```bash
vc env pull .env.local
```

Now that we've got the adapter wired up, let's update our frontend sign-in form to initiate the authentication flow. We're going to use one of my favorite library combinations for handling forms in React, [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup).

[💻 commit](https://github.com/Seth-McKilla/saas-starter-pack/tree/6773715265c91f6a28b7d056f9b06f543d15be4a)

## Setting up React-Hook-Form

First things first, you guessed it, let's install the required packages for this beautiful combination.

```bash
pnpm add react-hook-form yup @hookform/resolvers
```

Now let's head over to the `components` directory to wire up our existing `SignInForm` component. Open the `SignInForm.tsx` file and revise the code to the following:

```tsx
// app/sign-in/SignInForm.tsx

'use client';

import { LockClosedIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from '@/components/Button';
import Input from '@/components/Input';

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid format of name@example.com')
    .required('Email address is required'),
});
type FormData = yup.InferType<typeof schema>;

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await signIn('email', {
      email: data.email,
      redirect: false,
    });
  };

  return isSubmitSuccessful ? (
    <div className="relative mt-4 w-full">
      <div className="-mt-4 flex w-full items-center justify-center">
        <PaperAirplaneIcon className="h-20 w-20 -rotate-45 text-gray-300" />
      </div>
      <p className="absolute top-0 left-0 text-lg font-bold">
        {
          "We've just sent you an email with a link to sign in! If you don't see it, please check your spam folder."
        }
      </p>
    </div>
  ) : (
    <form className="mt-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <Input
        name="email"
        label="Email address"
        register={register}
        loading={isSubmitting}
        error={errors?.email?.message}
      />

      <Button type="submit" disabled={isSubmitting}>
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <LockClosedIcon
            className="h-5 w-5 text-gray-500"
            aria-hidden="true"
          />
        </span>
        Send sign in link
      </Button>
    </form>
  );
}
```

Let's break down the steps of what's going on here.

1. Import the required packages
2. Define the schema for our form (in this case, just the email field). We're also using the `yup` package to define the schema, so we can use the `InferType` utility to infer the type of the schema. This will allow us to type the react-hook-form `useForm` hook and the `onSubmit` function.
3. Initialize the react-hook-form `useForm` hook and pass in the `yupResolver` to use the `yup` schema we defined. This will allow us to use the `errors` object to display any validation errors.
4. Define the `onSubmit` function to submit the form with the entered email address. We're disabling the default redirect and instead rendering a "check your email" instead of the form on a successful sign-in.
5. Render the form or the "check your email" message depending on the submitted status. We're using the `Input` component we created in the previous post and passing in the `register` function from the react-hook-form `useForm` hook. We're also sending the `loading` and `error` props to the component to display the loading state and any validation errors.

Now we're displaying a nice little message to the user to check their email for the sign-in link!

![Check Email Message](https://res.cloudinary.com/dsysvier5/image/upload/v1675254836/saas-starter-pack/Part-4/check_email_q6nbf9.png)

Last thing before heading on the wiring up the authentication status is to update the `Button` and `Input` components to accept the `loading` and `error` props. I'm just going to paste the updated components here, the changes are pretty minimal, we're basically just adding the ability to disable the button on load and adding a loading, error, and useForm register props to the `Input` component.

```tsx
// app/components/Button.tsx

'use client';

import type { ButtonHTMLAttributes } from 'react';

import { classNames } from '@/utils/styles';

export default function Button({
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      className={classNames(
        'relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md group',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
```

```tsx
// app/components/Input.tsx

'use client';

import type { InputHTMLAttributes } from 'react';
import type { UseFormRegister } from 'react-hook-form';

import { classNames } from '@/utils/styles';

type Props = {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  loading?: boolean;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  name,
  label,
  register,
  loading,
  error,
}: Props) {
  return (
    <>
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      <input
        id={name}
        placeholder={label}
        className={classNames(
          'relative block w-full px-3 py-2 text-gray-900 border rounded-md appearance-none sm:text-sm',
          loading
            ? 'cursor-not-allowed bg-gray-300 animate-pulse'
            : 'cursor-text',
          error
            ? 'border-red-500 placeholder-red-400 focus:ring-red-500 focus:border-red-500 focus:outline-2 focus:outline-red-500 focus:z-10'
            : 'placeholder-gray-500 border-gray-300'
        )}
        disabled={loading}
        {...register(name)}
      />
      {error && (
        <p className="text-sm text-left text-red-500" id={`${name}-error`}>
          {error}
        </p>
      )}
    </>
  );
}
```

On to updating the frontend authentication status!

[💻 commit](https://github.com/Seth-McKilla/saas-starter-pack/tree/214cdbf2c5437289dcaff5aa3fca6464ae73cb7e)

## Updating frontend authentication status

## Creating the middleware

## Wrapping up & next steps

If you have any questions about the code, feel free to reach out to me on Twitter [@sethmckilla](https://twitter.com/sethmckilla).
