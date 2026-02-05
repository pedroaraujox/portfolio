# Use Node 20 alpine for smaller image size and security
FROM node:20-alpine

# Install dumb-init to handle PID 1 correctly
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the app (if needed for production serving, otherwise just for dev context)
RUN npm run build

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 5173

# Use dumb-init
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Default command
CMD ["npm", "run", "dev", "--", "--host"]
