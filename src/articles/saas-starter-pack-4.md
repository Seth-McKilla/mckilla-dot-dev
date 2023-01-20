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

## Setting up Auth.js

## Configuring Sendgrid SMTP

## Updating frontend authentication status

## Creating the middleware

## Wrapping up & next steps
