# Talk in Corporate
## How do you professionally say...?

This API returns what you might mean to say, what it should sound like in "corporate speech", and a category for that entry. It's meant in good fun and inspired by the content of [Laura](https://www.instagram.com/loewhaley/) on Instagram and TikTok.

Entries can also be submitted, viewed, searched, and sorted by category on the project's main page.



## Table of Contents

* [Talk in Corporate](#talk-in-corporate)
* [Table of Contents](#table-of-contents)
* [Links](#links)
* [Screenshots](#screenshots)
+ [Home Page](#home-page)
* [Tech Stack](#tech-stack)
* [How it's made](#how-its-made)
* [Run Locally](#run-locally)
* [Running Tests](#running-tests)
* [Environment Variables](#environment-variables)
* [Lessons Learned](#lessons-learned)
* [Roadmap](#roadmap)
* [Authors](#authors)
* [Acknowledgements](#acknowledgements)

## Links

- [**Website**](https://talkincorporate.up.railway.app)
- [API documentation (on website)](https://talkincorporate.up.railway.app/doc)
- [API documentation (on Swagger)](https://app.swaggerhub.com/apis-docs/raissa-k/talk-in_corporate/1.0.0)

## Screenshots

<details><summary>

### Home Page

</summary>

![screenshot of the home page](https://user-images.githubusercontent.com/91985540/182052320-7383fd9f-567c-4eec-91ef-68ab8721812a.png)

</details>

![Gif animation of navigating through the project](https://user-images.githubusercontent.com/91985540/197550545-684bcd2a-7cf5-4895-96fe-761f44400db4.gif)

## Tech Stack

**Client:** HTML, CSS, JavaScript

**Server:** Node, Express, MongoDB/Mongoose

## How it's made

Due to the simplicity of the website, I used pure CSS with *grid* and *flexbox* to make it light and responsive without media queries.

On the back end, the Express framework adds readability to NodeJS and makes it easy to integrate with the EJS template engine. Not only that, but the process of creating routes and controllers is very straightforward.

Mongoose was chosen for out-of-the-box validation and abstraction of most of the MongoDB code. Its Schemas are an interesting practice of the M (models) of an MVC system.

## Run Locally

Clone the project

```bash
  git clone https://github.com/raissa-k/talkincorporate.git
```
Install dependencies

```bash
  npm install
```

Start the server

* Development
```bash
  npm run dev
```
* Production
```bash
  npm start
```
## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Environment Variables

To run this project, add the following environment variables to your `.env` file in `/config/.env`

A `.env.example` file is supplied inside the `config` folder.

The `TEST_MONGODB_URL` variable is only required for tests and is optional.

```bash
MONGODB_URL=
TEST_MONGODB_URL=
PORT=3000
```

## Lessons Learned

This was a great practice in MVC architecture. As I began building this project, the server.js file started to become difficult to read and keep in order, and so creating separate routes and controllers for the API and page renders helped keep it neat and still open to further improvement.

## Roadmap

- [ ]  Add authentication methods
- [ ]  Clean and minimize .css and .js files
- [x]  Add tests

## Authors

- [@raissa-k](https://www.github.com/raissa-k)

## Acknowledgements

- [Laura](https://www.instagram.com/loewhaley/) for the content.
- [apiDOC](https://apidocjs.com/) for the base of the documentation page on Replit.
- [SwaggerHub](https://swagger.io/tools/swaggerhub/) for the hosted, interactive documentation.
