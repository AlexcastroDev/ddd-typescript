# DDD with Typescript

This is a small example, just to hands-on.

# How to test

## With Docker

```bash
docker run -v $(pwd):/usr/src/app -w /usr/src/app node:20 /bin/bash -c "yarn && yarn test"
```

## Locally

### Install dependencies

```bash
yarn
```

### Run test

```bash
yarn test
```
