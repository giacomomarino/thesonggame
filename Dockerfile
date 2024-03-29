# Use a Node.js base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Build the SolidJS project
RUN npm run build

# Expose the port that the application will run on
EXPOSE 4173

# Start the application
CMD [ "npm", "start" ]
