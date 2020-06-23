# Engineering Problems

This repo contains questions you should be able to solve in a reasonable amount of time.
It tests your understanding of JavaScript fundamentals.

Details to this problem is provided in the [Question.md](./Question.md) file.

---

Start by forking this repo, a branch will be created for you in this repository. Solve the problem(s) in your own fork and make a PR when done.

The target branch of your pull request should be your branch (which is your github username)

If timed, your time starts to count from the time your fork is created to the time your pull request is submitted.

---

## Testing locally

You can run the test cases locally by running

```bash
yarn
yarn jest --watch
```

Or if you use npm

```bash
npm install
npm test -- --watch
```

You can elide the `--watch` flag to just run tests

If all tests pass, you have successfully solved the questions.

The solution to question 1 should go in `src/analysis.js`
The solution to question 2 should go in `src/report.js`

_Ensure to write tests as necessary for any utility functions that you create._

---

Do not delete the `node_modules` folder in the `src` folder, it is a hack to get the `api` files to be absolute.

You need the `api` module for the questions.
See documentation for the `api` module at [api.md](./api.md)
