FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN NODE_OPTIONS="--max-old-space-size=3072" npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
