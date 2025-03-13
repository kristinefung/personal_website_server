# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Copy the rest of your application code
COPY . .

RUN npx prisma generate

# Build the TypeScript code
RUN npm install -g nodemon

# Expose the port your app runs on
EXPOSE 4000

# Start the application
CMD ["npm", "run", "dev"]