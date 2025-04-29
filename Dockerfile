# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.15.0
ARG PNPM_VERSION=10.10.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /movies

COPY package.json pnpm-lock.yaml ./

RUN npm i -g pnpm@${PNPM_VERSION}
RUN pnpm install

# Copy source code (optional — avoid if mounting in dev)
COPY . .

EXPOSE 3000

CMD ["pnpm", "start:dev"]
