FROM node:16.13.1-alpine

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY ./Activity/package.json ./
RUN npm install
# Copy app source code
COPY ./Activity/ ./
COPY ./Book/models/book-content.js ./models/book-content.js
COPY ./User/models/user-model.js ./models/user-model.js
COPY ./utility/db.js ./db.js
COPY ./utility/auth.js ./auth.js

#Expose port and start application
EXPOSE 8000
CMD [ "npm", "start" ]