# strength inventory
**Web application for finding and comparing gym equipment, memberships, and opening hours.**

## Status
Preview release LIVE at https://official--strength-inventory--dlwys4lx2t96.code.run

## Features
- Get a list of gyms by city and sort them by distance to a district within that city
- Conveniently browse equipment, memberships and opening hours of gyms without ever leaving the list
- Responsive design ensures a good experience on all screen sizes
- Light and Dark Mode available
- Experimental Icon Mode
- Admins: A comprehensive admin panel facilitates all database operations

## Stack
Frontend: **React** with **TanStack Router** and **TanStack Query**. All components are hand-made using **tailwindcss**.

Backend: **Express** with **Sequelize** for ORM.

Runtime validation and type definitions: **Zod**

Runtime environment: **Node v24.13.0**

Intended database: **PostgreSQL** (Postgres-specific implementations have been avoided to keep things as plug-and-play as possible with other databases. Sequalize, according to its docs, is compatible with several others.)

## In the TODO list
- Equipment category for amenities
- User account creation and personal features such as managing lists, saving equipment PRs and some type of gamification for motivation
- Internationalization, starting from the Nordic countries