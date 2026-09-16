# strength inventory
**Web application for finding and comparing gym equipment, memberships and opening hours.**

## Status
Preview release is [LIVE](https://official--strength-inventory--dlwys4lx2t96.code.run) and under development.

## Features
- Get a list of gyms by city and sort them by distance to a district within that city
- Conveniently browse equipment, memberships and opening hours of gyms without ever leaving the list
- Responsive design ensures a good experience on all screen sizes
- Light and Dark Mode available
- Experimental Icon Mode
- Admins: A comprehensive admin panel facilitates all database operations

## Stack
Frontend: **React** with **TanStack Router** and **TanStack Query**. All components are hand-made using **tailwindcss**.

Backend: **Express** with **Sequelize** for ORM

Runtime validation and type definitions: **Zod**

Prioritized database: **PostgreSQL** (Postgres-specific implementations are avoided to keep things as plug-and-play as possible with other databases. Sequelize, according to its docs, is compatible with several others.)

## Applied principles
- [HTML-Attribute-Ordering-Standard](https://github.com/lakhbawa/HTML-Attribute-Ordering-Standard/tree/main)
- [Concentric ordering](https://github.com/brandon-rhodes/Concentric-CSS/blob/master/style3.css) of tailwindcss classes
- Screen widths down to 360px accommodated
- Versioning is inspired by [Semantic Versioning](https://semver.org/) with patches turning into minor releases if there is something new added, and major releases representing significant milestones
- The English language, metric units and international/EU links take precedence until internationalization is implemented

## Towards v2.0
strength inventory was born as a university course project with v1.0 being the submitted version. There is one thing v1.x versions fail to facilitate: **database scalability**. Collecting data to this website requires a considerable amount of field work. For each of the four gyms currently in the database, I spent a total of several hours on-site taking photos of everything the location had available. While this is certainly doable across several visits, there needs to be a faster option if this website is ever to become useful.

The solution to this problem is giving gyms **tiers of information**. All the currently added gyms represent the highest tier with each and every piece of equipment added. Below this tier, there will be a few lower tiers which require only certain types of equipment to be counted. This approach provides two benefits: New gyms will be faster to add and the process of collecting data is given clear guidelines with the tiers serving as steps.

In addition to working towards these tiers, v1.x updates will continue to strengthen the foundations of strength inventory by optimizing existing code and adding essential features. The goal is for v2.0 to be a useful product that empowers people in their fitness journeys by means of information.

-Oskar