# install node version 16 and alphine
FROM node:16-alpine3.13

# create group and user app
RUN addgroup app && adduser -S -G app app

# make the user to app
USER app

# membuat work directory
WORKDIR /app

# copy package json
COPY --chown=app:node package*.json .

# install 
RUN npm install --production

# copy file
COPY . .

# run application
CMD ["npm", "start"]
