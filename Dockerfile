FROM keymetrics/pm2:latest-alpine

# Bundle APP files
COPY dist dist/
COPY node_modules node_modules/
COPY package.json .

COPY pm2.json .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
ENV PORT 8065
ENV NODE_ENV production
# RUN npm install --production

# Show current folder structure in logs
RUN ls -al

EXPOSE 8064

CMD [ "pm2-runtime", "start", "pm2.json" ]