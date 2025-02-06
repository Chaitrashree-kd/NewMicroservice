# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy only the necessary files (instead of copying everything)
COPY public ./public
COPY server.js .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["node","server.js"]