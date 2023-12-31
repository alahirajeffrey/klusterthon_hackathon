# Group 174 Klusterthon Hackerthon Backend Code

This repo contains the backend code for the Group 174 Klusterthon Hackerthon project

## Problem Statement

Develop a digital solution to improve medication adherence for chronic patients. The solution should empower healthcare professionals and patients to manage medication regimens effectively.

## Requirements

- Patients should be able to enter their medication details and set up reminders.
- Create a simple system to track if patients are taking their meds on time.
- Design a basic backend for managing patient data.
- Make it easy for healthcare providers to access basic adherence reports.

## User Flow

- Healthcare professionals diagnose patients and setup medication for patients
- Reminders are then created for the medication
- Every 15 minutes, a cron job checks to see if there are reminders within that time period
- A text message is sent to remind user's to take their drugs

## Potential Improvement

- Use of push notification for user's with smart phones
- Integrate notifcation in user's calender

## Requirements

- [Nodejs](https://nodejs.org/en/) is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Typescript](https://www.typescriptlang.org/) is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- [Nestjs](https://nestjs.com/) is a progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [Mongodb](https://www.mongodb.com/) is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas

## How to Setup Locally

Ensure you have all the requirements

### Cloning Repo

```bash
$ git clone https://github.com/alahirajeffrey/klusterthon_hackathon.git
```

### Installation

```bash
$ npm install
```

### Setting up

- Create a .env file at the root of the application.
- Copy the content of the .env.example file to the newly created .env file
- Fill appropraitely

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
