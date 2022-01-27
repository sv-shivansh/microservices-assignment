FROM node:16.13.1-alpine

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY ./User/package.json ./
RUN npm install
# Copy app source code
COPY ./User/ ./
COPY ./utility/db.js ./db.js
COPY ./utility/auth.js ./auth.js

#Expose port and start application
EXPOSE 8080
CMD [ "npm", "start" ]