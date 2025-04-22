FROM node:18-alpine AS base

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm  install --legacy-peer-deps

# Copy the rest of your application files into the container
COPY . .

# Build the Next.js app for production
RUN npm run build

# Expose port 3000 for the Next.js app
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["npm", "start"]
