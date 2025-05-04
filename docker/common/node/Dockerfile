# Define the Node.js version
ARG NODE_VERSION=23

# Use Alpine for a smaller image size
FROM node:${NODE_VERSION}-alpine AS base

# Set port and host as environment variables
ARG NODE_PORT
ENV PORT=$NODE_PORT
ENV HOST=0.0.0.0

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Build stage
FROM base AS build

# Copy only package.json and pnpm-lock.yaml for dependency caching
COPY package.json pnpm-lock.yaml /app/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . /app

# Build the application
RUN pnpm run build

# Development stage
FROM base AS development

# Set environment to development
ENV NODE_ENV=development

# Copy built application from the build stage
COPY --from=build /app /app

# Expose the application port
EXPOSE $NODE_PORT

# Command to run the development server
CMD ["pnpm", "run", "dev"]
